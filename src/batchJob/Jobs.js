var CronJob = require('cron').CronJob;
import JobClearLog from './JobClearLog';
var shell = require('shelljs');


export default class Jobs {
    start() {
        new CronJob('* * * */10 * *', function () {
            let job = new JobClearLog();
            job.clearLogByType("log_request");
        }, null, true, '');
        new CronJob('* * * */10 * *', function () {
            let job = new JobClearLog();
            job.clearLogByType("log_login");
        }, null, true, '');
        new CronJob('* * * */5 * *', function () {
            let job = new JobClearLog();
            job.clearLog();
        }, null, true, '');

        new CronJob('0 1 1 1 * *', function () {
            // var command = " -d '{'title': 'Monthly report run' }' -H 'Content-Type: application/json' https://datareadings.focustech.vn/ClientReport/getDataReportMonthEmail";
            // shell.exec('curl ' + command, function (error, stdout, stderr) {
            //     // console.log('stdout: ' + stdout);
            //     // console.log('stderr: ' + stderr);
            //     if (error !== null) {
            //         console.log('exec error: ' + error);
            //     }
            // });
        }, null, true, '');

        new CronJob('0 1 1 1 1 *', function () {
            // var command = " -d '{'title': 'Year report run' }' -H 'Content-Type: application/json' https://datareadings.focustech.vn/ClientReport/getDataReportYearEmail";
            // shell.exec('curl ' + command, function (error, stdout, stderr) {
            //     // console.log('stdout: ' + stdout);
            //     // console.log('stderr: ' + stderr);
            //     if (error !== null) {
            //         console.log('exec error: ' + error);
            //     }
            // });
        }, null, true, '');

        new CronJob('00 00 20 * * 0-6', function () {
            
            shell.exec("curl -H 'Content-Type: application/json' -X POST -d '{}' 'https://datareadings.focustech.vn/ClientReport/getDataDailyReportEmail'", function (error, stdout, stderr) {
                console.log("Run daily report done");
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });

        }, null, true, '');


        new CronJob('00 */10 05-18 * * *', function () {
            shell.exec("curl -H 'Content-Type: application/json' -X POST -d '{}' 'https://datareadings.focustech.vn/BatchJob/runNoCommunication'", function (error, stdout, stderr) {
                console.log("Run scan system alarm report done");
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });

        }, null, true, '');


        // batch job device reset energy today
        new CronJob('00 00 00 * * *', function () {
            shell.exec("curl -H 'Content-Type: application/json' -X POST -d '{}' 'https://datareadings.focustech.vn/BatchJob/resetTodayEnergy'", function (error, stdout, stderr) {
                console.log("batch job device reset energy today");
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });

        }, null, true, '');


        // batch job device reset power now
        new CronJob('00 00 19 * * *', function () {
            shell.exec("curl -H 'Content-Type: application/json' -X POST -d '{}' 'https://apiserver.techedge.vn/BatchJob/resetPowerNow'", function (error, stdout, stderr) {
                console.log("batch job device reset power now");
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });

        }, null, true, '');


        // batch job update data device
        new CronJob('00 */1 * * * *', function () {
            shell.exec("curl -H 'Content-Type: application/json' -X POST -d '{}' 'https://apiserver.techedge.vn/BatchJob/updatedDevicePlant'", function (error, stdout, stderr) {
                console.log("Run scan device update done");
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });

        }, null, true, '');


        // batch job string performance
        new CronJob('00 00 19 * * *', function () {
            shell.exec("curl -H 'Content-Type: application/json' -X POST -d '{}' 'https://apiserver.techedge.vn/BatchJob/checkPerformanceIndex'", function (error, stdout, stderr) {
                console.log("batch job string performance");
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });

        }, null, true, '');

    }
}