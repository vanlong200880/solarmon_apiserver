import BaseController from '../core/BaseController';
import ClientDeviceService from '../services/ClientDeviceService';
import DeviceEntity from '../entities/DeviceEntity';

class ClientDeviceController extends BaseController {
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
     getList(res, postData) {

        try {
            let service = new ClientDeviceService();
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
     * @description Get List parameter by device id
     * @author Long.Pham
     * @since 14/09/2021
     * @param {} res 
     * @param {*} postData 
     */
     getListParameterByDevice(res, postData) {
        try {
            let service = new ClientDeviceService();
            let entity = new DeviceEntity();
            entity = Object.assign({}, entity, postData);
            service.getListParameterByDevice(entity, function (err, rs) {
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
	 * @description Get List alert by device id
	 * @author Long.Pham
	 * @since 10/09/2021
	 * @param {} res 
	 * @param {*} postData 
	 */
     getListAlertByDevice(res, postData) {
        try {
            let service = new ClientDeviceService();
            let entity = new DeviceEntity();
            entity = Object.assign({}, entity, postData);
            if (!Libs.isBlank(entity.date_from)) {
                entity.date_from = Libs.convertStr2DateV01(entity.date_from, "dd/mm/yyyy", "/");
            }

            if (!Libs.isBlank(entity.date_to)) {
                entity.date_to = Libs.convertStr2DateV01(entity.date_to, "dd/mm/yyyy", "/");
            }

            service.getListAlertByDevice(entity, function (err, rs) {
                if (!err) {
                    service.getListAlertByDeviceSize(entity, function (err1, rs1) {
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
export default ClientDeviceController;