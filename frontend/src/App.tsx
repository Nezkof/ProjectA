import "./App.css";
import Header from "./components/header/Header";
import { Outlet } from "react-router-dom";
import SideMenu from "./components/sideMenu/SideMenu";
import { SectionProvider } from "./components/mainContext/MainContext";

import { useState } from "react";

function App() {
   const [isMenuOpen, setMenuOpen] = useState(true);

   const toggleSideMenu = (): void => {
      setMenuOpen((prev) => !prev);
   };

   return (
      <>
         <Header></Header>
         <SectionProvider>
            <main className="main">
               <Outlet context={{ toggleSideMenu }} />
               {isMenuOpen && <SideMenu />}
            </main>
         </SectionProvider>
      </>
   );
}

export default App;
