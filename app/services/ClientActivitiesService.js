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

var ClientActivitiesService = function (_BaseService) {
	_inherits(ClientActivitiesService, _BaseService);

	function ClientActivitiesService() {
		_classCallCheck(this, ClientActivitiesService);

		return _possibleConstructorReturn(this, (ClientActivitiesService.__proto__ || Object.getPrototypeOf(ClientActivitiesService)).call(this));
	}

	/**
  * @description Get list
  * @author Long.Pham
  * @since 12/09/2021
  * @param {Object} data
  * @param {function callback} callback 
  */

	_createClass(ClientActivitiesService, [{
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

					var dataDevice = await db.queryForList("ClientActivities.getList", data);
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
				db.queryForObject("ClientActivities.getSize", data, callback);
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
				db.delete("ClientActivities.delete", data, function (err, rs) {
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
					var dataFollow = data.dataFollow;
					var rs = await db.delete("ClientActivities.deleteEmployeeFollowAlert", data);
					if (dataFollow.length > 0) {
						rs = await db.insert("ClientActivities.insertEmployeeFollowAlert", { dataFollow: dataFollow });
					}

					rs = await db.update("ClientActivities.updateAlert", data);
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
					await db.update("ClientActivities.closeAll", data);
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

	return ClientActivitiesService;
}(_BaseService3.default);

exports.default = ClientActivitiesService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9DbGllbnRBY3Rpdml0aWVzU2VydmljZS5qcyJdLCJuYW1lcyI6WyJDbGllbnRBY3Rpdml0aWVzU2VydmljZSIsImRhdGEiLCJjYWxsQmFjayIsImRiIiwibXlTcUxEQiIsImJlZ2luVHJhbnNhY3Rpb24iLCJjb25uIiwiZXJyb3JMZXZlbCIsImVycm9yTGV2ZWxMaXN0IiwibGVuZ3RoIiwiaSIsInB1c2giLCJpZCIsInRvU3RyaW5nIiwiZXJyb3JUeXBlIiwiZXJyb3JUeXBlTGlzdCIsImRhdGFTdGF0dXMiLCJzdGF0dXNMaXN0IiwiZGF0YURldmljZSIsInF1ZXJ5Rm9yTGlzdCIsImNvbW1pdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJyb2xsYmFjayIsImNhbGxiYWNrIiwiTGlicyIsImNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wIiwicXVlcnlGb3JPYmplY3QiLCJlIiwiZGVsZXRlIiwicnMiLCJsb2dnZXIiLCJlcnJvciIsImRhdGFGb2xsb3ciLCJpbnNlcnQiLCJ1cGRhdGUiLCJCYXNlU2VydmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBQ01BLHVCOzs7QUFDTCxvQ0FBYztBQUFBOztBQUFBO0FBR2I7O0FBRUQ7Ozs7Ozs7Ozs7MEJBUVFDLEksRUFBTUMsUSxFQUFVO0FBQ3ZCLE9BQUlDLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FELE1BQUdFLGdCQUFILENBQW9CLGdCQUFnQkMsSUFBaEIsRUFBc0I7QUFDekMsUUFBSTtBQUNILFNBQUlDLGFBQWFOLEtBQUtNLFVBQXRCO0FBQ0EsU0FBSUMsaUJBQWlCLEVBQXJCO0FBQ0EsU0FBSUQsV0FBV0UsTUFBWCxHQUFvQixDQUF4QixFQUEyQjtBQUMxQixXQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsV0FBV0UsTUFBL0IsRUFBdUNDLEdBQXZDLEVBQTRDO0FBQzNDRixzQkFBZUcsSUFBZixDQUFvQkosV0FBV0csQ0FB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Z0MsTUFBSCxDQUFVLDRDQUFWLEVBQXdELEVBQUVELHNCQUFGLEVBQXhELENBQVg7QUFDQTs7QUFFREgsVUFBSyxNQUFNNUIsR0FBR2lDLE1BQUgsQ0FBVSw4QkFBVixFQUEwQ25DLElBQTFDLENBQVg7QUFDQSxTQUFJLENBQUM4QixFQUFMLEVBQVM7QUFDUnpCLFdBQUtrQixRQUFMO0FBQ0F0QixlQUFTLEtBQVQsRUFBZ0IsRUFBaEI7QUFDQTtBQUNBOztBQUVESSxVQUFLYyxNQUFMO0FBQ0FsQixjQUFTLElBQVQsRUFBZSxFQUFmO0FBQ0EsS0FoQkQsQ0FnQkUsT0FBT21CLEdBQVAsRUFBWTtBQUNiQyxhQUFRQyxHQUFSLENBQVksYUFBWixFQUEyQkYsR0FBM0I7QUFDQWYsVUFBS2tCLFFBQUw7QUFDQXRCLGNBQVMsS0FBVCxFQUFnQm1CLEdBQWhCO0FBQ0E7QUFDRCxJQXRCRDtBQXVCQTs7OzJCQUVRcEIsSSxFQUFNQyxRLEVBQVU7QUFDeEIsT0FBSUMsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsTUFBR0UsZ0JBQUgsQ0FBb0IsZ0JBQWdCQyxJQUFoQixFQUFzQjtBQUN6QyxRQUFJO0FBQ0g7QUFDQSxXQUFNSCxHQUFHaUMsTUFBSCxDQUFVLDJCQUFWLEVBQXVDbkMsSUFBdkMsQ0FBTjtBQUNBSyxVQUFLYyxNQUFMO0FBQ0FsQixjQUFTLElBQVQsRUFBZSxFQUFmO0FBQ0EsS0FMRCxDQUtFLE9BQU9tQixHQUFQLEVBQVk7QUFDYkMsYUFBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJGLEdBQTNCO0FBQ0FmLFVBQUtrQixRQUFMO0FBQ0F0QixjQUFTLEtBQVQsRUFBZ0JtQixHQUFoQjtBQUNBO0FBQ0QsSUFYRDtBQVlBOzs7O0VBaEpvQ2dCLHFCOztrQkFrSnZCckMsdUIiLCJmaWxlIjoiQ2xpZW50QWN0aXZpdGllc1NlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNlcnZpY2UgZnJvbSAnLi9CYXNlU2VydmljZSc7XHJcbmNsYXNzIENsaWVudEFjdGl2aXRpZXNTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3RcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMi8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHJcblx0Z2V0TGlzdChkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR2YXIgZXJyb3JMZXZlbCA9IGRhdGEuZXJyb3JMZXZlbDtcclxuXHRcdFx0XHR2YXIgZXJyb3JMZXZlbExpc3QgPSBbXTtcclxuXHRcdFx0XHRpZiAoZXJyb3JMZXZlbC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGVycm9yTGV2ZWwubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0ZXJyb3JMZXZlbExpc3QucHVzaChlcnJvckxldmVsW2ldLmlkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGF0YS5lcnJvckxldmVsTGlzdCA9IGVycm9yTGV2ZWxMaXN0LnRvU3RyaW5nKCk7XHJcblxyXG5cdFx0XHRcdHZhciBlcnJvclR5cGUgPSBkYXRhLmVycm9yVHlwZTtcclxuXHRcdFx0XHR2YXIgZXJyb3JUeXBlTGlzdCA9IFtdO1xyXG5cdFx0XHRcdGlmIChlcnJvclR5cGUubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBlcnJvclR5cGUubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0ZXJyb3JUeXBlTGlzdC5wdXNoKGVycm9yVHlwZVtpXS5pZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGEuZXJyb3JUeXBlTGlzdCA9IGVycm9yVHlwZUxpc3QudG9TdHJpbmcoKTtcclxuXHJcblx0XHRcdFx0dmFyIGRhdGFTdGF0dXMgPSBkYXRhLmRhdGFTdGF0dXM7XHJcblx0XHRcdFx0dmFyIHN0YXR1c0xpc3QgPSBbXTtcclxuXHRcdFx0XHRpZiAoZGF0YVN0YXR1cy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFTdGF0dXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0c3RhdHVzTGlzdC5wdXNoKGRhdGFTdGF0dXNbaV0uaWQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkYXRhLnN0YXR1c0xpc3QgPSBzdGF0dXNMaXN0LnRvU3RyaW5nKCk7XHJcblxyXG5cdFx0XHRcdHZhciBkYXRhRGV2aWNlID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50QWN0aXZpdGllcy5nZXRMaXN0XCIsIGRhdGEpO1xyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGFEZXZpY2UpO1xyXG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEzhuqV5IHThu5VuZyBz4buRIGTDsm5nXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTIvMDkvMjAyMVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IGFsZXJ0fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRnZXRTaXplKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJDbGllbnRBY3Rpdml0aWVzLmdldFNpemVcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGlzX2RlbGV0ZSA9IDFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3QgQWxlcnRFbnRpdHl9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cdGRlbGV0ZShkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmRlbGV0ZShcIkNsaWVudEFjdGl2aXRpZXMuZGVsZXRlXCIsIGRhdGEsIChlcnIsIHJzKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGNhbGxCYWNrKGVyciwgcnMpXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcclxuXHRcdFx0Y2FsbEJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBhbGVydFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDIwLzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdCBBbGVydEVudGl0eX0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0dXBkYXRlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciBkYXRhRm9sbG93ID0gZGF0YS5kYXRhRm9sbG93O1xyXG5cdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLmRlbGV0ZShcIkNsaWVudEFjdGl2aXRpZXMuZGVsZXRlRW1wbG95ZWVGb2xsb3dBbGVydFwiLCBkYXRhKTtcclxuXHRcdFx0XHRpZihkYXRhRm9sbG93Lmxlbmd0aCA+IDApe1xyXG5cdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJDbGllbnRBY3Rpdml0aWVzLmluc2VydEVtcGxveWVlRm9sbG93QWxlcnRcIiwgeyBkYXRhRm9sbG93IH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRycyA9IGF3YWl0IGRiLnVwZGF0ZShcIkNsaWVudEFjdGl2aXRpZXMudXBkYXRlQWxlcnRcIiwgZGF0YSk7XHJcblx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRjbG9zZUFsbChkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHQvLyB2YXIgZGF0YUFyciA9IGRhdGEuZGF0YUFycjtcclxuXHRcdFx0XHRhd2FpdCBkYi51cGRhdGUoXCJDbGllbnRBY3Rpdml0aWVzLmNsb3NlQWxsXCIsIGRhdGEpO1xyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IENsaWVudEFjdGl2aXRpZXNTZXJ2aWNlO1xyXG4iXX0=