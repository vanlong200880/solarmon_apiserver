'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseController2 = require('../core/BaseController');

var _BaseController3 = _interopRequireDefault(_BaseController2);

var _ClientDeviceService = require('../services/ClientDeviceService');

var _ClientDeviceService2 = _interopRequireDefault(_ClientDeviceService);

var _DeviceEntity = require('../entities/DeviceEntity');

var _DeviceEntity2 = _interopRequireDefault(_DeviceEntity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClientDeviceController = function (_BaseController) {
    _inherits(ClientDeviceController, _BaseController);

    function ClientDeviceController() {
        _classCallCheck(this, ClientDeviceController);

        return _possibleConstructorReturn(this, (ClientDeviceController.__proto__ || Object.getPrototypeOf(ClientDeviceController)).call(this));
    }

    /**
     * @description Get List item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {} res 
     * @param {*} postData 
     */


    _createClass(ClientDeviceController, [{
        key: 'getList',
        value: function getList(res, postData) {

            try {
                var service = new _ClientDeviceService2.default();
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
         * @description Get List parameter by device id
         * @author Long.Pham
         * @since 14/09/2021
         * @param {} res 
         * @param {*} postData 
         */

    }, {
        key: 'getListParameterByDevice',
        value: function getListParameterByDevice(res, postData) {
            try {
                var service = new _ClientDeviceService2.default();
                var entity = new _DeviceEntity2.default();
                entity = Object.assign({}, entity, postData);
                service.getListParameterByDevice(entity, function (err, rs) {
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
        * @description Get List alert by device id
        * @author Long.Pham
        * @since 10/09/2021
        * @param {} res 
        * @param {*} postData 
        */

    }, {
        key: 'getListAlertByDevice',
        value: function getListAlertByDevice(res, postData) {
            try {
                var service = new _ClientDeviceService2.default();
                var entity = new _DeviceEntity2.default();
                entity = Object.assign({}, entity, postData);
                if (!Libs.isBlank(entity.date_from)) {
                    entity.date_from = Libs.convertStr2DateV01(entity.date_from, "dd/mm/yyyy", "/");
                }

                if (!Libs.isBlank(entity.date_to)) {
                    entity.date_to = Libs.convertStr2DateV01(entity.date_to, "dd/mm/yyyy", "/");
                }

                service.getListAlertByDevice(entity, function (err, rs) {
                    if (!err) {
                        service.getListAlertByDeviceSize(entity, function (err1, rs1) {
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

    return ClientDeviceController;
}(_BaseController3.default);

exports.default = ClientDeviceController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0NsaWVudERldmljZUNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiQ2xpZW50RGV2aWNlQ29udHJvbGxlciIsInJlcyIsInBvc3REYXRhIiwic2VydmljZSIsIkNsaWVudERldmljZVNlcnZpY2UiLCJlbnRpdHkiLCJEZXZpY2VFbnRpdHkiLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRMaXN0IiwiZXJyIiwicnMiLCJnZXRTaXplIiwiZXJyMSIsInJzMSIsInJlc0RhdGEiLCJMaWJzIiwicmV0dXJuSnNvblJlc3VsdCIsImkxOG4iLCJfXyIsInRvdGFsUm93Iiwic2VuZCIsImUiLCJsb2dnZXIiLCJlcnJvciIsImdldExpc3RQYXJhbWV0ZXJCeURldmljZSIsImlzQmxhbmsiLCJkYXRlX2Zyb20iLCJjb252ZXJ0U3RyMkRhdGVWMDEiLCJkYXRlX3RvIiwiZ2V0TGlzdEFsZXJ0QnlEZXZpY2UiLCJnZXRMaXN0QWxlcnRCeURldmljZVNpemUiLCJCYXNlQ29udHJvbGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSxzQjs7O0FBQ0Ysc0NBQWM7QUFBQTs7QUFBQTtBQUViOztBQUdEOzs7Ozs7Ozs7OztnQ0FPU0MsRyxFQUFLQyxRLEVBQVU7O0FBRXBCLGdCQUFJO0FBQ0Esb0JBQUlDLFVBQVUsSUFBSUMsNkJBQUosRUFBZDtBQUNBLG9CQUFJQyxTQUFTLElBQUlDLHNCQUFKLEVBQWI7QUFDQUQseUJBQVNFLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxNQUFsQixFQUEwQkgsUUFBMUIsQ0FBVDtBQUNBQyx3QkFBUU0sT0FBUixDQUFnQkosTUFBaEIsRUFBd0IsVUFBVUssR0FBVixFQUFlQyxFQUFmLEVBQW1CO0FBQ3ZDLHdCQUFJLENBQUNELEdBQUwsRUFBVTtBQUNOUCxnQ0FBUVMsT0FBUixDQUFnQlAsTUFBaEIsRUFBd0IsVUFBVVEsSUFBVixFQUFnQkMs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ZUgsYUEzQkQsQ0EyQkUsT0FBT08sQ0FBUCxFQUFVO0FBQ1IscUJBQUtDLE1BQUwsQ0FBWUMsS0FBWixDQUFrQixVQUFVRixDQUE1QjtBQUNBLG9CQUFJUCxVQUFVLEVBQWQ7QUFDQUEsMEJBQVVDLEtBQUtDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsWUFBUixDQUE3QixFQUFvRCxFQUFFLFNBQVNHLElBQUksRUFBZixFQUFwRCxFQUF5RSxDQUF6RSxDQUFWO0FBQ0FyQixvQkFBSW9CLElBQUosQ0FBU04sT0FBVDtBQUNIO0FBRUo7O0FBRUQ7Ozs7Ozs7Ozs7eUNBT2lCZCxHLEVBQUtDLFEsRUFBVSxDQUUvQjs7QUFHRDs7Ozs7Ozs7OztxQ0FPYUQsRyxFQUFLQyxRLEVBQVUsQ0FFM0I7Ozs7RUE1SWdDOEIsd0I7O2tCQWdKdEJoQyxzQiIsImZpbGUiOiJDbGllbnREZXZpY2VDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VDb250cm9sbGVyIGZyb20gJy4uL2NvcmUvQmFzZUNvbnRyb2xsZXInO1xuaW1wb3J0IENsaWVudERldmljZVNlcnZpY2UgZnJvbSAnLi4vc2VydmljZXMvQ2xpZW50RGV2aWNlU2VydmljZSc7XG5pbXBvcnQgRGV2aWNlRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL0RldmljZUVudGl0eSc7XG5cbmNsYXNzIENsaWVudERldmljZUNvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0ge30gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgIGdldExpc3QocmVzLCBwb3N0RGF0YSkge1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBDbGllbnREZXZpY2VTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IERldmljZUVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBzZXJ2aWNlLmdldExpc3QoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0U2l6ZShlbnRpdHksIGZ1bmN0aW9uIChlcnIxLCByczEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXJyMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgcnMxLnRvdGFsUm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihcIkzhu5dpOiBcIiArIGUpO1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIFxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgTGlzdCBwYXJhbWV0ZXIgYnkgZGV2aWNlIGlkXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTQvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7fSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICAgZ2V0TGlzdFBhcmFtZXRlckJ5RGV2aWNlKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IENsaWVudERldmljZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgRGV2aWNlRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0TGlzdFBhcmFtZXRlckJ5RGV2aWNlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKFwiTOG7l2k6IFwiICsgZSk7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgXG4gICAgLyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgTGlzdCBhbGVydCBieSBkZXZpY2UgaWRcblx0ICogQGF1dGhvciBMb25nLlBoYW1cblx0ICogQHNpbmNlIDEwLzA5LzIwMjFcblx0ICogQHBhcmFtIHt9IHJlcyBcblx0ICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcblx0ICovXG4gICAgIGdldExpc3RBbGVydEJ5RGV2aWNlKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IENsaWVudERldmljZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgRGV2aWNlRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKGVudGl0eS5kYXRlX2Zyb20pKSB7XG4gICAgICAgICAgICAgICAgZW50aXR5LmRhdGVfZnJvbSA9IExpYnMuY29udmVydFN0cjJEYXRlVjAxKGVudGl0eS5kYXRlX2Zyb20sIFwiZGQvbW0veXl5eVwiLCBcIi9cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKGVudGl0eS5kYXRlX3RvKSkge1xuICAgICAgICAgICAgICAgIGVudGl0eS5kYXRlX3RvID0gTGlicy5jb252ZXJ0U3RyMkRhdGVWMDEoZW50aXR5LmRhdGVfdG8sIFwiZGQvbW0veXl5eVwiLCBcIi9cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0TGlzdEFsZXJ0QnlEZXZpY2UoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0TGlzdEFsZXJ0QnlEZXZpY2VTaXplKGVudGl0eSwgZnVuY3Rpb24gKGVycjEsIHJzMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlcnIxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCByczEudG90YWxSb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKFwiTOG7l2k6IFwiICsgZSk7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGFjdGlvblxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGFzeW5jIHNhdmVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRGVsZXRlIGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBkZWxldGVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuXG4gICAgfVxuXG5cbn1cbmV4cG9ydCBkZWZhdWx0IENsaWVudERldmljZUNvbnRyb2xsZXI7Il19