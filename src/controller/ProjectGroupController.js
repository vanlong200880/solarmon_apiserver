import AbstractManagerController from '../core/AbstractManagerController';
import ProjectGroupEntity from '../entities/ProjectGroupEntity';
import ProjectGroupService from '../services/ProjectGroupService';
import ProjectGroupValidate from '../validator/ProjectGroupValidate';
import Sync from 'sync';

class ProjectGroupController extends AbstractManagerController {

   
    /**
	 * @description Get List item
	 * @author Long.Pham
	 * @since 10/07/2019
	 * @param {} res 
	 * @param {*} postData 
	 */
    getList(res, postData) {
        try {
            let service = new ProjectGroupService();
            let entity = new ProjectGroupEntity();
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
     * @since 11/07/2018
     * @param {*} res 
     * @param {*} postData 
     */
    getDetail(res, postData) {
        try {
            var service = new ProjectGroupService();
            let entity = new ProjectGroupEntity();
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
            let service = new ProjectGroupService();
            let entity = new ProjectGroupEntity();
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
            let service = new ProjectGroupService();
            let entity = Object.assign({}, new ProjectGroupEntity(), postData);
            entity.status = (!entity.status || entity.status == -1) ? 0 : 1;
            let validate = new ProjectGroupValidate();
            validate.FLValidationAll(entity, async function (err, key) {
                try {
                    if (err) {
                        var resData = Libs.returnJsonResult(false, err.message, {}, 0);
                        res.send(resData);
                        return;
                    }
                    if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                        Sync(function () {
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
     * @description Save action
     * @author Long.Pham
     * @since 11/07/2019
     * @param {*} res 
     * @param {*} postData 
     */
    updateStatus(res, postData) {
        try {
            let service = new ProjectGroupService();
            let entity = Object.assign({}, new ProjectGroupEntity(), postData);
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
	 * @description Get all
	 * @author Long.Pham
	 * @since 10/07/2019
	 * @param {} res 
	 * @param {*} postData 
	 */
     getDropDownList(res, postData) {
        try {
            let service = new ProjectGroupService();
            let entity = new ProjectGroupEntity();
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
export default ProjectGroupController;