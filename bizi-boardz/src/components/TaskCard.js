import "../styles/TaskCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardUser } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import PopupEditTask from "./PopupEditTask";
import React from "react";
import PopupWhiteboard from "./PopupWhiteboard";
import { take } from "lodash";
import { useDrag } from "react-dnd";
import { getEmptyImage } from 'react-dnd-html5-backend'

//display task name, assignee, story/task, priority (!, !!, !!!), length
export default function TaskCard({
  key,
  taskID,
  taskName,
  assignee,
  priority,
  taskLength,
  description,
  currentProgress,
  sprintStatus
}) {
  const [editTaskPopup, setEditTaskPopup] = useState(false);
  const [whiteboardPopup, setWhiteboardPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  //stops whiteboard click from activating the Edit Task Popup
  const ignoreParentOnClick = (e) => {
    e.stopPropagation();
    setWhiteboardPopup(true);
  };


  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  //Drag and drop functionality
  const [{ isDragging }, drag, preview] = useDrag({
    type: "task-card",
    item: { 
      taskID,
      taskName,
      assignee,
      priority,
      taskLength,
      description,
      currentProgress,
      sprintStatus 
    },
    end: (item, monitor) => {
      if (!monitor.getDropResult()) { return; }
      setIsVisible(false);
      const getResult = async () => {
        let { updateSuccess } = monitor.getDropResult();
        updateSuccess = await updateSuccess;
        if (!updateSuccess){
          setIsVisible(true); //Reset visible in update failure
        }
      }
     getResult();
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });


  //console.log({ taskName, taskLength });
  if(!isVisible){
    return null;
  }
  return (
    <>
      <div className="taskCard" onClick={() => setEditTaskPopup(true)} ref={drag} style={{
        opacity: isDragging ? "0.5" : "1",
      }}>
        <div className="taskCardHeader">
          <div className="taskName">{taskName}</div>
          <div className="assignee">{assignee}</div>
        </div>
        <div className="taskCardFooter">
          <button
            className="bubbleWhiteboard"
            onClick={(e) => ignoreParentOnClick(e)}
          >
            <FontAwesomeIcon icon={faChalkboardUser} />
          </button>
          <div className="EMPTY_DIV_ON_PURPOSE"></div>
          {decidePriority(priority)}
          <div className="bubbleTaskLength">{decideTaskLength(taskLength)}</div>
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
      <PopupWhiteboard
        trigger={whiteboardPopup}
        setTrigger={setWhiteboardPopup}
        taskName={taskName}
        taskID={taskID}
      />
    </>
  );
}

function decidePriority(priority) {
  if (priority === "1")
    return <div className="bubblePriority priorityLow">!</div>;
  else if (priority === "2")
    return <div className="bubblePriority priorityModerate">! !</div>;
  else if (priority === "3")
    return <div className="bubblePriority priorityHigh">! ! !</div>;
  else return <div className="bubblePriority priorityNA">-</div>;
}

function decideTaskLength(taskLength) {
  //console.log(parseInt(taskLength));
  //console.log(typeof parseInt(taskLength));
  if (isNaN(parseInt(taskLength))) return "-";
  else return taskLength;
}
