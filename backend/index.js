import express from "express";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import tSectionsRouter from "./routes/taskSections.js";
import tListsRouter from "./routes/taskLists.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";

import fetch from "node-fetch";

import GoogleStrategy from "passport-google-oauth20";

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/taskSections", tSectionsRouter);
app.use("/tasks", tListsRouter);
app.use("/users", userRouter);
app.use(cookieParser());

app.use(
   session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
   })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/", authRouter);

passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: "http://localhost:8000/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
         return done(null, profile);
      }
   )
);

app.get("/proxy-avatar", async (req, res) => {
   const imageUrl = req.query.url;

   try {
      const response = await fetch(imageUrl);
      const contentType = response.headers.get("content-type");
      const buffer = await response.buffer();

      res.setHeader("Content-Type", contentType);
      res.send(buffer);
   } catch (err) {
      res.status(500).send("Failed to load avatar");
   }
});

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// app.use(
//    cors({
//       origin: "http://localhost:3000",
//       credentials: true,
//    })
// );

app.listen(PORT, () => {
   console.log(`Server listening on port ${PORT}`);
});
