const cron = require('node-cron');
const fs = require('fs').promises;
const exec = require("child_process").exec;

const rimraf = require("rimraf");
const zipFolder = require("zip-folder");



const backupsJob = async () => {
        return cron.schedule('0 0 */3 * * *', async () => {

            fs.rmdir('./cron-tasks/backups/raw/sigma', { recursive: true })
                .then(() => {
                    exec("mongodump --uri " +
                        "mongodb+srv://kolomoitsev:HVZD4EdjqXNV6ihQ@cluster0.hnn0k.mongodb.net/sigma " +
                        `--archive=./cron-tasks/backups/dump-` + new Date().toJSON() + `.gz --gzip`, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);

                    });
                });
    });
}



module.exports = backupsJob;

