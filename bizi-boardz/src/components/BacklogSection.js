import "../styles/BacklogSection.css";
import TaskLine from "../components/TaskLine.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTaskContext } from "../providers/TaskProvider.js";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function BacklogSection({ sectionHeader = "<< INVALID >>" }) {
  const { tasks } = useTaskContext();

  const mapSprintNum = (sprintNumber) => {
    const sprintNames = {
      0 : "Backlog",
      1 : "This Sprint",
      2 : "Upcoming Sprint",
    };
      return sprintNames[sprintNumber] || "unknown";
  };
  return (
    <>
      <div className="sectionHeader">
        <FontAwesomeIcon icon={faChevronDown} style={{ paddingRight: "12px" }} />
        {sectionHeader}
      </div>
      <div className="sectionBody">
        {tasks &&
          tasks.map((task) => {
            const sprintName = mapSprintNum(task.sprint);
            if (sprintName === sectionHeader) {
              return (
                <TaskLine
                  key={task.taskID}
                  taskID={task.taskID}
                  taskName={task.name}
                  taskLength={task.length}
                  assignee={task.assignee}
                  priority={task.priority}
                  description={task.description}
                  currentProgress={task.currentProgress}
                  sprintStatus = {task.sprint}
                />
              );
            } else {
              return null;
            }
          })}
      </div>
    </>
  );  
}
