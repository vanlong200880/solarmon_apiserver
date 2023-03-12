import AbstractManagerController from '../core/AbstractManagerController';
import LanguageEntity from '../entities/LanguageEntity';
import LanguageService from '../services/LanguageService';
class LanguageController extends AbstractManagerController {
    /**
	 * @description Get List item
	 * @author Long.Pham
	 * @since 10/07/2019
	 * @param {} res 
	 * @param {*} postData 
	 */
    getList(res, postData) {
        try {
            let service = new LanguageService();
            let entity = new LanguageEntity();
            entity = Object.assign({}, entity, postData);
            service.getList(entity, function (err, rs) {
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
     * @author thanh.bay
     * @since 11/07/2018
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
    deleteAction() {
        
    }

    /**
     * @description Save action
     * @author Long.Pham
     * @since 11/07/2019
     * @param {*} res 
     * @param {*} postData 
     */
    saveAction() {
        
    }

    
}
export default LanguageController;