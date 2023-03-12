import AbstractManagerController from '../core/AbstractManagerController';
import ProjectEntity from '../entities/ProjectEntity';
import ProjectService from '../services/ProjectService';
import ProjectValidate from '../validator/ProjectValidate';
import Sync from 'sync';

class ProjectController extends AbstractManagerController {

    /**
     * @description Get List item
     * @author Long.Pham
     * @since 10/07/2019
     * @param {} res 
     * @param {*} postData 
     */
    getList(res, postData) {
        try {
            let service = new ProjectService();
            let entity = new ProjectEntity();
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
    getDetail(res, postData) {
        try {
            var service = new ProjectService();
            let entity = new ProjectEntity();
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
     * @description Get detail item
     * @author Long.Pham
     * @since 11/07/2019
     * @param {*} res 
     * @param {*} postData 
     */
     getDetailConfig(res, postData) {
        try {
            var service = new ProjectService();
            let entity = new ProjectEntity();
            entity = Object.assign({}, entity, postData);
            service.getDetailConfig(entity, function (err, rs) {
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
    deleteAction(res, postData) {
        try {
            let service = new ProjectService();
            let entity = new ProjectEntity();
            entity = Object.assign({}, entity, postData);
            if (Libs.isBlank(entity.id)) {
                var resData = {};
                resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                res.send(resData);
                return;
            }
            Sync(function () {
                service.delete(entity, function (err, rsupdate) {
                    try {
                        if (!rsupdate) {
                            let resData = Libs.returnJsonResult(false, i18n.__('ACTION.DELETE_FAIL'), { "error": err }, 0);
                            res.send(resData);
                            return;
                        }
                        let resData = Libs.returnJsonResult(true, i18n.__('ACTION.DELETE_SUCCESS'), entity, 0);
                        res.send(resData);
                    } catch (error) {
                        let resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                        res.send(resData);
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
    updateStatus(res, postData) {
        try {
            let service = new ProjectService();
            let entity = Object.assign({}, new ProjectEntity(), postData);
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
     * @description Save action
     * @author Long.Pham
     * @since 11/07/2019
     * @param {*} res 
     * @param {*} postData 
     */
    async saveAction(res, postData) {
        try {
            let self = this;
            let service = new ProjectService();
            let entity = Object.assign({}, new ProjectEntity(), postData);
            entity.status = (!entity.status || entity.status == -1) ? 0 : 1;
            let validate = new ProjectValidate();

            let errors = await validate.FLValidationAll(entity);
            if (errors != null) {
                errors.validate = false;
                res.send(Libs.returnJsonResult(false, "", errors, 0));
                return;
            }

            if (!Libs.isBlank(entity.commisioning_date)) {
                entity.commisioning_date = Libs.convertStr2DateV01(entity.commisioning_date, "dd/mm/yyyy", "/");
            }

            if (!Libs.isBlank(entity.installed_date)) {
                entity.installed_date = Libs.convertStr2DateV01(entity.installed_date, "dd/mm/yyyy", "/");
            }

            if (!Libs.isBlank(entity.last_updated)) {
                entity.last_updated = Libs.convertStr2DateV01(entity.last_updated, "dd/mm/yyyy", "/");
            }


            if (!Libs.isBlank(postData.upload_thumbnail)) {
                let base64String = postData.upload_thumbnail;
                let base64MimeType = null;
                if (!Libs.isBlank(base64String)) {
                    base64MimeType = Libs.base64MimeType(base64String);
                    if (!Libs.isBlank(base64MimeType)) {
                        let ext = base64MimeType.replace('image/', '');
                        if (Constants.data.allowImage.indexOf(ext) === -1) {
                            let resData = self.createJsonImageErrorMessage();
                            res.send(resData);
                            return;
                        }
                    } else {
                        let resData = self.createJsonImageErrorMessage();
                        res.send(resData);
                        return;
                    }
                    var imageFileName = await self.writeFileUpload(base64String, postData.upload_thumbnail_name, null, null, null);
                    if (!imageFileName) {
                        let resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                        res.send(resData);
                        return;
                    }

                    entity.thumbnail = imageFileName;
                }
            }

            if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                var time = new Date().getTime();
                entity.hash_id = Libs.md5(time.toString()).toLowerCase();

                if(Libs.isObjectEmpty(entity.hash_id)){
                    let resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                    res.send(resData);
                    return;
                }
                Sync(function () {
                    service.insertProject(entity, function (err, rs) {
                        if (rs && err) {
                            let resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                            res.send(resData);
                        } else {
                            let resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                            res.send(resData);
                        }
                    });
                });
            } else if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                service.updateProject(entity, function (err, rs) {
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
     async saveConfigAction(res, postData) {
        try {
            let service = new ProjectService();
            let entity = Object.assign({}, new ProjectEntity(), postData);
            
            var dataConfigRevenue = postData.dataConfigRevenue;
            if(Libs.isArrayData(dataConfigRevenue)){
                for( var i = 0, len = dataConfigRevenue.length; i < len; i++){
                    dataConfigRevenue[i].start_date = Libs.convertStr2DateV01(dataConfigRevenue[i].start_date, "dd/mm/yyyy", "/");
                    dataConfigRevenue[i].end_date = Libs.convertStr2DateV01(dataConfigRevenue[i].end_date, "dd/mm/yyyy", "/");
                }
            }

            if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                service.updateProjectConfig(entity, function (err, rs) {
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
     async saveMoveDevice(res, postData) {
        try {
            let service = new ProjectService();
            let entity = Object.assign({}, new ProjectEntity(), postData);
            
            var dataList = postData.dataList;
            if(!Libs.isArrayData(dataList)){
                let resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                res.send(resData);
            }

            if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                service.saveMoveDevice(entity, function (err, rs) {
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
     async saveConfigEstimationSensor(res, postData) {
        try {
            let service = new ProjectService();
            let entity = Object.assign({}, new ProjectEntity(), postData);
            

            if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                service.saveConfigEstimationSensor(entity, function (err, rs) {
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
            var fileUrl =  now.getFullYear() + "/" + (now.getMonth() + 1);
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
	 * @description Get all
	 * @author Long.Pham
	 * @since 10/07/2019
	 * @param {} res 
	 * @param {*} postData 
	 */
     getDropDownList(res, postData) {
        try {
            let service = new ProjectService();
            let entity = new ProjectEntity();
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

}
export default ProjectController;