'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseController2 = require('../core/BaseController');

var _BaseController3 = _interopRequireDefault(_BaseController2);

var _BatchJobService = require('../services/BatchJobService');

var _BatchJobService2 = _interopRequireDefault(_BatchJobService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BatchJobController = function (_BaseController) {
    _inherits(BatchJobController, _BaseController);

    function BatchJobController() {
        _classCallCheck(this, BatchJobController);

        return _possibleConstructorReturn(this, (BatchJobController.__proto__ || Object.getPrototypeOf(BatchJobController)).call(this));
    }

    /**
     * @description run batch job no communication
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */


    _createClass(BatchJobController, [{
        key: 'runNoCommunication',
        value: function runNoCommunication(res, postData) {
            try {
                var service = new _BatchJobService2.default();
                service.runNoCommunication({}, function (err, rs) {
                    var resData = {};
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    }
                    res.send(resData);
                });
            } catch (e) {
                var resData = {};
                resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description run batch job reset energy today
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'resetTodayEnergy',
        value: function resetTodayEnergy(res, postData) {
            try {
                var service = new _BatchJobService2.default();
                service.resetTodayEnergy({}, function (err, rs) {
                    var resData = {};
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    }
                    res.send(resData);
                });
            } catch (e) {
                var resData = {};
                resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description run batch job reset power now
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'resetPowerNow',
        value: function resetPowerNow(res, postData) {
            try {
                var service = new _BatchJobService2.default();
                service.resetPowerNow({}, function (err, rs) {
                    var resData = {};
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    }
                    res.send(resData);
                });
            } catch (e) {
                var resData = {};
                resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description run batch job reset power now
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'updatedDevicePlant',
        value: function updatedDevicePlant(res, postData) {
            try {
                var service = new _BatchJobService2.default();
                service.updatedDevicePlant({}, function (err, rs) {
                    var resData = {};
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    }
                    res.send(resData);
                });
            } catch (e) {
                var resData = {};
                resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        // Performance index
        /**
             * @description run batch job reset power now
             * @author Long.Pham
             * @since 14/09/2021
             * @param {*} res 
             * @param {*} postData 
             */

    }, {
        key: 'checkPerformanceIndex',
        value: function checkPerformanceIndex(res, postData) {
            try {
                var service = new _BatchJobService2.default();
                service.checkPerformanceIndex({}, function (err, rs) {
                    var resData = {};
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    }
                    res.send(resData);
                });
            } catch (e) {
                var resData = {};
                resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description Get report year email
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */
        // getDataReportYearEmail(res, postData) {
        //     try {
        //         var service = new BatchJobService();
        //         let entity = new ProjectEntity();
        //         entity = Object.assign({}, entity, postData);
        //         service.getDataReportYearEmail(entity, function (err, rs) {
        //             var resData = {};
        //             if (!err) {
        //                 if (rs.length > 0) {
        //                     for (var i = 0; i < rs.length; i++) {
        //                         // Sent mail 
        //                         rs[i].logo = Constants.cms_url.logo;
        //                         // if (!Libs.isBlank(rs[i].email)) {
        //                         var html = reportRender.render("reports/year", rs[i]);
        //                         SentMail.SentMailHTML('solarmon@techedge.vn', 'vanlong200880@gmail.com', 'Solarmon year report', html);
        //                         // }
        //                     }
        //                 }
        //                 resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
        //             } else {
        //                 resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
        //             }
        //             res.send(resData);
        //         });
        //     } catch (e) {
        //         var resData = {};
        //         resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
        //         res.send(resData);
        //     }
        // }


        // /**
        //  * @description Get report year email
        //  * @author Long.Pham
        //  * @since 14/09/2021
        //  * @param {*} res 
        //  * @param {*} postData 
        //  */
        // getDataDailyReportEmail(res, postData) {
        //     try {
        //         var service = new BatchJobService();
        //         let entity = new ProjectEntity();
        //         entity = Object.assign({}, entity, postData);
        //         service.getDataDailyReportEmail(entity, function (err, rs) {
        //             var resData = {};
        //             if (!err) {
        //                 if (rs.length > 0) {
        //                     for (var i = 0; i < rs.length; i++) {
        //                         // Sent mail 
        //                         rs[i].logo = Constants.cms_url.logo;
        //                         if (!Libs.isBlank(rs[i].email)) {
        //                             var alerts = rs[i].alerts;
        //                             rs[i].countAlers = alerts.length > 0 ? 1 : 0;
        //                             var html = reportRender.render("reports/daily", rs[i]);
        //                             SentMail.SentMailHTML(null, rs[i].email, 'Solarmon daily report - ' + moment().format("DD/MM/YYYY"), html);
        //                         }
        //                     }
        //                 }
        //                 resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
        //             } else {
        //                 resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
        //             }
        //             res.send(resData);
        //         });
        //     } catch (e) {
        //         var resData = {};
        //         resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
        //         res.send(resData);
        //     }
        // }


        // /**
        //  * @description Get report month
        //  * @author Long.Pham
        //  * @since 14/09/2021
        //  * @param {*} res 
        //  * @param {*} postData 
        //  */
        // getDataReportMonth(res, postData) {
        //     try {
        //         var service = new BatchJobService();
        //         let entity = new ProjectEntity();
        //         entity = Object.assign({}, entity, postData);
        //         service.getDataReportMonth(entity, function (err, rs) {
        //             var resData = {};
        //             if (!err) {
        //                 resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
        //             } else {
        //                 resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
        //             }
        //             res.send(resData);
        //         });
        //     } catch (e) {
        //         var resData = {};
        //         resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
        //         res.send(resData);
        //     }
        // }


        // /**
        // * @description Get report year
        // * @author Long.Pham
        // * @since 14/09/2021
        // * @param {*} res 
        // * @param {*} postData 
        // */
        // getDataReportYear(res, postData) {
        //     try {
        //         var service = new BatchJobService();
        //         let entity = new ProjectEntity();
        //         entity = Object.assign({}, entity, postData);
        //         service.getDataReportYear(entity, function (err, rs) {
        //             var resData = {};
        //             if (!err) {
        //                 resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
        //             } else {
        //                 resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
        //             }
        //             res.send(resData);
        //         });
        //     } catch (e) {
        //         var resData = {};
        //         resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
        //         res.send(resData);
        //     }
        // }


        /**
         * @description Get detail item
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'getDetail',
        value: function getDetail(res, postData) {}

        /**
         * @description Save action
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'saveAction',
        value: async function saveAction(res, postData) {}

        /**
         * @description Get List item
         * @author Long.Pham
         * @since 14/09/2021
         * @param {} res 
         * @param {*} postData 
         */

    }, {
        key: 'getList',
        value: function getList(res, postData) {}

        /**
         * @description Delete item
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'deleteAction',
        value: function deleteAction(res, postData) {}
    }]);

    return BatchJobController;
}(_BaseController3.default);

exports.default = BatchJobController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0JhdGNoSm9iQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJCYXRjaEpvYkNvbnRyb2xsZXIiLCJyZXMiLCJwb3N0RGF0YSIsInNlcnZpY2UiLCJCYXRjaEpvYlNlcnZpY2UiLCJydW5Ob0NvbW11bmljYXRpb24iLCJlcnIiLCJycyIsInJlc0RhdGEiLCJMaWJzIiwicmV0dXJuSnNvblJlc3VsdCIsImkxOG4iLCJfXyIsInNlbmQiLCJlIiwicmVzZXRUb2RheUVuZXJneSIsInJlc2V0UG93ZXJOb3ciLCJ1cGRhdGVkRGV2aWNlUGxhbnQiLCJjaGVja1BlcmZvcm1hbmNlSW5kZXgiLCJCYXNlQ29udHJvbGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTUEsa0I7OztBQUNGLGtDQUFjO0FBQUE7O0FBQUE7QUFFYjs7QUFHRDs7Ozs7Ozs7Ozs7MkNBT21CQyxHLEVBQUtDLFEsRUFBVTtBQUM5QixnQkFBSTtBQUNBLG9CQUFJQyxVQUFVLElBQUlDLHlCQUFKLEVBQWQ7QUFDQUQsd0JBQVFFLGtCQUFSLENBQTJCLEVBQTNCLEVBQStCLFVBQVVDLEdBQVYsRUFBZUMsRUFBZixFQUFtQjtBQUM5Qyx3QkFBSUMsVUFBVSxFQUFkO0FBQ0Esd0JBQUksQ0FBQ0YsR0FBTCxFQUFVO0FBQ05FLGtDQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixJQUF0QixFQUE0QkMsS0FBS0MsRUFBTCxDQUFRLGdCQUFSLENBQTVCLEVBQXVELEVBQXZELEVBQTJELENBQTNELENBQVY7QUFDSCxxQkFGRCxNQUVPO0FBQ0hKLGtDQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QkMsS0FBS0MsRUFBTCxDQUFRLGFBQVIsQ0FBN0IsRUFBcUQsRUFBckQsRUFBeUQsQ0FBekQsQ0FBVjtBQUNIO0FBQ0RYLHdCQUFJWSxJQUFKLENBQVNMLE9BQVQ7QUFDSCxpQkFSRDtBQVNILGFBWEQsQ0FXRSxPQUFPTSxD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RUFBVSxDQUUvQjs7QUFJRDs7Ozs7Ozs7OztnQ0FPUUQsRyxFQUFLQyxRLEVBQVUsQ0FHdEI7O0FBS0Q7Ozs7Ozs7Ozs7cUNBT2FELEcsRUFBS0MsUSxFQUFVLENBRTNCOzs7O0VBbFY0QmlCLHdCOztrQkFzVmxCbkIsa0IiLCJmaWxlIjoiQmF0Y2hKb2JDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VDb250cm9sbGVyIGZyb20gJy4uL2NvcmUvQmFzZUNvbnRyb2xsZXInO1xuaW1wb3J0IEJhdGNoSm9iU2VydmljZSBmcm9tICcuLi9zZXJ2aWNlcy9CYXRjaEpvYlNlcnZpY2UnO1xuXG5jbGFzcyBCYXRjaEpvYkNvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gcnVuIGJhdGNoIGpvYiBubyBjb21tdW5pY2F0aW9uXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTQvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgcnVuTm9Db21tdW5pY2F0aW9uKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gbmV3IEJhdGNoSm9iU2VydmljZSgpO1xuICAgICAgICAgICAgc2VydmljZS5ydW5Ob0NvbW11bmljYXRpb24oe30sIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gcnVuIGJhdGNoIGpvYiByZXNldCBlbmVyZ3kgdG9kYXlcbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICByZXNldFRvZGF5RW5lcmd5KHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gbmV3IEJhdGNoSm9iU2VydmljZSgpO1xuICAgICAgICAgICAgc2VydmljZS5yZXNldFRvZGF5RW5lcmd5KHt9LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBydW4gYmF0Y2ggam9iIHJlc2V0IHBvd2VyIG5vd1xuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIHJlc2V0UG93ZXJOb3cocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgQmF0Y2hKb2JTZXJ2aWNlKCk7XG4gICAgICAgICAgICBzZXJ2aWNlLnJlc2V0UG93ZXJOb3coe30sIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gcnVuIGJhdGNoIGpvYiByZXNldCBwb3dlciBub3dcbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICB1cGRhdGVkRGV2aWNlUGxhbnQocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgQmF0Y2hKb2JTZXJ2aWNlKCk7XG4gICAgICAgICAgICBzZXJ2aWNlLnVwZGF0ZWREZXZpY2VQbGFudCh7fSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvLyBQZXJmb3JtYW5jZSBpbmRleFxuICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gcnVuIGJhdGNoIGpvYiByZXNldCBwb3dlciBub3dcbiAgICAgICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICAgICAqL1xuICAgIGNoZWNrUGVyZm9ybWFuY2VJbmRleChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc2VydmljZSA9IG5ldyBCYXRjaEpvYlNlcnZpY2UoKTtcbiAgICAgICAgICAgIHNlcnZpY2UuY2hlY2tQZXJmb3JtYW5jZUluZGV4KHt9LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IHJlcG9ydCB5ZWFyIGVtYWlsXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTQvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgLy8gZ2V0RGF0YVJlcG9ydFllYXJFbWFpbChyZXMsIHBvc3REYXRhKSB7XG4gICAgLy8gICAgIHRyeSB7XG4gICAgLy8gICAgICAgICB2YXIgc2VydmljZSA9IG5ldyBCYXRjaEpvYlNlcnZpY2UoKTtcbiAgICAvLyAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgUHJvamVjdEVudGl0eSgpO1xuICAgIC8vICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgLy8gICAgICAgICBzZXJ2aWNlLmdldERhdGFSZXBvcnRZZWFyRW1haWwoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgIC8vICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgLy8gICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgaWYgKHJzLmxlbmd0aCA+IDApIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnMubGVuZ3RoOyBpKyspIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTZW50IG1haWwgXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgcnNbaV0ubG9nbyA9IENvbnN0YW50cy5jbXNfdXJsLmxvZ287XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKCFMaWJzLmlzQmxhbmsocnNbaV0uZW1haWwpKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwicmVwb3J0cy95ZWFyXCIsIHJzW2ldKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBTZW50TWFpbC5TZW50TWFpbEhUTUwoJ3NvbGFybW9uQHRlY2hlZGdlLnZuJywgJ3ZhbmxvbmcyMDA4ODBAZ21haWwuY29tJywgJ1NvbGFybW9uIHllYXIgcmVwb3J0JywgaHRtbCk7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG4gICAgLy8gICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgIC8vICAgICAgICAgfSk7XG4gICAgLy8gICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgLy8gICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAvLyAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG5cbiAgICAvLyAvKipcbiAgICAvLyAgKiBAZGVzY3JpcHRpb24gR2V0IHJlcG9ydCB5ZWFyIGVtYWlsXG4gICAgLy8gICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAvLyAgKiBAc2luY2UgMTQvMDkvMjAyMVxuICAgIC8vICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgIC8vICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgLy8gICovXG4gICAgLy8gZ2V0RGF0YURhaWx5UmVwb3J0RW1haWwocmVzLCBwb3N0RGF0YSkge1xuICAgIC8vICAgICB0cnkge1xuICAgIC8vICAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgQmF0Y2hKb2JTZXJ2aWNlKCk7XG4gICAgLy8gICAgICAgICBsZXQgZW50aXR5ID0gbmV3IFByb2plY3RFbnRpdHkoKTtcbiAgICAvLyAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgIC8vICAgICAgICAgc2VydmljZS5nZXREYXRhRGFpbHlSZXBvcnRFbWFpbChlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgLy8gICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAvLyAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgIC8vICAgICAgICAgICAgICAgICBpZiAocnMubGVuZ3RoID4gMCkge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBycy5sZW5ndGg7IGkrKykge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNlbnQgbWFpbCBcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICByc1tpXS5sb2dvID0gQ29uc3RhbnRzLmNtc191cmwubG9nbztcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUxpYnMuaXNCbGFuayhyc1tpXS5lbWFpbCkpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFsZXJ0cyA9IHJzW2ldLmFsZXJ0cztcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcnNbaV0uY291bnRBbGVycyA9IGFsZXJ0cy5sZW5ndGggPiAwID8gMSA6IDA7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcInJlcG9ydHMvZGFpbHlcIiwgcnNbaV0pO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgcnNbaV0uZW1haWwsICdTb2xhcm1vbiBkYWlseSByZXBvcnQgLSAnICsgbW9tZW50KCkuZm9ybWF0KFwiREQvTU0vWVlZWVwiKSwgaHRtbCk7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG4gICAgLy8gICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgIC8vICAgICAgICAgfSk7XG4gICAgLy8gICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgLy8gICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAvLyAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG5cblxuXG4gICAgLy8gLyoqXG4gICAgLy8gICogQGRlc2NyaXB0aW9uIEdldCByZXBvcnQgbW9udGhcbiAgICAvLyAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgIC8vICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgLy8gICogQHBhcmFtIHsqfSByZXMgXG4gICAgLy8gICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAvLyAgKi9cbiAgICAvLyBnZXREYXRhUmVwb3J0TW9udGgocmVzLCBwb3N0RGF0YSkge1xuICAgIC8vICAgICB0cnkge1xuICAgIC8vICAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgQmF0Y2hKb2JTZXJ2aWNlKCk7XG4gICAgLy8gICAgICAgICBsZXQgZW50aXR5ID0gbmV3IFByb2plY3RFbnRpdHkoKTtcbiAgICAvLyAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgIC8vICAgICAgICAgc2VydmljZS5nZXREYXRhUmVwb3J0TW9udGgoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgIC8vICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgLy8gICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCAwKTtcbiAgICAvLyAgICAgICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgLy8gICAgICAgICB9KTtcbiAgICAvLyAgICAgfSBjYXRjaCAoZSkge1xuICAgIC8vICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAvLyAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgIC8vICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG5cblxuICAgIC8vIC8qKlxuICAgIC8vICogQGRlc2NyaXB0aW9uIEdldCByZXBvcnQgeWVhclxuICAgIC8vICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAvLyAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgLy8gKiBAcGFyYW0geyp9IHJlcyBcbiAgICAvLyAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgLy8gKi9cbiAgICAvLyBnZXREYXRhUmVwb3J0WWVhcihyZXMsIHBvc3REYXRhKSB7XG4gICAgLy8gICAgIHRyeSB7XG4gICAgLy8gICAgICAgICB2YXIgc2VydmljZSA9IG5ldyBCYXRjaEpvYlNlcnZpY2UoKTtcbiAgICAvLyAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgUHJvamVjdEVudGl0eSgpO1xuICAgIC8vICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgLy8gICAgICAgICBzZXJ2aWNlLmdldERhdGFSZXBvcnRZZWFyKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAvLyAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgIC8vICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG4gICAgLy8gICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgIC8vICAgICAgICAgfSk7XG4gICAgLy8gICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgLy8gICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAvLyAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgZGV0YWlsIGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBnZXREZXRhaWwocmVzLCBwb3N0RGF0YSkge1xuXG4gICAgfVxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFNhdmUgYWN0aW9uXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTQvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgYXN5bmMgc2F2ZUFjdGlvbihyZXMsIHBvc3REYXRhKSB7XG5cbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBMaXN0IGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHt9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldExpc3QocmVzLCBwb3N0RGF0YSkge1xuXG5cbiAgICB9XG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRGVsZXRlIGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBkZWxldGVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuXG4gICAgfVxuXG5cbn1cbmV4cG9ydCBkZWZhdWx0IEJhdGNoSm9iQ29udHJvbGxlcjsiXX0=