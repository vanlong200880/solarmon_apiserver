'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractManagerController = require('../core/AbstractManagerController');

var _AbstractManagerController2 = _interopRequireDefault(_AbstractManagerController);

var _ErrorLevelEntity = require('../entities/ErrorLevelEntity');

var _ErrorLevelEntity2 = _interopRequireDefault(_ErrorLevelEntity);

var _ErrorLevelService = require('../services/ErrorLevelService');

var _ErrorLevelService2 = _interopRequireDefault(_ErrorLevelService);

var _ErrorLevelValidate = require('../validator/ErrorLevelValidate');

var _ErrorLevelValidate2 = _interopRequireDefault(_ErrorLevelValidate);

var _sync = require('sync');

var _sync2 = _interopRequireDefault(_sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ErrorLevelController = function (_AbstractManagerContr) {
    _inherits(ErrorLevelController, _AbstractManagerContr);

    function ErrorLevelController() {
        _classCallCheck(this, ErrorLevelController);

        return _possibleConstructorReturn(this, (ErrorLevelController.__proto__ || Object.getPrototypeOf(ErrorLevelController)).apply(this, arguments));
    }

    _createClass(ErrorLevelController, [{
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
                var service = new _ErrorLevelService2.default();
                var entity = new _ErrorLevelEntity2.default();
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
                var service = new _ErrorLevelService2.default();
                var entity = new _ErrorLevelEntity2.default();
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
                var service = new _ErrorLevelService2.default();
                var entity = new _ErrorLevelEntity2.default();
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
                var service = new _ErrorLevelService2.default();
                var entity = Object.assign({}, new _ErrorLevelEntity2.default(), postData);
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
                var service = new _ErrorLevelService2.default();
                var entity = Object.assign({}, new _ErrorLevelEntity2.default(), postData);
                entity.status = !entity.status || entity.status == -1 ? 0 : 1;
                var validate = new _ErrorLevelValidate2.default();

                var errors = await validate.FLValidationAll(entity);
                if (errors != null) {
                    errors.validate = false;
                    res.send(Libs.returnJsonResult(false, "", errors, 0));
                    return;
                }

                if (!Libs.isBlank(postData.upload_thumbnail)) {
                    var base64String = postData.upload_thumbnail;
                    var base64MimeType = null;
                    if (!Libs.isBlank(base64String)) {
                        base64MimeType = Libs.base64MimeType(base64String);
                        if (!Libs.isBlank(base64MimeType)) {
                            var ext = base64MimeType.replace('image/', '');
                            if (Constants.data.allowImage.indexOf(ext) === -1) {
                                var _resData7 = self.createJsonImageErrorMessage();
                                res.send(_resData7);
                                return;
                            }
                        } else {
                            var _resData8 = self.createJsonImageErrorMessage();
                            res.send(_resData8);
                            return;
                        }
                        var imageFileName = await self.writeFileUpload(base64String, postData.upload_thumbnail_name, null, null, null);
                        if (!imageFileName) {
                            var _resData9 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                            res.send(_resData9);
                            return;
                        }

                        entity.thumbnail = imageFileName;
                    }
                }

                if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                    (0, _sync2.default)(function () {
                        service.insertErrorLevel(entity, function (err, rs) {
                            if (rs && err) {
                                var _resData10 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                                res.send(_resData10);
                            } else {
                                var _resData11 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                                res.send(_resData11);
                            }
                        });
                    });
                } else if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                    service.updateErrorLevel(entity, function (err, rs) {
                        if (rs) {
                            var _resData12 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                            res.send(_resData12);
                        } else {
                            var _resData13 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                            res.send(_resData13);
                        }
                    });
                }
            } catch (e) {
                var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
         * Lưu file gallery
         * @param {String} base64String 
         * @param {Object} entity 
         * @Return trả về file name bao gồm folder nếu lưu file thành công, ngược lại trả về false
         */

    }, {
        key: 'writeFileUpload',
        value: async function writeFileUpload(base64String, nameImg) {
            var thumbnail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
            var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
            var h = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

            if (Libs.isBlank(base64String)) return false;
            var base64MimeType = Libs.base64MimeType(base64String);
            if (Libs.isBlank(base64MimeType)) return true;
            try {
                var path = require('path');
                var ext = base64MimeType.replace('image/', '');
                var data = base64String.replace("data:" + base64MimeType + ";base64,", '');
                var buffer = Buffer.from(data, 'base64');

                var fileName = '';
                var curDate = new Date();
                var curName = nameImg.substr(0, nameImg.lastIndexOf('.'));
                if (Libs.isBlank(curName)) {
                    fileName = Date.parse(curDate) + '.' + ext;
                } else {
                    fileName = curName + '-' + Date.parse(curDate) + '.' + ext;
                }
                var now = new Date();
                var fileUrl = now.getFullYear() + "/" + (now.getMonth() + 1);
                var imageUpload = path.join(Constants.data.uploads_res, fileUrl);

                // Kiểm tra file đã tồn tại, có thì xóa
                if (Libs.checkFileExits(imageUpload, fileName)) {
                    Libs.removeFile(imageUpload, fileName);
                }

                // Trường hợp không tồn tại thư mục sẽ tạo thư mục đó
                if (!fs.existsSync(imageUpload)) {
                    fs.mkdirSync(imageUpload, { recursive: true });
                }

                // Thực hiện việc upload hình ảnh
                var upload = Libs.uploadFile(imageUpload, fileName, buffer);
                // Trường hợp upload ảnh bị lỗi
                if (!upload) {
                    this.logger.console.error(i18n.__('msg_err_file_upload'));
                    return false;
                }

                // Create thumbnail
                if (!Libs.isBlank(w) && !Libs.isBlank(h) && !Libs.isBlank(thumbnail)) {
                    var source = path.join(Constants.data.uploads_res, fileUrl, fileName);
                    var desPath = now.getFullYear() + "/" + (now.getMonth() + 1);
                    Libs.uploadResizeImage(source, path.join(Constants.data.uploads_res, thumbnail, desPath), fileName, 85, w, h);
                }

                return path.join(now.getFullYear() + "/" + (now.getMonth() + 1), fileName);
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }

        /**
        * @description Create json image error message
        * @author Long.Pham
        * @since 26/07/2018
        */

    }, {
        key: 'createJsonImageErrorMessage',
        value: function createJsonImageErrorMessage() {
            var message = i18n.__('type_image');
            var label = i18n.__('posts.image');
            var resData = Libs.returnJsonResult(false, message.replace("$<1>", label), {}, 0);
            return resData;
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
                var service = new _ErrorLevelService2.default();
                var entity = new _ErrorLevelEntity2.default();
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

    return ErrorLevelController;
}(_AbstractManagerController2.default);

exports.default = ErrorLevelController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0Vycm9yTGV2ZWxDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkVycm9yTGV2ZWxDb250cm9sbGVyIiwicmVzIiwicG9zdERhdGEiLCJzZXJ2aWNlIiwiRXJyb3JMZXZlbFNlcnZpY2UiLCJlbnRpdHkiLCJFcnJvckxldmVsRW50aXR5IiwiT2JqZWN0IiwiYXNzaWduIiwiZ2V0TGlzdCIsImVyciIsInJzIiwiZ2V0U2l6ZSIsImVycjEiLCJyczEiLCJyZXNEYXRhIiwiTGlicyIsInJldHVybkpzb25SZXN1bHQiLCJpMThuIiwiX18iLCJ0b3RhbFJvdyIsInNlbmQiLCJlIiwibG9nZ2VyIiwiZXJyb3IiLCJnZXREZXRhaWwiLCJpc0JsYW5rIiwiaWQiLCJkZWxldGUiLCJyc3VwZGF0ZSIsInN0YXR1cyIsInVwZGF0ZVN0YXR1cyIsInNlbGYiLCJ2YWxpZGF0ZSIsIkVycm9yTGV2ZWxWYWxpZGF0ZSIsImVycm9ycyIsIkZMVmFsaWRhdGlvbkFsbCIsInVwbG9hZF90aHVtYm5haWwiLCJiYXNlNjRTdHJpbmciLCJiYXNlNjRNaW1lVHlwZSIsImV4dCIsInJlcGxhY2UiLCJDb25zdGFudHMiLCJkYXRhIiwiYWxsb3dJbWFnZSIsImluZGV4T2YiLCJjcmVhdGVKc29uSW1hZ2VFcnJvck1lc3NhZ2UiLCJpbWFnZUZpbGVOYW1lIiwid3JpdGVGaWxlVXBsb2FkIiwidXBsb2FkX3RodW1ibmFpbF9uYW1lIiwidGh1bWJuYWlsIiwiaGFzT3duUHJvcGVydHkiLCJzY3JlZW5fbW9kZSIsImluc2VydCIsImluc2VydEVycm9yTGV2ZWwiLCJ1cGRhdGUiLCJ1cGRhdGVFcnJvckxldmVsIiwibmFtZUltZyIsInciLCJoIiwicGF0aCIsInJlcXVpcmUiLCJidWZmZXIiLCJCdWZmZXIiLCJmcm9tIiwiZmlsZU5hbWUiLCJjdXJEYXRlIiwiRGF0ZSIsImN1ck5hbWUiLCJzdWJzdHIiLCJsYXN0SW5kZXhPZiIsInBhcnNlIiwibm93IiwiZmlsZVVybCIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJpbWFnZVVwbG9hZCIsImpvaW4iLCJ1cGxvYWRzX3JlcyIsImNoZWNrRmlsZUV4aXRzIiwicmVtb3ZlRmlsZSIsImZzIiwiZXhpc3RzU3luYyIsIm1rZGlyU3luYyIsInJlY3Vyc2l2ZSIsInVwbG9hZCIsInVwbG9hZEZpbGUiLCJjb25zb2xlIiwic291cmNlIiwiZGVzUGF0aCIsInVwbG9hZFJlc2l6ZUltYWdlIiwibWVzc2FnZSIsImxhYmVsIiwiZ2V0RHJvcERvd25MaXN0IiwiQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTUEsb0I7Ozs7Ozs7Ozs7Ozs7QUFFRjs7Ozs7OztnQ0FPUUMsRyxFQUFLQyxRLEVBQVU7QUFDbkIsZ0JBQUk7QUFDQSxvQkFBSUMsVUFBVSxJQUFJQywyQkFBSixFQUFkO0FBQ0Esb0JBQUlDLFNBQVMsSUFBSUMsMEJBQUosRUFBYjtBQUNBRCx5QkFBU0UsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JILE1BQWxCLEVBQTBCSCxRQUExQixDQUFUO0FBQ0FDLHdCQUFRTSxPQUFSLENBQWdCSixNQUFoQixFQUF3QixVQUFVSyxHQUFWLEVBQWVDLEVBQWYsRUFBbUI7QUFDdkMsd0JBQUksQ0FBQ0QsR0FBTCxFQUFVO0FBQ05QLGdDQUFRUyxPQUFSLENBQWdCUCxNQUFoQixFQUF3QixVQUFVUSxJQUFWLEVBQWdCQyxHQUFoQixFQUFxQjtBQUN6QyxnQ0FBSSxDQUFDRCxJQUFMLEVBQVc7QUFDUEUsMENBQVVDLEtBQUtDLGdCQUFMLENBQXNCLElBQXRCLEVBQTRCQyxLQUFLQyxFQUFMLENBQVEsZ0JBQVIsQ0FBNUIsRUFBdURSLEVBQXZELEVBQTJERyxJQUFJTSxRQUEvRCxDQUFWO0FBQ0gsNkJBRkQsTUFFTztBQUNITCwwQ0FBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtB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QkFBSW9CLElBQUosQ0FBU04sT0FBVDtBQUNIO0FBQ0o7Ozs7RUE1VThCK0UsbUM7O2tCQStVcEI5RixvQiIsImZpbGUiOiJFcnJvckxldmVsQ29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlcic7XG5pbXBvcnQgRXJyb3JMZXZlbEVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9FcnJvckxldmVsRW50aXR5JztcbmltcG9ydCBFcnJvckxldmVsU2VydmljZSBmcm9tICcuLi9zZXJ2aWNlcy9FcnJvckxldmVsU2VydmljZSc7XG5pbXBvcnQgRXJyb3JMZXZlbFZhbGlkYXRlIGZyb20gJy4uL3ZhbGlkYXRvci9FcnJvckxldmVsVmFsaWRhdGUnO1xuaW1wb3J0IFN5bmMgZnJvbSAnc3luYyc7XG5cbmNsYXNzIEVycm9yTGV2ZWxDb250cm9sbGVyIGV4dGVuZHMgQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciB7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDEwLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0ge30gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0TGlzdChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBFcnJvckxldmVsU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBFcnJvckxldmVsRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0TGlzdChlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRTaXplKGVudGl0eSwgZnVuY3Rpb24gKGVycjEsIHJzMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlcnIxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCByczEudG90YWxSb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKFwiTOG7l2k6IFwiICsgZSk7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IGRldGFpbCBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0RGV0YWlsKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gbmV3IEVycm9yTGV2ZWxTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IEVycm9yTGV2ZWxFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXREZXRhaWwoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRGVsZXRlIGl0ZW1cbiAgICAgKiBAYXV0aG9yIHRoYW5oLmJheVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE4XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBkZWxldGVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgRXJyb3JMZXZlbFNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgRXJyb3JMZXZlbEVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGVudGl0eS5pZCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIk5PVF9FWElTVFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlcnZpY2UuZGVsZXRlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnN1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcnN1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLkRFTEVURV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLkRFTEVURV9TVUNDRVNTJyksIGVudGl0eSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlcnJvciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBhY3Rpb25cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICB1cGRhdGVTdGF0dXMocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgRXJyb3JMZXZlbFNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgRXJyb3JMZXZlbEVudGl0eSgpLCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBlbnRpdHkuc3RhdHVzID0gKCFlbnRpdHkuc3RhdHVzIHx8IGVudGl0eS5zdGF0dXMgPT0gLTEpID8gMCA6IDE7XG5cbiAgICAgICAgICAgIGlmIChMaWJzLmlzQmxhbmsoZW50aXR5LmlkKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiTk9UX0VYSVNUXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBTeW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLnVwZGF0ZVN0YXR1cyhlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5VUERBVEVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5VUERBVEVfU1VDQ0VTUycpLCBlbnRpdHksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZXJyb3IgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBhY3Rpb25cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBhc3luYyBzYXZlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IEVycm9yTGV2ZWxTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IEVycm9yTGV2ZWxFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgZW50aXR5LnN0YXR1cyA9ICghZW50aXR5LnN0YXR1cyB8fCBlbnRpdHkuc3RhdHVzID09IC0xKSA/IDAgOiAxO1xuICAgICAgICAgICAgbGV0IHZhbGlkYXRlID0gbmV3IEVycm9yTGV2ZWxWYWxpZGF0ZSgpO1xuXG4gICAgICAgICAgICBsZXQgZXJyb3JzID0gYXdhaXQgdmFsaWRhdGUuRkxWYWxpZGF0aW9uQWxsKGVudGl0eSk7XG4gICAgICAgICAgICBpZiAoZXJyb3JzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBlcnJvcnMudmFsaWRhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIFwiXCIsIGVycm9ycywgMCkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsocG9zdERhdGEudXBsb2FkX3RodW1ibmFpbCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgYmFzZTY0U3RyaW5nID0gcG9zdERhdGEudXBsb2FkX3RodW1ibmFpbDtcbiAgICAgICAgICAgICAgICBsZXQgYmFzZTY0TWltZVR5cGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKGJhc2U2NFN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZTY0TWltZVR5cGUgPSBMaWJzLmJhc2U2NE1pbWVUeXBlKGJhc2U2NFN0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKGJhc2U2NE1pbWVUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV4dCA9IGJhc2U2NE1pbWVUeXBlLnJlcGxhY2UoJ2ltYWdlLycsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDb25zdGFudHMuZGF0YS5hbGxvd0ltYWdlLmluZGV4T2YoZXh0KSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IHNlbGYuY3JlYXRlSnNvbkltYWdlRXJyb3JNZXNzYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBzZWxmLmNyZWF0ZUpzb25JbWFnZUVycm9yTWVzc2FnZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlRmlsZU5hbWUgPSBhd2FpdCBzZWxmLndyaXRlRmlsZVVwbG9hZChiYXNlNjRTdHJpbmcsIHBvc3REYXRhLnVwbG9hZF90aHVtYm5haWxfbmFtZSwgbnVsbCwgbnVsbCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaW1hZ2VGaWxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5TQVZFX0ZBSUwnKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBlbnRpdHkudGh1bWJuYWlsID0gaW1hZ2VGaWxlTmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlbnRpdHkuaGFzT3duUHJvcGVydHkoJ3NjcmVlbl9tb2RlJykgJiYgZW50aXR5LnNjcmVlbl9tb2RlID09IENvbnN0YW50cy5zY3JlZW5fbW9kZS5pbnNlcnQpIHtcbiAgICAgICAgICAgICAgICBTeW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZS5pbnNlcnRFcnJvckxldmVsKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChycyAmJiBlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9TVUNDRVNTJyksIGVudGl0eSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbnRpdHkuaGFzT3duUHJvcGVydHkoJ3NjcmVlbl9tb2RlJykgJiYgZW50aXR5LnNjcmVlbl9tb2RlID09IENvbnN0YW50cy5zY3JlZW5fbW9kZS51cGRhdGUpIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLnVwZGF0ZUVycm9yTGV2ZWwoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5TQVZFX1NVQ0NFU1MnKSwgZW50aXR5LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5TQVZFX0ZBSUwnKSwgeyBcImVycm9yXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBMxrB1IGZpbGUgZ2FsbGVyeVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBiYXNlNjRTdHJpbmcgXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVudGl0eSBcbiAgICAgKiBAUmV0dXJuIHRy4bqjIHbhu4EgZmlsZSBuYW1lIGJhbyBn4buTbSBmb2xkZXIgbuG6v3UgbMawdSBmaWxlIHRow6BuaCBjw7RuZywgbmfGsOG7o2MgbOG6oWkgdHLhuqMgduG7gSBmYWxzZVxuICAgICAqL1xuICAgIGFzeW5jIHdyaXRlRmlsZVVwbG9hZChiYXNlNjRTdHJpbmcsIG5hbWVJbWcsIHRodW1ibmFpbCA9IG51bGwsIHcgPSBudWxsLCBoID0gbnVsbCkge1xuICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGJhc2U2NFN0cmluZykpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIGJhc2U2NE1pbWVUeXBlID0gTGlicy5iYXNlNjRNaW1lVHlwZShiYXNlNjRTdHJpbmcpO1xuICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGJhc2U2NE1pbWVUeXBlKSkgcmV0dXJuIHRydWU7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgICAgICAgICAgIHZhciBleHQgPSBiYXNlNjRNaW1lVHlwZS5yZXBsYWNlKCdpbWFnZS8nLCAnJyk7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IGJhc2U2NFN0cmluZy5yZXBsYWNlKFwiZGF0YTpcIiArIGJhc2U2NE1pbWVUeXBlICsgXCI7YmFzZTY0LFwiLCAnJyk7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gQnVmZmVyLmZyb20oZGF0YSwgJ2Jhc2U2NCcpO1xuXG4gICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSAnJztcbiAgICAgICAgICAgIGxldCBjdXJEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBjdXJOYW1lID0gbmFtZUltZy5zdWJzdHIoMCwgbmFtZUltZy5sYXN0SW5kZXhPZignLicpKTtcbiAgICAgICAgICAgIGlmIChMaWJzLmlzQmxhbmsoY3VyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IERhdGUucGFyc2UoY3VyRGF0ZSkgKyAnLicgKyBleHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gY3VyTmFtZSArICctJyArIERhdGUucGFyc2UoY3VyRGF0ZSkgKyAnLicgKyBleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBmaWxlVXJsID0gIG5vdy5nZXRGdWxsWWVhcigpICsgXCIvXCIgKyAobm93LmdldE1vbnRoKCkgKyAxKTtcbiAgICAgICAgICAgIHZhciBpbWFnZVVwbG9hZCA9IHBhdGguam9pbihDb25zdGFudHMuZGF0YS51cGxvYWRzX3JlcywgZmlsZVVybCk7XG5cbiAgICAgICAgICAgIC8vIEtp4buDbSB0cmEgZmlsZSDEkcOjIHThu5NuIHThuqFpLCBjw7MgdGjDrCB4w7NhXG4gICAgICAgICAgICBpZiAoTGlicy5jaGVja0ZpbGVFeGl0cyhpbWFnZVVwbG9hZCwgZmlsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgTGlicy5yZW1vdmVGaWxlKGltYWdlVXBsb2FkLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRyxrDhu51uZyBo4bujcCBraMO0bmcgdOG7k24gdOG6oWkgdGjGsCBt4bulYyBz4bq9IHThuqFvIHRoxrAgbeG7pWMgxJHDs1xuICAgICAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGltYWdlVXBsb2FkKSkge1xuICAgICAgICAgICAgICAgIGZzLm1rZGlyU3luYyhpbWFnZVVwbG9hZCwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRo4buxYyBoaeG7h24gdmnhu4djIHVwbG9hZCBow6xuaCDhuqNuaFxuICAgICAgICAgICAgbGV0IHVwbG9hZCA9IExpYnMudXBsb2FkRmlsZShpbWFnZVVwbG9hZCwgZmlsZU5hbWUsIGJ1ZmZlcik7XG4gICAgICAgICAgICAvLyBUcsaw4budbmcgaOG7o3AgdXBsb2FkIOG6o25oIGLhu4sgbOG7l2lcbiAgICAgICAgICAgIGlmICghdXBsb2FkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuY29uc29sZS5lcnJvcihpMThuLl9fKCdtc2dfZXJyX2ZpbGVfdXBsb2FkJykpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRodW1ibmFpbFxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsodykgJiYgIUxpYnMuaXNCbGFuayhoKSAmJiAhTGlicy5pc0JsYW5rKHRodW1ibmFpbCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gcGF0aC5qb2luKENvbnN0YW50cy5kYXRhLnVwbG9hZHNfcmVzLCBmaWxlVXJsLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgdmFyIGRlc1BhdGggPSBub3cuZ2V0RnVsbFllYXIoKSArIFwiL1wiICsgKG5vdy5nZXRNb250aCgpICsgMSk7XG4gICAgICAgICAgICAgICAgTGlicy51cGxvYWRSZXNpemVJbWFnZShzb3VyY2UsIHBhdGguam9pbihDb25zdGFudHMuZGF0YS51cGxvYWRzX3JlcywgdGh1bWJuYWlsLCBkZXNQYXRoKSwgZmlsZU5hbWUsIDg1LCB3LCBoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHBhdGguam9pbihub3cuZ2V0RnVsbFllYXIoKSArIFwiL1wiICsgKG5vdy5nZXRNb250aCgpICsgMSksIGZpbGVOYW1lKTtcblxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZSBqc29uIGltYWdlIGVycm9yIG1lc3NhZ2VcbiAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgKiBAc2luY2UgMjYvMDcvMjAxOFxuICAgICovXG4gICAgY3JlYXRlSnNvbkltYWdlRXJyb3JNZXNzYWdlKCkge1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGkxOG4uX18oJ3R5cGVfaW1hZ2UnKTtcbiAgICAgICAgbGV0IGxhYmVsID0gaTE4bi5fXygncG9zdHMuaW1hZ2UnKTtcbiAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIG1lc3NhZ2UucmVwbGFjZShcIiQ8MT5cIiwgbGFiZWwpLCB7fSwgMCk7XG4gICAgICAgIHJldHVybiByZXNEYXRhO1xuICAgIH1cblxuICAgIC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGFsbFxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxuXHQgKiBAc2luY2UgMTAvMDcvMjAxOVxuXHQgKiBAcGFyYW0ge30gcmVzIFxuXHQgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuXHQgKi9cbiAgICAgZ2V0RHJvcERvd25MaXN0KHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IEVycm9yTGV2ZWxTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IEVycm9yTGV2ZWxFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXREcm9wRG93bkxpc3QoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5leHBvcnQgZGVmYXVsdCBFcnJvckxldmVsQ29udHJvbGxlcjsiXX0=