'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractManagerController = require('../core/AbstractManagerController');

var _AbstractManagerController2 = _interopRequireDefault(_AbstractManagerController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FileUploadController = function (_AbstractManagerContr) {
    _inherits(FileUploadController, _AbstractManagerContr);

    function FileUploadController() {
        _classCallCheck(this, FileUploadController);

        return _possibleConstructorReturn(this, (FileUploadController.__proto__ || Object.getPrototypeOf(FileUploadController)).apply(this, arguments));
    }

    _createClass(FileUploadController, [{
        key: 'getList',


        /**
         * @description Get List item
         * @author Long.Pham
         * @since 10/07/2019
         * @param {} res 
         * @param {*} postData 
         */
        value: function getList(res, postData) {}

        /**
         * @description Get detail item
         * @author Long.Pham
         * @since 11/07/2019
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'getDetail',
        value: function getDetail(res, postData) {}

        /**
         * @description Delete item
         * @author Long.Pham
         * @since 11/07/2018
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'deleteAction',
        value: function deleteAction(res, postData) {}

        /**
         * @description Save action
         * @author Long.Pham
         * @since 11/07/2019
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'saveAction',
        value: async function saveAction(res, postData) {}
    }, {
        key: 'createJsonImageErrorMessage',
        value: function createJsonImageErrorMessage() {
            var message = i18n.__('thumbnail');
            var label = i18n.__('news.thumbnail');
            var resData = Libs.returnJsonResult(false, message.replace("$<1>", label), {}, 0);
        }

        /**
         * @description Save action
         * @author Long.Pham
         * @since 11/07/2019
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'saveUploadImage',
        value: async function saveUploadImage(res, postData) {
            try {
                var self = this;
                var base64String = postData.file_upload;
                var base64MimeType = null;
                if (!Libs.isBlank(base64String)) {
                    base64MimeType = Libs.base64MimeType(base64String);
                    if (!Libs.isBlank(base64MimeType)) {
                        var ext = base64MimeType.replace('image/', '');
                        if (Constants.data.allowImage.indexOf(ext) === -1) {
                            var _resData = self.createJsonImageErrorMessage();
                            res.send(_resData);
                            return;
                        }
                    } else {
                        var _resData = self.createJsonImageErrorMessage();
                        res.send(_resData);
                        return;
                    }

                    // write file
                    var writeFileName = await self.writeFileUpload(base64String, postData.file_name, postData.iso_code, postData.config_thumb_folder_pro, postData.config_thumb_pro_w, postData.config_thumb_pro_h);
                    if (!writeFileName) {
                        var _resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                        res.send(_resData);
                        return;
                    }
                    var _resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), { file_url: postData.config_cdn + "/" + writeFileName }, 0);
                    res.send(_resData);
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

    }, {
        key: 'writeFileUpload',
        value: async function writeFileUpload(base64String, nameImg, iso_code) {
            var thumbnail = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
            var w = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
            var h = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

            if (Libs.isBlank(base64String)) return false;
            var base64MimeType = Libs.base64MimeType(base64String);
            if (Libs.isBlank(base64MimeType)) return true;
            try {
                var path = require('path');
                var ext = base64MimeType.replace('image/', '');
                var data = base64String.replace("data:" + base64MimeType + ";base64,", '');
                var buffer = Buffer.from(data, 'base64');

                var fileName = '';
                var curDate = new Date();
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
                var upload = Libs.uploadFile(imageUpload, fileName, buffer);
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
    }]);

    return FileUploadController;
}(_AbstractManagerController2.default);

exports.default = FileUploadController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0ZpbGVVcGxvYWRDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkZpbGVVcGxvYWRDb250cm9sbGVyIiwicmVzIiwicG9zdERhdGEiLCJtZXNzYWdlIiwiaTE4biIsIl9fIiwibGFiZWwiLCJyZXNEYXRhIiwiTGlicyIsInJldHVybkpzb25SZXN1bHQiLCJyZXBsYWNlIiwic2VsZiIsImJhc2U2NFN0cmluZyIsImZpbGVfdXBsb2FkIiwiYmFzZTY0TWltZVR5cGUiLCJpc0JsYW5rIiwiZXh0IiwiQ29uc3RhbnRzIiwiZGF0YSIsImFsbG93SW1hZ2UiLCJpbmRleE9mIiwiY3JlYXRlSnNvbkltYWdlRXJyb3JNZXNzYWdlIiwic2VuZCIsIndyaXRlRmlsZU5hbWUiLCJ3cml0ZUZpbGVVcGxvYWQiLCJmaWxlX25hbWUiLCJpc29fY29kZSIsImNvbmZpZ190aHVtYl9mb2xkZXJfcHJvIiwiY29uZmlnX3RodW1iX3Byb193IiwiY29uZmlnX3RodW1iX3Byb19oIiwiZmlsZV91cmwiLCJjb25maWdfY2RuIiwiZSIsIm5hbWVJbWciLCJ0aHVtYm5haWwiLCJ3IiwiaCIsInBhdGgiLCJyZXF1aXJlIiwiYnVmZmVyIiwiQnVmZmVyIiwiZnJvbSIsImZpbGVOYW1lIiwiY3VyRGF0ZSIsIkRhdGUiLCJjdXJOYW1lIiwic3Vic3RyIiwibGFzdEluZGV4T2YiLCJwYXJzZSIsIm5vdyIsImZpbGVVcmwiLCJ0b0xvd2VyQ2FzZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJpbWFnZVVwbG9hZCIsImpvaW4iLCJ1cGxvYWRzX3JlcyIsImNoZWNrRmlsZUV4aXRzIiwicmVtb3ZlRmlsZSIsImZzIiwiZXhpc3RzU3luYyIsIm1rZGlyU3luYyIsInJlY3Vyc2l2ZSIsInVwbG9hZCIsInVwbG9hZEZpbGUiLCJsb2dnZXIiLCJjb25zb2xlIiwiZXJyb3IiLCJzb3VyY2UiLCJkZXNQYXRoIiwidXBsb2FkUmVzaXplSW1hZ2UiLCJlcnIiLCJBYnN0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QS9DLENBQWI7QUFDQSx3QkFBSTJCLFVBQVVwQixJQUFJRyxXQUFKLEtBQW9CLEdBQXBCLElBQTJCSCxJQUFJSSxRQUFKLEtBQWlCLENBQTVDLENBQWQ7QUFDQTdDLHlCQUFLOEQsaUJBQUwsQ0FBdUJGLE1BQXZCLEVBQStCL0IsS0FBS2tCLElBQUwsQ0FBVXRDLFVBQVVDLElBQVYsQ0FBZXNDLFdBQXpCLEVBQXNDOUIsU0FBU3lCLFdBQVQsRUFBdEMsRUFBOERqQixTQUE5RCxFQUF5RW1DLE9BQXpFLENBQS9CLEVBQWtIM0IsUUFBbEgsRUFBNEgsRUFBNUgsRUFBZ0lQLENBQWhJLEVBQW1JQyxDQUFuSTtBQUNIOztBQUVELHVCQUFPQyxLQUFLa0IsSUFBTCxDQUFVTixJQUFJRyxXQUFKLEtBQW9CLEdBQXBCLElBQTJCSCxJQUFJSSxRQUFKLEtBQWlCLENBQTVDLENBQVYsRUFBMERYLFFBQTFELENBQVA7QUFFSCxhQTdDRCxDQTZDRSxPQUFPNkIsR0FBUCxFQUFZO0FBQ1YscUJBQUtOLE1BQUwsQ0FBWUUsS0FBWixDQUFrQkksR0FBbEI7QUFDQSx1QkFBTyxLQUFQO0FBQ0g7QUFDSjs7OztFQTVKOEJDLG1DOztrQkErSnBCeEUsb0IiLCJmaWxlIjoiRmlsZVVwbG9hZENvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciBmcm9tICcuLi9jb3JlL0Fic3RyYWN0TWFuYWdlckNvbnRyb2xsZXInO1xuY2xhc3MgRmlsZVVwbG9hZENvbnRyb2xsZXIgZXh0ZW5kcyBBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgTGlzdCBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTAvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7fSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBnZXRMaXN0KHJlcywgcG9zdERhdGEpIHtcblxuXG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgZGV0YWlsIGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBnZXREZXRhaWwocmVzLCBwb3N0RGF0YSkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIERlbGV0ZSBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOFxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZGVsZXRlQWN0aW9uKHJlcywgcG9zdERhdGEpIHsgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFNhdmUgYWN0aW9uXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgYXN5bmMgc2F2ZUFjdGlvbihyZXMsIHBvc3REYXRhKSB7XG5cbiAgICB9XG5cbiAgICBjcmVhdGVKc29uSW1hZ2VFcnJvck1lc3NhZ2UoKSB7XG4gICAgICAgIGxldCBtZXNzYWdlID0gaTE4bi5fXygndGh1bWJuYWlsJyk7XG4gICAgICAgIGxldCBsYWJlbCA9IGkxOG4uX18oJ25ld3MudGh1bWJuYWlsJyk7XG4gICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBtZXNzYWdlLnJlcGxhY2UoXCIkPDE+XCIsIGxhYmVsKSwge30sIDApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGFjdGlvblxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDExLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGFzeW5jIHNhdmVVcGxvYWRJbWFnZShyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgYmFzZTY0U3RyaW5nID0gcG9zdERhdGEuZmlsZV91cGxvYWQ7XG4gICAgICAgICAgICB2YXIgYmFzZTY0TWltZVR5cGUgPSBudWxsO1xuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoYmFzZTY0U3RyaW5nKSkge1xuICAgICAgICAgICAgICAgIGJhc2U2NE1pbWVUeXBlID0gTGlicy5iYXNlNjRNaW1lVHlwZShiYXNlNjRTdHJpbmcpO1xuICAgICAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKGJhc2U2NE1pbWVUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZXh0ID0gYmFzZTY0TWltZVR5cGUucmVwbGFjZSgnaW1hZ2UvJywgJycpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ29uc3RhbnRzLmRhdGEuYWxsb3dJbWFnZS5pbmRleE9mKGV4dCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHNlbGYuY3JlYXRlSnNvbkltYWdlRXJyb3JNZXNzYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0gc2VsZi5jcmVhdGVKc29uSW1hZ2VFcnJvck1lc3NhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyB3cml0ZSBmaWxlXG4gICAgICAgICAgICAgICAgbGV0IHdyaXRlRmlsZU5hbWUgPSBhd2FpdCBzZWxmLndyaXRlRmlsZVVwbG9hZChiYXNlNjRTdHJpbmcsIHBvc3REYXRhLmZpbGVfbmFtZSwgcG9zdERhdGEuaXNvX2NvZGUsIHBvc3REYXRhLmNvbmZpZ190aHVtYl9mb2xkZXJfcHJvLCBwb3N0RGF0YS5jb25maWdfdGh1bWJfcHJvX3csIHBvc3REYXRhLmNvbmZpZ190aHVtYl9wcm9faCk7XG4gICAgICAgICAgICAgICAgaWYgKCF3cml0ZUZpbGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9GQUlMJyksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfU1VDQ0VTUycpLCB7IGZpbGVfdXJsOiBwb3N0RGF0YS5jb25maWdfY2RuICsgXCIvXCIgKyB3cml0ZUZpbGVOYW1lIH0sIDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTMawdSBmaWxlIGdhbGxlcnlcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYmFzZTY0U3RyaW5nIFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbnRpdHkgXG4gICAgICogQFJldHVybiB0cuG6oyB24buBIGZpbGUgbmFtZSBiYW8gZ+G7k20gZm9sZGVyIG7hur91IGzGsHUgZmlsZSB0aMOgbmggY8O0bmcsIG5nxrDhu6NjIGzhuqFpIHRy4bqjIHbhu4EgZmFsc2VcbiAgICAgKi9cbiAgICBhc3luYyB3cml0ZUZpbGVVcGxvYWQoYmFzZTY0U3RyaW5nLCBuYW1lSW1nLCBpc29fY29kZSwgdGh1bWJuYWlsID0gbnVsbCwgdyA9IG51bGwsIGggPSBudWxsKSB7XG4gICAgICAgIGlmIChMaWJzLmlzQmxhbmsoYmFzZTY0U3RyaW5nKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB2YXIgYmFzZTY0TWltZVR5cGUgPSBMaWJzLmJhc2U2NE1pbWVUeXBlKGJhc2U2NFN0cmluZyk7XG4gICAgICAgIGlmIChMaWJzLmlzQmxhbmsoYmFzZTY0TWltZVR5cGUpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgICAgICAgICAgdmFyIGV4dCA9IGJhc2U2NE1pbWVUeXBlLnJlcGxhY2UoJ2ltYWdlLycsICcnKTtcbiAgICAgICAgICAgIGxldCBkYXRhID0gYmFzZTY0U3RyaW5nLnJlcGxhY2UoXCJkYXRhOlwiICsgYmFzZTY0TWltZVR5cGUgKyBcIjtiYXNlNjQsXCIsICcnKTtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBCdWZmZXIuZnJvbShkYXRhLCAnYmFzZTY0Jyk7XG5cbiAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9ICcnO1xuICAgICAgICAgICAgbGV0IGN1ckRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIGN1ck5hbWUgPSBuYW1lSW1nLnN1YnN0cigwLCBuYW1lSW1nLmxhc3RJbmRleE9mKCcuJykpO1xuICAgICAgICAgICAgaWYgKExpYnMuaXNCbGFuayhjdXJOYW1lKSkge1xuICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gRGF0ZS5wYXJzZShjdXJEYXRlKSArICcuJyArIGV4dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmlsZU5hbWUgPSBjdXJOYW1lICsgJy0nICsgRGF0ZS5wYXJzZShjdXJEYXRlKSArICcuJyArIGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIGZpbGVVcmwgPSBpc29fY29kZS50b0xvd2VyQ2FzZSgpICsgXCIvXCIgKyBub3cuZ2V0RnVsbFllYXIoKSArIFwiL1wiICsgKG5vdy5nZXRNb250aCgpICsgMSk7XG4gICAgICAgICAgICB2YXIgaW1hZ2VVcGxvYWQgPSBwYXRoLmpvaW4oQ29uc3RhbnRzLmRhdGEudXBsb2Fkc19yZXMsIGZpbGVVcmwpO1xuXG4gICAgICAgICAgICAvLyBLaeG7g20gdHJhIGZpbGUgxJHDoyB04buTbiB04bqhaSwgY8OzIHRow6wgeMOzYVxuICAgICAgICAgICAgaWYgKExpYnMuY2hlY2tGaWxlRXhpdHMoaW1hZ2VVcGxvYWQsIGZpbGVOYW1lKSkge1xuICAgICAgICAgICAgICAgIExpYnMucmVtb3ZlRmlsZShpbWFnZVVwbG9hZCwgZmlsZU5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUcsaw4budbmcgaOG7o3Aga2jDtG5nIHThu5NuIHThuqFpIHRoxrAgbeG7pWMgc+G6vSB04bqhbyB0aMawIG3hu6VjIMSRw7NcbiAgICAgICAgICAgIGlmICghZnMuZXhpc3RzU3luYyhpbWFnZVVwbG9hZCkpIHtcbiAgICAgICAgICAgICAgICBmcy5ta2RpclN5bmMoaW1hZ2VVcGxvYWQsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaOG7sWMgaGnhu4duIHZp4buHYyB1cGxvYWQgaMOsbmgg4bqjbmhcbiAgICAgICAgICAgIGxldCB1cGxvYWQgPSBMaWJzLnVwbG9hZEZpbGUoaW1hZ2VVcGxvYWQsIGZpbGVOYW1lLCBidWZmZXIpO1xuICAgICAgICAgICAgLy8gVHLGsOG7nW5nIGjhu6NwIHVwbG9hZCDhuqNuaCBi4buLIGzhu5dpXG4gICAgICAgICAgICBpZiAoIXVwbG9hZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmNvbnNvbGUuZXJyb3IoaTE4bi5fXygnbXNnX2Vycl9maWxlX3VwbG9hZCcpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aHVtYm5haWxcbiAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKHcpICYmICFMaWJzLmlzQmxhbmsoaCkgJiYgIUxpYnMuaXNCbGFuayh0aHVtYm5haWwpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IHBhdGguam9pbihDb25zdGFudHMuZGF0YS51cGxvYWRzX3JlcywgZmlsZVVybCwgZmlsZU5hbWUpO1xuICAgICAgICAgICAgICAgIHZhciBkZXNQYXRoID0gbm93LmdldEZ1bGxZZWFyKCkgKyBcIi9cIiArIChub3cuZ2V0TW9udGgoKSArIDEpO1xuICAgICAgICAgICAgICAgIExpYnMudXBsb2FkUmVzaXplSW1hZ2Uoc291cmNlLCBwYXRoLmpvaW4oQ29uc3RhbnRzLmRhdGEudXBsb2Fkc19yZXMsIGlzb19jb2RlLnRvTG93ZXJDYXNlKCksIHRodW1ibmFpbCwgZGVzUGF0aCksIGZpbGVOYW1lLCA4NSwgdywgaCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBwYXRoLmpvaW4obm93LmdldEZ1bGxZZWFyKCkgKyBcIi9cIiArIChub3cuZ2V0TW9udGgoKSArIDEpLCBmaWxlTmFtZSk7XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5leHBvcnQgZGVmYXVsdCBGaWxlVXBsb2FkQ29udHJvbGxlcjsiXX0=