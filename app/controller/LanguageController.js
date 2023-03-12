'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractManagerController = require('../core/AbstractManagerController');

var _AbstractManagerController2 = _interopRequireDefault(_AbstractManagerController);

var _LanguageEntity = require('../entities/LanguageEntity');

var _LanguageEntity2 = _interopRequireDefault(_LanguageEntity);

var _LanguageService = require('../services/LanguageService');

var _LanguageService2 = _interopRequireDefault(_LanguageService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LanguageController = function (_AbstractManagerContr) {
    _inherits(LanguageController, _AbstractManagerContr);

    function LanguageController() {
        _classCallCheck(this, LanguageController);

        return _possibleConstructorReturn(this, (LanguageController.__proto__ || Object.getPrototypeOf(LanguageController)).apply(this, arguments));
    }

    _createClass(LanguageController, [{
        key: 'getList',

        /**
        * @description Get List item
        * @author Long.Pham
        * @since 10/07/2019
        * @param {} res 
        * @param {*} postData 
        */
        value: function getList(res, postData) {
            try {
                var service = new _LanguageService2.default();
                var entity = new _LanguageEntity2.default();
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

    }, {
        key: 'getDetail',
        value: function getDetail(res, postData) {}

        /**
         * @description Delete item
         * @author thanh.bay
         * @since 11/07/2018
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'deleteAction',
        value: function deleteAction() {}

        /**
         * @description Save action
         * @author Long.Pham
         * @since 11/07/2019
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'saveAction',
        value: function saveAction() {}
    }]);

    return LanguageController;
}(_AbstractManagerController2.default);

exports.default = LanguageController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0xhbmd1YWdlQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJMYW5ndWFnZUNvbnRyb2xsZXIiLCJyZXMiLCJwb3N0RGF0YSIsInNlcnZpY2UiLCJMYW5ndWFnZVNlcnZpY2UiLCJlbnRpdHkiLCJMYW5ndWFnZUVudGl0eSIsIk9iamVjdCIsImFzc2lnbiIsImdldExpc3QiLCJlcnIiLCJycyIsInJlc0RhdGEiLCJMaWJzIiwicmV0dXJuSnNvblJlc3VsdCIsImkxOG4iLCJfXyIsInNlbmQiLCJlIiwibG9nZ2VyIiwiZXJyb3IiLCJBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ01BLGtCOzs7Ozs7Ozs7Ozs7QUFDRjs7Ozs7OztnQ0FPUUMsRyxFQUFLQyxRLEVBQVU7QUFDbkIsZ0JBQUk7QUFDQSxvQkFBSUMsVUFBVSxJQUFJQyx5QkFBSixFQUFkO0FBQ0Esb0JBQUlDLFNBQVMsSUFBSUMsd0JBQUosRUFBYjtBQUNBRCx5QkFBU0UsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JILE1BQWxCLEVBQTBCSCxRQUExQixDQUFUO0FBQ0FDLHdCQUFRTSxPQUFSLENBQWdCSixNQUFoQixFQUF3QixVQUFVSyxHQUFWLEVBQWVDLEVBQWYsRUFBbUI7QUFDdkMsd0JBQUksQ0FBQ0QsR0FBTCxFQUFVO0FBQ05FLGtDQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixJQUF0QixFQUE0QkMsS0FBS0MsRUFBTCxDQUFRLGdCQUFSLENBQTVCLEVBQXVETCxFQUF2RCxFQUEyRCxDQUEzRCxDQUFWO0FBQ0FWLDRCQUFJZ0IsSUFBSixDQUFTTCxPQUFUO0FBQ0gscUJBSEQsTUFHTztBQUNIQSxrQ0FBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtBQUtDLEVBQUwsQ0FBUSxhQUFSLENBQTdCLEVBQXFELEVBQXJELEVBQXlELENBQXpELENBQVY7QUFDQWYsNEJBQUlnQixJQUFKLENBQVNMLE9BQVQ7QUFDSDtBQUNKLGlCQVJEO0FBU0gsYUFiRCxDQWFFLE9BQU9NLENBQVAsRUFBVTtBQUNSLHFCQUFLQyxNQUFMLENBQVlDLEtBQVosQ0FBa0IsVUFBVUYsQ0FBNUI7QUFDQSxvQkFBSU4sVUFBVSxFQUFkO0FBQ0FBLDBCQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QkMsS0FBS0MsRUFBTCxDQUFRLFlBQVIsQ0FBN0IsRUFBb0QsRUFBRSxTQUFTRSxJQUFJLEVBQWYsRUFBcEQsRUFBeUUsQ0FBekUsQ0FBVjtBQUNBakIsb0JBQUlnQixJQUFKLENBQVNMLE9BQVQ7QUFDSDtBQUVKOztBQUVEOzs7Ozs7Ozs7O2tDQU9VWCxHLEVBQUtDLFEsRUFBVSxDQUV4Qjs7QUFFRDs7Ozs7Ozs7Ozt1Q0FPZSxDQUVkOztBQUVEOzs7Ozs7Ozs7O3FDQU9hLENBRVo7Ozs7RUE5RDRCbUIsbUM7O2tCQWtFbEJyQixrQiIsImZpbGUiOiJMYW5ndWFnZUNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciBmcm9tICcuLi9jb3JlL0Fic3RyYWN0TWFuYWdlckNvbnRyb2xsZXInO1xuaW1wb3J0IExhbmd1YWdlRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL0xhbmd1YWdlRW50aXR5JztcbmltcG9ydCBMYW5ndWFnZVNlcnZpY2UgZnJvbSAnLi4vc2VydmljZXMvTGFuZ3VhZ2VTZXJ2aWNlJztcbmNsYXNzIExhbmd1YWdlQ29udHJvbGxlciBleHRlbmRzIEFic3RyYWN0TWFuYWdlckNvbnRyb2xsZXIge1xuICAgIC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgaXRlbVxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxuXHQgKiBAc2luY2UgMTAvMDcvMjAxOVxuXHQgKiBAcGFyYW0ge30gcmVzIFxuXHQgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuXHQgKi9cbiAgICBnZXRMaXN0KHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IExhbmd1YWdlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBMYW5ndWFnZUVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBzZXJ2aWNlLmdldExpc3QoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIkFDVElPTi5TVUNDRVNTXCIpLCBycywgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IGRldGFpbCBpdGVtXG4gICAgICogQGF1dGhvciB0aGFuaC5iYXlcbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOFxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0RGV0YWlsKHJlcywgcG9zdERhdGEpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBEZWxldGUgaXRlbVxuICAgICAqIEBhdXRob3IgdGhhbmguYmF5XG4gICAgICogQHNpbmNlIDExLzA3LzIwMThcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGRlbGV0ZUFjdGlvbigpIHtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFNhdmUgYWN0aW9uXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgc2F2ZUFjdGlvbigpIHtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgXG59XG5leHBvcnQgZGVmYXVsdCBMYW5ndWFnZUNvbnRyb2xsZXI7Il19