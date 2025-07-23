import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const dbuser = encodeURIComponent(process.env.DBUSER);
const dbpass = encodeURIComponent(process.env.DBPASS);

app.get("/", (req, res) => {
  res.send("Hello World"); 
});


mongoose
  .connect(
    `mongodb+srv://${dbuser}:${dbpass}@cluster0.fciu6os.mongodb.net/bankapp?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    app.listen(8080, () => {
      console.log("Server started");
    });
  });

app.use("/api", userRouter);

//hello World
