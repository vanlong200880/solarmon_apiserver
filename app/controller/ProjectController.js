'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractManagerController = require('../core/AbstractManagerController');

var _AbstractManagerController2 = _interopRequireDefault(_AbstractManagerController);

var _ProjectEntity = require('../entities/ProjectEntity');

var _ProjectEntity2 = _interopRequireDefault(_ProjectEntity);

var _ProjectService = require('../services/ProjectService');

var _ProjectService2 = _interopRequireDefault(_ProjectService);

var _ProjectValidate = require('../validator/ProjectValidate');

var _ProjectValidate2 = _interopRequireDefault(_ProjectValidate);

var _sync = require('sync');

var _sync2 = _interopRequireDefault(_sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProjectController = function (_AbstractManagerContr) {
    _inherits(ProjectController, _AbstractManagerContr);

    function ProjectController() {
        _classCallCheck(this, ProjectController);

        return _possibleConstructorReturn(this, (ProjectController.__proto__ || Object.getPrototypeOf(ProjectController)).apply(this, arguments));
    }

    _createClass(ProjectController, [{
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
                var service = new _ProjectService2.default();
                var entity = new _ProjectEntity2.default();
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
                var service = new _ProjectService2.default();
                var entity = new _ProjectEntity2.default();
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

    }, {
        key: 'getDetailConfig',
        value: function getDetailConfig(res, postData) {
            try {
                var service = new _ProjectService2.default();
                var entity = new _ProjectEntity2.default();
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

    }, {
        key: 'deleteAction',
        value: function deleteAction(res, postData) {
            try {
                var service = new _ProjectService2.default();
                var entity = new _ProjectEntity2.default();
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
                var service = new _ProjectService2.default();
                var entity = Object.assign({}, new _ProjectEntity2.default(), postData);
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
                var service = new _ProjectService2.default();
                var entity = Object.assign({}, new _ProjectEntity2.default(), postData);
                entity.status = !entity.status || entity.status == -1 ? 0 : 1;
                var validate = new _ProjectValidate2.default();

                var errors = await validate.FLValidationAll(entity);
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
                    var time = new Date().getTime();
                    entity.hash_id = Libs.md5(time.toString()).toLowerCase();

                    if (Libs.isObjectEmpty(entity.hash_id)) {
                        var _resData10 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                        res.send(_resData10);
                        return;
                    }
                    (0, _sync2.default)(function () {
                        service.insertProject(entity, function (err, rs) {
                            if (rs && err) {
                                var _resData11 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                                res.send(_resData11);
                            } else {
                                var _resData12 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                                res.send(_resData12);
                            }
                        });
                    });
                } else if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                    service.updateProject(entity, function (err, rs) {
                        if (rs) {
                            var _resData13 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                            res.send(_resData13);
                        } else {
                            var _resData14 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                            res.send(_resData14);
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
        key: 'saveConfigAction',
        value: async function saveConfigAction(res, postData) {
            try {
                var service = new _ProjectService2.default();
                var entity = Object.assign({}, new _ProjectEntity2.default(), postData);

                var dataConfigRevenue = postData.dataConfigRevenue;
                if (Libs.isArrayData(dataConfigRevenue)) {
                    for (var i = 0, len = dataConfigRevenue.length; i < len; i++) {
                        dataConfigRevenue[i].start_date = Libs.convertStr2DateV01(dataConfigRevenue[i].start_date, "dd/mm/yyyy", "/");
                        dataConfigRevenue[i].end_date = Libs.convertStr2DateV01(dataConfigRevenue[i].end_date, "dd/mm/yyyy", "/");
                    }
                }

                if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                    service.updateProjectConfig(entity, function (err, rs) {
                        if (rs) {
                            var _resData15 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                            res.send(_resData15);
                        } else {
                            var _resData16 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                            res.send(_resData16);
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
        key: 'saveMoveDevice',
        value: async function saveMoveDevice(res, postData) {
            try {
                var service = new _ProjectService2.default();
                var entity = Object.assign({}, new _ProjectEntity2.default(), postData);

                var dataList = postData.dataList;
                if (!Libs.isArrayData(dataList)) {
                    var _resData17 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                    res.send(_resData17);
                }

                if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                    service.saveMoveDevice(entity, function (err, rs) {
                        if (rs) {
                            var _resData18 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                            res.send(_resData18);
                        } else {
                            var _resData19 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                            res.send(_resData19);
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
        key: 'saveConfigEstimationSensor',
        value: async function saveConfigEstimationSensor(res, postData) {
            try {
                var service = new _ProjectService2.default();
                var entity = Object.assign({}, new _ProjectEntity2.default(), postData);

                if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                    service.saveConfigEstimationSensor(entity, function (err, rs) {
                        if (rs) {
                            var _resData20 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                            res.send(_resData20);
                        } else {
                            var _resData21 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                            res.send(_resData21);
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
                var service = new _ProjectService2.default();
                var entity = new _ProjectEntity2.default();
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

    return ProjectController;
}(_AbstractManagerController2.default);

exports.default = ProjectController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL1Byb2plY3RDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIlByb2plY3RDb250cm9sbGVyIiwicmVzIiwicG9zdERhdGEiLCJzZXJ2aWNlIiwiUHJvamVjdFNlcnZpY2UiLCJlbnRpdHkiLCJQcm9qZWN0RW50aXR5IiwiT2JqZWN0IiwiYXNzaWduIiwiZ2V0TGlzdCIsImVyciIsInJzIiwiZ2V0U2l6ZSIsImVycjEiLCJyczEiLCJyZXNEYXRhIiwiTGlicyIsInJldHVybkpzb25SZXN1bHQiLCJpMThuIiwiX18iLCJ0b3RhbFJvdyIsInNlbmQiLCJlIiwibG9nZ2VyIiwiZXJyb3IiLCJnZXREZXRhaWwiLCJnZXREZXRhaWxDb25maWciLCJpc0JsYW5rIiwiaWQiLCJkZWxldGUiLCJyc3VwZGF0ZSIsInN0YXR1cyIsInVwZGF0ZVN0YXR1cyIsInNlbGYiLCJ2YWxpZGF0ZSIsIlByb2plY3RWYWxpZGF0ZSIsImVycm9ycyIsIkZMVmFsaWRhdGlvbkFsbCIsImNvbW1pc2lvbmluZ19kYXRlIiwiY29udmVydFN0cjJEYXRlVjAxIiwiaW5zdGFsbGVkX2RhdGUiLCJsYXN0X3VwZGF0ZWQiLCJ1cGxvYWRfdGh1bWJuYWlsIiwiYmFzZTY0U3RyaW5nIiwiYmFzZTY0TWltZVR5cGUiLCJleHQiLCJyZXBsYWNlIiwiQ29uc3RhbnRzIiwiZGF0YSIsImFsbG93SW1hZ2UiLCJpbmRleE9mIiwiY3JlYXRlSnNvbkltYWdlRXJyb3JNZXNzYWdlIiwiaW1hZ2VGaWxlTmFtZSIsIndyaXRlRmlsZVVwbG9hZCIsInVwbG9hZF90aHVtYm5haWxfbmFtZSIsInRodW1ibmFpbCIsImhhc093blByb3BlcnR5Iiwic2NyZWVuX21vZGUiLCJpbnNlcnQiLCJ0aW1lIiwiRGF0ZSIsImdldFRpbWUiLCJoYXNoX2lkIiwibWQ1IiwidG9TdHJpbmciLCJ0b0xvd2VyQ2FzZSIsImlzT2JqZWN0RW1wdHkiLCJpbnNlcnRQcm9qZWN0IiwidXBkYXRlIiwidXBkYXRlUHJvamVjdCIsImRhdGFDb25maWdSZXZlbnVlIiwiaXNBcnJheURhdGEiLCJpIiwibGVuIiwibGVuZ3RoIiwic3RhcnRfZGF0ZSIsImVuZF9kYXRlIiwidXBkYXRlUHJvamVjdENvbmZpZyIsImRhdGFMaXN0Iiwic2F2ZU1vdmVEZXZpY2UiLCJzYXZlQ29uZmlnRXN0aW1hdGlvblNlbnNvciIsIm5hbWVJbWciLCJ3IiwiaCIsInBhdGgiLCJyZXF1aXJlIiwiYnVmZmVyIiwiQnVmZmVyIiwiZnJvbSIsImZpbGVOYW1lIiwiY3VyRGF0ZSIsImN1ck5hbWUiLCJzdWJzdHIiLCJsYXN0SW5kZXhPZiIsInBhcnNlIiwibm93IiwiZmlsZVVybCIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJpbWFnZVVwbG9hZCIsImpvaW4iLCJ1cGxvYWRzX3JlcyIsImNoZWNrRmlsZUV4aXRzIiwicmVtb3ZlRmlsZSIsImZzIiwiZXhpc3RzU3luYyIsIm1rZGlyU3luYyIsInJlY3Vyc2l2ZSIsInVwbG9hZCIsInVwbG9hZEZpbGUiLCJjb25zb2xlIiwic291cmNlIiwiZGVzUGF0aCIsInVwbG9hZFJlc2l6ZUltYWdlIiwibWVzc2FnZSIsImxhYmVsIiwiZ2V0RHJvcERvd25MaXN0IiwiQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTUEsaUI7Ozs7Ozs7Ozs7Ozs7QUFFRjs7Ozs7OztnQ0FPUUMsRyxFQUFLQyxRLEVBQVU7QUFDbkIsZ0JBQUk7QUFDQSxvQkFBSUMsVUFBVSxJQUFJQyx3QkFBSixFQUFkO0FBQ0Esb0JBQUlDLFNBQVMsSUFBSUMsdUJBQUosRUFBYjtBQUNBRCx5QkFBU0UsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JILE1BQWxCLEVBQTBCSCxRQUExQixDQUFUO0FBQ0FDLHdCQUFRTSxPQUFSLENBQWdCSixNQUFoQixFQUF3QixVQUFVSyxHQUFWLEVBQWVDLEVBQWYs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QUFJQyx1QkFBSixFQUFiO0FBQ0FELHlCQUFTRSxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkgsTUFBbEIsRUFBMEJILFFBQTFCLENBQVQ7QUFDQUMsd0JBQVFpSCxlQUFSLENBQXdCL0csTUFBeEIsRUFBZ0MsVUFBVUssR0FBVixFQUFlQyxFQUFmLEVBQW1CO0FBQy9DLHdCQUFJLENBQUNELEdBQUwsRUFBVTtBQUNOSyxrQ0FBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsSUFBdEIsRUFBNEJDLEtBQUtDLEVBQUwsQ0FBUSxnQkFBUixDQUE1QixFQUF1RFIsRUFBdkQsRUFBMkQsQ0FBM0QsQ0FBVjtBQUNBViw0QkFBSW9CLElBQUosQ0FBU04sT0FBVDtBQUNILHFCQUhELE1BR087QUFDSEEsa0NBQVVDLEtBQUtDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsYUFBUixDQUE3QixFQUFxRCxFQUFyRCxFQUF5RCxDQUF6RCxDQUFWO0FBQ0FsQiw0QkFBSW9CLElBQUosQ0FBU04sT0FBVDtBQUNIO0FBQ0osaUJBUkQ7QUFTSCxhQWJELENBYUUsT0FBT08sQ0FBUCxFQUFVO0FBQ1IscUJBQUtDLE1BQUwsQ0FBWUMsS0FBWixDQUFrQixVQUFVRixDQUE1QjtBQUNBLG9CQUFJUCxVQUFVLEVBQWQ7QUFDQUEsMEJBQVVDLEtBQUtDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsWUFBUixDQUE3QixFQUFvRCxFQUFFLFNBQVNHLElBQUksRUFBZixFQUFwRCxFQUF5RSxDQUF6RSxDQUFWO0FBQ0FyQixvQkFBSW9CLElBQUosQ0FBU04sT0FBVDtBQUNIO0FBQ0o7Ozs7RUF4ZTJCc0csbUM7O2tCQTJlakJySCxpQiIsImZpbGUiOiJQcm9qZWN0Q29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlcic7XG5pbXBvcnQgUHJvamVjdEVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Qcm9qZWN0RW50aXR5JztcbmltcG9ydCBQcm9qZWN0U2VydmljZSBmcm9tICcuLi9zZXJ2aWNlcy9Qcm9qZWN0U2VydmljZSc7XG5pbXBvcnQgUHJvamVjdFZhbGlkYXRlIGZyb20gJy4uL3ZhbGlkYXRvci9Qcm9qZWN0VmFsaWRhdGUnO1xuaW1wb3J0IFN5bmMgZnJvbSAnc3luYyc7XG5cbmNsYXNzIFByb2plY3RDb250cm9sbGVyIGV4dGVuZHMgQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciB7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDEwLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0ge30gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0TGlzdChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBQcm9qZWN0RW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0TGlzdChlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRTaXplKGVudGl0eSwgZnVuY3Rpb24gKGVycjEsIHJzMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlcnIxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCByczEudG90YWxSb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKFwiTOG7l2k6IFwiICsgZSk7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IGRldGFpbCBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0RGV0YWlsKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IFByb2plY3RFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXREZXRhaWwoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgZGV0YWlsIGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICAgZ2V0RGV0YWlsQ29uZmlnKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IFByb2plY3RFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXREZXRhaWxDb25maWcoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRGVsZXRlIGl0ZW1cbiAgICAgKiBAYXV0aG9yIHRoYW5oLmJheVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE4XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBkZWxldGVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgUHJvamVjdEVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGVudGl0eS5pZCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIk5PVF9FWElTVFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlcnZpY2UuZGVsZXRlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnN1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcnN1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLkRFTEVURV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLkRFTEVURV9TVUNDRVNTJyksIGVudGl0eSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlcnJvciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBhY3Rpb25cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICB1cGRhdGVTdGF0dXMocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgUHJvamVjdEVudGl0eSgpLCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBlbnRpdHkuc3RhdHVzID0gKCFlbnRpdHkuc3RhdHVzIHx8IGVudGl0eS5zdGF0dXMgPT0gLTEpID8gMCA6IDE7XG5cbiAgICAgICAgICAgIGlmIChMaWJzLmlzQmxhbmsoZW50aXR5LmlkKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiTk9UX0VYSVNUXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBTeW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLnVwZGF0ZVN0YXR1cyhlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5VUERBVEVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5VUERBVEVfU1VDQ0VTUycpLCBlbnRpdHksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZXJyb3IgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBhY3Rpb25cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBhc3luYyBzYXZlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IFByb2plY3RFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgZW50aXR5LnN0YXR1cyA9ICghZW50aXR5LnN0YXR1cyB8fCBlbnRpdHkuc3RhdHVzID09IC0xKSA/IDAgOiAxO1xuICAgICAgICAgICAgbGV0IHZhbGlkYXRlID0gbmV3IFByb2plY3RWYWxpZGF0ZSgpO1xuXG4gICAgICAgICAgICBsZXQgZXJyb3JzID0gYXdhaXQgdmFsaWRhdGUuRkxWYWxpZGF0aW9uQWxsKGVudGl0eSk7XG4gICAgICAgICAgICBpZiAoZXJyb3JzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBlcnJvcnMudmFsaWRhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIFwiXCIsIGVycm9ycywgMCkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoZW50aXR5LmNvbW1pc2lvbmluZ19kYXRlKSkge1xuICAgICAgICAgICAgICAgIGVudGl0eS5jb21taXNpb25pbmdfZGF0ZSA9IExpYnMuY29udmVydFN0cjJEYXRlVjAxKGVudGl0eS5jb21taXNpb25pbmdfZGF0ZSwgXCJkZC9tbS95eXl5XCIsIFwiL1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoZW50aXR5Lmluc3RhbGxlZF9kYXRlKSkge1xuICAgICAgICAgICAgICAgIGVudGl0eS5pbnN0YWxsZWRfZGF0ZSA9IExpYnMuY29udmVydFN0cjJEYXRlVjAxKGVudGl0eS5pbnN0YWxsZWRfZGF0ZSwgXCJkZC9tbS95eXl5XCIsIFwiL1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoZW50aXR5Lmxhc3RfdXBkYXRlZCkpIHtcbiAgICAgICAgICAgICAgICBlbnRpdHkubGFzdF91cGRhdGVkID0gTGlicy5jb252ZXJ0U3RyMkRhdGVWMDEoZW50aXR5Lmxhc3RfdXBkYXRlZCwgXCJkZC9tbS95eXl5XCIsIFwiL1wiKTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiAoIUxpYnMuaXNCbGFuayhwb3N0RGF0YS51cGxvYWRfdGh1bWJuYWlsKSkge1xuICAgICAgICAgICAgICAgIGxldCBiYXNlNjRTdHJpbmcgPSBwb3N0RGF0YS51cGxvYWRfdGh1bWJuYWlsO1xuICAgICAgICAgICAgICAgIGxldCBiYXNlNjRNaW1lVHlwZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoYmFzZTY0U3RyaW5nKSkge1xuICAgICAgICAgICAgICAgICAgICBiYXNlNjRNaW1lVHlwZSA9IExpYnMuYmFzZTY0TWltZVR5cGUoYmFzZTY0U3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoYmFzZTY0TWltZVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXh0ID0gYmFzZTY0TWltZVR5cGUucmVwbGFjZSgnaW1hZ2UvJywgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENvbnN0YW50cy5kYXRhLmFsbG93SW1hZ2UuaW5kZXhPZihleHQpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gc2VsZi5jcmVhdGVKc29uSW1hZ2VFcnJvck1lc3NhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IHNlbGYuY3JlYXRlSnNvbkltYWdlRXJyb3JNZXNzYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2VGaWxlTmFtZSA9IGF3YWl0IHNlbGYud3JpdGVGaWxlVXBsb2FkKGJhc2U2NFN0cmluZywgcG9zdERhdGEudXBsb2FkX3RodW1ibmFpbF9uYW1lLCBudWxsLCBudWxsLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpbWFnZUZpbGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfRkFJTCcpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eS50aHVtYm5haWwgPSBpbWFnZUZpbGVOYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGVudGl0eS5oYXNPd25Qcm9wZXJ0eSgnc2NyZWVuX21vZGUnKSAmJiBlbnRpdHkuc2NyZWVuX21vZGUgPT0gQ29uc3RhbnRzLnNjcmVlbl9tb2RlLmluc2VydCkge1xuICAgICAgICAgICAgICAgIHZhciB0aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgZW50aXR5Lmhhc2hfaWQgPSBMaWJzLm1kNSh0aW1lLnRvU3RyaW5nKCkpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgICAgICBpZihMaWJzLmlzT2JqZWN0RW1wdHkoZW50aXR5Lmhhc2hfaWQpKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5TQVZFX0ZBSUwnKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBTeW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZS5pbnNlcnRQcm9qZWN0KGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChycyAmJiBlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9TVUNDRVNTJyksIGVudGl0eSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbnRpdHkuaGFzT3duUHJvcGVydHkoJ3NjcmVlbl9tb2RlJykgJiYgZW50aXR5LnNjcmVlbl9tb2RlID09IENvbnN0YW50cy5zY3JlZW5fbW9kZS51cGRhdGUpIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLnVwZGF0ZVByb2plY3QoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5TQVZFX1NVQ0NFU1MnKSwgZW50aXR5LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5TQVZFX0ZBSUwnKSwgeyBcImVycm9yXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBhY3Rpb25cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICAgYXN5bmMgc2F2ZUNvbmZpZ0FjdGlvbihyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBQcm9qZWN0RW50aXR5KCksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGRhdGFDb25maWdSZXZlbnVlID0gcG9zdERhdGEuZGF0YUNvbmZpZ1JldmVudWU7XG4gICAgICAgICAgICBpZihMaWJzLmlzQXJyYXlEYXRhKGRhdGFDb25maWdSZXZlbnVlKSl7XG4gICAgICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDAsIGxlbiA9IGRhdGFDb25maWdSZXZlbnVlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgZGF0YUNvbmZpZ1JldmVudWVbaV0uc3RhcnRfZGF0ZSA9IExpYnMuY29udmVydFN0cjJEYXRlVjAxKGRhdGFDb25maWdSZXZlbnVlW2ldLnN0YXJ0X2RhdGUsIFwiZGQvbW0veXl5eVwiLCBcIi9cIik7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFDb25maWdSZXZlbnVlW2ldLmVuZF9kYXRlID0gTGlicy5jb252ZXJ0U3RyMkRhdGVWMDEoZGF0YUNvbmZpZ1JldmVudWVbaV0uZW5kX2RhdGUsIFwiZGQvbW0veXl5eVwiLCBcIi9cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZW50aXR5Lmhhc093blByb3BlcnR5KCdzY3JlZW5fbW9kZScpICYmIGVudGl0eS5zY3JlZW5fbW9kZSA9PSBDb25zdGFudHMuc2NyZWVuX21vZGUudXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgc2VydmljZS51cGRhdGVQcm9qZWN0Q29uZmlnKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9TVUNDRVNTJyksIGVudGl0eSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbiAgICBcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGFjdGlvblxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDExLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgICBhc3luYyBzYXZlTW92ZURldmljZShyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBQcm9qZWN0RW50aXR5KCksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGRhdGFMaXN0ID0gcG9zdERhdGEuZGF0YUxpc3Q7XG4gICAgICAgICAgICBpZighTGlicy5pc0FycmF5RGF0YShkYXRhTGlzdCkpe1xuICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5TQVZFX1NVQ0NFU1MnKSwgZW50aXR5LCAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGVudGl0eS5oYXNPd25Qcm9wZXJ0eSgnc2NyZWVuX21vZGUnKSAmJiBlbnRpdHkuc2NyZWVuX21vZGUgPT0gQ29uc3RhbnRzLnNjcmVlbl9tb2RlLnVwZGF0ZSkge1xuICAgICAgICAgICAgICAgIHNlcnZpY2Uuc2F2ZU1vdmVEZXZpY2UoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5TQVZFX1NVQ0NFU1MnKSwgZW50aXR5LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5TQVZFX0ZBSUwnKSwgeyBcImVycm9yXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFNhdmUgYWN0aW9uXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgIGFzeW5jIHNhdmVDb25maWdFc3RpbWF0aW9uU2Vuc29yKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IFByb2plY3RFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIGlmIChlbnRpdHkuaGFzT3duUHJvcGVydHkoJ3NjcmVlbl9tb2RlJykgJiYgZW50aXR5LnNjcmVlbl9tb2RlID09IENvbnN0YW50cy5zY3JlZW5fbW9kZS51cGRhdGUpIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLnNhdmVDb25maWdFc3RpbWF0aW9uU2Vuc29yKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9TVUNDRVNTJyksIGVudGl0eSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBMxrB1IGZpbGUgZ2FsbGVyeVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBiYXNlNjRTdHJpbmcgXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVudGl0eSBcbiAgICAgKiBAUmV0dXJuIHRy4bqjIHbhu4EgZmlsZSBuYW1lIGJhbyBn4buTbSBmb2xkZXIgbuG6v3UgbMawdSBmaWxlIHRow6BuaCBjw7RuZywgbmfGsOG7o2MgbOG6oWkgdHLhuqMgduG7gSBmYWxzZVxuICAgICAqL1xuICAgIGFzeW5jIHdyaXRlRmlsZVVwbG9hZChiYXNlNjRTdHJpbmcsIG5hbWVJbWcsIHRodW1ibmFpbCA9IG51bGwsIHcgPSBudWxsLCBoID0gbnVsbCkge1xuICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGJhc2U2NFN0cmluZykpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIGJhc2U2NE1pbWVUeXBlID0gTGlicy5iYXNlNjRNaW1lVHlwZShiYXNlNjRTdHJpbmcpO1xuICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGJhc2U2NE1pbWVUeXBlKSkgcmV0dXJuIHRydWU7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgICAgICAgICAgIHZhciBleHQgPSBiYXNlNjRNaW1lVHlwZS5yZXBsYWNlKCdpbWFnZS8nLCAnJyk7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IGJhc2U2NFN0cmluZy5yZXBsYWNlKFwiZGF0YTpcIiArIGJhc2U2NE1pbWVUeXBlICsgXCI7YmFzZTY0LFwiLCAnJyk7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gQnVmZmVyLmZyb20oZGF0YSwgJ2Jhc2U2NCcpO1xuXG4gICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSAnJztcbiAgICAgICAgICAgIGxldCBjdXJEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBjdXJOYW1lID0gbmFtZUltZy5zdWJzdHIoMCwgbmFtZUltZy5sYXN0SW5kZXhPZignLicpKTtcbiAgICAgICAgICAgIGlmIChMaWJzLmlzQmxhbmsoY3VyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IERhdGUucGFyc2UoY3VyRGF0ZSkgKyAnLicgKyBleHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gY3VyTmFtZSArICctJyArIERhdGUucGFyc2UoY3VyRGF0ZSkgKyAnLicgKyBleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBmaWxlVXJsID0gIG5vdy5nZXRGdWxsWWVhcigpICsgXCIvXCIgKyAobm93LmdldE1vbnRoKCkgKyAxKTtcbiAgICAgICAgICAgIHZhciBpbWFnZVVwbG9hZCA9IHBhdGguam9pbihDb25zdGFudHMuZGF0YS51cGxvYWRzX3JlcywgZmlsZVVybCk7XG5cbiAgICAgICAgICAgIC8vIEtp4buDbSB0cmEgZmlsZSDEkcOjIHThu5NuIHThuqFpLCBjw7MgdGjDrCB4w7NhXG4gICAgICAgICAgICBpZiAoTGlicy5jaGVja0ZpbGVFeGl0cyhpbWFnZVVwbG9hZCwgZmlsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgTGlicy5yZW1vdmVGaWxlKGltYWdlVXBsb2FkLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRyxrDhu51uZyBo4bujcCBraMO0bmcgdOG7k24gdOG6oWkgdGjGsCBt4bulYyBz4bq9IHThuqFvIHRoxrAgbeG7pWMgxJHDs1xuICAgICAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGltYWdlVXBsb2FkKSkge1xuICAgICAgICAgICAgICAgIGZzLm1rZGlyU3luYyhpbWFnZVVwbG9hZCwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRo4buxYyBoaeG7h24gdmnhu4djIHVwbG9hZCBow6xuaCDhuqNuaFxuICAgICAgICAgICAgbGV0IHVwbG9hZCA9IExpYnMudXBsb2FkRmlsZShpbWFnZVVwbG9hZCwgZmlsZU5hbWUsIGJ1ZmZlcik7XG4gICAgICAgICAgICAvLyBUcsaw4budbmcgaOG7o3AgdXBsb2FkIOG6o25oIGLhu4sgbOG7l2lcbiAgICAgICAgICAgIGlmICghdXBsb2FkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuY29uc29sZS5lcnJvcihpMThuLl9fKCdtc2dfZXJyX2ZpbGVfdXBsb2FkJykpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRodW1ibmFpbFxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsodykgJiYgIUxpYnMuaXNCbGFuayhoKSAmJiAhTGlicy5pc0JsYW5rKHRodW1ibmFpbCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gcGF0aC5qb2luKENvbnN0YW50cy5kYXRhLnVwbG9hZHNfcmVzLCBmaWxlVXJsLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgdmFyIGRlc1BhdGggPSBub3cuZ2V0RnVsbFllYXIoKSArIFwiL1wiICsgKG5vdy5nZXRNb250aCgpICsgMSk7XG4gICAgICAgICAgICAgICAgTGlicy51cGxvYWRSZXNpemVJbWFnZShzb3VyY2UsIHBhdGguam9pbihDb25zdGFudHMuZGF0YS51cGxvYWRzX3JlcywgdGh1bWJuYWlsLCBkZXNQYXRoKSwgZmlsZU5hbWUsIDg1LCB3LCBoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHBhdGguam9pbihub3cuZ2V0RnVsbFllYXIoKSArIFwiL1wiICsgKG5vdy5nZXRNb250aCgpICsgMSksIGZpbGVOYW1lKTtcblxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZSBqc29uIGltYWdlIGVycm9yIG1lc3NhZ2VcbiAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgKiBAc2luY2UgMjYvMDcvMjAxOFxuICAgICovXG4gICAgY3JlYXRlSnNvbkltYWdlRXJyb3JNZXNzYWdlKCkge1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGkxOG4uX18oJ3R5cGVfaW1hZ2UnKTtcbiAgICAgICAgbGV0IGxhYmVsID0gaTE4bi5fXygncG9zdHMuaW1hZ2UnKTtcbiAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIG1lc3NhZ2UucmVwbGFjZShcIiQ8MT5cIiwgbGFiZWwpLCB7fSwgMCk7XG4gICAgICAgIHJldHVybiByZXNEYXRhO1xuICAgIH1cblxuICAgIC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGFsbFxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxuXHQgKiBAc2luY2UgMTAvMDcvMjAxOVxuXHQgKiBAcGFyYW0ge30gcmVzIFxuXHQgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuXHQgKi9cbiAgICAgZ2V0RHJvcERvd25MaXN0KHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IFByb2plY3RFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXREcm9wRG93bkxpc3QoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5leHBvcnQgZGVmYXVsdCBQcm9qZWN0Q29udHJvbGxlcjsiXX0=