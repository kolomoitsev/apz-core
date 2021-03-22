const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskCategory = new Schema(
    {
        taskCategoryName: {
            type: String,
            required: true,
            unique: true,
        },
        taskCategoryDescription: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

const TaskCategoryModel = new mongoose.model('TaskCategory', TaskCategory);

module.exports = TaskCategoryModel;
