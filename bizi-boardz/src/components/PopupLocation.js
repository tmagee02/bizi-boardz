import "../styles/PopupLocation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useTaskContext } from "../providers/TaskProvider";

import {
  faRightLeft,
  faXmark,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";

export default function PopupLocation({ 
  trigger,
  setTrigger,
  taskID,
  ogTaskName,
  ogAssignee,
  ogProgress,
  ogPriority,
  ogTaskLength,
  ogDescription,
  sprint
}) {

  const [taskLocation, setTaskLocation] = useState(sprint);
  const ignoreParentOnClick = (e) => e.stopPropagation();

  const { updateTask } = useTaskContext();

  const saveTaskChanges = async () => {
    console.log('updating task... ', sprint, 'to', taskLocation)
    const updateError = await updateTask({
      taskID: taskID,
      taskName: ogTaskName,
      assignee: ogAssignee,
      description: ogDescription,
      priority: ogPriority,
      length: ogTaskLength,
      currentProgress: ogProgress,
      sprintStatus: taskLocation,
      });

    setTrigger(false);
  }
  
  return trigger ? (
    <>
      <div className="popup-location" onClick={() => setTrigger(false)}>
        <div
          className="popup-location-inner"
          onClick={(e) => ignoreParentOnClick(e)}
        >
          <div className="popup-location-header">
            <div className="header-text">
              <FontAwesomeIcon
                icon={faRightLeft}
                style={{ height: "70% ", paddingRight: "8px" }}
              />
              Change Task Location
            </div>
            <button className="close-btn" onClick={() => setTrigger(false)}>
              <FontAwesomeIcon icon={faXmark} style={{ height: "100%" }} />
            </button>
          </div>
          <div className="popup-location-body">
            Please select the desired section for the selected task below.
            <div className="location-radios">
              <input
                type="radio"
                id="backlog"
                name="wanted-backlog-section"
                value="Backlog"
                onChange={() => setTaskLocation(0)}
                defaultChecked={sprint === 0}
                />
              <label for="backlog">Backlog</label>
              <input
                type="radio"
                id="this-sprint"
                name="wanted-backlog-section"
                value="This Sprint"
                onChange={() => setTaskLocation(1)}
                defaultChecked={sprint === 1}
                />
              <label for="this-sprint">This Sprint</label>
              <input
                type="radio"
                id="upcoming-sprint"
                name="wanted-backlog-section"
                value="Upcoming Sprint"
                onChange={() => setTaskLocation(2)}
                defaultChecked={sprint === 2}
                />
              <label for="upcoming-sprint">Upcoming Sprint</label>
            </div>
          </div>

          <div className="popup-location-footer">
            <button className="cancel-btn" onClick={() => setTrigger(false)}>
              Cancel
            </button>
            <button className="save-btn" onClick={() => saveTaskChanges()}>
              <FontAwesomeIcon
                icon={faFloppyDisk}
                style={{ height: "100%", paddingRight: "6px" }}
              />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  ) : (
    ""
  );
}
