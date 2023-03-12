'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseController2 = require('../core/BaseController');

var _BaseController3 = _interopRequireDefault(_BaseController2);

var _EmployeeService = require('../services/EmployeeService');

var _EmployeeService2 = _interopRequireDefault(_EmployeeService);

var _EmployeeForgotPasswordValidate = require('../validator/EmployeeForgotPasswordValidate');

var _EmployeeForgotPasswordValidate2 = _interopRequireDefault(_EmployeeForgotPasswordValidate);

var _EmplyeeResetPasswordValidate = require('../validator/EmplyeeResetPasswordValidate');

var _EmplyeeResetPasswordValidate2 = _interopRequireDefault(_EmplyeeResetPasswordValidate);

var _EmployeeUpdateProfileValidate = require('../validator/EmployeeUpdateProfileValidate');

var _EmployeeUpdateProfileValidate2 = _interopRequireDefault(_EmployeeUpdateProfileValidate);

var _EmployeeChangePassWordValidate = require('../validator/EmployeeChangePassWordValidate');

var _EmployeeChangePassWordValidate2 = _interopRequireDefault(_EmployeeChangePassWordValidate);

var _EmployeeValidate = require('../validator/EmployeeValidate');

var _EmployeeValidate2 = _interopRequireDefault(_EmployeeValidate);

var _EmployeeEntity = require('../entities/EmployeeEntity');

var _EmployeeEntity2 = _interopRequireDefault(_EmployeeEntity);

var _sync = require('sync');

