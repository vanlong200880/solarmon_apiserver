'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractManagerController = require('../core/AbstractManagerController');

var _AbstractManagerController2 = _interopRequireDefault(_AbstractManagerController);

var _DeviceEntity = require('../entities/DeviceEntity');

var _DeviceEntity2 = _interopRequireDefault(_DeviceEntity);

var _AIService = require('../services/AIService');

var _AIService2 = _interopRequireDefault(_AIService);

var _Constants = require('../utils/Constants');

var _Constants2 = _interopRequireDefault(_Constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AIController = function (_AbstractManagerContr) {
    _inherits(AIController, _AbstractManagerContr);

    function AIController() {
        _classCallCheck(this, AIController);

        return _possibleConstructorReturn(this, (AIController.__proto__ || Object.getPrototypeOf(AIController)).apply(this, arguments));
    }

    _createClass(AIController, [{
        key: 'getListDevice',


        /**
         * @description Get List DEVICE
         * @author Long.Pham
         * @since 10/07/2019
         * @param {} res 
         * @param {*} postData 
         */
        value: function getListDevice(res, postData) {
            try {
                var service = new _AIService2.default();
                var entity = new _DeviceEntity2.default();
                entity = Object.assign({}, entity, postData);
                if (Libs.isBlank(entity.appId) || entity.appId != _Constants2.default.AI.appId || Libs.isBlank(entity.secretKey) || entity.secretKey != _Constants2.default.AI.secretKey) {
                    var resData = {};
                    resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), {}, 0);
                    res.send(resData);
                    return;
                }

                service.getListDevice(entity, function (err, rs) {
                    if (!err) {
                        service.getListDeviceSize(entity, function (err1, rs1) {
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
        * @description Get List data by device
        * @author Long.Pham
        * @since 10/07/2019
        * @param {} res 
        * @param {*} postData 
        */

    }, {
        key: 'getDataDeviceToday',
        value: function getDataDeviceToday(res, postData) {
            try {
                var service = new _AIService2.default();
                var entity = new _DeviceEntity2.default();
                entity = Object.assign({}, entity, postData);
                if (Libs.isBlank(entity.appId) || entity.appId != _Constants2.default.AI.appId || Libs.isBlank(entity.secretKey) || entity.secretKey != _Constants2.default.AI.secretKey) {
                    var resData = {};
                    resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), {}, 0);
                    res.send(resData);
                    return;
                }
                service.getDataDeviceToday(entity, function (err, rs) {
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
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
         * @since 10/07/2019
         * @param {} res 
         * @param {*} postData 
         */

    }, {
        key: 'getList',
        value: function getList(res, postData) {}
        // try {
        //     let service = new AIService();
        //     let entity = new AIEntity();
        //     entity = Object.assign({}, entity, postData);


        //     service.getList(entity, function (err, rs) {
        //         if (!err) {
        //             service.getSize(entity, function (err1, rs1) {
        //                 if (!err1) {
        //                     resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, rs1.totalRow);
        //                 } else {
        //                     resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
        //                 }
        //                 res.send(resData);
        //             });
        //         } else {
        //             resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
        //             res.send(resData);
        //         }
        //     });
        // } catch (e) {
        //     this.logger.error("Lỗi: " + e);
        //     var resData = {};
        //     resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
        //     res.send(resData);
        // }

        /**
         * @description Get detail item
         * @author Long.Pham
         * @since 11/07/2019
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'getDetail',
        value: function getDetail(res, postData) {}
        // try {
        //     var service = new AIService();
        //     let entity = new AIEntity();
        //     entity = Object.assign({}, entity, postData);
        //     service.getDetail(entity, function (err, rs) {
        //         var resData = {};
        //         if (!err) {
        //             resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
        //         } else {
        //             resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
        //         }
        //         res.send(resData);
        //     });
        // } catch (e) {
        //     var resData = {};
        //     resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
        //     res.send(resData);
        // }


        /**
         * @description Delete item
         * @author thanh.bay
         * @since 11/07/2018
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'deleteAction',
        value: function deleteAction(res, postData) {}
        // try {
        //     let service = new AIService();
        //     let entity = new AIEntity();
        //     entity = Object.assign({}, entity, postData);
        //     if (Libs.isBlank(entity.id)) {
        //         var resData = {};
        //         resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
        //         res.send(resData);
        //         return;
        //     }
        //     Sync(function () {
        //         service.delete(entity, function (err, rsupdate) {
        //             try {
        //                 if (!rsupdate) {
        //                     let resData = Libs.returnJsonResult(false, i18n.__('ACTION.DELETE_FAIL'), { "error": err }, 0);
        //                     res.send(resData);
        //                     return;
        //                 }
        //                 let resData = Libs.returnJsonResult(true, i18n.__('ACTION.DELETE_SUCCESS'), entity, 0);
        //                 res.send(resData);
        //             } catch (error) {
        //                 let resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
        //                 res.send(resData);
        //             }
        //         });
        //     });
        // } catch (e) {
        //     var resData = {};
        //     resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
        //     res.send(resData);
        // }


        /**
         * @description Save action
         * @author Long.Pham
         * @since 11/07/2019
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'updateStatus',
        value: function updateStatus(res, postData) {}
        // try {
        //     let service = new AIService();
        //     let entity = Object.assign({}, new AIEntity(), postData);
        //     entity.status = (!entity.status || entity.status == -1) ? 0 : 1;

        //     if (Libs.isBlank(entity.id)) {
        //         var resData = {};
        //         resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
        //         res.send(resData);
        //         return;
        //     }

        //     Sync(function () {
        //         service.updateStatus(entity, function (err, rsupdate) {
        //             try {
        //                 if (!rsupdate) {
        //                     let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
        //                     res.send(resData);
        //                     return;
        //                 }
        //                 let resData = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
        //                 res.send(resData);
        //             } catch (error) {
        //                 let resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
        //                 res.send(resData);
        //             }
        //         });
        //     });

        // } catch (e) {
        //     var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
        //     res.send(resData);
        // }


        /**
         * @description Save action
         * @author Long.Pham
         * @since 11/07/2019
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'saveAction',
        value: async function saveAction(res, postData) {}
        // try {
        //     let self = this;
        //     let service = new AIService();
        //     let entity = Object.assign({}, new AIEntity(), postData);
        //     entity.status = (!entity.status || entity.status == -1) ? 0 : 1;
        //     let validate = new AIValidate();

        //     let errors = await validate.FLValidationAll(entity);
        //     if (errors != null) {
        //         errors.validate = false;
        //         res.send(Libs.returnJsonResult(false, "", errors, 0));
        //         return;
        //     }


        //     if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
        //         Sync(function () {
        //             service.insertAI(entity, function (err, rs) {
        //                 if (rs && err) {
        //                     let resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
        //                     res.send(resData);
        //                 } else {
        //                     let resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
        //                     res.send(resData);
        //                 }
        //             });
        //         });
        //     } else if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
        //         service.updateAI(entity, function (err, rs) {
        //             if (rs) {
        //                 let resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
        //                 res.send(resData);
        //             } else {
        //                 let resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
        //                 res.send(resData);
        //             }
        //         });
        //     }
        // } catch (e) {
        //     var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
        //     res.send(resData);
        // }


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
            // try {
            //     let service = new AIService();
            //     let entity = new AIEntity();
            //     entity = Object.assign({}, entity, postData);
            //     service.getDropDownList(entity, function (err, rs) {
            //         if (!err) {
            //             resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
            //             res.send(resData);
            //         } else {
            //             resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
            //             res.send(resData);
            //         }
            //     });
            // } catch (e) {
            //     this.logger.error("Lỗi: " + e);
            //     var resData = {};
            //     resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            //     res.send(resData);
            // }
        }
    }]);

    return AIController;
}(_AbstractManagerController2.default);

exports.default = AIController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0FJQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJBSUNvbnRyb2xsZXIiLCJyZXMiLCJwb3N0RGF0YSIsInNlcnZpY2UiLCJBSVNlcnZpY2UiLCJlbnRpdHkiLCJEZXZpY2VFbnRpdHkiLCJPYmplY3QiLCJhc3NpZ24iLCJMaWJzIiwiaXNCbGFuayIsImFwcElkIiwiQ29uc3RhbnRzIiwiQUkiLCJzZWNyZXRLZXkiLCJyZXNEYXRhIiwicmV0dXJuSnNvblJlc3VsdCIsImkxOG4iLCJfXyIsInNlbmQiLCJnZXRMaXN0RGV2aWNlIiwiZXJyIiwicnMiLCJnZXRMaXN0RGV2aWNlU2l6ZSIsImVycjEiLCJyczEiLCJ0b3RhbFJvdyIsImUiLCJsb2dnZXIiLCJlcnJvciIsImdldERhdGFEZXZpY2VUb2RheSIsIkFic3RyYWN0TWFuYWdlckNvbnRyb2xsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSxZOzs7Ozs7Ozs7Ozs7O0FBRUY7Ozs7Ozs7c0NBT2VDLEcsRUFBS0MsUSxFQUFVO0FBQzFCLGdCQUFJO0FBQ0Esb0JBQUlDLFVBQVUsSUFBSUMsbUJBQUosRUFBZDtBQUNBLG9CQUFJQyxTQUFTLElBQUlDLHNCQUFKLEVBQWI7QUFDQUQseUJBQVNFLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxNQUFsQixFQUEwQkgsUUFBMUIsQ0FBVDtBQUNBLG9CQUFHTyxLQUFLQyxPQUFMLENBQWFMLE9BQU9NLEtBQXBCLEtBQThCTixPQUFPTSxLQUFQLElBQWdCQyxvQkFBVUMsRUFBVixDQUFhRixLQUEzRCxJQUFvRUYsS0FBS0MsT0FBTCxDQUFhTCxPQUFPUyxTQUFwQixDQUFwRSxJQUFzR1QsT0FBT1MsU0FBUCxJQUFvQkYsb0JBQVVDLEVBQVYsQ0FBYUMsU0FBMUksRUFBb0o7QUFDaEosd0JBQUlDLFVBQVUsRUFBZDtBQUNBQSw4QkFBVU4sS0FBS08s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Q0FPYUQsRyxFQUFLQyxRLEVBQVUsQ0FrQzNCO0FBakNHO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0o7Ozs7Ozs7Ozs7eUNBT2lCRCxHLEVBQUtDLFEsRUFBVSxDQTJDL0I7QUExQ0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHSjs7Ozs7Ozs7Ozt3Q0FPaUJELEcsRUFBS0MsUSxFQUFVO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7Ozs7RUF6VHNCNkIsbUM7O2tCQTRUWi9CLFkiLCJmaWxlIjoiQUlDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0TWFuYWdlckNvbnRyb2xsZXIgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyJztcbmltcG9ydCBEZXZpY2VFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvRGV2aWNlRW50aXR5JztcbmltcG9ydCBBSVNlcnZpY2UgZnJvbSAnLi4vc2VydmljZXMvQUlTZXJ2aWNlJztcbmltcG9ydCBDb25zdGFudHMgZnJvbSAnLi4vdXRpbHMvQ29uc3RhbnRzJztcblxuY2xhc3MgQUlDb250cm9sbGVyIGV4dGVuZHMgQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciB7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgREVWSUNFXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTAvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7fSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICAgZ2V0TGlzdERldmljZShyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBBSVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgRGV2aWNlRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIGlmKExpYnMuaXNCbGFuayhlbnRpdHkuYXBwSWQpIHx8IGVudGl0eS5hcHBJZCAhPSBDb25zdGFudHMuQUkuYXBwSWQgfHwgTGlicy5pc0JsYW5rKGVudGl0eS5zZWNyZXRLZXkpIHx8IGVudGl0eS5zZWNyZXRLZXkgIT0gQ29uc3RhbnRzLkFJLnNlY3JldEtleSl7XG4gICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgfSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZXJ2aWNlLmdldExpc3REZXZpY2UoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0TGlzdERldmljZVNpemUoZW50aXR5LCBmdW5jdGlvbiAoZXJyMSwgcnMxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVycjEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIHJzMS50b3RhbFJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIFxuICAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgZGF0YSBieSBkZXZpY2VcbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMC8wNy8yMDE5XG4gICAgICogQHBhcmFtIHt9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgICAgZ2V0RGF0YURldmljZVRvZGF5KHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IEFJU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBEZXZpY2VFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgaWYoTGlicy5pc0JsYW5rKGVudGl0eS5hcHBJZCkgfHwgZW50aXR5LmFwcElkICE9IENvbnN0YW50cy5BSS5hcHBJZCB8fCBMaWJzLmlzQmxhbmsoZW50aXR5LnNlY3JldEtleSkgfHwgZW50aXR5LnNlY3JldEtleSAhPSBDb25zdGFudHMuQUkuc2VjcmV0S2V5KXtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyB9LCAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXJ2aWNlLmdldERhdGFEZXZpY2VUb2RheShlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDEwLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0ge30gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0TGlzdChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIC8vIHRyeSB7XG4gICAgICAgIC8vICAgICBsZXQgc2VydmljZSA9IG5ldyBBSVNlcnZpY2UoKTtcbiAgICAgICAgLy8gICAgIGxldCBlbnRpdHkgPSBuZXcgQUlFbnRpdHkoKTtcbiAgICAgICAgLy8gICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgc2VydmljZS5nZXRMaXN0KGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgLy8gICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAvLyAgICAgICAgICAgICBzZXJ2aWNlLmdldFNpemUoZW50aXR5LCBmdW5jdGlvbiAoZXJyMSwgcnMxKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBpZiAoIWVycjEpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIHJzMS50b3RhbFJvdyk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIC8vICAgICAgICAgICAgIH0pO1xuICAgICAgICAvLyAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAvLyAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgLy8gICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgIC8vICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgLy8gICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAvLyB9XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgZGV0YWlsIGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBnZXREZXRhaWwocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICAvLyB0cnkge1xuICAgICAgICAvLyAgICAgdmFyIHNlcnZpY2UgPSBuZXcgQUlTZXJ2aWNlKCk7XG4gICAgICAgIC8vICAgICBsZXQgZW50aXR5ID0gbmV3IEFJRW50aXR5KCk7XG4gICAgICAgIC8vICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgLy8gICAgIHNlcnZpY2UuZ2V0RGV0YWlsKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgLy8gICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAvLyAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG4gICAgICAgIC8vICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgIC8vIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgIC8vICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgLy8gICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAvLyB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIERlbGV0ZSBpdGVtXG4gICAgICogQGF1dGhvciB0aGFuaC5iYXlcbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOFxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZGVsZXRlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgLy8gdHJ5IHtcbiAgICAgICAgLy8gICAgIGxldCBzZXJ2aWNlID0gbmV3IEFJU2VydmljZSgpO1xuICAgICAgICAvLyAgICAgbGV0IGVudGl0eSA9IG5ldyBBSUVudGl0eSgpO1xuICAgICAgICAvLyAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgIC8vICAgICBpZiAoTGlicy5pc0JsYW5rKGVudGl0eS5pZCkpIHtcbiAgICAgICAgLy8gICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAvLyAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIk5PVF9FWElTVFwiKSwge30sIDApO1xuICAgICAgICAvLyAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAvLyAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gICAgIFN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyAgICAgICAgIHNlcnZpY2UuZGVsZXRlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnN1cGRhdGUpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGlmICghcnN1cGRhdGUpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLkRFTEVURV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLkRFTEVURV9TVUNDRVNTJyksIGVudGl0eSwgMCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlcnJvciB9LCAwKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAvLyAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgfSk7XG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgLy8gICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAvLyAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIC8vIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBhY3Rpb25cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICB1cGRhdGVTdGF0dXMocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICAvLyB0cnkge1xuICAgICAgICAvLyAgICAgbGV0IHNlcnZpY2UgPSBuZXcgQUlTZXJ2aWNlKCk7XG4gICAgICAgIC8vICAgICBsZXQgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IEFJRW50aXR5KCksIHBvc3REYXRhKTtcbiAgICAgICAgLy8gICAgIGVudGl0eS5zdGF0dXMgPSAoIWVudGl0eS5zdGF0dXMgfHwgZW50aXR5LnN0YXR1cyA9PSAtMSkgPyAwIDogMTtcblxuICAgICAgICAvLyAgICAgaWYgKExpYnMuaXNCbGFuayhlbnRpdHkuaWQpKSB7XG4gICAgICAgIC8vICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgLy8gICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJOT1RfRVhJU1RcIiksIHt9LCAwKTtcbiAgICAgICAgLy8gICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgLy8gICAgICAgICByZXR1cm47XG4gICAgICAgIC8vICAgICB9XG5cbiAgICAgICAgLy8gICAgIFN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyAgICAgICAgIHNlcnZpY2UudXBkYXRlU3RhdHVzKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnN1cGRhdGUpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGlmICghcnN1cGRhdGUpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9TVUNDRVNTJyksIGVudGl0eSwgMCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlcnJvciB9LCAwKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAvLyAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgfSk7XG4gICAgICAgIC8vICAgICB9KTtcblxuICAgICAgICAvLyB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgIC8vICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgLy8gfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGFjdGlvblxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDExLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGFzeW5jIHNhdmVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICAvLyB0cnkge1xuICAgICAgICAvLyAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyAgICAgbGV0IHNlcnZpY2UgPSBuZXcgQUlTZXJ2aWNlKCk7XG4gICAgICAgIC8vICAgICBsZXQgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IEFJRW50aXR5KCksIHBvc3REYXRhKTtcbiAgICAgICAgLy8gICAgIGVudGl0eS5zdGF0dXMgPSAoIWVudGl0eS5zdGF0dXMgfHwgZW50aXR5LnN0YXR1cyA9PSAtMSkgPyAwIDogMTtcbiAgICAgICAgLy8gICAgIGxldCB2YWxpZGF0ZSA9IG5ldyBBSVZhbGlkYXRlKCk7XG5cbiAgICAgICAgLy8gICAgIGxldCBlcnJvcnMgPSBhd2FpdCB2YWxpZGF0ZS5GTFZhbGlkYXRpb25BbGwoZW50aXR5KTtcbiAgICAgICAgLy8gICAgIGlmIChlcnJvcnMgIT0gbnVsbCkge1xuICAgICAgICAvLyAgICAgICAgIGVycm9ycy52YWxpZGF0ZSA9IGZhbHNlO1xuICAgICAgICAvLyAgICAgICAgIHJlcy5zZW5kKExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgXCJcIiwgZXJyb3JzLCAwKSk7XG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyAgICAgfVxuXG5cbiAgICAgICAgLy8gICAgIGlmIChlbnRpdHkuaGFzT3duUHJvcGVydHkoJ3NjcmVlbl9tb2RlJykgJiYgZW50aXR5LnNjcmVlbl9tb2RlID09IENvbnN0YW50cy5zY3JlZW5fbW9kZS5pbnNlcnQpIHtcbiAgICAgICAgLy8gICAgICAgICBTeW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgc2VydmljZS5pbnNlcnRBSShlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBpZiAocnMgJiYgZXJyKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfU1VDQ0VTUycpLCBlbnRpdHksIDApO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICB9KTtcbiAgICAgICAgLy8gICAgICAgICB9KTtcbiAgICAgICAgLy8gICAgIH0gZWxzZSBpZiAoZW50aXR5Lmhhc093blByb3BlcnR5KCdzY3JlZW5fbW9kZScpICYmIGVudGl0eS5zY3JlZW5fbW9kZSA9PSBDb25zdGFudHMuc2NyZWVuX21vZGUudXBkYXRlKSB7XG4gICAgICAgIC8vICAgICAgICAgc2VydmljZS51cGRhdGVBSShlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIGlmIChycykge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfU1VDQ0VTUycpLCBlbnRpdHksIDApO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIC8vICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIC8vICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICB9KTtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAvLyAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIC8vIH1cbiAgICB9XG5cbiAgICAvKipcblx0ICogQGRlc2NyaXB0aW9uIEdldCBhbGxcblx0ICogQGF1dGhvciBMb25nLlBoYW1cblx0ICogQHNpbmNlIDEwLzA3LzIwMTlcblx0ICogQHBhcmFtIHt9IHJlcyBcblx0ICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcblx0ICovXG4gICAgIGdldERyb3BEb3duTGlzdChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIC8vIHRyeSB7XG4gICAgICAgIC8vICAgICBsZXQgc2VydmljZSA9IG5ldyBBSVNlcnZpY2UoKTtcbiAgICAgICAgLy8gICAgIGxldCBlbnRpdHkgPSBuZXcgQUlFbnRpdHkoKTtcbiAgICAgICAgLy8gICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAvLyAgICAgc2VydmljZS5nZXREcm9wRG93bkxpc3QoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAvLyAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG4gICAgICAgIC8vICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAvLyAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAvLyAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgLy8gICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgIC8vICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgLy8gICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAvLyB9XG4gICAgfVxuXG59XG5leHBvcnQgZGVmYXVsdCBBSUNvbnRyb2xsZXI7Il19