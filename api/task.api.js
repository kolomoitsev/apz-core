const express = require('express');
const router = express.Router();

const userModel = require('./../models/user.model');
const taskModel = require('./../models/task.model');
const taskCategoryModel = require('./../models/task-category.model');
const { authenticateToken } = require('./../helpers/index');

router
    //get all task categories
    .get('/category', authenticateToken, async (req, res) => {
        try {
            const categories = await taskCategoryModel.find({});

            if (categories.length) {
                return res.status(200).json(categories);
            } else {
                return res.status(404).json({
                    error: 'Not found',
                });
            }
        } catch (e) {
            return res.status(500).json({
                error: 'Error with finding categories',
                e,
            });
        }
    })
    //add new task category
    .post('/category', authenticateToken, async (req, res) => {
        const { taskCategoryName, taskCategoryDescription } = req.body;

        const category = new taskCategoryModel({
            taskCategoryName,
            taskCategoryDescription,
        });

        await category
            .save()
            .then(() => res.status(200).json(category))
            .catch((err) =>
                res.status(500).json({
                    error: 'Error with creating new category',
                    err,
                }),
            );
    })
    //get exact task category
    .get('/category/:category_id', authenticateToken, async (req, res) => {
        const { category_id } = req.params;
        try {
            const category = await taskCategoryModel.findById(category_id);
            if (category) {
                return res.status(200).json(category);
            } else
                return res.status(404).json({
                    error: 'Not found',
                });
        } catch (e) {
            return res.status(500).json({
                error: 'Error with finding exact category',
            });
        }
    })
    //edit exact task category
    .patch('/category/:category_id', authenticateToken, async (req, res) => {
        const { category_id } = req.params;
        const { taskCategoryName, taskCategoryDescription } = req.body;
        try {
            const category = await taskCategoryModel.findByIdAndUpdate(
                category_id,
                {
                    taskCategoryName,
                    taskCategoryDescription,
                },
            );
            if (category) {
                return res.status(200).json(category);
            } else
                return res.status(404).json({
                    error: 'Not found',
                });
        } catch (e) {
            return res.status(500).json({
                error: 'Error with updating exact category',
            });
        }
    })
    //delete exact task category
    .delete('/category/:category_id', authenticateToken, async (req, res) => {
        const { category_id } = req.params;
        try {
            const remove = await taskCategoryModel.findByIdAndDelete(
                category_id,
            );
            if (remove) {
                return res.status(200).json({
                    message: 'Successfully deleted',
                });
            } else {
                return res.status(404).json({
                    error: 'Not found',
                });
            }
        } catch (e) {
            return res.status(500).json({
                error: 'Error with deleting exact category',
            });
        }
    })

    //get all tasks
    .get('/', authenticateToken, async (req, res) => {
        try {
            const tasks = await taskModel.find({});

            if (tasks.length) {
                return res.status(200).json(categories);
            } else {
                return res.status(404).json({
                    error: 'Not found',
                });
            }
        } catch (e) {
            return res.status(500).json({
                error: 'Error with finding tasks',
                e,
            });
        }
    })
    //get exact task
    .get('/:task_id', authenticateToken, async (req, res) => {
        const { task_id } = req.params;
        try {
            const task = await taskCategoryModel.findById(task_id);
            if (task) {
                return res.status(200).json(task);
            } else
                return res.status(404).json({
                    error: 'Not found',
                });
        } catch (e) {
            return res.status(500).json({
                error: 'Error with finding exact task',
            });
        }
    })
    //get all tasks by exact user assigned
    .get('/:user_id', authenticateToken, async (req, res) => {
        const { user_id } = req.params;
        try {
            const tasks = await taskModel.find({
                taskAssignee: user_id,
            });

            if (tasks.length) {
                return res.status(200).json(tasks);
            } else {
                return res.status(404).json({
                    error: 'Not found',
                });
            }
        } catch (e) {
            return res.status(500).json({
                error: 'Error with finding tasks',
                e,
            });
        }
    })
    //create new task
    .post('/', authenticateToken, async (req, res) => {
        const {
            taskName,
            taskDescription,
            taskAssignee,
            taskCreatedBy,
            taskLength,
            taskCategory,
            taskDeadline,
        } = req.body;

        try {
            const assigneeUser = await userModel.findById(taskAssignee);

            if (assigneeUser) {
                const { userRole } = assigneeUser;
                if (userRole !== 'worker') {
                    return res.status(403).json({
                        error: 'Assignee role is not an worker',
                    });
                }
            } else {
                return res.status(404).json({
                    error: 'Not found',
                });
            }
        } catch (e) {
            return res.status(500).json({
                error: 'Error with finding assignee user',
            });
        }

        try {
            const creatorUser = await userModel.findById(taskCreatedBy);

            if (creatorUser) {
                const { userRole } = creatorUser;
                if (userRole !== 'owner') {
                    return res.status(403).json({
                        error: 'Creator role is not an owner',
                    });
                }
            } else {
                return res.status(404).json({
                    error: 'Not found',
                });
            }
        } catch (e) {
            return res.status(500).json({
                error: 'Error with finding owner user',
            });
        }

        try {
            const tasks = await taskModel.find({
                taskAssignee: taskAssignee,
            });

            let tasksTime = 0;

            if (tasks.length) {
                for (const task of tasks) {
                    const { taskLength } = task;
                    tasksTime += taskLength;
                }
                if (tasksTime + taskLength > 480) {
                    return res.status(403).json({
                        error: '8 hours limit per day for one worker',
                    });
                }
            }
        } catch (e) {
            return res.status(500).json({
                error: 'Error with time managing tasks',
                e,
            });
        }

        const task = new taskModel({
            taskName,
            taskDescription,
            taskAssignee,
            taskCreatedBy,
            taskLength,
            taskCategory,
            taskDeadline,
        });

        await task
            .save()
            .then(() => res.status(200).json(task))
            .catch((err) =>
                res.status(500).json({
                    error: 'Error with creating new task',
                    err,
                }),
            );
    })
    //change exact task
    .patch('/:task_id', authenticateToken, async (req, res) => {
        const { task_id } = req.params;
        const { taskName, taskDescription, taskCategory } = req.body;
        try {
            const task = await taskModel.findByIdAndUpdate(task_id, {
                taskName,
                taskDescription,
                taskCategory,
            });
            if (task) {
                return res.status(200).json(task);
            } else
                return res.status(404).json({
                    error: 'Not found',
                });
        } catch (e) {
            return res.status(500).json({
                error: 'Error with updating exact task',
            });
        }
    })
    //set exact task to done
    .patch('/done/:task_id', authenticateToken, async (req, res) => {
        const { task_id } = req.params;
        try {
            const task = await taskModel.findByIdAndUpdate(task_id, {
                taskStatus: 'done',
            });
            if (task) {
                return res.status(200).json(task);
            } else
                return res.status(404).json({
                    error: 'Not found',
                });
        } catch (e) {
            return res.status(500).json({
                error: 'Error with updating exact task',
            });
        }
    })
    //delete exact task
    .delete('/:task_id', authenticateToken, async (req, res) => {
        const { task_id } = req.params;
        try {
            const remove = await taskModel.findByIdAndDelete(task_id);
            if (remove) {
                return res.status(200).json({
                    message: 'Successfully deleted',
                });
            } else {
                return res.status(404).json({
                    error: 'Not found',
                });
            }
        } catch (e) {
            return res.status(500).json({
                error: 'Error with deleting exact task',
            });
        }
    });

module.exports = router;
