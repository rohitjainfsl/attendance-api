import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import attendanceModel from "./models/attendance.js";
import facultyModel from "./models/faculty.js";
import studentModel from "./models/student.js";

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
if (dbConnection) {
  try {
    await attendanceModel.createIndexes();
    await facultyModel.createIndexes();
    await studentModel.createIndexes();
  } catch (err) {
    console.error("Error creating indexes:", err);
  }
  app.listen(port, () => console.log("Server Started on port " + port));
}

app.post("/saveAttendance", (req, res) => {
  const dataToSave = new attendanceModel(req.body);

  dataToSave
    .save()
    .then((response) => {
      if (response) res.json("Attendance Saved for today");
      else res.json(false);
    })
    .catch((error) => {
      console.log(error);
      res.send(false);
    });
});

app.get("/getFaculty", async (req, res) => {
  const facultyList = await facultyModel.find({}).select(["-__v", "-_id"]);
  if (facultyList) res.json(facultyList);
  else res.json(false);
});

app.post("/saveFaculty", async (req, res) => {
  // console.log(req.body);
  const dataToSave = new facultyModel(req.body);
  dataToSave
    .save()
    .then((response) => {
      if (response) res.json("Faculty Added");
    })
    .catch((error) => {
      console.log(error.code);
      if (error.code === 11000) res.json("Error: Duplicate Aadhaar");
    });
});

app.delete("/deleteFaculty/:id", async (req, res) => {
  const idToDelete = req.params.id;
  const deletedFaculty = await facultyModel.findOneAndDelete({
    id: idToDelete,
  });
  if (deletedFaculty) res.json("Faculty Deleted");
  else res.json(false);
});

app.get("/getStudent", async (req, res) => {
  const studentList = await studentModel.find({}).select(["-__v", "-_id"]);
  if (studentList) res.json(studentList);
  else res.json(false);
});

app.get("/getStudentByFaculty/:faculty", async (req, res) => {
  const faculty = req.params.faculty;

  const studentList = await studentModel
    .find({ faculty: faculty })
    .sort({ name: "asc" })
    .select(["-__v", "-_id", "-id", "-faculty"]);

  if (studentList) res.json(studentList);
  else res.json(false);
});

app.post("/saveStudent", async (req, res) => {
  const dataToSave = new studentModel(req.body);
  dataToSave
    .save()
    .then((response) => {
      if (response) res.json("Student Added");
    })
    .catch((error) => {
      console.log(error);
      res.send(false);
    });
});

app.delete("/deleteStudent/:id", async (req, res) => {
  const idToDelete = req.params.id;
  const deletedStudent = await studentModel.findOneAndDelete({
    id: idToDelete,
  });
  if (deletedStudent) res.json("Student Deleted");
  else res.json(false);
});
