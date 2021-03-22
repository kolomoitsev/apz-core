const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Task = new Schema(
    {
        taskName: {
            type: String,
            required: true,
        },
        taskDescription: {
            type: String,
            required: true,
        },
        taskAssignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        taskCreatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        taskLength: {
            type: Number,
            required: true,
        },
        taskStatus: {
            type: String,
            default: 'not done',
        },
        taskCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TaskCategory',
            required: true,
        },
        taskDeadline: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const TaskModel = new mongoose.model('Task', Task);

module.exports = TaskModel;
