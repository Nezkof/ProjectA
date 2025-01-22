import TasksList from "../tasksList/TasksList";
import "./main.css";

const Main = () => {
   return (
      <main className="mainWrapper">
         <section className="main_container">
            <TasksList></TasksList>
         </section>
      </main>
   );
};

export default Main;
