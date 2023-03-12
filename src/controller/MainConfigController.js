import BaseController from '../core/BaseController';
import MainConfigService from '../services/MainConfigService';
import DeviceEntity from '../entities/DeviceEntity';
import DeviceValidate from '../validator/DeviceValidate';
import Sync from 'sync';

class MainConfigController extends BaseController {
    constructor() {
        super();
    }


     /**
     * @description Get List item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {} res 
     * @param {*} postData 
     */
      getListDeviceSensor(res, postData) {

        try {
            let service = new MainConfigService();
            let entity = new DeviceEntity();
            entity = Object.assign({}, entity, postData);
            service.getListDeviceSensor(entity, function (err, rs) {
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
     * @since 14/09/2021
     * @param {} res 
     * @param {*} postData 
     */
    getListAllDeviceByProject(res, postData) {

        try {
            let service = new MainConfigService();
            let entity = new DeviceEntity();
            entity = Object.assign({}, entity, postData);
            service.getListAllDeviceByProject(entity, function (err, rs) {
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
     * @description Get detail item
     * @author Long.Pham
     * @since 11/07/2018
     * @param {*} res 
     * @param {*} postData 
     */
    getDeviceDetail(res, postData) {
        try {
            var service = new MainConfigService();
            let entity = new DeviceEntity();
            entity = Object.assign({}, entity, postData);
            service.getDeviceDetail(entity, function (err, rs) {
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
    async updateDevice(res, postData) {
        try {
            let service = new MainConfigService();
            let entity = Object.assign({}, new DeviceEntity(), postData);
            entity.status = (!entity.status || entity.status == -1) ? 0 : 1;
            let validate = new DeviceValidate();
            validate.FLValidationAll(entity, async function (err, key) {
                try {
                    if (err) {
                        var resData = Libs.returnJsonResult(false, err.message, {}, 0);
                        res.send(resData);
                        return;
                    }
                    if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                        service.updateDevice(entity, function (err, rsupdate) {
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
     * @description Save action
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    async saveAction(res, postData) {

    }


    /**
     * @description Delete item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    deleteAction(res, postData) {

    }


}
export default MainConfigController;