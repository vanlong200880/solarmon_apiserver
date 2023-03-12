'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseController2 = require('../core/BaseController');

var _BaseController3 = _interopRequireDefault(_BaseController2);

var _ClientActivitiesService = require('../services/ClientActivitiesService');

var _ClientActivitiesService2 = _interopRequireDefault(_ClientActivitiesService);

var _AlertEntity = require('../entities/AlertEntity');

var _AlertEntity2 = _interopRequireDefault(_AlertEntity);

var _AlertValidate = require('../validator/AlertValidate');

var _AlertValidate2 = _interopRequireDefault(_AlertValidate);

var _sync = require('sync');

var _sync2 = _interopRequireDefault(_sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClientActivitiesController = function (_BaseController) {
    _inherits(ClientActivitiesController, _BaseController);

    function ClientActivitiesController() {
        _classCallCheck(this, ClientActivitiesController);

        return _possibleConstructorReturn(this, (ClientActivitiesController.__proto__ || Object.getPrototypeOf(ClientActivitiesController)).call(this));
    }

    /**
     * @description Get List item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {} res 
     * @param {*} postData 
     */


    _createClass(ClientActivitiesController, [{
        key: 'getList',
        value: function getList(res, postData) {
            try {
                var service = new _ClientActivitiesService2.default();
                var entity = new _AlertEntity2.default();
                entity = Object.assign({}, entity, postData);
                if (!Libs.isBlank(entity.date_from)) {
                    entity.date_from = Libs.convertStr2DateV01(entity.date_from, "dd/mm/yyyy", "/");
                }

                if (!Libs.isBlank(entity.date_to)) {
                    entity.date_to = Libs.convertStr2DateV01(entity.date_to, "dd/mm/yyyy", "/");
                }

                service.getList(entity, function (err, rs) {
                    if (!err) {
                        service.getSize(entity, function (err1, rs1) {
                            if (!err1) {
                                resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, rs1.totalRow);
                            } else {
                                resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                            }
                            res.send(resData);
                        });
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                        res.send(resData);
                    }
                });
            } catch (e) {
                this.logger.error("Lỗi: " + e);
                var resData = {};
                resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description Delete item
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'deleteAction',
        value: function deleteAction(res, postData) {
            try {
                var service = new _ClientActivitiesService2.default();
                var entity = new _AlertEntity2.default();
                entity = Object.assign({}, entity, postData);
                var resData = {};
                if (Libs.isBlank(entity.id)) {
                    resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                    res.send(resData);
                    return;
                }

                service.delete(entity, function (err, rs) {
                    if (!err) {
                        if (rs) {
                            resData = Libs.returnJsonResult(true, i18n.__('ACTION.DELETE_SUCCESS'), entity, 1);
                        } else {
                            resData = Libs.returnJsonResult(false, i18n.__('ACTION.DELETE_FAIL'), {}, 1);
                        }
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__('ACTION.DELETE_FAIL'), {}, 1);
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
         * @description Delete item
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'closeAll',
        value: function closeAll(res, postData) {
            try {
                var service = new _ClientActivitiesService2.default();
                var entity = Object.assign({}, new _AlertEntity2.default(), postData);

                (0, _sync2.default)(function () {
                    service.closeAll(entity, function (err, rsupdate) {
                        try {
                            if (!rsupdate) {
                                var _resData2 = Libs.returnJsonResult(false, i18n.__('ACTION.DELETE_FAIL'), { "error": err }, 0);
                                res.send(_resData2);
                                return;
                            }
                            var _resData = Libs.returnJsonResult(true, i18n.__('ACTION.DELETE_SUCCESS'), entity, 0);
                            res.send(_resData);
                        } catch (error) {
                            var _resData3 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                            res.send(_resData3);
                        }
                    });
                });
            } catch (e) {
                var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description Save action
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'saveAction',
        value: async function saveAction(res, postData) {
            try {
                var service = new _ClientActivitiesService2.default();
                var entity = Object.assign({}, new _AlertEntity2.default(), postData);
                if (!Libs.isBlank(entity.status) && entity.status == 1) {
                    entity.end_date = null;
                }

                if (!Libs.isBlank(entity.status) && entity.status == 0) {
                    var moment = require("moment");
                    entity.end_date = moment().format('YYYY-MM-DD HH:mm:ss');
                }

                var validate = new _AlertValidate2.default();
                validate.FLValidationAll(entity, async function (err, key) {
                    try {
                        if (err) {
                            var resData = Libs.returnJsonResult(false, err.message, {}, 0);
                            res.send(resData);
                            return;
                        }
                        if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                            (0, _sync2.default)(function () {
                                service.update(entity, function (err, rsupdate) {
                                    try {
                                        if (!rsupdate) {
                                            var _resData5 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                            res.send(_resData5);
                                            return;
                                        }
                                        var _resData4 = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, rsupdate);
                                        res.send(_resData4);
                                    } catch (error) {
                                        var _resData6 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                                        res.send(_resData6);
                                    }
                                });
                            });
                        } else {
                            var _resData7 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), {}, 0);
                            res.send(_resData7);
                        }
                    } catch (e) {
                        var _resData8 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                        res.send(_resData8);
                    }
                });
            } catch (e) {
                var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }
    }]);

    return ClientActivitiesController;
}(_BaseController3.default);

exports.default = ClientActivitiesController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0NsaWVudEFjdGl2aXRpZXNDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkNsaWVudEFjdGl2aXRpZXNDb250cm9sbGVyIiwicmVzIiwicG9zdERhdGEiLCJzZXJ2aWNlIiwiQ2xpZW50QWN0aXZpdGllc1NlcnZpY2UiLCJlbnRpdHkiLCJBbGVydEVudGl0eSIsIk9iamVjdCIsImFzc2lnbiIsIkxpYnMiLCJpc0JsYW5rIiwiZGF0ZV9mcm9tIiwiY29udmVydFN0cjJEYXRlVjAxIiwiZGF0ZV90byIsImdldExpc3QiLCJlcnIiLCJycyIsImdldFNpemUiLCJlcnIxIiwicnMxIiwicmVzRGF0YSIsInJldHVybkpzb25SZXN1bHQiLCJpMThuIiwiX18iLCJ0b3RhbFJvdyIsInNlbmQiLCJlIiwibG9nZ2VyIiwiZXJyb3IiLCJpZCIsImRlbGV0ZSIsImNsb3NlQWxsIiwicnN1cGRhdGUiLCJzdGF0dXMiLCJlbmRfZGF0ZSIsIm1vbWVudCIsInJlcXVpcmUiLCJmb3JtYXQiLCJ2YWxpZGF0ZSIsIkFsZXJ0VmFsaWRhdGUiLCJGTFZhbGlkYXRpb25BbGwiLCJrZXkiLCJtZXNzYWdlIiwiaGFzT3duUHJvcGVydHkiLCJzY3JlZW5fbW9kZSIsIkNvbnN0YW50cyIsInVwZGF0ZSIsIkJhc2VDb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSwwQjs7O0FBQ0YsMENBQWM7QUFBQTs7QUFBQTtBQUViOztBQUdEOzs7Ozs7Ozs7OztnQ0FPUUMsRyxFQUFLQyxRLEVBQVU7QUFDbkIsZ0JBQUk7QUFDQSxvQkFBSUMsVUFBVSxJQUFJQyxpQ0FBSixFQUFkO0FBQ0Esb0JBQUlDLFNBQVMsSUFBSUMscUJBQUosRUFBYjtBQUNBRCx5QkFBU0UsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JILE1BQWxCLEVBQTBCSCxRQUExQixDQUFUO0FB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OiJDbGllbnRBY3Rpdml0aWVzQ29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlQ29udHJvbGxlciBmcm9tICcuLi9jb3JlL0Jhc2VDb250cm9sbGVyJztcbmltcG9ydCBDbGllbnRBY3Rpdml0aWVzU2VydmljZSBmcm9tICcuLi9zZXJ2aWNlcy9DbGllbnRBY3Rpdml0aWVzU2VydmljZSc7XG5pbXBvcnQgQWxlcnRFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvQWxlcnRFbnRpdHknO1xuaW1wb3J0IEFsZXJ0VmFsaWRhdGUgZnJvbSAnLi4vdmFsaWRhdG9yL0FsZXJ0VmFsaWRhdGUnO1xuaW1wb3J0IFN5bmMgZnJvbSAnc3luYyc7XG5cbmNsYXNzIENsaWVudEFjdGl2aXRpZXNDb250cm9sbGVyIGV4dGVuZHMgQmFzZUNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBMaXN0IGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHt9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldExpc3QocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgQ2xpZW50QWN0aXZpdGllc1NlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgQWxlcnRFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoZW50aXR5LmRhdGVfZnJvbSkpIHtcbiAgICAgICAgICAgICAgICBlbnRpdHkuZGF0ZV9mcm9tID0gTGlicy5jb252ZXJ0U3RyMkRhdGVWMDEoZW50aXR5LmRhdGVfZnJvbSwgXCJkZC9tbS95eXl5XCIsIFwiL1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoZW50aXR5LmRhdGVfdG8pKSB7XG4gICAgICAgICAgICAgICAgZW50aXR5LmRhdGVfdG8gPSBMaWJzLmNvbnZlcnRTdHIyRGF0ZVYwMShlbnRpdHkuZGF0ZV90bywgXCJkZC9tbS95eXl5XCIsIFwiL1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VydmljZS5nZXRMaXN0KGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldFNpemUoZW50aXR5LCBmdW5jdGlvbiAoZXJyMSwgcnMxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVycjEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIHJzMS50b3RhbFJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIERlbGV0ZSBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTQvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZGVsZXRlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IENsaWVudEFjdGl2aXRpZXNTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IEFsZXJ0RW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGVudGl0eS5pZCkpIHtcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJOT1RfRVhJU1RcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlcnZpY2UuZGVsZXRlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLkRFTEVURV9TVUNDRVNTJyksIGVudGl0eSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uREVMRVRFX0ZBSUwnKSwge30sIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLkRFTEVURV9GQUlMJyksIHt9LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBEZWxldGUgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGNsb3NlQWxsKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IENsaWVudEFjdGl2aXRpZXNTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IEFsZXJ0RW50aXR5KCksIHBvc3REYXRhKTtcblxuICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VydmljZS5jbG9zZUFsbChlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfU1VDQ0VTUycpLCBlbnRpdHksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZXJyb3IgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGFjdGlvblxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgICBhc3luYyBzYXZlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IENsaWVudEFjdGl2aXRpZXNTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IEFsZXJ0RW50aXR5KCksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKGVudGl0eS5zdGF0dXMpICYmIGVudGl0eS5zdGF0dXMgPT0gMSkge1xuICAgICAgICAgICAgICAgIGVudGl0eS5lbmRfZGF0ZSA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKGVudGl0eS5zdGF0dXMpICYmIGVudGl0eS5zdGF0dXMgPT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vbWVudCA9IHJlcXVpcmUoXCJtb21lbnRcIik7XG4gICAgICAgICAgICAgICAgZW50aXR5LmVuZF9kYXRlID0gbW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB2YWxpZGF0ZSA9IG5ldyBBbGVydFZhbGlkYXRlKCk7XG4gICAgICAgICAgICB2YWxpZGF0ZS5GTFZhbGlkYXRpb25BbGwoZW50aXR5LCBhc3luYyBmdW5jdGlvbiAoZXJyLCBrZXkpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgZXJyLm1lc3NhZ2UsIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbnRpdHkuaGFzT3duUHJvcGVydHkoJ3NjcmVlbl9tb2RlJykgJiYgZW50aXR5LnNjcmVlbl9tb2RlID09IENvbnN0YW50cy5zY3JlZW5fbW9kZS51cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UudXBkYXRlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnN1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcnN1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9TVUNDRVNTJyksIGVudGl0eSwgcnN1cGRhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZXJyb3IgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50QWN0aXZpdGllc0NvbnRyb2xsZXI7Il19