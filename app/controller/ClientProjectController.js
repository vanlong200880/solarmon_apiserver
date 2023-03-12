'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractManagerController = require('../core/AbstractManagerController');

var _AbstractManagerController2 = _interopRequireDefault(_AbstractManagerController);

var _ProjectEntity = require('../entities/ProjectEntity');

var _ProjectEntity2 = _interopRequireDefault(_ProjectEntity);

var _ClientProjectService = require('../services/ClientProjectService');

var _ClientProjectService2 = _interopRequireDefault(_ClientProjectService);

var _sync = require('sync');

var _sync2 = _interopRequireDefault(_sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClientProjectController = function (_AbstractManagerContr) {
    _inherits(ClientProjectController, _AbstractManagerContr);

    function ClientProjectController() {
        _classCallCheck(this, ClientProjectController);

        return _possibleConstructorReturn(this, (ClientProjectController.__proto__ || Object.getPrototypeOf(ClientProjectController)).apply(this, arguments));
    }

    _createClass(ClientProjectController, [{
        key: 'getAllProjectByEmployeeId',


        /**
         * @description Get all project sidebar
         * @author Long.Pham
         * @since 10/09/2021
         * @param {} res 
         * @param {*} postData 
         */
        value: function getAllProjectByEmployeeId(res, postData) {
            try {
                var service = new _ClientProjectService2.default();
                var entity = new _ProjectEntity2.default();
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

    }, {
        key: 'getListProjectByEmployee',
        value: function getListProjectByEmployee(res, postData) {
            try {
                var service = new _ClientProjectService2.default();
                var entity = new _ProjectEntity2.default();
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
         * @description Get List project summary
         * @author Long.Pham
         * @since 10/09/2021
         * @param {} res 
         * @param {*} postData 
         */

    }, {
        key: 'getListPlantSummary',
        value: function getListPlantSummary(res, postData) {
            try {
                var service = new _ClientProjectService2.default();
                var entity = new _ProjectEntity2.default();
                entity = Object.assign({}, entity, postData);
                service.getListPlantSummary(entity, function (err, rs) {
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
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

    }, {
        key: 'getList',
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
         * @author thanh.bay
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
    }]);

    return ClientProjectController;
}(_AbstractManagerController2.default);

exports.default = ClientProjectController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL0NsaWVudFByb2plY3RDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkNsaWVudFByb2plY3RDb250cm9sbGVyIiwicmVzIiwicG9zdERhdGEiLCJzZXJ2aWNlIiwiQ2xpZW50UHJvamVjdFNlcnZpY2UiLCJlbnRpdHkiLCJQcm9qZWN0RW50aXR5IiwiT2JqZWN0IiwiYXNzaWduIiwiZ2V0QWxsUHJvamVjdEJ5RW1wbG95ZWVJZCIsImVyciIsInJzIiwicmVzRGF0YSIsIkxpYnMiLCJyZXR1cm5Kc29uUmVzdWx0IiwiaTE4biIsIl9fIiwic2VuZCIsImUiLCJsb2dnZXIiLCJlcnJvciIsImdldExpc3RQcm9qZWN0QnlFbXBsb3llZSIsImdldExpc3RQcm9qZWN0QnlFbXBsb3llZVNpemUiLCJlcnIxIiwicnMxIiwidG90YWxSb3ciLCJnZXRMaXN0UGxhbnRTdW1tYXJ5IiwiQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRU1BLHVCOzs7Ozs7Ozs7Ozs7O0FBRUY7Ozs7Ozs7a0RBTzBCQyxHLEVBQUtDLFEsRUFBVTtBQUNyQyxnQkFBSTtBQUNBLG9CQUFJQyxVQUFVLElBQUlDLDhCQUFKLEVBQWQ7QUFDQSxvQkFBSUMsU0FBUyxJQUFJQyx1QkFBSixFQUFiO0FBQ0FELHlCQUFTRSxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkgsTUFBbEIsRUFBMEJILFFBQTFCLENBQVQ7QUFDQUMsd0JBQVFNLHlCQUFSLENBQWtDSixNQUFsQyxFQUEwQyxVQUFVSyxHQUFWLEVBQWVDLEVBQWYsRUFBbUI7QUFDekQsd0JBQUksQ0FBQ0QsR0FBTCxFQUFVO0FBQ05FLGtDQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixJQUF0QixFQUE0QkMsS0FBS0MsRUFBTCxDQUFRLGdCQUFSLENBQTVCLEVBQXVETCxFQUF2RCxFQUEyRCxDQUEz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Q0QsR0FBTCxFQUFVO0FBQ05FLGtDQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixJQUF0QixFQUE0QkMsS0FBS0MsRUFBTCxDQUFRLGdCQUFSLENBQTVCLEVBQXVETCxFQUF2RCxFQUEwRCxDQUExRCxDQUFWO0FBQ0gscUJBRkQsTUFFTztBQUNIQyxrQ0FBVUMsS0FBS0MsZ0JBQUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtBQUtDLEVBQUwsQ0FBUSxhQUFSLENBQTdCLEVBQXFELEVBQXJELEVBQXlELENBQXpELENBQVY7QUFDSDtBQUNEZix3QkFBSWdCLElBQUosQ0FBU0wsT0FBVDtBQUNILGlCQVBEO0FBUUgsYUFaRCxDQVlFLE9BQU9NLENBQVAsRUFBVTtBQUNSLHFCQUFLQyxNQUFMLENBQVlDLEtBQVosQ0FBa0IsVUFBVUYsQ0FBNUI7QUFDQSxvQkFBSU4sVUFBVSxFQUFkO0FBQ0FBLDBCQUFVQyxLQUFLQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QkMsS0FBS0MsRUFBTCxDQUFRLFlBQVIsQ0FBN0IsRUFBb0QsRUFBRSxTQUFTRSxJQUFJLEVBQWYsRUFBcEQsRUFBeUUsQ0FBekUsQ0FBVjtBQUNBakIsb0JBQUlnQixJQUFKLENBQVNMLE9BQVQ7QUFDSDtBQUVKOztBQUdEOzs7Ozs7Ozs7O2dDQU9RWCxHLEVBQUtDLFEsRUFBVSxDQUd0Qjs7QUFHRDs7Ozs7Ozs7OztrQ0FPVUQsRyxFQUFLQyxRLEVBQVUsQ0FFeEI7O0FBRUQ7Ozs7Ozs7Ozs7cUNBT2FELEcsRUFBS0MsUSxFQUFVLENBRTNCOztBQUlEOzs7Ozs7Ozs7O3lDQU9pQkQsRyxFQUFLQyxRLEVBQVUsQ0FFL0I7Ozs7RUFsSmlDeUIsbUM7O2tCQXFKdkIzQix1QiIsImZpbGUiOiJDbGllbnRQcm9qZWN0Q29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlcic7XG5pbXBvcnQgUHJvamVjdEVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Qcm9qZWN0RW50aXR5JztcbmltcG9ydCBDbGllbnRQcm9qZWN0U2VydmljZSBmcm9tICcuLi9zZXJ2aWNlcy9DbGllbnRQcm9qZWN0U2VydmljZSc7XG5pbXBvcnQgU3luYyBmcm9tICdzeW5jJztcblxuY2xhc3MgQ2xpZW50UHJvamVjdENvbnRyb2xsZXIgZXh0ZW5kcyBBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgYWxsIHByb2plY3Qgc2lkZWJhclxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDEwLzA5LzIwMjFcbiAgICAgKiBAcGFyYW0ge30gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0QWxsUHJvamVjdEJ5RW1wbG95ZWVJZChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBDbGllbnRQcm9qZWN0U2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBQcm9qZWN0RW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0QWxsUHJvamVjdEJ5RW1wbG95ZWVJZChlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihcIkzhu5dpOiBcIiArIGUpO1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBMaXN0IHByb2plY3RcbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHt9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldExpc3RQcm9qZWN0QnlFbXBsb3llZShyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBDbGllbnRQcm9qZWN0U2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBQcm9qZWN0RW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0TGlzdFByb2plY3RCeUVtcGxveWVlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldExpc3RQcm9qZWN0QnlFbXBsb3llZVNpemUoZW50aXR5LCBmdW5jdGlvbiAoZXJyMSwgcnMxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVycjEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIHJzMS50b3RhbFJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgTGlzdCBwcm9qZWN0IHN1bW1hcnlcbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHt9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgICBnZXRMaXN0UGxhbnRTdW1tYXJ5KHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IENsaWVudFByb2plY3RTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IFByb2plY3RFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXRMaXN0UGxhbnRTdW1tYXJ5KGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKFwiTOG7l2k6IFwiICsgZSk7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDEwLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0ge30gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0TGlzdChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIFxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IGRldGFpbCBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0RGV0YWlsKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRGVsZXRlIGl0ZW1cbiAgICAgKiBAYXV0aG9yIHRoYW5oLmJheVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE4XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBkZWxldGVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICBcbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFNhdmUgYWN0aW9uXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgYXN5bmMgc2F2ZUFjdGlvbihyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIFxuICAgIH1cblxufVxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50UHJvamVjdENvbnRyb2xsZXI7Il19