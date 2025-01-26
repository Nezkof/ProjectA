import "./sideMenu.css";

import addSectionIcon from "/sideMenu/addSection-icon.svg";
import TaskType from "../taskType/TaskType";
import { useEffect, useState } from "react";
import { useSectionContext } from "../../contexts/MainContext";

interface TaskSection {
   _id: string;
   name: string;
}

const SideMenu = () => {
   const { activeSectionId, setActiveSectionId, isMenuOpen, userId } =
      useSectionContext();
   const [tasksSections, setTaskSections] = useState<TaskSection[]>([]);

   const highlightLoginButton = () => {
      const loginButton = document.getElementById("profileButton");
      loginButton?.classList.toggle("highlight");

      setTimeout(() => loginButton?.classList.toggle("highlight"), 300);
   };

   const handleSectionChange = (id: string) => {
      setActiveSectionId(id);
   };

   useEffect(() => {
      setActiveSectionId(tasksSections[0]?._id);
   }, [tasksSections.length]);

   const fetchData = async (url: string, options: RequestInit = {}) => {
      try {
         const response = await fetch(`http://localhost:8000${url}`, options);
         if (!response.ok)
            throw new Error(`Fetching error: ${response.statusText}`);
         return await response.json();
      } catch (error: any) {
         console.error(error.message);
      }
   };

   // Tasks sections fetching
   useEffect(() => {
      if (!userId) return;

      fetchData(`/taskSections/${userId}`).then((data) => {
         setTaskSections(data);
      });
   }, [userId, activeSectionId]);

   // Tasks sections adding
   const createTaskSection = async () => {
      if (!userId) {
         highlightLoginButton();
         return;
      }

      const newSection = {
         name: `new Section`,
         ownerId: userId,
      };

      const data = await fetchData("/taskSections", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(newSection),
      });
      setTaskSections((prevSections) => [...prevSections, data]);
   };

   // Tasks sections removing
   const removeTaskSection = async (id: string) => {
      try {
         await fetch(`http://localhost:8000/taskSections/${id}`, {
            method: "DELETE",
         });
         setTaskSections((prevSections) =>
            prevSections.filter((section) => section._id !== id)
         );
      } catch (err) {
         console.error(err);
      }
   };

   // Tasks section updating
   const updateTaskSection = async (tSectionId: string, newName: string) => {
      const data = await fetchData(`/taskSections/${tSectionId}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ name: newName }),
      });
      if (data) {
         setTaskSections((prevSections) =>
            prevSections.map((section) =>
               section._id === tSectionId
                  ? { ...section, name: newName }
                  : section
            )
         );
      }
   };

   // Tasks sections rendering
   const renderTasksTypes = () =>
      tasksSections.map((tSection) => (
         <TaskType
            key={tSection._id}
            tSectionId={tSection._id}
            tSectionTitle={tSection.name}
            isTSectionActive={tSection._id === activeSectionId ? true : false}
            updateTSection={updateTaskSection}
            removeTSection={removeTaskSection}
            changeTSection={handleSectionChange}
         />
      ));

   return (
      <>
         {isMenuOpen ? (
            <aside className="sideMenu_container" id="sideMenu">
               <button className="sideMenu_addBtn" onClick={createTaskSection}>
                  <img src={addSectionIcon} alt="add_section" />
                  Add
               </button>
               <div className="sideMenu_wrapper">{renderTasksTypes()}</div>
            </aside>
         ) : null}
      </>
   );
};

export default SideMenu;
