'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractManagerController = require('../core/AbstractManagerController');

var _AbstractManagerController2 = _interopRequireDefault(_AbstractManagerController);

var _DeviceParameterEntity = require('../entities/DeviceParameterEntity');

var _DeviceParameterEntity2 = _interopRequireDefault(_DeviceParameterEntity);

var _DeviceParameterService = require('../services/DeviceParameterService');

var _DeviceParameterService2 = _interopRequireDefault(_DeviceParameterService);

var _DeviceParameterValidate = require('../validator/DeviceParameterValidate');

var _DeviceParameterValidate2 = _interopRequireDefault(_DeviceParameterValidate);

var _sync = require('sync');

var _sync2 = _interopRequireDefault(_sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeviceParameterController = function (_AbstractManagerContr) {
    _inherits(DeviceParameterController, _AbstractManagerContr);

    function DeviceParameterController() {
        _classCallCheck(this, DeviceParameterController);

        return _possibleConstructorReturn(this, (DeviceParameterController.__proto__ || Object.getPrototypeOf(DeviceParameterController)).apply(this, arguments));
    }

    _createClass(DeviceParameterController, [{
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
                var service = new _DeviceParameterService2.default();
                var entity = new _DeviceParameterEntity2.default();
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
                this.logger.DeviceParameter("Lỗi: " + e);
                var resData = {};
                resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "DeviceParameter": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description Get detail item
         * @author Long.Pham
         * @since 11/07/2019
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'getDetail',
        value: function getDetail(res, postData) {
            try {
                var service = new _DeviceParameterService2.default();
                var entity = new _DeviceParameterEntity2.default();
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
                resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "DeviceParameter": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description Delete item
         * @author thanh.bay
         * @since 11/07/2018
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'deleteAction',
        value: function deleteAction(res, postData) {
            try {
                var service = new _DeviceParameterService2.default();
                var entity = new _DeviceParameterEntity2.default();
                entity = Object.assign({}, entity, postData);
                if (Libs.isBlank(entity.id)) {
                    var resData = {};
                    resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                    res.send(resData);
                    return;
                }
                (0, _sync2.default)(function () {
                    service.delete(entity, function (err, rsupdate) {
                        try {
                            if (!rsupdate) {
                                var _resData2 = Libs.returnJsonResult(false, i18n.__('ACTION.DELETE_FAIL'), { "DeviceParameter": err }, 0);
                                res.send(_resData2);
                                return;
                            }
                            var _resData = Libs.returnJsonResult(true, i18n.__('ACTION.DELETE_SUCCESS'), entity, 0);
                            res.send(_resData);
                        } catch (DeviceParameter) {
                            var _resData3 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "DeviceParameter": DeviceParameter }, 0);
                            res.send(_resData3);
                        }
                    });
                });
            } catch (e) {
                var resData = {};
                resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "DeviceParameter": e + "" }, 0);
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
                var service = new _DeviceParameterService2.default();
                var entity = Object.assign({}, new _DeviceParameterEntity2.default(), postData);
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
                                var _resData5 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "DeviceParameter": err }, 0);
                                res.send(_resData5);
                                return;
                            }
                            var _resData4 = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                            res.send(_resData4);
                        } catch (DeviceParameter) {
                            var _resData6 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "DeviceParameter": DeviceParameter }, 0);
                            res.send(_resData6);
                        }
                    });
                });
            } catch (e) {
                var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "DeviceParameter": e + "" }, 0);
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
                var self = this;
                var service = new _DeviceParameterService2.default();
                var entity = Object.assign({}, new _DeviceParameterEntity2.default(), postData);
                entity.status = !entity.status || entity.status == -1 ? 0 : 1;
                var validate = new _DeviceParameterValidate2.default();

                var DeviceParameters = await validate.FLValidationAll(entity);
                if (DeviceParameters != null) {
                    DeviceParameters.validate = false;
                    res.send(Libs.returnJsonResult(false, "", DeviceParameters, 0));
                    return;
                }

                if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                    (0, _sync2.default)(function () {
                        service.insertDeviceParameter(entity, function (err, rs) {
                            if (rs && err) {
                                var _resData7 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                                res.send(_resData7);
                            } else {
                                var _resData8 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "DeviceParameter": err }, 0);
                                res.send(_resData8);
                            }
                        });
                    });
                } else if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                    service.updateDeviceParameter(entity, function (err, rs) {
                        if (rs) {
                            var _resData9 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                            res.send(_resData9);
                        } else {
                            var _resData10 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "DeviceParameter": err }, 0);
                            res.send(_resData10);
                        }
                    });
                }
            } catch (e) {
                var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "DeviceParameter": e + "" }, 0);
                res.send(resData);
            }
        }
    }]);

    return DeviceParameterController;
}(_AbstractManagerController2.default);

