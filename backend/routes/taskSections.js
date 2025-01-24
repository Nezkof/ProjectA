import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const tSectionsRouter = express.Router();

tSectionsRouter.get("/", async (req, res) => {
   try {
      const collection = await db.collection("taskSections");
      const results = await collection.find({}).toArray();
      res.status(200).json(results);
   } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching task sections");
   }
});

tSectionsRouter.post("/", async (req, res) => {
   try {
      const newSection = req.body;
      const collection = await db.collection("taskSections");
      const result = await collection.insertOne(newSection);
      res.status(201).json({
         ...newSection,
         _id: result.insertedId,
      });
   } catch (err) {
      console.error(err);
      res.status(500).send("Error adding new task section");
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
      const collection = await db.collection("taskSections");
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
         return res.status(404).send("Task section not found");
      }

      res.status(200).send("Task section deleted successfully");
   } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting task section");
   }
});

export default tSectionsRouter;
