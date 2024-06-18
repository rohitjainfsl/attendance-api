import mongoose from "mongoose";
import { format, toZonedTime } from "date-fns-tz";

function getFormattedDate() {
  const timeZone = "Asia/Kolkata";
  const date = new Date();
  const zonedDate = toZonedTime(date, timeZone);
  const formattedDate = format(zonedDate, "dd-MM-yyyy HH:mm:ss", { timeZone });
  return formattedDate;
}

const attendanceSchema = new mongoose.Schema({
  date: {
    type: String,
    default: () => getFormattedDate(),
  },
  faculty: {
    type: String,
    required: true,
  },
  attendance: {
    type: Array,
    required: true,
  },
});
const attendanceModel = mongoose.model("record", attendanceSchema, "record");

// Ensure indexes are created
attendanceModel.on("index", (err) => {
  if (err) {
    console.error("Index creation failed", err);
  }
});
export default attendanceModel;
