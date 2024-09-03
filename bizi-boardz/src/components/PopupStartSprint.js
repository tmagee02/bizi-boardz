import React, { useEffect , useState} from 'react';
import "../styles/PopupStartSprint.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import useTaskUtils from "../backend/tasks/useTaskUtils";
import { useTaskContext } from "../providers/TaskProvider";
export default function PopupLocation({ trigger, setTrigger }) {
  
  const [sprintTasks, setSprintTasks] = useState([])
  const [newSprintTasks, setNewSprintTasks] = useState([])

  const { initSprint } = useTaskContext();
 
  const initSprintHandler = async (sprint, newSprint) => {
    await initSprint(sprint, newSprint)
  }

  const mapSprintNum = (sprintNumber) => {
    const sprintNames = {
      0 : "Backlog",
      1 : "This Sprint",
      2 : "Upcoming Sprint",
    };
      return sprintNames[sprintNumber] || "unknown";
  };

  const { tasks } = useTaskContext()
  const ignoreParentOnClick = (e) => e.stopPropagation();

  useEffect(() => {
  
    let updatedSprintTasks = [];
    let updatedNewSprintTasks = [];
  
    tasks.forEach(task => {
      const sprintName = mapSprintNum(task.sprint);
  
      if (sprintName === "This Sprint") {
        updatedSprintTasks.push(task);
      } else if (sprintName === "Upcoming Sprint") {
        updatedNewSprintTasks.push(task);
      }
    });
    setSprintTasks(updatedSprintTasks);
    setNewSprintTasks(updatedNewSprintTasks);
  }, [tasks]);
  
  return trigger ? (
    
    <>
      <div className="popup-start-sprint" onClick={() => setTrigger(false)}>
        <div
          className="popup-start-sprint-inner"
          onClick={(e) => ignoreParentOnClick(e)}
        >
          <div className="popup-start-sprint-header">
            <div className="header-text">Start A New Sprint?</div>
            <button className="close-btn" onClick={() => setTrigger(false)}>
              <FontAwesomeIcon icon={faXmark} style={{ height: "100%" }} />
            </button>
          </div>
          <div className="popup-start-sprint-body">
            Are you sure you want to start a new sprint? <br />
            <span style={{ marginTop: "8px" }}>
              Doing so will delete all tasks in the current sprint and move
              tasks from the upcoming sprint to the current sprint.
            </span>
          </div>

          <div className="popup-start-sprint-footer">
            <button className="cancel-btn" onClick={() => setTrigger(false)}>
              Cancel
            </button>
            <button className="start-sprint-btn" onClick = {() => initSprintHandler(sprintTasks, newSprintTasks)}>
              <FontAwesomeIcon
                icon={faPersonRunning}
                style={{ height: "100%", paddingRight: "6px" }}
              />
              Start Sprint
            </button>
          </div>
        </div>
      </div>
    </>
  ) : (
    ""
  );
}
