"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseService2 = require("./BaseService");

var _BaseService3 = _interopRequireDefault(_BaseService2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClientConfigService = function (_BaseService) {
	_inherits(ClientConfigService, _BaseService);

	function ClientConfigService() {
		_classCallCheck(this, ClientConfigService);

		return _possibleConstructorReturn(this, (ClientConfigService.__proto__ || Object.getPrototypeOf(ClientConfigService)).call(this));
	}

	/**
  * @description Get device by project hash_id
  * @author Long.Pham
  * @since 12/09/2021
  * @param {Object} data
  * @param {function callback} callback 
  */

	_createClass(ClientConfigService, [{
		key: "getListAllDeviceByProject",
		value: function getListAllDeviceByProject(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.queryForList("ClientConfig.getListAllDeviceByProject", data);
					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					conn.commit();
					callBack(false, rs);
				} catch (err) {
					console.log("Lỗi rolback", err);
					conn.rollback();
					callBack(true, err);
				}
			});
		}

		/**
  * get detail
  * @param {*} data 
  * @param {*} callBack 
  */

	}, {
		key: "getDeviceDetail",
		value: function getDeviceDetail(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.queryForObject("ClientConfig.getDeviceDetail", param);
						conn.commit();
						callBack(false, rs);
					} catch (err) {
						console.log("Lỗi rolback", err);
						conn.rollback();
						callBack(true, err);
					}
				});
			} catch (err) {
				if (conn) {
					conn.rollback();
				}
				callBack(true, err);
			}
		}

		/**
   * @description Update data
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object Role} data
   * @param {function callback} callback
   */

	}, {
		key: "updateDevice",
		value: function updateDevice(data, callBack) {
			var self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.update("ClientConfig.updateDevice", data);
					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					conn.commit();
					callBack(true, {});
				} catch (err) {
					console.log("Lỗi rolback", err);
					conn.rollback();
					callBack(false, err);
				}
			});
		}
	}]);

	return ClientConfigService;
}(_BaseService3.default);

