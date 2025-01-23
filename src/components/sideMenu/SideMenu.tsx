import "./sideMenu.css";

import addSectionIcon from "../../../public/sideMenu/addSection-icon.svg";
import TaskType from "../taskType/TaskType";
import { useState } from "react";

const SideMenu = () => {
   const [tasksSections, setTaskSections] = useState<string[]>([]);

   const addTaskType = () => {
      const newTaskTypeID = `taskType-${Date.now()}`;
      setTaskSections((prevTaskTypes) => [...prevTaskTypes, newTaskTypeID]);
   };

   const renderTasksTypes = () =>
      tasksSections.map((taskId) => <TaskType key={taskId} />);

   return (
      <aside className="sideMenuContainer">
         {renderTasksTypes()}
         <button className="sideMenu_addBtn" onClick={addTaskType}>
            <img src={addSectionIcon} alt="add_section" />
            Add
         </button>
      </aside>
   );
};

export default SideMenu;
