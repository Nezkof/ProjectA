import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useSectionContext } from "../../contexts/MainContext";
import Cookies from "js-cookie";

import newUserIcon from "../../../public/header/newUser-icon.svg";

import "./header.css";

interface JwtToken {
   userId: string;
}

const Header = () => {
   let isReady = false;
   const [dateTime, setDateTime] = useState(new Date());
   const { userId, setUserId } = useSectionContext();
   const [userAvatar, setUserAvatar] = useState<string>("");

   useEffect(() => {
      if (userId.trim() === "") return;
      const fetchUser = async () => {
         try {
            const response = await fetch(
               `http://localhost:8000/users/${userId}`
            );

            if (!response.ok) {
               throw new Error(`Fetching error: ${response.statusText}`);
            }

            const { _id, avatar } = await response.json();
            console.log(avatar);

            setUserAvatar(avatar);
         } catch (err: any) {
            console.error(err.message);
         }
      };

      fetchUser();
   }, [userId]);

   useEffect(() => {
      if (isReady) {
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

         return () => clearInterval(timer);
      }

      isReady = !isReady;
   }, []);

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
               <img src="logo.svg" alt="logo_img" />
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
               >
                  <img
                     src={userAvatar ? userAvatar : newUserIcon}
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
