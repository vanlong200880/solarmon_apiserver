'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractManagerController = require('../core/AbstractManagerController');

var _AbstractManagerController2 = _interopRequireDefault(_AbstractManagerController);

var _ReadingAIService = require('../services/ReadingAIService');

var _ReadingAIService2 = _interopRequireDefault(_ReadingAIService);

var _sync = require('sync');

var _sync2 = _interopRequireDefault(_sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReadingAIController = function (_AbstractManagerContr) {
    _inherits(ReadingAIController, _AbstractManagerContr);

    function ReadingAIController() {
        _classCallCheck(this, ReadingAIController);

        return _possibleConstructorReturn(this, (ReadingAIController.__proto__ || Object.getPrototypeOf(ReadingAIController)).apply(this, arguments));
    }

    _createClass(ReadingAIController, [{
        key: 'getDataRaw',


        /**
         * @description Get data raw
         * @author Long.Pham
         * @since 10/09/2021
         * @param {*} res 
         * @param {*} postData 
         */
        value: function getDataRaw(res, postData) {
            try {
                var service = new _ReadingAIService2.default();
                var _resData = {};
                console.log("status: ", postData.status, " - deviceID: ", postData.deviceID);
                // const logger = FLLogger.getLogger(postData.deviceID);
                // logger.error(postData);

                switch (status) {
                    case 'ok':
                        // Save data to database
                        if (!Libs.isBlank(postData.deviceID)) {
                            (0, _sync2.default)(function () {
                                service.insertReadingAI(postData, function (err, rs) {
                                    if (rs && err) {
                                        _resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), {}, 0);
                                    } else {
                                        _resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                                    }
                                    res.send(_resData);
                                });
                            });
                        } else {
                            // save error device not exits
                            _resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                            res.send(_resData);
                        }
                        break;
                    default:
                        // Save error disconnected
                        _resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), {}, 0);
                        res.send(_resData);
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

    }, {
        key: 'getList',
        value: function getList(res, postData) {}

        /**
         * @description Get detail item
         * @author Long.Pham
         * @since 10/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'getDetail',
        value: function getDetail(res, postData) {}

        /**
         * @description Delete item
         * @author Long.Pham
         * @since 10/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'deleteAction',
        value: function deleteAction(res, postData) {}

        /**
         * @description Save action
         * @author Long.Pham
         * @since 10/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'saveAction',
        value: async function saveAction(res, postData) {}
    }]);

    return ReadingAIController;
}(_AbstractManagerController2.default);

exports.default = ReadingAIController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL1JlYWRpbmdBSUNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiUmVhZGluZ0FJQ29udHJvbGxlciIsInJlcyIsInBvc3REYXRhIiwic2VydmljZSIsIlJlYWRpbmdBSVNlcnZpY2UiLCJyZXNEYXRhIiwiY29uc29sZSIsImxvZyIsInN0YXR1cyIsImRldmljZUlEIiwiTGlicyIsImlzQmxhbmsiLCJpbnNlcnRSZWFkaW5nQUkiLCJlcnIiLCJycyIsInJldHVybkpzb25SZXN1bHQiLCJpMThuIiwiX18iLCJzZW5kIiwiZSIsIkFic3RyYWN0TWFuYWdlckNvbnRyb2xsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTUEsbUI7Ozs7Ozs7Ozs7Ozs7QUFFRjs7Ozs7OzttQ0FPV0MsRyxFQUFLQyxRLEVBQVU7QUFDdEIsZ0JBQUk7QUFDQSxvQkFBSUMsVUFBVSxJQUFJQywwQkFBSixFQUFkO0FBQ0Esb0JBQUlDLFdBQVUsRUFBZDtBQUNBQyx3QkFBUUMsR0FBUixDQUFZLFVBQVosRUFBd0JMLFNBQVNNLE1BQWpDLEVBQXlDLGVBQXpDLEVBQTBETixTQUFTTyxRQUFuRTtBQUNBO0FBQ0E7O0FBRUEsd0JBQVFELE1BQVI7QUFDSSx5QkFBSyxJQUFMO0FBQ0k7QUFDQSw0QkFBSSxDQUFDRSxLQUFLQyxPQUFMLENBQWFULFNBQVNPLFFBQXRCLENBQUwsRUFBc0M7QUFDbEMsZ0RBQUssWUFBWTtBQUNiTix3Q0FBUVMsZUFBUixDQUF3QlYsUUFBeEIsRUFBa0MsVUFBVVcsR0FBVixFQUFlQyxFQUFmLEVBQW1CO0FBQ2pELHdDQUFJQSxNQUFNRCxHQUFWLEVBQWU7QUFDWFIsbURBQVVLLEtBQUtLLGdCQUFMLENBQXNCLElBQXRCLEVBQTRCQyxLQUFLQyxFQUFMLENBQVEscUJBQVIsQ0FBNUIsRUFBNEQsRUFBNUQsRUFBZ0UsQ0FBaEUsQ0FBVjtBQUNILHFDQUZELE1BRU87QUFDSFosbURBQVVLLEtBQUtLLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsa0JBQVIsQ0FBN0IsRUFBMEQsRUFBRSxTQUFTSixHQUFYLEVBQTFELEVBQTRFLENBQTVFLENBQVY7QUFDSDtBQUNEWix3Q0FBSWlCLElBQUosQ0FBU2IsUUFBVDtBQUNILGlDQVBEO0FBUUgsNkJBVEQ7QUFVSCx5QkFYRCxNQVdPO0FBQ0g7QUFDQUEsdUNBQVVLLEtBQUtLLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCQyxLQUFLQyxFQUFMLENBQVEsa0JBQVIsQ0FBN0IsRUFBMEQsRUFBMUQsRUFBOEQsQ0FBOUQsQ0FBVjtBQUNBaEIsZ0NBQUlpQixJQUFKLENBQVNiLFFBQVQ7QUFDSDtBQUNEO0FBQ0o7QUFDSTtBQUNBQSxtQ0FBVUssS0FBS0ssZ0JBQUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtBQUtDLEVBQUwsQ0FBUSxrQkFBUixDQUE3QixFQUEwRCxFQUExRCxFQUE4RCxDQUE5RCxDQUFWO0FBQ0FoQiw0QkFBSWlCLElBQUosQ0FBU2IsUUFBVDtBQUNBO0FBeEJSO0FBMkJILGFBbENELENBa0NFLE9BQU9jLENBQVAsRUFBVTtBQUNSLG9CQUFJZCxVQUFVSyxLQUFLSyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QkMsS0FBS0MsRUFBTCxDQUFRLFlBQVIsQ0FBN0IsRUFBb0QsRUFBRSxTQUFTRSxJQUFJLEVBQWYsRUFBcEQsRUFBeUUsQ0FBekUsQ0FBZDtBQUNBbEIsb0JBQUlpQixJQUFKLENBQVNiLE9BQVQ7QUFDSDtBQUNKOztBQUlEOzs7Ozs7Ozs7O2dDQU9RSixHLEVBQUtDLFEsRUFBVSxDQUN0Qjs7QUFFRDs7Ozs7Ozs7OztrQ0FPVUQsRyxFQUFLQyxRLEVBQVUsQ0FDeEI7O0FBRUQ7Ozs7Ozs7Ozs7cUNBT2FELEcsRUFBS0MsUSxFQUFVLENBRTNCOztBQUVEOzs7Ozs7Ozs7O3lDQU9pQkQsRyxFQUFLQyxRLEVBQVUsQ0FFL0I7Ozs7RUE1RjZCa0IsbUM7O2tCQStGbkJwQixtQiIsImZpbGUiOiJSZWFkaW5nQUlDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0TWFuYWdlckNvbnRyb2xsZXIgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyJztcbmltcG9ydCBSZWFkaW5nQUlTZXJ2aWNlIGZyb20gJy4uL3NlcnZpY2VzL1JlYWRpbmdBSVNlcnZpY2UnO1xuaW1wb3J0IFN5bmMgZnJvbSAnc3luYyc7XG5cbmNsYXNzIFJlYWRpbmdBSUNvbnRyb2xsZXIgZXh0ZW5kcyBBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgZGF0YSByYXdcbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBnZXREYXRhUmF3KHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IFJlYWRpbmdBSVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCByZXNEYXRhID0ge307XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN0YXR1czogXCIsIHBvc3REYXRhLnN0YXR1cywgXCIgLSBkZXZpY2VJRDogXCIsIHBvc3REYXRhLmRldmljZUlEKTtcbiAgICAgICAgICAgIC8vIGNvbnN0IGxvZ2dlciA9IEZMTG9nZ2VyLmdldExvZ2dlcihwb3N0RGF0YS5kZXZpY2VJRCk7XG4gICAgICAgICAgICAvLyBsb2dnZXIuZXJyb3IocG9zdERhdGEpO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHN0YXR1cykge1xuICAgICAgICAgICAgICAgIGNhc2UgJ29rJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gU2F2ZSBkYXRhIHRvIGRhdGFiYXNlXG4gICAgICAgICAgICAgICAgICAgIGlmICghTGlicy5pc0JsYW5rKHBvc3REYXRhLmRldmljZUlEKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5pbnNlcnRSZWFkaW5nQUkocG9zdERhdGEsIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChycyAmJiBlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfU1VDQ0VTUycpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNhdmUgZXJyb3IgZGV2aWNlIG5vdCBleGl0c1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfRkFJTCcpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAvLyBTYXZlIGVycm9yIGRpc2Nvbm5lY3RlZFxuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9GQUlMJyksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgTGlzdCBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTAvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7fSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBnZXRMaXN0KHJlcywgcG9zdERhdGEpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IGRldGFpbCBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTAvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0RGV0YWlsKHJlcywgcG9zdERhdGEpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRGVsZXRlIGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBkZWxldGVBY3Rpb24ocmVzLCBwb3N0RGF0YSkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFNhdmUgYWN0aW9uXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTAvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgYXN5bmMgc2F2ZUFjdGlvbihyZXMsIHBvc3REYXRhKSB7XG5cbiAgICB9XG5cbn1cbmV4cG9ydCBkZWZhdWx0IFJlYWRpbmdBSUNvbnRyb2xsZXI7Il19