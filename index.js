import express from "express";
import cors from "cors";
import mongoose, { Mongoose } from "mongoose";
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

let d = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: d,
  },
  attendance: {
    type: Object,
    required: true,
  },
});
const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    default: Date.now(),
  },
});

const studentSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: Date.now(),
  },
  name: {
    type: String,
    required: true,
  },
  faculty: {
    type: String,
    required: true,
  },
});

const attendanceModel = mongoose.model("record", attendanceSchema, "record");
const facultyModel = mongoose.model("faculty", facultySchema, "faculty");
const studentModel = mongoose.model("student", studentSchema, "student");

app.post("/saveAttendance", (req, res) => {
  const dataToSave = new attendanceModel(req.body);
  dataToSave
    .save()
    .then((response) => res.send(response))
    .catch((error) => {
      console.log(error);
      res.send(false);
    });
});

app.get("/getFaculty", async (req, res) => {
  const facultyList = await facultyModel.find({}).select("-__v");
  if (facultyList) res.json(facultyList);
  else res.json(false);
});

app.post("/saveFaculty", async (req, res) => {
  const dataToSave = new facultyModel(req.body);
  dataToSave
    .save()
    .then((response) => res.json(response))
    .catch((error) => {
      console.log(error);
      res.send(false);
    });
});

app.get("/getStudent", async (req, res) => {
  const studentList = await studentModel.find({}).select("-__v");
  if (studentList) res.json(studentList);
  else res.json(false);
});

app.post("/saveStudent", async (req, res) => {
  const dataToSave = new studentModel(req.body);
  dataToSave
    .save()
    .then((response) => res.json(response))
    .catch((error) => {
      console.log(error);
      res.send(false);
    });
});

app.delete("/deleteStudent/:id", async (req, res) => {
  const idToDelete = req.params.id;
  const deletedStudent = await studentModel.findOneAndDelete(
    {
      _id: idToDelete,
    }.select("-__v")
  );
  if (deletedStudent) res.json("Student Deleted");
  else res.json(false);
});
