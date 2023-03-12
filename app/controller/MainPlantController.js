'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseController2 = require('../core/BaseController');

var _BaseController3 = _interopRequireDefault(_BaseController2);

var _MainPlantService = require('../services/MainPlantService');

var _MainPlantService2 = _interopRequireDefault(_MainPlantService);

var _ProjectEntity = require('../entities/ProjectEntity');

var _ProjectEntity2 = _interopRequireDefault(_ProjectEntity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainPlantController = function (_BaseController) {
    _inherits(MainPlantController, _BaseController);

    function MainPlantController() {
        _classCallCheck(this, MainPlantController);

        return _possibleConstructorReturn(this, (MainPlantController.__proto__ || Object.getPrototypeOf(MainPlantController)).call(this));
    }

    /**
     * @description Get detail item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */


    _createClass(MainPlantController, [{
        key: 'getDetail',
        value: function getDetail(res, postData) {
            try {
                var service = new _MainPlantService2.default();
                var entity = new _ProjectEntity2.default();
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
         * @description Get detail item
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'getChartData',
        value: function getChartData(res, postData) {
            try {
                var service = new _MainPlantService2.default();
                var entity = new _ProjectEntity2.default();
                entity = Object.assign({}, entity, postData);
                service.getChartData(entity, function (err, rs) {
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
         * @description Save action
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'saveAction',
        value: async function saveAction(res, postData) {}

        /**
         * @description Get List item
         * @author Long.Pham
         * @since 14/09/2021
         * @param {} res 
         * @param {*} postData 
         */

    }, {
        key: 'getList',
        value: function getList(res, postData) {}

        /**
         * @description Delete item
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'deleteAction',
        value: function deleteAction(res, postData) {}
    }]);

    return MainPlantController;
}(_BaseController3.default);

exports.default = MainPlantController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL01haW5QbGFudENvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiTWFpblBsYW50Q29udHJvbGxlciIsInJlcyIsInBvc3REYXRhIiwic2VydmljZSIsIk1haW5QbGFudFNlcnZpY2UiLCJlbnRpdHkiLCJQcm9qZWN0RW50aXR5IiwiT2JqZWN0IiwiYXNzaWduIiwiZ2V0RGV0YWlsIiwiZXJyIiwicnMiLCJyZXNEYXRhIiwiTGlicyIsInJldHVybkpzb25SZXN1bHQiLCJpMThuIiwiX18iLCJzZW5kIiwiZSIsImdldENoYXJ0RGF0YSIsIkJhc2VDb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRU1BLG1COzs7QUFDRixtQ0FBYztBQUFBOztBQUFBO0FBRWI7O0FBRUQ7Ozs7Ozs7Ozs7O2tDQU9VQyxHLEVBQUtDLFEsRUFBVTtBQUNyQixnQkFBSTtBQUNBLG9CQUFJQyxVQUFVLElBQUlDLDBCQUFKLEVBQWQ7QUFDQSxvQkFBSUMsU0FBUyxJQUFJQyx1QkFBSixFQUFiO0FBQ0FELHlCQUFTRSxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkgsTUFBbEIsRUFBMEJILFFBQTFCLENBQVQ7QUFDQUMsd0JBQVFNLFNBQVIsQ0FBa0JKLE1BQWxCLEVBQTBCLFVBQVVLLEdBQVYsRUFBZUMsRUFBZixFQUFtQjtBQUN6Qyx3QkFBSUMsVUFBVSxFQUFkO0FBQ0Esd0JBQUksQ0FBQ0YsR0FBTCxFQUFVO0FBQ05FLGtDQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixJQUF0QixFQUE0QkMsS0FBS0MsRUFBTCxDQUFRLGdCQUFSLENBQTVCLEVBQXVETCxFQUF2RCxFQUEyRCxDQUEzRCxDQUFWO0FBQ0gscUJBRkQsTUFFTztBQUNIQyxrQ0FBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtBQUtDLEVBQUwsQ0FBUSxhQUFSLENBQTdCLEVBQXFELEVBQXJELEVBQXlELENBQXpELENBQVY7QUFDSDtBQUNEZix3QkFBSWdCLElBQUosQ0FBU0wsT0FBVDtBQUNILGlCQVJEO0FBU0gsYUFiRCxDQWFFLE9BQU9NLENBQVAsRUFBVTtBQUNSLG9CQUFJTixVQUFVLEVBQWQ7QUFDQUEsMEJBQVVDLEtBQUtDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsWUFBUixDQUE3QixFQUFvRCxFQUFFLFNBQVNFLElBQUksRUFBZixFQUFwRCxFQUF5RSxDQUF6RSxDQUFWO0FBQ0FqQixvQkFBSWdCLElBQUosQ0FBU0wsT0FBVDtBQUNIO0FBQ0o7O0FBSUQ7Ozs7Ozs7Ozs7cUNBT2NYLEcsRUFBS0MsUSxFQUFVO0FBQ3pCLGdCQUFJO0FBQ0Esb0JBQUlDLFVBQVUsSUFBSUMsMEJBQUosRUFBZDtBQUNBLG9CQUFJQyxTQUFTLElBQUlDLHVCQUFKLEVBQWI7QUFDQUQseUJBQVNFLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxNQUFsQixFQUEwQkgsUUFBMUIsQ0FBVDtBQUNBQyx3QkFBUWdCLFlBQVIsQ0FBcUJkLE1BQXJCLEVBQTZCLFVBQVVLLEdBQVYsRUFBZUMsRUFBZixFQUFtQjtBQUM1Qyx3QkFBSUMsVUFBVSxFQUFkO0FBQ0Esd0JBQUksQ0FBQ0YsR0FBTCxFQUFVO0FBQ05FLGtDQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixJQUF0QixFQUE0QkMsS0FBS0MsRUFBTCxDQUFRLGdCQUFSLENBQTVCLEVBQXVETCxFQUF2RCxFQUEyRCxDQUEzRCxDQUFWO0FBQ0gscUJBRkQsTUFFTztBQUNIQyxrQ0FBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtBQUtDLEVBQUwsQ0FBUSxhQUFSLENBQTdCLEVBQXFELEVBQXJELEVBQXlELENBQXpELENBQVY7QUFDSDtBQUNEZix3QkFBSWdCLElBQUosQ0FBU0wsT0FBVDtBQUNILGlCQVJEO0FBU0gsYUFiRCxDQWFFLE9BQU9NLENBQVAsRUFBVTtBQUNSLG9CQUFJTixVQUFVLEVBQWQ7QUFDQUEsMEJBQVVDLEtBQUtDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsWUFBUixDQUE3QixFQUFvRCxFQUFFLFNBQVNFLElBQUksRUFBZixFQUFwRCxFQUF5RSxDQUF6RSxDQUFWO0FBQ0FqQixvQkFBSWdCLElBQUosQ0FBU0wsT0FBVDtBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7Ozs7eUNBT2lCWCxHLEVBQUtDLFEsRUFBVSxDQUUvQjs7QUFJRDs7Ozs7Ozs7OztnQ0FPUUQsRyxFQUFLQyxRLEVBQVUsQ0FHdEI7O0FBS0Q7Ozs7Ozs7Ozs7cUNBT2NELEcsRUFBS0MsUSxFQUFVLENBRTVCOzs7O0VBcEc2QmtCLHdCOztrQkF3R25CcEIsbUIiLCJmaWxlIjoiTWFpblBsYW50Q29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlQ29udHJvbGxlciBmcm9tICcuLi9jb3JlL0Jhc2VDb250cm9sbGVyJztcbmltcG9ydCBNYWluUGxhbnRTZXJ2aWNlIGZyb20gJy4uL3NlcnZpY2VzL01haW5QbGFudFNlcnZpY2UnO1xuaW1wb3J0IFByb2plY3RFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvUHJvamVjdEVudGl0eSc7XG5cbmNsYXNzIE1haW5QbGFudENvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBkZXRhaWwgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldERldGFpbChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc2VydmljZSA9IG5ldyBNYWluUGxhbnRTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IFByb2plY3RFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXREZXRhaWwoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIFxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgZGV0YWlsIGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICAgZ2V0Q2hhcnREYXRhKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gbmV3IE1haW5QbGFudFNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgUHJvamVjdEVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJ0RGF0YShlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGFjdGlvblxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGFzeW5jIHNhdmVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICBcbiAgICB9XG5cbiAgICBcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgTGlzdCBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTQvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7fSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBnZXRMaXN0KHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgXG5cbiAgICB9XG5cblxuICAgXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRGVsZXRlIGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICAgZGVsZXRlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgXG4gICAgfVxuXG5cbn1cbmV4cG9ydCBkZWZhdWx0IE1haW5QbGFudENvbnRyb2xsZXI7Il19