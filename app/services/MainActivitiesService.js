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

var MainActivitiesService = function (_BaseService) {
	_inherits(MainActivitiesService, _BaseService);

	function MainActivitiesService() {
		_classCallCheck(this, MainActivitiesService);

		return _possibleConstructorReturn(this, (MainActivitiesService.__proto__ || Object.getPrototypeOf(MainActivitiesService)).call(this));
	}

	/**
  * @description Get list
  * @author Long.Pham
  * @since 12/09/2021
  * @param {Object} data
  * @param {function callback} callback 
  */

	_createClass(MainActivitiesService, [{
		key: "getList",
		value: function getList(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var errorLevel = data.errorLevel;
					var errorLevelList = [];
					if (errorLevel.length > 0) {
						for (var i = 0; i < errorLevel.length; i++) {
							errorLevelList.push(errorLevel[i].id);
						}
					}
					data.errorLevelList = errorLevelList.toString();

					var errorType = data.errorType;
					var errorTypeList = [];
					if (errorType.length > 0) {
						for (var _i = 0; _i < errorType.length; _i++) {
							errorTypeList.push(errorType[_i].id);
						}
					}
					data.errorTypeList = errorTypeList.toString();

					var dataStatus = data.dataStatus;
					var statusList = [];
					if (dataStatus.length > 0) {
						for (var _i2 = 0; _i2 < dataStatus.length; _i2++) {
							statusList.push(dataStatus[_i2].id);
						}
					}
					data.statusList = statusList.toString();

					var dataDevice = await db.queryForList("MainActivities.getList", data);
					conn.commit();
					callBack(false, dataDevice);
				} catch (err) {
					console.log("Lỗi rolback", err);
					conn.rollback();
					callBack(true, err);
				}
			});
		}

		/**
   * @description Lấy tổng số dòng
   * @author Long.Pham
   * @since 12/09/2021
   * @param {Object alert} data
   * @param {function callback} callback
   */

	}, {
		key: "getSize",
		value: function getSize(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("MainActivities.getSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Update is_delete = 1
   * @author Long.Pham
   * @since 11/09/2021
   * @param {Object AlertEntity} data
   * @param {function callback} callback
   */

	}, {
		key: "delete",
		value: function _delete(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.delete("MainActivities.delete", data, function (err, rs) {
					return callBack(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callBack(false, e);
			}
		}

		/**
   * @description Update alert
   * @author Long.Pham
   * @since 20/09/2021
   * @param {Object AlertEntity} data
   * @param {function callback} callback
   */

	}, {
		key: "update",
		value: function update(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.update("MainActivities.updateAlert", data);
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
	}, {
		key: "closeAll",
		value: function closeAll(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					// var dataArr = data.dataArr;
					await db.update("MainActivities.closeAll", data);
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

	return MainActivitiesService;
}(_BaseService3.default);

exports.default = MainActivitiesService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9NYWluQWN0aXZpdGllc1NlcnZpY2UuanMiXSwibmFtZXMiOlsiTWFpbkFjdGl2aXRpZXNTZXJ2aWNlIiwiZGF0YSIsImNhbGxCYWNrIiwiZGIiLCJteVNxTERCIiwiYmVnaW5UcmFuc2FjdGlvbiIsImNvbm4iLCJlcnJvckxldmVsIiwiZXJyb3JMZXZlbExpc3QiLCJsZW5ndGgiLCJpIiwicHVzaCIsImlkIiwidG9TdHJpbmciLCJlcnJvclR5cGUiLCJlcnJvclR5cGVMaXN0IiwiZGF0YVN0YXR1cyIsInN0YXR1c0xpc3QiLCJkYXRhRGV2aWNlIiwicXVlcnlGb3JMaXN0IiwiY29tbWl0IiwiZXJyIiwiY29uc29sZSIsImxvZyIsInJvbGxiYWNrIiwiY2FsbGJhY2siLCJMaWJzIiwiY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AiLCJxdWVyeUZvck9iamVjdCIsImUiLCJkZWxldGUiLCJycyIsImxvZ2dlciIsImVycm9yIiwidXBkYXRlIiwiQmFzZVNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSxxQjs7O0FBQ0wsa0NBQWM7QUFBQTs7QUFBQTtBQUdiOztBQUVEOzs7Ozs7Ozs7OzBCQVFRQyxJLEVBQU1DLFEsRUFBVTtBQUN2QixPQUFJQyxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxNQUFHRSxnQkFBSCxDQUFvQixnQkFBZ0JDLElBQWhCLEVBQXNCO0FBQ3pDLFFBQUk7QUFDSCxTQUFJQyxhQUFhTixLQUFLTSxVQUF0QjtBQUNBLFNBQUlDLGlCQUFpQixFQUFyQjtBQUNBLFNBQUlELFdBQVdFLE1BQVgsR0FBb0IsQ0FBeEIsRUFBMkI7QUFDMUIsV0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILFdBQVdFLE1BQS9CLEVBQXVDQyxHQUF2QyxFQUE0QztBQUMzQ0Ysc0JBQWVHLElBQWYsQ0FBb0JKLFdBQVdHLENBQVgsRUFBY0UsRUFBbEM7QUFDQTtBQUNEO0FB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ZSxFQUFmO0FBQ0EsS0FWRCxDQVVFLE9BQU9tQixHQUFQLEVBQVk7QUFDYkMsYUFBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJGLEdBQTNCO0FBQ0FmLFVBQUtrQixRQUFMO0FBQ0F0QixjQUFTLEtBQVQsRUFBZ0JtQixHQUFoQjtBQUNBO0FBQ0QsSUFoQkQ7QUFpQkE7OzsyQkFFUXBCLEksRUFBTUMsUSxFQUFVO0FBQ3hCLE9BQUlDLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FELE1BQUdFLGdCQUFILENBQW9CLGdCQUFnQkMsSUFBaEIsRUFBc0I7QUFDekMsUUFBSTtBQUNIO0FBQ0EsV0FBTUgsR0FBRytCLE1BQUgsQ0FBVSx5QkFBVixFQUFxQ2pDLElBQXJDLENBQU47QUFDQUssVUFBS2MsTUFBTDtBQUNBbEIsY0FBUyxJQUFULEVBQWUsRUFBZjtBQUNBLEtBTEQsQ0FLRSxPQUFPbUIsR0FBUCxFQUFZO0FBQ2JDLGFBQVFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCRixHQUEzQjtBQUNBZixVQUFLa0IsUUFBTDtBQUNBdEIsY0FBUyxLQUFULEVBQWdCbUIsR0FBaEI7QUFDQTtBQUNELElBWEQ7QUFZQTs7OztFQTFJa0NjLHFCOztrQkE0SXJCbkMscUIiLCJmaWxlIjoiTWFpbkFjdGl2aXRpZXNTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTZXJ2aWNlIGZyb20gJy4vQmFzZVNlcnZpY2UnO1xyXG5jbGFzcyBNYWluQWN0aXZpdGllc1NlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDEyLzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cclxuXHRnZXRMaXN0KGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciBlcnJvckxldmVsID0gZGF0YS5lcnJvckxldmVsO1xyXG5cdFx0XHRcdHZhciBlcnJvckxldmVsTGlzdCA9IFtdO1xyXG5cdFx0XHRcdGlmIChlcnJvckxldmVsLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZXJyb3JMZXZlbC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRlcnJvckxldmVsTGlzdC5wdXNoKGVycm9yTGV2ZWxbaV0uaWQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkYXRhLmVycm9yTGV2ZWxMaXN0ID0gZXJyb3JMZXZlbExpc3QudG9TdHJpbmcoKTtcclxuXHJcblx0XHRcdFx0dmFyIGVycm9yVHlwZSA9IGRhdGEuZXJyb3JUeXBlO1xyXG5cdFx0XHRcdHZhciBlcnJvclR5cGVMaXN0ID0gW107XHJcblx0XHRcdFx0aWYgKGVycm9yVHlwZS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGVycm9yVHlwZS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRlcnJvclR5cGVMaXN0LnB1c2goZXJyb3JUeXBlW2ldLmlkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGF0YS5lcnJvclR5cGVMaXN0ID0gZXJyb3JUeXBlTGlzdC50b1N0cmluZygpO1xyXG5cclxuXHRcdFx0XHR2YXIgZGF0YVN0YXR1cyA9IGRhdGEuZGF0YVN0YXR1cztcclxuXHRcdFx0XHR2YXIgc3RhdHVzTGlzdCA9IFtdO1xyXG5cdFx0XHRcdGlmIChkYXRhU3RhdHVzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YVN0YXR1cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRzdGF0dXNMaXN0LnB1c2goZGF0YVN0YXR1c1tpXS5pZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGEuc3RhdHVzTGlzdCA9IHN0YXR1c0xpc3QudG9TdHJpbmcoKTtcclxuXHJcblx0XHRcdFx0dmFyIGRhdGFEZXZpY2UgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluQWN0aXZpdGllcy5nZXRMaXN0XCIsIGRhdGEpO1xyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGFEZXZpY2UpO1xyXG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEzhuqV5IHThu5VuZyBz4buRIGTDsm5nXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTIvMDkvMjAyMVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IGFsZXJ0fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRnZXRTaXplKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJNYWluQWN0aXZpdGllcy5nZXRTaXplXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBpc19kZWxldGUgPSAxXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTEvMDkvMjAyMVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IEFsZXJ0RW50aXR5fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRkZWxldGUoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5kZWxldGUoXCJNYWluQWN0aXZpdGllcy5kZWxldGVcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gY2FsbEJhY2soZXJyLCBycylcclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGFsZXJ0XHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMjAvMDkvMjAyMVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IEFsZXJ0RW50aXR5fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHR1cGRhdGUoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIudXBkYXRlKFwiTWFpbkFjdGl2aXRpZXMudXBkYXRlQWxlcnRcIiwgZGF0YSk7XHJcblx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRjbG9zZUFsbChkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHQvLyB2YXIgZGF0YUFyciA9IGRhdGEuZGF0YUFycjtcclxuXHRcdFx0XHRhd2FpdCBkYi51cGRhdGUoXCJNYWluQWN0aXZpdGllcy5jbG9zZUFsbFwiLCBkYXRhKTtcclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBNYWluQWN0aXZpdGllc1NlcnZpY2U7XHJcbiJdfQ==