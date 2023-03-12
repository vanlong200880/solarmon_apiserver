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

var ProjectService = function (_BaseService) {
	_inherits(ProjectService, _BaseService);

	function ProjectService() {
		_classCallCheck(this, ProjectService);

		return _possibleConstructorReturn(this, (ProjectService.__proto__ || Object.getPrototypeOf(ProjectService)).call(this));
	}

	/**
  * @description Get list
  * @author Long.Pham
  * @since 30/07/2019
  * @param {Object Project} data
  * @param {function callback} callback 
  */


	_createClass(ProjectService, [{
		key: 'getList',
		value: function getList(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("Project.getList", data, callback);
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
				db.queryForObject("Project.getSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Insert data
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object Project} data
   */

	}, {
		key: 'insertProject',
		value: function insertProject(data, callBack) {
			try {
				var self = this;
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {

						var rs = await db.insert("Project.insertProject", data);
						var curId = rs.insertId;

						if (!rs) {
							conn.rollback();
							callBack(false, {});
							return;
						}

						// insert table Project detail
						var dataDetail = data.data;
						if (dataDetail.length > 0) {
							for (var i = 0; i < dataDetail.length; i++) {
								dataDetail[i].id_project = curId;
							}
							rs = await db.insert("Project.insertProjectDetail", { dataDetail: dataDetail });
						}

						var dataEmployees = data.dataEmployees;
						if (dataEmployees.length > 0) {
							for (var _i = 0; _i < dataEmployees.length; _i++) {
								dataEmployees[_i].id_project = curId;
							}
							rs = await db.insert("Project.insertProjectEmployeeMap", { dataEmployees: dataEmployees });
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
   * @param {Object Project} data
   * @param {function callback} callback
   */

	}, {
		key: 'updateProject',
		value: function updateProject(data, callBack) {
			var self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {

					var rs = await db.delete("Project.deleteProjectDetail", data);
					rs = await db.delete("Project.deleteEmployeeProjectMap", data);
					rs = await db.update("Project.updateProject", data);
					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					// insert table Project detail
					var dataDetail = data.data;
					if (dataDetail.length > 0) {
						await db.insert("Project.insertProjectDetail", { dataDetail: dataDetail });
					}

					var dataEmployees = data.dataEmployees;
					if (dataEmployees.length > 0) {
						for (var i = 0; i < dataEmployees.length; i++) {
							dataEmployees[i].id_project = data.id;
						}
						rs = await db.insert("Project.insertProjectEmployeeMap", { dataEmployees: dataEmployees });
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
   * @description Update data
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object Project} data
   * @param {function callback} callback
   */

	}, {
		key: 'updateProjectConfig',
		value: function updateProjectConfig(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {

					var rs = await db.queryForObject("Project.getConfigEstimate", data);
					if (rs) {
						rs = await db.update("Project.updateConfigEstimate", data);
					} else {
						rs = await db.insert("Project.insertConfigEstimate", data);
					}
					await db.delete("Project.deleteConfigRevenue", data);
					var dataConfigRevenue = data.dataConfigRevenue;
					if (dataConfigRevenue.length > 0) {
						for (var i = 0, len = dataConfigRevenue.length; i < len; i++) {
							dataConfigRevenue[i].id_project = data.id_project;
						}
						await db.insert("Project.insertConfigRevenue", { dataConfigRevenue: dataConfigRevenue });
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
		}

		/**
   * @description Update data
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object Project} data
   * @param {function callback} callback
   */

	}, {
		key: 'saveMoveDevice',
		value: function saveMoveDevice(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var dataList = data.dataList;
					if (dataList.length > 0) {
						for (var i = 0, len = dataList.length; i < len; i++) {
							await db.update("Project.saveMoveDevice", dataList[i]);
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

		/**
   * @description Update data
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object Project} data
   * @param {function callback} callback
   */

	}, {
		key: 'saveConfigEstimationSensor',
		value: function saveConfigEstimationSensor(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {

					var rs = await db.update("Project.saveConfigEstimationSensor", data);
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

		/**
   * @description Update status
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object Project} data
   * @param {function callback} callback
   */

	}, {
		key: 'updateStatus',
		value: function updateStatus(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.update("Project.updateStatus", data, function (err, rs) {
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
   * @param {Object Project} data
   * @param {function callback} callback
   */

	}, {
		key: 'delete',
		value: function _delete(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.delete("Project.delete", data, function (err, rs) {
					return callBack(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callBack(false, e);
			}
		}

		/**
  * get detail Project
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
						var rs = await db.queryForList("Project.getDetail", param);
						var data = rs[0][0];
						data.data = rs[1];
						data.dataEmployees = rs[2];
						data.dataConfigRevenue = rs[3];
						data.dataConfigEstimate = rs[4];
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
  * get detail Project
  * @param {*} data 
  * @param {*} callBack 
  */

	}, {
		key: 'getDetailConfig',
		value: function getDetailConfig(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.queryForList("Project.getDetailConfig", param);
						var data = rs[0][0] ? rs[0][0] : {};
						data.dataConfigRevenue = rs[1];
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
   * @param {Object project} data
   * @param {function callback} callback 
   */

	}, {
		key: 'getDropDownList',
		value: function getDropDownList(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("Project.getDropDownList", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}
	}]);

	return ProjectService;
}(_BaseService3.default);

exports.default = ProjectService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Qcm9qZWN0U2VydmljZS5qcyJdLCJuYW1lcyI6WyJQcm9qZWN0U2VydmljZSIsImRhdGEiLCJjYWxsYmFjayIsIkxpYnMiLCJpc0JsYW5rIiwiY3VycmVudF9yb3ciLCJtYXhfcmVjb3JkIiwiQ29uc3RhbnRzIiwiY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AiLCJkYiIsIm15U3FMREIiLCJxdWVyeUZvckxpc3QiLCJlIiwiY29uc29sZSIsImxvZyIsInF1ZXJ5Rm9yT2JqZWN0IiwiY2FsbEJhY2siLCJzZWxmIiwiYmVnaW5UcmFuc2FjdGlvbiIsImNvbm4iLCJycyIsImluc2VydCIsImN1cklkIiwiaW5zZXJ0SWQiLCJyb2xsYmFjayIsImRhdGFEZXRhaWwiLCJsZW5ndGgiLCJpIiwiaWRfcHJvamVjdCIsImRhdGFFbXBsb3llZXMiLCJjb21taXQiLCJlcnIiLCJkZWxldGUiLCJ1cGRhdGUiLCJpZCIsImRhdGFDb25maWdSZXZlbnVlIiwibGVuIiwiZGF0YUxpc3QiLCJsb2dnZXIiLCJlcnJvciIsInBhcmFtIiwiZGF0YUNvbmZpZ0VzdGltYXRlIiwiQmFzZVNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSxjOzs7QUFDTCwyQkFBYztBQUFBOztBQUFBO0FBR2I7O0FBRUQ7Ozs7Ozs7Ozs7OzBCQU9RQyxJLEVBQU1DLFEsRUFBVTtBQUN2QixPQUFJO0FBQ0gsUUFBSSxDQUFDQyxLQUFLQyxPQUFMLENBQWFILElBQWIsQ0FBTCxFQUF5QjtBQUN4QkEsVUFBS0ksV0FBTCxHQUFvQixPQUFPSixLQUFLSSxXQUFaLElBQTJCLFdBQTVCLEdBQTJDLENBQTNDLEdBQStDSixLQUFLSSxXQUF2RTtBQUNBSixVQUFLSyxVQUFMLEdBQWtCQyxVQUFVTixJQUFWLENBQWVLLFVBQWpDO0FBQ0E7QUFDREwsV0FBT0UsS0FBS0ssMEJBQUwsQ0FBZ0NQLElBQWhDLENBQVA7QUFDQSxRQUFJUSxL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QU1YLEdBQUdFLFlBQUgsQ0FBZ0IseUJBQWhCLEVBQTJDNkIsS0FBM0MsQ0FBZjtBQUNBLFVBQUl2QyxPQUFPbUIsR0FBRyxDQUFILEVBQU0sQ0FBTixJQUFXQSxHQUFHLENBQUgsRUFBTSxDQUFOLENBQVgsR0FBcUIsRUFBaEM7QUFDQW5CLFdBQUtrQyxpQkFBTCxHQUF5QmYsR0FBRyxDQUFILENBQXpCO0FBQ0FELFdBQUtXLE1BQUw7QUFDQWQsZUFBUyxLQUFULEVBQWdCZixJQUFoQjtBQUNBLE1BTkQsQ0FNRSxPQUFPOEIsR0FBUCxFQUFZO0FBQ2JsQixjQUFRQyxHQUFSLENBQVksYUFBWixFQUEyQmlCLEdBQTNCO0FBQ0FaLFdBQUtLLFFBQUw7QUFDQVIsZUFBUyxJQUFULEVBQWVlLEdBQWY7QUFDQTtBQUNELEtBWkQ7QUFhQSxJQWZELENBZUUsT0FBT0EsR0FBUCxFQUFZO0FBQ2I7QUFDQSxRQUFJWixJQUFKLEVBQVU7QUFDVEEsVUFBS0ssUUFBTDtBQUNBO0FBQ0RSLGFBQVMsSUFBVCxFQUFlZSxHQUFmO0FBQ0E7QUFDRDs7QUFHRDs7Ozs7Ozs7OztrQ0FPZ0I5QixJLEVBQU1DLFEsRUFBVTtBQUMvQixPQUFJO0FBQ0hELFdBQU9FLEtBQUtLLDBCQUFMLENBQWdDUCxJQUFoQyxDQUFQO0FBQ0EsUUFBSVEsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR0UsWUFBSCxDQUFnQix5QkFBaEIsRUFBMkNWLElBQTNDLEVBQWlEQyxRQUFqRDtBQUNBLElBSkQsQ0FJRSxPQUFPVSxDQUFQLEVBQVU7QUFDWEMsWUFBUUMsR0FBUixDQUFZRixDQUFaO0FBQ0EsV0FBT1YsU0FBUyxLQUFULEVBQWdCVSxDQUFoQixDQUFQO0FBQ0E7QUFDRDs7OztFQTlYMkI4QixxQjs7a0JBaVlkMUMsYyIsImZpbGUiOiJQcm9qZWN0U2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2VydmljZSBmcm9tICcuL0Jhc2VTZXJ2aWNlJztcclxuY2xhc3MgUHJvamVjdFNlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBQcm9qZWN0fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0ICovXHJcblx0Z2V0TGlzdChkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YSkpIHtcclxuXHRcdFx0XHRkYXRhLmN1cnJlbnRfcm93ID0gKHR5cGVvZiBkYXRhLmN1cnJlbnRfcm93ID09ICd1bmRlZmluZWQnKSA/IDAgOiBkYXRhLmN1cnJlbnRfcm93O1xyXG5cdFx0XHRcdGRhdGEubWF4X3JlY29yZCA9IENvbnN0YW50cy5kYXRhLm1heF9yZWNvcmQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yTGlzdChcIlByb2plY3QuZ2V0TGlzdFwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEzhuqV5IHThu5VuZyBz4buRIGTDsm5nXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOFxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IFVzZXJ9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cdGdldFNpemUoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvck9iamVjdChcIlByb2plY3QuZ2V0U2l6ZVwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEluc2VydCBkYXRhXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IFByb2plY3R9IGRhdGFcclxuXHQgKi9cclxuXHRpbnNlcnRQcm9qZWN0KGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cclxuXHRcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLmluc2VydChcIlByb2plY3QuaW5zZXJ0UHJvamVjdFwiLCBkYXRhKTtcclxuXHRcdFx0XHRcdHZhciBjdXJJZCA9IHJzLmluc2VydElkO1xyXG5cclxuXHRcdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gaW5zZXJ0IHRhYmxlIFByb2plY3QgZGV0YWlsXHJcblx0XHRcdFx0XHRsZXQgZGF0YURldGFpbCA9IGRhdGEuZGF0YTtcclxuXHRcdFx0XHRcdGlmIChkYXRhRGV0YWlsLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhRGV0YWlsLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YURldGFpbFtpXS5pZF9wcm9qZWN0ID0gY3VySWQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJQcm9qZWN0Lmluc2VydFByb2plY3REZXRhaWxcIiwgeyBkYXRhRGV0YWlsIH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGxldCBkYXRhRW1wbG95ZWVzID0gZGF0YS5kYXRhRW1wbG95ZWVzO1xyXG5cdFx0XHRcdFx0aWYgKGRhdGFFbXBsb3llZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFFbXBsb3llZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW1wbG95ZWVzW2ldLmlkX3Byb2plY3QgPSBjdXJJZDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIlByb2plY3QuaW5zZXJ0UHJvamVjdEVtcGxveWVlTWFwXCIsIHsgZGF0YUVtcGxveWVlcyB9KTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnZXJyb3InLCBlKTtcclxuXHRcdFx0Y2FsbEJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgZGF0YVxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBQcm9qZWN0fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHR1cGRhdGVQcm9qZWN0KGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cclxuXHRcdFx0XHR2YXIgcnMgPSBhd2FpdCBkYi5kZWxldGUoXCJQcm9qZWN0LmRlbGV0ZVByb2plY3REZXRhaWxcIiwgZGF0YSk7XHJcblx0XHRcdFx0cnMgPSBhd2FpdCBkYi5kZWxldGUoXCJQcm9qZWN0LmRlbGV0ZUVtcGxveWVlUHJvamVjdE1hcFwiLCBkYXRhKTtcclxuXHRcdFx0XHRycyA9IGF3YWl0IGRiLnVwZGF0ZShcIlByb2plY3QudXBkYXRlUHJvamVjdFwiLCBkYXRhKTtcclxuXHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gaW5zZXJ0IHRhYmxlIFByb2plY3QgZGV0YWlsXHJcblx0XHRcdFx0bGV0IGRhdGFEZXRhaWwgPSBkYXRhLmRhdGE7XHJcblx0XHRcdFx0aWYgKGRhdGFEZXRhaWwubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0YXdhaXQgZGIuaW5zZXJ0KFwiUHJvamVjdC5pbnNlcnRQcm9qZWN0RGV0YWlsXCIsIHsgZGF0YURldGFpbCB9KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBkYXRhRW1wbG95ZWVzID0gZGF0YS5kYXRhRW1wbG95ZWVzO1xyXG5cdFx0XHRcdGlmIChkYXRhRW1wbG95ZWVzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUVtcGxveWVlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRkYXRhRW1wbG95ZWVzW2ldLmlkX3Byb2plY3QgPSBkYXRhLmlkO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJQcm9qZWN0Lmluc2VydFByb2plY3RFbXBsb3llZU1hcFwiLCB7IGRhdGFFbXBsb3llZXMgfSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZXJyKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGRhdGFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgUHJvamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0dXBkYXRlUHJvamVjdENvbmZpZyhkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0dHJ5IHtcclxuXHJcblx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJQcm9qZWN0LmdldENvbmZpZ0VzdGltYXRlXCIsIGRhdGEpO1xyXG5cdFx0XHRcdGlmIChycykge1xyXG5cdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi51cGRhdGUoXCJQcm9qZWN0LnVwZGF0ZUNvbmZpZ0VzdGltYXRlXCIsIGRhdGEpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIlByb2plY3QuaW5zZXJ0Q29uZmlnRXN0aW1hdGVcIiwgZGF0YSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGF3YWl0IGRiLmRlbGV0ZShcIlByb2plY3QuZGVsZXRlQ29uZmlnUmV2ZW51ZVwiLCBkYXRhKTtcclxuXHRcdFx0XHR2YXIgZGF0YUNvbmZpZ1JldmVudWUgPSBkYXRhLmRhdGFDb25maWdSZXZlbnVlO1xyXG5cdFx0XHRcdGlmIChkYXRhQ29uZmlnUmV2ZW51ZS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YUNvbmZpZ1JldmVudWUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0ZGF0YUNvbmZpZ1JldmVudWVbaV0uaWRfcHJvamVjdCA9IGRhdGEuaWRfcHJvamVjdDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGF3YWl0IGRiLmluc2VydChcIlByb2plY3QuaW5zZXJ0Q29uZmlnUmV2ZW51ZVwiLCB7IGRhdGFDb25maWdSZXZlbnVlIH0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHJcblxyXG5cdFxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGRhdGFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgUHJvamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0IHNhdmVNb3ZlRGV2aWNlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciBkYXRhTGlzdCA9IGRhdGEuZGF0YUxpc3Q7XHJcblx0XHRcdFx0aWYgKGRhdGFMaXN0Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhTGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0XHRhd2FpdCBkYi51cGRhdGUoXCJQcm9qZWN0LnNhdmVNb3ZlRGV2aWNlXCIsIGRhdGFMaXN0W2ldKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRcclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGRhdGFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgUHJvamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0IHNhdmVDb25maWdFc3RpbWF0aW9uU2Vuc29yKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cclxuXHRcdFx0XHR2YXIgcnMgPSBhd2FpdCBkYi51cGRhdGUoXCJQcm9qZWN0LnNhdmVDb25maWdFc3RpbWF0aW9uU2Vuc29yXCIsIGRhdGEpO1xyXG5cdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIHN0YXR1c1xyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBQcm9qZWN0fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHR1cGRhdGVTdGF0dXMoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi51cGRhdGUoXCJQcm9qZWN0LnVwZGF0ZVN0YXR1c1wiLCBkYXRhLCAoZXJyLCBycykgPT4ge1xyXG5cdFx0XHRcdHJldHVybiBjYWxsQmFjayhlcnIsIHJzKVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgaXNfZGVsZXRlID0gMVxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBQcm9qZWN0fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRkZWxldGUoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5kZWxldGUoXCJQcm9qZWN0LmRlbGV0ZVwiLCBkYXRhLCAoZXJyLCBycykgPT4ge1xyXG5cdFx0XHRcdHJldHVybiBjYWxsQmFjayhlcnIsIHJzKVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQqIGdldCBkZXRhaWwgUHJvamVjdFxyXG5cdCogQHBhcmFtIHsqfSBkYXRhIFxyXG5cdCogQHBhcmFtIHsqfSBjYWxsQmFjayBcclxuXHQqL1xyXG5cdGdldERldGFpbChwYXJhbSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiUHJvamVjdC5nZXREZXRhaWxcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0dmFyIGRhdGEgPSByc1swXVswXTtcclxuXHRcdFx0XHRcdGRhdGEuZGF0YSA9IHJzWzFdO1xyXG5cdFx0XHRcdFx0ZGF0YS5kYXRhRW1wbG95ZWVzID0gcnNbMl07XHJcblx0XHRcdFx0XHRkYXRhLmRhdGFDb25maWdSZXZlbnVlID0gcnNbM107XHJcblx0XHRcdFx0XHRkYXRhLmRhdGFDb25maWdFc3RpbWF0ZSA9IHJzWzRdO1xyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdlcnJvciBnZXQgbWF0ZXJpYWwgb3JkZXIgZm9yIHZvdWNoZXIgb3V0JywgZXJyKTtcclxuXHRcdFx0aWYgKGNvbm4pIHtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQqIGdldCBkZXRhaWwgUHJvamVjdFxyXG5cdCogQHBhcmFtIHsqfSBkYXRhIFxyXG5cdCogQHBhcmFtIHsqfSBjYWxsQmFjayBcclxuXHQqL1xyXG5cdGdldERldGFpbENvbmZpZyhwYXJhbSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiUHJvamVjdC5nZXREZXRhaWxDb25maWdcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0dmFyIGRhdGEgPSByc1swXVswXSA/IHJzWzBdWzBdOiB7fTtcclxuXHRcdFx0XHRcdGRhdGEuZGF0YUNvbmZpZ1JldmVudWUgPSByc1sxXTtcclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZGF0YSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygnZXJyb3IgZ2V0IG1hdGVyaWFsIG9yZGVyIGZvciB2b3VjaGVyIG91dCcsIGVycik7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBhbGxcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgcHJvamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cdGdldERyb3BEb3duTGlzdChkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yTGlzdChcIlByb2plY3QuZ2V0RHJvcERvd25MaXN0XCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBQcm9qZWN0U2VydmljZTtcclxuIl19