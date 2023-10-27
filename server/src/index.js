import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/users.js";
import { recipesRouter } from "./routes/recipes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

mongoose.connect(
  "mongodb+srv://kitchenkonnect:kkpass123@recipes.plsmooa.mongodb.net/recipes?retryWrites=true&w=majority"
);

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(3001, () => console.log("SERVER STARTED"));
