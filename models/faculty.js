import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    default: uuidv4(),
  },
  aadhaar: {
    type: Number,
    required: true,
    unique: true,
  },
});
const facultyModel = mongoose.model("faculty", facultySchema, "faculty");

// Ensure indexes are created
facultyModel.on("index", (err) => {
  if (err) {
    console.error("Index creation failed", err);
  }
});

export default facultyModel;
