'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractManagerController = require('../core/AbstractManagerController');

var _AbstractManagerController2 = _interopRequireDefault(_AbstractManagerController);

var _DeviceTypeEntity = require('../entities/DeviceTypeEntity');

var _DeviceTypeEntity2 = _interopRequireDefault(_DeviceTypeEntity);

var _DeviceTypeService = require('../services/DeviceTypeService');

var _DeviceTypeService2 = _interopRequireDefault(_DeviceTypeService);

var _DeviceTypeValidate = require('../validator/DeviceTypeValidate');

var _DeviceTypeValidate2 = _interopRequireDefault(_DeviceTypeValidate);

var _sync = require('sync');

var _sync2 = _interopRequireDefault(_sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeviceTypeController = function (_AbstractManagerContr) {
    _inherits(DeviceTypeController, _AbstractManagerContr);

    function DeviceTypeController() {
        _classCallCheck(this, DeviceTypeController);

        return _possibleConstructorReturn(this, (DeviceTypeController.__proto__ || Object.getPrototypeOf(DeviceTypeController)).apply(this, arguments));
    }

    _createClass(DeviceTypeController, [{
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
                var service = new _DeviceTypeService2.default();
                var entity = new _DeviceTypeEntity2.default();
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
                var service = new _DeviceTypeService2.default();
                var entity = new _DeviceTypeEntity2.default();
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
        value: async function deleteAction(res, postData) {
            try {
                var service = new _DeviceTypeService2.default();
                var entity = new _DeviceTypeEntity2.default();
                entity = Object.assign({}, entity, postData);
                if (Libs.isBlank(entity.id)) {
                    var resData = {};
                    resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                    res.send(resData);
                    return;
                }
                // Check exits
                var DeviceTypeUse = await service.checkExistDeviceTypeUse(entity);
                if (!Libs.isObjectEmpty(DeviceTypeUse)) {
                    resData = Libs.returnJsonResult(false, i18n.__("product_type.is_use"), {}, 0);
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
                var service = new _DeviceTypeService2.default();
                var entity = Object.assign({}, new _DeviceTypeEntity2.default(), postData);
                entity.status = !entity.status || entity.status == -1 ? 0 : 1;
                var validate = new _DeviceTypeValidate2.default();
                validate.FLValidationAll(entity, async function (err, key) {
                    try {
                        if (err) {
                            var resData = Libs.returnJsonResult(false, err.message, {}, 0);
                            res.send(resData);
                            return;
                        }
                        if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                            (0, _sync2.default)(function () {
                                service.insert(entity, function (err, rs) {
                                    if (rs) {
                                        entity.id = rs.insertId;
                                        var _resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, rs);
                                        res.send(_resData);
                                    } else {
                                        var _resData2 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                                        res.send(_resData2);
                                    }
                                });
                            });
                        } else if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                            (0, _sync2.default)(function () {
                                service.update(entity, function (err, rsupdate) {
                                    try {
                                        if (!rsupdate) {
                                            var _resData4 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                            res.send(_resData4);
                                            return;
                                        }
                                        var _resData3 = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, rsupdate);
                                        res.send(_resData3);
                                    } catch (error) {
                                        var _resData5 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                                        res.send(_resData5);
                                    }
                                });
                            });
                        } else {
                            var _resData6 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), {}, 0);
                            res.send(_resData6);
                        }
                    } catch (e) {
                        var _resData7 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                        res.send(_resData7);
                    }
                });
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
                var service = new _DeviceTypeService2.default();
                var entity = Object.assign({}, new _DeviceTypeEntity2.default(), postData);
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
                                var _resData9 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                res.send(_resData9);
                                return;
                            }
                            var _resData8 = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                            res.send(_resData8);
                        } catch (error) {
                            var _resData10 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                            res.send(_resData10);
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
                var service = new _DeviceTypeService2.default();
                var entity = new _DeviceTypeEntity2.default();
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

    return DeviceTypeController;
}(_AbstractManagerController2.default);

