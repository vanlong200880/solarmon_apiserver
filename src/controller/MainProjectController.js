import AbstractManagerController from '../core/AbstractManagerController';
import ProjectEntity from '../entities/ProjectEntity';
import MainProjectService from '../services/MainProjectService';
import Sync from 'sync';

class MainProjectController extends AbstractManagerController {

    /**
     * @description Get all project sidebar
     * @author Long.Pham
     * @since 10/09/2021
     * @param {} res 
     * @param {*} postData 
     */
    getAllProjectByEmployeeId(res, postData) {
        try {
            let service = new MainProjectService();
            let entity = new ProjectEntity();
            entity = Object.assign({}, entity, postData);
            service.getAllProjectByEmployeeId(entity, function (err, rs) {
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
     * @description Get List project
     * @author Long.Pham
     * @since 10/09/2021
     * @param {} res 
     * @param {*} postData 
     */
    getListProjectByEmployee(res, postData) {
        try {
            let service = new MainProjectService();
            let entity = new ProjectEntity();
            entity = Object.assign({}, entity, postData);
            service.getListProjectByEmployee(entity, function (err, rs) {
                if (!err) {
                    service.getListProjectByEmployeeSize(entity, function (err1, rs1) {
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
     * @description Get List project
     * @author Long.Pham
     * @since 10/09/2021
     * @param {} res 
     * @param {*} postData 
     */
     getListMeterByEmployee(res, postData) {
        try {
            let service = new MainProjectService();
            let entity = new ProjectEntity();
            entity = Object.assign({}, entity, postData);
            service.getListMeterByEmployee(entity, function (err, rs) {
                if (!err) {
                    service.getListMeterByEmployeeSize(entity, function (err1, rs1) {
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
     * @description Get List project summary
     * @author Long.Pham
     * @since 10/09/2021
     * @param {} res 
     * @param {*} postData 
     */
     getListPlantSummary(res, postData) {
        try {
            let service = new MainProjectService();
            let entity = new ProjectEntity();
            entity = Object.assign({}, entity, postData);
            service.getListPlantSummary(entity, function (err, rs) {
                if (!err) {
                    resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs,0);
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
     * @since 10/07/2019
     * @param {} res 
     * @param {*} postData 
     */
    getList(res, postData) {
        

    }


    /**
     * @description Get detail item
     * @author Long.Pham
     * @since 11/07/2019
     * @param {*} res 
     * @param {*} postData 
     */
    getDetail(res, postData) {
       
    }

    /**
     * @description Delete item
     * @author thanh.bay
     * @since 11/07/2018
     * @param {*} res 
     * @param {*} postData 
     */
    deleteAction(res, postData) {
        
    }



    /**
     * @description Save action
     * @author Long.Pham
     * @since 11/07/2019
     * @param {*} res 
     * @param {*} postData 
     */
    async saveAction(res, postData) {
        
    }

}
export default MainProjectController;