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

var ProjectGroupService = function (_BaseService) {
	_inherits(ProjectGroupService, _BaseService);

	function ProjectGroupService() {
		_classCallCheck(this, ProjectGroupService);

		return _possibleConstructorReturn(this, (ProjectGroupService.__proto__ || Object.getPrototypeOf(ProjectGroupService)).call(this));
	}

	/**
  * @description Get list
  * @author Long.Pham
  * @since 30/07/2019
  * @param {Object} data
  * @param {function callback} callback 
  */


	_createClass(ProjectGroupService, [{
		key: 'getList',
		value: function getList(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("ProjectGroup.getList", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Get all
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object ProjectGroup} data
   * @param {function callback} callback 
   */

	}, {
		key: 'getDropDownList',
		value: function getDropDownList(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("ProjectGroup.getDropDownList", data, callback);
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
				db.queryForObject("ProjectGroup.getSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Insert data
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object ProjectGroup} data
   */

	}, {
		key: 'insert',
		value: function insert(data, callBack) {
			try {
				var self = this;
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.insert("ProjectGroup.insert", data);
						var curId = rs.insertId;
						if (!rs) {
							conn.rollback();
							callBack(true, {});
							return;
						}

						// insert table detail
						var dataDetail = data.data;
						if (dataDetail.length > 0) {
							for (var i = 0; i < dataDetail.length; i++) {
								dataDetail[i].id_project_group = curId;
							}
							await db.insert("ProjectGroup.insertProjectGroupDetail", { dataDetail: dataDetail });
						}

						conn.commit();
						callBack(false, rs);
					} catch (err) {
						console.log("Lỗi rolback", err);
						conn.rollback();
						callBack(true, err);
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
   * @param {Object ProjectGroup} data
   * @param {function callback} callback
   */

	}, {
		key: 'update',
		value: function update(data, callBack) {
			var self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.delete("ProjectGroup.deleteProjectGroupDetail", data);
					rs = await db.update("ProjectGroup.updateProjectGroup", data);
					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					// insert table detail
					var dataDetail = data.data;
					if (dataDetail.length > 0) {
						await db.insert("ProjectGroup.insertProjectGroupDetail", { dataDetail: dataDetail });
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
   * @param {Object ProjectGroup} data
   * @param {function callback} callback
   */

	}, {
		key: 'updateStatus',
		value: function updateStatus(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.update("ProjectGroup.updateStatus", data, function (err, rs) {
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
   * @param {Object ProjectGroup} data
   * @param {function callback} callback
   */

	}, {
		key: 'delete',
		value: function _delete(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.delete("ProjectGroup.delete", data, function (err, rs) {
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
						var rs = await db.queryForList("ProjectGroup.getDetail", param);
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
	}]);

	return ProjectGroupService;
}(_BaseService3.default);

exports.default = ProjectGroupService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Qcm9qZWN0R3JvdXBTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIlByb2plY3RHcm91cFNlcnZpY2UiLCJkYXRhIiwiY2FsbGJhY2siLCJMaWJzIiwiaXNCbGFuayIsImN1cnJlbnRfcm93IiwibWF4X3JlY29yZCIsIkNvbnN0YW50cyIsImNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wIiwiZGIiLCJteVNxTERCIiwicXVlcnlGb3JMaXN0IiwiZSIsImNvbnNvbGUiLCJsb2ciLCJxdWVyeUZvck9iamVjdCIsImNhbGxCYWNrIiwic2VsZiIsImJlZ2luVHJhbnNhY3Rpb24iLCJjb25uIiwicnMiLCJpbnNlcnQiLCJjdXJJZCIsImluc2VydElkIiwicm9sbGJhY2siLCJkYXRhRGV0YWlsIiwibGVuZ3RoIiwiaSIsImlkX3Byb2plY3RfZ3JvdXAiLCJjb21taXQiLCJlcnIiLCJkZWxldGUiLCJ1cGRhdGUiLCJsb2dnZXIiLCJlcnJvciIsInBhcmFtIiwiQmFzZVNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSxtQjs7O0FBQ0wsZ0NBQWM7QUFBQTs7QUFBQTtBQUdiOztBQUVEOzs7Ozs7Ozs7OzswQkFPUUMsSSxFQUFNQyxRLEVBQVU7QUFDdkIsT0FBSTtBQUNILFFBQUksQ0FBQ0MsS0FBS0MsT0FBTCxDQUFhSCxJQUFiLENBQUwsRUFBeUI7QUFDeEJBLFVBQUtJLFdBQUwsR0FBb0IsT0FBT0osS0FBS0ksV0FBWixJQUEyQixXQUE1QixHQUEyQyxDQUEzQyxHQUErQ0osS0FBS0ksV0FBdkU7QUFDQUosVUFBS0ssVUFBTCxHQUFrQkMsVUFBVU4sSUFBVixDQUFlSyxVQUFqQztBQUNBO0FBQ0RMLFdBQU9FLEtBQUtLLDBCQUFMLENBQWdDUCxJQUFoQyxDQUFQO0FBQ0EsUUFBSVEsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR0UsWUFBSCxDQUFnQixzQkFBaEIsRUFBd0NWLElBQXhD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OiJQcm9qZWN0R3JvdXBTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTZXJ2aWNlIGZyb20gJy4vQmFzZVNlcnZpY2UnO1xyXG5jbGFzcyBQcm9qZWN0R3JvdXBTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3RcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHRnZXRMaXN0KGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhKSkge1xyXG5cdFx0XHRcdGRhdGEuY3VycmVudF9yb3cgPSAodHlwZW9mIGRhdGEuY3VycmVudF9yb3cgPT0gJ3VuZGVmaW5lZCcpID8gMCA6IGRhdGEuY3VycmVudF9yb3c7XHJcblx0XHRcdFx0ZGF0YS5tYXhfcmVjb3JkID0gQ29uc3RhbnRzLmRhdGEubWF4X3JlY29yZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JMaXN0KFwiUHJvamVjdEdyb3VwLmdldExpc3RcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgYWxsXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IFByb2plY3RHcm91cH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cdGdldERyb3BEb3duTGlzdChkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yTGlzdChcIlByb2plY3RHcm91cC5nZXREcm9wRG93bkxpc3RcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEzhuqV5IHThu5VuZyBz4buRIGTDsm5nXHJcblx0ICogQGF1dGhvciB0aGFuaC5iYXlcclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOFxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IFVzZXJ9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cdGdldFNpemUoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvck9iamVjdChcIlByb2plY3RHcm91cC5nZXRTaXplXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gSW5zZXJ0IGRhdGFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgUHJvamVjdEdyb3VwfSBkYXRhXHJcblx0ICovXHJcblx0aW5zZXJ0KGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiUHJvamVjdEdyb3VwLmluc2VydFwiLCBkYXRhKTtcclxuXHRcdFx0XHRcdHZhciBjdXJJZCA9IHJzLmluc2VydElkO1xyXG5cdFx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHQvLyBpbnNlcnQgdGFibGUgZGV0YWlsXHJcblx0XHRcdFx0XHRsZXQgZGF0YURldGFpbCA9IGRhdGEuZGF0YTtcclxuXHRcdFx0XHRcdGlmIChkYXRhRGV0YWlsLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhRGV0YWlsLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YURldGFpbFtpXS5pZF9wcm9qZWN0X2dyb3VwID0gY3VySWQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YXdhaXQgZGIuaW5zZXJ0KFwiUHJvamVjdEdyb3VwLmluc2VydFByb2plY3RHcm91cERldGFpbFwiLCB7IGRhdGFEZXRhaWwgfSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgcnMpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yJywgZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgZGF0YVxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBQcm9qZWN0R3JvdXB9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cclxuXHR1cGRhdGUoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIuZGVsZXRlKFwiUHJvamVjdEdyb3VwLmRlbGV0ZVByb2plY3RHcm91cERldGFpbFwiLCBkYXRhKTtcclxuXHRcdFx0XHRycyA9IGF3YWl0IGRiLnVwZGF0ZShcIlByb2plY3RHcm91cC51cGRhdGVQcm9qZWN0R3JvdXBcIiwgZGF0YSk7XHJcblx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIGluc2VydCB0YWJsZSBkZXRhaWxcclxuXHRcdFx0XHRsZXQgZGF0YURldGFpbCA9IGRhdGEuZGF0YVxyXG5cdFx0XHRcdGlmIChkYXRhRGV0YWlsLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdGF3YWl0IGRiLmluc2VydChcIlByb2plY3RHcm91cC5pbnNlcnRQcm9qZWN0R3JvdXBEZXRhaWxcIiwgeyBkYXRhRGV0YWlsIH0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZXJyKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBzdGF0dXNcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgUHJvamVjdEdyb3VwfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHR1cGRhdGVTdGF0dXMoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi51cGRhdGUoXCJQcm9qZWN0R3JvdXAudXBkYXRlU3RhdHVzXCIsIGRhdGEsIChlcnIsIHJzKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGVyciwgcnMpXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcclxuXHRcdFx0Y2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBzdGF0dXMgLTFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgUHJvamVjdEdyb3VwfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRkZWxldGUoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5kZWxldGUoXCJQcm9qZWN0R3JvdXAuZGVsZXRlXCIsIGRhdGEsIChlcnIsIHJzKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGVyciwgcnMpXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcclxuXHRcdFx0Y2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0KiBnZXQgZGV0YWlsXHJcblx0KiBAcGFyYW0geyp9IGRhdGEgXHJcblx0KiBAcGFyYW0geyp9IGNhbGxCYWNrIFxyXG5cdCovXHJcblx0Z2V0RGV0YWlsKHBhcmFtLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgcnMgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJQcm9qZWN0R3JvdXAuZ2V0RGV0YWlsXCIsIHBhcmFtKTtcclxuXHRcdFx0XHRcdHZhciBkYXRhID0gcnNbMF1bMF07XHJcblx0XHRcdFx0XHRkYXRhLmRhdGEgPSByc1sxXTtcclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZGF0YSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRpZiAoY29ubikge1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxufVxyXG5leHBvcnQgZGVmYXVsdCBQcm9qZWN0R3JvdXBTZXJ2aWNlO1xyXG4iXX0=