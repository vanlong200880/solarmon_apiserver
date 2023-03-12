import BaseController from '../core/BaseController';
import MainAnalyticsService from '../services/MainAnalyticsService';
import ProjectEntity from '../entities/ProjectEntity';

class MainAnalyticsController extends BaseController {
    constructor() {
        super();
    }

    /**
     * @description Get detail item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
     getDataChartProfile(res, postData) {
        try {
            var service = new MainAnalyticsService();
            let entity = new ProjectEntity();
            entity = Object.assign({}, entity, postData);
            service.getDataChartProfile(entity, function (err, rs) {
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
	 * @description Get List item
	 * @author Long.Pham
	 * @since 10/07/2019
	 * @param {} res 
	 * @param {*} postData 
	 */
     getListDeviceByProject(res, postData) {
        try {
            let service = new MainAnalyticsService();
            let entity = new ProjectEntity();
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
	 * @description Get List item
	 * @author Long.Pham
	 * @since 10/07/2019
	 * @param {} res 
	 * @param {*} postData 
	 */
     getChartParameterDevice(res, postData) {
        try {
            let service = new MainAnalyticsService();
            let entity = new ProjectEntity();
            entity = Object.assign({}, entity, postData);
            service.getChartParameterDevice(entity, function (err, rs) {
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
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
     getChartAlarm(res, postData) {
        try {
            var service = new MainAnalyticsService();
            let entity = new ProjectEntity();
            entity = Object.assign({}, entity, postData);
            service.getChartAlarm(entity, function (err, rs) {
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
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    getDetail(res, postData) {
        
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
     * @description Get List item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {} res 
     * @param {*} postData 
     */
    getList(res, postData) {
        

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
export default MainAnalyticsController;