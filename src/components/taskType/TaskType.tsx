import "./taskType.css";

import deleteSectionIcon from "../../../public/sideMenu/deleteSection-icon.svg";
import selectSectionIcon from "../../../public/sideMenu/selectSection-icon.svg";
import { useEffect, useRef, useState } from "react";

const TaskType = () => {
   const [sectionTitle, setSectionTitle] = useState("name");
   const [isTitleChanging, setTitleChanging] = useState(false);
   const titleSpanRef = useRef<HTMLSpanElement | null>(null);
   const titleInputRef = useRef<HTMLInputElement | null>(null);

   const validateTitleName = () => {
      if (!sectionTitle.trim()) setSectionTitle("name");
      return sectionTitle;
   };

   const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSectionTitle(event.target.value);
   };

   const handleTitleClick = (event: { target: any }) => {
      if (titleSpanRef.current?.contains(event.target)) setTitleChanging(true);
      else if (!titleInputRef.current?.contains(event.target)) {
         validateTitleName();
         setTitleChanging(false);
      }
   };

   useEffect(() => {
      document.addEventListener("click", handleTitleClick);

      return () => {
         document.removeEventListener("click", handleTitleClick);
      };
   }, []);

   return (
      <button className="taskTypeBtn">
         <img src={selectSectionIcon} alt="select_section" />
         {isTitleChanging ? (
            <input
               ref={titleInputRef}
               className="taskTypeBtn_titleInput"
               type="text"
               value={sectionTitle}
               onChange={handleTitleChange}
               autoFocus
            />
         ) : (
            <span ref={titleSpanRef}>{validateTitleName()}</span>
         )}

         <img
            className="taskTypeBtn_deleteIcon"
            src={deleteSectionIcon}
            alt="delete_section"
         />
      </button>
   );
};

export default TaskType;
