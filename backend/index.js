import express from "express";
import cors from "cors";
import tSectionsRouter from "./routes/taskSections.js";
import tListsRouter from "./routes/taskLists.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/taskSections", tSectionsRouter);
app.use("/tasks", tListsRouter);

app.listen(PORT, () => {
   console.log(`Server listening on port ${PORT}`);
});