exports.default = DeviceTypeController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0RldmljZVR5cGVDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkRldmljZVR5cGVDb250cm9sbGVyIiwicmVzIiwicG9zdERhdGEiLCJzZXJ2aWNlIiwiRGV2aWNlVHlwZVNlcnZpY2UiLCJlbnRpdHkiLCJEZXZpY2VUeXBlRW50aXR5IiwiT2JqZWN0IiwiYXNzaWduIiwiZ2V0TGlzdCIsImVyciIsInJzIiwiZ2V0U2l6ZSIsImVycjEiLCJyczEiLCJyZXNEYXRhIiwiTGlicyIsInJldHVybkpzb25SZXN1bHQiLCJpMThuIiwiX18iLCJ0b3RhbFJvdyIsInNlbmQiLCJlIiwibG9nZ2VyIiwiZXJyb3IiLCJnZXREZXRhaWwiLCJpc0JsYW5rIiwiaWQiLCJEZXZpY2VUeXBlVXNlIiwiY2hlY2tFeGlzdERldmljZVR5cGVVc2UiLCJpc09iamVjdEVtcHR5IiwiZGVsZXRlIiwic3RhdHVzIiwidmFsaWRhdGUiLCJEZXZpY2VUeXBlVmFsaWRhdGUiLCJGTFZhbGlkYXRpb25BbGwiLCJrZXkiLCJtZXNzYWdlIiwiaGFzT3duUHJvcGVydHkiLCJzY3JlZW5fbW9kZSIsIkNvbnN0YW50cyIsImluc2VydCIsImluc2VydElkIiwidXBkYXRlIiwicnN1cGRhdGUiLCJ1cGRhdGVTdGF0dXMiLCJnZXREcm9wRG93bkxpc3QiLCJBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSxvQjs7Ozs7Ozs7Ozs7OztBQUdGOzs7Ozs7O2dDQU9RQyxHLEVBQUtDLFEsRUFBVTtBQUNuQixnQkFBSTtBQUNBLG9CQUFJQyxVQUFVLElBQUlDLDJCQUFKLEVBQWQ7QUFDQSxvQkFBSUMsU0FBUyxJQUFJQywwQkFBSixFQUFiO0FBQ0FELHlCQUFTRSxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkgsTUFBbEIsRUFBMEJILFFB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Q0FBVjtBQUNBViw0QkFBSW9CLElBQUosQ0FBU04sT0FBVDtBQUNILHFCQUhELE1BR087QUFDSEEsa0NBQVVDLEtBQUtDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsYUFBUixDQUE3QixFQUFxRCxFQUFyRCxFQUF5RCxDQUF6RCxDQUFWO0FBQ0FsQiw0QkFBSW9CLElBQUosQ0FBU04sT0FBVDtBQUNIO0FBQ0osaUJBUkQ7QUFTSCxhQWJELENBYUUsT0FBT08sQ0FBUCxFQUFVO0FBQ1IscUJBQUtDLE1BQUwsQ0FBWUMsS0FBWixDQUFrQixVQUFVRixDQUE1QjtBQUNBLG9CQUFJUCxVQUFVLEVBQWQ7QUFDQUEsMEJBQVVDLEtBQUtDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsWUFBUixDQUE3QixFQUFvRCxFQUFFLFNBQVNHLElBQUksRUFBZixFQUFwRCxFQUF5RSxDQUF6RSxDQUFWO0FBQ0FyQixvQkFBSW9CLElBQUosQ0FBU04sT0FBVDtBQUNIO0FBQ0o7Ozs7RUExUDhCZ0MsbUM7O2tCQTZQcEIvQyxvQiIsImZpbGUiOiJEZXZpY2VUeXBlQ29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlcic7XG5pbXBvcnQgRGV2aWNlVHlwZUVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9EZXZpY2VUeXBlRW50aXR5JztcbmltcG9ydCBEZXZpY2VUeXBlU2VydmljZSBmcm9tICcuLi9zZXJ2aWNlcy9EZXZpY2VUeXBlU2VydmljZSc7XG5pbXBvcnQgRGV2aWNlVHlwZVZhbGlkYXRlIGZyb20gJy4uL3ZhbGlkYXRvci9EZXZpY2VUeXBlVmFsaWRhdGUnO1xuaW1wb3J0IFN5bmMgZnJvbSAnc3luYyc7XG5cbmNsYXNzIERldmljZVR5cGVDb250cm9sbGVyIGV4dGVuZHMgQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciB7XG5cbiAgIFxuICAgIC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgaXRlbVxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxuXHQgKiBAc2luY2UgMTAvMDcvMjAxOVxuXHQgKiBAcGFyYW0ge30gcmVzIFxuXHQgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuXHQgKi9cbiAgICBnZXRMaXN0KHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IERldmljZVR5cGVTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IERldmljZVR5cGVFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXRMaXN0KGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldFNpemUoZW50aXR5LCBmdW5jdGlvbiAoZXJyMSwgcnMxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVycjEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIHJzMS50b3RhbFJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IGRldGFpbCBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOFxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0RGV0YWlsKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gbmV3IERldmljZVR5cGVTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IERldmljZVR5cGVFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXREZXRhaWwoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRGVsZXRlIGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE4XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBhc3luYyBkZWxldGVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgRGV2aWNlVHlwZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgRGV2aWNlVHlwZUVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGVudGl0eS5pZCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIk5PVF9FWElTVFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIENoZWNrIGV4aXRzXG4gICAgICAgICAgICBsZXQgRGV2aWNlVHlwZVVzZSA9IGF3YWl0IHNlcnZpY2UuY2hlY2tFeGlzdERldmljZVR5cGVVc2UoZW50aXR5KTtcbiAgICAgICAgICAgIGlmICghTGlicy5pc09iamVjdEVtcHR5KERldmljZVR5cGVVc2UpKSB7XG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcInByb2R1Y3RfdHlwZS5pc191c2VcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlcnZpY2UuZGVsZXRlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uREVMRVRFX1NVQ0NFU1MnKSwgZW50aXR5LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfRkFJTCcpLCB7fSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uREVMRVRFX0ZBSUwnKSwge30sIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGFjdGlvblxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDExLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgICBhc3luYyBzYXZlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IERldmljZVR5cGVTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IERldmljZVR5cGVFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgZW50aXR5LnN0YXR1cyA9ICghZW50aXR5LnN0YXR1cyB8fCBlbnRpdHkuc3RhdHVzID09IC0xKSA/IDAgOiAxO1xuICAgICAgICAgICAgbGV0IHZhbGlkYXRlID0gbmV3IERldmljZVR5cGVWYWxpZGF0ZSgpO1xuICAgICAgICAgICAgdmFsaWRhdGUuRkxWYWxpZGF0aW9uQWxsKGVudGl0eSwgYXN5bmMgZnVuY3Rpb24gKGVyciwga2V5KSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGVyci5tZXNzYWdlLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZW50aXR5Lmhhc093blByb3BlcnR5KCdzY3JlZW5fbW9kZScpICYmIGVudGl0eS5zY3JlZW5fbW9kZSA9PSBDb25zdGFudHMuc2NyZWVuX21vZGUuaW5zZXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTeW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmluc2VydChlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50aXR5LmlkID0gcnMuaW5zZXJ0SWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9TVUNDRVNTJyksIGVudGl0eSwgcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVudGl0eS5oYXNPd25Qcm9wZXJ0eSgnc2NyZWVuX21vZGUnKSAmJiBlbnRpdHkuc2NyZWVuX21vZGUgPT0gQ29uc3RhbnRzLnNjcmVlbl9tb2RlLnVwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS51cGRhdGUoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCByc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX0ZBSUwnKSwgeyBcImVycm9yXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX1NVQ0NFU1MnKSwgZW50aXR5LCByc3VwZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlcnJvciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFNhdmUgYWN0aW9uXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgdXBkYXRlU3RhdHVzKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IERldmljZVR5cGVTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IERldmljZVR5cGVFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgZW50aXR5LnN0YXR1cyA9ICghZW50aXR5LnN0YXR1cyB8fCBlbnRpdHkuc3RhdHVzID09IC0xKSA/IDAgOiAxO1xuXG4gICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGVudGl0eS5pZCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIk5PVF9FWElTVFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VydmljZS51cGRhdGVTdGF0dXMoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCByc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX0ZBSUwnKSwgeyBcImVycm9yXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX1NVQ0NFU1MnKSwgZW50aXR5LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGVycm9yIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcblx0ICogQGRlc2NyaXB0aW9uIEdldCBhbGxcblx0ICogQGF1dGhvciBMb25nLlBoYW1cblx0ICogQHNpbmNlIDEwLzA3LzIwMTlcblx0ICogQHBhcmFtIHt9IHJlcyBcblx0ICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcblx0ICovXG4gICAgIGdldERyb3BEb3duTGlzdChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBEZXZpY2VUeXBlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBEZXZpY2VUeXBlRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0RHJvcERvd25MaXN0KGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKFwiTOG7l2k6IFwiICsgZSk7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbn1cbmV4cG9ydCBkZWZhdWx0IERldmljZVR5cGVDb250cm9sbGVyOyJdfQ==