import { useEffect, useState } from "react";
import "./tasksList.css";
import addTaskIcon from "/tasksList/addTask.svg";
import sideMenuBtn from "/tasksList/sideMenuButton-icon.svg";
import Task from "../task/Task";
import { TaskI } from "../task/Task";
import { useSectionContext } from "../../contexts/MainContext";

const TasksList = () => {
   const { activeSectionId, userId, setActiveSectionId } = useSectionContext();
   const { isMenuOpen, setMenuOpen } = useSectionContext();
   const [tasks, setTasks] = useState<TaskI[]>([]);

   const handleSideMenuButton = () => {
      setMenuOpen(!isMenuOpen);
   };

   const highlightLoginButton = () => {
      const loginButton = document.getElementById("profileButton");
      loginButton?.classList.toggle("highlight");

      setTimeout(() => loginButton?.classList.toggle("highlight"), 300);
   };

   // Tasks fetching
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

   useEffect(() => {
      if (!activeSectionId) {
         setTasks([]);
         return;
      }

      fetchData(`/tasks/${activeSectionId}`).then((data) => {
         setTasks(data);
      });
   }, [activeSectionId]);

   // Tasks adding
   const handleAddTask = async () => {
      const name = "name";
      const date = new Date();
      const dueDate = `${date.getDate().toString().padStart(2, "0")}.${(
         date.getMonth() + 1
      )
         .toString()
         .padStart(2, "0")}.${date.getFullYear()}|${date
         .getHours()
         .toString()
         .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

      const newTask = await addTask(name, dueDate);

      if (newTask) {
         setTasks((prevTasks) => [...prevTasks, newTask]);
      }
   };

   const addTask = async (name: string, dueDate: string) => {
      if (!activeSectionId) {
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

         setActiveSectionId(data._id);
      } else {
         const newTask = await fetchData("/tasks", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name,
               sectionId: activeSectionId,
               dueDate: dueDate,
            }),
         });

         return newTask;
      }
   };

   // Tasks deleting
   const deleteTask = async (id: string) => {
      try {
         await fetch(`http://localhost:8000/tasks/${id}`, {
            method: "DELETE",
         });
         const newTasks = tasks.filter((el) => el._id !== id);
         setTasks(newTasks);
      } catch (err) {
         console.error(err);
      }
   };

   // Tasks updating
   const updateTask = async (id: string, updatedData: TaskI) => {
      const updatedTask = await fetchData(`/tasks/${id}`, {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(updatedData),
      });

      setTasks((prevTasks) =>
         prevTasks.map((task) =>
            task._id === id ? { ...task, ...updatedTask } : task
         )
      );
   };

   const renderTasks = () =>
      tasks.map((task) => (
         <Task
            key={task._id}
            _id={task._id}
            _name={task.name}
            _priority={task.priority}
            _dueDate={task.dueDate}
            _isCompleted={task.isCompleted}
            _deleteTask={deleteTask}
            _updateTask={updateTask}
         />
      ));

   return (
      <section className="tasks_container">
         <div className="tasks_btnsContainer">
            <button className="tasks_createBtn" onClick={handleAddTask}>
               New Task
               <img src={addTaskIcon} alt="addTask_icon" />
            </button>
            <button
               className=" tasks_sideMenuBtn"
               onClick={handleSideMenuButton}
            >
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
