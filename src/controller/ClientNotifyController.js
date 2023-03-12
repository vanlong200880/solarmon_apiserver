import BaseController from '../core/BaseController';
import ClientNotifyService from '../services/ClientNotifyService';
import AlertEntity from '../entities/AlertEntity';
import AlertValidate from '../validator/AlertValidate';
import Sync from 'sync';

class ClientNotifyController extends BaseController {
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
     getNotifySize(res, postData) {
        try {
            let service = new ClientNotifyService();
            let entity = new AlertEntity();
            entity = Object.assign({}, entity, postData);

            service.getNotifySize(entity, function (err, rs) {
                if (!err) {
                    resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, rs.totalRow);
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
    getList(res, postData) {
        try {
            let service = new ClientNotifyService();
            let entity = new AlertEntity();
            entity = Object.assign({}, entity, postData);
            if (!Libs.isBlank(entity.date_from)) {
                entity.date_from = Libs.convertStr2DateV01(entity.date_from, "dd/mm/yyyy", "/");
            }

            if (!Libs.isBlank(entity.date_to)) {
                entity.date_to = Libs.convertStr2DateV01(entity.date_to, "dd/mm/yyyy", "/");
            }

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
     * @description Delete item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    deleteAction(res, postData) {
        try {
            let service = new ClientNotifyService();
            let entity = new AlertEntity();
            entity = Object.assign({}, entity, postData);
            var resData = {};
            if (Libs.isBlank(entity.id)) {
                resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                res.send(resData);
                return;
            }

            service.delete(entity, function (err, rs) {
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
     * @description Delete item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    closeAll(res, postData) {
        try {
            let service = new ClientNotifyService();
            let entity = Object.assign({}, new AlertEntity(), postData);

            Sync(function () {
                service.closeAll(entity, function (err, rsupdate) {
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
        try {
            let service = new ClientNotifyService();
            let entity = Object.assign({}, new AlertEntity(), postData);
            if (!Libs.isBlank(entity.status) && entity.status == 1) {
                entity.end_date = null;
            }

            if (!Libs.isBlank(entity.status) && entity.status == 0) {
                const moment = require("moment");
                entity.end_date = moment().format('YYYY-MM-DD HH:mm:ss');
            }

            let validate = new AlertValidate();
            validate.FLValidationAll(entity, async function (err, key) {
                try {
                    if (err) {
                        var resData = Libs.returnJsonResult(false, err.message, {}, 0);
                        res.send(resData);
                        return;
                    }
                    if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                        Sync(function () {
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
}
export default ClientNotifyController;