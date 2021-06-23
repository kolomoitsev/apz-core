const cron = require('node-cron');
const taskModel = require('./../models/task.model');
const userModel = require('./../models/user.model');
const moment = require('moment');

const cronJob = () => {
    return cron.schedule('0 */15 * * * *', async () => {

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
                                console.log({
                                    error: 'Not found',
                                });
                        } catch (e) {
                            console.log({
                                error: 'Error with finding exact user',
                            });
                        }
                    }
                }
            } else {
                console.log('no tasks found');
            }
        } catch (e) {
            console.log({
                error: 'Error with finding tasks',
                e,
            });
        }
    });
}

module.exports = cronJob;
