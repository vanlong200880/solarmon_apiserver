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

var RoleService = function (_BaseService) {
	_inherits(RoleService, _BaseService);

	function RoleService() {
		_classCallCheck(this, RoleService);

		return _possibleConstructorReturn(this, (RoleService.__proto__ || Object.getPrototypeOf(RoleService)).call(this));
	}

	/**
  * @description Get list
  * @author Long.Pham
  * @since 30/07/2019
  * @param {Object Role} data
  * @param {function callback} callback 
  */


	_createClass(RoleService, [{
		key: 'getList',
		value: function getList(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("Role.getList", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Get all
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object Role} data
   * @param {function callback} callback 
   */

	}, {
		key: 'getDropDownList',
		value: function getDropDownList(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("Role.getDropDownList", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Lấy tổng số dòng
   * @author thanh.bay
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
				db.queryForObject("Role.getSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Insert data
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object Role} data
   */

	}, {
		key: 'insert',
		value: function insert(data, callBack) {
			try {
				var self = this;
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.insert("Role.insert", data);
						var curId = rs.insertId;
						if (!rs) {
							conn.rollback();
							callBack(false, {});
							return;
						}

						// insert table category detail
						var dataDetail = data.data;
						if (dataDetail.length > 0) {
							for (var i = 0; i < dataDetail.length; i++) {
								dataDetail[i].id_role = curId;
							}
							await db.insert("Role.insertRoleDetail", { dataDetail: dataDetail });
						}

						// insert table role_screen_map
						var screenMap = await db.queryForList("Role.getScreenMap", data);
						if (Libs.isArrayData(screenMap)) {
							for (var i = 0; i < screenMap.length; i++) {
								await db.insert("Role.insertRoleScreenMap", {
									id_role: curId,
									id_screen: screenMap[i].id_screen,
									auths: screenMap[i].auths
								});
							}
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
   * @param {Object Role} data
   * @param {function callback} callback
   */

	}, {
		key: 'update',
		value: function update(data, callBack) {
			var self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.delete("Role.deleteRoleDetail", data);
					rs = await db.update("Role.updateRole", data);
					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					// insert table detail
					var dataDetail = data.data;
					if (dataDetail.length > 0) {
						await db.insert("Role.insertRoleDetail", { dataDetail: dataDetail });
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
   * @param {Object Role} data
   * @param {function callback} callback
   */

	}, {
		key: 'updateStatus',
		value: function updateStatus(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.update("Role.updateStatus", data, function (err, rs) {
					return callback(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callback(false, e);
			}
		}

		/**
   * @description Update status -1
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object Role} data
   * @param {function callback} callback
   */

	}, {
		key: 'delete',
		value: function _delete(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.delete("Role.delete", data, function (err, rs) {
					return callback(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callback(false, e);
			}
		}

		/**
  * get detail
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
						var rs = await db.queryForList("Role.getDetail", param);
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
   * @param {Object Roles} data
   * @param {function callback} callback 
   */

	}, {
		key: 'getListScreenPermissions',
		value: function getListScreenPermissions(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("Role.getListScreenPermissions", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
  * update role company screeen
  * @param {*} data 
  * @param {*} callBack 
  */

	}, {
		key: 'updateRolePermissions',
		value: async function updateRolePermissions(data, callBack) {
			var self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var update = db.update("Role.updateRolePermissions", data);
					if (!update) {
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
		key: 'updateRoleMapScreen',
		value: async function updateRoleMapScreen(data, callBack) {
			var self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var screenMap = await db.queryForList("Role.getScreenMap", data);
					if (Libs.isArrayData(screenMap)) {
						for (var i = 0; i < screenMap.length; i++) {
							var checkExist = await db.queryForList("Role.checkExistRoleScreenMap", { id_role: data.id_role, id_screen: screenMap[i].id_screen });
							if (checkExist.length === 0) {
								await db.insert("Role.insertRoleScreenMap", {
									id_role: data.id_role,
									id_screen: screenMap[i].id_screen,
									auths: screenMap[i].auths
								});
							}
						}
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

	return RoleService;
}(_BaseService3.default);

exports.default = RoleService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Sb2xlU2VydmljZS5qcyJdLCJuYW1lcyI6WyJSb2xlU2VydmljZSIsImRhdGEiLCJjYWxsYmFjayIsIkxpYnMiLCJpc0JsYW5rIiwiY3VycmVudF9yb3ciLCJtYXhfcmVjb3JkIiwiQ29uc3RhbnRzIiwiY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AiLCJkYiIsIm15U3FMREIiLCJxdWVyeUZvckxpc3QiLCJlIiwiY29uc29sZSIsImxvZyIsInF1ZXJ5Rm9yT2JqZWN0IiwiY2FsbEJhY2siLCJzZWxmIiwiYmVnaW5UcmFuc2FjdGlvbiIsImNvbm4iLCJycyIsImluc2VydCIsImN1cklkIiwiaW5zZXJ0SWQiLCJyb2xsYmFjayIsImRhdGFEZXRhaWwiLCJsZW5ndGgiLCJpIiwiaWRfcm9sZSIsInNjcmVlbk1hcCIsImlzQXJyYXlEYXRhIiwiaWRfc2NyZWVuIiwiYXV0aHMiLCJjb21taXQiLCJlcnIiLCJkZWxldGUiLCJ1cGRhdGUiLCJsb2dnZXIiLCJlcnJvciIsInBhcmFtIiwiY2hlY2tFeGlzdCIsIkJhc2VTZXJ2aWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFDTUEsVzs7O0FBQ0wsd0JBQWM7QUFBQTs7QUFBQTtBQUdiOztBQUVEOzs7Ozs7Ozs7OzswQkFPUUMsSSxFQUFNQyxRLEVBQVU7QUFDdkIsT0FBSTtBQUNILFFBQUksQ0FBQ0MsS0FBS0MsT0FBTCxDQUFhSCxJQUFiLENBQUwsRUFBeUI7QUFDeEJBLFVBQUtJLFdBQUwsR0FBb0IsT0FBT0osS0FBS0ksV0FBWixJQUEyQixXQUE1QixHQUEyQyxDQUEzQyxHQUErQ0osS0FBS0ksV0FBdkU7QUFDQUosVUFBS0ssVUFBTCxHQUFrQkMsVUFBVU4sSUFBVixDQUFlSyxVQUFqQztBQUNBO0FBQ0RMLFdBQU9FLEtBQUtLLDBCQUFMLENBQWdDUCxJQUFoQyxDQUFQO0FBQ0EsUUFBSVEsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FB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LElBQVQsRUFBZSxFQUFmO0FBQ0EsS0FsQkQsQ0FrQkUsT0FBT2tCLEdBQVAsRUFBWTtBQUNickIsYUFBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJvQixHQUEzQjtBQUNBZixVQUFLSyxRQUFMO0FBQ0FSLGNBQVMsS0FBVCxFQUFnQmtCLEdBQWhCO0FBQ0E7QUFDRCxJQXhCRDtBQXlCQTs7OztFQXJUd0JPLHFCOztrQkF3VFh6QyxXIiwiZmlsZSI6IlJvbGVTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTZXJ2aWNlIGZyb20gJy4vQmFzZVNlcnZpY2UnO1xyXG5jbGFzcyBSb2xlU2VydmljZSBleHRlbmRzIEJhc2VTZXJ2aWNlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBsaXN0XHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IFJvbGV9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHRnZXRMaXN0KGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhKSkge1xyXG5cdFx0XHRcdGRhdGEuY3VycmVudF9yb3cgPSAodHlwZW9mIGRhdGEuY3VycmVudF9yb3cgPT0gJ3VuZGVmaW5lZCcpID8gMCA6IGRhdGEuY3VycmVudF9yb3c7XHJcblx0XHRcdFx0ZGF0YS5tYXhfcmVjb3JkID0gQ29uc3RhbnRzLmRhdGEubWF4X3JlY29yZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JMaXN0KFwiUm9sZS5nZXRMaXN0XCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGFsbFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBSb2xlfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0ICovXHJcblx0Z2V0RHJvcERvd25MaXN0KGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JMaXN0KFwiUm9sZS5nZXREcm9wRG93bkxpc3RcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBM4bqleSB04buVbmcgc+G7kSBkw7JuZ1xyXG5cdCAqIEBhdXRob3IgdGhhbmguYmF5XHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMThcclxuXHQgKiBAcGFyYW0ge09iamVjdCBVc2VyfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRnZXRTaXplKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJSb2xlLmdldFNpemVcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBJbnNlcnQgZGF0YVxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBSb2xlfSBkYXRhXHJcblx0ICovXHJcblx0aW5zZXJ0KGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiUm9sZS5pbnNlcnRcIiwgZGF0YSk7XHJcblx0XHRcdFx0XHR2YXIgY3VySWQgPSBycy5pbnNlcnRJZDtcclxuXHRcdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHJcblx0XHRcdFx0XHQvLyBpbnNlcnQgdGFibGUgY2F0ZWdvcnkgZGV0YWlsXHJcblx0XHRcdFx0XHRsZXQgZGF0YURldGFpbCA9IGRhdGEuZGF0YTtcclxuXHRcdFx0XHRcdGlmIChkYXRhRGV0YWlsLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhRGV0YWlsLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YURldGFpbFtpXS5pZF9yb2xlID0gY3VySWQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YXdhaXQgZGIuaW5zZXJ0KFwiUm9sZS5pbnNlcnRSb2xlRGV0YWlsXCIsIHsgZGF0YURldGFpbCB9KTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBpbnNlcnQgdGFibGUgcm9sZV9zY3JlZW5fbWFwXHJcblx0XHRcdFx0XHR2YXIgc2NyZWVuTWFwID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiUm9sZS5nZXRTY3JlZW5NYXBcIiwgZGF0YSk7XHJcblx0XHRcdFx0XHRpZiAoTGlicy5pc0FycmF5RGF0YShzY3JlZW5NYXApKSB7XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2NyZWVuTWFwLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0YXdhaXQgZGIuaW5zZXJ0KFwiUm9sZS5pbnNlcnRSb2xlU2NyZWVuTWFwXCIsIHsgXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9yb2xlOiBjdXJJZCwgXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9zY3JlZW46IHNjcmVlbk1hcFtpXS5pZF9zY3JlZW4sXHJcblx0XHRcdFx0XHRcdFx0XHRhdXRoczogc2NyZWVuTWFwW2ldLmF1dGhzLFxyXG5cdFx0XHRcdFx0XHRcdCB9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yJywgZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgZGF0YVxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBSb2xlfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHJcblx0dXBkYXRlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLmRlbGV0ZShcIlJvbGUuZGVsZXRlUm9sZURldGFpbFwiLCBkYXRhKTtcclxuXHRcdFx0XHRycyA9IGF3YWl0IGRiLnVwZGF0ZShcIlJvbGUudXBkYXRlUm9sZVwiLCBkYXRhKTtcclxuXHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gaW5zZXJ0IHRhYmxlIGRldGFpbFxyXG5cdFx0XHRcdGxldCBkYXRhRGV0YWlsID0gZGF0YS5kYXRhXHJcblx0XHRcdFx0aWYgKGRhdGFEZXRhaWwubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0YXdhaXQgZGIuaW5zZXJ0KFwiUm9sZS5pbnNlcnRSb2xlRGV0YWlsXCIsIHsgZGF0YURldGFpbCB9KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgc3RhdHVzXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTEvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IFJvbGV9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cdHVwZGF0ZVN0YXR1cyhkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnVwZGF0ZShcIlJvbGUudXBkYXRlU3RhdHVzXCIsIGRhdGEsIChlcnIsIHJzKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGVyciwgcnMpXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcclxuXHRcdFx0Y2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBzdGF0dXMgLTFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgUm9sZX0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0ZGVsZXRlKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuZGVsZXRlKFwiUm9sZS5kZWxldGVcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soZXJyLCBycylcclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdFx0XHRjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQqIGdldCBkZXRhaWxcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHRnZXREZXRhaWwocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIlJvbGUuZ2V0RGV0YWlsXCIsIHBhcmFtKTtcclxuXHRcdFx0XHRcdHZhciBkYXRhID0gcnNbMF1bMF07XHJcblx0XHRcdFx0XHRkYXRhLmRhdGEgPSByc1sxXTtcclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZGF0YSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRpZiAoY29ubikge1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgYWxsXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IFJvbGVzfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0ICovXHJcblx0Z2V0TGlzdFNjcmVlblBlcm1pc3Npb25zKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JMaXN0KFwiUm9sZS5nZXRMaXN0U2NyZWVuUGVybWlzc2lvbnNcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQqIHVwZGF0ZSByb2xlIGNvbXBhbnkgc2NyZWVlblxyXG5cdCogQHBhcmFtIHsqfSBkYXRhIFxyXG5cdCogQHBhcmFtIHsqfSBjYWxsQmFjayBcclxuXHQqL1xyXG5cdGFzeW5jIHVwZGF0ZVJvbGVQZXJtaXNzaW9ucyhkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR2YXIgdXBkYXRlID0gZGIudXBkYXRlKFwiUm9sZS51cGRhdGVSb2xlUGVybWlzc2lvbnNcIiwgZGF0YSk7XHJcblx0XHRcdFx0aWYgKCF1cGRhdGUpIHtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cclxuXHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0YXN5bmMgdXBkYXRlUm9sZU1hcFNjcmVlbihkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR2YXIgc2NyZWVuTWFwID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiUm9sZS5nZXRTY3JlZW5NYXBcIiwgZGF0YSk7XHJcblx0XHRcdFx0aWYgKExpYnMuaXNBcnJheURhdGEoc2NyZWVuTWFwKSkge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzY3JlZW5NYXAubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0dmFyIGNoZWNrRXhpc3QgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJSb2xlLmNoZWNrRXhpc3RSb2xlU2NyZWVuTWFwXCIsIHtpZF9yb2xlOiBkYXRhLmlkX3JvbGUsIGlkX3NjcmVlbjogc2NyZWVuTWFwW2ldLmlkX3NjcmVlbn0pO1xyXG5cdFx0XHRcdFx0XHRpZiAoY2hlY2tFeGlzdC5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5pbnNlcnQoXCJSb2xlLmluc2VydFJvbGVTY3JlZW5NYXBcIiwgeyBcclxuXHRcdFx0XHRcdFx0XHRcdGlkX3JvbGU6IGRhdGEuaWRfcm9sZSwgXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9zY3JlZW46IHNjcmVlbk1hcFtpXS5pZF9zY3JlZW4sXHJcblx0XHRcdFx0XHRcdFx0XHRhdXRoczogc2NyZWVuTWFwW2ldLmF1dGhzLFxyXG5cdFx0XHRcdFx0XHRcdCB9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBSb2xlU2VydmljZTtcclxuIl19