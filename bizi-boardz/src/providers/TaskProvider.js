import { createContext, useContext } from "react";
import { useState } from "react";
import useTaskUtils from "../backend/tasks/useTaskUtils";

const TaskContext = createContext();

const TaskProvider = (props) => {
    //const [tasks, setTasks] = useState();

    return <TaskContext.Provider value={useTaskUtils()}>
        {props.children}
    </TaskContext.Provider>
}

const useTaskContext = () => {
    return useContext(TaskContext);
}

export { useTaskContext };
export default TaskProvider;