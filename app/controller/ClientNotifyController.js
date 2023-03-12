'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseController2 = require('../core/BaseController');

var _BaseController3 = _interopRequireDefault(_BaseController2);

var _ClientNotifyService = require('../services/ClientNotifyService');

var _ClientNotifyService2 = _interopRequireDefault(_ClientNotifyService);

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

var ClientNotifyController = function (_BaseController) {
    _inherits(ClientNotifyController, _BaseController);

    function ClientNotifyController() {
        _classCallCheck(this, ClientNotifyController);

        return _possibleConstructorReturn(this, (ClientNotifyController.__proto__ || Object.getPrototypeOf(ClientNotifyController)).call(this));
    }

    /**
     * @description Get List item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {} res 
     * @param {*} postData 
     */


    _createClass(ClientNotifyController, [{
        key: 'getNotifySize',
        value: function getNotifySize(res, postData) {
            try {
                var service = new _ClientNotifyService2.default();
                var entity = new _AlertEntity2.default();
                entity = Object.assign({}, entity, postData);

                service.getNotifySize(entity, function (err, rs) {
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, rs.totalRow);
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    }
                    res.send(resData);
                });
            } catch (e) {
                this.logger.error("Lỗi: " + e);
                var resData = {};
                resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * @description Get List item
         * @author Long.Pham
         * @since 14/09/2021
         * @param {} res 
         * @param {*} postData 
         */

    }, {
        key: 'getList',
        value: function getList(res, postData) {
            try {
                var service = new _ClientNotifyService2.default();
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
                var service = new _ClientNotifyService2.default();
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
                var service = new _ClientNotifyService2.default();
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
                var service = new _ClientNotifyService2.default();
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

    return ClientNotifyController;
}(_BaseController3.default);

exports.default = ClientNotifyController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0NsaWVudE5vdGlmeUNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiQ2xpZW50Tm90aWZ5Q29udHJvbGxlciIsInJlcyIsInBvc3REYXRhIiwic2VydmljZSIsIkNsaWVudE5vdGlmeVNlcnZpY2UiLCJlbnRpdHkiLCJBbGVydEVudGl0eSIsIk9iamVjdCIsImFzc2lnbiIsImdldE5vdGlmeVNpemUiLCJlcnIiLCJycyIsInJlc0RhdGEiLCJMaWJzIiwicmV0dXJuSnNvblJlc3VsdCIsImkxOG4iLCJfXyIsInRvdGFsUm93Iiwic2VuZCIsImUiLCJsb2dnZXIiLCJlcnJvciIsImlzQmxhbmsiLCJkYXRlX2Zyb20iLCJjb252ZXJ0U3RyMkRhdGVWMDEiLCJkYXRlX3RvIiwiZ2V0TGlzdCIsImdldFNpemUiLCJlcnIxIiwicnMxIiwiaWQiLCJkZWxldGUiLCJjbG9zZUFsbCIsInJzdXBkYXRlIiwic3RhdHVzIiwiZW5kX2RhdGUiLCJtb21lbnQiLCJyZXF1aXJlIiwiZm9ybWF0IiwidmFsaWRhdGUiLCJBbGVydFZhbGlkYXRlIiwiRkxWYWxpZGF0aW9uQWxsIiwia2V5IiwibWVzc2FnZSIsImhhc093blByb3BlcnR5Iiwic2NyZWVuX21vZGUiLCJDb25zdGFudHMiLCJ1cGRhdGUiLCJCYXNlQ29udHJvbGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTUEsc0I7OztBQUNGLHNDQUFjO0FBQUE7O0FBQUE7QUFFYjs7QUFFRDs7Ozs7Ozs7Ozs7c0NBT2VDLEcsRUFBS0MsUSxFQUFVO0FBQzFCLGdCQUFJO0FBQ0Esb0JBQUlDLFVBQVUsSUFBSUMsNkJBQUosRUFBZDtBQUNBLG9CQUFJQyxTQUFTLElBQUlDLHFCQUFKLEVBQWI7QUFDQUQseUJBQVNFLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxNQUFsQixFQUEwQkgsUUFBMUIsQ0FB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QVNOLFNBQVQ7QUFDSCxxQ0FSRCxDQVFFLE9BQU9TLEtBQVAsRUFBYztBQUNaLDRDQUFJVCxZQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QkMsS0FBS0MsRUFBTCxDQUFRLFlBQVIsQ0FBN0IsRUFBb0QsRUFBRSxTQUFTSyxLQUFYLEVBQXBELEVBQXdFLENBQXhFLENBQWQ7QUFDQXBCLDRDQUFJaUIsSUFBSixDQUFTTixTQUFUO0FBQ0g7QUFDSixpQ0FiRDtBQWNILDZCQWZEO0FBZ0JILHlCQWpCRCxNQWlCTztBQUNILGdDQUFJQSxZQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QkMsS0FBS0MsRUFBTCxDQUFRLFlBQVIsQ0FBN0IsRUFBb0QsRUFBcEQsRUFBd0QsQ0FBeEQsQ0FBZDtBQUNBZixnQ0FBSWlCLElBQUosQ0FBU04sU0FBVDtBQUNIO0FBRUoscUJBNUJELENBNEJFLE9BQU9PLENBQVAsRUFBVTtBQUNSLDRCQUFJUCxZQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QkMsS0FBS0MsRUFBTCxDQUFRLFlBQVIsQ0FBN0IsRUFBb0QsRUFBRSxTQUFTRyxJQUFJLEVBQWYsRUFBcEQsRUFBeUUsQ0FBekUsQ0FBZDtBQUNBbEIsNEJBQUlpQixJQUFKLENBQVNOLFNBQVQ7QUFDSDtBQUNKLGlCQWpDRDtBQWtDSCxhQS9DRCxDQStDRSxPQUFPTyxDQUFQLEVBQVU7QUFDUixvQkFBSVAsVUFBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtBQUtDLEVBQUwsQ0FBUSxZQUFSLENBQTdCLEVBQW9ELEVBQUUsU0FBU0csSUFBSSxFQUFmLEVBQXBELEVBQXlFLENBQXpFLENBQWQ7QUFDQWxCLG9CQUFJaUIsSUFBSixDQUFTTixPQUFUO0FBQ0g7QUFDSjs7OztFQXhOZ0NvQyx3Qjs7a0JBME50QmhELHNCIiwiZmlsZSI6IkNsaWVudE5vdGlmeUNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUNvbnRyb2xsZXIgZnJvbSAnLi4vY29yZS9CYXNlQ29udHJvbGxlcic7XG5pbXBvcnQgQ2xpZW50Tm90aWZ5U2VydmljZSBmcm9tICcuLi9zZXJ2aWNlcy9DbGllbnROb3RpZnlTZXJ2aWNlJztcbmltcG9ydCBBbGVydEVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9BbGVydEVudGl0eSc7XG5pbXBvcnQgQWxlcnRWYWxpZGF0ZSBmcm9tICcuLi92YWxpZGF0b3IvQWxlcnRWYWxpZGF0ZSc7XG5pbXBvcnQgU3luYyBmcm9tICdzeW5jJztcblxuY2xhc3MgQ2xpZW50Tm90aWZ5Q29udHJvbGxlciBleHRlbmRzIEJhc2VDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0ge30gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgIGdldE5vdGlmeVNpemUocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgQ2xpZW50Tm90aWZ5U2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBBbGVydEVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG5cbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0Tm90aWZ5U2l6ZShlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHt9LCBycy50b3RhbFJvdyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBMaXN0IGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHt9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldExpc3QocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgQ2xpZW50Tm90aWZ5U2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBBbGVydEVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBpZiAoIUxpYnMuaXNCbGFuayhlbnRpdHkuZGF0ZV9mcm9tKSkge1xuICAgICAgICAgICAgICAgIGVudGl0eS5kYXRlX2Zyb20gPSBMaWJzLmNvbnZlcnRTdHIyRGF0ZVYwMShlbnRpdHkuZGF0ZV9mcm9tLCBcImRkL21tL3l5eXlcIiwgXCIvXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIUxpYnMuaXNCbGFuayhlbnRpdHkuZGF0ZV90bykpIHtcbiAgICAgICAgICAgICAgICBlbnRpdHkuZGF0ZV90byA9IExpYnMuY29udmVydFN0cjJEYXRlVjAxKGVudGl0eS5kYXRlX3RvLCBcImRkL21tL3l5eXlcIiwgXCIvXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZXJ2aWNlLmdldExpc3QoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0U2l6ZShlbnRpdHksIGZ1bmN0aW9uIChlcnIxLCByczEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXJyMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgcnMxLnRvdGFsUm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihcIkzhu5dpOiBcIiArIGUpO1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIFxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRGVsZXRlIGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBkZWxldGVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgQ2xpZW50Tm90aWZ5U2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBBbGVydEVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgaWYgKExpYnMuaXNCbGFuayhlbnRpdHkuaWQpKSB7XG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiTk9UX0VYSVNUXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZXJ2aWNlLmRlbGV0ZShlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfU1VDQ0VTUycpLCBlbnRpdHksIDEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLkRFTEVURV9GQUlMJyksIHt9LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfRkFJTCcpLCB7fSwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRGVsZXRlIGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBjbG9zZUFsbChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBDbGllbnROb3RpZnlTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IEFsZXJ0RW50aXR5KCksIHBvc3REYXRhKTtcblxuICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VydmljZS5jbG9zZUFsbChlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfU1VDQ0VTUycpLCBlbnRpdHksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZXJyb3IgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGFjdGlvblxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgICBhc3luYyBzYXZlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IENsaWVudE5vdGlmeVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgQWxlcnRFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoZW50aXR5LnN0YXR1cykgJiYgZW50aXR5LnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgZW50aXR5LmVuZF9kYXRlID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoZW50aXR5LnN0YXR1cykgJiYgZW50aXR5LnN0YXR1cyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW9tZW50ID0gcmVxdWlyZShcIm1vbWVudFwiKTtcbiAgICAgICAgICAgICAgICBlbnRpdHkuZW5kX2RhdGUgPSBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHZhbGlkYXRlID0gbmV3IEFsZXJ0VmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHZhbGlkYXRlLkZMVmFsaWRhdGlvbkFsbChlbnRpdHksIGFzeW5jIGZ1bmN0aW9uIChlcnIsIGtleSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBlcnIubWVzc2FnZSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVudGl0eS5oYXNPd25Qcm9wZXJ0eSgnc2NyZWVuX21vZGUnKSAmJiBlbnRpdHkuc2NyZWVuX21vZGUgPT0gQ29uc3RhbnRzLnNjcmVlbl9tb2RlLnVwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS51cGRhdGUoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCByc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX0ZBSUwnKSwgeyBcImVycm9yXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX1NVQ0NFU1MnKSwgZW50aXR5LCByc3VwZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlcnJvciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBDbGllbnROb3RpZnlDb250cm9sbGVyOyJdfQ==