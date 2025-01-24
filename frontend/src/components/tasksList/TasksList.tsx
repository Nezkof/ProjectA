import { useEffect, useState } from "react";
import "./tasksList.css";
import addTaskIcon from "../../../public/tasksList/addTask.svg";
import sideMenuBtn from "../../../public/tasksList/sideMenuButton-icon.svg";
import Task from "../task/Task";
import { useFetcher, useOutletContext } from "react-router-dom";
import { TaskI } from "../task/Task";
import { useSectionContext } from "../mainContext/MainContext";

interface OutletContextType {
   toggleSideMenu: () => void;
}

const TasksList = () => {
   const { activeSectionId } = useSectionContext();
   const { toggleSideMenu } = useOutletContext<OutletContextType>();
   const [isMenuOpen, setMenuOpen] = useState(true);

   const [tasks, setTasks] = useState<TaskI[]>([]);

   //TODO
   //LOADING SCREEN
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const fetchTaskLists = async () => {
         if (!activeSectionId) return;
         setLoading(true);
         try {
            const response = await fetch(
               `http://localhost:5050/tasks/${activeSectionId}`
            );
            if (!response.ok) {
               throw new Error(`Fetching error: ${response.statusText}`);
            }
            const data: TaskI[] = await response.json();
            setTasks(data);
         } catch (error: any) {
            console.error(error.message);
         } finally {
            setLoading(false);
         }
      };

      fetchTaskLists();
   }, [activeSectionId]);

   const handleAddTask = async () => {
      const name = "name";
      const dueDate = new Date();
      const newTask = await addTask(name, dueDate);

      if (newTask) {
         setTasks((prevTasks) => [...prevTasks, newTask]);
      }
   };

   const addTask = async (name: string, dueDate: Date) => {
      try {
         const response = await fetch("http://localhost:5050/tasks", {
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

         if (!response.ok) {
            throw new Error(`Adding error: ${response.statusText}`);
         }

         const newTask = await response.json();
         return newTask;
      } catch (error: any) {
         console.error(error.message);
      }
   };

   const deleteTask = async (id: string) => {
      try {
         await fetch(`http://localhost:5050/tasks/${id}`, {
            method: "DELETE",
         });
         const newTasks = tasks.filter((el) => el._id !== id);
         setTasks(newTasks);
      } catch (err) {
         console.error(err);
      }
   };

   const updateTask = async (id: string, updatedData: TaskI) => {
      console.log(updatedData);

      try {
         const response = await fetch(`http://localhost:5050/tasks/${id}`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
         });

         if (!response.ok) {
            throw new Error(`Updating error: ${response.statusText}`);
         }

         const updatedTask = await response.json();

         setTasks((prevTasks) =>
            prevTasks.map((task) =>
               task._id === id ? { ...task, ...updatedTask } : task
            )
         );
      } catch (error: any) {
         console.error(error.message);
      }
   };

   const handleSideMenuButton = () => {
      setMenuOpen((prev) => !prev);
      toggleSideMenu();
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
