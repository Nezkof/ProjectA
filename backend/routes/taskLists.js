import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import tSectionsRouter from "./taskSections.js";

const tListsRouter = express.Router();

tListsRouter.get("/:sectionId", async (req, res) => {
   try {
      const { sectionId } = req.params;

      if (!ObjectId.isValid(sectionId)) {
         return res.status(400).send("Invalid sectionId");
      }

      const query = { sectionId: new ObjectId(sectionId) };
      const collection = await db.collection("taskLists");
      const results = await collection.find(query).toArray();

      res.status(200).json(results);
   } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching task lists");
   }
});

tListsRouter.post("/", async (req, res) => {
   try {
      const { name, sectionId, dueDate, priority, isCompleted } = req.body;

      if (!name || !sectionId) {
         return res
            .status(400)
            .send("Invalid data: 'name' and 'sectionId' are required");
      }

      const newTask = {
         name,
         sectionId: new ObjectId(sectionId),
         dueDate: dueDate,
         priority: priority ?? 0,
         isCompleted: isCompleted ?? false,
      };

      const collection = await db.collection("taskLists");
      const result = await collection.insertOne(newTask);

      res.status(201).json({
         _id: result.insertedId,
         ...newTask,
      });
   } catch (err) {
      console.error(err);
      res.status(500).send("Error adding task");
   }
});

tListsRouter.patch("/:id", async (req, res) => {
   const { name, isCompleted, dueDate, priority } = req.body;

   try {
      const query = { _id: new ObjectId(req.params.id) };

      const updates = {
         $set: {
            ...(name && { name }),
            ...(isCompleted !== undefined && { isCompleted }),
            ...(dueDate && { dueDate }),
            ...(priority !== undefined && { priority }),
         },
      };

      const collection = await db.collection("taskLists");
      const result = await collection.updateOne(query, updates);

      if (result.matchedCount === 0) {
         return res.status(404).send("Task not found");
      }

      res.status(200).json({ _id: req.params.id, ...updates.$set });
   } catch (err) {
      console.error(err);
      res.status(500).send("Error updating record");
   }
});

tListsRouter.delete("/:id", async (req, res) => {
   const { id } = req.params;
   try {
      const collection = await db.collection("taskLists");
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0)
         return res.status(404).send("Task not found");

      res.status(200).send("Task deleted successfully");
   } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting task");
   }
});

export default tListsRouter;
