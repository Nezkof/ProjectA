import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useSectionContext } from "../../contexts/MainContext";
import Cookies from "js-cookie";

import newUserIcon from "/header/newUser-icon.svg";
import logoIcon from "/header/logo.png";

import "./header.css";

interface JwtToken {
   userId: string;
}

const Header = () => {
   const [dateTime, setDateTime] = useState(new Date());
   const { userId, setUserId } = useSectionContext();
   const [userAvatar, setUserAvatar] = useState<string>("");

   // JWT && Timer
   useEffect(() => {
      const token = Cookies.get("authToken");
      if (token) {
         try {
            const decodedToken: JwtToken = jwtDecode(token);
            setUserId(decodedToken.userId);
         } catch (error) {
            console.error("Invalid token", error);
         }
      }

      const timer = setInterval(() => {
         setDateTime(new Date());
      }, 1000);

      return () => {
         clearInterval(timer);
      };
   }, []);

   // User avatar fetching
   useEffect(() => {
      if (!userId.trim()) return;

      const fetchUser = async () => {
         try {
            const response = await fetch(
               `http://localhost:8000/users/${userId}`
            );

            if (!response.ok) {
               throw new Error(`Fetching error: ${response.statusText}`);
            }

            const { avatar } = await response.json();
            setUserAvatar(avatar);
         } catch (err: any) {
            console.error(err.message);
         }
      };

      fetchUser();
   }, [userId]);

   const handleProfileButton = () => {
      if (userId) {
         Cookies.remove("authToken");
         window.location.href = "/";
      } else {
         window.location.href = "http://localhost:8000/auth/google";
      }
   };

   return (
      <header className="header">
         <section className="header_content">
            <div className="header_pageName">
               <img src={logoIcon} alt="logo_img" className="header_logo" />
               <span>do/next</span>
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
               <button
                  className={`header_profileBtn ${
                     userAvatar ? "" : "header_userAvatar-noUser"
                  }`}
                  onClick={handleProfileButton}
                  id="profileButton"
               >
                  <img
                     src={
                        userAvatar
                           ? `http://localhost:8000/proxy-avatar?url=${encodeURIComponent(
                                userAvatar
                             )}`
                           : newUserIcon
                     }
                     alt={"avatar"}
                     className="header_userAvatar"
                  />
               </button>
            </div>
         </section>
      </header>
   );
};

export default Header;
