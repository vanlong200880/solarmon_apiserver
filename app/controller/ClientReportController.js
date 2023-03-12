'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseController2 = require('../core/BaseController');

var _BaseController3 = _interopRequireDefault(_BaseController2);

var _ClientReportService = require('../services/ClientReportService');

var _ClientReportService2 = _interopRequireDefault(_ClientReportService);

var _ProjectEntity = require('../entities/ProjectEntity');

var _ProjectEntity2 = _interopRequireDefault(_ProjectEntity);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClientReportController = function (_BaseController) {
    _inherits(ClientReportController, _BaseController);

    function ClientReportController() {
        _classCallCheck(this, ClientReportController);

        return _possibleConstructorReturn(this, (ClientReportController.__proto__ || Object.getPrototypeOf(ClientReportController)).call(this));
    }

    /**
     * @description Get report month email
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */


    _createClass(ClientReportController, [{
        key: 'getDataReportMonthEmail',
        value: function getDataReportMonthEmail(res, postData) {
            try {
                var service = new _ClientReportService2.default();
                var entity = new _ProjectEntity2.default();
                entity = Object.assign({}, entity, postData);
                service.getDataReportMonthEmail(entity, function (err, rs) {
                    var resData = {};
                    if (!err) {
                        if (rs.length > 0) {
                            for (var i = 0; i < rs.length; i++) {
                                // Sent mail 
                                rs[i].logo = Constants.cms_url.logo;
                                if (!Libs.isBlank(rs[i].email)) {
                                    var html = reportRender.render("reports/month", rs[i]);
                                    SentMail.SentMailHTML(null, rs[i].email, 'Solarmon monthly report', html);
                                }
                            }
                        }
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
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

    }, {
        key: 'getDataReportYearEmail',
        value: function getDataReportYearEmail(res, postData) {
            try {
                var service = new _ClientReportService2.default();
                var entity = new _ProjectEntity2.default();
                entity = Object.assign({}, entity, postData);
                service.getDataReportYearEmail(entity, function (err, rs) {
                    var resData = {};
                    if (!err) {
                        if (rs.length > 0) {
                            for (var i = 0; i < rs.length; i++) {
                                // Sent mail 
                                rs[i].logo = Constants.cms_url.logo;
                                // if (!Libs.isBlank(rs[i].email)) {
                                var html = reportRender.render("reports/year", rs[i]);
                                SentMail.SentMailHTML('solarmon@techedge.vn', 'vanlong200880@gmail.com', 'Solarmon year report', html);
                                // }
                            }
                        }
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
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

    }, {
        key: 'getDataDailyReportEmail',
        value: function getDataDailyReportEmail(res, postData) {
            try {
                var service = new _ClientReportService2.default();
                var entity = new _ProjectEntity2.default();
                entity = Object.assign({}, entity, postData);
                service.getDataDailyReportEmail(entity, function (err, rs) {
                    var resData = {};
                    if (!err) {
                        if (rs.length > 0) {
                            for (var i = 0; i < rs.length; i++) {
                                // Sent mail 
                                rs[i].logo = Constants.cms_url.logo;
                                if (!Libs.isBlank(rs[i].email)) {
                                    var alerts = rs[i].alerts;
                                    rs[i].countAlers = alerts.length > 0 ? 1 : 0;
                                    var html = reportRender.render("reports/daily", rs[i]);
                                    SentMail.SentMailHTML(null, rs[i].email, 'Solarmon daily report - ' + (0, _moment2.default)().format("DD/MM/YYYY"), html);
                                }
                            }
                        }
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
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
         * @description Get report month
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'getDataReportMonth',
        value: function getDataReportMonth(res, postData) {
            try {
                var service = new _ClientReportService2.default();
                var entity = new _ProjectEntity2.default();
                entity = Object.assign({}, entity, postData);
                service.getDataReportMonth(entity, function (err, rs) {
                    var resData = {};
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
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
        * @description Get report year
        * @author Long.Pham
        * @since 14/09/2021
        * @param {*} res 
        * @param {*} postData 
        */

    }, {
        key: 'getDataReportYear',
        value: function getDataReportYear(res, postData) {
            try {
                var service = new _ClientReportService2.default();
                var entity = new _ProjectEntity2.default();
                entity = Object.assign({}, entity, postData);
                service.getDataReportYear(entity, function (err, rs) {
                    var resData = {};
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
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

    return ClientReportController;
}(_BaseController3.default);

exports.default = ClientReportController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0NsaWVudFJlcG9ydENvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiQ2xpZW50UmVwb3J0Q29udHJvbGxlciIsInJlcyIsInBvc3REYXRhIiwic2VydmljZSIsIkNsaWVudFJlcG9ydFNlcnZpY2UiLCJlbnRpdHkiLCJQcm9qZWN0RW50aXR5IiwiT2JqZWN0IiwiYXNzaWduIiwiZ2V0RGF0YVJlcG9ydE1vbnRoRW1haWwiLCJlcnIiLCJycyIsInJlc0RhdGEiLCJsZW5ndGgiLCJpIiwibG9nbyIsIkNvbnN0YW50cyIsImNtc191cmwiLCJMaWJzIiwiaXNCbGFuayIsImVtYWlsIiwiaHRtbCIsInJlcG9ydFJlbmRlciIsInJlbmRlciIsIlNlbnRNYWlsIiwiU2VudE1haWxIVE1MIiwicmV0dXJuSnNvblJlc3VsdCIsImkxOG4iLCJfXyIsInNlbmQiLCJlIiwiZ2V0RGF0YVJlcG9ydFllYXJFbWFpbCIsImdldERhdGFEYWlseVJlcG9ydEVtYWlsIiwiYWxlcnRzIiwiY291bnRBbGVycyIsImZvcm1hdCIsImdldERhdGFSZXBvcnRNb250aCIsImdldERhdGFSZXBvcnRZZWFyIiwiQmFzZUNvbnRyb2xsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSxzQjs7O0FBQ0Ysc0NBQWM7QUFBQTs7QUFBQTtBQUViOztBQUdEOzs7Ozs7Ozs7OztnREFPd0JDLEcsRUFBS0MsUSxFQUFVO0FBQ25DLGdCQUFJO0FBQ0Esb0JBQUlDLFVBQVUsSUFBSUMsNkJBQUosRUFBZDtBQUNBLG9CQUFJQyxTQUFTLElBQUlDLHVCQUFKLEVBQWI7QUFDQUQseUJBQVNFLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxNQUFsQixFQUEwQkgsUUFBMUIsQ0FBVDtBQUNBQyx3QkFBUU0sdUJBQVIsQ0FBZ0NKLE1BQWhDLEVBQXdDLFVBQVVLLEdBQVYsRUFBZUMsRUFBZixFQUFt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QVUsRUFBZDtBQUNBLHdCQUFJLENBQUNGLEdBQUwsRUFBVTtBQUNORSxrQ0FBVU0sS0FBS1EsZ0JBQUwsQ0FBc0IsSUFBdEIsRUFBNEJDLEtBQUtDLEVBQUwsQ0FBUSxnQkFBUixDQUE1QixFQUF1RGpCLEVBQXZELEVBQTJELENBQTNELENBQVY7QUFDSCxxQkFGRCxNQUVPO0FBQ0hDLGtDQUFVTSxLQUFLUSxnQkFBTCxDQUFzQixLQUF0QixFQUE2QkMsS0FBS0MsRUFBTCxDQUFRLGFBQVIsQ0FBN0IsRUFBcUQsRUFBckQsRUFBeUQsQ0FBekQsQ0FBVjtBQUNIO0FBQ0QzQix3QkFBSTRCLElBQUosQ0FBU2pCLE9BQVQ7QUFDSCxpQkFSRDtBQVNILGFBYkQsQ0FhRSxPQUFPa0IsQ0FBUCxFQUFVO0FBQ1Isb0JBQUlsQixVQUFVLEVBQWQ7QUFDQUEsMEJBQVVNLEtBQUtRLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsWUFBUixDQUE3QixFQUFvRCxFQUFFLFNBQVNFLElBQUksRUFBZixFQUFwRCxFQUF5RSxDQUF6RSxDQUFWO0FBQ0E3QixvQkFBSTRCLElBQUosQ0FBU2pCLE9BQVQ7QUFDSDtBQUNKOztBQUlEOzs7Ozs7Ozs7O2tDQU9VWCxHLEVBQUtDLFEsRUFBVSxDQUV4Qjs7QUFLRDs7Ozs7Ozs7Ozt5Q0FPaUJELEcsRUFBS0MsUSxFQUFVLENBRS9COztBQUlEOzs7Ozs7Ozs7O2dDQU9RRCxHLEVBQUtDLFEsRUFBVSxDQUd0Qjs7QUFLRDs7Ozs7Ozs7OztxQ0FPYUQsRyxFQUFLQyxRLEVBQVUsQ0FFM0I7Ozs7RUE3T2dDb0Msd0I7O2tCQWlQdEJ0QyxzQiIsImZpbGUiOiJDbGllbnRSZXBvcnRDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VDb250cm9sbGVyIGZyb20gJy4uL2NvcmUvQmFzZUNvbnRyb2xsZXInO1xuaW1wb3J0IENsaWVudFJlcG9ydFNlcnZpY2UgZnJvbSAnLi4vc2VydmljZXMvQ2xpZW50UmVwb3J0U2VydmljZSc7XG5pbXBvcnQgUHJvamVjdEVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Qcm9qZWN0RW50aXR5JztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcblxuY2xhc3MgQ2xpZW50UmVwb3J0Q29udHJvbGxlciBleHRlbmRzIEJhc2VDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgcmVwb3J0IG1vbnRoIGVtYWlsXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTQvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0RGF0YVJlcG9ydE1vbnRoRW1haWwocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgQ2xpZW50UmVwb3J0U2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBQcm9qZWN0RW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0RGF0YVJlcG9ydE1vbnRoRW1haWwoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTZW50IG1haWwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnNbaV0ubG9nbyA9IENvbnN0YW50cy5jbXNfdXJsLmxvZ287XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsocnNbaV0uZW1haWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcInJlcG9ydHMvbW9udGhcIiwgcnNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgcnNbaV0uZW1haWwsICdTb2xhcm1vbiBtb250aGx5IHJlcG9ydCcsIGh0bWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCByZXBvcnQgeWVhciBlbWFpbFxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldERhdGFSZXBvcnRZZWFyRW1haWwocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgQ2xpZW50UmVwb3J0U2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBQcm9qZWN0RW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0RGF0YVJlcG9ydFllYXJFbWFpbChlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNlbnQgbWFpbCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByc1tpXS5sb2dvID0gQ29uc3RhbnRzLmNtc191cmwubG9nbztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoIUxpYnMuaXNCbGFuayhyc1tpXS5lbWFpbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJyZXBvcnRzL3llYXJcIiwgcnNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlbnRNYWlsLlNlbnRNYWlsSFRNTCgnc29sYXJtb25AdGVjaGVkZ2Uudm4nLCAndmFubG9uZzIwMDg4MEBnbWFpbC5jb20nLCAnU29sYXJtb24geWVhciByZXBvcnQnLCBodG1sKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgcmVwb3J0IHllYXIgZW1haWxcbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBnZXREYXRhRGFpbHlSZXBvcnRFbWFpbChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc2VydmljZSA9IG5ldyBDbGllbnRSZXBvcnRTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IFByb2plY3RFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXREYXRhRGFpbHlSZXBvcnRFbWFpbChlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNlbnQgbWFpbCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByc1tpXS5sb2dvID0gQ29uc3RhbnRzLmNtc191cmwubG9nbztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUxpYnMuaXNCbGFuayhyc1tpXS5lbWFpbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFsZXJ0cyA9IHJzW2ldLmFsZXJ0cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcnNbaV0uY291bnRBbGVycyA9IGFsZXJ0cy5sZW5ndGggPiAwID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcInJlcG9ydHMvZGFpbHlcIiwgcnNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgcnNbaV0uZW1haWwsICdTb2xhcm1vbiBkYWlseSByZXBvcnQgLSAnICsgbW9tZW50KCkuZm9ybWF0KFwiREQvTU0vWVlZWVwiKSwgaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCByZXBvcnQgbW9udGhcbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBnZXREYXRhUmVwb3J0TW9udGgocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgQ2xpZW50UmVwb3J0U2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBQcm9qZWN0RW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0RGF0YVJlcG9ydE1vbnRoKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAqIEBkZXNjcmlwdGlvbiBHZXQgcmVwb3J0IHllYXJcbiAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgKiBAc2luY2UgMTQvMDkvMjAyMVxuICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICovXG4gICAgZ2V0RGF0YVJlcG9ydFllYXIocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgQ2xpZW50UmVwb3J0U2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBQcm9qZWN0RW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0RGF0YVJlcG9ydFllYXIoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBkZXRhaWwgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldERldGFpbChyZXMsIHBvc3REYXRhKSB7XG5cbiAgICB9XG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBhY3Rpb25cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBhc3luYyBzYXZlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcblxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0ge30gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0TGlzdChyZXMsIHBvc3REYXRhKSB7XG5cblxuICAgIH1cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBEZWxldGUgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGRlbGV0ZUFjdGlvbihyZXMsIHBvc3REYXRhKSB7XG5cbiAgICB9XG5cblxufVxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50UmVwb3J0Q29udHJvbGxlcjsiXX0=