import "../styles/TaskLine.css";
import PopupEditTask from "./PopupEditTask.js";
import PopupLocation from "./PopupLocation.js";
import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons";

export default function TaskLine({
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
  const [locationPopup, setLocationPopup] = useState(false);

  //stops whiteboard click from activating the Edit Task Popup
  const ignoreParentOnClick = (e) => {
    e.stopPropagation();
    setLocationPopup(true);
  };

  return (
    <>
      <div className="taskLine" onClick={() => setEditTaskPopup(true)}>
        <div className="taskLineMain">
          <div className="taskName">{taskName}</div>
        </div>
        <div className="taskLineBubbles">
          {decidePriority(priority)}
          <div className="bubbleTaskLength">{decideTaskLength(taskLength)}</div>
          <button
            className="bubbleLocation"
            onClick={(e) => ignoreParentOnClick(e)}
          >
            <FontAwesomeIcon icon={faRightLeft} />
          </button>
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
      <PopupLocation
        trigger={locationPopup}
        setTrigger={setLocationPopup}
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
  if (priority == 1) return <div className="bubblePriority priorityLow">!</div>;
  else if (priority == 2)
    return <div className="bubblePriority priorityModerate">! !</div>;
  else if (priority == 3)
    return <div className="bubblePriority priorityHigh">! ! !</div>;
  else return <div className="bubblePriority priorityNA">-</div>;
}

function decideTaskLength(taskLength) {
  if (isNaN(parseInt(taskLength))) return "-";
  else return taskLength;
}