exports.default = ClientConfigService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9DbGllbnRDb25maWdTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkNsaWVudENvbmZpZ1NlcnZpY2UiLCJkYXRhIiwiY2FsbEJhY2siLCJkYiIsIm15U3FMREIiLCJiZWdpblRyYW5zYWN0aW9uIiwiY29ubiIsInJzIiwicXVlcnlGb3JMaXN0Iiwicm9sbGJhY2siLCJjb21taXQiLCJlcnIiLCJjb25zb2xlIiwibG9nIiwicGFyYW0iLCJxdWVyeUZvck9iamVjdCIsInNlbGYiLCJ1cGRhdGUiLCJCYXNlU2VydmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBQ01BLG1COzs7QUFDTCxnQ0FBYztBQUFBOztBQUFBO0FBR2I7O0FBRUQ7Ozs7Ozs7Ozs7NENBUTBCQyxJLEVBQU1DLFEsRUFBVTtBQUN6QyxPQUFJQyxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxNQUFHRSxnQkFBSCxDQUFvQixnQkFBZ0JDLElBQWhCLEVBQXNCO0FBQ3pDLFFBQUk7QUFDSCxTQUFJQyxLQUFLLE1BQU1KLEdBQUdLLFlBQUgsQ0FBZ0Isd0NBQWhCLEVBQTBEUCxJQUExRCxDQUFmO0FBQ0EsU0FBSSxDQUFDTSxFQUFMLEVBQVM7QUFDUkQsV0FBS0csUUFBTDtBQUNBUCxlQUFTLEtBQVQsRUFBZ0IsRUFBaEI7QUFDQTtBQUNBOztBQUVESSxVQUFLSSxNQUFMO0FBQ0FSLGNBQVMsS0FBVCxFQUFnQkssRUFBaEI7QUFDQSxLQVZELENBVUUsT0FBT0ksR0FBUCxFQUFZO0FBQ2JDLGFBQVFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCRixHQUEzQjtBQUNBTCxVQUFLRyxRQUFMO0FBQ0FQLGNBQVMsSUFBVCxFQUFlUyxHQUFmO0FBQ0E7QUFDRCxJQWhCRDtBQWlCQTs7QUFJRDs7Ozs7Ozs7a0NBS2dCRyxLLEVBQU9aLFEsRUFBVTtBQUNoQyxPQUFJO0FBQ0gsUUFBSUMsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR0UsZ0JBQUgsQ0FBb0IsZ0JBQWdCQyxJQUFoQixFQUFzQjtBQUN6QyxTQUFJO0FBQ0gsVUFBSUMsS0FBSyxNQUFNSixHQUFHWSxjQUFILENBQWtCLDhCQUFsQixFQUFrREQsS0FBbEQsQ0FBZjtBQUNBUixXQUFLSSxNQUFMO0FBQ0FSLGVBQVMsS0FBVCxFQUFnQkssRUFBaEI7QUFDQSxNQUpELENBSUUsT0FBT0ksR0FBUCxFQUFZO0FBQ2JDLGNBQVFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCRixHQUEzQjtBQUNBTCxXQUFLRyxRQUFMO0FBQ0FQLGVBQVMsSUFBVCxFQUFlUyxHQUFmO0FBQ0E7QUFDRCxLQVZEO0FBV0EsSUFiRCxDQWFFLE9BQU9BLEdBQVAsRUFBWTtBQUNiLFFBQUlMLElBQUosRUFBVTtBQUNUQSxVQUFLRyxRQUFMO0FBQ0E7QUFDRFAsYUFBUyxJQUFULEVBQWVTLEdBQWY7QUFDQTtBQUNEOztBQUVEOzs7Ozs7Ozs7OytCQVFjVixJLEVBQU1DLFEsRUFBVTtBQUM3QixPQUFJYyxPQUFPLElBQVg7QUFDQSxPQUFJYixLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxNQUFHRSxnQkFBSCxDQUFvQixnQkFBZ0JDLElBQWhCLEVBQXNCO0FBQ3pDLFFBQUk7QUFDSCxTQUFJQyxLQUFLLE1BQU1KLEdBQUdjLE1BQUgsQ0FBVSwyQkFBVixFQUF1Q2hCLElBQXZDLENBQWY7QUFDQSxTQUFJLENBQUNNLEVBQUwsRUFBUztBQUNSRCxXQUFLRyxRQUFMO0FBQ0FQLGVBQVMsS0FBVCxFQUFnQixFQUFoQjtBQUNBO0FBQ0E7O0FBRURJLFVBQUtJLE1BQUw7QUFDQVIsY0FBUyxJQUFULEVBQWUsRUFBZjtBQUNBLEtBVkQsQ0FVRSxPQUFPUyxHQUFQLEVBQVk7QUFDYkMsYUFBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJGLEdBQTNCO0FBQ0FMLFVBQUtHLFFBQUw7QUFDQVAsY0FBUyxLQUFULEVBQWdCUyxHQUFoQjtBQUNBO0FBQ0QsSUFoQkQ7QUFpQkE7Ozs7RUE1RmdDTyxxQjs7a0JBOEZuQmxCLG1CIiwiZmlsZSI6IkNsaWVudENvbmZpZ1NlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNlcnZpY2UgZnJvbSAnLi9CYXNlU2VydmljZSc7XHJcbmNsYXNzIENsaWVudENvbmZpZ1NlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgZGV2aWNlIGJ5IHByb2plY3QgaGFzaF9pZFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDEyLzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cclxuXHRnZXRMaXN0QWxsRGV2aWNlQnlQcm9qZWN0KGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudENvbmZpZy5nZXRMaXN0QWxsRGV2aWNlQnlQcm9qZWN0XCIsIGRhdGEpO1xyXG5cdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBycyk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHRcclxuXHQvKipcclxuXHQqIGdldCBkZXRhaWxcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHRnZXREZXZpY2VEZXRhaWwocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiQ2xpZW50Q29uZmlnLmdldERldmljZURldGFpbFwiLCBwYXJhbSk7XHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHJzKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGRhdGFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgUm9sZX0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblxyXG5cdCB1cGRhdGVEZXZpY2UoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIudXBkYXRlKFwiQ2xpZW50Q29uZmlnLnVwZGF0ZURldmljZVwiLCBkYXRhKTtcclxuXHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZXJyKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50Q29uZmlnU2VydmljZTtcclxuIl19