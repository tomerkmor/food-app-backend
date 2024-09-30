import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: new Date()
    }
  })

  export default LogSchema;