'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractManagerController = require('../core/AbstractManagerController');

var _AbstractManagerController2 = _interopRequireDefault(_AbstractManagerController);

var _DeviceEntity = require('../entities/DeviceEntity');

var _DeviceEntity2 = _interopRequireDefault(_DeviceEntity);

var _DeviceService = require('../services/DeviceService');

var _DeviceService2 = _interopRequireDefault(_DeviceService);

var _DeviceValidate = require('../validator/DeviceValidate');

var _DeviceValidate2 = _interopRequireDefault(_DeviceValidate);

var _sync = require('sync');

var _sync2 = _interopRequireDefault(_sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeviceController = function (_AbstractManagerContr) {
    _inherits(DeviceController, _AbstractManagerContr);

    function DeviceController() {
        _classCallCheck(this, DeviceController);

        return _possibleConstructorReturn(this, (DeviceController.__proto__ || Object.getPrototypeOf(DeviceController)).apply(this, arguments));
    }

    _createClass(DeviceController, [{
        key: 'getList',


        /**
        * @description Get List item
        * @author Long.Pham
        * @since 10/07/2019
        * @param {} res 
        * @param {*} postData 
        */
        value: function getList(res, postData) {
            try {
                var service = new _DeviceService2.default();
                var entity = new _DeviceEntity2.default();
                entity = Object.assign({}, entity, postData);
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
        * @description Get List device by project id
        * @author Long.Pham
        * @since 10/07/2019
        * @param {} res 
        * @param {*} postData 
        */

    }, {
        key: 'getListDeviceByProject',
        value: function getListDeviceByProject(res, postData) {
            try {
                var service = new _DeviceService2.default();
                var entity = new _DeviceEntity2.default();
                entity = Object.assign({}, entity, postData);
                service.getListDeviceByProject(entity, function (err, rs) {
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
                        res.send(resData);
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
        * @description Get List device by project id share
        * @author Long.Pham
        * @since 10/07/2019
        * @param {} res 
        * @param {*} postData 
        */

    }, {
        key: 'getListDeviceByProjectShare',
        value: function getListDeviceByProjectShare(res, postData) {
            try {
                var service = new _DeviceService2.default();
                var entity = new _DeviceEntity2.default();
                entity = Object.assign({}, entity, postData);
                service.getListDeviceByProjectShare(entity, function (err, rs) {
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
                        res.send(resData);
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
         * @description Get detail item
         * @author Long.Pham
         * @since 11/07/2018
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'getDetail',
        value: function getDetail(res, postData) {
            try {
                var service = new _DeviceService2.default();
                var entity = new _DeviceEntity2.default();
                entity = Object.assign({}, entity, postData);
                service.getDetail(entity, function (err, rs) {
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
         * @description Delete item
         * @author Long.Pham
         * @since 11/07/2018
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'deleteAction',
        value: function deleteAction(res, postData) {
            try {
                var service = new _DeviceService2.default();
                var entity = new _DeviceEntity2.default();
                entity = Object.assign({}, entity, postData);
                if (Libs.isBlank(entity.id)) {
                    var resData = {};
                    resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                    res.send(resData);
                    return;
                }
                service.delete(entity, function (err, rs) {
                    var resData = {};
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
         * @description Save action
         * @author Long.Pham
         * @since 11/07/2019
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'saveAction',
        value: async function saveAction(res, postData) {
            try {
                var service = new _DeviceService2.default();
                var entity = Object.assign({}, new _DeviceEntity2.default(), postData);
                entity.status = !entity.status || entity.status == -1 ? 0 : 1;
                if (!Libs.isBlank(entity.installed_at)) {
                    entity.installed_at = Libs.convertStr2DateV01(entity.installed_at, "dd/mm/yyyy", "/");
                }

                var validate = new _DeviceValidate2.default();
                validate.FLValidationAll(entity, async function (err, key) {
                    try {
                        if (err) {
                            var resData = Libs.returnJsonResult(false, err.message, {}, 0);
                            res.send(resData);
                            return;
                        }
                        if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                            (0, _sync2.default)(function () {
                                var checkIdDeviceExist = service.checkIdDeviceExist.sync(null, entity);
                                if (!Libs.isObjectEmpty(checkIdDeviceExist)) {
                                    var _resData = Libs.returnJsonResult(false, null, Libs.buildPathValidateMessage("id_device", i18n.__("device.exist_id_device")), 0);
                                    res.send(_resData);
                                    return;
                                }

                                service.insert(entity, function (err, rs) {
                                    if (rs) {
                                        entity.id = rs.insertId;
                                        var _resData2 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, rs);
                                        res.send(_resData2);
                                    } else {
                                        var _resData3 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                                        res.send(_resData3);
                                    }
                                });
                            });
                        } else if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                            (0, _sync2.default)(function () {
                                var checkIdDeviceExist = service.checkIdDeviceExist.sync(null, entity);
                                if (!Libs.isObjectEmpty(checkIdDeviceExist)) {
                                    var _resData4 = Libs.returnJsonResult(false, null, Libs.buildPathValidateMessage("id_device", i18n.__("device.exist_id_device")), 0);
                                    res.send(_resData4);
                                    return;
                                }

                                service.update(entity, function (err, rsupdate) {
                                    try {
                                        if (!rsupdate) {
                                            var _resData6 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                            res.send(_resData6);
                                            return;
                                        }
                                        var _resData5 = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, rsupdate);
                                        res.send(_resData5);
                                    } catch (error) {
                                        var _resData7 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                                        res.send(_resData7);
                                    }
                                });
                            });
                        } else {
                            var _resData8 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), {}, 0);
                            res.send(_resData8);
                        }
                    } catch (e) {
                        var _resData9 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                        res.send(_resData9);
                    }
                });
            } catch (e) {
                var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description Save device share
         * @author Long.Pham
         * @since 11/07/2019
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'saveDeviceShare',
        value: async function saveDeviceShare(res, postData) {
            try {
                var service = new _DeviceService2.default();
                var entity = Object.assign({}, new _DeviceEntity2.default(), postData);
                entity.status = !entity.status || entity.status == -1 ? 0 : 1;

                if (!Libs.isArrayData(entity.dataParams)) {
                    var _resData10 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                    res.send(_resData10);
                    return;
                }

                if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                    (0, _sync2.default)(function () {
                        service.saveDeviceShare(entity, function (err, rs) {
                            if (rs) {
                                var _resData11 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, rs);
                                res.send(_resData11);
                            } else {
                                var _resData12 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                                res.send(_resData12);
                            }
                        });
                    });
                } else {
                    var _resData13 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), {}, 0);
                    res.send(_resData13);
                }
            } catch (e) {
                var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description Save action
         * @author Long.Pham
         * @since 11/07/2019
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'updateStatus',
        value: function updateStatus(res, postData) {
            try {
                var service = new _DeviceService2.default();
                var entity = Object.assign({}, new _DeviceEntity2.default(), postData);
                entity.status = !entity.status || entity.status == -1 ? 0 : 1;

                if (Libs.isBlank(entity.id)) {
                    var resData = {};
                    resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                    res.send(resData);
                    return;
                }

                (0, _sync2.default)(function () {
                    service.updateStatus(entity, function (err, rsupdate) {
                        try {
                            if (!rsupdate) {
                                var _resData15 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                res.send(_resData15);
                                return;
                            }
                            var _resData14 = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                            res.send(_resData14);
                        } catch (error) {
                            var _resData16 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                            res.send(_resData16);
                        }
                    });
                });
            } catch (e) {
                var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description update is virtual
         * @author Long.Pham
         * @since 11/07/2019
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'updateIsVirtual',
        value: function updateIsVirtual(res, postData) {
            try {
                var service = new _DeviceService2.default();
                var entity = Object.assign({}, new _DeviceEntity2.default(), postData);
                entity.status = !entity.status || entity.status == -1 ? 0 : 1;

                if (Libs.isBlank(entity.id)) {
                    var resData = {};
                    resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                    res.send(resData);
                    return;
                }

                (0, _sync2.default)(function () {
                    service.updateIsVirtual(entity, function (err, rsupdate) {
                        try {
                            if (!rsupdate) {
                                var _resData18 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                res.send(_resData18);
                                return;
                            }
                            var _resData17 = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                            res.send(_resData17);
                        } catch (error) {
                            var _resData19 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                            res.send(_resData19);
                        }
                    });
                });
            } catch (e) {
                var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
        * @description Get all
        * @author Long.Pham
        * @since 10/07/2019
        * @param {} res 
        * @param {*} postData 
        */

    }, {
        key: 'getDropDownList',
        value: function getDropDownList(res, postData) {
            try {
                var service = new _DeviceService2.default();
                var entity = new _DeviceEntity2.default();
                entity = Object.assign({}, entity, postData);
                service.getDropDownList(entity, function (err, rs) {
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
                        res.send(resData);
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
    }]);

    return DeviceController;
}(_AbstractManagerController2.default);

exports.default = DeviceController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0RldmljZUNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiRGV2aWNlQ29udHJvbGxlciIsInJlcyIsInBvc3REYXRhIiwic2VydmljZSIsIkRldmljZVNlcnZpY2UiLCJlbnRpdHkiLCJEZXZpY2VFbnRpdHkiLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRMaXN0IiwiZXJyIiwicnMiLCJnZXRTaXplIiwiZXJyMSIsInJzMSIsInJlc0RhdGEiLCJMaWJzIiwicmV0dXJuSnNvblJlc3VsdCIsImkxOG4iLCJfXyIsInRvdGFsUm93Iiwic2VuZCIsImUiLCJsb2dnZXIiLCJlcnJvciIsImdldExpc3REZXZpY2VCeVByb2plY3QiLCJnZXRMaXN0RGV2aWNlQnlQcm9qZWN0U2hhcmUiLCJnZXREZXRhaWwiLCJpc0JsYW5rIiwiaWQiLCJkZWxldGUiLCJzdGF0dXMiLCJpbnN0YWxsZWRfYXQiLCJjb252ZXJ0U3RyMkRhdGVWMDEiLCJ2YWxpZGF0ZSIsIkRldmljZVZhbGlkYXRlIiwiRkxWYWxpZGF0aW9uQWxsIiwia2V5IiwibWVzc2FnZSIsImhhc093blByb3BlcnR5Iiwic2NyZWVuX21vZGUiLCJDb25zdGFudHMiLCJpbnNlcnQiLCJjaGVja0lkRGV2aWNlRXhpc3QiLCJzeW5jIiwiaXNPYmplY3RFbXB0eSIsImJ1aWxkUGF0aFZhbGlkYXRlTWVzc2FnZSIsImluc2VydElkIiwidXBkYXRlIiwicnN1cGRhdGUiLCJpc0FycmF5RGF0YSIsImRhdGFQYXJhbXMiLCJzYXZlRGV2aWNlU2hhcmUiLCJ1cGRhdGVTdGF0dXMiLCJ1cGRhdGVJc1ZpcnR1YWwiLCJnZXREcm9wRG93bkxpc3QiLCJBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSxnQjs7Ozs7Ozs7Ozs7OztBQUdGOzs7Ozs7O2dDQU9RQyxHLEVB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LEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsWUFBUixDQUE3QixFQUFvRCxFQUFFLFNBQVNHLElBQUksRUFBZixFQUFwRCxFQUF5RSxDQUF6RSxDQUFWO0FBQ0FyQixvQkFBSW9CLElBQUosQ0FBU04sT0FBVDtBQUNIO0FBQ0o7Ozs7RUE1WjBCeUMsbUM7O2tCQStaaEJ4RCxnQiIsImZpbGUiOiJEZXZpY2VDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0TWFuYWdlckNvbnRyb2xsZXIgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyJztcbmltcG9ydCBEZXZpY2VFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvRGV2aWNlRW50aXR5JztcbmltcG9ydCBEZXZpY2VTZXJ2aWNlIGZyb20gJy4uL3NlcnZpY2VzL0RldmljZVNlcnZpY2UnO1xuaW1wb3J0IERldmljZVZhbGlkYXRlIGZyb20gJy4uL3ZhbGlkYXRvci9EZXZpY2VWYWxpZGF0ZSc7XG5pbXBvcnQgU3luYyBmcm9tICdzeW5jJztcblxuY2xhc3MgRGV2aWNlQ29udHJvbGxlciBleHRlbmRzIEFic3RyYWN0TWFuYWdlckNvbnRyb2xsZXIge1xuXG4gICBcbiAgICAvKipcblx0ICogQGRlc2NyaXB0aW9uIEdldCBMaXN0IGl0ZW1cblx0ICogQGF1dGhvciBMb25nLlBoYW1cblx0ICogQHNpbmNlIDEwLzA3LzIwMTlcblx0ICogQHBhcmFtIHt9IHJlcyBcblx0ICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcblx0ICovXG4gICAgZ2V0TGlzdChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBEZXZpY2VTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IERldmljZUVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBzZXJ2aWNlLmdldExpc3QoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0U2l6ZShlbnRpdHksIGZ1bmN0aW9uIChlcnIxLCByczEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXJyMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgcnMxLnRvdGFsUm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihcIkzhu5dpOiBcIiArIGUpO1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICBcblxuICAgIC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgZGV2aWNlIGJ5IHByb2plY3QgaWRcblx0ICogQGF1dGhvciBMb25nLlBoYW1cblx0ICogQHNpbmNlIDEwLzA3LzIwMTlcblx0ICogQHBhcmFtIHt9IHJlcyBcblx0ICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcblx0ICovXG4gICAgIGdldExpc3REZXZpY2VCeVByb2plY3QocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgRGV2aWNlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBEZXZpY2VFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXRMaXN0RGV2aWNlQnlQcm9qZWN0KGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKFwiTOG7l2k6IFwiICsgZSk7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcblx0ICogQGRlc2NyaXB0aW9uIEdldCBMaXN0IGRldmljZSBieSBwcm9qZWN0IGlkIHNoYXJlXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXG5cdCAqIEBzaW5jZSAxMC8wNy8yMDE5XG5cdCAqIEBwYXJhbSB7fSByZXMgXG5cdCAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG5cdCAqL1xuICAgICBnZXRMaXN0RGV2aWNlQnlQcm9qZWN0U2hhcmUocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgRGV2aWNlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBEZXZpY2VFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXRMaXN0RGV2aWNlQnlQcm9qZWN0U2hhcmUoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IGRldGFpbCBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOFxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0RGV0YWlsKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gbmV3IERldmljZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgRGV2aWNlRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0RGV0YWlsKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIERlbGV0ZSBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOFxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZGVsZXRlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IERldmljZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgRGV2aWNlRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIGlmIChMaWJzLmlzQmxhbmsoZW50aXR5LmlkKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiTk9UX0VYSVNUXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VydmljZS5kZWxldGUoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfU1VDQ0VTUycpLCBlbnRpdHksIDEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLkRFTEVURV9GQUlMJyksIHt9LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfRkFJTCcpLCB7fSwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFNhdmUgYWN0aW9uXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgIGFzeW5jIHNhdmVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgRGV2aWNlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBEZXZpY2VFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgZW50aXR5LnN0YXR1cyA9ICghZW50aXR5LnN0YXR1cyB8fCBlbnRpdHkuc3RhdHVzID09IC0xKSA/IDAgOiAxO1xuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoZW50aXR5Lmluc3RhbGxlZF9hdCkpIHtcbiAgICAgICAgICAgICAgICBlbnRpdHkuaW5zdGFsbGVkX2F0ID0gTGlicy5jb252ZXJ0U3RyMkRhdGVWMDEoZW50aXR5Lmluc3RhbGxlZF9hdCwgXCJkZC9tbS95eXl5XCIsIFwiL1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHZhbGlkYXRlID0gbmV3IERldmljZVZhbGlkYXRlKCk7XG4gICAgICAgICAgICB2YWxpZGF0ZS5GTFZhbGlkYXRpb25BbGwoZW50aXR5LCBhc3luYyBmdW5jdGlvbiAoZXJyLCBrZXkpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgZXJyLm1lc3NhZ2UsIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbnRpdHkuaGFzT3duUHJvcGVydHkoJ3NjcmVlbl9tb2RlJykgJiYgZW50aXR5LnNjcmVlbl9tb2RlID09IENvbnN0YW50cy5zY3JlZW5fbW9kZS5pbnNlcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGVja0lkRGV2aWNlRXhpc3QgPSBzZXJ2aWNlLmNoZWNrSWREZXZpY2VFeGlzdC5zeW5jKG51bGwsIGVudGl0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFMaWJzLmlzT2JqZWN0RW1wdHkoY2hlY2tJZERldmljZUV4aXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgbnVsbCwgTGlicy5idWlsZFBhdGhWYWxpZGF0ZU1lc3NhZ2UoXCJpZF9kZXZpY2VcIiwgaTE4bi5fXyhcImRldmljZS5leGlzdF9pZF9kZXZpY2VcIikpLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmluc2VydChlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50aXR5LmlkID0gcnMuaW5zZXJ0SWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9TVUNDRVNTJyksIGVudGl0eSwgcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVudGl0eS5oYXNPd25Qcm9wZXJ0eSgnc2NyZWVuX21vZGUnKSAmJiBlbnRpdHkuc2NyZWVuX21vZGUgPT0gQ29uc3RhbnRzLnNjcmVlbl9tb2RlLnVwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoZWNrSWREZXZpY2VFeGlzdCA9IHNlcnZpY2UuY2hlY2tJZERldmljZUV4aXN0LnN5bmMobnVsbCwgZW50aXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUxpYnMuaXNPYmplY3RFbXB0eShjaGVja0lkRGV2aWNlRXhpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBudWxsLCBMaWJzLmJ1aWxkUGF0aFZhbGlkYXRlTWVzc2FnZShcImlkX2RldmljZVwiLCBpMThuLl9fKFwiZGV2aWNlLmV4aXN0X2lkX2RldmljZVwiKSksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UudXBkYXRlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnN1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcnN1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9TVUNDRVNTJyksIGVudGl0eSwgcnN1cGRhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZXJyb3IgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGRldmljZSBzaGFyZVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDExLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgICBhc3luYyBzYXZlRGV2aWNlU2hhcmUocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgRGV2aWNlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBEZXZpY2VFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgZW50aXR5LnN0YXR1cyA9ICghZW50aXR5LnN0YXR1cyB8fCBlbnRpdHkuc3RhdHVzID09IC0xKSA/IDAgOiAxO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZighTGlicy5pc0FycmF5RGF0YShlbnRpdHkuZGF0YVBhcmFtcykpe1xuICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZW50aXR5Lmhhc093blByb3BlcnR5KCdzY3JlZW5fbW9kZScpICYmIGVudGl0eS5zY3JlZW5fbW9kZSA9PSBDb25zdGFudHMuc2NyZWVuX21vZGUuaW5zZXJ0KSB7XG4gICAgICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2Uuc2F2ZURldmljZVNoYXJlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5TQVZFX1NVQ0NFU1MnKSwgZW50aXR5LCBycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFNhdmUgYWN0aW9uXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgdXBkYXRlU3RhdHVzKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IERldmljZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgRGV2aWNlRW50aXR5KCksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIGVudGl0eS5zdGF0dXMgPSAoIWVudGl0eS5zdGF0dXMgfHwgZW50aXR5LnN0YXR1cyA9PSAtMSkgPyAwIDogMTtcblxuICAgICAgICAgICAgaWYgKExpYnMuaXNCbGFuayhlbnRpdHkuaWQpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJOT1RfRVhJU1RcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlcnZpY2UudXBkYXRlU3RhdHVzKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnN1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcnN1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9TVUNDRVNTJyksIGVudGl0eSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlcnJvciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbiAgICBcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiB1cGRhdGUgaXMgdmlydHVhbFxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDExLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgICB1cGRhdGVJc1ZpcnR1YWwocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgRGV2aWNlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBEZXZpY2VFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgZW50aXR5LnN0YXR1cyA9ICghZW50aXR5LnN0YXR1cyB8fCBlbnRpdHkuc3RhdHVzID09IC0xKSA/IDAgOiAxO1xuXG4gICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGVudGl0eS5pZCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIk5PVF9FWElTVFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VydmljZS51cGRhdGVJc1ZpcnR1YWwoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCByc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX0ZBSUwnKSwgeyBcImVycm9yXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX1NVQ0NFU1MnKSwgZW50aXR5LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGVycm9yIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgYWxsXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXG5cdCAqIEBzaW5jZSAxMC8wNy8yMDE5XG5cdCAqIEBwYXJhbSB7fSByZXMgXG5cdCAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG5cdCAqL1xuICAgICBnZXREcm9wRG93bkxpc3QocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgRGV2aWNlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBEZXZpY2VFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXREcm9wRG93bkxpc3QoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxufVxuZXhwb3J0IGRlZmF1bHQgRGV2aWNlQ29udHJvbGxlcjsiXX0=