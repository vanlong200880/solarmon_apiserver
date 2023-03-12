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

var AIService = function (_BaseService) {
	_inherits(AIService, _BaseService);

	function AIService() {
		_classCallCheck(this, AIService);

		return _possibleConstructorReturn(this, (AIService.__proto__ || Object.getPrototypeOf(AIService)).call(this));
	}

	/**
  * @description Get list
  * @author Long.Pham
  * @since 30/07/2019
  * @param {Object AI} data
  * @param {function callback} callback 
  */


	_createClass(AIService, [{
		key: 'getListDevice',
		value: function getListDevice(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("AI.getListDevice", data, callback);
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
		key: 'getListDeviceSize',
		value: function getListDeviceSize(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("AI.getListDeviceSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Get list data device today 
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object AI} data
   * @param {function callback} callback 
   */

	}, {
		key: 'getDataDeviceToday',
		value: function getDataDeviceToday(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("AI.getDataDeviceToday", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Insert data
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object AI} data
   */
		// insertAI(data, callBack) {
		// 	try {
		// 		let self = this;
		// 		var db = new mySqLDB();
		// 		db.beginTransaction(async function (conn) {
		// 			try {

		// 				var rs = await db.insert("AI.insertAI", data);
		// 				var curId = rs.insertId;

		// 				if (!rs) {
		// 					conn.rollback();
		// 					callBack(false, {});
		// 					return;
		// 				}

		// 				// insert table AI detail
		// 				let dataDetail = data.data;
		// 				if (dataDetail.length > 0) {
		// 					for (let i = 0; i < dataDetail.length; i++) {
		// 						dataDetail[i].id_error_state = curId;
		// 					}
		// 					rs = await db.insert("AI.insertAIDetail", { dataDetail });
		// 				}

		// 				if (!rs) {
		// 					conn.rollback();
		// 					callBack(false, {});
		// 					return;
		// 				}
		// 				conn.commit();
		// 				callBack(true, {});
		// 			} catch (err) {
		// 				console.log("Lỗi rolback", err);
		// 				conn.rollback();
		// 				callBack(false, err);
		// 			}
		// 		})
		// 	} catch (e) {
		// 		console.log('error', e);
		// 		callBack(false, e);
		// 	}
		// }


		/**
   * @description Update data
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object AI} data
   * @param {function callback} callback
   */
		// updateAI(data, callBack) {
		// 	let self = this;
		// 	var db = new mySqLDB();
		// 	db.beginTransaction(async function (conn) {
		// 		try {

		// 			var rs = await db.delete("AI.deleteAIDetail", data);
		// 			rs = await db.update("AI.updateAI", data);
		// 			if (!rs) {
		// 				conn.rollback();
		// 				callBack(false, {});
		// 				return;
		// 			}

		// 			// insert table AI detail
		// 			let dataDetail = data.data;
		// 			if (dataDetail.length > 0) {
		// 				await db.insert("AI.insertAIDetail", { dataDetail });
		// 			}

		// 			conn.commit();
		// 			callBack(true, {});
		// 		} catch (err) {
		// 			console.log("Lỗi rolback", err);
		// 			conn.rollback();
		// 			callBack(false, err);
		// 		}
		// 	})
		// }


		/**
   * @description Update status
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object AI} data
   * @param {function callback} callback
   */
		// updateStatus(data, callBack) {
		// 	try {
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.update("AI.updateStatus", data, (err, rs) => {
		// 			return callBack(err, rs)
		// 		});
		// 	} catch (e) {
		// 		this.logger.error(e);
		// 		callBack(false, e);
		// 	}
		// }

		/**
   * @description Update is_delete = 1
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object AI} data
   * @param {function callback} callback
   */
		// delete(data, callBack) {
		// 	try {
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.delete("AI.delete", data, (err, rs) => {
		// 			return callBack(err, rs)
		// 		});
		// 	} catch (e) {
		// 		this.logger.error(e);
		// 		callBack(false, e);
		// 	}
		// }


		/**
  * get detail AI
  * @param {*} data 
  * @param {*} callBack 
  */
		// getDetail(param, callBack) {
		// 	try {
		// 		var db = new mySqLDB();
		// 		db.beginTransaction(async function (conn) {
		// 			try {
		// 				var rs = await db.queryForList("AI.getDetail", param);
		// 				var data = rs[0][0];
		// 				data.data = rs[1];
		// 				conn.commit();
		// 				callBack(false, data);
		// 			} catch (err) {
		// 				console.log("Lỗi rolback", err);
		// 				conn.rollback();
		// 				callBack(true, err);
		// 			}
		// 		});
		// 	} catch (err) {
		// 		// console.log('error get material order for voucher out', err);
		// 		if (conn) {
		// 			conn.rollback();
		// 		}
		// 		callBack(true, err);
		// 	}
		// }

		/**
   * @description Get all
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object AI} data
   * @param {function callback} callback 
   */
		//  getDropDownList(data, callback) {
		// 	try {
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.queryForList("AI.getDropDownList", data, callback);
		// 	} catch (e) {
		// 		console.log(e);
		// 		return callback(false, e);
		// 	}
		// }

	}]);

	return AIService;
}(_BaseService3.default);

exports.default = AIService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9BSVNlcnZpY2UuanMiXSwibmFtZXMiOlsiQUlTZXJ2aWNlIiwiZGF0YSIsImNhbGxiYWNrIiwiTGlicyIsImlzQmxhbmsiLCJjdXJyZW50X3JvdyIsIm1heF9yZWNvcmQiLCJDb25zdGFudHMiLCJjb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcCIsImRiIiwibXlTcUxEQiIsInF1ZXJ5Rm9yTGlzdCIsImUiLCJjb25zb2xlIiwibG9nIiwicXVlcnlGb3JPYmplY3QiLCJCYXNlU2VydmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBQ01BLFM7OztBQUNMLHNCQUFjO0FBQUE7O0FBQUE7QUFHYjs7QUFFRDs7Ozs7Ozs7Ozs7Z0NBT2NDLEksRUFBTUMsUSxFQUFVO0FBQzdCLE9BQUk7QUFDSCxRQUFJLENBQUNDLEtBQUtDLE9BQUwsQ0FBYUgsSUFBYixDQUFMLEVBQXlCO0FBQ3hCQSxVQUFLSSxXQUFMLEdBQW9CLE9BQU9KLEtBQUtJLFdBQVosSUFBMkIsV0FBNUIsR0FBMkMsQ0FBM0MsR0FBK0NKLEtBQUtJLFdBQXZFO0FBQ0FKLFVBQUtLLFVBQUwsR0FBa0JDLFVBQVVOLElBQVYsQ0FBZUssVUFBakM7QUFDQTtBQUNETCxXQUFPRSxLQUFLSywwQkFBTCxDQUFnQ1AsSUFBaEMsQ0FBUDtBQUNBLFFBQUlRLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FELE9BQUdFLFlBQUgsQ0FBZ0Isa0JBQWhCLEVBQW9DVixJQUFwQyxFQUEwQ0MsUUFBMUM7QUFDQSxJQVJELENBUUUsT0FBT1UsQ0FBUCxFQUFVO0FBQ1hDLFlBQVFDLEdBQVIsQ0FBWUYsQ0FBWjtBQUNBLFdBQU9WLFNBQVMsS0FBVCxFQUFnQlUsQ0FBaEIsQ0FBUDtBQUNBO0FBQ0Q7O0FBSUQ7Ozs7Ozs7Ozs7b0NBT21CWCxJLEVBQU1DLFEsRUFBVTtBQUNsQyxPQUFJO0FBQ0hELFdBQU9FLEtBQUtLLDBCQUFMLENBQWdDUCxJQUFoQyxDQUFQO0FBQ0EsUUFBSVEsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR00sY0FBSCxDQUFrQixzQkFBbEIsRUFBMENkLElBQTFDLEVBQWdEQyxRQUFoRDtBQUNBLElBSkQsQ0FJRSxPQUFPVSxDQUFQLEVBQVU7QUFDWEMsWUFBUUMsR0FBUixDQUFZRixDQUFaO0FBQ0EsV0FBT1YsU0FBUyxLQUFULEVBQWdCVSxDQUFoQixDQUFQO0FBQ0E7QUFDRDs7QUFJRDs7Ozs7Ozs7OztxQ0FPb0JYLEksRUFBTUMsUSxFQUFVO0FBQ25DLE9BQUk7QUFDSCxRQUFJLENBQUNDLEtBQUtDLE9BQUwsQ0FBYUgsSUFBYixDQUFMLEVBQXlCO0FBQ3hCQSxVQUFLSSxXQUFMLEdBQW9CLE9BQU9KLEtBQUtJLFdBQVosSUFBMkIsV0FBNUIsR0FBMkMsQ0FBM0MsR0FBK0NKLEtBQUtJLFdBQXZFO0FBQ0FKLFVBQUtLLFVBQUwsR0FBa0JDLFVBQVVOLElBQVYsQ0FBZUssVUFBakM7QUFDQTtBQUNETCxXQUFPRSxLQUFLSywwQkFBTCxDQUFnQ1AsSUFBaEMsQ0FBUDtBQUNBLFFBQUlRLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FELE9BQUdFLFlBQUgsQ0FBZ0IsdUJBQWhCLEVBQXlDVixJQUF6QyxFQUErQ0MsUUFBL0M7QUFDQSxJQVJELENBUUUsT0FBT1UsQ0FBUCxFQUFVO0FBQ1hDLFlBQVFDLEdBQVIsQ0FBWUYsQ0FBWjtBQUNBLFdBQU9WLFNBQVMsS0FBVCxFQUFnQlUsQ0FBaEIsQ0FBUDtBQUNBO0FBQ0Q7O0FBRUQ7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOzs7Ozs7O0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBSUE7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztFQXpQdUJJLHFCOztrQkE0UFRoQixTIiwiZmlsZSI6IkFJU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2VydmljZSBmcm9tICcuL0Jhc2VTZXJ2aWNlJztcclxuY2xhc3MgQUlTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3RcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgQUl9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHRnZXRMaXN0RGV2aWNlKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhKSkge1xyXG5cdFx0XHRcdGRhdGEuY3VycmVudF9yb3cgPSAodHlwZW9mIGRhdGEuY3VycmVudF9yb3cgPT0gJ3VuZGVmaW5lZCcpID8gMCA6IGRhdGEuY3VycmVudF9yb3c7XHJcblx0XHRcdFx0ZGF0YS5tYXhfcmVjb3JkID0gQ29uc3RhbnRzLmRhdGEubWF4X3JlY29yZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JMaXN0KFwiQUkuZ2V0TGlzdERldmljZVwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBM4bqleSB04buVbmcgc+G7kSBkw7JuZ1xyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMThcclxuXHQgKiBAcGFyYW0ge09iamVjdCBVc2VyfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHQgZ2V0TGlzdERldmljZVNpemUoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvck9iamVjdChcIkFJLmdldExpc3REZXZpY2VTaXplXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0XHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBsaXN0IGRhdGEgZGV2aWNlIHRvZGF5IFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBBSX0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cdCBnZXREYXRhRGV2aWNlVG9kYXkoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEpKSB7XHJcblx0XHRcdFx0ZGF0YS5jdXJyZW50X3JvdyA9ICh0eXBlb2YgZGF0YS5jdXJyZW50X3JvdyA9PSAndW5kZWZpbmVkJykgPyAwIDogZGF0YS5jdXJyZW50X3JvdztcclxuXHRcdFx0XHRkYXRhLm1heF9yZWNvcmQgPSBDb25zdGFudHMuZGF0YS5tYXhfcmVjb3JkO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvckxpc3QoXCJBSS5nZXREYXRhRGV2aWNlVG9kYXlcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBJbnNlcnQgZGF0YVxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBBSX0gZGF0YVxyXG5cdCAqL1xyXG5cdC8vIGluc2VydEFJKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0Ly8gXHR0cnkge1xyXG5cdC8vIFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0Ly8gXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0Ly8gXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHQvLyBcdFx0XHR0cnkge1xyXG5cclxuXHQvLyBcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLmluc2VydChcIkFJLmluc2VydEFJXCIsIGRhdGEpO1xyXG5cdC8vIFx0XHRcdFx0dmFyIGN1cklkID0gcnMuaW5zZXJ0SWQ7XHJcblxyXG5cdC8vIFx0XHRcdFx0aWYgKCFycykge1xyXG5cdC8vIFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0Ly8gXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0Ly8gXHRcdFx0XHRcdHJldHVybjtcclxuXHQvLyBcdFx0XHRcdH1cclxuXHJcblx0Ly8gXHRcdFx0XHQvLyBpbnNlcnQgdGFibGUgQUkgZGV0YWlsXHJcblx0Ly8gXHRcdFx0XHRsZXQgZGF0YURldGFpbCA9IGRhdGEuZGF0YTtcclxuXHQvLyBcdFx0XHRcdGlmIChkYXRhRGV0YWlsLmxlbmd0aCA+IDApIHtcclxuXHQvLyBcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhRGV0YWlsLmxlbmd0aDsgaSsrKSB7XHJcblx0Ly8gXHRcdFx0XHRcdFx0ZGF0YURldGFpbFtpXS5pZF9lcnJvcl9zdGF0ZSA9IGN1cklkO1xyXG5cdC8vIFx0XHRcdFx0XHR9XHJcblx0Ly8gXHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiQUkuaW5zZXJ0QUlEZXRhaWxcIiwgeyBkYXRhRGV0YWlsIH0pO1xyXG5cdC8vIFx0XHRcdFx0fVxyXG5cclxuXHQvLyBcdFx0XHRcdGlmICghcnMpIHtcclxuXHQvLyBcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdC8vIFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdC8vIFx0XHRcdFx0XHRyZXR1cm47XHJcblx0Ly8gXHRcdFx0XHR9XHJcblx0Ly8gXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdC8vIFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdC8vIFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdC8vIFx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0Ly8gXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0Ly8gXHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZXJyKTtcclxuXHQvLyBcdFx0XHR9XHJcblx0Ly8gXHRcdH0pXHJcblx0Ly8gXHR9IGNhdGNoIChlKSB7XHJcblx0Ly8gXHRcdGNvbnNvbGUubG9nKCdlcnJvcicsIGUpO1xyXG5cdC8vIFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBkYXRhXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTEvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IEFJfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHQvLyB1cGRhdGVBSShkYXRhLCBjYWxsQmFjaykge1xyXG5cdC8vIFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cdC8vIFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHQvLyBcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHQvLyBcdFx0dHJ5IHtcclxuXHJcblx0Ly8gXHRcdFx0dmFyIHJzID0gYXdhaXQgZGIuZGVsZXRlKFwiQUkuZGVsZXRlQUlEZXRhaWxcIiwgZGF0YSk7XHJcblx0Ly8gXHRcdFx0cnMgPSBhd2FpdCBkYi51cGRhdGUoXCJBSS51cGRhdGVBSVwiLCBkYXRhKTtcclxuXHQvLyBcdFx0XHRpZiAoIXJzKSB7XHJcblx0Ly8gXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0Ly8gXHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdC8vIFx0XHRcdFx0cmV0dXJuO1xyXG5cdC8vIFx0XHRcdH1cclxuXHJcblx0Ly8gXHRcdFx0Ly8gaW5zZXJ0IHRhYmxlIEFJIGRldGFpbFxyXG5cdC8vIFx0XHRcdGxldCBkYXRhRGV0YWlsID0gZGF0YS5kYXRhO1xyXG5cdC8vIFx0XHRcdGlmIChkYXRhRGV0YWlsLmxlbmd0aCA+IDApIHtcclxuXHQvLyBcdFx0XHRcdGF3YWl0IGRiLmluc2VydChcIkFJLmluc2VydEFJRGV0YWlsXCIsIHsgZGF0YURldGFpbCB9KTtcclxuXHQvLyBcdFx0XHR9XHJcblxyXG5cdC8vIFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0Ly8gXHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdC8vIFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHQvLyBcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHQvLyBcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0Ly8gXHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0Ly8gXHRcdH1cclxuXHQvLyBcdH0pXHJcblx0Ly8gfVxyXG5cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgc3RhdHVzXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTEvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IEFJfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHQvLyB1cGRhdGVTdGF0dXMoZGF0YSwgY2FsbEJhY2spIHtcclxuXHQvLyBcdHRyeSB7XHJcblx0Ly8gXHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdC8vIFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdC8vIFx0XHRkYi51cGRhdGUoXCJBSS51cGRhdGVTdGF0dXNcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHQvLyBcdFx0XHRyZXR1cm4gY2FsbEJhY2soZXJyLCBycylcclxuXHQvLyBcdFx0fSk7XHJcblx0Ly8gXHR9IGNhdGNoIChlKSB7XHJcblx0Ly8gXHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdC8vIFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGlzX2RlbGV0ZSA9IDFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgQUl9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cdC8vIGRlbGV0ZShkYXRhLCBjYWxsQmFjaykge1xyXG5cdC8vIFx0dHJ5IHtcclxuXHQvLyBcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0Ly8gXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0Ly8gXHRcdGRiLmRlbGV0ZShcIkFJLmRlbGV0ZVwiLCBkYXRhLCAoZXJyLCBycykgPT4ge1xyXG5cdC8vIFx0XHRcdHJldHVybiBjYWxsQmFjayhlcnIsIHJzKVxyXG5cdC8vIFx0XHR9KTtcclxuXHQvLyBcdH0gY2F0Y2ggKGUpIHtcclxuXHQvLyBcdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XHJcblx0Ly8gXHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcblxyXG5cclxuXHQvKipcclxuXHQqIGdldCBkZXRhaWwgQUlcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHQvLyBnZXREZXRhaWwocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0Ly8gXHR0cnkge1xyXG5cdC8vIFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdC8vIFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0Ly8gXHRcdFx0dHJ5IHtcclxuXHQvLyBcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkFJLmdldERldGFpbFwiLCBwYXJhbSk7XHJcblx0Ly8gXHRcdFx0XHR2YXIgZGF0YSA9IHJzWzBdWzBdO1xyXG5cdC8vIFx0XHRcdFx0ZGF0YS5kYXRhID0gcnNbMV07XHJcblx0Ly8gXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdC8vIFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGEpO1xyXG5cdC8vIFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdC8vIFx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0Ly8gXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0Ly8gXHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdC8vIFx0XHRcdH1cclxuXHQvLyBcdFx0fSk7XHJcblx0Ly8gXHR9IGNhdGNoIChlcnIpIHtcclxuXHQvLyBcdFx0Ly8gY29uc29sZS5sb2coJ2Vycm9yIGdldCBtYXRlcmlhbCBvcmRlciBmb3Igdm91Y2hlciBvdXQnLCBlcnIpO1xyXG5cdC8vIFx0XHRpZiAoY29ubikge1xyXG5cdC8vIFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHQvLyBcdFx0fVxyXG5cdC8vIFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBhbGxcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgQUl9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHQvLyAgZ2V0RHJvcERvd25MaXN0KGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0Ly8gXHR0cnkge1xyXG5cdC8vIFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHQvLyBcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHQvLyBcdFx0ZGIucXVlcnlGb3JMaXN0KFwiQUkuZ2V0RHJvcERvd25MaXN0XCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHQvLyBcdH0gY2F0Y2ggKGUpIHtcclxuXHQvLyBcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0Ly8gXHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBBSVNlcnZpY2U7XHJcbiJdfQ==