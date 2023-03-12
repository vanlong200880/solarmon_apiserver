'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseController2 = require('../core/BaseController');

var _BaseController3 = _interopRequireDefault(_BaseController2);

var _MainActivitiesService = require('../services/MainActivitiesService');

var _MainActivitiesService2 = _interopRequireDefault(_MainActivitiesService);

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

var MainActivitiesController = function (_BaseController) {
    _inherits(MainActivitiesController, _BaseController);

    function MainActivitiesController() {
        _classCallCheck(this, MainActivitiesController);

        return _possibleConstructorReturn(this, (MainActivitiesController.__proto__ || Object.getPrototypeOf(MainActivitiesController)).call(this));
    }

    /**
     * @description Get List item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {} res 
     * @param {*} postData 
     */


    _createClass(MainActivitiesController, [{
        key: 'getList',
        value: function getList(res, postData) {
            try {
                var service = new _MainActivitiesService2.default();
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
                var service = new _MainActivitiesService2.default();
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
                var service = new _MainActivitiesService2.default();
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
                var service = new _MainActivitiesService2.default();
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

    return MainActivitiesController;
}(_BaseController3.default);

exports.default = MainActivitiesController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL01haW5BY3Rpdml0aWVzQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJNYWluQWN0aXZpdGllc0NvbnRyb2xsZXIiLCJyZXMiLCJwb3N0RGF0YSIsInNlcnZpY2UiLCJNYWluQWN0aXZpdGllc1NlcnZpY2UiLCJlbnRpdHkiLCJBbGVydEVudGl0eSIsIk9iamVjdCIsImFzc2lnbiIsIkxpYnMiLCJpc0JsYW5rIiwiZGF0ZV9mcm9tIiwiY29udmVydFN0cjJEYXRlVjAxIiwiZGF0ZV90byIsImdldExpc3QiLCJlcnIiLCJycyIsImdldFNpemUiLCJlcnIxIiwicnMxIiwicmVzRGF0YSIsInJldHVybkpzb25SZXN1bHQiLCJpMThuIiwiX18iLCJ0b3RhbFJvdyIsInNlbmQiLCJlIiwibG9nZ2VyIiwiZXJyb3IiLCJpZCIsImRlbGV0ZSIsImNsb3NlQWxsIiwicnN1cGRhdGUiLCJzdGF0dXMiLCJlbmRfZGF0ZSIsIm1vbWVudCIsInJlcXVpcmUiLCJmb3JtYXQiLCJ2YWxpZGF0ZSIsIkFsZXJ0VmFsaWRhdGUiLCJGTFZhbGlkYXRpb25BbGwiLCJrZXkiLCJtZXNzYWdlIiwiaGFzT3duUHJvcGVydHkiLCJzY3JlZW5fbW9kZSIsIkNvbnN0YW50cyIsInVwZGF0ZSIsIkJhc2VDb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSx3Qjs7O0FBQ0Ysd0NBQWM7QUFBQTs7QUFBQTtBQUViOztBQUdEOzs7Ozs7Ozs7OztnQ0FPUUMsRyxFQUFLQyxRLEVBQVU7QUFDbkIsZ0JBQUk7QUFDQSxvQkFBSUMsVUFBVSxJQUFJQywrQkFBSixFQUFkO0FBQ0Esb0JBQUlDLFNBQVMsSUFBSUMscUJBQUosRUFBYjtBQUNBRCx5QkFBU0UsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JILE1BQWxCLEVBQTBCSCxRQUExQixDQUFUO0FBQ0Esb0JB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QWN0aXZpdGllc0NvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUNvbnRyb2xsZXIgZnJvbSAnLi4vY29yZS9CYXNlQ29udHJvbGxlcic7XG5pbXBvcnQgTWFpbkFjdGl2aXRpZXNTZXJ2aWNlIGZyb20gJy4uL3NlcnZpY2VzL01haW5BY3Rpdml0aWVzU2VydmljZSc7XG5pbXBvcnQgQWxlcnRFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvQWxlcnRFbnRpdHknO1xuaW1wb3J0IEFsZXJ0VmFsaWRhdGUgZnJvbSAnLi4vdmFsaWRhdG9yL0FsZXJ0VmFsaWRhdGUnO1xuaW1wb3J0IFN5bmMgZnJvbSAnc3luYyc7XG5cbmNsYXNzIE1haW5BY3Rpdml0aWVzQ29udHJvbGxlciBleHRlbmRzIEJhc2VDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgTGlzdCBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTQvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7fSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBnZXRMaXN0KHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IE1haW5BY3Rpdml0aWVzU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBBbGVydEVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBpZiAoIUxpYnMuaXNCbGFuayhlbnRpdHkuZGF0ZV9mcm9tKSkge1xuICAgICAgICAgICAgICAgIGVudGl0eS5kYXRlX2Zyb20gPSBMaWJzLmNvbnZlcnRTdHIyRGF0ZVYwMShlbnRpdHkuZGF0ZV9mcm9tLCBcImRkL21tL3l5eXlcIiwgXCIvXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIUxpYnMuaXNCbGFuayhlbnRpdHkuZGF0ZV90bykpIHtcbiAgICAgICAgICAgICAgICBlbnRpdHkuZGF0ZV90byA9IExpYnMuY29udmVydFN0cjJEYXRlVjAxKGVudGl0eS5kYXRlX3RvLCBcImRkL21tL3l5eXlcIiwgXCIvXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZXJ2aWNlLmdldExpc3QoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0U2l6ZShlbnRpdHksIGZ1bmN0aW9uIChlcnIxLCByczEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXJyMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgcnMxLnRvdGFsUm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihcIkzhu5dpOiBcIiArIGUpO1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRGVsZXRlIGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBkZWxldGVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgTWFpbkFjdGl2aXRpZXNTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IEFsZXJ0RW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGVudGl0eS5pZCkpIHtcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJOT1RfRVhJU1RcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlcnZpY2UuZGVsZXRlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLkRFTEVURV9TVUNDRVNTJyksIGVudGl0eSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uREVMRVRFX0ZBSUwnKSwge30sIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLkRFTEVURV9GQUlMJyksIHt9LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBEZWxldGUgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGNsb3NlQWxsKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IE1haW5BY3Rpdml0aWVzU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBBbGVydEVudGl0eSgpLCBwb3N0RGF0YSk7XG5cbiAgICAgICAgICAgIFN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlcnZpY2UuY2xvc2VBbGwoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCByc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uREVMRVRFX0ZBSUwnKSwgeyBcImVycm9yXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uREVMRVRFX1NVQ0NFU1MnKSwgZW50aXR5LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGVycm9yIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBhY3Rpb25cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICAgYXN5bmMgc2F2ZUFjdGlvbihyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBNYWluQWN0aXZpdGllc1NlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgQWxlcnRFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoZW50aXR5LnN0YXR1cykgJiYgZW50aXR5LnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgZW50aXR5LmVuZF9kYXRlID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoZW50aXR5LnN0YXR1cykgJiYgZW50aXR5LnN0YXR1cyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW9tZW50ID0gcmVxdWlyZShcIm1vbWVudFwiKTtcbiAgICAgICAgICAgICAgICBlbnRpdHkuZW5kX2RhdGUgPSBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHZhbGlkYXRlID0gbmV3IEFsZXJ0VmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHZhbGlkYXRlLkZMVmFsaWRhdGlvbkFsbChlbnRpdHksIGFzeW5jIGZ1bmN0aW9uIChlcnIsIGtleSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBlcnIubWVzc2FnZSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVudGl0eS5oYXNPd25Qcm9wZXJ0eSgnc2NyZWVuX21vZGUnKSAmJiBlbnRpdHkuc2NyZWVuX21vZGUgPT0gQ29uc3RhbnRzLnNjcmVlbl9tb2RlLnVwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS51cGRhdGUoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCByc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX0ZBSUwnKSwgeyBcImVycm9yXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX1NVQ0NFU1MnKSwgZW50aXR5LCByc3VwZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlcnJvciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBNYWluQWN0aXZpdGllc0NvbnRyb2xsZXI7Il19