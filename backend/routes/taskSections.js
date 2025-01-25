import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const tSectionsRouter = express.Router();

tSectionsRouter.get("/:ownerId", async (req, res) => {
   try {
      const ownerId = req.params.ownerId;

      if (!ownerId) {
         return res.status(400).send("Invalid user");
      }

      const query = { ownerId };
      const collection = await db.collection("taskSections");

      const results = await collection.find(query).toArray();
      res.status(200).json(results);
   } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching task sections");
   }
});

// tSectionsRouter.get("/", async (req, res) => {
//    try {
//       const collection = await db.collection("taskSections");
//       const results = await collection.find({}).toArray();
//       res.status(200).json(results);
//    } catch (err) {
//       console.error(err);
//       res.status(500).send("Error fetching task sections");
//    }
// });

tSectionsRouter.post("/", async (req, res) => {
   try {
      const { name, ownerId } = req.body;

      if (!ownerId) {
         return res.status(400).send("Invalid user ID");
      }

      const newSection = {
         name,
         ownerId,
      };

      const collection = await db.collection("taskSections");
      const result = await collection.insertOne(newSection);

      res.status(201).json({
         _id: result.insertedId,
         ...newSection,
      });
   } catch (err) {
      console.error(err);
      res.status(500).send("Error creating task section");
   }
});

tSectionsRouter.patch("/:id", async (req, res) => {
   try {
      const query = { _id: new ObjectId(req.params.id) };
      const updates = {
         $set: {
            name: req.body.name,
         },
      };

      let collection = await db.collection("taskSections");
      let result = await collection.updateOne(query, updates);
      res.send(result).status(200);
   } catch (err) {
      console.error(err);
      res.status(500).send("Error updating record");
   }
});

tSectionsRouter.delete("/:id", async (req, res) => {
   const { id } = req.params;

   try {
      const taskSectionsCollection = await db.collection("taskSections");
      const taskListsCollection = await db.collection("taskLists");

      const taskDeletionResult = await taskListsCollection.deleteMany({
         sectionId: new ObjectId(id),
      });

      console.log(
         `Deleted ${taskDeletionResult.deletedCount} tasks linked to section ${id}`
      );

      const sectionDeletionResult = await taskSectionsCollection.deleteOne({
         _id: new ObjectId(id),
      });

      if (sectionDeletionResult.deletedCount === 0) {
         return res.status(404).send("Task section not found");
      }

      res.status(200).send(
         "Task section and related tasks deleted successfully"
      );
   } catch (err) {
      console.error("Error deleting task section or related tasks:", err);
      res.status(500).send("Error deleting task section or related tasks");
   }
});

export default tSectionsRouter;
