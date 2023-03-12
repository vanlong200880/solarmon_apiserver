import AbstractManagerController from '../core/AbstractManagerController';
import DeviceEntity from '../entities/DeviceEntity';
import DeviceService from '../services/DeviceService';
import DeviceValidate from '../validator/DeviceValidate';
import Sync from 'sync';

class DeviceController extends AbstractManagerController {

   
    /**
	 * @description Get List item
	 * @author Long.Pham
	 * @since 10/07/2019
	 * @param {} res 
	 * @param {*} postData 
	 */
    getList(res, postData) {
        try {
            let service = new DeviceService();
            let entity = new DeviceEntity();
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
	 * @description Get List device by project id
	 * @author Long.Pham
	 * @since 10/07/2019
	 * @param {} res 
	 * @param {*} postData 
	 */
     getListDeviceByProject(res, postData) {
        try {
            let service = new DeviceService();
            let entity = new DeviceEntity();
            entity = Object.assign({}, entity, postData);
            service.getListDeviceByProject(entity, function (err, rs) {
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
	 * @description Get List device by project id share
	 * @author Long.Pham
	 * @since 10/07/2019
	 * @param {} res 
	 * @param {*} postData 
	 */
     getListDeviceByProjectShare(res, postData) {
        try {
            let service = new DeviceService();
            let entity = new DeviceEntity();
            entity = Object.assign({}, entity, postData);
            service.getListDeviceByProjectShare(entity, function (err, rs) {
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
     * @description Get detail item
     * @author Long.Pham
     * @since 11/07/2018
     * @param {*} res 
     * @param {*} postData 
     */
    getDetail(res, postData) {
        try {
            var service = new DeviceService();
            let entity = new DeviceEntity();
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
     * @author Long.Pham
     * @since 11/07/2018
     * @param {*} res 
     * @param {*} postData 
     */
    deleteAction(res, postData) {
        try {
            let service = new DeviceService();
            let entity = new DeviceEntity();
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
     async saveAction(res, postData) {
        try {
            let service = new DeviceService();
            let entity = Object.assign({}, new DeviceEntity(), postData);
            entity.status = (!entity.status || entity.status == -1) ? 0 : 1;
            if (!Libs.isBlank(entity.installed_at)) {
                entity.installed_at = Libs.convertStr2DateV01(entity.installed_at, "dd/mm/yyyy", "/");
            }

            let validate = new DeviceValidate();
            validate.FLValidationAll(entity, async function (err, key) {
                try {
                    if (err) {
                        var resData = Libs.returnJsonResult(false, err.message, {}, 0);
                        res.send(resData);
                        return;
                    }
                    if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                        Sync(function () {
                            let checkIdDeviceExist = service.checkIdDeviceExist.sync(null, entity);
                            if (!Libs.isObjectEmpty(checkIdDeviceExist)) {
                                let resData = Libs.returnJsonResult(false, null, Libs.buildPathValidateMessage("id_device", i18n.__("device.exist_id_device")), 0);
                                res.send(resData);
                                return;
                            }

                            service.insert(entity, function (err, rs) {
                                if (rs) {
                                    entity.id = rs.insertId;
                                    let resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, rs);
                                    res.send(resData);
                                } else {
                                    let resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                                    res.send(resData);
                                }
                            });
                        });
                    } else if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                        Sync(function () {
                            let checkIdDeviceExist = service.checkIdDeviceExist.sync(null, entity);
                            if (!Libs.isObjectEmpty(checkIdDeviceExist)) {
                                let resData = Libs.returnJsonResult(false, null, Libs.buildPathValidateMessage("id_device", i18n.__("device.exist_id_device")), 0);
                                res.send(resData);
                                return;
                            }

                            service.update(entity, function (err, rsupdate) {
                                try {
                                    if (!rsupdate) {
                                        let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                        res.send(resData);
                                        return;
                                    }
                                    let resData = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, rsupdate);
                                    res.send(resData);
                                } catch (error) {
                                    let resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                                    res.send(resData);
                                }
                            });
                        });
                    } else {
                        let resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), {}, 0);
                        res.send(resData);
                    }
                } catch (e) {
                    let resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                    res.send(resData);
                }
            });
        } catch (e) {
            var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }


    /**
     * @description Save device share
     * @author Long.Pham
     * @since 11/07/2019
     * @param {*} res 
     * @param {*} postData 
     */
     async saveDeviceShare(res, postData) {
        try {
            let service = new DeviceService();
            let entity = Object.assign({}, new DeviceEntity(), postData);
            entity.status = (!entity.status || entity.status == -1) ? 0 : 1;
            
            if(!Libs.isArrayData(entity.dataParams)){
                let resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                res.send(resData);
                return;
            }

            if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                Sync(function () {
                    service.saveDeviceShare(entity, function (err, rs) {
                        if (rs) {
                            let resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, rs);
                            res.send(resData);
                        } else {
                            let resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                            res.send(resData);
                        }
                    });
                });
            } else {
                let resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), {}, 0);
                res.send(resData);
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
            let service = new DeviceService();
            let entity = Object.assign({}, new DeviceEntity(), postData);
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
     * @description update is virtual
     * @author Long.Pham
     * @since 11/07/2019
     * @param {*} res 
     * @param {*} postData 
     */
     updateIsVirtual(res, postData) {
        try {
            let service = new DeviceService();
            let entity = Object.assign({}, new DeviceEntity(), postData);
            entity.status = (!entity.status || entity.status == -1) ? 0 : 1;

            if (Libs.isBlank(entity.id)) {
                var resData = {};
                resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                res.send(resData);
                return;
            }

            Sync(function () {
                service.updateIsVirtual(entity, function (err, rsupdate) {
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
	 * @description Get all
	 * @author Long.Pham
	 * @since 10/07/2019
	 * @param {} res 
	 * @param {*} postData 
	 */
     getDropDownList(res, postData) {
        try {
            let service = new DeviceService();
            let entity = new DeviceEntity();
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
export default DeviceController;