exports.default = DeviceParameterController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0RldmljZVBhcmFtZXRlckNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiRGV2aWNlUGFyYW1ldGVyQ29udHJvbGxlciIsInJlcyIsInBvc3REYXRhIiwic2VydmljZSIsIkRldmljZVBhcmFtZXRlclNlcnZpY2UiLCJlbnRpdHkiLCJEZXZpY2VQYXJhbWV0ZXJFbnRpdHkiLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRMaXN0IiwiZXJyIiwicnMiLCJnZXRTaXplIiwiZXJyMSIsInJzMSIsInJlc0RhdGEiLCJMaWJzIiwicmV0dXJuSnNvblJlc3VsdCIsImkxOG4iLCJfXyIsInRvdGFsUm93Iiwic2VuZCIsImUiLCJsb2dnZXIiLCJEZXZpY2VQYXJhbWV0ZXIiLCJnZXREZXRhaWwiLCJpc0JsYW5rIiwiaWQiLCJkZWxldGUiLCJyc3VwZGF0ZSIsInN0YXR1cyIsInVwZGF0ZVN0YXR1cyIsInNlbGYiLCJ2YWxpZGF0ZSIsIkRldmljZVBhcmFtZXRlclZhbGlkYXRlIiwiRGV2aWNlUGFyYW1ldGVycyIsIkZMVmFsaWRhdGlvbkFsbCIsImhhc093blByb3BlcnR5Iiwic2NyZWVuX21vZGUiLCJDb25zdGFudHMiLCJpbnNlcnQiLCJpbnNlcnREZXZpY2VQYXJhbWV0ZXIiLCJ1cGRhdGUiLCJ1cGRhdGVEZXZpY2VQYXJhbWV0ZXIiLCJBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSx5Qjs7Ozs7Ozs7Ozs7OztBQUVGOzs7Ozs7O2dDQU9RQyxHLEVBQUtDLFEsRUFBVTtBQUNuQixnQkFBSTtBQUNBLG9CQUFJQyxVQUFVLElBQUlDLGdDQUFKLEVBQWQ7QUFDQSxvQkFBSUMsU0FBUyxJQUFJQywrQkFBSixFQUFiO0FBQ0FELHlCQUFTRSxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkgsTUFBbEIsRUFB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LE9BQU9nQyxjQUFQLENBQXNCLGFBQXRCLEtBQXdDaEMsT0FBT2lDLFdBQVAsSUFBc0JDLFVBQVVELFdBQVYsQ0FBc0JJLE1BQXhGLEVBQWdHO0FBQ25HdkMsNEJBQVF3QyxxQkFBUixDQUE4QnRDLE1BQTlCLEVBQXNDLFVBQVVLLEdBQVYsRUFBZUMsRUFBZixFQUFtQjtBQUNyRCw0QkFBSUEsRUFBSixFQUFRO0FBQ0osZ0NBQUlJLFlBQVVDLEtBQUtDLGdCQUFMLENBQXNCLElBQXRCLEVBQTRCQyxLQUFLQyxFQUFMLENBQVEscUJBQVIsQ0FBNUIsRUFBNERkLE1BQTVELEVBQW9FLENBQXBFLENBQWQ7QUFDQUosZ0NBQUlvQixJQUFKLENBQVNOLFNBQVQ7QUFDSCx5QkFIRCxNQUdPO0FBQ0gsZ0NBQUlBLGFBQVVDLEtBQUtDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsa0JBQVIsQ0FBN0IsRUFBMEQsRUFBRSxtQkFBbUJULEdBQXJCLEVBQTFELEVBQXNGLENBQXRGLENBQWQ7QUFDQVQsZ0NBQUlvQixJQUFKLENBQVNOLFVBQVQ7QUFDSDtBQUNKLHFCQVJEO0FBU0g7QUFDSixhQXRDRCxDQXNDRSxPQUFPTyxDQUFQLEVBQVU7QUFDUixvQkFBSVAsVUFBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtBQUtDLEVBQUwsQ0FBUSxZQUFSLENBQTdCLEVBQW9ELEVBQUUsbUJBQW1CRyxJQUFJLEVBQXpCLEVBQXBELEVBQW1GLENBQW5GLENBQWQ7QUFDQXJCLG9CQUFJb0IsSUFBSixDQUFTTixPQUFUO0FBQ0g7QUFDSjs7OztFQXpNbUM2QixtQzs7a0JBMk16QjVDLHlCIiwiZmlsZSI6IkRldmljZVBhcmFtZXRlckNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciBmcm9tICcuLi9jb3JlL0Fic3RyYWN0TWFuYWdlckNvbnRyb2xsZXInO1xuaW1wb3J0IERldmljZVBhcmFtZXRlckVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9EZXZpY2VQYXJhbWV0ZXJFbnRpdHknO1xuaW1wb3J0IERldmljZVBhcmFtZXRlclNlcnZpY2UgZnJvbSAnLi4vc2VydmljZXMvRGV2aWNlUGFyYW1ldGVyU2VydmljZSc7XG5pbXBvcnQgRGV2aWNlUGFyYW1ldGVyVmFsaWRhdGUgZnJvbSAnLi4vdmFsaWRhdG9yL0RldmljZVBhcmFtZXRlclZhbGlkYXRlJztcbmltcG9ydCBTeW5jIGZyb20gJ3N5bmMnO1xuXG5jbGFzcyBEZXZpY2VQYXJhbWV0ZXJDb250cm9sbGVyIGV4dGVuZHMgQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciB7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDEwLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0ge30gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0TGlzdChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBEZXZpY2VQYXJhbWV0ZXJTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IERldmljZVBhcmFtZXRlckVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBzZXJ2aWNlLmdldExpc3QoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0U2l6ZShlbnRpdHksIGZ1bmN0aW9uIChlcnIxLCByczEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXJyMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgcnMxLnRvdGFsUm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5EZXZpY2VQYXJhbWV0ZXIoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJEZXZpY2VQYXJhbWV0ZXJcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IGRldGFpbCBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0RGV0YWlsKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gbmV3IERldmljZVBhcmFtZXRlclNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgRGV2aWNlUGFyYW1ldGVyRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0RGV0YWlsKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJEZXZpY2VQYXJhbWV0ZXJcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBEZWxldGUgaXRlbVxuICAgICAqIEBhdXRob3IgdGhhbmguYmF5XG4gICAgICogQHNpbmNlIDExLzA3LzIwMThcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGRlbGV0ZUFjdGlvbihyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBEZXZpY2VQYXJhbWV0ZXJTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IERldmljZVBhcmFtZXRlckVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGVudGl0eS5pZCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIk5PVF9FWElTVFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlcnZpY2UuZGVsZXRlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnN1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcnN1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLkRFTEVURV9GQUlMJyksIHsgXCJEZXZpY2VQYXJhbWV0ZXJcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfU1VDQ0VTUycpLCBlbnRpdHksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKERldmljZVBhcmFtZXRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcIkRldmljZVBhcmFtZXRlclwiOiBEZXZpY2VQYXJhbWV0ZXIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJEZXZpY2VQYXJhbWV0ZXJcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGFjdGlvblxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDExLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIHVwZGF0ZVN0YXR1cyhyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBEZXZpY2VQYXJhbWV0ZXJTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IERldmljZVBhcmFtZXRlckVudGl0eSgpLCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBlbnRpdHkuc3RhdHVzID0gKCFlbnRpdHkuc3RhdHVzIHx8IGVudGl0eS5zdGF0dXMgPT0gLTEpID8gMCA6IDE7XG5cbiAgICAgICAgICAgIGlmIChMaWJzLmlzQmxhbmsoZW50aXR5LmlkKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiTk9UX0VYSVNUXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBTeW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLnVwZGF0ZVN0YXR1cyhlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5VUERBVEVfRkFJTCcpLCB7IFwiRGV2aWNlUGFyYW1ldGVyXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX1NVQ0NFU1MnKSwgZW50aXR5LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChEZXZpY2VQYXJhbWV0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJEZXZpY2VQYXJhbWV0ZXJcIjogRGV2aWNlUGFyYW1ldGVyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJEZXZpY2VQYXJhbWV0ZXJcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGFjdGlvblxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDExLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGFzeW5jIHNhdmVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgRGV2aWNlUGFyYW1ldGVyU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBEZXZpY2VQYXJhbWV0ZXJFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgZW50aXR5LnN0YXR1cyA9ICghZW50aXR5LnN0YXR1cyB8fCBlbnRpdHkuc3RhdHVzID09IC0xKSA/IDAgOiAxO1xuICAgICAgICAgICAgbGV0IHZhbGlkYXRlID0gbmV3IERldmljZVBhcmFtZXRlclZhbGlkYXRlKCk7XG5cbiAgICAgICAgICAgIGxldCBEZXZpY2VQYXJhbWV0ZXJzID0gYXdhaXQgdmFsaWRhdGUuRkxWYWxpZGF0aW9uQWxsKGVudGl0eSk7XG4gICAgICAgICAgICBpZiAoRGV2aWNlUGFyYW1ldGVycyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgRGV2aWNlUGFyYW1ldGVycy52YWxpZGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgXCJcIiwgRGV2aWNlUGFyYW1ldGVycywgMCkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiAoZW50aXR5Lmhhc093blByb3BlcnR5KCdzY3JlZW5fbW9kZScpICYmIGVudGl0eS5zY3JlZW5fbW9kZSA9PSBDb25zdGFudHMuc2NyZWVuX21vZGUuaW5zZXJ0KSB7XG4gICAgICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuaW5zZXJ0RGV2aWNlUGFyYW1ldGVyKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChycyAmJiBlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9TVUNDRVNTJyksIGVudGl0eSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9GQUlMJyksIHsgXCJEZXZpY2VQYXJhbWV0ZXJcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZW50aXR5Lmhhc093blByb3BlcnR5KCdzY3JlZW5fbW9kZScpICYmIGVudGl0eS5zY3JlZW5fbW9kZSA9PSBDb25zdGFudHMuc2NyZWVuX21vZGUudXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgc2VydmljZS51cGRhdGVEZXZpY2VQYXJhbWV0ZXIoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5TQVZFX1NVQ0NFU1MnKSwgZW50aXR5LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5TQVZFX0ZBSUwnKSwgeyBcIkRldmljZVBhcmFtZXRlclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiRGV2aWNlUGFyYW1ldGVyXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBEZXZpY2VQYXJhbWV0ZXJDb250cm9sbGVyOyJdfQ==