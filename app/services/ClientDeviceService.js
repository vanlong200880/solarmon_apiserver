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

var ClientDeviceService = function (_BaseService) {
	_inherits(ClientDeviceService, _BaseService);

	function ClientDeviceService() {
		_classCallCheck(this, ClientDeviceService);

		return _possibleConstructorReturn(this, (ClientDeviceService.__proto__ || Object.getPrototypeOf(ClientDeviceService)).call(this));
	}

	/**
  * @description Get list
  * @author Long.Pham
  * @since 12/09/2021
  * @param {Object} data
  * @param {function callback} callback 
  */

	_createClass(ClientDeviceService, [{
		key: "getList",
		value: function getList(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {

					data.current_date = Libs.convertAllFormatDate(data.current_date);
					var dataDevice = await db.queryForList("ClientDevice.getList", data);
					if (Libs.isArrayData(dataDevice)) {
						for (var i = 0; i < dataDevice.length; i++) {
							var item = dataDevice[i];
							// Get list alert
							var alerts = await db.queryForList("ClientDevice.getAlertByDevice", {
								id_device: item.id,
								id_language: data.id_language
							});
							dataDevice[i].alerts = alerts;
						}
					}

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
   * @param {Object Device} data
   * @param {function callback} callback
   */

	}, {
		key: "getSize",
		value: function getSize(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("ClientDevice.getSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Get list
   * @author Long.Pham
   * @since 12/09/2021
   * @param {Object} data
   * @param {function callback} callback 
   */

	}, {
		key: "getListParameterByDevice",
		value: function getListParameterByDevice(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var dataDevice = await db.queryForList("ClientDevice.getListParameterByDevice", data);

					var getLastRowDataDevice = await db.queryForObject("ClientDevice.getLastRowDataDevice", {
						id_device: data.id,
						id_language: data.id_language,
						table_name: data.table_name
					});
					var moment = require("moment");
					var date = moment().format('DD/MM/YYYY HH:mm:ss');

					if (Libs.isArrayData(dataDevice) && getLastRowDataDevice) {
						for (var i = 0; i < dataDevice.length; i++) {
							dataDevice[i].value = getLastRowDataDevice[dataDevice[i].slug];
							dataDevice[i].last_communication = getLastRowDataDevice['last_communication'];
							dataDevice[i].last_attempt = date;
						}
					}
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
   * @description Get list alert by deivce
   * @author Long.Pham
   * @since 18/09/2021
   * @param {Object} data
   * @param {function callback} callback 
   */

	}, {
		key: "getListAlertByDevice",
		value: function getListAlertByDevice(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("ClientDevice.getListAlertByDevice", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Lấy tổng số dòng
   * @author long.pham
   * @since 18/09/2021
   * @param {Object alert} data
   * @param {function callback} callback
   */

	}, {
		key: "getListAlertByDeviceSize",
		value: function getListAlertByDeviceSize(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("ClientDevice.getListAlertByDeviceSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Get all
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object GroupAttributes} data
   * @param {function callback} callback 
   */
		// getAllProjectByEmployeeId(data, callBack) {
		// 	var db = new mySqLDB();
		// 	db.beginTransaction(async function (conn) {
		// 		try {
		// 			var dataProjects = [];
		// 			var scope = await db.queryForList("ClientDevice.getAllScope", data);
		// 			if (Libs.isArrayData(scope)) {
		// 				for (var i = 0; i < scope.length; i++) {
		// 					var item = scope[i];
		// 					item.id_employee = data.id_employee;
		// 					var listProjects = await db.queryForList("ClientDevice.getAllProjectByEmployeeId", item);
		// 					if (Libs.isArrayData(listProjects) && listProjects.length > 0) {
		// 						item.dataChilds = listProjects;
		// 						dataProjects.push(item);
		// 					}
		// 				}
		// 			}

		// 			conn.commit();
		// 			callBack(false, dataProjects);
		// 		} catch (err) {
		// 			console.log("Lỗi rolback", err);
		// 			conn.rollback();
		// 			callBack(true, err);
		// 		}
		// 	});
		// }


		// /**
		//  * @description Get list project by employee id
		//  * @author Long.Pham
		//  * @since 30/09/2021
		//  * @param {Object ClientDevice} data
		//  * @param {function callback} callback 
		//  */
		// getListProjectByEmployee(data, callBack) {
		// 	var db = new mySqLDB();
		// 	db.beginTransaction(async function (conn) {
		// 		try {
		// 			// var dataProjects = [];
		// 			var dataList = await db.queryForList("ClientDevice.getListProjectByEmployee", data);
		// 			if (Libs.isArrayData(dataList)) {
		// 				for (var i = 0; i < dataList.length; i++) {

		// 					// get group device
		// 					var item = dataList[i];
		// 					var deviceGroup = await db.queryForList("ClientDevice.getGroupDeviceByProjectId", item);
		// 					var irradiance = [];
		// 					var energy_today = 0, lifetime = 0, revenue = 0;
		// 					if(Libs.isArrayData(deviceGroup)){
		// 						for (var j = 0; j < deviceGroup.length; j++) {
		// 							switch(deviceGroup[j].table_name){
		// 								case 'model_inverter_SMA_STP50':
		// 								case 'model_inverter_SMA_SHP75': 
		// 								case 'model_inverter_ABB_PVS100':
		// 									let objDevice = await db.queryForObject("ClientDevice.getDataDeviceEnergy", {
		// 										id_project: dataList[i].id, 
		// 										id_device_group: deviceGroup[j].id,
		// 										table_name: deviceGroup[j].table_name
		// 									});
		// 									if(objDevice){
		// 										energy_today = energy_today + objDevice.today_activeEnergy;
		// 										lifetime = lifetime + objDevice.lifetime;
		// 									}
		// 								break;
		// 								case 'model_inverter_Sungrow_SG110CX': 
		// 								break;
		// 								case 'model_inverter_Growatt_GW80KTL3': 
		// 								break;
		// 								case 'model_sensor_IMT_SiRS485': 
		// 									let objDeviceIrradiance = await db.queryForList("ClientDevice.getDataDeviceIrradiance", {
		// 										id_project: dataList[i].id, 
		// 										id_device_group: deviceGroup[j].id,
		// 										table_name: deviceGroup[j].table_name
		// 									});
		// 									if(Libs.isArrayData(objDeviceIrradiance)){
		// 										irradiance = objDeviceIrradiance;
		// 									}
		// 								break;
		// 								case 'model_sensor_IMT_TaRS485': 
		// 								break;
		// 							}
		// 						}
		// 					}

		// 					// get alert by site

		// 					let arrAlert = await db.queryForList("ClientDevice.getAlertBySite", {
		// 						id_project: dataList[i].id, 
		// 						id_language: data.id_language
		// 					});

		// 					if(Libs.isArrayData(arrAlert)){
		// 						dataList[i].alerts = arrAlert;
		// 					} else {
		// 						dataList[i].alerts = [];
		// 					}

		// 					dataList[i].energy_today = energy_today;
		// 					dataList[i].lifetime = lifetime;
		// 					dataList[i].revenue = lifetime * dataList[i].config_revenue;
		// 					dataList[i].irradiance = irradiance;


		// 					// 
		// 					// item.id_employee = data.id_employee;
		// 					// var listProjects = await db.queryForList("ClientDevice.getAllProjectByEmployeeId", item);
		// 					// if (Libs.isArrayData(listProjects) && listProjects.length > 0) {
		// 					// 	item.dataChilds = listProjects;
		// 					// 	dataProjects.push(item);
		// 					// }
		// 				}
		// 			}

		// 			conn.commit();
		// 			callBack(false, dataList);
		// 		} catch (err) {
		// 			console.log("Lỗi rolback", err);
		// 			conn.rollback();
		// 			callBack(true, err);
		// 		}
		// 	});

		// 	// try {
		// 	// 	if (!Libs.isBlank(data)) {
		// 	// 		data.current_row = (typeof data.current_row == 'undefined') ? 0 : data.current_row;
		// 	// 		data.max_record = Constants.data.max_record;
		// 	// 	}
		// 	// 	data = Libs.convertEmptyPropToNullProp(data);
		// 	// 	var db = new mySqLDB();
		// 	// 	db.queryForList("ClientDevice.getListProjectByEmployee", data, callback);
		// 	// } catch (e) {
		// 	// 	console.log(e);
		// 	// 	return callback(false, e);
		// 	// }
		// }


		// /**
		//  * @description Lấy tổng số dòng
		//  * @author Long.Pham
		//  * @since 30/07/2018
		//  * @param {Object User} data
		//  * @param {function callback} callback
		//  */
		// getListProjectByEmployeeSize(data, callback) {
		// 	try {
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.queryForObject("ClientDevice.getListProjectByEmployeeSize", data, callback);
		// 	} catch (e) {
		// 		console.log(e);
		// 		return callback(false, e);
		// 	}
		// }

		/**
   * @description Get all project by employee id
   * @author Minh.Tuan
   * @since 30/07/2019
   * @param {Object ClientDevice} data
   * @param {function callback} callback 
   */
		//  getAllProjectByEmployeeId(data, callback) {
		// 	try {
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.queryForList("ClientDevice.getAllProjectByEmployeeId", data, callback);
		// 	} catch (e) {
		// 		console.log(e);
		// 		return callback(false, e);
		// 	}
		// }
		/**
   * @description Get list
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object ClientDevice} data
   * @param {function callback} callback 
   */
		// getList(data, callback) {
		// 	try {
		// 		if (!Libs.isBlank(data)) {
		// 			data.current_row = (typeof data.current_row == 'undefined') ? 0 : data.current_row;
		// 			data.max_record = Constants.data.max_record;
		// 		}
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.queryForList("ClientDevice.getList", data, callback);
		// 	} catch (e) {
		// 		console.log(e);
		// 		return callback(false, e);
		// 	}
		// }

		// /**
		//  * @description Lấy tổng số dòng
		//  * @author Long.Pham
		//  * @since 30/07/2018
		//  * @param {Object User} data
		//  * @param {function callback} callback
		//  */
		// getSize(data, callback) {
		// 	try {
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.queryForObject("ClientDevice.getSize", data, callback);
		// 	} catch (e) {
		// 		console.log(e);
		// 		return callback(false, e);
		// 	}
		// }

		// /**
		//  * @description Insert data
		//  * @author Long.Pham
		//  * @since 30/07/2019
		//  * @param {Object ClientDevice} data
		//  */
		// insertClientDevice(data, callBack) {
		// 	try {
		// 		let self = this;
		// 		var db = new mySqLDB();
		// 		db.beginTransaction(async function (conn) {
		// 			try {

		// 				var rs = await db.insert("ClientDevice.insertClientDevice", data);
		// 				var curId = rs.insertId;

		// 				if (!rs) {
		// 					conn.rollback();
		// 					callBack(false, {});
		// 					return;
		// 				}

		// 				// insert table ClientDevice detail
		// 				let dataDetail = data.data;
		// 				if (dataDetail.length > 0) {
		// 					for (let i = 0; i < dataDetail.length; i++) {
		// 						dataDetail[i].id_ClientDevice = curId;
		// 					}
		// 					rs = await db.insert("ClientDevice.insertClientDeviceDetail", { dataDetail });
		// 				}

		// 				let dataEmployees = data.dataEmployees;
		// 				if (dataEmployees.length > 0) {
		// 					for (let i = 0; i < dataEmployees.length; i++) {
		// 						dataEmployees[i].id_ClientDevice = curId;
		// 					}
		// 					rs = await db.insert("ClientDevice.insertClientDeviceEmployeeMap", { dataEmployees });
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


		// /**
		//  * @description Update data
		//  * @author Long.Pham
		//  * @since 11/07/2019
		//  * @param {Object ClientDevice} data
		//  * @param {function callback} callback
		//  */
		// updateClientDevice(data, callBack) {
		// 	let self = this;
		// 	var db = new mySqLDB();
		// 	db.beginTransaction(async function (conn) {
		// 		try {

		// 			var rs = await db.delete("ClientDevice.deleteClientDeviceDetail", data);
		// 			rs = await db.delete("ClientDevice.deleteEmployeeClientDeviceMap", data);
		// 			rs = await db.update("ClientDevice.updateClientDevice", data);
		// 			if (!rs) {
		// 				conn.rollback();
		// 				callBack(false, {});
		// 				return;
		// 			}

		// 			// insert table ClientDevice detail
		// 			let dataDetail = data.data;
		// 			if (dataDetail.length > 0) {
		// 				await db.insert("ClientDevice.insertClientDeviceDetail", { dataDetail });
		// 			}

		// 			let dataEmployees = data.dataEmployees;
		// 				if (dataEmployees.length > 0) {
		// 					for (let i = 0; i < dataEmployees.length; i++) {
		// 						dataEmployees[i].id_ClientDevice = data.id;
		// 					}
		// 					rs = await db.insert("ClientDevice.insertClientDeviceEmployeeMap", { dataEmployees });
		// 				}


		// 			conn.commit();
		// 			callBack(true, {});
		// 		} catch (err) {
		// 			console.log("Lỗi rolback", err);
		// 			conn.rollback();
		// 			callBack(false, err);
		// 		}
		// 	})
		// }


		// /**
		//  * @description Update status
		//  * @author Long.Pham
		//  * @since 11/07/2019
		//  * @param {Object ClientDevice} data
		//  * @param {function callback} callback
		//  */
		// updateStatus(data, callBack) {
		// 	try {
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.update("ClientDevice.updateStatus", data, (err, rs) => {
		// 			return callBack(err, rs)
		// 		});
		// 	} catch (e) {
		// 		this.logger.error(e);
		// 		callBack(false, e);
		// 	}
		// }

		// /**
		//  * @description Update is_delete = 1
		//  * @author Long.Pham
		//  * @since 11/07/2019
		//  * @param {Object ClientDevice} data
		//  * @param {function callback} callback
		//  */
		// delete(data, callBack) {
		// 	try {
		// 		data = Libs.convertEmptyPropToNullProp(data);
		// 		var db = new mySqLDB();
		// 		db.delete("ClientDevice.delete", data, (err, rs) => {
		// 			return callBack(err, rs)
		// 		});
		// 	} catch (e) {
		// 		this.logger.error(e);
		// 		callBack(false, e);
		// 	}
		// }


		// /**
		// * get detail ClientDevice
		// * @param {*} data 
		// * @param {*} callBack 
		// */
		// getDetail(param, callBack) {
		// 	try {
		// 		var db = new mySqLDB();
		// 		db.beginTransaction(async function (conn) {
		// 			try {
		// 				var rs = await db.queryForList("ClientDevice.getDetail", param);
		// 				var data = rs[0][0];
		// 				data.data = rs[1];
		// 				data.dataEmployees = rs[2];
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


	}]);

	return ClientDeviceService;
}(_BaseService3.default);

exports.default = ClientDeviceService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9DbGllbnREZXZpY2VTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkNsaWVudERldmljZVNlcnZpY2UiLCJkYXRhIiwiY2FsbEJhY2siLCJkYiIsIm15U3FMREIiLCJiZWdpblRyYW5zYWN0aW9uIiwiY29ubiIsImN1cnJlbnRfZGF0ZSIsIkxpYnMiLCJjb252ZXJ0QWxsRm9ybWF0RGF0ZSIsImRhdGFEZXZpY2UiLCJxdWVyeUZvckxpc3QiLCJpc0FycmF5RGF0YSIsImkiLCJsZW5ndGgiLCJpdGVtIiwiYWxlcnRzIiwiaWRfZGV2aWNlIiwiaWQiLCJpZF9sYW5ndWFnZSIsImNvbW1pdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJyb2xsYmFjayIsImNhbGxiYWNrIiwiY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AiLCJxdWVyeUZvck9iamVjdCIsImUiLCJnZXRMYXN0Um93RGF0YURldmljZSIsInRhYmxlX25hbWUiLCJtb21lbnQiLCJyZXF1aXJlIiwiZGF0ZSIsImZvcm1hdCIsInZhbHVlIiwic2x1ZyIsImxhc3RfY29tbXVuaWNhdGlvbiIsImxhc3RfYXR0ZW1wdCIsImlzQmxhbmsiLCJjdXJyZW50X3JvdyIsIm1heF9yZWNvcmQiLCJDb25zdGFudHMiLCJCYXNlU2VydmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBQ01BLG1COzs7QUFDTCxnQ0FBYztBQUFBOztBQUFBO0FBR2I7O0FBRUQ7Ozs7Ozs7Ozs7MEJBUVFDLEksRUFBTUMsUSxFQUFVO0FBQ3ZCLE9BQUlDLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FELE1BQUdFLGdCQUFILENBQW9CLGdCQUFnQkMsSUFBaEIsRUFBc0I7QUFDekMsUUFBSTs7QUFFSEwsVUFBS00sWUFBTCxHQUFvQkMsS0FBS0Msb0JBQUwsQ0FBMEJSLEtBQUtNLFlBQS9CLENBQXBCO0FBQ0EsU0FBSUcsYUFBYSxNQUFNUCxHQUFHUSxZQUFILENBQWdCLHNCQUFo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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztFQS9oQmlDZSxxQjs7a0JBb2lCbkIzQyxtQiIsImZpbGUiOiJDbGllbnREZXZpY2VTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTZXJ2aWNlIGZyb20gJy4vQmFzZVNlcnZpY2UnO1xyXG5jbGFzcyBDbGllbnREZXZpY2VTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3RcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMi8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHJcblx0Z2V0TGlzdChkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRkYXRhLmN1cnJlbnRfZGF0ZSA9IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUoZGF0YS5jdXJyZW50X2RhdGUpO1xyXG5cdFx0XHRcdHZhciBkYXRhRGV2aWNlID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50RGV2aWNlLmdldExpc3RcIiwgZGF0YSk7XHJcblx0XHRcdFx0aWYgKExpYnMuaXNBcnJheURhdGEoZGF0YURldmljZSkpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YURldmljZS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHR2YXIgaXRlbSA9IGRhdGFEZXZpY2VbaV07XHJcblx0XHRcdFx0XHRcdC8vIEdldCBsaXN0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdGxldCBhbGVydHMgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnREZXZpY2UuZ2V0QWxlcnRCeURldmljZVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBpdGVtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdGlkX2xhbmd1YWdlOiBkYXRhLmlkX2xhbmd1YWdlXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmFsZXJ0cyA9IGFsZXJ0cztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGFEZXZpY2UpO1xyXG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEzhuqV5IHThu5VuZyBz4buRIGTDsm5nXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTIvMDkvMjAyMVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IERldmljZX0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0Z2V0U2l6ZShkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiQ2xpZW50RGV2aWNlLmdldFNpemVcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBsaXN0XHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTIvMDkvMjAyMVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0ICovXHJcblxyXG5cdGdldExpc3RQYXJhbWV0ZXJCeURldmljZShkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR2YXIgZGF0YURldmljZSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudERldmljZS5nZXRMaXN0UGFyYW1ldGVyQnlEZXZpY2VcIiwgZGF0YSk7XHJcblxyXG5cdFx0XHRcdGxldCBnZXRMYXN0Um93RGF0YURldmljZSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiQ2xpZW50RGV2aWNlLmdldExhc3RSb3dEYXRhRGV2aWNlXCIsIHtcclxuXHRcdFx0XHRcdGlkX2RldmljZTogZGF0YS5pZCxcclxuXHRcdFx0XHRcdGlkX2xhbmd1YWdlOiBkYXRhLmlkX2xhbmd1YWdlLFxyXG5cdFx0XHRcdFx0dGFibGVfbmFtZTogZGF0YS50YWJsZV9uYW1lXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0Y29uc3QgbW9tZW50ID0gcmVxdWlyZShcIm1vbWVudFwiKTtcclxuXHRcdFx0XHRsZXQgZGF0ZSA9IG1vbWVudCgpLmZvcm1hdCgnREQvTU0vWVlZWSBISDptbTpzcycpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmKExpYnMuaXNBcnJheURhdGEoZGF0YURldmljZSkgJiYgZ2V0TGFzdFJvd0RhdGFEZXZpY2Upe1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhRGV2aWNlLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0udmFsdWUgPSBnZXRMYXN0Um93RGF0YURldmljZVtkYXRhRGV2aWNlW2ldLnNsdWddO1xyXG5cdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmxhc3RfY29tbXVuaWNhdGlvbiA9IGdldExhc3RSb3dEYXRhRGV2aWNlWydsYXN0X2NvbW11bmljYXRpb24nXTtcclxuXHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5sYXN0X2F0dGVtcHQgPSBkYXRlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhRGV2aWNlKTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdCBhbGVydCBieSBkZWl2Y2VcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxOC8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHQgZ2V0TGlzdEFsZXJ0QnlEZXZpY2UoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEpKSB7XHJcblx0XHRcdFx0ZGF0YS5jdXJyZW50X3JvdyA9ICh0eXBlb2YgZGF0YS5jdXJyZW50X3JvdyA9PSAndW5kZWZpbmVkJykgPyAwIDogZGF0YS5jdXJyZW50X3JvdztcclxuXHRcdFx0XHRkYXRhLm1heF9yZWNvcmQgPSBDb25zdGFudHMuZGF0YS5tYXhfcmVjb3JkO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvckxpc3QoXCJDbGllbnREZXZpY2UuZ2V0TGlzdEFsZXJ0QnlEZXZpY2VcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBM4bqleSB04buVbmcgc+G7kSBkw7JuZ1xyXG5cdCAqIEBhdXRob3IgbG9uZy5waGFtXHJcblx0ICogQHNpbmNlIDE4LzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdCBhbGVydH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0IGdldExpc3RBbGVydEJ5RGV2aWNlU2l6ZShkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiQ2xpZW50RGV2aWNlLmdldExpc3RBbGVydEJ5RGV2aWNlU2l6ZVwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBhbGxcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgR3JvdXBBdHRyaWJ1dGVzfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0ICovXHJcblx0Ly8gZ2V0QWxsUHJvamVjdEJ5RW1wbG95ZWVJZChkYXRhLCBjYWxsQmFjaykge1xyXG5cdC8vIFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHQvLyBcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHQvLyBcdFx0dHJ5IHtcclxuXHQvLyBcdFx0XHR2YXIgZGF0YVByb2plY3RzID0gW107XHJcblx0Ly8gXHRcdFx0dmFyIHNjb3BlID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50RGV2aWNlLmdldEFsbFNjb3BlXCIsIGRhdGEpO1xyXG5cdC8vIFx0XHRcdGlmIChMaWJzLmlzQXJyYXlEYXRhKHNjb3BlKSkge1xyXG5cdC8vIFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzY29wZS5sZW5ndGg7IGkrKykge1xyXG5cdC8vIFx0XHRcdFx0XHR2YXIgaXRlbSA9IHNjb3BlW2ldO1xyXG5cdC8vIFx0XHRcdFx0XHRpdGVtLmlkX2VtcGxveWVlID0gZGF0YS5pZF9lbXBsb3llZTtcclxuXHQvLyBcdFx0XHRcdFx0dmFyIGxpc3RQcm9qZWN0cyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudERldmljZS5nZXRBbGxQcm9qZWN0QnlFbXBsb3llZUlkXCIsIGl0ZW0pO1xyXG5cdC8vIFx0XHRcdFx0XHRpZiAoTGlicy5pc0FycmF5RGF0YShsaXN0UHJvamVjdHMpICYmIGxpc3RQcm9qZWN0cy5sZW5ndGggPiAwKSB7XHJcblx0Ly8gXHRcdFx0XHRcdFx0aXRlbS5kYXRhQ2hpbGRzID0gbGlzdFByb2plY3RzO1xyXG5cdC8vIFx0XHRcdFx0XHRcdGRhdGFQcm9qZWN0cy5wdXNoKGl0ZW0pO1xyXG5cdC8vIFx0XHRcdFx0XHR9XHJcblx0Ly8gXHRcdFx0XHR9XHJcblx0Ly8gXHRcdFx0fVxyXG5cclxuXHQvLyBcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdC8vIFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhUHJvamVjdHMpO1xyXG5cdC8vIFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHQvLyBcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHQvLyBcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0Ly8gXHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHQvLyBcdFx0fVxyXG5cdC8vIFx0fSk7XHJcblx0Ly8gfVxyXG5cclxuXHJcblx0Ly8gLyoqXHJcblx0Ly8gICogQGRlc2NyaXB0aW9uIEdldCBsaXN0IHByb2plY3QgYnkgZW1wbG95ZWUgaWRcclxuXHQvLyAgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdC8vICAqIEBzaW5jZSAzMC8wOS8yMDIxXHJcblx0Ly8gICogQHBhcmFtIHtPYmplY3QgQ2xpZW50RGV2aWNlfSBkYXRhXHJcblx0Ly8gICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0Ly8gICovXHJcblx0Ly8gZ2V0TGlzdFByb2plY3RCeUVtcGxveWVlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0Ly8gXHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdC8vIFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdC8vIFx0XHR0cnkge1xyXG5cdC8vIFx0XHRcdC8vIHZhciBkYXRhUHJvamVjdHMgPSBbXTtcclxuXHQvLyBcdFx0XHR2YXIgZGF0YUxpc3QgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnREZXZpY2UuZ2V0TGlzdFByb2plY3RCeUVtcGxveWVlXCIsIGRhdGEpO1xyXG5cdC8vIFx0XHRcdGlmIChMaWJzLmlzQXJyYXlEYXRhKGRhdGFMaXN0KSkge1xyXG5cdC8vIFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhTGlzdC5sZW5ndGg7IGkrKykge1xyXG5cclxuXHQvLyBcdFx0XHRcdFx0Ly8gZ2V0IGdyb3VwIGRldmljZVxyXG5cdC8vIFx0XHRcdFx0XHR2YXIgaXRlbSA9IGRhdGFMaXN0W2ldO1xyXG5cdC8vIFx0XHRcdFx0XHR2YXIgZGV2aWNlR3JvdXAgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnREZXZpY2UuZ2V0R3JvdXBEZXZpY2VCeVByb2plY3RJZFwiLCBpdGVtKTtcclxuXHQvLyBcdFx0XHRcdFx0dmFyIGlycmFkaWFuY2UgPSBbXTtcclxuXHQvLyBcdFx0XHRcdFx0dmFyIGVuZXJneV90b2RheSA9IDAsIGxpZmV0aW1lID0gMCwgcmV2ZW51ZSA9IDA7XHJcblx0Ly8gXHRcdFx0XHRcdGlmKExpYnMuaXNBcnJheURhdGEoZGV2aWNlR3JvdXApKXtcclxuXHQvLyBcdFx0XHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGRldmljZUdyb3VwLmxlbmd0aDsgaisrKSB7XHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRzd2l0Y2goZGV2aWNlR3JvdXBbal0udGFibGVfbmFtZSl7XHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TVFA1MCc6XHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TSFA3NSc6IFxyXG5cdC8vIFx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9BQkJfUFZTMTAwJzpcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqRGV2aWNlID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJDbGllbnREZXZpY2UuZ2V0RGF0YURldmljZUVuZXJneVwiLCB7XHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9wcm9qZWN0OiBkYXRhTGlzdFtpXS5pZCwgXHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGRldmljZUdyb3VwW2pdLmlkLFxyXG5cdC8vIFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZGV2aWNlR3JvdXBbal0udGFibGVfbmFtZVxyXG5cdC8vIFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdC8vIFx0XHRcdFx0XHRcdFx0XHRcdGlmKG9iakRldmljZSl7XHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdFx0XHRlbmVyZ3lfdG9kYXkgPSBlbmVyZ3lfdG9kYXkgKyBvYmpEZXZpY2UudG9kYXlfYWN0aXZlRW5lcmd5O1xyXG5cdC8vIFx0XHRcdFx0XHRcdFx0XHRcdFx0bGlmZXRpbWUgPSBsaWZldGltZSArIG9iakRldmljZS5saWZldGltZTtcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdC8vIFx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TdW5ncm93X1NHMTEwQ1gnOiBcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX0dyb3dhdHRfR1c4MEtUTDMnOiBcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX3NlbnNvcl9JTVRfU2lSUzQ4NSc6IFxyXG5cdC8vIFx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpEZXZpY2VJcnJhZGlhbmNlID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50RGV2aWNlLmdldERhdGFEZXZpY2VJcnJhZGlhbmNlXCIsIHtcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX3Byb2plY3Q6IGRhdGFMaXN0W2ldLmlkLCBcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZGV2aWNlR3JvdXBbal0uaWQsXHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBkZXZpY2VHcm91cFtqXS50YWJsZV9uYW1lXHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdFx0aWYoTGlicy5pc0FycmF5RGF0YShvYmpEZXZpY2VJcnJhZGlhbmNlKSl7XHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdFx0XHRpcnJhZGlhbmNlID0gb2JqRGV2aWNlSXJyYWRpYW5jZTtcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0Ly8gXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdC8vIFx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9zZW5zb3JfSU1UX1RhUlM0ODUnOiBcclxuXHQvLyBcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0Ly8gXHRcdFx0XHRcdFx0XHR9XHJcblx0Ly8gXHRcdFx0XHRcdFx0fVxyXG5cdC8vIFx0XHRcdFx0XHR9XHJcblxyXG5cdC8vIFx0XHRcdFx0XHQvLyBnZXQgYWxlcnQgYnkgc2l0ZVxyXG5cclxuXHQvLyBcdFx0XHRcdFx0bGV0IGFyckFsZXJ0ID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50RGV2aWNlLmdldEFsZXJ0QnlTaXRlXCIsIHtcclxuXHQvLyBcdFx0XHRcdFx0XHRpZF9wcm9qZWN0OiBkYXRhTGlzdFtpXS5pZCwgXHJcblx0Ly8gXHRcdFx0XHRcdFx0aWRfbGFuZ3VhZ2U6IGRhdGEuaWRfbGFuZ3VhZ2VcclxuXHQvLyBcdFx0XHRcdFx0fSk7XHJcblxyXG5cdC8vIFx0XHRcdFx0XHRpZihMaWJzLmlzQXJyYXlEYXRhKGFyckFsZXJ0KSl7XHJcblx0Ly8gXHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uYWxlcnRzID0gYXJyQWxlcnQ7XHJcblx0Ly8gXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0Ly8gXHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uYWxlcnRzID0gW107XHJcblx0Ly8gXHRcdFx0XHRcdH1cclxuXHJcblx0Ly8gXHRcdFx0XHRcdGRhdGFMaXN0W2ldLmVuZXJneV90b2RheSA9IGVuZXJneV90b2RheTtcclxuXHQvLyBcdFx0XHRcdFx0ZGF0YUxpc3RbaV0ubGlmZXRpbWUgPSBsaWZldGltZTtcclxuXHQvLyBcdFx0XHRcdFx0ZGF0YUxpc3RbaV0ucmV2ZW51ZSA9IGxpZmV0aW1lICogZGF0YUxpc3RbaV0uY29uZmlnX3JldmVudWU7XHJcblx0Ly8gXHRcdFx0XHRcdGRhdGFMaXN0W2ldLmlycmFkaWFuY2UgPSBpcnJhZGlhbmNlO1xyXG5cclxuXHJcblx0Ly8gXHRcdFx0XHRcdC8vIFxyXG5cdC8vIFx0XHRcdFx0XHQvLyBpdGVtLmlkX2VtcGxveWVlID0gZGF0YS5pZF9lbXBsb3llZTtcclxuXHQvLyBcdFx0XHRcdFx0Ly8gdmFyIGxpc3RQcm9qZWN0cyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudERldmljZS5nZXRBbGxQcm9qZWN0QnlFbXBsb3llZUlkXCIsIGl0ZW0pO1xyXG5cdC8vIFx0XHRcdFx0XHQvLyBpZiAoTGlicy5pc0FycmF5RGF0YShsaXN0UHJvamVjdHMpICYmIGxpc3RQcm9qZWN0cy5sZW5ndGggPiAwKSB7XHJcblx0Ly8gXHRcdFx0XHRcdC8vIFx0aXRlbS5kYXRhQ2hpbGRzID0gbGlzdFByb2plY3RzO1xyXG5cdC8vIFx0XHRcdFx0XHQvLyBcdGRhdGFQcm9qZWN0cy5wdXNoKGl0ZW0pO1xyXG5cdC8vIFx0XHRcdFx0XHQvLyB9XHJcblx0Ly8gXHRcdFx0XHR9XHJcblx0Ly8gXHRcdFx0fVxyXG5cclxuXHQvLyBcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdC8vIFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhTGlzdCk7XHJcblx0Ly8gXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdC8vIFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdC8vIFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHQvLyBcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9KTtcclxuXHJcblx0Ly8gXHQvLyB0cnkge1xyXG5cdC8vIFx0Ly8gXHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhKSkge1xyXG5cdC8vIFx0Ly8gXHRcdGRhdGEuY3VycmVudF9yb3cgPSAodHlwZW9mIGRhdGEuY3VycmVudF9yb3cgPT0gJ3VuZGVmaW5lZCcpID8gMCA6IGRhdGEuY3VycmVudF9yb3c7XHJcblx0Ly8gXHQvLyBcdFx0ZGF0YS5tYXhfcmVjb3JkID0gQ29uc3RhbnRzLmRhdGEubWF4X3JlY29yZDtcclxuXHQvLyBcdC8vIFx0fVxyXG5cdC8vIFx0Ly8gXHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHQvLyBcdC8vIFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHQvLyBcdC8vIFx0ZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50RGV2aWNlLmdldExpc3RQcm9qZWN0QnlFbXBsb3llZVwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0Ly8gXHQvLyB9IGNhdGNoIChlKSB7XHJcblx0Ly8gXHQvLyBcdGNvbnNvbGUubG9nKGUpO1xyXG5cdC8vIFx0Ly8gXHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdC8vIFx0Ly8gfVxyXG5cdC8vIH1cclxuXHJcblxyXG5cdC8vIC8qKlxyXG5cdC8vICAqIEBkZXNjcmlwdGlvbiBM4bqleSB04buVbmcgc+G7kSBkw7JuZ1xyXG5cdC8vICAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0Ly8gICogQHNpbmNlIDMwLzA3LzIwMThcclxuXHQvLyAgKiBAcGFyYW0ge09iamVjdCBVc2VyfSBkYXRhXHJcblx0Ly8gICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQvLyAgKi9cclxuXHQvLyBnZXRMaXN0UHJvamVjdEJ5RW1wbG95ZWVTaXplKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0Ly8gXHR0cnkge1xyXG5cdC8vIFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHQvLyBcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHQvLyBcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJDbGllbnREZXZpY2UuZ2V0TGlzdFByb2plY3RCeUVtcGxveWVlU2l6ZVwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0Ly8gXHR9IGNhdGNoIChlKSB7XHJcblx0Ly8gXHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdC8vIFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBhbGwgcHJvamVjdCBieSBlbXBsb3llZSBpZFxyXG5cdCAqIEBhdXRob3IgTWluaC5UdWFuXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBDbGllbnREZXZpY2V9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHQvLyAgZ2V0QWxsUHJvamVjdEJ5RW1wbG95ZWVJZChkYXRhLCBjYWxsYmFjaykge1xyXG5cdC8vIFx0dHJ5IHtcclxuXHQvLyBcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0Ly8gXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0Ly8gXHRcdGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudERldmljZS5nZXRBbGxQcm9qZWN0QnlFbXBsb3llZUlkXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHQvLyBcdH0gY2F0Y2ggKGUpIHtcclxuXHQvLyBcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0Ly8gXHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBDbGllbnREZXZpY2V9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHQvLyBnZXRMaXN0KGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0Ly8gXHR0cnkge1xyXG5cdC8vIFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhKSkge1xyXG5cdC8vIFx0XHRcdGRhdGEuY3VycmVudF9yb3cgPSAodHlwZW9mIGRhdGEuY3VycmVudF9yb3cgPT0gJ3VuZGVmaW5lZCcpID8gMCA6IGRhdGEuY3VycmVudF9yb3c7XHJcblx0Ly8gXHRcdFx0ZGF0YS5tYXhfcmVjb3JkID0gQ29uc3RhbnRzLmRhdGEubWF4X3JlY29yZDtcclxuXHQvLyBcdFx0fVxyXG5cdC8vIFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHQvLyBcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHQvLyBcdFx0ZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50RGV2aWNlLmdldExpc3RcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdC8vIFx0fSBjYXRjaCAoZSkge1xyXG5cdC8vIFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHQvLyBcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcblxyXG5cdC8vIC8qKlxyXG5cdC8vICAqIEBkZXNjcmlwdGlvbiBM4bqleSB04buVbmcgc+G7kSBkw7JuZ1xyXG5cdC8vICAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0Ly8gICogQHNpbmNlIDMwLzA3LzIwMThcclxuXHQvLyAgKiBAcGFyYW0ge09iamVjdCBVc2VyfSBkYXRhXHJcblx0Ly8gICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQvLyAgKi9cclxuXHQvLyBnZXRTaXplKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0Ly8gXHR0cnkge1xyXG5cdC8vIFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHQvLyBcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHQvLyBcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJDbGllbnREZXZpY2UuZ2V0U2l6ZVwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0Ly8gXHR9IGNhdGNoIChlKSB7XHJcblx0Ly8gXHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdC8vIFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxuXHJcblx0Ly8gLyoqXHJcblx0Ly8gICogQGRlc2NyaXB0aW9uIEluc2VydCBkYXRhXHJcblx0Ly8gICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQvLyAgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdC8vICAqIEBwYXJhbSB7T2JqZWN0IENsaWVudERldmljZX0gZGF0YVxyXG5cdC8vICAqL1xyXG5cdC8vIGluc2VydENsaWVudERldmljZShkYXRhLCBjYWxsQmFjaykge1xyXG5cdC8vIFx0dHJ5IHtcclxuXHQvLyBcdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cdC8vIFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdC8vIFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0Ly8gXHRcdFx0dHJ5IHtcclxuXHJcblx0Ly8gXHRcdFx0XHR2YXIgcnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJDbGllbnREZXZpY2UuaW5zZXJ0Q2xpZW50RGV2aWNlXCIsIGRhdGEpO1xyXG5cdC8vIFx0XHRcdFx0dmFyIGN1cklkID0gcnMuaW5zZXJ0SWQ7XHJcblxyXG5cdC8vIFx0XHRcdFx0aWYgKCFycykge1xyXG5cdC8vIFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0Ly8gXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0Ly8gXHRcdFx0XHRcdHJldHVybjtcclxuXHQvLyBcdFx0XHRcdH1cclxuXHJcblx0Ly8gXHRcdFx0XHQvLyBpbnNlcnQgdGFibGUgQ2xpZW50RGV2aWNlIGRldGFpbFxyXG5cdC8vIFx0XHRcdFx0bGV0IGRhdGFEZXRhaWwgPSBkYXRhLmRhdGE7XHJcblx0Ly8gXHRcdFx0XHRpZiAoZGF0YURldGFpbC5sZW5ndGggPiAwKSB7XHJcblx0Ly8gXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YURldGFpbC5sZW5ndGg7IGkrKykge1xyXG5cdC8vIFx0XHRcdFx0XHRcdGRhdGFEZXRhaWxbaV0uaWRfQ2xpZW50RGV2aWNlID0gY3VySWQ7XHJcblx0Ly8gXHRcdFx0XHRcdH1cclxuXHQvLyBcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJDbGllbnREZXZpY2UuaW5zZXJ0Q2xpZW50RGV2aWNlRGV0YWlsXCIsIHsgZGF0YURldGFpbCB9KTtcclxuXHQvLyBcdFx0XHRcdH1cclxuXHJcblx0Ly8gXHRcdFx0XHRsZXQgZGF0YUVtcGxveWVlcyA9IGRhdGEuZGF0YUVtcGxveWVlcztcclxuXHQvLyBcdFx0XHRcdGlmIChkYXRhRW1wbG95ZWVzLmxlbmd0aCA+IDApIHtcclxuXHQvLyBcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhRW1wbG95ZWVzLmxlbmd0aDsgaSsrKSB7XHJcblx0Ly8gXHRcdFx0XHRcdFx0ZGF0YUVtcGxveWVlc1tpXS5pZF9DbGllbnREZXZpY2UgPSBjdXJJZDtcclxuXHQvLyBcdFx0XHRcdFx0fVxyXG5cdC8vIFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIkNsaWVudERldmljZS5pbnNlcnRDbGllbnREZXZpY2VFbXBsb3llZU1hcFwiLCB7IGRhdGFFbXBsb3llZXMgfSk7XHJcblx0Ly8gXHRcdFx0XHR9XHJcblxyXG5cdC8vIFx0XHRcdFx0aWYgKCFycykge1xyXG5cdC8vIFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0Ly8gXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0Ly8gXHRcdFx0XHRcdHJldHVybjtcclxuXHQvLyBcdFx0XHRcdH1cclxuXHQvLyBcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0Ly8gXHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0Ly8gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0Ly8gXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHQvLyBcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHQvLyBcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdC8vIFx0XHRcdH1cclxuXHQvLyBcdFx0fSlcclxuXHQvLyBcdH0gY2F0Y2ggKGUpIHtcclxuXHQvLyBcdFx0Y29uc29sZS5sb2coJ2Vycm9yJywgZSk7XHJcblx0Ly8gXHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcblxyXG5cclxuXHQvLyAvKipcclxuXHQvLyAgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGRhdGFcclxuXHQvLyAgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdC8vICAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0Ly8gICogQHBhcmFtIHtPYmplY3QgQ2xpZW50RGV2aWNlfSBkYXRhXHJcblx0Ly8gICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQvLyAgKi9cclxuXHQvLyB1cGRhdGVDbGllbnREZXZpY2UoZGF0YSwgY2FsbEJhY2spIHtcclxuXHQvLyBcdGxldCBzZWxmID0gdGhpcztcclxuXHQvLyBcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0Ly8gXHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0Ly8gXHRcdHRyeSB7XHJcblxyXG5cdC8vIFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLmRlbGV0ZShcIkNsaWVudERldmljZS5kZWxldGVDbGllbnREZXZpY2VEZXRhaWxcIiwgZGF0YSk7XHJcblx0Ly8gXHRcdFx0cnMgPSBhd2FpdCBkYi5kZWxldGUoXCJDbGllbnREZXZpY2UuZGVsZXRlRW1wbG95ZWVDbGllbnREZXZpY2VNYXBcIiwgZGF0YSk7XHJcblx0Ly8gXHRcdFx0cnMgPSBhd2FpdCBkYi51cGRhdGUoXCJDbGllbnREZXZpY2UudXBkYXRlQ2xpZW50RGV2aWNlXCIsIGRhdGEpO1xyXG5cdC8vIFx0XHRcdGlmICghcnMpIHtcclxuXHQvLyBcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHQvLyBcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0Ly8gXHRcdFx0XHRyZXR1cm47XHJcblx0Ly8gXHRcdFx0fVxyXG5cclxuXHQvLyBcdFx0XHQvLyBpbnNlcnQgdGFibGUgQ2xpZW50RGV2aWNlIGRldGFpbFxyXG5cdC8vIFx0XHRcdGxldCBkYXRhRGV0YWlsID0gZGF0YS5kYXRhO1xyXG5cdC8vIFx0XHRcdGlmIChkYXRhRGV0YWlsLmxlbmd0aCA+IDApIHtcclxuXHQvLyBcdFx0XHRcdGF3YWl0IGRiLmluc2VydChcIkNsaWVudERldmljZS5pbnNlcnRDbGllbnREZXZpY2VEZXRhaWxcIiwgeyBkYXRhRGV0YWlsIH0pO1xyXG5cdC8vIFx0XHRcdH1cclxuXHJcblx0Ly8gXHRcdFx0bGV0IGRhdGFFbXBsb3llZXMgPSBkYXRhLmRhdGFFbXBsb3llZXM7XHJcblx0Ly8gXHRcdFx0XHRpZiAoZGF0YUVtcGxveWVlcy5sZW5ndGggPiAwKSB7XHJcblx0Ly8gXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUVtcGxveWVlcy5sZW5ndGg7IGkrKykge1xyXG5cdC8vIFx0XHRcdFx0XHRcdGRhdGFFbXBsb3llZXNbaV0uaWRfQ2xpZW50RGV2aWNlID0gZGF0YS5pZDtcclxuXHQvLyBcdFx0XHRcdFx0fVxyXG5cdC8vIFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIkNsaWVudERldmljZS5pbnNlcnRDbGllbnREZXZpY2VFbXBsb3llZU1hcFwiLCB7IGRhdGFFbXBsb3llZXMgfSk7XHJcblx0Ly8gXHRcdFx0XHR9XHJcblxyXG5cclxuXHQvLyBcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdC8vIFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHQvLyBcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0Ly8gXHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0Ly8gXHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdC8vIFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9KVxyXG5cdC8vIH1cclxuXHJcblxyXG5cclxuXHQvLyAvKipcclxuXHQvLyAgKiBAZGVzY3JpcHRpb24gVXBkYXRlIHN0YXR1c1xyXG5cdC8vICAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0Ly8gICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQvLyAgKiBAcGFyYW0ge09iamVjdCBDbGllbnREZXZpY2V9IGRhdGFcclxuXHQvLyAgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdC8vICAqL1xyXG5cdC8vIHVwZGF0ZVN0YXR1cyhkYXRhLCBjYWxsQmFjaykge1xyXG5cdC8vIFx0dHJ5IHtcclxuXHQvLyBcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0Ly8gXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0Ly8gXHRcdGRiLnVwZGF0ZShcIkNsaWVudERldmljZS51cGRhdGVTdGF0dXNcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHQvLyBcdFx0XHRyZXR1cm4gY2FsbEJhY2soZXJyLCBycylcclxuXHQvLyBcdFx0fSk7XHJcblx0Ly8gXHR9IGNhdGNoIChlKSB7XHJcblx0Ly8gXHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdC8vIFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cclxuXHQvLyAvKipcclxuXHQvLyAgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGlzX2RlbGV0ZSA9IDFcclxuXHQvLyAgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdC8vICAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0Ly8gICogQHBhcmFtIHtPYmplY3QgQ2xpZW50RGV2aWNlfSBkYXRhXHJcblx0Ly8gICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQvLyAgKi9cclxuXHQvLyBkZWxldGUoZGF0YSwgY2FsbEJhY2spIHtcclxuXHQvLyBcdHRyeSB7XHJcblx0Ly8gXHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdC8vIFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdC8vIFx0XHRkYi5kZWxldGUoXCJDbGllbnREZXZpY2UuZGVsZXRlXCIsIGRhdGEsIChlcnIsIHJzKSA9PiB7XHJcblx0Ly8gXHRcdFx0cmV0dXJuIGNhbGxCYWNrKGVyciwgcnMpXHJcblx0Ly8gXHRcdH0pO1xyXG5cdC8vIFx0fSBjYXRjaCAoZSkge1xyXG5cdC8vIFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcclxuXHQvLyBcdFx0Y2FsbEJhY2soZmFsc2UsIGUpO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxuXHJcblxyXG5cdC8vIC8qKlxyXG5cdC8vICogZ2V0IGRldGFpbCBDbGllbnREZXZpY2VcclxuXHQvLyAqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQvLyAqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ly8gKi9cclxuXHQvLyBnZXREZXRhaWwocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0Ly8gXHR0cnkge1xyXG5cdC8vIFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdC8vIFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0Ly8gXHRcdFx0dHJ5IHtcclxuXHQvLyBcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudERldmljZS5nZXREZXRhaWxcIiwgcGFyYW0pO1xyXG5cdC8vIFx0XHRcdFx0dmFyIGRhdGEgPSByc1swXVswXTtcclxuXHQvLyBcdFx0XHRcdGRhdGEuZGF0YSA9IHJzWzFdO1xyXG5cdC8vIFx0XHRcdFx0ZGF0YS5kYXRhRW1wbG95ZWVzID0gcnNbMl07XHJcblx0Ly8gXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdC8vIFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGEpO1xyXG5cdC8vIFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdC8vIFx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0Ly8gXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0Ly8gXHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdC8vIFx0XHRcdH1cclxuXHQvLyBcdFx0fSk7XHJcblx0Ly8gXHR9IGNhdGNoIChlcnIpIHtcclxuXHQvLyBcdFx0Ly8gY29uc29sZS5sb2coJ2Vycm9yIGdldCBtYXRlcmlhbCBvcmRlciBmb3Igdm91Y2hlciBvdXQnLCBlcnIpO1xyXG5cdC8vIFx0XHRpZiAoY29ubikge1xyXG5cdC8vIFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHQvLyBcdFx0fVxyXG5cdC8vIFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxuXHJcblxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBDbGllbnREZXZpY2VTZXJ2aWNlO1xyXG4iXX0=