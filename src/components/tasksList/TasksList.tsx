import { useState } from "react";
import "./tasksList.css";
import addTaskIcon from "../../../public/tasksList/addTask.svg";
import sideMenuBtn from "../../../public/tasksList/sideMenuButton-icon.svg";
import Task from "../task/Task";

const TasksList = ({
   isMenuOpen,
   openSideMenu,
}: {
   isMenuOpen: boolean;
   openSideMenu: () => void;
}) => {
   const [tasks, setTasks] = useState<string[]>([]);

   const addTask = () => {
      const newTaskId = `task-${Date.now()}`;
      setTasks((prevTasks) => [...prevTasks, newTaskId]);
   };

   const renderTasks = () => tasks.map((taskId) => <Task key={taskId} />);

   return (
      <section className="tasks_container">
         <div className="tasks_btnsContainer">
            <button className="tasks_createBtn" onClick={addTask}>
               New Task
               <img src={addTaskIcon} alt="addTask_icon" />
            </button>
            <button className=" tasks_sideMenuBtn" onClick={openSideMenu}>
               <img
                  className={`${isMenuOpen ? "sideMenu--open" : ""}`}
                  src={sideMenuBtn}
                  alt="sideMenuBtn_icon"
               />
            </button>
         </div>
         <div className="tasks_wrapper">{renderTasks()}</div>
      </section>
   );
};

export default TasksList;
