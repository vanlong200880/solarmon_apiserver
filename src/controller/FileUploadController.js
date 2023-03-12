import AbstractManagerController from '../core/AbstractManagerController';
class FileUploadController extends AbstractManagerController {

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
     * @author Long.Pham
     * @since 11/07/2018
     * @param {*} res 
     * @param {*} postData 
     */
    deleteAction(res, postData) { }

    /**
     * @description Save action
     * @author Long.Pham
     * @since 11/07/2019
     * @param {*} res 
     * @param {*} postData 
     */
    async saveAction(res, postData) {

    }

    createJsonImageErrorMessage() {
        let message = i18n.__('thumbnail');
        let label = i18n.__('news.thumbnail');
        var resData = Libs.returnJsonResult(false, message.replace("$<1>", label), {}, 0);
    }

    /**
     * @description Save action
     * @author Long.Pham
     * @since 11/07/2019
     * @param {*} res 
     * @param {*} postData 
     */
    async saveUploadImage(res, postData) {
        try {
            let self = this;
            var base64String = postData.file_upload;
            var base64MimeType = null;
            if (!Libs.isBlank(base64String)) {
                base64MimeType = Libs.base64MimeType(base64String);
                if (!Libs.isBlank(base64MimeType)) {
                    let ext = base64MimeType.replace('image/', '');
                    if (Constants.data.allowImage.indexOf(ext) === -1) {
                        var resData = self.createJsonImageErrorMessage();
                        res.send(resData);
                        return;
                    }
                } else {
                    var resData = self.createJsonImageErrorMessage();
                    res.send(resData);
                    return;
                }

                // write file
                let writeFileName = await self.writeFileUpload(base64String, postData.file_name, postData.iso_code, postData.config_thumb_folder_pro, postData.config_thumb_pro_w, postData.config_thumb_pro_h);
                if (!writeFileName) {
                    var resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                    res.send(resData);
                    return;
                }
                let resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), { file_url: postData.config_cdn + "/" + writeFileName }, 0);
                res.send(resData);

            }
        } catch (e) {
            var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }

    /**
     * Lưu file gallery
     * @param {String} base64String 
     * @param {Object} entity 
     * @Return trả về file name bao gồm folder nếu lưu file thành công, ngược lại trả về false
     */
    async writeFileUpload(base64String, nameImg, iso_code, thumbnail = null, w = null, h = null) {
        if (Libs.isBlank(base64String)) return false;
        var base64MimeType = Libs.base64MimeType(base64String);
        if (Libs.isBlank(base64MimeType)) return true;
        try {
            var path = require('path');
            var ext = base64MimeType.replace('image/', '');
            let data = base64String.replace("data:" + base64MimeType + ";base64,", '');
            let buffer = Buffer.from(data, 'base64');

            var fileName = '';
            let curDate = new Date();
            var curName = nameImg.substr(0, nameImg.lastIndexOf('.'));
            if (Libs.isBlank(curName)) {
                fileName = Date.parse(curDate) + '.' + ext;
            } else {
                fileName = curName + '-' + Date.parse(curDate) + '.' + ext;
            }
            var now = new Date();
            var fileUrl = iso_code.toLowerCase() + "/" + now.getFullYear() + "/" + (now.getMonth() + 1);
            var imageUpload = path.join(Constants.data.uploads_res, fileUrl);

            // Kiểm tra file đã tồn tại, có thì xóa
            if (Libs.checkFileExits(imageUpload, fileName)) {
                Libs.removeFile(imageUpload, fileName);
            }

            // Trường hợp không tồn tại thư mục sẽ tạo thư mục đó
            if (!fs.existsSync(imageUpload)) {
                fs.mkdirSync(imageUpload, { recursive: true });
            }

            // Thực hiện việc upload hình ảnh
            let upload = Libs.uploadFile(imageUpload, fileName, buffer);
            // Trường hợp upload ảnh bị lỗi
            if (!upload) {
                this.logger.console.error(i18n.__('msg_err_file_upload'));
                return false;
            }

            // Create thumbnail
            if (!Libs.isBlank(w) && !Libs.isBlank(h) && !Libs.isBlank(thumbnail)) {
                var source = path.join(Constants.data.uploads_res, fileUrl, fileName);
                var desPath = now.getFullYear() + "/" + (now.getMonth() + 1);
                Libs.uploadResizeImage(source, path.join(Constants.data.uploads_res, iso_code.toLowerCase(), thumbnail, desPath), fileName, 85, w, h);
            }

            return path.join(now.getFullYear() + "/" + (now.getMonth() + 1), fileName);

        } catch (err) {
            this.logger.error(err);
            return false;
        }
    }

}
export default FileUploadController;