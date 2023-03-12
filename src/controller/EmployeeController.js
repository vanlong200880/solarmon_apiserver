import BaseController from '../core/BaseController';
import EmployeeService from '../services/EmployeeService';
import EmployeeForgotPasswordValidate from '../validator/EmployeeForgotPasswordValidate';
import EmplyeeResetPasswordValidate from '../validator/EmplyeeResetPasswordValidate';
import EmployeeUpdateProfileValidate from '../validator/EmployeeUpdateProfileValidate';
import EmployeeChangePassWordValidate from '../validator/EmployeeChangePassWordValidate';
import EmployeeValidate from '../validator/EmployeeValidate';
import EmployeeEntity from '../entities/EmployeeEntity';
import Sync from 'sync';

class EmployeeController extends BaseController {
    constructor() {
        super();
    }

    /**
     * action change password
     * @author Long.Pham
     * @param {Object} res 
     * @param {Object} postData 
     */

    forgotPassword(res, postData) {
        try {
            var service = new EmployeeService();
            let entity = new EmployeeEntity();
            entity = Object.assign({}, entity, postData);
            service.checkEmployeeForgotPassword(entity, function (err, rs) {
                var resData = {};
                if (rs) {
                    // Gui mail reset mat khau
                    var arr = {
                        id: rs.id,
                        email: rs.email,
                        exp: Math.floor(Date.now() / 1000) + (60 * 60), // het han sau 1h
                    }

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
    resetPassword(res, postData) {
        try {
            let service = new EmployeeService();
            let entity = Object.assign({}, new EmployeeEntity(), postData);
            let validate = new EmplyeeResetPasswordValidate();

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

                    let salt = Libs.SHA3(Libs.generateStrRandom(24));
                    let password = Libs.encodePassWord(postData.password, salt);
                    userE.password = password;
                    userE.salt = salt;

                    let updatePassword = await service.resetPassword(userE);

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
    getDetailUpdateProfile(res, postData) {
        try {
            var service = new EmployeeService();
            let entity = new EmployeeEntity();
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
    getDetail(res, postData) {
        try {
            var service = new EmployeeService();
            let entity = new EmployeeEntity();
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
    async saveUpdateProfileAction(res, postData) {
        try {
            let service = new EmployeeService();
            let self = this;
            let entity = Object.assign({}, new EmployeeEntity(), postData);
            let validate = new EmployeeUpdateProfileValidate();

            if (!Libs.isBlank(entity.birthday)) {
                entity.birthday = Libs.convertStr2DateV01(entity.birthday, "dd/mm/yyyy", "/");
            }

            let errors = await validate.FLValidationAll(entity);
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
                        let ext = base64MimeType.replace('image/', '');
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
                    let imageFileName = await self.writeFileUpload(base64String, entity.file_name, postData.iso_code, '420x320', 420, 320);

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
                        let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                        res.send(resData);
                        return;
                    }
                    let resData = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                    res.send(resData);
                } catch (error) {
                    let resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                    res.send(resData);
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
    async writeFileUpload(base64String, nameImg, thumbnail = null, w = null, h = null) {
        if (Libs.isBlank(base64String)) return false;
        var base64MimeType = Libs.base64MimeType(base64String);
        if (Libs.isBlank(base64MimeType)) return true;
        try {
            var path = require('path');
            var ext = base64MimeType.replace('image/', '');
            let data = base64String.replace("data:" + base64MimeType + ";base64,", '');
            let buffer = Buffer.from(data, 'base64');

            var fileName = '';
            let curDate = new Date();
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
            let upload = Libs.uploadFile(imageUpload, fileName, buffer);
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
    createJsonImageErrorMessage() {
        let message = i18n.__('type_image');
        let label = i18n.__('posts.image');
        var resData = Libs.returnJsonResult(false, message.replace("$<1>", label), {}, 0);
        return resData;
    }




    /**
     * action change password
     * @author Long.Pham
     * @param {Object} res 
     * @param {Object} postData 
     */
    changePassword(res, postData) {
        try {
            let service = new EmployeeService();
            let entity = Object.assign({}, new EmployeeEntity(), postData);
            let validate = new EmployeeChangePassWordValidate();

            validate.validationAll(postData, async function (err) {
                try {
                    if (err) {
                        var resData = Libs.returnJsonResult(false, "", err, 0);
                        res.send(resData);
                        return;
                    }
                    // Kiểm tra nhập mật khẩu cũ có đúng không?
                    let employeeExist = await service.checkEmployeeExist(entity);
                    if (Libs.isObjectEmpty(employeeExist)) {
                        var resData = Libs.returnJsonResult(false, null, Libs.buildPathValidateMessage("id", i18n.__("employee.employee_not_exist")), 0);
                        res.send(resData);
                        return;
                    }

                    // Kiểm tra mật khẩu cũ có đúng không
                    let old_password = Libs.decodePassWord(employeeExist.password, employeeExist.salt);
                    if (old_password != postData.current_password) {
                        resData = Libs.returnJsonResult(false, null, Libs.buildPathValidateMessage("current_password", i18n.__("employee.password_not_exist")), 0);
                        res.send(resData);
                        return;
                    }


                    let salt = Libs.SHA3(Libs.generateStrRandom(24));
                    let password = Libs.encodePassWord(postData.password, salt);

                    entity.password = password;
                    entity.salt = salt;
                    // Cập nhật mật khẩu mới
                    if (Libs.isBlank(entity.password)) {
                        var resData = Libs.returnJsonResult(false, i18n.__('NEW_PASSWORD_INCORRECT'), "");
                        res.send(resData);
                        return;
                    }

                    let updatePassword = await service.updateEmployeePassword(entity);

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
    async saveAction(res, postData) {
        try {
            let self = this;
            let service = new EmployeeService();
            let entity = Object.assign({}, new EmployeeEntity(), postData);
            let validate = new EmployeeValidate(entity);

            if (!Libs.isBlank(entity.birthday)) {
                entity.birthday = Libs.convertStr2DateV01(entity.birthday, "dd/mm/yyyy", "/");
            }

            let errors = await validate.FLValidationAll(entity);
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
                        let ext = base64MimeType.replace('image/', '');
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
                    let imageFileName = await self.writeFileUpload(base64String, entity.file_name, '', null, null);

                    if (!imageFileName) {
                        var resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                        res.send(resData);
                        return;
                    }

                    entity.avatar = imageFileName;

                }
            }

            if (!Libs.isArrayData(entity.role_data)) {
                let resData = Libs.returnJsonResult(true, i18n.__('employee.role_data'), entity, 0);
                res.send(resData);
                return;
            }

            if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                Sync(function () {
                    let EmployeeEmailExist = service.checkEmployeeExistByEmail.sync(null, entity);
                    if (!Libs.isObjectEmpty(EmployeeEmailExist) && EmployeeEmailExist.email == entity.email) {
                        let resData = Libs.returnJsonResult(false, null, Libs.buildPathValidateMessage("email", i18n.__("employee.exist_email")), 0);
                        res.send(resData);
                        return;
                    }

                    let salt = Libs.SHA3(Libs.generateStrRandom(24));
                    let password = Libs.encodePassWord(postData.password, salt);
                    entity.password = password;
                    entity.salt = salt;
                    service.insertEmployee(entity, function (err, rs) {
                        if (rs) {
                            let resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                            res.send(resData);
                        } else {
                            let resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                            res.send(resData);
                        }
                    });

                });

            } else if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                if (!Libs.isBlank(postData.password)) {
                    let salt = Libs.SHA3(Libs.generateStrRandom(24));
                    let password = Libs.encodePassWord(postData.password, salt);
                    entity.password = password;
                    entity.salt = salt;
                }

                service.updateEmployee(entity, function (err, rs) {
                    if (rs) {
                        let resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                        res.send(resData);
                    } else {
                        let resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                        res.send(resData);
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
    updateStatus(res, postData) {
        try {
            let service = new EmployeeService();
            let entity = Object.assign({}, new EmployeeEntity(), postData);
            entity.status = (!entity.status || entity.status == -1) ? 0 : 1;

            if (Libs.isBlank(entity.id)) {
                var resData = {};
                resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                res.send(resData);
                return;
            }

            Sync(function () {
                service.updateStatus(entity, function (err, rsupdate) {
                    try {
                        if (!rsupdate) {
                            let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                            res.send(resData);
                            return;
                        }
                        let resData = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                        res.send(resData);
                    } catch (error) {
                        let resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                        res.send(resData);
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
    getList(res, postData) {
        try {
            let service = new EmployeeService();
            let entity = Object.assign({}, new EmployeeEntity(), postData);
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
    getListProjectConfigMail(res, postData) {
        try {
            let service = new EmployeeService();
            let entity = Object.assign({}, new EmployeeEntity(), postData);
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
    getListAll(res, postData) {
        try {
            let service = new EmployeeService();
            let entity = Object.assign({}, new EmployeeEntity(), postData);
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
    deleteAction(res, postData) {
        try {
            let service = new EmployeeService();
            let entity = new EmployeeEntity();
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
     updateStatusMailConfig(res, postData) {
        try {
            let service = new EmployeeService();
            let entity = Object.assign({}, new EmployeeEntity(), postData);
            Sync(function () {
                service.updateStatusMailConfig(entity, function (err, rsupdate) {
                    try {
                        if (!rsupdate) {
                            let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                            res.send(resData);
                            return;
                        }
                        let resData = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                        res.send(resData);
                    } catch (error) {
                        let resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                        res.send(resData);
                    }
                });
            });

        } catch (e) {
            var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }


}
export default EmployeeController;