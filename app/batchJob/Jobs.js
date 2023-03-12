'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _JobClearLog = require('./JobClearLog');

var _JobClearLog2 = _interopRequireDefault(_JobClearLog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CronJob = require('cron').CronJob;

var shell = require('shelljs');

var Jobs = function () {
    function Jobs() {
        _classCallCheck(this, Jobs);
    }

    _createClass(Jobs, [{
        key: 'start',
        value: function start() {
            new CronJob('* * * */10 * *', function () {
                var job = new _JobClearLog2.default();
                job.clearLogByType("log_request");
            }, null, true, '');
            new CronJob('* * * */10 * *', function () {
                var job = new _JobClearLog2.default();
                job.clearLogByType("log_login");
            }, null, true, '');
            new CronJob('* * * */5 * *', function () {
                var job = new _JobClearLog2.default();
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
    }]);

    return Jobs;
}();

exports.default = Jobs;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXRjaEpvYi9Kb2JzLmpzIl0sIm5hbWVzIjpbIkNyb25Kb2IiLCJyZXF1aXJlIiwic2hlbGwiLCJKb2JzIiwiam9iIiwiSm9iQ2xlYXJMb2ciLCJjbGVhckxvZ0J5VHlwZSIsImNsZWFyTG9nIiwiZXhlYyIsImVycm9yIiwic3Rkb3V0Iiwic3RkZXJyIiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7Ozs7Ozs7QUFEQSxJQUFJQSxVQUFVQyxRQUFRLE1BQVIsRUFBZ0JELE9BQTlCOztBQUVBLElBQUlFLFFBQVFELFFBQVEsU0FBUixDQUFaOztJQUdxQkUsSTs7Ozs7OztnQ0FDVDtBQUNKLGdCQUFJSCxPQUFKLENBQVksZ0JBQVosRUFBOEIsWUFBWTtBQUN0QyxvQkFBSUksTUFBTSxJQUFJQyxxQkFBSixFQUFWO0FBQ0FELG9CQUFJRSxjQUFKLENBQW1CLGFBQW5CO0FBQ0gsYUFIRCxFQUdHLElBSEgsRUFHUyxJQUhULEVBR2UsRUFIZjtBQUlBLGdCQUFJTixPQUFKLENBQVksZ0JBQVosRUFBOEIsWUFBWTtBQUN0QyxvQkFBSUksTUFBTSxJQUFJQyxxQkFBSixFQUFWO0FBQ0FELG9CQUFJRSxjQUFKLENBQW1CLFdBQW5CO0FBQ0gsYUFIRCxFQUdHLElBSEgsRUFHUyxJQUhULEVBR2UsRUFIZjtBQUlBLGdCQUFJTixPQUFKLENBQVksZUFBWixFQUE2QixZQUFZO0FBQ3JDLG9CQUFJSSxNQUFNLElBQUlDLHFCQUFKLEVBQVY7QUFDQUQsb0JBQUlHLFFBQUo7QUFDSCxhQUhELEVBR0csSUFISCxFQUdTLElBSFQsRUFHZSxFQUhmOztBQUtBLGdCQUFJUCxPQUFKLENBQVksYUFBWixFQUEyQixZQUFZO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSCxhQVRELEVBU0csSUFUSCxFQVNTLElBVFQsRUFTZSxFQVRmOztBQVdBLGdCQUFJQSxPQUFKLENBQVksYUFBWixFQUEyQixZQUFZ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IHJlcXVpcmUoJ2Nyb24nKS5Dcm9uSm9iO1xuaW1wb3J0IEpvYkNsZWFyTG9nIGZyb20gJy4vSm9iQ2xlYXJMb2cnO1xudmFyIHNoZWxsID0gcmVxdWlyZSgnc2hlbGxqcycpO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpvYnMge1xuICAgIHN0YXJ0KCkge1xuICAgICAgICBuZXcgQ3JvbkpvYignKiAqICogKi8xMCAqIConLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgam9iID0gbmV3IEpvYkNsZWFyTG9nKCk7XG4gICAgICAgICAgICBqb2IuY2xlYXJMb2dCeVR5cGUoXCJsb2dfcmVxdWVzdFwiKTtcbiAgICAgICAgfSwgbnVsbCwgdHJ1ZSwgJycpO1xuICAgICAgICBuZXcgQ3JvbkpvYignKiAqICogKi8xMCAqIConLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgam9iID0gbmV3IEpvYkNsZWFyTG9nKCk7XG4gICAgICAgICAgICBqb2IuY2xlYXJMb2dCeVR5cGUoXCJsb2dfbG9naW5cIik7XG4gICAgICAgIH0sIG51bGwsIHRydWUsICcnKTtcbiAgICAgICAgbmV3IENyb25Kb2IoJyogKiAqICovNSAqIConLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgam9iID0gbmV3IEpvYkNsZWFyTG9nKCk7XG4gICAgICAgICAgICBqb2IuY2xlYXJMb2coKTtcbiAgICAgICAgfSwgbnVsbCwgdHJ1ZSwgJycpO1xuXG4gICAgICAgIG5ldyBDcm9uSm9iKCcwIDEgMSAxICogKicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHZhciBjb21tYW5kID0gXCIgLWQgJ3sndGl0bGUnOiAnTW9udGhseSByZXBvcnQgcnVuJyB9JyAtSCAnQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyBodHRwczovL2RhdGFyZWFkaW5ncy5mb2N1c3RlY2gudm4vQ2xpZW50UmVwb3J0L2dldERhdGFSZXBvcnRNb250aEVtYWlsXCI7XG4gICAgICAgICAgICAvLyBzaGVsbC5leGVjKCdjdXJsICcgKyBjb21tYW5kLCBmdW5jdGlvbiAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2coJ3N0ZG91dDogJyArIHN0ZG91dCk7XG4gICAgICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2coJ3N0ZGVycjogJyArIHN0ZGVycik7XG4gICAgICAgICAgICAvLyAgICAgaWYgKGVycm9yICE9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCdleGVjIGVycm9yOiAnICsgZXJyb3IpO1xuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICB9LCBudWxsLCB0cnVlLCAnJyk7XG5cbiAgICAgICAgbmV3IENyb25Kb2IoJzAgMSAxIDEgMSAqJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gdmFyIGNvbW1hbmQgPSBcIiAtZCAneyd0aXRsZSc6ICdZZWFyIHJlcG9ydCBydW4nIH0nIC1IICdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nIGh0dHBzOi8vZGF0YXJlYWRpbmdzLmZvY3VzdGVjaC52bi9DbGllbnRSZXBvcnQvZ2V0RGF0YVJlcG9ydFllYXJFbWFpbFwiO1xuICAgICAgICAgICAgLy8gc2hlbGwuZXhlYygnY3VybCAnICsgY29tbWFuZCwgZnVuY3Rpb24gKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKCdzdGRvdXQ6ICcgKyBzdGRvdXQpO1xuICAgICAgICAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKCdzdGRlcnI6ICcgKyBzdGRlcnIpO1xuICAgICAgICAgICAgLy8gICAgIGlmIChlcnJvciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZygnZXhlYyBlcnJvcjogJyArIGVycm9yKTtcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgfSwgbnVsbCwgdHJ1ZSwgJycpO1xuXG4gICAgICAgIG5ldyBDcm9uSm9iKCcwMCAwMCAyMCAqICogMC02JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzaGVsbC5leGVjKFwiY3VybCAtSCAnQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyAtWCBQT1NUIC1kICd7fScgJ2h0dHBzOi8vZGF0YXJlYWRpbmdzLmZvY3VzdGVjaC52bi9DbGllbnRSZXBvcnQvZ2V0RGF0YURhaWx5UmVwb3J0RW1haWwnXCIsIGZ1bmN0aW9uIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJ1biBkYWlseSByZXBvcnQgZG9uZVwiKTtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2V4ZWMgZXJyb3I6ICcgKyBlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSwgbnVsbCwgdHJ1ZSwgJycpO1xuXG5cbiAgICAgICAgbmV3IENyb25Kb2IoJzAwICovMTAgMDUtMTggKiAqIConLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzaGVsbC5leGVjKFwiY3VybCAtSCAnQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyAtWCBQT1NUIC1kICd7fScgJ2h0dHBzOi8vZGF0YXJlYWRpbmdzLmZvY3VzdGVjaC52bi9CYXRjaEpvYi9ydW5Ob0NvbW11bmljYXRpb24nXCIsIGZ1bmN0aW9uIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJ1biBzY2FuIHN5c3RlbSBhbGFybSByZXBvcnQgZG9uZVwiKTtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2V4ZWMgZXJyb3I6ICcgKyBlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSwgbnVsbCwgdHJ1ZSwgJycpO1xuXG5cbiAgICAgICAgLy8gYmF0Y2ggam9iIGRldmljZSByZXNldCBlbmVyZ3kgdG9kYXlcbiAgICAgICAgbmV3IENyb25Kb2IoJzAwIDAwIDAwICogKiAqJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2hlbGwuZXhlYyhcImN1cmwgLUggJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicgLVggUE9TVCAtZCAne30nICdodHRwczovL2RhdGFyZWFkaW5ncy5mb2N1c3RlY2gudm4vQmF0Y2hKb2IvcmVzZXRUb2RheUVuZXJneSdcIiwgZnVuY3Rpb24gKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYmF0Y2ggam9iIGRldmljZSByZXNldCBlbmVyZ3kgdG9kYXlcIik7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdleGVjIGVycm9yOiAnICsgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sIG51bGwsIHRydWUsICcnKTtcblxuXG4gICAgICAgIC8vIGJhdGNoIGpvYiBkZXZpY2UgcmVzZXQgcG93ZXIgbm93XG4gICAgICAgIG5ldyBDcm9uSm9iKCcwMCAwMCAxOSAqICogKicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNoZWxsLmV4ZWMoXCJjdXJsIC1IICdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nIC1YIFBPU1QgLWQgJ3t9JyAnaHR0cHM6Ly9hcGlzZXJ2ZXIudGVjaGVkZ2Uudm4vQmF0Y2hKb2IvcmVzZXRQb3dlck5vdydcIiwgZnVuY3Rpb24gKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYmF0Y2ggam9iIGRldmljZSByZXNldCBwb3dlciBub3dcIik7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdleGVjIGVycm9yOiAnICsgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sIG51bGwsIHRydWUsICcnKTtcblxuXG4gICAgICAgIC8vIGJhdGNoIGpvYiB1cGRhdGUgZGF0YSBkZXZpY2VcbiAgICAgICAgbmV3IENyb25Kb2IoJzAwICovMSAqICogKiAqJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2hlbGwuZXhlYyhcImN1cmwgLUggJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicgLVggUE9TVCAtZCAne30nICdodHRwczovL2FwaXNlcnZlci50ZWNoZWRnZS52bi9CYXRjaEpvYi91cGRhdGVkRGV2aWNlUGxhbnQnXCIsIGZ1bmN0aW9uIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJ1biBzY2FuIGRldmljZSB1cGRhdGUgZG9uZVwiKTtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2V4ZWMgZXJyb3I6ICcgKyBlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSwgbnVsbCwgdHJ1ZSwgJycpO1xuXG5cbiAgICAgICAgLy8gYmF0Y2ggam9iIHN0cmluZyBwZXJmb3JtYW5jZVxuICAgICAgICBuZXcgQ3JvbkpvYignMDAgMDAgMTkgKiAqIConLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzaGVsbC5leGVjKFwiY3VybCAtSCAnQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyAtWCBQT1NUIC1kICd7fScgJ2h0dHBzOi8vYXBpc2VydmVyLnRlY2hlZGdlLnZuL0JhdGNoSm9iL2NoZWNrUGVyZm9ybWFuY2VJbmRleCdcIiwgZnVuY3Rpb24gKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYmF0Y2ggam9iIHN0cmluZyBwZXJmb3JtYW5jZVwiKTtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2V4ZWMgZXJyb3I6ICcgKyBlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSwgbnVsbCwgdHJ1ZSwgJycpO1xuXG4gICAgfVxufSJdfQ==