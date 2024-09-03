import "../backend/tasks/useTaskUtils.js";
import { useTaskContext } from "../providers/TaskProvider";
import { useAuthUtils } from "../backend/octokit/useAuthUtils.js";
import MyTasksSection from "../components/MyTasksSection.js";
import "../styles/MyTasks.css";

export default function MyTasks() {
  const { tasks } = useTaskContext();
  const { activeRepo } = useAuthUtils();
  tasks.map((task) => console.log(task.name));
  return (
    <>
      <div className="pageMyTasks">
        <div className="headerMyTasks">{activeRepo}</div>
        <div className="bodyMyTasks">
          
          <MyTasksSection sectionHeader="My Tasks" />
        </div>
      </div>
    </>
  );
}
