'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractManagerController = require('../core/AbstractManagerController');

var _AbstractManagerController2 = _interopRequireDefault(_AbstractManagerController);

var _ErrorTypeEntity = require('../entities/ErrorTypeEntity');

var _ErrorTypeEntity2 = _interopRequireDefault(_ErrorTypeEntity);

var _ErrorTypeService = require('../services/ErrorTypeService');

var _ErrorTypeService2 = _interopRequireDefault(_ErrorTypeService);

var _ErrorTypeValidate = require('../validator/ErrorTypeValidate');

var _ErrorTypeValidate2 = _interopRequireDefault(_ErrorTypeValidate);

var _sync = require('sync');

var _sync2 = _interopRequireDefault(_sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ErrorTypeController = function (_AbstractManagerContr) {
    _inherits(ErrorTypeController, _AbstractManagerContr);

    function ErrorTypeController() {
        _classCallCheck(this, ErrorTypeController);

        return _possibleConstructorReturn(this, (ErrorTypeController.__proto__ || Object.getPrototypeOf(ErrorTypeController)).apply(this, arguments));
    }

    _createClass(ErrorTypeController, [{
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
                var service = new _ErrorTypeService2.default();
                var entity = new _ErrorTypeEntity2.default();
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
                var service = new _ErrorTypeService2.default();
                var entity = new _ErrorTypeEntity2.default();
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
                var service = new _ErrorTypeService2.default();
                var entity = new _ErrorTypeEntity2.default();
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
                var service = new _ErrorTypeService2.default();
                var entity = Object.assign({}, new _ErrorTypeEntity2.default(), postData);
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
                var service = new _ErrorTypeService2.default();
                var entity = Object.assign({}, new _ErrorTypeEntity2.default(), postData);
                entity.status = !entity.status || entity.status == -1 ? 0 : 1;
                var validate = new _ErrorTypeValidate2.default();

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
                        service.insertErrorType(entity, function (err, rs) {
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
                    service.updateErrorType(entity, function (err, rs) {
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
                var service = new _ErrorTypeService2.default();
                var entity = new _ErrorTypeEntity2.default();
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

    return ErrorTypeController;
}(_AbstractManagerController2.default);

exports.default = ErrorTypeController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0Vycm9yVHlwZUNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiRXJyb3JUeXBlQ29udHJvbGxlciIsInJlcyIsInBvc3REYXRhIiwic2VydmljZSIsIkVycm9yVHlwZVNlcnZpY2UiLCJlbnRpdHkiLCJFcnJvclR5cGVFbnRpdHkiLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRMaXN0IiwiZXJyIiwicnMiLCJnZXRTaXplIiwiZXJyMSIsInJzMSIsInJlc0RhdGEiLCJMaWJzIiwicmV0dXJuSnNvblJlc3VsdCIsImkxOG4iLCJfXyIsInRvdGFsUm93Iiwic2VuZCIsImUiLCJsb2dnZXIiLCJlcnJvciIsImdldERldGFpbCIsImlzQmxhbmsiLCJpZCIsImRlbGV0ZSIsInJzdXBkYXRlIiwic3RhdHVzIiwidXBkYXRlU3RhdHVzIiwic2VsZiIsInZhbGlkYXRlIiwiRXJyb3JUeXBlVmFsaWRhdGUiLCJlcnJvcnMiLCJGTFZhbGlkYXRpb25BbGwiLCJ1cGxvYWRfdGh1bWJuYWlsIiwiYmFzZTY0U3RyaW5nIiwiYmFzZTY0TWltZVR5cGUiLCJleHQiLCJyZXBsYWNlIiwiQ29uc3RhbnRzIiwiZGF0YSIsImFsbG93SW1hZ2UiLCJpbmRleE9mIiwiY3JlYXRlSnNvbkltYWdlRXJyb3JNZXNzYWdlIiwiaW1hZ2VGaWxlTmFtZSIsIndyaXRlRmlsZVVwbG9hZCIsInVwbG9hZF90aHVtYm5haWxfbmFtZSIsInRodW1ibmFpbCIsImhhc093blByb3BlcnR5Iiwic2NyZWVuX21vZGUiLCJpbnNlcnQiLCJpbnNlcnRFcnJvclR5cGUiLCJ1cGRhdGUiLCJ1cGRhdGVFcnJvclR5cGUiLCJuYW1lSW1nIiwidyIsImgiLCJwYXRoIiwicmVxdWlyZSIsImJ1ZmZlciIsIkJ1ZmZlciIsImZyb20iLCJmaWxlTmFtZSIsImN1ckRhdGUiLCJEYXRlIiwiY3VyTmFtZSIsInN1YnN0ciIsImxhc3RJbmRleE9mIiwicGFyc2UiLCJub3ciLCJmaWxlVXJsIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImltYWdlVXBsb2FkIiwiam9pbiIsInVwbG9hZHNfcmVzIiwiY2hlY2tGaWxlRXhpdHMiLCJyZW1vdmVGaWxlIiwiZnMiLCJleGlzdHNTeW5jIiwibWtkaXJTeW5jIiwicmVjdXJzaXZlIiwidXBsb2FkIiwidXBsb2FkRmlsZSIsImNvbnNvbGUiLCJzb3VyY2UiLCJkZXNQYXRoIiwidXBsb2FkUmVzaXplSW1hZ2UiLCJtZXNzYWdlIiwibGFiZWwiLCJnZXREcm9wRG93bkxpc3QiLCJBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSxtQjs7Ozs7Ozs7Ozs7OztBQUVGOzs7Ozs7O2dDQU9RQyxHLEVBQUtDLFEsRUFBVTtBQUNuQixnQkFBSTtBQUNBLG9CQUFJQyxVQUFVLElBQUlDLDBCQUFKLEVBQWQ7QUFDQSxvQkFBSUMsU0FBUyxJQUFJQyx5QkFBSixFQUFiO0FBQ0FELHlCQUFTRSxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkgsTUFBbEIsRUFBMEJILFFBQTFCLENBQVQ7QUFDQUMsd0JBQVFNLE9BQVIsQ0FBZ0JKLE1BQWhCLEVBQXdCLFVBQVVLLEdBQVYsRUFBZUMsRUFBZixFQUFtQjtBQUN2Qyx3QkFBSSxDQUFDRCxHQUFMLEVBQVU7QUFDTlAsZ0NBQVFTLE9BQVIsQ0FBZ0JQLE1BQWhCLEVBQXdCLFVBQVVRLElBQVYsRUFBZ0JDLEdBQWhCLEVBQXFCO0FBQ3pDLGdDQUFJLENBQUNELElBQUwsRUFBVztBQUNQRSwwQ0FBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsSUFBdEIsRUFBNEJDLEtBQUtDLEVBQUwsQ0FBUSxnQkFBUixDQUE1QixFQUF1RFIsRUFBdkQsRUFBMkRHLElBQUlNLFFBQS9ELENBQVY7QUFDSCw2QkFGRCxNQUVPO0FBQ0hMLDBDQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QkMsS0FBS0MsRUFB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QUosQ0FBU04sT0FBVDtBQUNIO0FBQ0o7Ozs7RUE1VTZCK0UsbUM7O2tCQStVbkI5RixtQiIsImZpbGUiOiJFcnJvclR5cGVDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0TWFuYWdlckNvbnRyb2xsZXIgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyJztcbmltcG9ydCBFcnJvclR5cGVFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvRXJyb3JUeXBlRW50aXR5JztcbmltcG9ydCBFcnJvclR5cGVTZXJ2aWNlIGZyb20gJy4uL3NlcnZpY2VzL0Vycm9yVHlwZVNlcnZpY2UnO1xuaW1wb3J0IEVycm9yVHlwZVZhbGlkYXRlIGZyb20gJy4uL3ZhbGlkYXRvci9FcnJvclR5cGVWYWxpZGF0ZSc7XG5pbXBvcnQgU3luYyBmcm9tICdzeW5jJztcblxuY2xhc3MgRXJyb3JUeXBlQ29udHJvbGxlciBleHRlbmRzIEFic3RyYWN0TWFuYWdlckNvbnRyb2xsZXIge1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBMaXN0IGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMC8wNy8yMDE5XG4gICAgICogQHBhcmFtIHt9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldExpc3QocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgRXJyb3JUeXBlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBFcnJvclR5cGVFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXRMaXN0KGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldFNpemUoZW50aXR5LCBmdW5jdGlvbiAoZXJyMSwgcnMxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVycjEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIHJzMS50b3RhbFJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgZGV0YWlsIGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBnZXREZXRhaWwocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgRXJyb3JUeXBlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBFcnJvclR5cGVFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXREZXRhaWwoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRGVsZXRlIGl0ZW1cbiAgICAgKiBAYXV0aG9yIHRoYW5oLmJheVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE4XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBkZWxldGVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgRXJyb3JUeXBlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBFcnJvclR5cGVFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgaWYgKExpYnMuaXNCbGFuayhlbnRpdHkuaWQpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJOT1RfRVhJU1RcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBTeW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLmRlbGV0ZShlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfU1VDQ0VTUycpLCBlbnRpdHksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZXJyb3IgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFNhdmUgYWN0aW9uXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgdXBkYXRlU3RhdHVzKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IEVycm9yVHlwZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgRXJyb3JUeXBlRW50aXR5KCksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIGVudGl0eS5zdGF0dXMgPSAoIWVudGl0eS5zdGF0dXMgfHwgZW50aXR5LnN0YXR1cyA9PSAtMSkgPyAwIDogMTtcblxuICAgICAgICAgICAgaWYgKExpYnMuaXNCbGFuayhlbnRpdHkuaWQpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJOT1RfRVhJU1RcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlcnZpY2UudXBkYXRlU3RhdHVzKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnN1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcnN1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9TVUNDRVNTJyksIGVudGl0eSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlcnJvciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGFjdGlvblxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDExLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGFzeW5jIHNhdmVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgRXJyb3JUeXBlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBFcnJvclR5cGVFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgZW50aXR5LnN0YXR1cyA9ICghZW50aXR5LnN0YXR1cyB8fCBlbnRpdHkuc3RhdHVzID09IC0xKSA/IDAgOiAxO1xuICAgICAgICAgICAgbGV0IHZhbGlkYXRlID0gbmV3IEVycm9yVHlwZVZhbGlkYXRlKCk7XG5cbiAgICAgICAgICAgIGxldCBlcnJvcnMgPSBhd2FpdCB2YWxpZGF0ZS5GTFZhbGlkYXRpb25BbGwoZW50aXR5KTtcbiAgICAgICAgICAgIGlmIChlcnJvcnMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGVycm9ycy52YWxpZGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgXCJcIiwgZXJyb3JzLCAwKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIUxpYnMuaXNCbGFuayhwb3N0RGF0YS51cGxvYWRfdGh1bWJuYWlsKSkge1xuICAgICAgICAgICAgICAgIGxldCBiYXNlNjRTdHJpbmcgPSBwb3N0RGF0YS51cGxvYWRfdGh1bWJuYWlsO1xuICAgICAgICAgICAgICAgIGxldCBiYXNlNjRNaW1lVHlwZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoYmFzZTY0U3RyaW5nKSkge1xuICAgICAgICAgICAgICAgICAgICBiYXNlNjRNaW1lVHlwZSA9IExpYnMuYmFzZTY0TWltZVR5cGUoYmFzZTY0U3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoYmFzZTY0TWltZVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXh0ID0gYmFzZTY0TWltZVR5cGUucmVwbGFjZSgnaW1hZ2UvJywgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENvbnN0YW50cy5kYXRhLmFsbG93SW1hZ2UuaW5kZXhPZihleHQpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gc2VsZi5jcmVhdGVKc29uSW1hZ2VFcnJvck1lc3NhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IHNlbGYuY3JlYXRlSnNvbkltYWdlRXJyb3JNZXNzYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2VGaWxlTmFtZSA9IGF3YWl0IHNlbGYud3JpdGVGaWxlVXBsb2FkKGJhc2U2NFN0cmluZywgcG9zdERhdGEudXBsb2FkX3RodW1ibmFpbF9uYW1lLCBudWxsLCBudWxsLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpbWFnZUZpbGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfRkFJTCcpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eS50aHVtYm5haWwgPSBpbWFnZUZpbGVOYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGVudGl0eS5oYXNPd25Qcm9wZXJ0eSgnc2NyZWVuX21vZGUnKSAmJiBlbnRpdHkuc2NyZWVuX21vZGUgPT0gQ29uc3RhbnRzLnNjcmVlbl9tb2RlLmluc2VydCkge1xuICAgICAgICAgICAgICAgIFN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmluc2VydEVycm9yVHlwZShlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocnMgJiYgZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfU1VDQ0VTUycpLCBlbnRpdHksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZW50aXR5Lmhhc093blByb3BlcnR5KCdzY3JlZW5fbW9kZScpICYmIGVudGl0eS5zY3JlZW5fbW9kZSA9PSBDb25zdGFudHMuc2NyZWVuX21vZGUudXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgc2VydmljZS51cGRhdGVFcnJvclR5cGUoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5TQVZFX1NVQ0NFU1MnKSwgZW50aXR5LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5TQVZFX0ZBSUwnKSwgeyBcImVycm9yXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBMxrB1IGZpbGUgZ2FsbGVyeVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBiYXNlNjRTdHJpbmcgXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVudGl0eSBcbiAgICAgKiBAUmV0dXJuIHRy4bqjIHbhu4EgZmlsZSBuYW1lIGJhbyBn4buTbSBmb2xkZXIgbuG6v3UgbMawdSBmaWxlIHRow6BuaCBjw7RuZywgbmfGsOG7o2MgbOG6oWkgdHLhuqMgduG7gSBmYWxzZVxuICAgICAqL1xuICAgIGFzeW5jIHdyaXRlRmlsZVVwbG9hZChiYXNlNjRTdHJpbmcsIG5hbWVJbWcsIHRodW1ibmFpbCA9IG51bGwsIHcgPSBudWxsLCBoID0gbnVsbCkge1xuICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGJhc2U2NFN0cmluZykpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIGJhc2U2NE1pbWVUeXBlID0gTGlicy5iYXNlNjRNaW1lVHlwZShiYXNlNjRTdHJpbmcpO1xuICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGJhc2U2NE1pbWVUeXBlKSkgcmV0dXJuIHRydWU7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgICAgICAgICAgIHZhciBleHQgPSBiYXNlNjRNaW1lVHlwZS5yZXBsYWNlKCdpbWFnZS8nLCAnJyk7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IGJhc2U2NFN0cmluZy5yZXBsYWNlKFwiZGF0YTpcIiArIGJhc2U2NE1pbWVUeXBlICsgXCI7YmFzZTY0LFwiLCAnJyk7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gQnVmZmVyLmZyb20oZGF0YSwgJ2Jhc2U2NCcpO1xuXG4gICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSAnJztcbiAgICAgICAgICAgIGxldCBjdXJEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBjdXJOYW1lID0gbmFtZUltZy5zdWJzdHIoMCwgbmFtZUltZy5sYXN0SW5kZXhPZignLicpKTtcbiAgICAgICAgICAgIGlmIChMaWJzLmlzQmxhbmsoY3VyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IERhdGUucGFyc2UoY3VyRGF0ZSkgKyAnLicgKyBleHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gY3VyTmFtZSArICctJyArIERhdGUucGFyc2UoY3VyRGF0ZSkgKyAnLicgKyBleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBmaWxlVXJsID0gIG5vdy5nZXRGdWxsWWVhcigpICsgXCIvXCIgKyAobm93LmdldE1vbnRoKCkgKyAxKTtcbiAgICAgICAgICAgIHZhciBpbWFnZVVwbG9hZCA9IHBhdGguam9pbihDb25zdGFudHMuZGF0YS51cGxvYWRzX3JlcywgZmlsZVVybCk7XG5cbiAgICAgICAgICAgIC8vIEtp4buDbSB0cmEgZmlsZSDEkcOjIHThu5NuIHThuqFpLCBjw7MgdGjDrCB4w7NhXG4gICAgICAgICAgICBpZiAoTGlicy5jaGVja0ZpbGVFeGl0cyhpbWFnZVVwbG9hZCwgZmlsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgTGlicy5yZW1vdmVGaWxlKGltYWdlVXBsb2FkLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRyxrDhu51uZyBo4bujcCBraMO0bmcgdOG7k24gdOG6oWkgdGjGsCBt4bulYyBz4bq9IHThuqFvIHRoxrAgbeG7pWMgxJHDs1xuICAgICAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGltYWdlVXBsb2FkKSkge1xuICAgICAgICAgICAgICAgIGZzLm1rZGlyU3luYyhpbWFnZVVwbG9hZCwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRo4buxYyBoaeG7h24gdmnhu4djIHVwbG9hZCBow6xuaCDhuqNuaFxuICAgICAgICAgICAgbGV0IHVwbG9hZCA9IExpYnMudXBsb2FkRmlsZShpbWFnZVVwbG9hZCwgZmlsZU5hbWUsIGJ1ZmZlcik7XG4gICAgICAgICAgICAvLyBUcsaw4budbmcgaOG7o3AgdXBsb2FkIOG6o25oIGLhu4sgbOG7l2lcbiAgICAgICAgICAgIGlmICghdXBsb2FkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuY29uc29sZS5lcnJvcihpMThuLl9fKCdtc2dfZXJyX2ZpbGVfdXBsb2FkJykpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRodW1ibmFpbFxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsodykgJiYgIUxpYnMuaXNCbGFuayhoKSAmJiAhTGlicy5pc0JsYW5rKHRodW1ibmFpbCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gcGF0aC5qb2luKENvbnN0YW50cy5kYXRhLnVwbG9hZHNfcmVzLCBmaWxlVXJsLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgdmFyIGRlc1BhdGggPSBub3cuZ2V0RnVsbFllYXIoKSArIFwiL1wiICsgKG5vdy5nZXRNb250aCgpICsgMSk7XG4gICAgICAgICAgICAgICAgTGlicy51cGxvYWRSZXNpemVJbWFnZShzb3VyY2UsIHBhdGguam9pbihDb25zdGFudHMuZGF0YS51cGxvYWRzX3JlcywgdGh1bWJuYWlsLCBkZXNQYXRoKSwgZmlsZU5hbWUsIDg1LCB3LCBoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHBhdGguam9pbihub3cuZ2V0RnVsbFllYXIoKSArIFwiL1wiICsgKG5vdy5nZXRNb250aCgpICsgMSksIGZpbGVOYW1lKTtcblxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZSBqc29uIGltYWdlIGVycm9yIG1lc3NhZ2VcbiAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgKiBAc2luY2UgMjYvMDcvMjAxOFxuICAgICovXG4gICAgY3JlYXRlSnNvbkltYWdlRXJyb3JNZXNzYWdlKCkge1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGkxOG4uX18oJ3R5cGVfaW1hZ2UnKTtcbiAgICAgICAgbGV0IGxhYmVsID0gaTE4bi5fXygncG9zdHMuaW1hZ2UnKTtcbiAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIG1lc3NhZ2UucmVwbGFjZShcIiQ8MT5cIiwgbGFiZWwpLCB7fSwgMCk7XG4gICAgICAgIHJldHVybiByZXNEYXRhO1xuICAgIH1cblxuICAgIC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGFsbFxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxuXHQgKiBAc2luY2UgMTAvMDcvMjAxOVxuXHQgKiBAcGFyYW0ge30gcmVzIFxuXHQgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuXHQgKi9cbiAgICAgZ2V0RHJvcERvd25MaXN0KHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IEVycm9yVHlwZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgRXJyb3JUeXBlRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0RHJvcERvd25MaXN0KGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKFwiTOG7l2k6IFwiICsgZSk7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuZXhwb3J0IGRlZmF1bHQgRXJyb3JUeXBlQ29udHJvbGxlcjsiXX0=