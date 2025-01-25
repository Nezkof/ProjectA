import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const userRouter = express.Router();

userRouter.get("/:id", async (req, res) => {
   try {
      const id = req.params.id;

      const query = { _id: id };
      const collection = await db.collection("users");

      const user = await collection.findOne(query);

      if (!user) {
         return res.status(404).send("User not found");
      }

      res.status(200).json(user);
   } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).send("Error fetching user");
   }
});

export default userRouter;
