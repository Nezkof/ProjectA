import { useState } from "react";
import "./tasksList.css";
import addTaskIcon from "../../../public/tasksList/addTask.svg";
import Task from "../task/Task";

const TasksList = () => {
   const [tasks, setTasks] = useState<string[]>([]);

   const addTask = () => {
      const newTaskId = `task-${Date.now()}`;
      setTasks((prevTasks) => [...prevTasks, newTaskId]);
   };

   const renderTasks = () => tasks.map((taskId) => <Task key={taskId} />);

   return (
      <section className="tasks_container">
         {renderTasks()}
         <button className="tasks_createBtn" onClick={addTask}>
            New Task
            <img src={addTaskIcon} alt="addTask_icon" />
         </button>
      </section>
   );
};

export default TasksList;
