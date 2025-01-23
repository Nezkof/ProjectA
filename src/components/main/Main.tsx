import SideMenu from "../sideMenu/SideMenu";
import TasksList from "../tasksList/TasksList";
import "./main.css";

const Main = () => {
   console.log(window.innerHeight);

   return (
      <main className="main">
         <TasksList></TasksList>
         <SideMenu></SideMenu>
      </main>
   );
};

export default Main;
