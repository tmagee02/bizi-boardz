import { Octokit } from "@octokit/core";
import { useEffect, useState } from "react";
import { useAuthUtils } from "../octokit/useAuthUtils";
import getFileContent from "./getFileContent"
import createOrUpdateFile from "./createOrUpdateFile";
import { v4 as uuidv4 } from 'uuid'

/**
 * Custom hook utility for task functions
 * 
 * @returns 
 */
const useTaskUtils = () => {
    const { pat, activeRepo, isAuthenticated } = useAuthUtils();
    const parts = activeRepo.replace(/\/$/, '').split('/');
    const repoName = parts[parts.length - 1];
    const userName = parts[parts.length - 2];
    const [tasks, setTasks] = useState([]);
    const [syncing, setSyncing] = useState(false);

    const getRepoUsers = async () => {
        const octokit = new Octokit({ auth: pat })
        const users = await octokit.request(`GET /repos/${userName}/${repoName}/collaborators`)
        const loginValues = users.data.map(user => user.login);
        return loginValues;
    }

    /**
     * Creates file task.JSON in repository
     * If request returns error 422, task.JSON already exists
     * @param {*} path should be = "task.JSON"
     * @returns [taskData[], sha]
     */
    const createTaskJSONFile = async (path) => {
        const initialContent = [];
        try {
            console.log("create task.json trying to create task.json");
            const fileSHA = await createOrUpdateFile(pat, userName, repoName, path, btoa(JSON.stringify(initialContent)), "System created task.JSON");
            console.warn("task.JSON not found in the project repo, created file!");
            return [initialContent, fileSHA];
        } catch (error) {
            // Sha was not supplied: task.JSON was created by someone else before we resolved.
            if (error.response && error.response.status === 422) {
                console.warn("task.JSON did not exist in the initial call, but now does! Returning data...");
                return await getFileContent(pat, userName, repoName, path);
            } else {
                // Throw error if status != 422 (in any case besides task.JSON created before resolving)
                throw error;
            }
        }
    };

    /**
     * ! Only to be used to manage internal state, components should use "tasks" state value
     * Returns data from task.JSON and sha of task.JSON; sets task state to response if file exists
     * If file does not exist, creates task.JSON and returns [[], sha]
     * @returns [taskData[], sha] of task.JSON
     */
    const getTasks = async () => {
        const path = "task.JSON";

        try {
            // Try to get tasks from task.JSON
            const [taskData, fileSHA] = await getFileContent(pat, userName, repoName, path);

            return [taskData, fileSHA];
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Task.JSON was not found in the project repo, create file
                console.log("Get tasks calling create task.json");
                return await createTaskJSONFile(path);
            } else {
                // Throw error if status != 404 (in any case besides task.JSON not found)
                throw error;
            }
        }
    }

    // Load task data on component mount, (set state so ViewBacklog page can render)
    useEffect(() => {
        //TODO: check if authenticated first because useEffect will run on login screen
        if (!isAuthenticated) { return; }
        console.log("Use effect calling get tasks");

        const fetchAndUpdateTasks = () => {
            getTasks()
                .then(([taskData]) => {
                    if (!syncing) { //To prevent timer update from over-writing a user's manual sync with a cached response
                        setTasks(taskData);
                    }
                })
                .catch((error) => {
                    console.log(pat)
                    console.log("Useeffect failed to get tasks")
                });
        }

        const updateTimer = setInterval(() => {
            if (!syncing) {
                fetchAndUpdateTasks();
            }
        }, 1000);
        fetchAndUpdateTasks();

        return () => {
            clearInterval(updateTimer);
        }

    }, [pat, activeRepo, userName, isAuthenticated, syncing]);


    /**
     * Attempts to push newTaskState to GitHub, sets task state if successful
     * @param {*} newTaskState must be formed from a previous call to getTasks()! If task_JSON_sha is not most recent value
     *                          in GitHub, sync will fail to prevent data overwrite and return false
     * @param {*} syncMessage commit message 
     * @returns true if sync successful, false if otherwise (task.JSON maybe modified in time between get and sync)
     */
    const [timer, setTimer] = useState();
    const syncTasks = async (newTaskState, task_JSON_sha, syncMessage = `System synced tasks from user ${userName}`) => {
        const path = "task.JSON";
        // Push newTaskState to github
        try {
            console.log("Sync tasks calling create...");
            setTasks(newTaskState);
            await createOrUpdateFile(pat, userName, repoName, path, btoa(JSON.stringify(newTaskState, null, 2)), syncMessage, task_JSON_sha);

            // Successful sync, set task state
            let t = setTimeout(() => {
                setSyncing(false);
            }, 1500) 
            setTimer(t);
            return true;
        } catch (error) {
            console.log(error);
            setSyncing(false);
            // Sync failed, file sha may have changed
            setTasks(tasks);
            return false;
        }
    }

    /**
     * Creates a new task by retrieving up-to-date file from github, 
     * appending new task, and calling syncTask with new state
     * 
     * @returns true if task creation successful, false if otherwise
     */
    const createTask = async ({ taskName, assignee, description, priority, length, currentProgress }) => {
        if(timer){
            clearTimeout(timer);
        }
        setSyncing(true);
        const [existingTasks, fileSHA] = await getTasks() // Must pull most recent changes first
            .catch((error) => {
                setSyncing(false);
                console.log("Create task failed to get current tasks!", error);
                return false
            });

        const UUID = uuidv4()
        const newTaskData = {
            "taskID": UUID,
            "name": taskName,
            "assignee": assignee,
            "description": description,
            "priority": priority,
            "length": length,
            "currentProgress": currentProgress,
            "sprint": 0,
        }
        const newTaskState = [...existingTasks, newTaskData];
        return await syncTasks(newTaskState, fileSHA, `System pushed new task ${taskName} from user ${userName}`);
    }

    const updateTask = async ({ taskID, taskName, assignee, description, priority, length, currentProgress, sprintStatus }) => {
        // get current tasks array
        if(timer){
            clearTimeout(timer);
        }
        setSyncing(true);
        const [existingTasks, fileSHA] = await getTasks()
            .catch((error) => {
                setSyncing(false);
                console.log("Update task failed to get current tasks!", error);
                return false
            });

        // filter out old task create new array 
        const updatedTasks = existingTasks.filter(task => task.taskID !== taskID);

        const newTaskData = {
            "taskID": taskID,
            "name": taskName,
            "assignee": assignee,
            "description": description,
            "priority": priority,
            "length": length,
            "currentProgress": currentProgress,
            "sprint": sprintStatus
        }

        const newTaskState = [...updatedTasks, newTaskData];
        console.log("Update task calling sync task with sha", fileSHA);
        return await syncTasks(newTaskState, fileSHA, `System pushed updated task ${taskName} from user ${userName}`);
    }
    
    const delTask = async (taskUUID) => {
        if(timer){
            clearTimeout(timer);
        }
        setSyncing(true);
        console.log('deleting task ', taskUUID)
        const [existingTasks, fileSHA] = await getTasks()
            .catch((error) => {
                setSyncing(false);
                console.log("Delete task failed to get current tasks!", error);
                return false
            });

        // getTasks gets all tasks so filter out task with the uuid
        const updatedTasks = existingTasks.filter(task => task.taskID !== taskUUID);

        // check if length is the same
        if (updatedTasks.length === existingTasks.length) {
            console.log('Task not found')
            return false;
        }
        return await syncTasks(updatedTasks, fileSHA, `System removed task with UUID ${taskUUID} by user ${userName}`);
    }

    const initSprint = async (currentSprintTasks , upcomingSprintTasks) => {
        if(currentSprintTasks.length == 0 && upcomingSprintTasks.length == 0){
            console.log('nothing ')
            return 
        }
        const [existingTasks, fileSHA] = await getTasks()
            .catch((error) => {
                setSyncing(false);
                console.log("Delete task failed to get current tasks!", error);
                return false
            });
           
            // remove current sprint tasks
            let filteredTasks = existingTasks.filter(
                existingTask => !currentSprintTasks.some(task => task.taskID === existingTask.taskID)
            );

            let iter = 0

            // change upcoming sprint to this sprint
            filteredTasks.forEach(task => {
                for (let iter = 0; iter < upcomingSprintTasks.length; iter++) {
                    if (task.taskID == upcomingSprintTasks[iter].taskID) {
                        task.sprint = 1;
                        break; // Break the loop once the task is found and updated
                    }
                }
            });
            
            return await syncTasks(filteredTasks, fileSHA, 'System created sprint')
        
        
    }
    return { createTask, delTask, updateTask, getRepoUsers, initSprint, tasks };



}

export default useTaskUtils;