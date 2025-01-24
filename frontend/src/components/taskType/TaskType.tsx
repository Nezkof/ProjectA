import "./taskType.css";

import deleteSectionIcon from "../../../public/sideMenu/deleteSection-icon.svg";
import selectSectionIcon from "../../../public/sideMenu/selectSection-icon.svg";
import { useEffect, useRef, useState } from "react";

interface TaskSectionProps {
   tSectionId: string;
   tSectionTitle: string;
   isTSectionActive: boolean;
   updateTSection: (tSectionId: string, newName: string) => void;
   removeTSection: (tSectionId: string) => void;
   changeTSection: (tSectionId: string) => void;
}

const TaskType: React.FC<TaskSectionProps> = ({
   tSectionId,
   tSectionTitle,
   isTSectionActive,
   updateTSection,
   removeTSection,
   changeTSection,
}) => {
   let isReady = false;
   const [sectionTitle, setSectionTitle] = useState(tSectionTitle);
   const [isTitleChanging, setTitleChanging] = useState(false);
   const titleSpanRef = useRef<HTMLSpanElement | null>(null);

   const validateTitleName = (): string => {
      if (!sectionTitle.trim()) setSectionTitle("name");
      return sectionTitle;
   };

   const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSectionTitle(event.target.value);
   };

   const handleTitleClick = (event: { target: any }) => {
      if (titleSpanRef.current?.contains(event.target)) setTitleChanging(true);
   };

   const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitleChanging(false);
      updateTSection(tSectionId, event.target.value);
   };

   useEffect(() => {
      if (isReady) {
         document.addEventListener("click", handleTitleClick);
      }

      isReady = true;
      return () => {
         document.removeEventListener("click", handleTitleClick);
      };
   }, []);

   return (
      <button
         className={` ${isTSectionActive ? "active" : ""} tSectionBtn`}
         onClick={() => changeTSection(tSectionId)}
      >
         <img src={selectSectionIcon} alt="select_section" />
         {isTitleChanging ? (
            <input
               className="tSectionBtn_titleInput"
               type="text"
               value={sectionTitle}
               onChange={handleTitleChange}
               onBlur={handleBlur}
               autoFocus
            />
         ) : (
            <span ref={titleSpanRef}>{validateTitleName()}</span>
         )}

         <img
            className="tSectionBtn_deleteIcon"
            src={deleteSectionIcon}
            alt="delete_section"
            onClick={() => removeTSection(tSectionId)}
         />
      </button>
   );
};

export default TaskType;
