import { useState, useEffect, useRef } from "react";
import "./task.css";

export interface TaskI {
   _id: string;
   name: string;
   isCompleted: boolean;
   priority: number;
   dueDate: string;
}

interface TaskProps {
   _id: string;
   _name: string;
   _dueDate: string;
   _priority: number;
   _isCompleted: boolean;
   _deleteTask: (taskId: string) => void;
   _updateTask: (taskId: string, updatedData: any) => void;
}

const Task: React.FC<TaskProps> = ({
   _id,
   _name,
   _dueDate,
   _priority,
   _isCompleted,
   _deleteTask,
   _updateTask,
}) => {
   let isReady = false;

   const priorities = ["Green", "Yellow", "Red"];

   const [isCompleted, setIsCompleted] = useState(_isCompleted);
   const [name, setName] = useState(_name);
   const [taskPriority, setTaskPriority] = useState(_priority);
   const [date, setDate] = useState("0000-00-00");
   const [time, setTime] = useState("00:00");

   const nameRef = useRef<HTMLHeadingElement | null>(null);
   const [isNameEditing, setIsNameEditing] = useState(false);
   const menuRef = useRef<HTMLDivElement | null>(null);
   const [isPriorityMenuOpen, setIsPriorMenuOpen] = useState(false);
   const dateSpanRef = useRef<HTMLSpanElement | null>(null);
   const [isDateEditing, setIsDateEditing] = useState(false);
   const timeSpanRef = useRef<HTMLSpanElement | null>(null);
   const [isTimeEditing, setIsTimeEditing] = useState(false);

   useEffect(() => {
      if (isReady) {
         setDate(fromDateToString(_dueDate));
         setTime(fromTimeToString(_dueDate));

         document.addEventListener("click", handleNameClick);
         document.addEventListener("click", handlePriorityMenuBlur);
         document.addEventListener("click", handleDateClick);
         document.addEventListener("click", handleTimeClick);
      }

      isReady = true;
      return () => {
         document.removeEventListener("click", handleNameClick);
         document.removeEventListener("click", handlePriorityMenuBlur);
         document.removeEventListener("click", handleDateClick);
         document.removeEventListener("click", handleTimeClick);
      };
   }, []);

   const fromDateToString = (isoDate: string): string => {
      const [datePart, timePart] = isoDate.split("T");
      const [year, month, day] = datePart.split("-").map(String);
      return `${day}.${month}.${year}`;
   };

   const fromTimeToString = (isoDate: string): string => {
      const [datePart, timePart] = isoDate.split("T");
      const [hours, minutes] = timePart.split(":").map(String);
      return `${hours}:${minutes}`;
   };

   const convertToISODate = (): string => {
      const [year, month, day] = date.split("-").map(Number);
      const [hours, minutes] = time.split(":").map(Number);
      const isoDate = `${year}-${month}-${day}T${hours}:${minutes}`;
      return isoDate;
   };

   const pushUpdatedInfo = (updates: Partial<TaskI>) => {
      const updatedData: any = {
         ...(updates.name && { name: updates.name }),
         ...(updates.isCompleted !== undefined && {
            isCompleted: updates.isCompleted,
         }),
         ...(updates.priority !== undefined && { priority: updates.priority }),
         ...(updates.dueDate && { dueDate: updates.dueDate }),
      };

      if (Object.keys(updatedData).length === 0) {
         console.log("No updates provided");
         return;
      }

      _updateTask(_id, updatedData);
   };

   const makeCompleted = () => {
      setIsCompleted(!isCompleted);
      pushUpdatedInfo({ isCompleted: !isCompleted });
   };

   const handleNameClick = (event: { target: any }) => {
      if (nameRef.current?.contains(event.target)) setIsNameEditing(true);
   };

   const handleNameBlur = () => {
      setIsNameEditing(false);
      pushUpdatedInfo({ name: name });
   };

   const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
   };

   const handlePriorityMenuClick = () => {
      setIsPriorMenuOpen((prev) => !prev);
   };

   const handlePriorityMenuBlur = (event: { target: any }) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
         setIsPriorMenuOpen(false);
   };

   const handlePrioritySelection = (priority: string) => {
      setTaskPriority(priorities.indexOf(priority));
      pushUpdatedInfo({ priority: priorities.indexOf(priority) });
   };

   const renderPriorityButtons = () =>
      priorities.map((priority) => (
         <button
            key={priority}
            type="button"
            onClick={() => handlePrioritySelection(priority)}
            className={`${
               isPriorityMenuOpen ? "" : "hidden"
            } task_button task_priority${priority}`}
         ></button>
      ));

   const handleDateClick = (event: { target: any }) => {
      if (dateSpanRef.current?.contains(event.target)) setIsDateEditing(true);
   };

   const handleDateBlur = () => {
      setIsDateEditing(false);
      pushUpdatedInfo({ dueDate: convertToISODate() });
   };

   const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setDate(event.target.value);
   };

   const formatDate = (date: string) => {
      return date.split("-").reverse().join(".");
   };

   const handleTimeClick = (event: { target: any }) => {
      if (timeSpanRef.current?.contains(event.target)) setIsTimeEditing(true);
   };

   const handleTimeBlur = () => {
      setIsTimeEditing(false);
      pushUpdatedInfo({ dueDate: convertToISODate() });
   };

   const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTime(event.target.value);
   };

   return (
      <section className="task_container">
         <div className="task_leftSide">
            <input
               className="task_checkbox"
               type="checkbox"
               onChange={makeCompleted}
               checked={isCompleted}
            />
            {isNameEditing ? (
               <input
                  className="task_input"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  autoFocus
               />
            ) : (
               <h2
                  ref={nameRef}
                  className={`${isCompleted ? "task_done" : ""} task_title`}
               >
                  {name}
               </h2>
            )}
         </div>

         <div className="task_rightSide">
            <div className="task_prioritySelection" ref={menuRef}>
               {renderPriorityButtons()}
               <button
                  type="button"
                  onClick={handlePriorityMenuClick}
                  className={`${
                     isCompleted ? "task_done" : ""
                  } task_button task_priority${priorities[taskPriority]}`}
               ></button>
            </div>
            <div className={`${isCompleted ? "task_done" : ""} task_date`}>
               {isDateEditing ? (
                  <input
                     className="task_input"
                     type="date"
                     value={date}
                     onChange={handleDateChange}
                     onClick={handleDateClick}
                     onBlur={handleDateBlur}
                     autoFocus
                  />
               ) : (
                  <span className="task_dateTimeSpan" ref={dateSpanRef}>
                     {formatDate(date)}
                  </span>
               )}

               <span>|</span>

               {isTimeEditing ? (
                  <input
                     className="task_input"
                     type="time"
                     value={time}
                     onChange={handleTimeChange}
                     onBlur={handleTimeBlur}
                     autoFocus
                  />
               ) : (
                  <span className="task_dateTimeSpan" ref={timeSpanRef}>
                     {time}
                  </span>
               )}
            </div>
            <button
               type="button"
               className="task_button task_deleteBtn"
               onClick={() => _deleteTask(_id)}
            ></button>
         </div>
      </section>
   );
};

export default Task;
