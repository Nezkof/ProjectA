import "./App.css";
import Header from "./components/header/Header";
import { Outlet } from "react-router-dom";
import SideMenu from "./components/sideMenu/SideMenu";
import { SectionProvider } from "./contexts/MainContext";

function App() {
   return (
      <>
         <SectionProvider>
            <Header></Header>
            <main className="main">
               <Outlet />
               <SideMenu />
            </main>
         </SectionProvider>
      </>
   );
}

export default App;
