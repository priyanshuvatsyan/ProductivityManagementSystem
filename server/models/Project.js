const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectName: { type: String, required: true },
    taskList: [{ title: String, done: Boolean }],
    timeWorkedPerDay: [
        {
          date: { type: Date, required: true },
          totalSeconds: { type: Number, default: 0 }
        }
      ],
      totalTimeWorkedSeconds: { type: Number, default: 0 }
      
});

module.exports = mongoose.model("Project", projectSchema);

