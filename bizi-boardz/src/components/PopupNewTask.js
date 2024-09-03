import "../styles/PopupNewTask.css";
import PopupDeleteTask from "./PopupDeleteTask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBullseye } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { React } from "react";
import { useTaskContext } from "../providers/TaskProvider";
import useTaskUtils from "../backend/tasks/useTaskUtils";

//trigger decides if the popup is visible
//setTrigger takes in setEditTaskPopup from TaskCard.js, which changes the trigger variable
export default function PopupNewTask({ trigger, setTrigger }) {
  const { createTask, getRepoUsers } = useTaskContext();
  const [taskName, setTaskName] = useState("");
  const [assignee, setAssignee] = useState("");
  const [description, setDescription] = useState("");
  const [currentProgress, setCurrentProgress] = useState("To Do");
  const [priority, setPriority] = useState("-");
  const [length, setLength] = useState("-");
  const [taskCreateError, setTaskCreateError] = useState(false); // Can use this to show some type of error div if backend returns error
  const [repoUsers, setRepoUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getRepoUsers();
        setRepoUsers(users);
      } catch (error) {
        console.error("Error fetching repo users:", error);
      }
    };

    fetchData();
  }, []);

  const createTaskHandler = async () => {
    //closes popup; at start so there is no delay when closing
    setTrigger(false);
    // Backend returns true if create success
    console.log("component calling create task with name", taskName);
    const createSuccess = await createTask({
      taskName: taskName,
      assignee: assignee,
      description: description,
      priority: priority,
      length: length,
      currentProgress: currentProgress,
    });
    setTaskCreateError(!createSuccess);
  };

  //sets up options for progress dropdown
  const progressValues = ["To Do", "In Progress", "Done"];
  const progressOptions = progressValues.map((value) => (
    <option>{value}</option>
  ));

  //sets up options for priority dropdown
  const priorityValues = ["-", 1, 2, 3];
  const priorityOptions = priorityValues.map((value) => (
    <option>{value}</option>
  ));

  //sets up options for task length dropdown
  const lengthValues = [
    "-",
    0.5,
    1,
    1.5,
    2,
    2.5,
    3,
    3.5,
    4,
    4.5,
    5,
    5.5,
    6,
    6.5,
    7,
    7.5,
    8,
    8.5,
    9,
    9.5,
    10,
  ];
  const lengthOptions = lengthValues.map((value, idx) => (
    <option key={idx}>{value}</option>
  ));

  //stops inner popup click from closing the popup
  const ignoreParentOnClick = (e) => e.stopPropagation();

  return trigger ? (
    <>
      <div className="new-popup" onClick={() => setTrigger(false)}>
        <div
          className="new-popup-inner"
          onClick={(e) => ignoreParentOnClick(e)}
        >
          <div className="new-popup-header">
            Create New Task
            <button className="close-btn" onClick={() => setTrigger(false)}>
              <FontAwesomeIcon icon={faXmark} style={{ height: "100%" }} />
            </button>
          </div>
          <div className="new-popup-body">
            <div className="new-task-name-section">
              Task Name:
              <input
                type="text"
                onChange={(e) => {
                  setTaskName(e.target.value);
                }}
              ></input>
            </div>
            <div className="new-assignee-section">
              Assignee:
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                <option value="">-</option>
                {repoUsers.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>
            <div className="dropdowns-row">
              <div className="progress-section">
                Current Progress:
                <select
                  onChange={(e) => {
                    setCurrentProgress(e.target.value);
                  }}
                >
                  {progressOptions}
                </select>
              </div>
              <div className="new-priority-section">
                Priority:
                <select
                  onChange={(e) => {
                    setPriority(e.target.value);
                  }}
                >
                  {priorityOptions}
                </select>
              </div>
              <div className="new-task-length-section">
                Task Length:
                <select
                  onChange={(e) => {
                    setLength(e.target.value);
                  }}
                >
                  {lengthOptions}
                </select>
              </div>
            </div>
            <div className="new-description-section">
              Description:<br></br>
              <textarea
                rows="3"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></textarea>
            </div>
          </div>
          <div className="new-popup-footer">
            <button className="create-btn" onClick={createTaskHandler}>
              <FontAwesomeIcon
                icon={faBullseye}
                style={{ height: "100%", paddingRight: "6px" }}
              />
              Create Task
            </button>
          </div>
        </div>
      </div>
    </>
  ) : (
    ""
  );
}
