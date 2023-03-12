import AbstractManagerController from '../core/AbstractManagerController';
import DeviceParameterEntity from '../entities/DeviceParameterEntity';
import DeviceParameterService from '../services/DeviceParameterService';
import DeviceParameterValidate from '../validator/DeviceParameterValidate';
import Sync from 'sync';

class DeviceParameterController extends AbstractManagerController {

    /**
     * @description Get List item
     * @author Long.Pham
     * @since 10/07/2019
     * @param {} res 
     * @param {*} postData 
     */
    getList(res, postData) {
        try {
            let service = new DeviceParameterService();
            let entity = new DeviceParameterEntity();
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
            this.logger.DeviceParameter("Lỗi: " + e);
            var resData = {};
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "DeviceParameter": e + "" }, 0);
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
            var service = new DeviceParameterService();
            let entity = new DeviceParameterEntity();
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
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "DeviceParameter": e + "" }, 0);
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
            let service = new DeviceParameterService();
            let entity = new DeviceParameterEntity();
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
                            let resData = Libs.returnJsonResult(false, i18n.__('ACTION.DELETE_FAIL'), { "DeviceParameter": err }, 0);
                            res.send(resData);
                            return;
                        }
                        let resData = Libs.returnJsonResult(true, i18n.__('ACTION.DELETE_SUCCESS'), entity, 0);
                        res.send(resData);
                    } catch (DeviceParameter) {
                        let resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "DeviceParameter": DeviceParameter }, 0);
                        res.send(resData);
                    }
                });
            });
        } catch (e) {
            var resData = {};
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "DeviceParameter": e + "" }, 0);
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
            let service = new DeviceParameterService();
            let entity = Object.assign({}, new DeviceParameterEntity(), postData);
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
                            let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "DeviceParameter": err }, 0);
                            res.send(resData);
                            return;
                        }
                        let resData = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                        res.send(resData);
                    } catch (DeviceParameter) {
                        let resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "DeviceParameter": DeviceParameter }, 0);
                        res.send(resData);
                    }
                });
            });

        } catch (e) {
            var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "DeviceParameter": e + "" }, 0);
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
            let service = new DeviceParameterService();
            let entity = Object.assign({}, new DeviceParameterEntity(), postData);
            entity.status = (!entity.status || entity.status == -1) ? 0 : 1;
            let validate = new DeviceParameterValidate();

            let DeviceParameters = await validate.FLValidationAll(entity);
            if (DeviceParameters != null) {
                DeviceParameters.validate = false;
                res.send(Libs.returnJsonResult(false, "", DeviceParameters, 0));
                return;
            }


            if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                Sync(function () {
                    service.insertDeviceParameter(entity, function (err, rs) {
                        if (rs && err) {
                            let resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                            res.send(resData);
                        } else {
                            let resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "DeviceParameter": err }, 0);
                            res.send(resData);
                        }
                    });
                });
            } else if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                service.updateDeviceParameter(entity, function (err, rs) {
                    if (rs) {
                        let resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                        res.send(resData);
                    } else {
                        let resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "DeviceParameter": err }, 0);
                        res.send(resData);
                    }
                });
            }
        } catch (e) {
            var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "DeviceParameter": e + "" }, 0);
            res.send(resData);
        }
    }
}
export default DeviceParameterController;