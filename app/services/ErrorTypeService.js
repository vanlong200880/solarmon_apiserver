'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseService2 = require('./BaseService');

var _BaseService3 = _interopRequireDefault(_BaseService2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ErrorTypeService = function (_BaseService) {
	_inherits(ErrorTypeService, _BaseService);

	function ErrorTypeService() {
		_classCallCheck(this, ErrorTypeService);

		return _possibleConstructorReturn(this, (ErrorTypeService.__proto__ || Object.getPrototypeOf(ErrorTypeService)).call(this));
	}

	/**
     * @description Get list
     * @author Long.Pham
     * @since 30/07/2019
     * @param {Object ErrorType} data
     * @param {function callback} callback 
     */


	_createClass(ErrorTypeService, [{
		key: 'getList',
		value: function getList(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("ErrorType.getList", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Lấy tổng số dòng
   * @author Long.Pham
      * @since 30/07/2018
   * @param {Object User} data
      * @param {function callback} callback
   */

	}, {
		key: 'getSize',
		value: function getSize(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("ErrorType.getSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
      * @description Insert data
      * @author Long.Pham
      * @since 30/07/2019
      * @param {Object ErrorType} data
      */

	}, {
		key: 'insertErrorType',
		value: function insertErrorType(data, callBack) {
			try {
				var self = this;
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {

						var rs = await db.insert("ErrorType.insertErrorType", data);
						var curId = rs.insertId;

						if (!rs) {
							conn.rollback();
							callBack(false, {});
							return;
						}

						// insert table ErrorType detail
						var dataDetail = data.data;
						if (dataDetail.length > 0) {
							for (var i = 0; i < dataDetail.length; i++) {
								dataDetail[i].id_error_type = curId;
							}
							rs = await db.insert("ErrorType.insertErrorTypeDetail", { dataDetail: dataDetail });
						}

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
			} catch (e) {
				console.log('error', e);
				callBack(false, e);
			}
		}

		/**
      * @description Update data
      * @author Long.Pham
      * @since 11/07/2019
      * @param {Object ErrorType} data
      * @param {function callback} callback
      */

	}, {
		key: 'updateErrorType',
		value: function updateErrorType(data, callBack) {
			var self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {

					var rs = await db.delete("ErrorType.deleteErrorTypeDetail", data);
					rs = await db.update("ErrorType.updateErrorType", data);
					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					// insert table ErrorType detail
					var dataDetail = data.data;
					if (dataDetail.length > 0) {
						await db.insert("ErrorType.insertErrorTypeDetail", { dataDetail: dataDetail });
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

		/**
      * @description Update status
      * @author Long.Pham
      * @since 11/07/2019
      * @param {Object ErrorType} data
      * @param {function callback} callback
      */

	}, {
		key: 'updateStatus',
		value: function updateStatus(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.update("ErrorType.updateStatus", data, function (err, rs) {
					return callBack(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callBack(false, e);
			}
		}

		/**
      * @description Update is_delete = 1
      * @author Long.Pham
      * @since 11/07/2019
      * @param {Object ErrorType} data
      * @param {function callback} callback
      */

	}, {
		key: 'delete',
		value: function _delete(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.delete("ErrorType.delete", data, function (err, rs) {
					return callBack(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callBack(false, e);
			}
		}

		/**
  * get detail ErrorType
  * @param {*} data 
  * @param {*} callBack 
  */

	}, {
		key: 'getDetail',
		value: function getDetail(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.queryForList("ErrorType.getDetail", param);
						var data = rs[0][0];
						data.data = rs[1];
						conn.commit();
						callBack(false, data);
					} catch (err) {
						console.log("Lỗi rolback", err);
						conn.rollback();
						callBack(true, err);
					}
				});
			} catch (err) {
				// console.log('error get material order for voucher out', err);
				if (conn) {
					conn.rollback();
				}
				callBack(true, err);
			}
		}

		/**
   * @description Get all
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object ErrorType} data
   * @param {function callback} callback 
   */

	}, {
		key: 'getDropDownList',
		value: function getDropDownList(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("ErrorType.getDropDownList", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}
	}]);

	return ErrorTypeService;
}(_BaseService3.default);

exports.default = ErrorTypeService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9FcnJvclR5cGVTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkVycm9yVHlwZVNlcnZpY2UiLCJkYXRhIiwiY2FsbGJhY2siLCJMaWJzIiwiaXNCbGFuayIsImN1cnJlbnRfcm93IiwibWF4X3JlY29yZCIsIkNvbnN0YW50cyIsImNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wIiwiZGIiLCJteVNxTERCIiwicXVlcnlGb3JMaXN0IiwiZSIsImNvbnNvbGUiLCJsb2ciLCJxdWVyeUZvck9iamVjdCIsImNhbGxCYWNrIiwic2VsZiIsImJlZ2luVHJhbnNhY3Rpb24iLCJjb25uIiwicnMiLCJpbnNlcnQiLCJjdXJJZCIsImluc2VydElkIiwicm9sbGJhY2siLCJkYXRhRGV0YWlsIiwibGVuZ3RoIiwiaSIsImlkX2Vycm9yX3R5cGUiLCJjb21taXQiLCJlcnIiLCJkZWxldGUiLCJ1cGRhdGUiLCJsb2dnZXIiLCJlcnJvciIsInBhcmFtIiwiQmFzZVNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSxnQjs7O0FBQ0wsNkJBQWM7QUFBQTs7QUFBQTtBQUdiOztBQUVEOzs7Ozs7Ozs7OzswQkFPUUMsSSxFQUFNQyxRLEVBQVU7QUFDdkIsT0FBSTtBQUNILFFBQUksQ0FBQ0MsS0FBS0MsT0FBTCxDQUFhSCxJQUFiLENBQUwsRUFBeUI7QUFDeEJBLFVBQUtJLFdBQUwsR0FBb0IsT0FBT0osS0FBS0ksV0FBWixJQUEyQixXQUE1QixHQUEyQyxDQUEzQyxHQUErQ0osS0FBS0ksV0FBdkU7QUFDQUosVUFBS0ssVUFBTCxHQUFrQkMsVUFBVU4sSUFBVixDQUFlSyxVQUFqQztBQUNBO0FBQ0RMLFdBQU9FLEtBQUtLLDBCQUFMLENBQWdDUCxJQUFoQyxDQUFQO0FBQ0EsUUFBSVEsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR0UsWUFBSCxDQUFnQixtQkFBaEIsRUFBcUNWLElBQXJDLEVBQTJDQyxR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QVo7QUFDQSxXQUFPVixTQUFTLEtBQVQsRUFBZ0JVLENBQWhCLENBQVA7QUFDQTtBQUNEOzs7O0VBL042QndCLHFCOztrQkFrT2hCcEMsZ0IiLCJmaWxlIjoiRXJyb3JUeXBlU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2VydmljZSBmcm9tICcuL0Jhc2VTZXJ2aWNlJztcclxuY2xhc3MgRXJyb3JUeXBlU2VydmljZSBleHRlbmRzIEJhc2VTZXJ2aWNlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3RcclxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXHJcbiAgICAgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG4gICAgICogQHBhcmFtIHtPYmplY3QgRXJyb3JUeXBlfSBkYXRhXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuICAgICAqL1xyXG5cdGdldExpc3QoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEpKSB7XHJcblx0XHRcdFx0ZGF0YS5jdXJyZW50X3JvdyA9ICh0eXBlb2YgZGF0YS5jdXJyZW50X3JvdyA9PSAndW5kZWZpbmVkJykgPyAwIDogZGF0YS5jdXJyZW50X3JvdztcclxuXHRcdFx0XHRkYXRhLm1heF9yZWNvcmQgPSBDb25zdGFudHMuZGF0YS5tYXhfcmVjb3JkO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvckxpc3QoXCJFcnJvclR5cGUuZ2V0TGlzdFwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEzhuqV5IHThu5VuZyBz4buRIGTDsm5nXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuICAgICAqIEBzaW5jZSAzMC8wNy8yMDE4XHJcblx0ICogQHBhcmFtIHtPYmplY3QgVXNlcn0gZGF0YVxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRnZXRTaXplKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJFcnJvclR5cGUuZ2V0U2l6ZVwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gSW5zZXJ0IGRhdGFcclxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXHJcbiAgICAgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG4gICAgICogQHBhcmFtIHtPYmplY3QgRXJyb3JUeXBlfSBkYXRhXHJcbiAgICAgKi9cclxuXHRpbnNlcnRFcnJvclR5cGUoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblxyXG5cdFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiRXJyb3JUeXBlLmluc2VydEVycm9yVHlwZVwiLCBkYXRhKTtcclxuXHRcdFx0XHRcdHZhciBjdXJJZCA9IHJzLmluc2VydElkO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBpbnNlcnQgdGFibGUgRXJyb3JUeXBlIGRldGFpbFxyXG5cdFx0XHRcdFx0bGV0IGRhdGFEZXRhaWwgPSBkYXRhLmRhdGE7XHJcblx0XHRcdFx0XHRpZiAoZGF0YURldGFpbC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YURldGFpbC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFEZXRhaWxbaV0uaWRfZXJyb3JfdHlwZSA9IGN1cklkO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiRXJyb3JUeXBlLmluc2VydEVycm9yVHlwZURldGFpbFwiLCB7IGRhdGFEZXRhaWwgfSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yJywgZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgZGF0YVxyXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cclxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdCBFcnJvclR5cGV9IGRhdGFcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcbiAgICAgKi9cclxuXHR1cGRhdGVFcnJvclR5cGUoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIuZGVsZXRlKFwiRXJyb3JUeXBlLmRlbGV0ZUVycm9yVHlwZURldGFpbFwiLCBkYXRhKTtcclxuXHRcdFx0XHRycyA9IGF3YWl0IGRiLnVwZGF0ZShcIkVycm9yVHlwZS51cGRhdGVFcnJvclR5cGVcIiwgZGF0YSk7XHJcblx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIGluc2VydCB0YWJsZSBFcnJvclR5cGUgZGV0YWlsXHJcblx0XHRcdFx0bGV0IGRhdGFEZXRhaWwgPSBkYXRhLmRhdGE7XHJcblx0XHRcdFx0aWYgKGRhdGFEZXRhaWwubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0YXdhaXQgZGIuaW5zZXJ0KFwiRXJyb3JUeXBlLmluc2VydEVycm9yVHlwZURldGFpbFwiLCB7IGRhdGFEZXRhaWwgfSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgc3RhdHVzXHJcbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG4gICAgICogQHNpbmNlIDExLzA3LzIwMTlcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0IEVycm9yVHlwZX0gZGF0YVxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuICAgICAqL1xyXG5cdHVwZGF0ZVN0YXR1cyhkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnVwZGF0ZShcIkVycm9yVHlwZS51cGRhdGVTdGF0dXNcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gY2FsbEJhY2soZXJyLCBycylcclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgaXNfZGVsZXRlID0gMVxyXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cclxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdCBFcnJvclR5cGV9IGRhdGFcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcbiAgICAgKi9cclxuXHRkZWxldGUoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5kZWxldGUoXCJFcnJvclR5cGUuZGVsZXRlXCIsIGRhdGEsIChlcnIsIHJzKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGNhbGxCYWNrKGVyciwgcnMpXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcclxuXHRcdFx0Y2FsbEJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCogZ2V0IGRldGFpbCBFcnJvclR5cGVcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHRnZXREZXRhaWwocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkVycm9yVHlwZS5nZXREZXRhaWxcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0dmFyIGRhdGEgPSByc1swXVswXTtcclxuXHRcdFx0XHRcdGRhdGEuZGF0YSA9IHJzWzFdO1xyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdlcnJvciBnZXQgbWF0ZXJpYWwgb3JkZXIgZm9yIHZvdWNoZXIgb3V0JywgZXJyKTtcclxuXHRcdFx0aWYgKGNvbm4pIHtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgYWxsXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IEVycm9yVHlwZX0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cdCBnZXREcm9wRG93bkxpc3QoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvckxpc3QoXCJFcnJvclR5cGUuZ2V0RHJvcERvd25MaXN0XCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBFcnJvclR5cGVTZXJ2aWNlO1xyXG4iXX0=