var _sync2 = _interopRequireDefault(_sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EmployeeController = function (_BaseController) {
    _inherits(EmployeeController, _BaseController);

    function EmployeeController() {
        _classCallCheck(this, EmployeeController);

        return _possibleConstructorReturn(this, (EmployeeController.__proto__ || Object.getPrototypeOf(EmployeeController)).call(this));
    }

    /**
     * action change password
     * @author Long.Pham
     * @param {Object} res 
     * @param {Object} postData 
     */

    _createClass(EmployeeController, [{
        key: 'forgotPassword',
        value: function forgotPassword(res, postData) {
            try {
                var service = new _EmployeeService2.default();
                var entity = new _EmployeeEntity2.default();
                entity = Object.assign({}, entity, postData);
                service.checkEmployeeForgotPassword(entity, function (err, rs) {
                    var resData = {};
                    if (rs) {
                        // Gui mail reset mat khau
                        var arr = {
                            id: rs.id,
                            email: rs.email,
                            exp: Math.floor(Date.now() / 1000) + 60 * 60 // het han sau 1h
                        };

                        rs.link = Constants.cms_url.reset_password + "?token=" + Libs.generateTokenCrypto(arr);
                        rs.logo = Constants.cms_url.logo;
                        var html = reportRender.render("employee/forgot_password", rs);
                        SentMail.SentMailHTML(null, rs.email, 'Yêu cầu thay đổi mật khẩu', html);
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
         * action reset password
         * @author Long.Pham
         * @param {Object} res 
         * @param {Object} postData 
         */

    }, {
        key: 'resetPassword',
        value: function resetPassword(res, postData) {
            try {
                var service = new _EmployeeService2.default();
                var entity = Object.assign({}, new _EmployeeEntity2.default(), postData);
                var validate = new _EmplyeeResetPasswordValidate2.default();

                validate.validationAll(postData, async function (err) {
                    try {
                        if (err) {
                            var resData = Libs.returnJsonResult(false, "", err, 0);
                            res.send(resData);
                            return;
                        }
                        var userE = Libs.decodeTokenCrypto(entity.token);
                        var now = Math.floor(Date.now() / 1000);
                        if (Libs.isObjectEmpty(userE)) {
                            var resData = Libs.returnJsonResult(false, i18n.__("User.User_not_exist"), '');
                            res.send(resData);
                            return;
                        }

                        if (now >= userE.exp) {
                            var resData = Libs.returnJsonResult(false, "Link thay đổi mật khẩu không đúng hoặc đã hết hiệu lực.", '');
                            res.send(resData);
                            return;
                        }

                        var salt = Libs.SHA3(Libs.generateStrRandom(24));
                        var password = Libs.encodePassWord(postData.password, salt);
                        userE.password = password;
                        userE.salt = salt;

                        var updatePassword = await service.resetPassword(userE);

                        if (!updatePassword) {
                            var resData = Libs.returnJsonResult(false, i18n.__('ERROR_CHANGE_PASSWORD'), "");
                            res.send(resData);
                            return;
                        }

                        delete userE.password;
                        delete userE.salt;
                        var resData = Libs.returnJsonResult(true, i18n.__('CHANGE_PASSWORD_SUCCESS'), userE, 1);
                        res.send(resData);
                        return;
                    } catch (e) {
                        var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                        res.send(resData);
                    }
                });
            } catch (e) {
                console.log(e);
                res.send(Libs.returnJsonResult(false, i18n.__('ERR_LOGIN'), e));
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
        key: 'getDetailUpdateProfile',
        value: function getDetailUpdateProfile(res, postData) {
            try {
                var service = new _EmployeeService2.default();
                var entity = new _EmployeeEntity2.default();
                entity = Object.assign({}, entity, postData);
                service.getDetailUpdateProfile(entity, function (err, rs) {
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
                var service = new _EmployeeService2.default();
                var entity = new _EmployeeEntity2.default();
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
         * @description Save action
         * @author Long.Pham
         * @since 11/07/2019
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'saveUpdateProfileAction',
        value: async function saveUpdateProfileAction(res, postData) {
            try {
                var service = new _EmployeeService2.default();
                var self = this;
                var entity = Object.assign({}, new _EmployeeEntity2.default(), postData);
                var validate = new _EmployeeUpdateProfileValidate2.default();

                if (!Libs.isBlank(entity.birthday)) {
                    entity.birthday = Libs.convertStr2DateV01(entity.birthday, "dd/mm/yyyy", "/");
                }

                var errors = await validate.FLValidationAll(entity);
                if (errors != null) {
                    errors.validate = false;
                    res.send(Libs.returnJsonResult(false, "", errors, 0));
                    return;
                }

                if (!Libs.isBlank(postData.file_upload)) {
                    var base64String = postData.file_upload;
                    var base64MimeType = null;
                    if (!Libs.isBlank(base64String)) {
                        base64MimeType = Libs.base64MimeType(base64String);
                        if (!Libs.isBlank(base64MimeType)) {
                            var ext = base64MimeType.replace('image/', '');
                            if (Constants.data.allowImage.indexOf(ext) === -1) {
                                var resData = self.createJsonImageErrorMessage();
                                res.send(resData);
                                return;
                            }
                        } else {
                            var resData = self.createJsonImageErrorMessage();
                            res.send(resData);
                            return;
                        }
                        var imageFileName = await self.writeFileUpload(base64String, entity.file_name, postData.iso_code, '420x320', 420, 320);

                        if (!imageFileName) {
                            var resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                            res.send(resData);
                            return;
                        }

                        entity.avatar = imageFileName;
                    }
                }

                service.updateProfile(entity, function (err, rsupdate) {
                    try {
                        if (!rsupdate) {
                            var _resData2 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                            res.send(_resData2);
                            return;
                        }
                        var _resData = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                        res.send(_resData);
                    } catch (error) {
                        var _resData3 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                        res.send(_resData3);
                    }
                });
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
         * action change password
         * @author Long.Pham
         * @param {Object} res 
         * @param {Object} postData 
         */

    }, {
        key: 'changePassword',
        value: function changePassword(res, postData) {
            try {
                var service = new _EmployeeService2.default();
                var entity = Object.assign({}, new _EmployeeEntity2.default(), postData);
                var validate = new _EmployeeChangePassWordValidate2.default();

                validate.validationAll(postData, async function (err) {
                    try {
                        if (err) {
                            var resData = Libs.returnJsonResult(false, "", err, 0);
                            res.send(resData);
                            return;
                        }
                        // Kiểm tra nhập mật khẩu cũ có đúng không?
                        var employeeExist = await service.checkEmployeeExist(entity);
                        if (Libs.isObjectEmpty(employeeExist)) {
                            var resData = Libs.returnJsonResult(false, null, Libs.buildPathValidateMessage("id", i18n.__("employee.employee_not_exist")), 0);
                            res.send(resData);
                            return;
                        }

                        // Kiểm tra mật khẩu cũ có đúng không
                        var old_password = Libs.decodePassWord(employeeExist.password, employeeExist.salt);
                        if (old_password != postData.current_password) {
                            resData = Libs.returnJsonResult(false, null, Libs.buildPathValidateMessage("current_password", i18n.__("employee.password_not_exist")), 0);
                            res.send(resData);
                            return;
                        }

                        var salt = Libs.SHA3(Libs.generateStrRandom(24));
                        var password = Libs.encodePassWord(postData.password, salt);

                        entity.password = password;
                        entity.salt = salt;
                        // Cập nhật mật khẩu mới
                        if (Libs.isBlank(entity.password)) {
                            var resData = Libs.returnJsonResult(false, i18n.__('NEW_PASSWORD_INCORRECT'), "");
                            res.send(resData);
                            return;
                        }

                        var updatePassword = await service.updateEmployeePassword(entity);

                        if (!updatePassword) {
                            var resData = Libs.returnJsonResult(false, i18n.__('ERROR_CHANGE_PASSWORD'), "");
                            res.send(resData);
                            return;
                        }

                        var resData = Libs.returnJsonResult(true, i18n.__('CHANGE_PASSWORD_SUCCESS'), entity, 1);
                        res.send(resData);
                        return;
                    } catch (e) {
                        var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                        res.send(resData);
                    }
                });
            } catch (e) {
                // console.log(e);
                res.send(Libs.returnJsonResult(false, i18n.__('ERR_LOGIN'), e));
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
                var service = new _EmployeeService2.default();
                var entity = Object.assign({}, new _EmployeeEntity2.default(), postData);
                var validate = new _EmployeeValidate2.default(entity);

                if (!Libs.isBlank(entity.birthday)) {
                    entity.birthday = Libs.convertStr2DateV01(entity.birthday, "dd/mm/yyyy", "/");
                }

                var errors = await validate.FLValidationAll(entity);
                if (errors != null) {
                    errors.validate = false;
                    res.send(Libs.returnJsonResult(false, "", errors, 0));
                    return;
                }

                if (!Libs.isBlank(postData.file_upload)) {
                    var base64String = postData.file_upload;
                    var base64MimeType = null;
                    if (!Libs.isBlank(base64String)) {
                        base64MimeType = Libs.base64MimeType(base64String);
                        if (!Libs.isBlank(base64MimeType)) {
                            var ext = base64MimeType.replace('image/', '');
                            if (Constants.data.allowImage.indexOf(ext) === -1) {
                                var resData = self.createJsonImageErrorMessage();
                                res.send(resData);
                                return;
                            }
                        } else {
                            var resData = self.createJsonImageErrorMessage();
                            res.send(resData);
                            return;
                        }
                        var imageFileName = await self.writeFileUpload(base64String, entity.file_name, '', null, null);

                        if (!imageFileName) {
                            var resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                            res.send(resData);
                            return;
                        }

                        entity.avatar = imageFileName;
                    }
                }

                if (!Libs.isArrayData(entity.role_data)) {
                    var _resData4 = Libs.returnJsonResult(true, i18n.__('employee.role_data'), entity, 0);
                    res.send(_resData4);
                    return;
                }

                if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                    (0, _sync2.default)(function () {
                        var EmployeeEmailExist = service.checkEmployeeExistByEmail.sync(null, entity);
                        if (!Libs.isObjectEmpty(EmployeeEmailExist) && EmployeeEmailExist.email == entity.email) {
                            var _resData5 = Libs.returnJsonResult(false, null, Libs.buildPathValidateMessage("email", i18n.__("employee.exist_email")), 0);
                            res.send(_resData5);
                            return;
                        }

                        var salt = Libs.SHA3(Libs.generateStrRandom(24));
                        var password = Libs.encodePassWord(postData.password, salt);
                        entity.password = password;
                        entity.salt = salt;
                        service.insertEmployee(entity, function (err, rs) {
                            if (rs) {
                                var _resData6 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                                res.send(_resData6);
                            } else {
                                var _resData7 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                                res.send(_resData7);
                            }
                        });
                    });
                } else if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                    if (!Libs.isBlank(postData.password)) {
                        var salt = Libs.SHA3(Libs.generateStrRandom(24));
                        var password = Libs.encodePassWord(postData.password, salt);
                        entity.password = password;
                        entity.salt = salt;
                    }

                    service.updateEmployee(entity, function (err, rs) {
                        if (rs) {
                            var _resData8 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                            res.send(_resData8);
                        } else {
                            var _resData9 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                            res.send(_resData9);
                        }
                    });
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
                var service = new _EmployeeService2.default();
                var entity = Object.assign({}, new _EmployeeEntity2.default(), postData);
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
                                var _resData11 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                res.send(_resData11);
                                return;
                            }
                            var _resData10 = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                            res.send(_resData10);
                        } catch (error) {
                            var _resData12 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                            res.send(_resData12);
                        }
                    });
                });
            } catch (e) {
                var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
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
        value: function getList(res, postData) {
            try {
                var service = new _EmployeeService2.default();
                var entity = Object.assign({}, new _EmployeeEntity2.default(), postData);
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
         * @description Get List item
         * @author Long.Pham
         * @since 10/07/2019
         * @param {} res 
         * @param {*} postData 
         */

    }, {
        key: 'getListProjectConfigMail',
        value: function getListProjectConfigMail(res, postData) {
            try {
                var service = new _EmployeeService2.default();
                var entity = Object.assign({}, new _EmployeeEntity2.default(), postData);
                service.getListProjectConfigMail(entity, function (err, rs) {
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
         * @description Get List item
         * @author Long.Pham
         * @since 10/07/2019
         * @param {} res 
         * @param {*} postData 
         */

    }, {
        key: 'getListAll',
        value: function getListAll(res, postData) {
            try {
                var service = new _EmployeeService2.default();
                var entity = Object.assign({}, new _EmployeeEntity2.default(), postData);
                service.getListAll(entity, function (err, rs) {
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
                var service = new _EmployeeService2.default();
                var entity = new _EmployeeEntity2.default();
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
        key: 'updateStatusMailConfig',
        value: function updateStatusMailConfig(res, postData) {
            try {
                var service = new _EmployeeService2.default();
                var entity = Object.assign({}, new _EmployeeEntity2.default(), postData);
                (0, _sync2.default)(function () {
                    service.updateStatusMailConfig(entity, function (err, rsupdate) {
                        try {
                            if (!rsupdate) {
                                var _resData14 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                res.send(_resData14);
                                return;
                            }
                            var _resData13 = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                            res.send(_resData13);
                        } catch (error) {
                            var _resData15 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                            res.send(_resData15);
                        }
                    });
                });
            } catch (e) {
                var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }
    }]);

    return EmployeeController;
}(_BaseController3.default);

exports.default = EmployeeController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0VtcGxveWVlQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJFbXBsb3llZUNvbnRyb2xsZXIiLCJyZXMiLCJwb3N0RGF0YSIsInNlcnZpY2UiLCJFbXBsb3llZVNlcnZpY2UiLCJlbnRpdHkiLCJFbXBsb3llZUVudGl0eSIsIk9iamVjdCIsImFzc2lnbiIsImNoZWNrRW1wbG95ZWVGb3Jnb3RQYXNzd29yZCIsImVyciIsInJzIiwicmVzRGF0YSIsImFyciIsImlkIiwiZW1haWwiLCJleHAiLCJNYXRoIiwiZmxvb3IiLCJEYXRlIiwibm93IiwibGluayIsIkNvbnN0YW50cyIsImNtc191cmwiLCJyZXNldF9wYXNzd29yZCIsIkxpYnMiLCJnZW5lcmF0ZVRva2VuQ3J5cHRvIiwibG9nbyIsImh0bWwiLCJyZXBvcnRSZW5kZXIiLCJyZW5kZXIiLCJTZW50TWFpbCIsIlNlbnRNYWlsSFRNTCIsInJldHVybkpzb25SZXN1bHQiLCJpMThuIiwiX18iLCJzZW5kIiwiZSIsInZhbGlkYXRlIiwiRW1wbHllZVJlc2V0UGFzc3dvcmRWYWxpZGF0ZSIsInZhbGlkYXRpb25BbGwiLCJ1c2VyRSIsImRlY29kZVRva2VuQ3J5cHRvIiwidG9rZW4iLCJpc09iamVjdEVtcHR5Iiwic2FsdCIsIlNIQTMiLCJnZW5lcmF0ZVN0clJhbmRvbSIsInBhc3N3b3JkIiwiZW5jb2RlUGFzc1dvcmQiLCJ1cGRhdGVQYXNzd29yZCIsInJlc2V0UGFzc3dvcmQiLCJjb25zb2xlIiwibG9nIiwiZ2V0RGV0YWlsVXBkYXRlUHJvZmlsZSIsImdldERldGFpbCIsInNlbGYiLCJFbXBsb3llZVVwZGF0ZVByb2ZpbGVWYWxpZGF0ZSIsImlzQmxhbmsiLCJiaXJ0aGRheSIsImNvbnZlcnRTdHIyRGF0ZVYwMSIsImVycm9ycyIsIkZMVmFsaWRhdGlvbkFsbCIsImZpbGVfdXBsb2FkIiwiYmFzZTY0U3RyaW5nIiwiYmFzZTY0TWltZVR5cGUiLCJleHQiLCJyZXBsYWNlIiwiZGF0YSIsImFsbG93SW1hZ2UiLCJpbmRleE9mIiwiY3JlYXRlSnNvbkltYWdlRXJyb3JNZXNzYWdlIiwiaW1hZ2VGaWxlTmFtZSIsIndyaXRlRmlsZVVwbG9hZCIsImZpbGVfbmFtZSIsImlzb19jb2RlIiwiYXZhdGFyIiwidXBkYXRlUHJvZmlsZSIsInJzdXBkYXRlIiwiZXJyb3IiLCJuYW1lSW1nIiwidGh1bWJuYWlsIiwidyIsImgiLCJwYXRoIiwicmVxdWlyZSIsImJ1ZmZlciIsIkJ1ZmZlciIsImZyb20iLCJmaWxlTmFtZSIsImN1ckRhdGUiLCJjdXJOYW1lIiwic3Vic3RyIiwibGFzdEluZGV4T2YiLCJwYXJzZSIsImZpbGVVcmwiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiaW1hZ2VVcGxvYWQiLCJqb2luIiwidXBsb2Fkc19yZXMiLCJjaGVja0ZpbGVFeGl0cyIsInJlbW92ZUZpbGUiLCJmcyIsImV4aXN0c1N5bmMiLCJta2RpclN5bmMiLCJyZWN1cnNpdmUiLCJ1cGxvYWQiLCJ1cGxvYWRGaWxlIiwibG9nZ2VyIiwic291cmNlIiwiZGVzUGF0aCIsInVwbG9hZFJlc2l6ZUltYWdlIiwibWVzc2FnZSIsImxhYmVsIiwiRW1wbG95ZWVDaGFuZ2VQYXNzV29yZFZhbGlkYXRlIiwiZW1wbG95ZWVFeGlzdCIsImNoZWNrRW1wbG95ZWVFeGlzdCIsImJ1aWxkUGF0aFZhbGlkYXRlTWVzc2FnZSIsIm9sZF9wYXNzd29yZCIsImRlY29kZVBhc3NXb3JkIiwiY3VycmVudF9wYXNzd29yZCIsInVwZGF0ZUVtcGxveWVlUGFzc3dvcmQiLCJFbXBsb3llZVZhbGlkYXRlIiwiaXNBcnJheURhdGEiLCJyb2xlX2RhdGEiLCJoYXNPd25Qcm9wZXJ0eSIsInNjcmVlbl9tb2RlIiwiaW5zZXJ0IiwiRW1wbG95ZWVFbWFpbEV4aXN0IiwiY2hlY2tFbXBsb3llZUV4aXN0QnlFbWFpbCIsInN5bmMiLCJpbnNlcnRFbXBsb3llZSIsInVwZGF0ZSIsInVwZGF0ZUVtcGxveWVlIiwic3RhdHVzIiwidXBkYXRlU3RhdHVzIiwiZ2V0TGlzdCIsImdldFNpemUiLCJlcnIxIiwicnMxIiwidG90YWxSb3ciLCJnZXRMaXN0UHJvamVjdENvbmZpZ01haWwiLCJnZXRMaXN0QWxsIiwiZGVsZXRlIiwidXBkYXRlU3RhdHVzTWFpbENvbmZpZyIsIkJhc2VDb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRU1BLGtCOzs7QUFDRixrQ0FBYztBQUFBOztBQUFBO0FBRWI7O0FBRUQ7Ozs7Ozs7Ozt1Q0FPZUMsRyxFQUFLQyxRLEVBQVU7QUFDMUIsZ0JBQUk7QUFDQSxvQkFBSUMsVUFBVSxJQUFJQyx5QkFBSixFQUFkO0FBQ0Esb0JBQUlDLFNBQVMsSUFBSUMsd0JBQUosRUFBYjtBQUNBRCx5QkFBU0UsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JILE1BQWxCLEVBQTBCSCxRQUExQixDQUFUO0FBQ0FDLHdCQUFRTSwyQkFBUixDQUFvQ0osTUFBcEMsRUFBNEMsVUFBVUssR0FBVixFQUFlQyxFQUFmLEVBQW1CO0FBQzNELHdCQUFJQyxVQUFVLEVBQWQ7QUFDQSx3QkFBSUQsRUFBSixFQUFRO0FBQ0o7QUFDQSw0QkFBSUUsTUFBTTtBQUNOQyxnQ0FBSUgsR0FBR0csRUFERDtBQUVOQyxtQ0FBT0osR0FBR0ksS0FGSjtBQUdOQyxpQ0FBS0MsS0FBS0MsS0FBTCxDQUFXQyxLQUFLQyxHQUFMLEtBQWEsSUFBeEIsSUFBaUMsS0FBSyxFQUhyQyxDQUcwQztBQUgxQyx5QkFBVjs7QUFNQVQsMkJBQUdVLElBQUgsR0FBVUMsVUFBVUMsT0FBVixDQUFrQkMsY0FBbEIsR0FBbUMsU0FBbkMsR0FBK0NDLEtBQUtDLG1CQUFMLENBQXlCYixHQUF6QixDQUF6RDtBQUNBRiwyQkFBR2dCLElBQUgsR0FBVUwsVUFBVUMsT0FBVixDQUFrQkksSUFBNUI7QUFDQSw0QkFBSUMsT0FBT0MsYUFB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LEVBQWVvRSxRQUFmLEVBQXlCO0FBQzVELDRCQUFJO0FBQ0EsZ0NBQUksQ0FBQ0EsUUFBTCxFQUFlO0FBQ1gsb0NBQUlsRSxhQUFVYSxLQUFLUSxnQkFBTCxDQUFzQixLQUF0QixFQUE2QkMsS0FBS0MsRUFBTCxDQUFRLG9CQUFSLENBQTdCLEVBQTRELEVBQUUsU0FBU3pCLEdBQVgsRUFBNUQsRUFBOEUsQ0FBOUUsQ0FBZDtBQUNBVCxvQ0FBSW1DLElBQUosQ0FBU3hCLFVBQVQ7QUFDQTtBQUNIO0FBQ0QsZ0NBQUlBLGFBQVVhLEtBQUtRLGdCQUFMLENBQXNCLElBQXRCLEVBQTRCQyxLQUFLQyxFQUFMLENBQVEsdUJBQVIsQ0FBNUIsRUFBOEQ5QixNQUE5RCxFQUFzRSxDQUF0RSxDQUFkO0FBQ0FKLGdDQUFJbUMsSUFBSixDQUFTeEIsVUFBVDtBQUNILHlCQVJELENBUUUsT0FBT21FLEtBQVAsRUFBYztBQUNaLGdDQUFJbkUsYUFBVWEsS0FBS1EsZ0JBQUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtBQUtDLEVBQUwsQ0FBUSxZQUFSLENBQTdCLEVBQW9ELEVBQUUsU0FBUzRDLEtBQVgsRUFBcEQsRUFBd0UsQ0FBeEUsQ0FBZDtBQUNBOUUsZ0NBQUltQyxJQUFKLENBQVN4QixVQUFUO0FBQ0g7QUFDSixxQkFiRDtBQWNILGlCQWZEO0FBaUJILGFBcEJELENBb0JFLE9BQU95QixDQUFQLEVBQVU7QUFDUixvQkFBSXpCLFVBQVVhLEtBQUtRLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsWUFBUixDQUE3QixFQUFvRCxFQUFFLFNBQVNFLElBQUksRUFBZixFQUFwRCxFQUF5RSxDQUF6RSxDQUFkO0FBQ0FwQyxvQkFBSW1DLElBQUosQ0FBU3hCLE9BQVQ7QUFDSDtBQUNKOzs7O0VBdnRCNEJzSSx3Qjs7a0JBMnRCbEJsSixrQiIsImZpbGUiOiJFbXBsb3llZUNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUNvbnRyb2xsZXIgZnJvbSAnLi4vY29yZS9CYXNlQ29udHJvbGxlcic7XG5pbXBvcnQgRW1wbG95ZWVTZXJ2aWNlIGZyb20gJy4uL3NlcnZpY2VzL0VtcGxveWVlU2VydmljZSc7XG5pbXBvcnQgRW1wbG95ZWVGb3Jnb3RQYXNzd29yZFZhbGlkYXRlIGZyb20gJy4uL3ZhbGlkYXRvci9FbXBsb3llZUZvcmdvdFBhc3N3b3JkVmFsaWRhdGUnO1xuaW1wb3J0IEVtcGx5ZWVSZXNldFBhc3N3b3JkVmFsaWRhdGUgZnJvbSAnLi4vdmFsaWRhdG9yL0VtcGx5ZWVSZXNldFBhc3N3b3JkVmFsaWRhdGUnO1xuaW1wb3J0IEVtcGxveWVlVXBkYXRlUHJvZmlsZVZhbGlkYXRlIGZyb20gJy4uL3ZhbGlkYXRvci9FbXBsb3llZVVwZGF0ZVByb2ZpbGVWYWxpZGF0ZSc7XG5pbXBvcnQgRW1wbG95ZWVDaGFuZ2VQYXNzV29yZFZhbGlkYXRlIGZyb20gJy4uL3ZhbGlkYXRvci9FbXBsb3llZUNoYW5nZVBhc3NXb3JkVmFsaWRhdGUnO1xuaW1wb3J0IEVtcGxveWVlVmFsaWRhdGUgZnJvbSAnLi4vdmFsaWRhdG9yL0VtcGxveWVlVmFsaWRhdGUnO1xuaW1wb3J0IEVtcGxveWVlRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL0VtcGxveWVlRW50aXR5JztcbmltcG9ydCBTeW5jIGZyb20gJ3N5bmMnO1xuXG5jbGFzcyBFbXBsb3llZUNvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWN0aW9uIGNoYW5nZSBwYXNzd29yZFxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlcyBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcG9zdERhdGEgXG4gICAgICovXG5cbiAgICBmb3Jnb3RQYXNzd29yZChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc2VydmljZSA9IG5ldyBFbXBsb3llZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgRW1wbG95ZWVFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5jaGVja0VtcGxveWVlRm9yZ290UGFzc3dvcmQoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKHJzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEd1aSBtYWlsIHJlc2V0IG1hdCBraGF1XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogcnMuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogcnMuZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBleHA6IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApICsgKDYwICogNjApLCAvLyBoZXQgaGFuIHNhdSAxaFxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcnMubGluayA9IENvbnN0YW50cy5jbXNfdXJsLnJlc2V0X3Bhc3N3b3JkICsgXCI/dG9rZW49XCIgKyBMaWJzLmdlbmVyYXRlVG9rZW5DcnlwdG8oYXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcnMubG9nbyA9IENvbnN0YW50cy5jbXNfdXJsLmxvZ287XG4gICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImVtcGxveWVlL2ZvcmdvdF9wYXNzd29yZFwiLCBycyk7XG4gICAgICAgICAgICAgICAgICAgIFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBycy5lbWFpbCwgJ1nDqnUgY+G6p3UgdGhheSDEkeG7lWkgbeG6rXQga2jhuql1JywgaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIGFjdGlvbiByZXNldCBwYXNzd29yZFxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlcyBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcG9zdERhdGEgXG4gICAgICovXG4gICAgcmVzZXRQYXNzd29yZChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBFbXBsb3llZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgRW1wbG95ZWVFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgbGV0IHZhbGlkYXRlID0gbmV3IEVtcGx5ZWVSZXNldFBhc3N3b3JkVmFsaWRhdGUoKTtcblxuICAgICAgICAgICAgdmFsaWRhdGUudmFsaWRhdGlvbkFsbChwb3N0RGF0YSwgYXN5bmMgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBcIlwiLCBlcnIsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHVzZXJFID0gTGlicy5kZWNvZGVUb2tlbkNyeXB0byhlbnRpdHkudG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm93ID0gTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChMaWJzLmlzT2JqZWN0RW1wdHkodXNlckUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIlVzZXIuVXNlcl9ub3RfZXhpc3RcIiksICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vdyA+PSB1c2VyRS5leHApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBcIkxpbmsgdGhheSDEkeG7lWkgbeG6rXQga2jhuql1IGtow7RuZyDEkcO6bmcgaG/hurdjIMSRw6MgaOG6v3QgaGnhu4d1IGzhu7FjLlwiLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBzYWx0ID0gTGlicy5TSEEzKExpYnMuZ2VuZXJhdGVTdHJSYW5kb20oMjQpKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhc3N3b3JkID0gTGlicy5lbmNvZGVQYXNzV29yZChwb3N0RGF0YS5wYXNzd29yZCwgc2FsdCk7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJFLnBhc3N3b3JkID0gcGFzc3dvcmQ7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJFLnNhbHQgPSBzYWx0O1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCB1cGRhdGVQYXNzd29yZCA9IGF3YWl0IHNlcnZpY2UucmVzZXRQYXNzd29yZCh1c2VyRSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF1cGRhdGVQYXNzd29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUk9SX0NIQU5HRV9QQVNTV09SRCcpLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHVzZXJFLnBhc3N3b3JkO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdXNlckUuc2FsdDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MnKSwgdXNlckUsIDEpO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX0xPR0lOJyksIGUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuICAgIC8qKlxuICAgICogQGRlc2NyaXB0aW9uIEdldCBkZXRhaWwgaXRlbVxuICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAqIEBzaW5jZSAxMS8wNy8yMDE4XG4gICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgKi9cbiAgICBnZXREZXRhaWxVcGRhdGVQcm9maWxlKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gbmV3IEVtcGxveWVlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBFbXBsb3llZUVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBzZXJ2aWNlLmdldERldGFpbFVwZGF0ZVByb2ZpbGUoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgZGV0YWlsIGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE4XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBnZXREZXRhaWwocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgRW1wbG95ZWVTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IEVtcGxveWVlRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0RGV0YWlsKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGFjdGlvblxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDExLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGFzeW5jIHNhdmVVcGRhdGVQcm9maWxlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IEVtcGxveWVlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBFbXBsb3llZUVudGl0eSgpLCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBsZXQgdmFsaWRhdGUgPSBuZXcgRW1wbG95ZWVVcGRhdGVQcm9maWxlVmFsaWRhdGUoKTtcblxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoZW50aXR5LmJpcnRoZGF5KSkge1xuICAgICAgICAgICAgICAgIGVudGl0eS5iaXJ0aGRheSA9IExpYnMuY29udmVydFN0cjJEYXRlVjAxKGVudGl0eS5iaXJ0aGRheSwgXCJkZC9tbS95eXl5XCIsIFwiL1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGVycm9ycyA9IGF3YWl0IHZhbGlkYXRlLkZMVmFsaWRhdGlvbkFsbChlbnRpdHkpO1xuICAgICAgICAgICAgaWYgKGVycm9ycyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JzLnZhbGlkYXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBcIlwiLCBlcnJvcnMsIDApKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKHBvc3REYXRhLmZpbGVfdXBsb2FkKSkge1xuICAgICAgICAgICAgICAgIHZhciBiYXNlNjRTdHJpbmcgPSBwb3N0RGF0YS5maWxlX3VwbG9hZDtcbiAgICAgICAgICAgICAgICB2YXIgYmFzZTY0TWltZVR5cGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKGJhc2U2NFN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZTY0TWltZVR5cGUgPSBMaWJzLmJhc2U2NE1pbWVUeXBlKGJhc2U2NFN0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKGJhc2U2NE1pbWVUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV4dCA9IGJhc2U2NE1pbWVUeXBlLnJlcGxhY2UoJ2ltYWdlLycsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDb25zdGFudHMuZGF0YS5hbGxvd0ltYWdlLmluZGV4T2YoZXh0KSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHNlbGYuY3JlYXRlSnNvbkltYWdlRXJyb3JNZXNzYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBzZWxmLmNyZWF0ZUpzb25JbWFnZUVycm9yTWVzc2FnZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IGltYWdlRmlsZU5hbWUgPSBhd2FpdCBzZWxmLndyaXRlRmlsZVVwbG9hZChiYXNlNjRTdHJpbmcsIGVudGl0eS5maWxlX25hbWUsIHBvc3REYXRhLmlzb19jb2RlLCAnNDIweDMyMCcsIDQyMCwgMzIwKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWltYWdlRmlsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9GQUlMJyksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LmF2YXRhciA9IGltYWdlRmlsZU5hbWU7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlcnZpY2UudXBkYXRlUHJvZmlsZShlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5VUERBVEVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9TVUNDRVNTJyksIGVudGl0eSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlcnJvciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICogTMawdSBmaWxlIGdhbGxlcnlcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYmFzZTY0U3RyaW5nIFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbnRpdHkgXG4gICAgICogQFJldHVybiB0cuG6oyB24buBIGZpbGUgbmFtZSBiYW8gZ+G7k20gZm9sZGVyIG7hur91IGzGsHUgZmlsZSB0aMOgbmggY8O0bmcsIG5nxrDhu6NjIGzhuqFpIHRy4bqjIHbhu4EgZmFsc2VcbiAgICAgKi9cbiAgICBhc3luYyB3cml0ZUZpbGVVcGxvYWQoYmFzZTY0U3RyaW5nLCBuYW1lSW1nLCB0aHVtYm5haWwgPSBudWxsLCB3ID0gbnVsbCwgaCA9IG51bGwpIHtcbiAgICAgICAgaWYgKExpYnMuaXNCbGFuayhiYXNlNjRTdHJpbmcpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHZhciBiYXNlNjRNaW1lVHlwZSA9IExpYnMuYmFzZTY0TWltZVR5cGUoYmFzZTY0U3RyaW5nKTtcbiAgICAgICAgaWYgKExpYnMuaXNCbGFuayhiYXNlNjRNaW1lVHlwZSkpIHJldHVybiB0cnVlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgICAgICAgICB2YXIgZXh0ID0gYmFzZTY0TWltZVR5cGUucmVwbGFjZSgnaW1hZ2UvJywgJycpO1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBiYXNlNjRTdHJpbmcucmVwbGFjZShcImRhdGE6XCIgKyBiYXNlNjRNaW1lVHlwZSArIFwiO2Jhc2U2NCxcIiwgJycpO1xuICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGRhdGEsICdiYXNlNjQnKTtcblxuICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gJyc7XG4gICAgICAgICAgICBsZXQgY3VyRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB2YXIgY3VyTmFtZSA9IG5hbWVJbWcuc3Vic3RyKDAsIG5hbWVJbWcubGFzdEluZGV4T2YoJy4nKSk7XG4gICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGN1ck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZmlsZU5hbWUgPSBEYXRlLnBhcnNlKGN1ckRhdGUpICsgJy4nICsgZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IGN1ck5hbWUgKyAnLScgKyBEYXRlLnBhcnNlKGN1ckRhdGUpICsgJy4nICsgZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB2YXIgZmlsZVVybCA9IG5vdy5nZXRGdWxsWWVhcigpICsgXCIvXCIgKyAobm93LmdldE1vbnRoKCkgKyAxKTtcbiAgICAgICAgICAgIHZhciBpbWFnZVVwbG9hZCA9IHBhdGguam9pbihDb25zdGFudHMuZGF0YS51cGxvYWRzX3JlcywgZmlsZVVybCk7XG5cbiAgICAgICAgICAgIC8vIEtp4buDbSB0cmEgZmlsZSDEkcOjIHThu5NuIHThuqFpLCBjw7MgdGjDrCB4w7NhXG4gICAgICAgICAgICBpZiAoTGlicy5jaGVja0ZpbGVFeGl0cyhpbWFnZVVwbG9hZCwgZmlsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgTGlicy5yZW1vdmVGaWxlKGltYWdlVXBsb2FkLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRyxrDhu51uZyBo4bujcCBraMO0bmcgdOG7k24gdOG6oWkgdGjGsCBt4bulYyBz4bq9IHThuqFvIHRoxrAgbeG7pWMgxJHDs1xuICAgICAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGltYWdlVXBsb2FkKSkge1xuICAgICAgICAgICAgICAgIGZzLm1rZGlyU3luYyhpbWFnZVVwbG9hZCwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRo4buxYyBoaeG7h24gdmnhu4djIHVwbG9hZCBow6xuaCDhuqNuaFxuICAgICAgICAgICAgbGV0IHVwbG9hZCA9IExpYnMudXBsb2FkRmlsZShpbWFnZVVwbG9hZCwgZmlsZU5hbWUsIGJ1ZmZlcik7XG4gICAgICAgICAgICAvLyBUcsaw4budbmcgaOG7o3AgdXBsb2FkIOG6o25oIGLhu4sgbOG7l2lcbiAgICAgICAgICAgIGlmICghdXBsb2FkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuY29uc29sZS5lcnJvcihpMThuLl9fKCdtc2dfZXJyX2ZpbGVfdXBsb2FkJykpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRodW1ibmFpbFxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsodykgJiYgIUxpYnMuaXNCbGFuayhoKSAmJiAhTGlicy5pc0JsYW5rKHRodW1ibmFpbCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gcGF0aC5qb2luKENvbnN0YW50cy5kYXRhLnVwbG9hZHNfcmVzLCBmaWxlVXJsLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgdmFyIGRlc1BhdGggPSBub3cuZ2V0RnVsbFllYXIoKSArIFwiL1wiICsgKG5vdy5nZXRNb250aCgpICsgMSk7XG4gICAgICAgICAgICAgICAgTGlicy51cGxvYWRSZXNpemVJbWFnZShzb3VyY2UsIHBhdGguam9pbihDb25zdGFudHMuZGF0YS51cGxvYWRzX3JlcywgdGh1bWJuYWlsLCBkZXNQYXRoKSwgZmlsZU5hbWUsIDg1LCB3LCBoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHBhdGguam9pbihub3cuZ2V0RnVsbFllYXIoKSArIFwiL1wiICsgKG5vdy5nZXRNb250aCgpICsgMSksIGZpbGVOYW1lKTtcblxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZSBqc29uIGltYWdlIGVycm9yIG1lc3NhZ2VcbiAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgKiBAc2luY2UgMjYvMDcvMjAxOFxuICAgICovXG4gICAgY3JlYXRlSnNvbkltYWdlRXJyb3JNZXNzYWdlKCkge1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGkxOG4uX18oJ3R5cGVfaW1hZ2UnKTtcbiAgICAgICAgbGV0IGxhYmVsID0gaTE4bi5fXygncG9zdHMuaW1hZ2UnKTtcbiAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIG1lc3NhZ2UucmVwbGFjZShcIiQ8MT5cIiwgbGFiZWwpLCB7fSwgMCk7XG4gICAgICAgIHJldHVybiByZXNEYXRhO1xuICAgIH1cblxuXG5cblxuICAgIC8qKlxuICAgICAqIGFjdGlvbiBjaGFuZ2UgcGFzc3dvcmRcbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXMgXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGNoYW5nZVBhc3N3b3JkKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IEVtcGxveWVlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBFbXBsb3llZUVudGl0eSgpLCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBsZXQgdmFsaWRhdGUgPSBuZXcgRW1wbG95ZWVDaGFuZ2VQYXNzV29yZFZhbGlkYXRlKCk7XG5cbiAgICAgICAgICAgIHZhbGlkYXRlLnZhbGlkYXRpb25BbGwocG9zdERhdGEsIGFzeW5jIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgXCJcIiwgZXJyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIEtp4buDbSB0cmEgbmjhuq1wIG3huq10IGto4bqpdSBjxakgY8OzIMSRw7puZyBraMO0bmc/XG4gICAgICAgICAgICAgICAgICAgIGxldCBlbXBsb3llZUV4aXN0ID0gYXdhaXQgc2VydmljZS5jaGVja0VtcGxveWVlRXhpc3QoZW50aXR5KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKExpYnMuaXNPYmplY3RFbXB0eShlbXBsb3llZUV4aXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIG51bGwsIExpYnMuYnVpbGRQYXRoVmFsaWRhdGVNZXNzYWdlKFwiaWRcIiwgaTE4bi5fXyhcImVtcGxveWVlLmVtcGxveWVlX25vdF9leGlzdFwiKSksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBLaeG7g20gdHJhIG3huq10IGto4bqpdSBjxakgY8OzIMSRw7puZyBraMO0bmdcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZF9wYXNzd29yZCA9IExpYnMuZGVjb2RlUGFzc1dvcmQoZW1wbG95ZWVFeGlzdC5wYXNzd29yZCwgZW1wbG95ZWVFeGlzdC5zYWx0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9sZF9wYXNzd29yZCAhPSBwb3N0RGF0YS5jdXJyZW50X3Bhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBudWxsLCBMaWJzLmJ1aWxkUGF0aFZhbGlkYXRlTWVzc2FnZShcImN1cnJlbnRfcGFzc3dvcmRcIiwgaTE4bi5fXyhcImVtcGxveWVlLnBhc3N3b3JkX25vdF9leGlzdFwiKSksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBzYWx0ID0gTGlicy5TSEEzKExpYnMuZ2VuZXJhdGVTdHJSYW5kb20oMjQpKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhc3N3b3JkID0gTGlicy5lbmNvZGVQYXNzV29yZChwb3N0RGF0YS5wYXNzd29yZCwgc2FsdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LnBhc3N3b3JkID0gcGFzc3dvcmQ7XG4gICAgICAgICAgICAgICAgICAgIGVudGl0eS5zYWx0ID0gc2FsdDtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ+G6rXAgbmjhuq10IG3huq10IGto4bqpdSBt4bubaVxuICAgICAgICAgICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGVudGl0eS5wYXNzd29yZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdORVdfUEFTU1dPUkRfSU5DT1JSRUNUJyksIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgdXBkYXRlUGFzc3dvcmQgPSBhd2FpdCBzZXJ2aWNlLnVwZGF0ZUVtcGxveWVlUGFzc3dvcmQoZW50aXR5KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXVwZGF0ZVBhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJST1JfQ0hBTkdFX1BBU1NXT1JEJyksIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUycpLCBlbnRpdHksIDEpO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX0xPR0lOJyksIGUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBhY3Rpb25cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBhc3luYyBzYXZlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IEVtcGxveWVlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBFbXBsb3llZUVudGl0eSgpLCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBsZXQgdmFsaWRhdGUgPSBuZXcgRW1wbG95ZWVWYWxpZGF0ZShlbnRpdHkpO1xuXG4gICAgICAgICAgICBpZiAoIUxpYnMuaXNCbGFuayhlbnRpdHkuYmlydGhkYXkpKSB7XG4gICAgICAgICAgICAgICAgZW50aXR5LmJpcnRoZGF5ID0gTGlicy5jb252ZXJ0U3RyMkRhdGVWMDEoZW50aXR5LmJpcnRoZGF5LCBcImRkL21tL3l5eXlcIiwgXCIvXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZXJyb3JzID0gYXdhaXQgdmFsaWRhdGUuRkxWYWxpZGF0aW9uQWxsKGVudGl0eSk7XG4gICAgICAgICAgICBpZiAoZXJyb3JzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBlcnJvcnMudmFsaWRhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIFwiXCIsIGVycm9ycywgMCkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsocG9zdERhdGEuZmlsZV91cGxvYWQpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJhc2U2NFN0cmluZyA9IHBvc3REYXRhLmZpbGVfdXBsb2FkO1xuICAgICAgICAgICAgICAgIHZhciBiYXNlNjRNaW1lVHlwZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoYmFzZTY0U3RyaW5nKSkge1xuICAgICAgICAgICAgICAgICAgICBiYXNlNjRNaW1lVHlwZSA9IExpYnMuYmFzZTY0TWltZVR5cGUoYmFzZTY0U3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoYmFzZTY0TWltZVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXh0ID0gYmFzZTY0TWltZVR5cGUucmVwbGFjZSgnaW1hZ2UvJywgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENvbnN0YW50cy5kYXRhLmFsbG93SW1hZ2UuaW5kZXhPZihleHQpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0gc2VsZi5jcmVhdGVKc29uSW1hZ2VFcnJvck1lc3NhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHNlbGYuY3JlYXRlSnNvbkltYWdlRXJyb3JNZXNzYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgaW1hZ2VGaWxlTmFtZSA9IGF3YWl0IHNlbGYud3JpdGVGaWxlVXBsb2FkKGJhc2U2NFN0cmluZywgZW50aXR5LmZpbGVfbmFtZSwgJycsIG51bGwsIG51bGwpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghaW1hZ2VGaWxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5TQVZFX0ZBSUwnKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBlbnRpdHkuYXZhdGFyID0gaW1hZ2VGaWxlTmFtZTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQXJyYXlEYXRhKGVudGl0eS5yb2xlX2RhdGEpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnZW1wbG95ZWUucm9sZV9kYXRhJyksIGVudGl0eSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZW50aXR5Lmhhc093blByb3BlcnR5KCdzY3JlZW5fbW9kZScpICYmIGVudGl0eS5zY3JlZW5fbW9kZSA9PSBDb25zdGFudHMuc2NyZWVuX21vZGUuaW5zZXJ0KSB7XG4gICAgICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBFbXBsb3llZUVtYWlsRXhpc3QgPSBzZXJ2aWNlLmNoZWNrRW1wbG95ZWVFeGlzdEJ5RW1haWwuc3luYyhudWxsLCBlbnRpdHkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIUxpYnMuaXNPYmplY3RFbXB0eShFbXBsb3llZUVtYWlsRXhpc3QpICYmIEVtcGxveWVlRW1haWxFeGlzdC5lbWFpbCA9PSBlbnRpdHkuZW1haWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBudWxsLCBMaWJzLmJ1aWxkUGF0aFZhbGlkYXRlTWVzc2FnZShcImVtYWlsXCIsIGkxOG4uX18oXCJlbXBsb3llZS5leGlzdF9lbWFpbFwiKSksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgc2FsdCA9IExpYnMuU0hBMyhMaWJzLmdlbmVyYXRlU3RyUmFuZG9tKDI0KSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXNzd29yZCA9IExpYnMuZW5jb2RlUGFzc1dvcmQocG9zdERhdGEucGFzc3dvcmQsIHNhbHQpO1xuICAgICAgICAgICAgICAgICAgICBlbnRpdHkucGFzc3dvcmQgPSBwYXNzd29yZDtcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LnNhbHQgPSBzYWx0O1xuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmluc2VydEVtcGxveWVlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5TQVZFX1NVQ0NFU1MnKSwgZW50aXR5LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5TQVZFX0ZBSUwnKSwgeyBcImVycm9yXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChlbnRpdHkuaGFzT3duUHJvcGVydHkoJ3NjcmVlbl9tb2RlJykgJiYgZW50aXR5LnNjcmVlbl9tb2RlID09IENvbnN0YW50cy5zY3JlZW5fbW9kZS51cGRhdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIUxpYnMuaXNCbGFuayhwb3N0RGF0YS5wYXNzd29yZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNhbHQgPSBMaWJzLlNIQTMoTGlicy5nZW5lcmF0ZVN0clJhbmRvbSgyNCkpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFzc3dvcmQgPSBMaWJzLmVuY29kZVBhc3NXb3JkKHBvc3REYXRhLnBhc3N3b3JkLCBzYWx0KTtcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LnBhc3N3b3JkID0gcGFzc3dvcmQ7XG4gICAgICAgICAgICAgICAgICAgIGVudGl0eS5zYWx0ID0gc2FsdDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZXJ2aWNlLnVwZGF0ZUVtcGxveWVlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9TVUNDRVNTJyksIGVudGl0eSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFNhdmUgYWN0aW9uXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgdXBkYXRlU3RhdHVzKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IEVtcGxveWVlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBFbXBsb3llZUVudGl0eSgpLCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBlbnRpdHkuc3RhdHVzID0gKCFlbnRpdHkuc3RhdHVzIHx8IGVudGl0eS5zdGF0dXMgPT0gLTEpID8gMCA6IDE7XG5cbiAgICAgICAgICAgIGlmIChMaWJzLmlzQmxhbmsoZW50aXR5LmlkKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiTk9UX0VYSVNUXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBTeW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLnVwZGF0ZVN0YXR1cyhlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5VUERBVEVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5VUERBVEVfU1VDQ0VTUycpLCBlbnRpdHksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZXJyb3IgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgTGlzdCBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTAvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7fSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBnZXRMaXN0KHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IEVtcGxveWVlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBFbXBsb3llZUVudGl0eSgpLCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBzZXJ2aWNlLmdldExpc3QoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0U2l6ZShlbnRpdHksIGZ1bmN0aW9uIChlcnIxLCByczEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXJyMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgcnMxLnRvdGFsUm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihcIkzhu5dpOiBcIiArIGUpO1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBMaXN0IGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMC8wNy8yMDE5XG4gICAgICogQHBhcmFtIHt9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldExpc3RQcm9qZWN0Q29uZmlnTWFpbChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBFbXBsb3llZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgRW1wbG95ZWVFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXRMaXN0UHJvamVjdENvbmZpZ01haWwoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0U2l6ZShlbnRpdHksIGZ1bmN0aW9uIChlcnIxLCByczEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXJyMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgcnMxLnRvdGFsUm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihcIkzhu5dpOiBcIiArIGUpO1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBMaXN0IGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMC8wNy8yMDE5XG4gICAgICogQHBhcmFtIHt9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldExpc3RBbGwocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgRW1wbG95ZWVTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IEVtcGxveWVlRW50aXR5KCksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0TGlzdEFsbChlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihcIkzhu5dpOiBcIiArIGUpO1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIERlbGV0ZSBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOFxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZGVsZXRlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IEVtcGxveWVlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBFbXBsb3llZUVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGVudGl0eS5pZCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIk5PVF9FWElTVFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlcnZpY2UuZGVsZXRlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uREVMRVRFX1NVQ0NFU1MnKSwgZW50aXR5LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfRkFJTCcpLCB7fSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uREVMRVRFX0ZBSUwnKSwge30sIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFNhdmUgYWN0aW9uXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgIHVwZGF0ZVN0YXR1c01haWxDb25maWcocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgRW1wbG95ZWVTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IEVtcGxveWVlRW50aXR5KCksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIFN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlcnZpY2UudXBkYXRlU3RhdHVzTWFpbENvbmZpZyhlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5VUERBVEVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5VUERBVEVfU1VDQ0VTUycpLCBlbnRpdHksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZXJyb3IgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZXhwb3J0IGRlZmF1bHQgRW1wbG95ZWVDb250cm9sbGVyOyJdfQ==