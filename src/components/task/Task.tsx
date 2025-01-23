import { useState, useEffect, useRef } from "react";
import "./task.css";

const Task = () => {
   const [isPriorityMenuOpen, setPriorityMenuOpen] = useState(false);
   const [isDone, setIsDone] = useState(false);
   const [taskPriority, setTaskPriority] = useState("Null");

   const [date, setDate] = useState("0000-00-00");
   const [time, setTime] = useState("00:00");
   const [isDateEditing, setIsDateEditing] = useState(false);
   const [isTimeEditing, setIsTimeEditing] = useState(false);

   const priorities = ["Green", "Yellow", "Red"];

   const menuRef = useRef<HTMLDivElement | null>(null);
   const dateSpanRef = useRef<HTMLSpanElement | null>(null);
   const dateInputRef = useRef<HTMLInputElement | null>(null);
   const timeSpanRef = useRef<HTMLSpanElement | null>(null);
   const timeInputRef = useRef<HTMLInputElement | null>(null);

   const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setDate(event.target.value);
   };

   const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTime(event.target.value);
   };

   const formatDate = (date: string) => {
      const [year, month, day] = date.split("-");
      return `${day}.${month}.${year}`;
   };

   const togglePriorityMenu = () => {
      setPriorityMenuOpen((prev) => !prev);
   };

   const handleClickOutside = (event: { target: any }) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
         setPriorityMenuOpen(false);

      if (dateSpanRef.current?.contains(event.target)) setIsDateEditing(true);
      else if (!dateInputRef.current?.contains(event.target))
         setIsDateEditing(false);

      if (timeSpanRef.current?.contains(event.target)) setIsTimeEditing(true);
      else if (!timeInputRef.current?.contains(event.target))
         setIsTimeEditing(false);
   };

   useEffect(() => {
      document.addEventListener("click", handleClickOutside);

      return () => {
         document.removeEventListener("click", handleClickOutside);
      };
   }, []);

   const renderPriorityButtons = () =>
      priorities.map((priority) => (
         <button
            key={priority}
            type="button"
            onClick={() => setTaskPriority(priority)}
            className={`${
               isPriorityMenuOpen ? "" : "hidden"
            } task_button task_priority${priority}`}
         ></button>
      ));

   return (
      <section className="task_container">
         <div className="task_leftSide">
            <input
               className="task_checkbox"
               type="checkbox"
               onClick={() => setIsDone(!isDone)}
            />
            <h2 className={`${isDone ? "task_done" : ""} task_title`}>
               Do something
            </h2>
         </div>

         <div className="task_rightSide">
            <div className="task_prioritySelection" ref={menuRef}>
               {renderPriorityButtons()}
               <button
                  type="button"
                  onClick={togglePriorityMenu}
                  className={`${
                     isDone ? "task_done" : ""
                  } task_button task_priority${taskPriority}`}
               ></button>
            </div>
            <div className={`${isDone ? "task_done" : ""} task_date`}>
               {isDateEditing ? (
                  <input
                     ref={dateInputRef}
                     className="task_dateTimeInput"
                     type="date"
                     value={date}
                     onChange={handleDateChange}
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
                     ref={timeInputRef}
                     className="task_dateTimeInput"
                     type="time"
                     value={time}
                     onChange={handleTimeChange}
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
            ></button>
         </div>
      </section>
   );
};

export default Task;
