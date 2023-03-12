import AbstractManagerController from '../core/AbstractManagerController';
import ReadingAIService from '../services/ReadingAIService';
import Sync from 'sync';

class ReadingAIController extends AbstractManagerController {

    /**
     * @description Get data raw
     * @author Long.Pham
     * @since 10/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    getDataRaw(res, postData) {
        try {
            let service = new ReadingAIService();
            let resData = {};
            console.log("status: ", postData.status, " - deviceID: ", postData.deviceID);
            // const logger = FLLogger.getLogger(postData.deviceID);
            // logger.error(postData);

            switch (status) {
                case 'ok':
                    // Save data to database
                    if (!Libs.isBlank(postData.deviceID)) {
                        Sync(function () {
                            service.insertReadingAI(postData, function (err, rs) {
                                if (rs && err) {
                                    resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), {}, 0);
                                } else {
                                    resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                                }
                                res.send(resData);
                            });
                        });
                    } else {
                        // save error device not exits
                        resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                        res.send(resData);
                    }
                    break;
                default:
                    // Save error disconnected
                    resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                    res.send(resData);
                    break;
            }

        } catch (e) {
            var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }



    /**
     * @description Get List item
     * @author Long.Pham
     * @since 10/09/2021
     * @param {} res 
     * @param {*} postData 
     */
    getList(res, postData) {
    }

    /**
     * @description Get detail item
     * @author Long.Pham
     * @since 10/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    getDetail(res, postData) {
    }

    /**
     * @description Delete item
     * @author Long.Pham
     * @since 10/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    deleteAction(res, postData) {

    }

    /**
     * @description Save action
     * @author Long.Pham
     * @since 10/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    async saveAction(res, postData) {

    }

}
export default ReadingAIController;