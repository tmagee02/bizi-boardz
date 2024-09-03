import "../styles/MyTaskLine.css";
import PopupEditTask from "./PopupEditTask.js";

import { useState } from "react";

export default function MyTaskLine({
  taskID,
  taskName,
  assignee,
  priority,
  taskLength,
  description,
  currentProgress,
  sprintStatus,
}) {
  const [editTaskPopup, setEditTaskPopup] = useState(false);
  const sprintToString = {
    0: "Backlog",

    1: "This Sprint",
    2: "Upcoming Sprint",
  };
  return (
    <>
      <div className="myTaskLine" onClick={() => setEditTaskPopup(true)}>
        <div className="myTaskLineMain">
          <div className="myTaskName">{taskName}</div>
          <div className="isInSprint">{sprintToString[sprintStatus]}</div>
          <div className="isInProgress">{currentProgress}</div>
        </div>

        <div className="myTaskLineBubbles">
          {decidePriority(priority)}
          <div className="bubbleMyTaskLength">
            {decideTaskLength(taskLength)}
          </div>
        </div>
      </div>
      <PopupEditTask
        trigger={editTaskPopup}
        setTrigger={setEditTaskPopup}
        taskID={taskID}
        ogTaskName={taskName}
        ogAssignee={assignee}
        ogPriority={priority}
        ogTaskLength={taskLength}
        ogProgress={currentProgress}
        ogDescription={description}
        sprint={sprintStatus}
      />
    </>
  );
}

function decidePriority(priority) {
  console.log(priority);
  if (priority == 1)
    return <div className="bubbleMyPriority priorityLow">!</div>;
  else if (priority == 2)
    return <div className="bubbleMyPriority priorityModerate">! !</div>;
  else if (priority == 3)
    return <div className="bubbleMyPriority priorityHigh">! ! !</div>;
  else return <div className="bubbleMyPriority priorityNA">-</div>;
}

function decideTaskLength(taskLength) {
  if (isNaN(parseInt(taskLength))) return "-";
  else return taskLength;
}
