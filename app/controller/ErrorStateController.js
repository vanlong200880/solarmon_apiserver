'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractManagerController = require('../core/AbstractManagerController');

var _AbstractManagerController2 = _interopRequireDefault(_AbstractManagerController);

var _ErrorStateEntity = require('../entities/ErrorStateEntity');

var _ErrorStateEntity2 = _interopRequireDefault(_ErrorStateEntity);

var _ErrorStateService = require('../services/ErrorStateService');

var _ErrorStateService2 = _interopRequireDefault(_ErrorStateService);

var _ErrorStateValidate = require('../validator/ErrorStateValidate');

var _ErrorStateValidate2 = _interopRequireDefault(_ErrorStateValidate);

var _sync = require('sync');

var _sync2 = _interopRequireDefault(_sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ErrorStateController = function (_AbstractManagerContr) {
    _inherits(ErrorStateController, _AbstractManagerContr);

    function ErrorStateController() {
        _classCallCheck(this, ErrorStateController);

        return _possibleConstructorReturn(this, (ErrorStateController.__proto__ || Object.getPrototypeOf(ErrorStateController)).apply(this, arguments));
    }

    _createClass(ErrorStateController, [{
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
                var service = new _ErrorStateService2.default();
                var entity = new _ErrorStateEntity2.default();
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
         * @since 11/07/2019
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'getDetail',
        value: function getDetail(res, postData) {
            try {
                var service = new _ErrorStateService2.default();
                var entity = new _ErrorStateEntity2.default();
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
         * @author thanh.bay
         * @since 11/07/2018
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'deleteAction',
        value: function deleteAction(res, postData) {
            try {
                var service = new _ErrorStateService2.default();
                var entity = new _ErrorStateEntity2.default();
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
        key: 'updateStatus',
        value: function updateStatus(res, postData) {
            try {
                var service = new _ErrorStateService2.default();
                var entity = Object.assign({}, new _ErrorStateEntity2.default(), postData);
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
                                var _resData5 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                res.send(_resData5);
                                return;
                            }
                            var _resData4 = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                            res.send(_resData4);
                        } catch (error) {
                            var _resData6 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                            res.send(_resData6);
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
         * @since 11/07/2019
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'saveAction',
        value: async function saveAction(res, postData) {
            try {
                var self = this;
                var service = new _ErrorStateService2.default();
                var entity = Object.assign({}, new _ErrorStateEntity2.default(), postData);
                entity.status = !entity.status || entity.status == -1 ? 0 : 1;
                var validate = new _ErrorStateValidate2.default();

                var errors = await validate.FLValidationAll(entity);
                if (errors != null) {
                    errors.validate = false;
                    res.send(Libs.returnJsonResult(false, "", errors, 0));
                    return;
                }

                if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                    (0, _sync2.default)(function () {
                        service.insertErrorState(entity, function (err, rs) {
                            if (rs && err) {
                                var _resData7 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                                res.send(_resData7);
                            } else {
                                var _resData8 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                                res.send(_resData8);
                            }
                        });
                    });
                } else if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                    service.updateErrorState(entity, function (err, rs) {
                        if (rs) {
                            var _resData9 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                            res.send(_resData9);
                        } else {
                            var _resData10 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                            res.send(_resData10);
                        }
                    });
                }
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
                var service = new _ErrorStateService2.default();
                var entity = new _ErrorStateEntity2.default();
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

    return ErrorStateController;
}(_AbstractManagerController2.default);

exports.default = ErrorStateController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0Vycm9yU3RhdGVDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkVycm9yU3RhdGVDb250cm9sbGVyIiwicmVzIiwicG9zdERhdGEiLCJzZXJ2aWNlIiwiRXJyb3JTdGF0ZVNlcnZpY2UiLCJlbnRpdHkiLCJFcnJvclN0YXRlRW50aXR5IiwiT2JqZWN0IiwiYXNzaWduIiwiZ2V0TGlzdCIsImVyciIsInJzIiwiZ2V0U2l6ZSIsImVycjEiLCJyczEiLCJyZXNEYXRhIiwiTGlicyIsInJldHVybkpzb25SZXN1bHQiLCJpMThuIiwiX18iLCJ0b3RhbFJvdyIsInNlbmQiLCJlIiwibG9nZ2VyIiwiZXJyb3IiLCJnZXREZXRhaWwiLCJpc0JsYW5rIiwiaWQiLCJkZWxldGUiLCJyc3VwZGF0ZSIsInN0YXR1cyIsInVwZGF0ZVN0YXR1cyIsInNlbGYiLCJ2YWxpZGF0ZSIsIkVycm9yU3RhdGVWYWxpZGF0ZSIsImVycm9ycyIsIkZMVmFsaWRhdGlvbkFsbCIsImhhc093blByb3BlcnR5Iiwic2NyZWVuX21vZGUiLCJDb25zdGFudHMiLCJpbnNlcnQiLCJpbnNlcnRFcnJvclN0YXRlIiwidXBkYXRlIiwidXBkYXRlRXJyb3JTdGF0ZSIsImdldERyb3BEb3duTGlzdCIsIkFic3RyYWN0TWFuYWdlckNvbnRyb2xsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRU1BLG9COzs7Ozs7Ozs7Ozs7O0FBRUY7Ozs7Ozs7Z0NBT1FDLEcsRUFBS0MsUSxFQUFVO0FBQ25CLGdCQUFJO0FBQ0Esb0JBQUlDLFVBQVUsSUFBSUMsMkJBQUosRUFBZDtBQUNBLG9CQUFJQyxTQUFTLElBQUlDLDBCQUFKLEVBQWI7QUFDQUQseUJBQVNFLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxNQUFsQixFQUEwQkgsUUFBMUIsQ0FBVDtBQUNBQyx3QkFBUU0sT0FBUixDQUFnQkosTUFBaEIsRUFBd0IsVUFBVUssR0FBVixFQUFlQyxFQUFmLEVBQW1CO0FBQ3ZDLHdCQUFJLENBQUNELEdBQUwsRUFBVTtBQUNOUCxnQ0FBUVMsT0FBUixDQUFnQlAsTUFBaEIsRUFBd0IsVUFBVVEsSUFBVixFQUFnQkMsR0FBaEIsRUFBcUI7QUFDekMsZ0NBQUksQ0FBQ0QsSUFBTCxFQUFXO0FBQ1BFLDBDQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixJQUF0QixFQUE0QkMsS0FBS0MsRUFBTCxDQUFRLGdCQUFSLENBQTVCLEVBQXVEUixFQUF2RCxFQUEyREcsSUFBSU0sUUFBL0QsQ0FBVjtBQUNILDZCQUZELE1BRU87QUFDSEwsMENBQVVDLEtBQUtDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsYUFBUixDQUE3QixFQUFxRCxFQUFyRCxFQUF5RCxDQUF6RCxDQUFWO0FBQ0g7QUFDRGxCLGdDQUFJb0IsSUFBSixDQUFTTixPQUFUO0FBQ0gseUJBUEQ7QUFRSCxxQkFURCxNQVNPO0FBQ0hBLGtDQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QkMsS0FBS0MsRUFBTCxDQUFRLGFBQVIsQ0FBN0IsRUFBcUQsRUFBckQsRUFBeUQsQ0FBekQsQ0FBVjtBQUNBbEIsNEJBQUlvQixJQUFKLENBQVNOLE9BQVQ7QUFDSDtBQUNKLGlCQWREO0FBZUgsYUFuQkQsQ0FtQkUsT0FBT08sQ0FBUCxFQUFVO0FBQ1IscUJBQUtDLE1BQUwsQ0FBWUMsS0FBWixDQUFrQixVQUFVRixDQUE1QjtBQUNBLG9CQUFJUCxVQUFVLEVBQWQ7QUFDQUEsMEJBQVVDLEtBQUtDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsWUFBUixDQUE3QixFQUFvRCxFQUFFLFNBQVNHLElBQUksRUFBZixFQUFwRCxFQUF5RSxDQUF6RSxDQUFWO0FBQ0FyQixvQkFBSW9CLElBQUosQ0FBU04sT0FBVDtBQUNIO0FBRUo7O0FBR0Q7Ozs7Ozs7Ozs7a0NBT1VkLEcsRUFBS0MsUSxFQUFVO0FBQ3JCLGdCQUFJO0FBQ0Esb0JBQUlDLFVBQVUsSUFBSUMsMkJBQUosRUFBZDtBQUNBLG9CQUFJQyxTQUFTLElBQUlDLDBCQUFKLEVBQWI7QUFDQUQseUJBQVNFLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxNQUFsQixFQUEwQkgsUUFBMUIsQ0FBVDtBQUNBQyx3QkFBUXNCLFNBQVIsQ0FBa0JwQixNQUFsQixFQUEwQixVQUFVSyxHQUFWLEVBQWVDLEVBQWYsRUFBbUI7QUFDekMsd0JBQUlJLFVBQVUsRUFBZDtBQUNBLHdCQUFJLENBQUNMLEdBQUwsRUFBVTtBQUNOSyxrQ0FBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsSUFBdEIsRUFBNEJDLEtBQUtDLEVBQUwsQ0FBUSxnQkFBUixDQUE1QixFQUF1RFIsRUFBdkQsRUFBMkQsQ0FBM0QsQ0FBVjtBQUNILHFCQUZELE1BRU87QUFDSEksa0NBQVVDLEtBQUtDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsYUFBUixDQUE3QixFQUFxRCxFQUFyRCxFQUF5RCxDQUF6RCxDQUFWO0FBQ0g7QUFDRGxCLHdCQUFJb0IsSUFBSixDQUFTTixPQUFUO0FBQ0gsaUJBUkQ7QUFTSCxhQWJELENBYUUsT0FBT08sQ0FBUCxFQUFVO0FBQ1Isb0JBQUlQLFVBQVUsRUFBZDtBQUNBQSwwQkFBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtBQUtDLEVBQUwsQ0FBUSxZQUFSLENBQTdCLEVBQW9ELEVBQUUsU0FBU0csSUFBSSxFQUFmLEVBQXBELEVBQXlFLENBQXpFLENBQVY7QUFDQXJCLG9CQUFJb0IsSUFBSixDQUFTTixPQUFUO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7OztxQ0FPYWQsRyxFQUFLQyxRLEVBQVU7QUFDeEIsZ0JBQUk7QUFDQSxvQkFBSUMsVUFBVSxJQUFJQywyQkFBSixFQUFkO0FBQ0Esb0JBQUlDLFNBQVMsSUFBSUMsMEJBQUosRUFBYjtBQUNBRCx5QkFBU0UsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JILE1BQWxCLEVBQTBCSCxRQUExQixDQUFUO0FBQ0Esb0JBQUljLEtBQUtVLE9BQUwsQ0FBYXJCLE9BQU9zQixFQUFwQixDQUFKLEVBQTZCO0FBQ3pCLHdCQUFJWixVQUFVLEVBQWQ7QUFDQUEsOEJBQVVDLEtBQUtDLGdCQUFMLENBQXNCLElBQXRCLEVBQTRCQyxLQUFLQyxFQUFMLENBQVEsV0FBUixDQUE1QixFQUFrRCxFQUFsRCxFQUFzRCxDQUF0RCxDQUFWO0FBQ0FsQix3QkFBSW9CLElBQUosQ0FBU04sT0FBVDtBQUNBO0FBQ0g7QUFDRCxvQ0FBSyxZQUFZO0FBQ2JaLDRCQUFReUIsTUFBUixDQUFldkIsTUFBZixFQUF1QixVQUFVSyxHQUFWLEVBQWVtQixRQUFmLEVBQXlCO0FBQzVDLDRCQUFJO0FBQ0EsZ0NBQUksQ0FBQ0EsUUFBTCxFQUFlO0FBQ1gsb0NBQUlkLFlBQVVDLEtBQUtDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsb0JBQVIsQ0FBN0IsRUFBNEQsRUFBRSxTQUFTVCxHQUFYLEVBQTVELEVBQThFLENBQTlFLENBQWQ7QUFDQVQsb0NBQUlvQixJQUFKLENBQVNOLFNBQVQ7QUFDQTtBQUNIO0FBQ0QsZ0NBQUlBLFdBQVVDLEtBQUtDLGdCQUFMLENBQXNCLElBQXRCLEVBQTRCQyxLQUFLQyxFQUFMLENBQVEsdUJBQVIsQ0FBNUIsRUFBOERkLE1BQTlELEVBQXNFLENBQXRFLENBQWQ7QUFDQUosZ0NBQUlvQixJQUFKLENBQVNOLFFBQVQ7QUFDSCx5QkFSRCxDQVFFLE9BQU9TLEtBQVAsRUFBYztBQUNaLGdDQUFJVCxZQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QkMsS0FBS0MsRUFBTCxDQUFRLFlBQVIsQ0FBN0IsRUFBb0QsRUFBRSxTQUFTSyxLQUFYLEVBQXBELEVBQXdFLENBQXhFLENBQWQ7QUFDQXZCLGdDQUFJb0IsSUFBSixDQUFTTixTQUFUO0FBQ0g7QUFDSixxQkFiRDtBQWNILGlCQWZEO0FBZ0JILGFBMUJELENBMEJFLE9BQU9PLENBQVAsRUFBVTtBQUNSLG9CQUFJUCxVQUFVLEVBQWQ7QUFDQUEsMEJBQVVDLEtBQUtDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsWUFBUixDQUE3QixFQUFvRCxFQUFFLFNBQVNHLElBQUksRUFBZixFQUFwRCxFQUF5RSxDQUF6RSxDQUFWO0FBQ0FyQixvQkFBSW9CLElBQUosQ0FBU04sT0FBVDtBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7Ozs7cUNBT2FkLEcsRUFBS0MsUSxFQUFVO0FBQ3hCLGdCQUFJO0FBQ0Esb0JBQUlDLFVBQVUsSUFBSUMsMkJBQUosRUFBZDtBQUNBLG9CQUFJQyxTQUFTRSxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQixJQUFJRiwwQkFBSixFQUFsQixFQUEwQ0osUUFBMUMsQ0FBYjtBQUNBRyx1QkFBT3lCLE1BQVAsR0FBaUIsQ0FBQ3pCLE9BQU95QixNQUFSLElBQWtCekIsT0FBT3lCLE1BQVAsSUFBaUIsQ0FBQyxDQUFyQyxHQUEwQyxDQUExQyxHQUE4QyxDQUE5RDs7QUFFQSxvQkFBSWQsS0FBS1UsT0FBTCxDQUFhckIsT0FBT3NCLEVBQXBCLENBQUosRUFBNkI7QUFDekIsd0JBQUlaLFVBQVUsRUFBZDtBQUNBQSw4QkFBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsSUFBdEIsRUFBNEJDLEtBQUtDLEVBQUwsQ0FBUSxXQUFSLENBQTVCLEVBQWtELEVBQWxELEVBQXNELENBQXRELENBQVY7QUFDQWxCLHdCQUFJb0IsSUFBSixDQUFTTixPQUFUO0FBQ0E7QUFDSDs7QUFFRCxvQ0FBSyxZQUFZO0FBQ2JaLDRCQUFRNEIsWUFBUixDQUFxQjFCLE1BQXJCLEVBQTZCLFVBQVVLLEdBQVYsRUFBZW1CLFFBQWYsRUFBeUI7QUFDbEQsNEJBQUk7QUFDQSxnQ0FBSSxDQUFDQSxRQUFMLEVBQWU7QUFDWCxvQ0FBSWQsWUFBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtBQUtDLEVBQUwsQ0FBUSxvQkFBUixDQUE3QixFQUE0RCxFQUFFLFNBQVNULEdBQVgsRUFBNUQsRUFBOEUsQ0FBOUUsQ0FBZDtBQUNBVCxvQ0FBSW9CLElBQUosQ0FBU04sU0FBVDtBQUNBO0FBQ0g7QUFDRCxnQ0FBSUEsWUFBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsSUFBdEIsRUFBNEJDLEtBQUtDLEVBQUwsQ0FBUSx1QkFBUixDQUE1QixFQUE4RGQsTUFBOUQsRUFBc0UsQ0FBdEUsQ0FBZDtBQUNBSixnQ0FBSW9CLElBQUosQ0FBU04sU0FBVDtBQUNILHlCQVJELENBUUUsT0FBT1MsS0FBUCxFQUFjO0FBQ1osZ0NBQUlULFlBQVVDLEtBQUtDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsWUFBUixDQUE3QixFQUFvRCxFQUFFLFNBQVNLLEtBQVgsRUFBcEQsRUFBd0UsQ0FBeEUsQ0FBZDtBQUNBdkIsZ0NBQUlvQixJQUFKLENBQVNOLFNBQVQ7QUFDSDtBQUNKLHFCQWJEO0FBY0gsaUJBZkQ7QUFpQkgsYUE3QkQsQ0E2QkUsT0FBT08sQ0FBUCxFQUFVO0FBQ1Isb0JBQUlQLFVBQVVDLEtBQUtDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsWUFBUixDQUE3QixFQUFvRCxFQUFFLFNBQVNHLElBQUksRUFBZixFQUFwRCxFQUF5RSxDQUF6RSxDQUFkO0FBQ0FyQixvQkFBSW9CLElBQUosQ0FBU04sT0FBVDtBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7Ozs7eUNBT2lCZCxHLEVBQUtDLFEsRUFBVTtBQUM1QixnQkFBSTtBQUNBLG9CQUFJOEIsT0FBTyxJQUFYO0FBQ0Esb0JBQUk3QixVQUFVLElBQUlDLDJCQUFKLEVBQWQ7QUFDQSxvQkFBSUMsU0FBU0UsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsSUFBSUYsMEJBQUosRUFBbEIsRUFBMENKLFFBQTFDLENBQWI7QUFDQUcsdUJBQU95QixNQUFQLEdBQWlCLENBQUN6QixPQUFPeUIsTUFBUixJQUFrQnpCLE9BQU95QixNQUFQLElBQWlCLENBQUMsQ0FBckMsR0FBMEMsQ0FBMUMsR0FBOEMsQ0FBOUQ7QUFDQSxvQkFBSUcsV0FBVyxJQUFJQyw0QkFBSixFQUFmOztBQUVBLG9CQUFJQyxTQUFTLE1BQU1GLFNBQVNHLGVBQVQsQ0FBeUIvQixNQUF6QixDQUFuQjtBQUNBLG9CQUFJOEIsVUFBVSxJQUFkLEVBQW9CO0FBQ2hCQSwyQkFBT0YsUUFBUCxHQUFrQixLQUFsQjtBQUNBaEMsd0JBQUlvQixJQUFKLENBQVNMLEtBQUtDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCLEVBQTdCLEVBQWlDa0IsTUFBakMsRUFBeUMsQ0FBekMsQ0FBVDtBQUNBO0FBQ0g7O0FBR0Qsb0JBQUk5QixPQUFPZ0MsY0FBUCxDQUFzQixhQUF0QixLQUF3Q2hDLE9BQU9pQyxXQUFQLElBQXNCQyxVQUFVRCxXQUFWLENBQXNCRSxNQUF4RixFQUFnRztBQUM1Rix3Q0FBSyxZQUFZO0FBQ2JyQyxnQ0FBUXNDLGdCQUFSLENBQXlCcEMsTUFBekIsRUFBaUMsVUFBVUssR0FBVixFQUFlQyxFQUFmLEVBQW1CO0FBQ2hELGdDQUFJQSxNQUFNRCxHQUFWLEVBQWU7QUFDWCxvQ0FBSUssWUFBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsSUFBdEIsRUFBNEJDLEtBQUtDLEVBQUwsQ0FBUSxxQkFBUixDQUE1QixFQUE0RGQsTUFBNUQsRUFBb0UsQ0FBcEUsQ0FBZDtBQUNBSixvQ0FBSW9CLElBQUosQ0FBU04sU0FBVDtBQUNILDZCQUhELE1BR087QUFDSCxvQ0FBSUEsWUFBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtBQUtDLEVBQUwsQ0FBUSxrQkFBUixDQUE3QixFQUEwRCxFQUFFLFNBQVNULEdBQVgsRUFBMUQsRUFBNEUsQ0FBNUUsQ0FBZDtBQUNBVCxvQ0FBSW9CLElBQUosQ0FBU04sU0FBVDtBQUNIO0FBQ0oseUJBUkQ7QUFTSCxxQkFWRDtBQVdILGlCQVpELE1BWU8sSUFBSVYsT0FBT2dDLGNBQVAsQ0FBc0IsYUFBdEIsS0FBd0NoQyxPQUFPaUMsV0FBUCxJQUFzQkMsVUFBVUQsV0FBVixDQUFzQkksTUFBeEYsRUFBZ0c7QUFDbkd2Qyw0QkFBUXdDLGdCQUFSLENBQXlCdEMsTUFBekIsRUFBaUMsVUFBVUssR0FBVixFQUFlQyxFQUFmLEVBQW1CO0FBQ2hELDRCQUFJQSxFQUFKLEVBQVE7QUFDSixnQ0FBSUksWUFBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsSUFBdEIsRUFBNEJDLEtBQUtDLEVBQUwsQ0FBUSxxQkFBUixDQUE1QixFQUE0RGQsTUFBNUQsRUFBb0UsQ0FBcEUsQ0FBZDtBQUNBSixnQ0FBSW9CLElBQUosQ0FBU04sU0FBVDtBQUNILHlCQUhELE1BR087QUFDSCxnQ0FBSUEsYUFBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtBQUtDLEVBQUwsQ0FBUSxrQkFBUixDQUE3QixFQUEwRCxFQUFFLFNBQVNULEdBQVgsRUFBMUQsRUFBNEUsQ0FBNUUsQ0FBZDtBQUNBVCxnQ0FBSW9CLElBQUosQ0FBU04sVUFBVDtBQUNIO0FBQ0oscUJBUkQ7QUFTSDtBQUNKLGFBdENELENBc0NFLE9BQU9PLENBQVAsRUFBVTtBQUNSLG9CQUFJUCxVQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QkMsS0FBS0MsRUFBTCxDQUFRLFlBQVIsQ0FBN0IsRUFBb0QsRUFBRSxTQUFTRyxJQUFJLEVBQWYsRUFBcEQsRUFBeUUsQ0FBekUsQ0FBZDtBQUNBckIsb0JBQUlvQixJQUFKLENBQVNOLE9BQVQ7QUFDSDtBQUNKOztBQUVEOzs7Ozs7Ozs7O3dDQU9pQmQsRyxFQUFLQyxRLEVBQVU7QUFDNUIsZ0JBQUk7QUFDQSxvQkFBSUMsVUFBVSxJQUFJQywyQkFBSixFQUFkO0FBQ0Esb0JBQUlDLFNBQVMsSUFBSUMsMEJBQUosRUFBYjtBQUNBRCx5QkFBU0UsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JILE1BQWxCLEVBQTBCSCxRQUExQixDQUFUO0FBQ0FDLHdCQUFReUMsZUFBUixDQUF3QnZDLE1BQXhCLEVBQWdDLFVBQVVLLEdBQVYsRUFBZUMsRUFBZixFQUFtQjtBQUMvQyx3QkFBSSxDQUFDRCxHQUFMLEVBQVU7QUFDTkssa0NBQVVDLEtBQUtDLGdCQUFMLENBQXNCLElBQXRCLEVBQTRCQyxLQUFLQyxFQUFMLENBQVEsZ0JBQVIsQ0FBNUIsRUFBdURSLEVBQXZELEVBQTJELENBQTNELENBQVY7QUFDQVYsNEJBQUlvQixJQUFKLENBQVNOLE9BQVQ7QUFDSCxxQkFIRCxNQUdPO0FBQ0hBLGtDQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QkMsS0FBS0MsRUFBTCxDQUFRLGFBQVIsQ0FBN0IsRUFBcUQsRUFBckQsRUFBeUQsQ0FBekQsQ0FBVjtBQUNBbEIsNEJBQUlvQixJQUFKLENBQVNOLE9BQVQ7QUFDSDtBQUNKLGlCQVJEO0FBU0gsYUFiRCxDQWFFLE9BQU9PLENBQVAsRUFBVTtBQUNSLHFCQUFLQyxNQUFMLENBQVlDLEtBQVosQ0FBa0IsVUFBVUYsQ0FBNUI7QUFDQSxvQkFBSVAsVUFBVSxFQUFkO0FBQ0FBLDBCQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QkMsS0FBS0MsRUFBTCxDQUFRLFlBQVIsQ0FBN0IsRUFBb0QsRUFBRSxTQUFTRyxJQUFJLEVBQWYsRUFBcEQsRUFBeUUsQ0FBekUsQ0FBVjtBQUNBckIsb0JBQUlvQixJQUFKLENBQVNOLE9BQVQ7QUFDSDtBQUNKOzs7O0VBdE84QjhCLG1DOztrQkF5T3BCN0Msb0IiLCJmaWxlIjoiRXJyb3JTdGF0ZUNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciBmcm9tICcuLi9jb3JlL0Fic3RyYWN0TWFuYWdlckNvbnRyb2xsZXInO1xuaW1wb3J0IEVycm9yU3RhdGVFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvRXJyb3JTdGF0ZUVudGl0eSc7XG5pbXBvcnQgRXJyb3JTdGF0ZVNlcnZpY2UgZnJvbSAnLi4vc2VydmljZXMvRXJyb3JTdGF0ZVNlcnZpY2UnO1xuaW1wb3J0IEVycm9yU3RhdGVWYWxpZGF0ZSBmcm9tICcuLi92YWxpZGF0b3IvRXJyb3JTdGF0ZVZhbGlkYXRlJztcbmltcG9ydCBTeW5jIGZyb20gJ3N5bmMnO1xuXG5jbGFzcyBFcnJvclN0YXRlQ29udHJvbGxlciBleHRlbmRzIEFic3RyYWN0TWFuYWdlckNvbnRyb2xsZXIge1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBMaXN0IGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMC8wNy8yMDE5XG4gICAgICogQHBhcmFtIHt9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldExpc3QocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgRXJyb3JTdGF0ZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgRXJyb3JTdGF0ZUVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBzZXJ2aWNlLmdldExpc3QoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0U2l6ZShlbnRpdHksIGZ1bmN0aW9uIChlcnIxLCByczEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXJyMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgcnMxLnRvdGFsUm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihcIkzhu5dpOiBcIiArIGUpO1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBkZXRhaWwgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDExLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldERldGFpbChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc2VydmljZSA9IG5ldyBFcnJvclN0YXRlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBFcnJvclN0YXRlRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0RGV0YWlsKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIERlbGV0ZSBpdGVtXG4gICAgICogQGF1dGhvciB0aGFuaC5iYXlcbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOFxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZGVsZXRlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IEVycm9yU3RhdGVTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IEVycm9yU3RhdGVFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgaWYgKExpYnMuaXNCbGFuayhlbnRpdHkuaWQpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJOT1RfRVhJU1RcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBTeW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLmRlbGV0ZShlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfU1VDQ0VTUycpLCBlbnRpdHksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZXJyb3IgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFNhdmUgYWN0aW9uXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgdXBkYXRlU3RhdHVzKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IEVycm9yU3RhdGVTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IEVycm9yU3RhdGVFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgZW50aXR5LnN0YXR1cyA9ICghZW50aXR5LnN0YXR1cyB8fCBlbnRpdHkuc3RhdHVzID09IC0xKSA/IDAgOiAxO1xuXG4gICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGVudGl0eS5pZCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIk5PVF9FWElTVFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VydmljZS51cGRhdGVTdGF0dXMoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCByc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX0ZBSUwnKSwgeyBcImVycm9yXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX1NVQ0NFU1MnKSwgZW50aXR5LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGVycm9yIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFNhdmUgYWN0aW9uXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgYXN5bmMgc2F2ZUFjdGlvbihyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBFcnJvclN0YXRlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBFcnJvclN0YXRlRW50aXR5KCksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIGVudGl0eS5zdGF0dXMgPSAoIWVudGl0eS5zdGF0dXMgfHwgZW50aXR5LnN0YXR1cyA9PSAtMSkgPyAwIDogMTtcbiAgICAgICAgICAgIGxldCB2YWxpZGF0ZSA9IG5ldyBFcnJvclN0YXRlVmFsaWRhdGUoKTtcblxuICAgICAgICAgICAgbGV0IGVycm9ycyA9IGF3YWl0IHZhbGlkYXRlLkZMVmFsaWRhdGlvbkFsbChlbnRpdHkpO1xuICAgICAgICAgICAgaWYgKGVycm9ycyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JzLnZhbGlkYXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBcIlwiLCBlcnJvcnMsIDApKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKGVudGl0eS5oYXNPd25Qcm9wZXJ0eSgnc2NyZWVuX21vZGUnKSAmJiBlbnRpdHkuc2NyZWVuX21vZGUgPT0gQ29uc3RhbnRzLnNjcmVlbl9tb2RlLmluc2VydCkge1xuICAgICAgICAgICAgICAgIFN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmluc2VydEVycm9yU3RhdGUoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJzICYmIGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5TQVZFX1NVQ0NFU1MnKSwgZW50aXR5LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5TQVZFX0ZBSUwnKSwgeyBcImVycm9yXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVudGl0eS5oYXNPd25Qcm9wZXJ0eSgnc2NyZWVuX21vZGUnKSAmJiBlbnRpdHkuc2NyZWVuX21vZGUgPT0gQ29uc3RhbnRzLnNjcmVlbl9tb2RlLnVwZGF0ZSkge1xuICAgICAgICAgICAgICAgIHNlcnZpY2UudXBkYXRlRXJyb3JTdGF0ZShlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfU1VDQ0VTUycpLCBlbnRpdHksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcblx0ICogQGRlc2NyaXB0aW9uIEdldCBhbGxcblx0ICogQGF1dGhvciBMb25nLlBoYW1cblx0ICogQHNpbmNlIDEwLzA3LzIwMTlcblx0ICogQHBhcmFtIHt9IHJlcyBcblx0ICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcblx0ICovXG4gICAgIGdldERyb3BEb3duTGlzdChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBFcnJvclN0YXRlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBFcnJvclN0YXRlRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0RHJvcERvd25MaXN0KGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKFwiTOG7l2k6IFwiICsgZSk7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuZXhwb3J0IGRlZmF1bHQgRXJyb3JTdGF0ZUNvbnRyb2xsZXI7Il19