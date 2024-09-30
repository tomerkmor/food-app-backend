import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'must provide username'],
  },
  name: {
    type: String,
    required: [true, 'must provide name'],
    trim: true,
    maxlength: [50, 'name can not be more than 50 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  }
});

const Task = mongoose.model('Task', TaskSchema);
export default Task;