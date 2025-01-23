import { useState } from "react";
import SideMenu from "../sideMenu/SideMenu";
import TasksList from "../tasksList/TasksList";
import "./main.css";

const Main = () => {
   const [isMenuOpen, setMenuOpen] = useState(false);

   const toggleSideMenu = () => {
      setMenuOpen((prev) => !prev);
   };

   return (
      <main className="main">
         <TasksList isMenuOpen={isMenuOpen} openSideMenu={toggleSideMenu} />
         {isMenuOpen && <SideMenu />}
      </main>
   );
};

export default Main;
