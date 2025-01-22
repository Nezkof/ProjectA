import { useEffect, useState } from "react";

import "./header.css";

const Header = () => {
   const [dateTime, setDateTime] = useState(new Date());

   useEffect(() => {
      const timer = setInterval(() => {
         setDateTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
   }, []);

   return (
      <header className="headerWrapper">
         <section className="header">
            <div className="header_pageName">
               <img src="logo.svg" alt="logo_img" />
               <span>Pagename</span>
            </div>

            <div className="header_userInfo">
               <span className="header_dateTime">
                  {dateTime.toLocaleDateString()}
                  {" | "}
                  {dateTime.toLocaleTimeString([], {
                     hour: "2-digit",
                     minute: "2-digit",
                  })}
               </span>
               <img src="avatar.svg" alt="avatar_img" />
            </div>
         </section>
      </header>
   );
};

export default Header;
