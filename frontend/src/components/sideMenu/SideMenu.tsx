import "./sideMenu.css";

import addSectionIcon from "../../../public/sideMenu/addSection-icon.svg";
import TaskType from "../taskType/TaskType";
import { useEffect, useState } from "react";
import { useSectionContext } from "../../contexts/MainContext";

interface TaskSection {
   _id: string;
   name: string;
}

const SideMenu = () => {
   let isReady = true;
   const { activeSectionId, setActiveSectionId } = useSectionContext();
   const { isMenuOpen } = useSectionContext();
   const { userId } = useSectionContext();
   const [tasksSections, setTaskSections] = useState<TaskSection[]>([]);
   //TODO
   //LOADING SCREEN
   const [loading, setLoading] = useState<boolean>(false);

   const handleSectionChange = (id: string) => {
      setActiveSectionId(id);
   };

   useEffect(() => {
      setActiveSectionId(tasksSections[0]?._id);
   }, [tasksSections.length]);

   // Tasks sections fetching
   useEffect(() => {
      if (isReady) {
         //console.log("userId:", userId);

         if (!userId) return;

         const fetchTaskSections = async () => {
            setLoading(true);
            try {
               const response = await fetch(
                  `http://localhost:8000/taskSections/${userId}`
               );
               if (!response.ok) {
                  throw new Error(`Fetching error: ${response.statusText}`);
               }
               const data = await response.json();
               setTaskSections(data);
            } catch (error: any) {
               console.error(error.message);
            } finally {
               setLoading(false);
            }
         };

         fetchTaskSections();
      }

      isReady = !isReady;
   }, [userId]);

   // Tasks sections adding
   const addTaskType = async () => {
      if (userId.trim() === "") return;

      const newSection = {
         name: `new Section`,
         ownerId: userId,
      };

      try {
         const response = await fetch("http://localhost:8000/taskSections", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(newSection),
         });

         if (!response.ok) {
            throw new Error(`Adding error: ${response.statusText}`);
         }

         const data = await response.json();
         setTaskSections((prevSections) => [...prevSections, data]);
      } catch (error: any) {
         console.error(error.message);
      }
   };

   // Tasks sections removing
   const removeTaskSection = async (id: string) => {
      try {
         await fetch(`http://localhost:8000/taskSections/${id}`, {
            method: "DELETE",
         });
         const newSections = tasksSections.filter((el) => el._id !== id);
         setTaskSections(newSections);
      } catch (err) {
         console.error(err);
      }
   };

   // Tasks section updating
   const updateTaskSection = async (tSectionId: string, newName: string) => {
      try {
         const response = await fetch(
            `http://localhost:8000/taskSections/${tSectionId}`,
            {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ name: newName }),
            }
         );

         if (!response.ok) {
            throw new Error(`Updating error: ${response.statusText}`);
         }

         setTaskSections((prevSections) =>
            prevSections.map((section) =>
               section._id === tSectionId
                  ? { ...section, name: newName }
                  : section
            )
         );
      } catch (error: any) {
         console.error(error.message);
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
               <button className="sideMenu_addBtn" onClick={addTaskType}>
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
