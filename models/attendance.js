import mongoose from "mongoose";

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
const attendanceModel = mongoose.model("record", attendanceSchema, "record");
export default attendanceModel;
