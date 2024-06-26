import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const studentSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4(),
  },
  name: {
    type: String,
    required: true,
  },
  faculty: {
    type: String,
    required: true,
  },
  aadhaar: {
    type: Number,
    required: true,
    unique: true,
  },
});
const studentModel = mongoose.model("student", studentSchema, "student");
// Ensure indexes are created
studentModel.on("index", (err) => {
  if (err) {
    console.error("Index creation failed", err);
  }
});
export default studentModel;
