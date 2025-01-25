import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import db from "../db/connection.js";

const authRouter = express.Router();

authRouter.get(
   "/auth/google",
   passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
   "/auth/google/callback",
   passport.authenticate("google", { failureRedirect: "/" }),
   async (req, res) => {
      try {
         const payload = { userId: req.user.id };
         const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24h",
         });

         res.cookie("authToken", token, {
            httpOnly: false,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
         });

         const avatarUrl = req.user.photos?.[0]?.value;

         const user = {
            _id: req.user.id,
            avatar: avatarUrl,
         };

         const collection = await db.collection("users");

         await collection.updateOne(
            { _id: user._id },
            { $set: user },
            { upsert: true }
         );

         res.redirect("http://localhost:3000");
      } catch (err) {
         console.error("Error in Google callback:", err);
         res.status(500).send("Internal Server Error");
      }
   }
);

// authRouter.get(
//    "/auth/google/callback",
//    passport.authenticate("google", { failureRedirect: "/" }),
//    (req, res) => {
//       const payload = { userId: req.user.id };
//       const token = jwt.sign(payload, process.env.JWT_SECRET, {
//          expiresIn: "24h",
//       });

//       res.cookie("authToken", token, {
//          httpOnly: false,
//          secure: false,
//          maxAge: 24 * 60 * 60 * 1000,
//       });

//       res.redirect("http://localhost:3000");
//    }
// );

// authRouter.get("/profile", (req, res) => {
//    if (!req.user) {
//       return res.status(401).send("Unauthorized");
//    }
//    res.send(`Welcome ${req.user.displayName}`);
// });

// authRouter.get("/logout", async (req, res, next) => {
//    try {
//       await req.logOut(() => {
//          res.redirect("/");
//       });
//    } catch (err) {
//       next(err);
//    }
// });

export default authRouter;
