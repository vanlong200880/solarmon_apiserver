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

var ErrorService = function (_BaseService) {
	_inherits(ErrorService, _BaseService);

	function ErrorService() {
		_classCallCheck(this, ErrorService);

		return _possibleConstructorReturn(this, (ErrorService.__proto__ || Object.getPrototypeOf(ErrorService)).call(this));
	}

	/**
     * @description Get list
     * @author Long.Pham
     * @since 30/07/2019
     * @param {Object Error} data
     * @param {function callback} callback 
     */


	_createClass(ErrorService, [{
		key: 'getList',
		value: function getList(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("Error.getList", data, callback);
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
				db.queryForObject("Error.getSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
      * @description Insert data
      * @author Long.Pham
      * @since 30/07/2019
      * @param {Object Error} data
      */

	}, {
		key: 'insertError',
		value: function insertError(data, callBack) {
			try {
				var self = this;
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {

						var rs = await db.insert("Error.insertError", data);
						var curId = rs.insertId;

						if (!rs) {
							conn.rollback();
							callBack(false, {});
							return;
						}

						// insert table Error detail
						var dataDetail = data.data;
						if (dataDetail.length > 0) {
							for (var i = 0; i < dataDetail.length; i++) {
								dataDetail[i].id_error = curId;
							}
							rs = await db.insert("Error.insertErrorDetail", { dataDetail: dataDetail });
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
      * @param {Object Error} data
      * @param {function callback} callback
      */

	}, {
		key: 'updateError',
		value: function updateError(data, callBack) {
			var self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {

					var rs = await db.delete("Error.deleteErrorDetail", data);
					rs = await db.update("Error.updateError", data);
					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					// insert table Error detail
					var dataDetail = data.data;
					if (dataDetail.length > 0) {
						await db.insert("Error.insertErrorDetail", { dataDetail: dataDetail });
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
      * @param {Object Error} data
      * @param {function callback} callback
      */

	}, {
		key: 'updateStatus',
		value: function updateStatus(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.update("Error.updateStatus", data, function (err, rs) {
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
      * @param {Object Error} data
      * @param {function callback} callback
      */

	}, {
		key: 'delete',
		value: function _delete(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.delete("Error.delete", data, function (err, rs) {
					return callBack(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callBack(false, e);
			}
		}

		/**
  * get detail Error
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
						var rs = await db.queryForList("Error.getDetail", param);
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
	}]);

	return ErrorService;
}(_BaseService3.default);

exports.default = ErrorService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9FcnJvclNlcnZpY2UuanMiXSwibmFtZXMiOlsiRXJyb3JTZXJ2aWNlIiwiZGF0YSIsImNhbGxiYWNrIiwiTGlicyIsImlzQmxhbmsiLCJjdXJyZW50X3JvdyIsIm1heF9yZWNvcmQiLCJDb25zdGFudHMiLCJjb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcCIsImRiIiwibXlTcUxEQiIsInF1ZXJ5Rm9yTGlzdCIsImUiLCJjb25zb2xlIiwibG9nIiwicXVlcnlGb3JPYmplY3QiLCJjYWxsQmFjayIsInNlbGYiLCJiZWdpblRyYW5zYWN0aW9uIiwiY29ubiIsInJzIiwiaW5zZXJ0IiwiY3VySWQiLCJpbnNlcnRJZCIsInJvbGxiYWNrIiwiZGF0YURldGFpbCIsImxlbmd0aCIsImkiLCJpZF9lcnJvciIsImNvbW1pdCIsImVyciIsImRlbGV0ZSIsInVwZGF0ZSIsImxvZ2dlciIsImVycm9yIiwicGFyYW0iLCJCYXNlU2VydmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBQ01BLFk7OztBQUNMLHlCQUFjO0FBQUE7O0FBQUE7QUFHYjs7QUFFRDs7Ozs7Ozs7Ozs7MEJBT1FDLEksRUFBTUMsUSxFQUFVO0FBQ3ZCLE9BQUk7QUFDSCxRQUFJLENBQUNDLEtBQUtDLE9BQUwsQ0FBYUgsSUFBYixDQUFMLEVBQXlCO0FBQ3hCQSxVQUFLSSxXQUFMLEdBQW9CLE9BQU9KLEtBQUtJLFdBQVosSUFBMkIsV0FBNUIsR0FBMkMsQ0FBM0MsR0FBK0NKLEtBQUtJLFdBQXZFO0FBQ0FKLFVBQUtLLFVBQUwsR0FBa0JDLFVBQVVOLElBQVYsQ0FBZUssVUFBakM7QUFDQTtBQUNETCxXQUFPRSxLQUFLSywwQkFBTCxDQUFnQ1AsSUFBaEMsQ0FBUDtBQUNBLFFBQUlRLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FELE9BQUdFLFlBQUgsQ0FBZ0IsZUFBaEIsRUFBaUNWLElBQWpDLEVBQXVDQyxRQUF2QztBQUNBLElBUkQs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TCxDQUFZQyxLQUFaLENBQWtCdEIsQ0FBbEI7QUFDQUksYUFBUyxLQUFULEVBQWdCSixDQUFoQjtBQUNBO0FBQ0Q7O0FBR0Q7Ozs7Ozs7OzRCQUtVdUIsSyxFQUFPbkIsUSxFQUFVO0FBQzFCLE9BQUk7QUFDSCxRQUFJUCxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxPQUFHUyxnQkFBSCxDQUFvQixnQkFBZ0JDLElBQWhCLEVBQXNCO0FBQ3pDLFNBQUk7QUFDSCxVQUFJQyxLQUFLLE1BQU1YLEdBQUdFLFlBQUgsQ0FBZ0IsaUJBQWhCLEVBQW1Dd0IsS0FBbkMsQ0FBZjtBQUNBLFVBQUlsQyxPQUFPbUIsR0FBRyxDQUFILEVBQU0sQ0FBTixDQUFYO0FBQ0FuQixXQUFLQSxJQUFMLEdBQVltQixHQUFHLENBQUgsQ0FBWjtBQUNBRCxXQUFLVSxNQUFMO0FBQ0FiLGVBQVMsS0FBVCxFQUFnQmYsSUFBaEI7QUFDQSxNQU5ELENBTUUsT0FBTzZCLEdBQVAsRUFBWTtBQUNiakIsY0FBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJnQixHQUEzQjtBQUNBWCxXQUFLSyxRQUFMO0FBQ0FSLGVBQVMsSUFBVCxFQUFlYyxHQUFmO0FBQ0E7QUFDRCxLQVpEO0FBYUEsSUFmRCxDQWVFLE9BQU9BLEdBQVAsRUFBWTtBQUNiO0FBQ0EsUUFBSVgsSUFBSixFQUFVO0FBQ1RBLFVBQUtLLFFBQUw7QUFDQTtBQUNEUixhQUFTLElBQVQsRUFBZWMsR0FBZjtBQUNBO0FBQ0Q7Ozs7RUE3TXlCTSxxQjs7a0JBK01acEMsWSIsImZpbGUiOiJFcnJvclNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNlcnZpY2UgZnJvbSAnLi9CYXNlU2VydmljZSc7XHJcbmNsYXNzIEVycm9yU2VydmljZSBleHRlbmRzIEJhc2VTZXJ2aWNlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3RcclxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXHJcbiAgICAgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG4gICAgICogQHBhcmFtIHtPYmplY3QgRXJyb3J9IGRhdGFcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG4gICAgICovXHJcblx0Z2V0TGlzdChkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YSkpIHtcclxuXHRcdFx0XHRkYXRhLmN1cnJlbnRfcm93ID0gKHR5cGVvZiBkYXRhLmN1cnJlbnRfcm93ID09ICd1bmRlZmluZWQnKSA/IDAgOiBkYXRhLmN1cnJlbnRfcm93O1xyXG5cdFx0XHRcdGRhdGEubWF4X3JlY29yZCA9IENvbnN0YW50cy5kYXRhLm1heF9yZWNvcmQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yTGlzdChcIkVycm9yLmdldExpc3RcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBM4bqleSB04buVbmcgc+G7kSBkw7JuZ1xyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcbiAgICAgKiBAc2luY2UgMzAvMDcvMjAxOFxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IFVzZXJ9IGRhdGFcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0Z2V0U2l6ZShkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiRXJyb3IuZ2V0U2l6ZVwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gSW5zZXJ0IGRhdGFcclxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXHJcbiAgICAgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG4gICAgICogQHBhcmFtIHtPYmplY3QgRXJyb3J9IGRhdGFcclxuICAgICAqL1xyXG5cdGluc2VydEVycm9yKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cclxuXHRcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLmluc2VydChcIkVycm9yLmluc2VydEVycm9yXCIsIGRhdGEpO1xyXG5cdFx0XHRcdFx0dmFyIGN1cklkID0gcnMuaW5zZXJ0SWQ7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIGluc2VydCB0YWJsZSBFcnJvciBkZXRhaWxcclxuXHRcdFx0XHRcdGxldCBkYXRhRGV0YWlsID0gZGF0YS5kYXRhO1xyXG5cdFx0XHRcdFx0aWYgKGRhdGFEZXRhaWwubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFEZXRhaWwubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRGV0YWlsW2ldLmlkX2Vycm9yID0gY3VySWQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJFcnJvci5pbnNlcnRFcnJvckRldGFpbFwiLCB7IGRhdGFEZXRhaWwgfSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yJywgZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgZGF0YVxyXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cclxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdCBFcnJvcn0gZGF0YVxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuICAgICAqL1xyXG5cdHVwZGF0ZUVycm9yKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLmRlbGV0ZShcIkVycm9yLmRlbGV0ZUVycm9yRGV0YWlsXCIsIGRhdGEpO1xyXG5cdFx0XHRcdHJzID0gYXdhaXQgZGIudXBkYXRlKFwiRXJyb3IudXBkYXRlRXJyb3JcIiwgZGF0YSk7XHJcblx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIGluc2VydCB0YWJsZSBFcnJvciBkZXRhaWxcclxuXHRcdFx0XHRsZXQgZGF0YURldGFpbCA9IGRhdGEuZGF0YTtcclxuXHRcdFx0XHRpZiAoZGF0YURldGFpbC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRhd2FpdCBkYi5pbnNlcnQoXCJFcnJvci5pbnNlcnRFcnJvckRldGFpbFwiLCB7IGRhdGFEZXRhaWwgfSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgc3RhdHVzXHJcbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG4gICAgICogQHNpbmNlIDExLzA3LzIwMTlcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0IEVycm9yfSBkYXRhXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG4gICAgICovXHJcblx0dXBkYXRlU3RhdHVzKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIudXBkYXRlKFwiRXJyb3IudXBkYXRlU3RhdHVzXCIsIGRhdGEsIChlcnIsIHJzKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGNhbGxCYWNrKGVyciwgcnMpXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcclxuXHRcdFx0Y2FsbEJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGlzX2RlbGV0ZSA9IDFcclxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXHJcbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxyXG4gICAgICogQHBhcmFtIHtPYmplY3QgRXJyb3J9IGRhdGFcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcbiAgICAgKi9cclxuXHRkZWxldGUoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5kZWxldGUoXCJFcnJvci5kZWxldGVcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gY2FsbEJhY2soZXJyLCBycylcclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0KiBnZXQgZGV0YWlsIEVycm9yXHJcblx0KiBAcGFyYW0geyp9IGRhdGEgXHJcblx0KiBAcGFyYW0geyp9IGNhbGxCYWNrIFxyXG5cdCovXHJcblx0Z2V0RGV0YWlsKHBhcmFtLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgcnMgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJFcnJvci5nZXREZXRhaWxcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0dmFyIGRhdGEgPSByc1swXVswXTtcclxuXHRcdFx0XHRcdGRhdGEuZGF0YSA9IHJzWzFdO1xyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdlcnJvciBnZXQgbWF0ZXJpYWwgb3JkZXIgZm9yIHZvdWNoZXIgb3V0JywgZXJyKTtcclxuXHRcdFx0aWYgKGNvbm4pIHtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgRXJyb3JTZXJ2aWNlO1xyXG4iXX0=