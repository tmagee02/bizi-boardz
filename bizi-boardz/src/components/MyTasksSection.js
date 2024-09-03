import "../styles/MyTasksSection.css";
import { useTaskContext } from "../providers/TaskProvider";

import { useAuthUtils } from "../backend/octokit/useAuthUtils.js";
import MyTaskLine from "./MyTaskLine";

export default function MyTasksSection({ sectionHeader = "<<EMPTY_HEADER>>" }) {
  let { userName } = useAuthUtils();
  const { tasks } = useTaskContext();
  return (
    <>
      <div className="my-tasks-section">
        <div className="my-tasks-section-header">{sectionHeader}</div>
        <div className="my-tasks-section-body">
          <ul>
            {
              //First = In Progress, In Sprint
              tasks.map((task) =>
                userName == task.assignee &&
                task.currentProgress === "In Progress" &&
                task.sprint === 1 ? (
                  <MyTaskLine
                    taskID={task.taskID}
                    taskName={task.name}
                    taskLength={task.length}
                    assignee={task.assignee}
                    priority={task.priority}
                    description={task.description}
                    currentProgress={task.currentProgress}
                    sprintStatus={task.sprint}
                  />
                ) : (
                  ""
                )
              )
            }
            {
              //Second = To Do,  In Sprint
              tasks.map((task) =>
                userName == task.assignee &&
                task.currentProgress === "To Do" &&
                task.sprint === 1 ? (
                  <MyTaskLine
                    taskID={task.taskID}
                    taskName={task.name}
                    taskLength={task.length}
                    assignee={task.assignee}
                    priority={task.priority}
                    description={task.description}
                    currentProgress={task.currentProgress}
                    sprintStatus={task.sprint}
                  />
                ) : (
                  ""
                )
              )
            }
            {
              //Third = In Progress, Not In Sprint
              tasks.map((task) =>
                userName == task.assignee &&
                task.currentProgress === "In Progress" &&
                task.sprint != 1 ? (
                  <MyTaskLine
                    taskID={task.taskID}
                    taskName={task.name}
                    taskLength={task.length}
                    assignee={task.assignee}
                    priority={task.priority}
                    description={task.description}
                    currentProgress={task.currentProgress}
                    sprintStatus={task.sprint}
                  />
                ) : (
                  ""
                )
              )
            }
            {
              //Fourth = To Do, Not In Sprint
              tasks.map((task) =>
                userName == task.assignee &&
                task.currentProgress === "To Do" &&
                task.sprint != 1 ? (
                  <MyTaskLine
                    taskID={task.taskID}
                    taskName={task.name}
                    taskLength={task.length}
                    assignee={task.assignee}
                    priority={task.priority}
                    description={task.description}
                    currentProgress={task.currentProgress}
                    sprintStatus={task.sprint}
                  />
                ) : (
                  ""
                )
              )
            }
            {
              //Fifth = Done Tasks
              tasks.map((task) =>
                userName == task.assignee && task.currentProgress === "Done" ? (
                  <MyTaskLine
                    taskID={task.taskID}
                    taskName={task.name}
                    taskLength={task.length}
                    assignee={task.assignee}
                    priority={task.priority}
                    description={task.description}
                    currentProgress={task.currentProgress}
                    sprintStatus={task.sprint}
                  />
                ) : (
                  ""
                )
              )
            }
          </ul>
        </div>
      </div>
    </>
  );
}
