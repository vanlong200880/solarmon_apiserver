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

var MainConfigService = function (_BaseService) {
	_inherits(MainConfigService, _BaseService);

	function MainConfigService() {
		_classCallCheck(this, MainConfigService);

		return _possibleConstructorReturn(this, (MainConfigService.__proto__ || Object.getPrototypeOf(MainConfigService)).call(this));
	}

	/**
  * @description Get device by project hash_id
  * @author Long.Pham
  * @since 12/09/2021
  * @param {Object} data
  * @param {function callback} callback 
  */

	_createClass(MainConfigService, [{
		key: "getListDeviceSensor",
		value: function getListDeviceSensor(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.queryForList("MainConfig.getListDeviceSensor", data);
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
   * @description Get device by project hash_id
   * @author Long.Pham
   * @since 12/09/2021
   * @param {Object} data
   * @param {function callback} callback 
   */

	}, {
		key: "getListAllDeviceByProject",
		value: function getListAllDeviceByProject(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.queryForList("MainConfig.getListAllDeviceByProject", data);
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
						var rs = await db.queryForObject("MainConfig.getDeviceDetail", param);
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
					var rs = await db.update("MainConfig.updateDevice", data);
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

	return MainConfigService;
}(_BaseService3.default);

exports.default = MainConfigService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9NYWluQ29uZmlnU2VydmljZS5qcyJdLCJuYW1lcyI6WyJNYWluQ29uZmlnU2VydmljZSIsImRhdGEiLCJjYWxsQmFjayIsImRiIiwibXlTcUxEQiIsImJlZ2luVHJhbnNhY3Rpb24iLCJjb25uIiwicnMiLCJxdWVyeUZvckxpc3QiLCJyb2xsYmFjayIsImNvbW1pdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJwYXJhbSIsInF1ZXJ5Rm9yT2JqZWN0Iiwic2VsZiIsInVwZGF0ZSIsIkJhc2VTZXJ2aWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFDTUEsaUI7OztBQUNMLDhCQUFjO0FBQUE7O0FBQUE7QUFHYjs7QUFHRDs7Ozs7Ozs7OztzQ0FRcUJDLEksRUFBTUMsUSxFQUFVO0FBQ3BDLE9BQUlDLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FELE1BQUdFLGdCQUFILENBQW9CLGdCQUFnQkMsSUFBaEIsRUFBc0I7QUFDekMsUUFBSTtBQUNILFNBQUlDLEtBQUssTUFBTUosR0FBR0ssWUFBSCxDQUFnQixnQ0FBaEIsRUFBa0RQLElBQWxELENBQWY7QUFDQSxTQUFJLENBQUNNLEVBQUwsRUFBUztBQUNSRCxXQUFLRyxRQUFMO0FBQ0FQLGVBQVMsS0FBVCxFQUFnQixFQUFoQjtBQUNBO0FBQ0E7O0FBRURJLFVBQUtJLE1BQUw7QUFDQVIsY0FBUyxLQUFULEVBQWdCSyxFQUFoQjtBQUNBLEtBVkQsQ0FVRSxPQUFPSSxHQUFQLEVBQVk7QUFDYkMsYUFBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJGLEdBQTNCO0FBQ0FMLFVBQUtHLFFBQUw7QUFDQVAsY0FBUyxJQUFULEVBQWVTLEdBQWY7QUFDQTtBQUNELElBaEJEO0FBaUJBOztBQUVEOzs7Ozs7Ozs7OzRDQVEwQlYsSSxFQUFNQyxRLEVBQVU7QUFDekMsT0FBSUMsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsTUFBR0UsZ0JBQUgsQ0FBb0IsZ0JBQWdCQyxJQUFoQixFQUFzQjtBQUN6QyxRQUFJO0FBQ0gsU0FBSUMsS0FBSyxNQUFNSixHQUFHSyxZQUFILENBQWdCLHNDQUFoQixFQUF3RFAsSUFBeEQsQ0FBZjtBQUNBLFNBQUksQ0FBQ00sRUFBTCxFQUFTO0FBQ1JELFdBQUtHLFFBQUw7QUFDQVAsZUFBUyxLQUFULEVBQWdCLEVBQWhCO0FBQ0E7QUFDQTs7QUFFREksVUFBS0ksTUFBTDtBQUNBUixjQUFTLEtBQVQsRUFBZ0JLLEVBQWhCO0FBQ0EsS0FWRCxDQVVFLE9BQU9JLEdBQVAsRUFBWTtBQUNiQyxhQUFRQyxHQUFSLENBQVksYUFBWixFQUEyQkYsR0FBM0I7QUFDQUwsVUFBS0csUUFBTDtBQUNBUCxjQUFTLElBQVQsRUFBZVMsR0FBZjtBQUNBO0FBQ0QsSUFoQkQ7QUFpQkE7O0FBSUQ7Ozs7Ozs7O2tDQUtnQkcsSyxFQUFPWixRLEVBQVU7QUFDaEMsT0FBSTtBQUNILFFBQUlDLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FELE9BQUdFLGdCQUFILENBQW9CLGdCQUFnQkMsSUFBaEIsRUFBc0I7QUFDekMsU0FBSTtBQUNILFVBQUlDLEtBQUssTUFBTUosR0FBR1ksY0FBSCxDQUFrQiw0QkFBbEIsRUFBZ0RELEtBQWhELENBQWY7QUFDQVIsV0FBS0ksTUFBTDtBQUNBUixlQUFTLEtBQVQsRUFBZ0JLLEVBQWhCO0FBQ0EsTUFKRCxDQUlFLE9BQU9JLEdBQVAsRUFBWTtBQUNiQyxjQUFRQyxHQUFSLENBQVksYUFBWixFQUEyQkYsR0FBM0I7QUFDQUwsV0FBS0csUUFBTDtBQUNBUCxlQUFTLElBQVQsRUFBZVMsR0FBZjtBQUNBO0FBQ0QsS0FWRDtBQVdBLElBYkQsQ0FhRSxPQUFPQSxHQUFQLEVBQVk7QUFDYixRQUFJTCxJQUFKLEVBQVU7QUFDVEEsVUFBS0csUUFBTDtBQUNBO0FBQ0RQLGFBQVMsSUFBVCxFQUFlUyxHQUFmO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7Ozs7OzsrQkFRY1YsSSxFQUFNQyxRLEVBQVU7QUFDN0IsT0FBSWMsT0FBTyxJQUFYO0FBQ0EsT0FBSWIsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsTUFBR0UsZ0JBQUgsQ0FBb0IsZ0JBQWdCQyxJQUFoQixFQUFzQjtBQUN6QyxRQUFJO0FBQ0gsU0FBSUMsS0FBSyxNQUFNSixHQUFHYyxNQUFILENBQVUseUJBQVYsRUFBcUNoQixJQUFyQyxDQUFmO0FBQ0EsU0FBSSxDQUFDTSxFQUFMLEVBQVM7QUFDUkQsV0FBS0csUUFBTDtBQUNBUCxlQUFTLEtBQVQsRUFBZ0IsRUFBaEI7QUFDQTtBQUNBOztBQUVESSxVQUFLSSxNQUFMO0FBQ0FSLGNBQVMsSUFBVCxFQUFlLEVBQWY7QUFDQSxLQVZELENBVUUsT0FBT1MsR0FBUCxFQUFZO0FBQ2JDLGFBQVFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCRixHQUEzQjtBQUNBTCxVQUFLRyxRQUFMO0FBQ0FQLGNBQVMsS0FBVCxFQUFnQlMsR0FBaEI7QUFDQTtBQUNELElBaEJEO0FBaUJBOzs7O0VBMUg4Qk8scUI7O2tCQTRIakJsQixpQiIsImZpbGUiOiJNYWluQ29uZmlnU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2VydmljZSBmcm9tICcuL0Jhc2VTZXJ2aWNlJztcclxuY2xhc3MgTWFpbkNvbmZpZ1NlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHR9XHJcblxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgZGV2aWNlIGJ5IHByb2plY3QgaGFzaF9pZFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDEyLzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cclxuXHQgZ2V0TGlzdERldmljZVNlbnNvcihkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR2YXIgcnMgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluQ29uZmlnLmdldExpc3REZXZpY2VTZW5zb3JcIiwgZGF0YSk7XHJcblx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHJzKTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBkZXZpY2UgYnkgcHJvamVjdCBoYXNoX2lkXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTIvMDkvMjAyMVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0ICovXHJcblxyXG5cdGdldExpc3RBbGxEZXZpY2VCeVByb2plY3QoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpbkNvbmZpZy5nZXRMaXN0QWxsRGV2aWNlQnlQcm9qZWN0XCIsIGRhdGEpO1xyXG5cdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBycyk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHRcclxuXHQvKipcclxuXHQqIGdldCBkZXRhaWxcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHRnZXREZXZpY2VEZXRhaWwocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTWFpbkNvbmZpZy5nZXREZXZpY2VEZXRhaWxcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBycyk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRpZiAoY29ubikge1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBkYXRhXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTEvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IFJvbGV9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cclxuXHQgdXBkYXRlRGV2aWNlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnVwZGF0ZShcIk1haW5Db25maWcudXBkYXRlRGV2aWNlXCIsIGRhdGEpO1xyXG5cdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBNYWluQ29uZmlnU2VydmljZTtcclxuIl19