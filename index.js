import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

const port = 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
const Musername = process.env.MONGO_USERNAME;
const Mpassword = process.env.MONGO_PASSWORD;

const dbConnection = await mongoose.connect(
  "mongodb+srv://" +
    Musername +
    ":" +
    Mpassword +
    "@cluster0.4ont6qs.mongodb.net/attendance?retryWrites=true&w=majority&appName=Cluster0"
);
if (dbConnection)
  app.listen(port, () => console.log("Server Started on port " + port));

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: new Date(),
  },
  attendance: {
    type: Object,
    required: true,
  },
});

const attendanceModel = mongoose.model("record", attendanceSchema, "record");

app.post("/saveAttendance", (req, res) => {
  const dataToSave = new attendanceModel(req.body);
  dataToSave
    .save()
    .then((response) => res.send(true))
    .catch((error) => {
      console.log(error);
      res.send(false);
    });
});
