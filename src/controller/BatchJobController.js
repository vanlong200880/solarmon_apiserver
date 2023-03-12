import BaseController from '../core/BaseController';
import BatchJobService from '../services/BatchJobService';

class BatchJobController extends BaseController {
    constructor() {
        super();
    }


    /**
     * @description run batch job no communication
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    runNoCommunication(res, postData) {
        try {
            var service = new BatchJobService();
            service.runNoCommunication({}, function (err, rs) {
                var resData = {};
                if (!err) {
                    resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
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
     * @description run batch job reset energy today
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    resetTodayEnergy(res, postData) {
        try {
            var service = new BatchJobService();
            service.resetTodayEnergy({}, function (err, rs) {
                var resData = {};
                if (!err) {
                    resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
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
     * @description run batch job reset power now
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    resetPowerNow(res, postData) {
        try {
            var service = new BatchJobService();
            service.resetPowerNow({}, function (err, rs) {
                var resData = {};
                if (!err) {
                    resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
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
     * @description run batch job reset power now
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    updatedDevicePlant(res, postData) {
        try {
            var service = new BatchJobService();
            service.updatedDevicePlant({}, function (err, rs) {
                var resData = {};
                if (!err) {
                    resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
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


    // Performance index
    /**
         * @description run batch job reset power now
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */
    checkPerformanceIndex(res, postData) {
        try {
            var service = new BatchJobService();
            service.checkPerformanceIndex({}, function (err, rs) {
                var resData = {};
                if (!err) {
                    resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), {}, 0);
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
     * @description Get report year email
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    // getDataReportYearEmail(res, postData) {
    //     try {
    //         var service = new BatchJobService();
    //         let entity = new ProjectEntity();
    //         entity = Object.assign({}, entity, postData);
    //         service.getDataReportYearEmail(entity, function (err, rs) {
    //             var resData = {};
    //             if (!err) {
    //                 if (rs.length > 0) {
    //                     for (var i = 0; i < rs.length; i++) {
    //                         // Sent mail 
    //                         rs[i].logo = Constants.cms_url.logo;
    //                         // if (!Libs.isBlank(rs[i].email)) {
    //                         var html = reportRender.render("reports/year", rs[i]);
    //                         SentMail.SentMailHTML('solarmon@techedge.vn', 'vanlong200880@gmail.com', 'Solarmon year report', html);
    //                         // }
    //                     }
    //                 }
    //                 resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
    //             } else {
    //                 resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
    //             }
    //             res.send(resData);
    //         });
    //     } catch (e) {
    //         var resData = {};
    //         resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
    //         res.send(resData);
    //     }
    // }


    // /**
    //  * @description Get report year email
    //  * @author Long.Pham
    //  * @since 14/09/2021
    //  * @param {*} res 
    //  * @param {*} postData 
    //  */
    // getDataDailyReportEmail(res, postData) {
    //     try {
    //         var service = new BatchJobService();
    //         let entity = new ProjectEntity();
    //         entity = Object.assign({}, entity, postData);
    //         service.getDataDailyReportEmail(entity, function (err, rs) {
    //             var resData = {};
    //             if (!err) {
    //                 if (rs.length > 0) {
    //                     for (var i = 0; i < rs.length; i++) {
    //                         // Sent mail 
    //                         rs[i].logo = Constants.cms_url.logo;
    //                         if (!Libs.isBlank(rs[i].email)) {
    //                             var alerts = rs[i].alerts;
    //                             rs[i].countAlers = alerts.length > 0 ? 1 : 0;
    //                             var html = reportRender.render("reports/daily", rs[i]);
    //                             SentMail.SentMailHTML(null, rs[i].email, 'Solarmon daily report - ' + moment().format("DD/MM/YYYY"), html);
    //                         }
    //                     }
    //                 }
    //                 resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
    //             } else {
    //                 resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
    //             }
    //             res.send(resData);
    //         });
    //     } catch (e) {
    //         var resData = {};
    //         resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
    //         res.send(resData);
    //     }
    // }




    // /**
    //  * @description Get report month
    //  * @author Long.Pham
    //  * @since 14/09/2021
    //  * @param {*} res 
    //  * @param {*} postData 
    //  */
    // getDataReportMonth(res, postData) {
    //     try {
    //         var service = new BatchJobService();
    //         let entity = new ProjectEntity();
    //         entity = Object.assign({}, entity, postData);
    //         service.getDataReportMonth(entity, function (err, rs) {
    //             var resData = {};
    //             if (!err) {
    //                 resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
    //             } else {
    //                 resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
    //             }
    //             res.send(resData);
    //         });
    //     } catch (e) {
    //         var resData = {};
    //         resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
    //         res.send(resData);
    //     }
    // }


    // /**
    // * @description Get report year
    // * @author Long.Pham
    // * @since 14/09/2021
    // * @param {*} res 
    // * @param {*} postData 
    // */
    // getDataReportYear(res, postData) {
    //     try {
    //         var service = new BatchJobService();
    //         let entity = new ProjectEntity();
    //         entity = Object.assign({}, entity, postData);
    //         service.getDataReportYear(entity, function (err, rs) {
    //             var resData = {};
    //             if (!err) {
    //                 resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
    //             } else {
    //                 resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
    //             }
    //             res.send(resData);
    //         });
    //     } catch (e) {
    //         var resData = {};
    //         resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
    //         res.send(resData);
    //     }
    // }



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
export default BatchJobController;