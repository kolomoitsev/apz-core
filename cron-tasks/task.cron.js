const cron = require('node-cron');
const taskModel = require('./../models/task.model');
const moment = require('moment');

cron.schedule('*/45* * * * *', async () => {
    try {
        const tasks = await taskModel.find({
            taskStatus: 'not done',
        });

        if (tasks.length) {
            for (const task of tasks) {
                const { taskDeadline, taskAssignee, taskName } = task;
                const dateNow = new Date(Date.now()).toJSON();
                if (
                    moment(dateNow).diff(moment(taskDeadline), 'minutes') <= 15
                ) {
                    try {
                        const user = await userModel.findById(taskAssignee);
                        if (user) {
                            console.group(user.userEmail);
                            console.log(
                                `Less than 15 minutes on task ${taskName}`,
                            );
                            console.groupEnd();
                        } else
                            return console.log({
                                error: 'Not found',
                            });
                    } catch (e) {
                        return console.log({
                            error: 'Error with finding exact user',
                        });
                    }
                }
            }
        } else {
            return console.log('no tasks found');
        }
    } catch (e) {
        return console.log({
            error: 'Error with finding tasks',
            e,
        });
    }
});

module.exports = cron;
