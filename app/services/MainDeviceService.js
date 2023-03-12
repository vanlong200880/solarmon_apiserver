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

var MainDeviceService = function (_BaseService) {
	_inherits(MainDeviceService, _BaseService);

	function MainDeviceService() {
		_classCallCheck(this, MainDeviceService);

		return _possibleConstructorReturn(this, (MainDeviceService.__proto__ || Object.getPrototypeOf(MainDeviceService)).call(this));
	}

	/**
  * @description Get list
  * @author Long.Pham
  * @since 12/09/2021
  * @param {Object} data
  * @param {function callback} callback 
  */

	_createClass(MainDeviceService, [{
		key: "getListInverter",
		value: function getListInverter(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {

					data.current_date = Libs.convertAllFormatDate(data.current_date);
					var dataDevice = await db.queryForList("MainDevice.getListInverter", data);
					if (Libs.isArrayData(dataDevice)) {
						for (var i = 0; i < dataDevice.length; i++) {
							var item = dataDevice[i];
							// get info power now, energy, lifetime
							var objData = await db.queryForObject("MainDevice.getDataDeviceModelInfo", {
								id_device: item.id,
								id_language: data.id_language,
								table_name: item.table_name,
								current_date: data.current_date
							});

							switch (item.table_name) {
								case 'model_inverter_SMA_STP110':
									if (objData) {
										dataDevice[i].powerFactor = objData.powerFactor;
										dataDevice[i].reactivePower = objData.reactivePower;
										dataDevice[i].activePower = objData.activePower / 1000;
										dataDevice[i].activeEnergy = objData.activeEnergy / 1000;
										dataDevice[i].internalTemperature = objData.cabinetTemperature;
									} else {
										dataDevice[i].powerFactor = 0;
										dataDevice[i].reactivePower = 0;
										dataDevice[i].activePower = 0;
										dataDevice[i].activeEnergy = 0;
										dataDevice[i].internalTemperature = 0;
										// dataDevice[i].status = 0;
									}

									break;
								case 'model_inverter_SMA_STP50':
								case 'model_inverter_SMA_SHP75':
								case 'model_inverter_ABB_PVS100':
									if (objData) {
										dataDevice[i].powerFactor = objData.powerFactor;
										dataDevice[i].reactivePower = objData.reactivePower;
										dataDevice[i].activePower = objData.activePower / 1000;
										dataDevice[i].activeEnergy = objData.activeEnergy / 1000;
										dataDevice[i].internalTemperature = objData.internalTemperature;
									} else {
										dataDevice[i].powerFactor = 0;
										dataDevice[i].reactivePower = 0;
										dataDevice[i].activePower = 0;
										dataDevice[i].activeEnergy = 0;
										dataDevice[i].internalTemperature = 0;
										// dataDevice[i].status = 0;
									}
									break;
								default:
									dataDevice[i].powerFactor = null;
									dataDevice[i].reactivePower = null;
									dataDevice[i].activePower = null;
									dataDevice[i].activeEnergy = null;
									dataDevice[i].internalTemperature = null;
									dataDevice[i].status = 0;
									break;
							}
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
   * @description Get list
   * @author Long.Pham
   * @since 12/09/2021
   * @param {Object} data
   * @param {function callback} callback 
   */

	}, {
		key: "getList",
		value: function getList(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {

					data.current_date = Libs.convertAllFormatDate(data.current_date);
					var dataDevice = await db.queryForList("MainDevice.getList", data);
					if (Libs.isArrayData(dataDevice)) {
						for (var i = 0; i < dataDevice.length; i++) {
							var item = dataDevice[i];
							// Get list alert
							var alerts = await db.queryForList("MainDevice.getAlertByDevice", {
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
				db.queryForObject("MainDevice.getSize", data, callback);
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
					var dataDevice = await db.queryForList("MainDevice.getListParameterByDevice", data);

					var getLastRowDataDevice = await db.queryForObject("MainDevice.getLastRowDataDevice", {
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
				db.queryForList("MainDevice.getListAlertByDevice", data, callback);
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
				db.queryForObject("MainDevice.getListAlertByDeviceSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Update status
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object Error} data
   * @param {function callback} callback
   */

	}, {
		key: "updateOnOff",
		value: function updateOnOff(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.update("MainDevice.updateOnOff", data, function (err, rs) {
					return callBack(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callBack(false, e);
			}
		}

		/**
   * @description Insert data
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object ErrorLevel} data
   */

	}, {
		key: "saveControlCalendar",
		value: function saveControlCalendar(data, callBack) {
			try {
				var self = this;
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {

						var rs = await db.insert("MainDevice.saveControlCalendar", data);
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
   * @description Get list
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object ErrorLevel} data
   * @param {function callback} callback 
   */

	}, {
		key: "getListControlCalendar",
		value: function getListControlCalendar(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("MainDevice.getListControlCalendar", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Insert data
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object ErrorLevel} data
   */

	}, {
		key: "saveArrControlCalendar",
		value: function saveArrControlCalendar(data, callBack) {
			try {
				var self = this;
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var dataDevices = data.dataDevices;
						if (dataDevices.length > 0) {
							for (var i = 0; i < dataDevices.length; i++) {
								var item = {
									id_device: dataDevices[i].id,
									date_from: data.date_from,
									date_to: data.date_to
								};

								var rs = await db.insert("MainDevice.saveControlCalendar", item);
								if (!rs) {
									conn.rollback();
									callBack(false, {});
									return;
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
			} catch (e) {
				console.log('error', e);
				callBack(false, e);
			}
		}

		/**
   * @description Get list
   * @author Long.Pham
   * @since 30/07/2019
   * @param {Object ErrorLevel} data
   * @param {function callback} callback 
   */

	}, {
		key: "getListBySiteControlCalendar",
		value: function getListBySiteControlCalendar(data, callback) {
			try {
				if (!Libs.isBlank(data)) {
					data.current_row = typeof data.current_row == 'undefined' ? 0 : data.current_row;
					data.max_record = Constants.data.max_record;
				}
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForList("MainDevice.getListBySiteControlCalendar", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * @description Update is_delete = 1
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object ErrorLevel} data
   * @param {function callback} callback
   */

	}, {
		key: "deleteListCalendarControl",
		value: function deleteListCalendarControl(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.delete("MainDevice.deleteListCalendarControl", data, function (err, rs) {
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
   * @param {Object ErrorLevel} data
   * @param {function callback} callback
   */

	}, {
		key: "deleteItemCalendarControl",
		value: function deleteItemCalendarControl(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.delete("MainDevice.deleteItemCalendarControl", data, function (err, rs) {
					return callBack(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callBack(false, e);
			}
		}

		/**
   * @description Update status
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object Error} data
   * @param {function callback} callback
   */

	}, {
		key: "updateControlMode",
		value: function updateControlMode(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.update("MainDevice.updateControlMode", data, function (err, rs) {
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
		key: "getProjectDetail",
		value: function getProjectDetail(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("MainDevice.getProjectDetail", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}

		/**
   * Kiem tra employee exist by id_company, email 
   * @param {Object} permission 
   */

	}, {
		key: "getDeviceTechEdge",
		value: async function getDeviceTechEdge(data) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				return await db.queryForObject("MainDevice.getDeviceTechEdge", data);
			} catch (e) {
				return callback(false, e);
			}
		}

		/**
   * @description Update status
   * @author Long.Pham
   * @since 11/07/2019
   * @param {Object Error} data
   * @param {function callback} callback
   */

	}, {
		key: "updateModePowerAndEnergy",
		value: function updateModePowerAndEnergy(data, callBack) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.update("MainDevice.updateModePowerAndEnergy", data, function (err, rs) {
					return callBack(err, rs);
				});
			} catch (e) {
				this.logger.error(e);
				callBack(false, e);
			}
		}

		/**
  * get detail project page plant
  * @param {*} data 
  * @param {*} callBack 
  */

	}, {
		key: "getPowerNowByDay",
		value: function getPowerNowByDay(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var ojbParam = param;

						var dataList = param.dataList;

						if (dataList.length > 0) {
							for (var i = 0; i < dataList.length; i++) {
								if (dataList[i].id_device_type == 1 || dataList[i].id_device_type == 4) {
									var item = dataList[i];
									item.current_date = param.current_date;
									var rs = await db.queryForObject("MainDevice.getPowerNowByDay", item);
									if (rs) {
										dataList[i].energy_today = rs.energyDay;
									}
								}
							}
						}

						ojbParam.dataList = dataList;

						conn.commit();
						callBack(false, ojbParam);
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
   * @description Insert alarm
   * @author Long.Pham
   * @since 12/09/2021
   * @param {Object model} data
   */

	}, {
		key: "saveStatusCMD",
		value: function saveStatusCMD(data, callBack) {
			try {
				var db = new mySqLDB();
				console.log("dataPost: ", data);

				db.beginTransaction(async function (conn) {
					try {
						var type = data.type;
						var payload = data.payload;
						var param = payload[0].param;
						var value = payload[0].value;

						console.log("param: ", param);
						console.log("value: ", value);

						switch (type) {
							case 'scheduleControl':
								switch (param) {
									case 'schedule':
										// Cap nhat schedule control auto mode
										if (!Libs.isArrayData(value)) {
											conn.rollback();
											callBack(false, {});
											return;
										}

										for (var i = 0; i < value.length; i++) {
											// Get device detail by deviceID
											var obj = {
												id_device: null,
												deviceID: value[i].deviceID,
												date_from: value[i].dateFrom,
												date_to: value[i].dateTo,
												status: value[i].command == 'off' ? 1 : 0
											};

											var getDeviceInfo = await db.queryForObject("MainDevice.getDeviceDetail", obj);
											if (getDeviceInfo && !Libs.isObjectEmpty(getDeviceInfo)) {
												obj.id_device = getDeviceInfo.id;
												// Update device_control_calendar
												await db.update("MainDevice.updateDeviceControlCalendar", obj);
											}
										}
										conn.commit();
										callBack(true, {});
										break;

									case 'commands':
										// Update device status on/off
										if (!Libs.isArrayData(value)) {
											conn.rollback();
											callBack(false, {});
											return;
										}

										for (var i = 0; i < value.length; i++) {
											// Get device detail by deviceID
											var obj = {
												id_device: value[i].deviceID,
												deviceID: value[i].deviceID,
												status_control: value[i].PLCStatus == 'on' ? 1 : 0
											};

											var getDeviceInfo = await db.queryForObject("MainDevice.getDeviceDetail", obj);
											if (getDeviceInfo && !Libs.isObjectEmpty(getDeviceInfo)) {
												// Update device on/off
												await db.update("MainDevice.updateDeviceOnOff", obj);
											}
										}

										conn.commit();
										callBack(true, {});
										break;
									case 'operationMode':
										if (Libs.isBlank(value)) {
											conn.rollback();
											callBack(false, {});
											return;
										}
										var obj = {
											id_project: null,
											deviceID: data.deviceID,
											schedule_control_mode: value == 'manual' ? 1 : 2
										};
										var getDeviceInfo = await db.queryForObject("MainDevice.getDeviceDetail", obj);
										if (getDeviceInfo && !Libs.isObjectEmpty(getDeviceInfo)) {
											obj.id_project = getDeviceInfo.id_project;
											// Update project operationMode
											await db.update("MainDevice.updateProjectScheduleOperationMode", obj);
										}

										conn.commit();
										callBack(true, {});
										break;
								}
								break;
							case 'exportLimitation':
								switch (param) {
									case 'operationMode':
										if (Libs.isBlank(value)) {
											conn.rollback();
											callBack(false, {});
											return;
										}
										var obj = {
											id_project: null,
											deviceID: data.deviceID,
											export_limitation_control_mode: value == 'manual' ? 1 : 2
										};
										var getDeviceInfo = await db.queryForObject("MainDevice.getDeviceDetail", obj);
										if (getDeviceInfo && !Libs.isObjectEmpty(getDeviceInfo)) {
											obj.id_project = getDeviceInfo.id_project;
											// Update project operationMode
											await db.update("MainDevice.updateProjectOperationMode", obj);
										}

										conn.commit();
										callBack(true, {});
										break;

									case 'limitPower':
										if (Libs.isBlank(value)) {
											conn.rollback();
											callBack(false, {});
											return;
										}
										var obj = {
											id_project: null,
											deviceID: data.deviceID,
											limit_power_status: value == 'enable' ? 1 : 0
										};
										var getDeviceInfo = await db.queryForObject("MainDevice.getDeviceDetail", obj);
										if (getDeviceInfo && !Libs.isObjectEmpty(getDeviceInfo)) {
											obj.id_project = getDeviceInfo.id_project;
											// Update project operationMode
											await db.update("MainDevice.updateProjectLimitPower", obj);
										}

										conn.commit();
										callBack(true, {});
										break;

									case 'limitEnergy':
										if (Libs.isBlank(value)) {
											conn.rollback();
											callBack(false, {});
											return;
										}
										var obj = {
											id_project: null,
											deviceID: data.deviceID,
											limit_energy_status: value == 'enable' ? 1 : 0
										};
										var getDeviceInfo = await db.queryForObject("MainDevice.getDeviceDetail", obj);
										if (getDeviceInfo && !Libs.isObjectEmpty(getDeviceInfo)) {
											obj.id_project = getDeviceInfo.id_project;
											// Update project operationMode
											await db.update("MainDevice.updateProjectLimitEnergy", obj);
										}

										conn.commit();
										callBack(true, {});
										break;

									default:
										if (Libs.isBlank(value)) {
											conn.rollback();
											callBack(false, {});
											return;
										}
										var obj = {
											id_project: null,
											deviceID: data.deviceID,
											limit_power: payload[0].value ? payload[0].value : 0,
											limit_energy: payload[1].value ? payload[1].value : 0
										};
										var getDeviceInfo = await db.queryForObject("MainDevice.getDeviceDetail", obj);
										if (getDeviceInfo && !Libs.isObjectEmpty(getDeviceInfo)) {
											obj.id_project = getDeviceInfo.id_project;
											// Update project limit power and energy
											await db.update("MainDevice.updateRegisteredEnergy", obj);
										}

										conn.commit();
										callBack(true, {});
										break;
								}
								break;
							case '':
								break;
							case '':
								break;
						}

						// if (!rs) {
						// 	conn.rollback();
						// 	callBack(false, {});
						// 	return;
						// }

						// conn.commit();
						// callBack(true, {});
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
	}]);

	return MainDeviceService;
}(_BaseService3.default);

exports.default = MainDeviceService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9NYWluRGV2aWNlU2VydmljZS5qcyJdLCJuYW1lcyI6WyJNYWluRGV2aWNlU2VydmljZSIsImRhdGEiLCJjYWxsQmFjayIsImRiIiwibXlTcUxEQiIsImJlZ2luVHJhbnNhY3Rpb24iLCJjb25uIiwiY3VycmVudF9kYXRlIiwiTGlicyIsImNvbnZlcnRBbGxGb3JtYXREYXRlIiwiZGF0YURldmljZSIsInF1ZXJ5Rm9yTGlzdCIsImlzQXJyYXlEYXRhIiwiaSIsImxlbmd0aCIsIml0ZW0iLCJvYmpEYXRhIiwicXVlcnlGb3JPYmplY3QiLCJpZF9kZXZpY2UiLCJpZCIsImlkX2xhbmd1YWdlIiwidGFibGVfbmFtZSIsInBvd2VyRmFjdG9yIiwicmVhY3RpdmVQb3dlciIsImFjdGl2ZVBvd2VyIiwiYWN0aXZlRW5lcmd5IiwiaW50ZXJuYWxUZW1wZXJhdHVyZSIsImNhYmluZXRUZW1wZXJhdHVyZSIsInN0YXR1cyIsImNvbW1pdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJyb2xsYmFjayIsImFsZXJ0cyIsImNhbGxiYWNrIiwiY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AiLCJlIiwiZ2V0TGFzdFJvd0RhdGFEZXZpY2UiLCJtb21lbnQiLCJyZXF1aXJlIiwiZGF0ZSIsImZvcm1hdCIsInZhbHVlIiwic2x1ZyIsImxhc3RfY29tbXVuaWNhdGlvbiIsImxhc3RfYXR0ZW1wdCIsImlzQmxhbmsiLCJjdXJyZW50X3JvdyIsIm1heF9yZWNvcmQiLCJDb25zdGFudHMiLCJ1cGRhdGUiLCJycyIsImxvZ2dlciIsImVycm9yIiwic2VsZiIsImluc2VydCIsImRhdGFEZXZpY2VzIiwiZGF0ZV9mcm9tIiwiZGF0ZV90byIsImRlbGV0ZSIsInBhcmFtIiwib2piUGFyYW0iLCJkYXRhTGlzdCIsImlkX2RldmljZV90eXBlIiwiZW5lcmd5X3RvZGF5IiwiZW5lcmd5RGF5IiwidHlwZSIsInBheWxvYWQiLCJvYmoiLCJkZXZpY2VJRCIsImRhdGVGcm9tIiwiZGF0ZVRvIiwiY29tbWFuZCIsImdldERldmljZUluZm8iLCJpc09iamVjdEVtcHR5Iiwic3RhdHVzX2NvbnRyb2wiLCJQTENTdGF0dXMiLCJpZF9wcm9qZWN0Iiwic2NoZWR1bGVfY29udHJvbF9tb2RlIiwiZXhwb3J0X2xpbWl0YXRpb25fY29udHJvbF9tb2RlIiwibGltaXRfcG93ZXJfc3RhdHVzIiwibGltaXRfZW5lcmd5X3N0YXR1cyIsImxpbWl0X3Bvd2VyIiwibGltaXRfZW5lcmd5IiwiQmFzZVNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSxpQjs7O0FBQ0wsOEJBQWM7QUFBQTs7QUFBQTtBQUdiOztBQUVEOzs7Ozs7Ozs7O2tDQVFnQkMsSSxFQUFNQyxRLEVBQVU7QUFDL0IsT0FBSUMsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsTUFBR0UsZ0JBQUgsQ0FBb0IsZ0JBQWdCQyxJQUFoQixFQUFzQjtBQUN6QyxRQUFJOztBQUVITCxVQUFLTSxZQUFMLEdBQW9CQyxLQUFLQyxvQkFBTCxDQUEwQlIsS0FBS00sWUFBL0IsQ0FBcEI7QUFDQSxTQUFJRyxhQUFhLE1BQU1QLEdBQUdRLFlBQUgsQ0FBZ0IsNEJBQWhCLEVBQThDVixJQUE5QyxDQUF2QjtBQUNBLFNBQUlPLEtBQUtJLFdBQUwsQ0FBaUJGLFVBQWpCLENBQUosRUFBa0M7QUFDakMsV0FBSyxJQUFJRyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILFdBQVdJLE1BQS9CLEVBQXVDRCxHQUF2QyxFQUE0QztBQUMzQyxXQUFJRSxPQUFPTCxXQUFXRyxDQUFYLENBQVg7QUFDQTtBQUNBLFdBQUlHLFVBQVUsTUFBTWIsR0FBR2MsY0FBSCxDQUFrQixtQ0FBbEIsRUFBdUQ7QUFDMUVDLG1CQUFXSCxLQUFLSSxFQUQwRDtBQUUxRUMscUJBQWFuQixLQUFLbUIsV0FGd0Q7QUFHMUVDLG9CQUFZTixLQUFLTSxVQUh5RDtBQUkxRWQsc0JBQWNOLEtBQUtNO0FBSnVELFFBQXZELENBQXBCOztBQU9BLGVBQVFRLEtBQUtNLFVBQWI7QUFDQyxhQUFLLDJCQUFMO0FBQ0MsYUFBSUwsT0FBSixFQUFhO0FBQ1pOLHFCQUFXRyxDQUFYLEVBQWNTLFdBQWQsR0FBNEJOLFFBQVFNLFdBQXBDO0FBQ0FaLHFCQUFXRyxDQUFYLEVBQWNVLGFBQWQsR0FBOEJQLFFBQVFPLGFBQXRDO0FBQ0FiLHFCQUFXRyxDQUFYLEVBQWNXLFdBQWQsR0FBNEJSLFFBQVFRLFdBQVIsR0FBc0IsSUFBbEQ7QUFDQWQscUJBQVdHLENBQVgsRUFBY1ksWUFBZCxHQUE2QlQsUUFBUVMsWUFBUixHQUF1QixJQUFwRDtBQUNBZixxQkFBV0csQ0FBWCxFQUFjYSxtQkFBZCxHQUFvQ1YsUUFBUVcsa0JBQTVDO0FBQ0EsVUFORCxNQU1PO0FBQ05qQixxQkFBV0csQ0FBWCxFQUFjUyxXQUFkLEdBQTRCLENBQTVCO0FBQ0FaLHFCQUFXRyxDQUFYLEVBQWNVLGFBQWQsR0FBOEIsQ0FBOUI7QUFDQWIscUJBQVdHLENBQVgsRUFBY1csV0FBZCxHQUE0QixDQUE1QjtBQUNBZCxxQkFBV0csQ0FBWCxFQUFjWSxZQUFkLEdBQTZCLENBQTdCO0FBQ0FmLHFCQUFXRyxDQUFYLEVBQWNhLG1CQUFkLEdBQW9DLENBQXBDO0FBQ0E7QUFDQTs7QUFFRDtBQUNELGFBQUssMEJBQUw7QUFDQSxhQUFLLDBCQUFMO0FBQ0EsYUFBSywyQkFBTDtBQUNDLGFBQUlWLE9BQUosRUFBYTtBQUNaTixxQkFBV0csQ0FBWCxFQUFjUyxXQUFkLEdBQTRCTixRQUFRTSxXQUFwQztBQUNBWixxQkFBV0csQ0FBWCxFQUFjVSxhQUFkLEdBQThCUCxRQUFRTyxhQUF0QztBQUNBYixxQkFBV0csQ0FBWCxFQUFjVyxXQUFkLEdBQTRCUixRQUFRUSxXQUFSLEdBQXNCLElBQWxEO0FBQ0FkLHFCQUFXRyxDQUFYLEVBQWNZLFlBQWQsR0FBNkJULFFBQVFTLFlBQVIsR0FBdUIsSUFBcEQ7QUFDQWYscUJBQVdHLENBQVgsRUFBY2EsbUJBQWQsR0FBb0NWLFFBQVFVLG1CQUE1QztBQUNBLFVBTkQsTUFNTztBQUNOaEIscUJBQVdHLENBQVgsRUFBY1MsV0FBZCxHQUE0QixDQUE1QjtBQUNBWixxQkFBV0csQ0FBWCxFQUFjVSxhQUFkLEdBQThCLENBQTlCO0FBQ0FiLHFCQUFXRyxDQUFYLEVBQWNXLFdBQWQsR0FBNEIsQ0FBNUI7QUFDQWQscUJBQVdHLENBQVgsRUFBY1ksWUFBZCxHQUE2QixDQUE3QjtBQUNBZixxQkFBV0csQ0FBWCxFQUFjYSxtQkFBZCxHQUFvQyxDQUFwQztBQUNBO0FBQ0E7QUFDRDtBQUNEO0FBQ0NoQixvQkFBV0csQ0FBWCxFQUFjUyxXQUFkLEdBQTRCLElBQTVCO0FBQ0FaLG9CQUFXRyxDQUFYLEVBQWNVLGFBQWQsR0FBOEIsSUFBOUI7QUFDQWIsb0JBQVdHLENBQVgsRUFBY1csV0FBZCxHQUE0QixJQUE1QjtBQUNBZCxvQkFBV0csQ0FBWCxFQUFjWSxZQUFkLEdBQTZCLElBQTdCO0FBQ0FmLG9CQUFXRyxDQUFYLEVBQWNhLG1CQUFkLEdBQW9DLElBQXBDO0FBQ0FoQixvQkFBV0csQ0FBWCxFQUFjZSxNQUFkLEdBQXVCLENBQXZCO0FBQ0E7QUEzQ0Y7QUE2Q0E7QUFDRDs7QUFFRHRCLFVBQUt1QixNQUFMO0FBQ0EzQixjQUFTLEtBQVQsRUFBZ0JRLFVBQWhCO0FBQ0EsS0FqRUQsQ0FpRUUsT0FBT29CLEdBQVAsRUFBWTtBQUNiQyxhQUFRQyxHQUFSLENBQVksYUFBWixFQUEyQkYsR0FBM0I7QUFDQXhCLFVBQUsyQixRQUFMO0FBQ0EvQixjQUFTLElBQVQsRUFBZTRCLEdBQWY7QUFDQTtBQUNELElBdkVEO0FBd0VBOztBQUdEOzs7Ozs7Ozs7OzBCQVFRN0IsSSxFQUFNQyxRLEVBQVU7QUFDdkIsT0FBSUMsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsTUFBR0UsZ0JBQUgsQ0FBb0IsZ0JBQWdCQyxJQUFoQixFQUFzQjtBQUN6QyxRQUFJOztBQUVITCxVQUFLTSxZQUFMLEdBQW9CQyxLQUFLQyxvQkFBTCxDQUEwQlIsS0FBS00sWUFBL0IsQ0FBcEI7QUFDQSxTQUFJRyxhQUFhLE1BQU1QLEdBQUdRLFlBQUgsQ0FBZ0Isb0JBQWhCLEVBQXNDVixJQUF0QyxDQUF2QjtBQUNBLFNBQUlPLEtBQUtJLFdBQUwsQ0FBaUJGLFVBQWpCLENBQUosRUFBa0M7QUFDakMsV0FBSyxJQUFJRyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILFdBQVdJLE1BQS9CLEVBQXVDRCxHQUF2QyxFQUE0QztBQUMzQyxXQUFJRSxPQUFPTCxXQUFXRyxDQUFYLENBQVg7QUFDQTtBQUNBLFdBQUlxQixTQUFTLE1BQU0vQixHQUFHUSxZQUFILENBQWdCLDZCQUFoQixFQUErQztBQUNqRU8sbUJBQVdILEtBQUtJLEVBRGlEO0FBRWpFQyxxQkFBYW5CLEtBQUttQjtBQUYrQyxRQUEvQyxDQUFuQjtBQUlBVixrQkFBV0csQ0FBWCxFQUFjcUIsTUFBZCxHQUF1QkEsTUFBdkI7QUFDQTtBQUNEOztBQUVENUIsVUFBS3VCLE1BQUw7QUFDQTNCLGNBQVMsS0FBVCxFQUFnQlEsVUFBaEI7QUFDQSxLQWxCRCxDQWtCRSxPQUFPb0IsR0FBUCxFQUFZO0FBQ2JDLGFBQVFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCRixHQUEzQjtBQUNBeEIsVUFBSzJCLFFBQUw7QUFDQS9CLGNBQVMsSUFBVCxFQUFlNEIsR0FBZjtBQUNBO0FBQ0QsSUF4QkQ7QUF5QkE7O0FBR0Q7Ozs7Ozs7Ozs7MEJBT1E3QixJLEVBQU1rQyxRLEVBQVU7QUFDdkIsT0FBSTtBQUNIbEMsV0FBT08sS0FBSzRCLDBCQUFMLENBQWdDbkMsSUFBaEMsQ0FBUDtBQUNBLFFBQUlFLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FELE9BQUdjLGNBQUgsQ0FBa0Isb0JBQWxCLEVBQXdDaEIsSUFBeEMsRUFBOENrQyxRQUE5QztBQUNBLElBSkQsQ0FJRSxPQUFPRSxDQUFQLEVBQVU7QUFDWE4sWUFBUUMsR0FBUixDQUFZSyxDQUFaO0FBQ0EsV0FBT0YsU0FBUyxLQUFULEVBQWdCRSxDQUFoQixDQUFQO0FBQ0E7QUFDRDs7QUFJRDs7Ozs7Ozs7OzsyQ0FReUJwQyxJLEVBQU1DLFEsRUFBVTtBQUN4QyxPQUFJQyxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxNQUFHRSxnQkFBSCxDQUFvQixnQkFBZ0JDLElBQWhCLEVBQXNCO0FBQ3pDLFFBQUk7QUFDSCxTQUFJSSxhQUFhLE1BQU1QLEdBQUdRLFlBQUgsQ0FBZ0IscUNBQWhCLEVBQXVEVixJQUF2RCxDQUF2Qjs7QUFFQSxTQUFJcUMsdUJBQXVCLE1BQU1uQyxHQUFHYyxjQUFILENBQWtCLGlDQUFsQixFQUFxRDtBQUNyRkMsaUJBQVdqQixLQUFLa0IsRUFEcUU7QUFFckZDLG1CQUFhbkIsS0FBS21CLFdBRm1FO0FBR3JGQyxrQkFBWXBCLEtBQUtvQjtBQUhvRSxNQUFyRCxDQUFqQztBQUtBLFNBQU1rQixTQUFTQyxRQUFRLFFBQVIsQ0FBZjtBQUNBLFNBQUlDLE9BQU9GLFNBQVNHLE1BQVQsQ0FBZ0IscUJBQWhCLENBQVg7O0FBRUEsU0FBSWxDLEtBQUtJLFdBQUwsQ0FBaUJGLFVBQWpCLEtBQWdDNEIsb0JBQXBDLEVBQTBEO0FBQ3pELFdBQUssSUFBSXpCLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsV0FBV0ksTUFBL0IsRUFBdUNELEdBQXZDLEVBQTRDO0FBQzNDSCxrQkFBV0csQ0FBWCxFQUFjOEIsS0FBZCxHQUFzQkwscUJBQXFCNUIsV0FBV0csQ0FBWCxFQUFjK0IsSUFBbkMsQ0FBdEI7QUFDQWxDLGtCQUFXRyxDQUFYLEVBQWNnQyxrQkFBZCxHQUFtQ1AscUJBQXFCLG9CQUFyQixDQUFuQztBQUNBNUIsa0JBQVdHLENBQVgsRUFBY2lDLFlBQWQsR0FBNkJMLElBQTdCO0FBQ0E7QUFDRDtBQUNEbkMsVUFBS3VCLE1BQUw7QUFDQTNCLGNBQVMsS0FBVCxFQUFnQlEsVUFBaEI7QUFDQSxLQXBCRCxDQW9CRSxPQUFPb0IsR0FBUCxFQUFZO0FBQ2JDLGFBQVFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCRixHQUEzQjtBQUNBeEIsVUFBSzJCLFFBQUw7QUFDQS9CLGNBQVMsSUFBVCxFQUFlNEIsR0FBZjtBQUNBO0FBQ0QsSUExQkQ7QUEyQkE7O0FBR0Q7Ozs7Ozs7Ozs7dUNBT3FCN0IsSSxFQUFNa0MsUSxFQUFVO0FBQ3BDLE9BQUk7QUFDSCxRQUFJLENBQUMzQixLQUFLdUMsT0FBTCxDQUFhOUMsSUFBYixDQUFMLEVBQXlCO0FBQ3hCQSxVQUFLK0MsV0FBTCxHQUFvQixPQUFPL0MsS0FBSytDLFdBQVosSUFBMkIsV0FBNUIsR0FBMkMsQ0FBM0MsR0FBK0MvQyxLQUFLK0MsV0FBdkU7QUFDQS9DLFVBQUtnRCxVQUFMLEdBQWtCQyxVQUFVakQsSUFBVixDQUFlZ0QsVUFBakM7QUFDQTtBQUNEaEQsV0FBT08sS0FBSzRCLDBCQUFMLENBQWdDbkMsSUFBaEMsQ0FBUDtBQUNBLFFBQUlFLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FELE9BQUdRLFlBQUgsQ0FBZ0IsaUNBQWhCLEVBQW1EVixJQUFuRCxFQUF5RGtDLFFBQXpEO0FBQ0EsSUFSRCxDQVFFLE9BQU9FLENBQVAsRUFBVTtBQUNYTixZQUFRQyxHQUFSLENBQVlLLENBQVo7QUFDQSxXQUFPRixTQUFTLEtBQVQsRUFBZ0JFLENBQWhCLENBQVA7QUFDQTtBQUNEOztBQUVEOzs7Ozs7Ozs7OzJDQU95QnBDLEksRUFBTWtDLFEsRUFBVTtBQUN4QyxPQUFJO0FBQ0hsQyxXQUFPTyxLQUFLNEIsMEJBQUwsQ0FBZ0NuQyxJQUFoQyxDQUFQO0FBQ0EsUUFBSUUsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR2MsY0FBSCxDQUFrQixxQ0FBbEIsRUFBeURoQixJQUF6RCxFQUErRGtDLFFBQS9EO0FBQ0EsSUFKRCxDQUlFLE9BQU9FLENBQVAsRUFBVTtBQUNYTixZQUFRQyxHQUFSLENBQVlLLENBQVo7QUFDQSxXQUFPRixTQUFTLEtBQVQsRUFBZ0JFLENBQWhCLENBQVA7QUFDQTtBQUNEOztBQUlEOzs7Ozs7Ozs7OzhCQU9ZcEMsSSxFQUFNQyxRLEVBQVU7QUFDM0IsT0FBSTtBQUNIRCxXQUFPTyxLQUFLNEIsMEJBQUwsQ0FBZ0NuQyxJQUFoQyxDQUFQO0FBQ0EsUUFBSUUsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR2dELE1BQUgsQ0FBVSx3QkFBVixFQUFvQ2xELElBQXBDLEVBQTBDLFVBQUM2QixHQUFELEVBQU1zQixFQUFOLEVBQWE7QUFDdEQsWUFBT2xELFNBQVM0QixHQUFULEVBQWNzQixFQUFkLENBQVA7QUFDQSxLQUZEO0FBR0EsSUFORCxDQU1FLE9BQU9mLENBQVAsRUFBVTtBQUNYLFNBQUtnQixNQUFMLENBQVlDLEtBQVosQ0FBa0JqQixDQUFsQjtBQUNBbkMsYUFBUyxLQUFULEVBQWdCbUMsQ0FBaEI7QUFDQTtBQUNEOztBQUlEOzs7Ozs7Ozs7c0NBTW9CcEMsSSxFQUFNQyxRLEVBQVU7QUFDbkMsT0FBSTtBQUNILFFBQUlxRCxPQUFPLElBQVg7QUFDQSxRQUFJcEQsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR0UsZ0JBQUgsQ0FBb0IsZ0JBQWdCQyxJQUFoQixFQUFzQjtBQUN6QyxTQUFJOztBQUVILFVBQUk4QyxLQUFLLE1BQU1qRCxHQUFHcUQsTUFBSCxDQUFVLGdDQUFWLEVBQTRDdkQsSUFBNUMsQ0FBZjtBQUNBLFVBQUksQ0FBQ21ELEVBQUwsRUFBUztBQUNSOUMsWUFBSzJCLFFBQUw7QUFDQS9CLGdCQUFTLEtBQVQsRUFBZ0IsRUFBaEI7QUFDQTtBQUNBO0FBQ0RJLFdBQUt1QixNQUFMO0FBQ0EzQixlQUFTLElBQVQsRUFBZSxFQUFmO0FBQ0EsTUFWRCxDQVVFLE9BQU80QixHQUFQLEVBQVk7QUFDYkMsY0FBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJGLEdBQTNCO0FBQ0F4QixXQUFLMkIsUUFBTDtBQUNBL0IsZUFBUyxLQUFULEVBQWdCNEIsR0FBaEI7QUFDQTtBQUNELEtBaEJEO0FBaUJBLElBcEJELENBb0JFLE9BQU9PLENBQVAsRUFBVTtBQUNYTixZQUFRQyxHQUFSLENBQVksT0FBWixFQUFxQkssQ0FBckI7QUFDQW5DLGFBQVMsS0FBVCxFQUFnQm1DLENBQWhCO0FBQ0E7QUFDRDs7QUFJRDs7Ozs7Ozs7Ozt5Q0FPdUJwQyxJLEVBQU1rQyxRLEVBQVU7QUFDdEMsT0FBSTtBQUNILFFBQUksQ0FBQzNCLEtBQUt1QyxPQUFMLENBQWE5QyxJQUFiLENBQUwsRUFBeUI7QUFDeEJBLFVBQUsrQyxXQUFMLEdBQW9CLE9BQU8vQyxLQUFLK0MsV0FBWixJQUEyQixXQUE1QixHQUEyQyxDQUEzQyxHQUErQy9DLEtBQUsrQyxXQUF2RTtBQUNBL0MsVUFBS2dELFVBQUwsR0FBa0JDLFVBQVVqRCxJQUFWLENBQWVnRCxVQUFqQztBQUNBO0FBQ0RoRCxXQUFPTyxLQUFLNEIsMEJBQUwsQ0FBZ0NuQyxJQUFoQyxDQUFQO0FBQ0EsUUFBSUUsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR1EsWUFBSCxDQUFnQixtQ0FBaEIsRUFBcURWLElBQXJELEVBQTJEa0MsUUFBM0Q7QUFDQSxJQVJELENBUUUsT0FBT0UsQ0FBUCxFQUFVO0FBQ1hOLFlBQVFDLEdBQVIsQ0FBWUssQ0FBWjtBQUNBLFdBQU9GLFNBQVMsS0FBVCxFQUFnQkUsQ0FBaEIsQ0FBUDtBQUNBO0FBQ0Q7O0FBSUQ7Ozs7Ozs7Ozt5Q0FNdUJwQyxJLEVBQU1DLFEsRUFBVTtBQUN0QyxPQUFJO0FBQ0gsUUFBSXFELE9BQU8sSUFBWDtBQUNBLFFBQUlwRCxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxPQUFHRSxnQkFBSCxDQUFvQixnQkFBZ0JDLElBQWhCLEVBQXNCO0FBQ3pDLFNBQUk7QUFDSCxVQUFJbUQsY0FBY3hELEtBQUt3RCxXQUF2QjtBQUNBLFVBQUlBLFlBQVkzQyxNQUFaLEdBQXFCLENBQXpCLEVBQTRCO0FBQzNCLFlBQUssSUFBSUQsSUFBSSxDQUFiLEVBQWdCQSxJQUFJNEMsWUFBWTNDLE1BQWhDLEVBQXdDRCxHQUF4QyxFQUE2QztBQUM1QyxZQUFJRSxPQUFPO0FBQ1ZHLG9CQUFXdUMsWUFBWTVDLENBQVosRUFBZU0sRUFEaEI7QUFFVnVDLG9CQUFXekQsS0FBS3lELFNBRk47QUFHVkMsa0JBQVMxRCxLQUFLMEQ7QUFISixTQUFYOztBQU1BLFlBQUlQLEtBQUssTUFBTWpELEdBQUdxRCxNQUFILENBQVUsZ0NBQVYsRUFBNEN6QyxJQUE1QyxDQUFmO0FBQ0EsWUFBSSxDQUFDcUMsRUFBTCxFQUFTO0FBQ1I5QyxjQUFLMkIsUUFBTDtBQUNBL0Isa0JBQVMsS0FBVCxFQUFnQixFQUFoQjtBQUNBO0FBQ0E7QUFDRDtBQUVEOztBQUVESSxXQUFLdUIsTUFBTDtBQUNBM0IsZUFBUyxJQUFULEVBQWUsRUFBZjtBQUNBLE1BdEJELENBc0JFLE9BQU80QixHQUFQLEVBQVk7QUFDYkMsY0FBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJGLEdBQTNCO0FBQ0F4QixXQUFLMkIsUUFBTDtBQUNBL0IsZUFBUyxLQUFULEVBQWdCNEIsR0FBaEI7QUFDQTtBQUNELEtBNUJEO0FBNkJBLElBaENELENBZ0NFLE9BQU9PLENBQVAsRUFBVTtBQUNYTixZQUFRQyxHQUFSLENBQVksT0FBWixFQUFxQkssQ0FBckI7QUFDQW5DLGFBQVMsS0FBVCxFQUFnQm1DLENBQWhCO0FBQ0E7QUFDRDs7QUFJRDs7Ozs7Ozs7OzsrQ0FPNkJwQyxJLEVBQU1rQyxRLEVBQVU7QUFDNUMsT0FBSTtBQUNILFFBQUksQ0FBQzNCLEtBQUt1QyxPQUFMLENBQWE5QyxJQUFiLENBQUwsRUFBeUI7QUFDeEJBLFVBQUsrQyxXQUFMLEdBQW9CLE9BQU8vQyxLQUFLK0MsV0FBWixJQUEyQixXQUE1QixHQUEyQyxDQUEzQyxHQUErQy9DLEtBQUsrQyxXQUF2RTtBQUNBL0MsVUFBS2dELFVBQUwsR0FBa0JDLFVBQVVqRCxJQUFWLENBQWVnRCxVQUFqQztBQUNBO0FBQ0RoRCxXQUFPTyxLQUFLNEIsMEJBQUwsQ0FBZ0NuQyxJQUFoQyxDQUFQO0FBQ0EsUUFBSUUsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR1EsWUFBSCxDQUFnQix5Q0FBaEIsRUFBMkRWLElBQTNELEVBQWlFa0MsUUFBakU7QUFDQSxJQVJELENBUUUsT0FBT0UsQ0FBUCxFQUFVO0FBQ1hOLFlBQVFDLEdBQVIsQ0FBWUssQ0FBWjtBQUNBLFdBQU9GLFNBQVMsS0FBVCxFQUFnQkUsQ0FBaEIsQ0FBUDtBQUNBO0FBQ0Q7O0FBSUQ7Ozs7Ozs7Ozs7NENBTzBCcEMsSSxFQUFNQyxRLEVBQVU7QUFDekMsT0FBSTtBQUNIRCxXQUFPTyxLQUFLNEIsMEJBQUwsQ0FBZ0NuQyxJQUFoQyxDQUFQO0FBQ0EsUUFBSUUsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR3lELE1BQUgsQ0FBVSxzQ0FBVixFQUFrRDNELElBQWxELEVBQXdELFVBQUM2QixHQUFELEVBQU1zQixFQUFOLEVBQWE7QUFDcEUsWUFBT2xELFNBQVM0QixHQUFULEVBQWNzQixFQUFkLENBQVA7QUFDQSxLQUZEO0FBR0EsSUFORCxDQU1FLE9BQU9mLENBQVAsRUFBVTtBQUNYLFNBQUtnQixNQUFMLENBQVlDLEtBQVosQ0FBa0JqQixDQUFsQjtBQUNBbkMsYUFBUyxLQUFULEVBQWdCbUMsQ0FBaEI7QUFDQTtBQUNEOztBQUdEOzs7Ozs7Ozs7OzRDQU8wQnBDLEksRUFBTUMsUSxFQUFVO0FBQ3pDLE9BQUk7QUFDSEQsV0FBT08sS0FBSzRCLDBCQUFMLENBQWdDbkMsSUFBaEMsQ0FBUDtBQUNBLFFBQUlFLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FELE9BQUd5RCxNQUFILENBQVUsc0NBQVYsRUFBa0QzRCxJQUFsRCxFQUF3RCxVQUFDNkIsR0FBRCxFQUFNc0IsRUFBTixFQUFhO0FBQ3BFLFlBQU9sRCxTQUFTNEIsR0FBVCxFQUFjc0IsRUFBZCxDQUFQO0FBQ0EsS0FGRDtBQUdBLElBTkQsQ0FNRSxPQUFPZixDQUFQLEVBQVU7QUFDWCxTQUFLZ0IsTUFBTCxDQUFZQyxLQUFaLENBQWtCakIsQ0FBbEI7QUFDQW5DLGFBQVMsS0FBVCxFQUFnQm1DLENBQWhCO0FBQ0E7QUFDRDs7QUFJRDs7Ozs7Ozs7OztvQ0FPa0JwQyxJLEVBQU1DLFEsRUFBVTtBQUNqQyxPQUFJO0FBQ0hELFdBQU9PLEtBQUs0QiwwQkFBTCxDQUFnQ25DLElBQWhDLENBQVA7QUFDQSxRQUFJRSxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxPQUFHZ0QsTUFBSCxDQUFVLDhCQUFWLEVBQTBDbEQsSUFBMUMsRUFBZ0QsVUFBQzZCLEdBQUQsRUFBTXNCLEVBQU4sRUFBYTtBQUM1RCxZQUFPbEQsU0FBUzRCLEdBQVQsRUFBY3NCLEVBQWQsQ0FBUDtBQUNBLEtBRkQ7QUFHQSxJQU5ELENBTUUsT0FBT2YsQ0FBUCxFQUFVO0FBQ1gsU0FBS2dCLE1BQUwsQ0FBWUMsS0FBWixDQUFrQmpCLENBQWxCO0FBQ0FuQyxhQUFTLEtBQVQsRUFBZ0JtQyxDQUFoQjtBQUNBO0FBQ0Q7O0FBR0Q7Ozs7Ozs7O21DQUtpQnBDLEksRUFBTWtDLFEsRUFBVTtBQUNoQyxPQUFJO0FBQ0hsQyxXQUFPTyxLQUFLNEIsMEJBQUwsQ0FBZ0NuQyxJQUFoQyxDQUFQO0FBQ0EsUUFBSUUsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFDQUQsT0FBR2MsY0FBSCxDQUFrQiw2QkFBbEIsRUFBaURoQixJQUFqRCxFQUF1RGtDLFFBQXZEO0FBQ0EsSUFKRCxDQUlFLE9BQU9FLENBQVAsRUFBVTtBQUNYTixZQUFRQyxHQUFSLENBQVlLLENBQVo7QUFDQSxXQUFPRixTQUFTLEtBQVQsRUFBZ0JFLENBQWhCLENBQVA7QUFDQTtBQUNEOztBQUdEOzs7Ozs7OzBDQUl3QnBDLEksRUFBTTtBQUM3QixPQUFJO0FBQ0hBLFdBQU9PLEtBQUs0QiwwQkFBTCxDQUFnQ25DLElBQWhDLENBQVA7QUFDQSxRQUFJRSxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBLFdBQU8sTUFBTUQsR0FBR2MsY0FBSCxDQUFrQiw4QkFBbEIsRUFBa0RoQixJQUFsRCxDQUFiO0FBQ0EsSUFKRCxDQUlFLE9BQU9vQyxDQUFQLEVBQVU7QUFDWCxXQUFPRixTQUFTLEtBQVQsRUFBZ0JFLENBQWhCLENBQVA7QUFDQTtBQUNEOztBQUdEOzs7Ozs7Ozs7OzJDQU95QnBDLEksRUFBTUMsUSxFQUFVO0FBQ3hDLE9BQUk7QUFDSEQsV0FBT08sS0FBSzRCLDBCQUFMLENBQWdDbkMsSUFBaEMsQ0FBUDtBQUNBLFFBQUlFLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FELE9BQUdnRCxNQUFILENBQVUscUNBQVYsRUFBaURsRCxJQUFqRCxFQUF1RCxVQUFDNkIsR0FBRCxFQUFNc0IsRUFBTixFQUFhO0FBQ25FLFlBQU9sRCxTQUFTNEIsR0FBVCxFQUFjc0IsRUFBZCxDQUFQO0FBQ0EsS0FGRDtBQUdBLElBTkQsQ0FNRSxPQUFPZixDQUFQLEVBQVU7QUFDWCxTQUFLZ0IsTUFBTCxDQUFZQyxLQUFaLENBQWtCakIsQ0FBbEI7QUFDQW5DLGFBQVMsS0FBVCxFQUFnQm1DLENBQWhCO0FBQ0E7QUFDRDs7QUFLRDs7Ozs7Ozs7bUNBTWlCd0IsSyxFQUFPM0QsUSxFQUFVO0FBQ2pDLE9BQUk7QUFDSCxRQUFJQyxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxPQUFHRSxnQkFBSCxDQUFvQixnQkFBZ0JDLElBQWhCLEVBQXNCO0FBQ3pDLFNBQUk7QUFDSCxVQUFJd0QsV0FBV0QsS0FBZjs7QUFFQSxVQUFJRSxXQUFXRixNQUFNRSxRQUFyQjs7QUFFQSxVQUFJQSxTQUFTakQsTUFBVCxHQUFrQixDQUF0QixFQUF5QjtBQUN4QixZQUFLLElBQUlELElBQUksQ0FBYixFQUFnQkEsSUFBSWtELFNBQVNqRCxNQUE3QixFQUFxQ0QsR0FBckMsRUFBMEM7QUFDekMsWUFBSWtELFNBQVNsRCxDQUFULEVBQVltRCxjQUFaLElBQThCLENBQTlCLElBQW1DRCxTQUFTbEQsQ0FBVCxFQUFZbUQsY0FBWixJQUE4QixDQUFyRSxFQUF3RTtBQUN2RSxhQUFJakQsT0FBT2dELFNBQVNsRCxDQUFULENBQVg7QUFDQUUsY0FBS1IsWUFBTCxHQUFvQnNELE1BQU10RCxZQUExQjtBQUNBLGFBQUk2QyxLQUFLLE1BQU1qRCxHQUFHYyxjQUFILENBQWtCLDZCQUFsQixFQUFpREYsSUFBakQsQ0FBZjtBQUNBLGFBQUlxQyxFQUFKLEVBQVE7QUFDUFcsbUJBQVNsRCxDQUFULEVBQVlvRCxZQUFaLEdBQTJCYixHQUFHYyxTQUE5QjtBQUNBO0FBQ0Q7QUFFRDtBQUNEOztBQUVESixlQUFTQyxRQUFULEdBQW9CQSxRQUFwQjs7QUFFQXpELFdBQUt1QixNQUFMO0FBQ0EzQixlQUFTLEtBQVQsRUFBZ0I0RCxRQUFoQjtBQUNBLE1BdkJELENBdUJFLE9BQU9oQyxHQUFQLEVBQVk7QUFDYkMsY0FBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJGLEdBQTNCO0FBQ0F4QixXQUFLMkIsUUFBTDtBQUNBL0IsZUFBUyxJQUFULEVBQWU0QixHQUFmO0FBQ0E7QUFDRCxLQTdCRDtBQThCQSxJQWhDRCxDQWdDRSxPQUFPQSxHQUFQLEVBQVk7QUFDYixRQUFJeEIsSUFBSixFQUFVO0FBQ1RBLFVBQUsyQixRQUFMO0FBQ0E7QUFDRC9CLGFBQVMsSUFBVCxFQUFlNEIsR0FBZjtBQUNBO0FBQ0Q7O0FBSUQ7Ozs7Ozs7OztnQ0FNYzdCLEksRUFBTUMsUSxFQUFVO0FBQzdCLE9BQUk7QUFDSCxRQUFJQyxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBMkIsWUFBUUMsR0FBUixDQUFZLFlBQVosRUFBMEIvQixJQUExQjs7QUFFQUUsT0FBR0UsZ0JBQUgsQ0FBb0IsZ0JBQWdCQyxJQUFoQixFQUFzQjtBQUN6QyxTQUFJO0FBQ0gsVUFBSTZELE9BQU9sRSxLQUFLa0UsSUFBaEI7QUFDQSxVQUFJQyxVQUFVbkUsS0FBS21FLE9BQW5CO0FBQ0EsVUFBSVAsUUFBUU8sUUFBUSxDQUFSLEVBQVdQLEtBQXZCO0FBQ0EsVUFBSWxCLFFBQVF5QixRQUFRLENBQVIsRUFBV3pCLEtBQXZCOztBQUVBWixjQUFRQyxHQUFSLENBQVksU0FBWixFQUF1QjZCLEtBQXZCO0FBQ0E5QixjQUFRQyxHQUFSLENBQVksU0FBWixFQUF1QlcsS0FBdkI7O0FBRUEsY0FBUXdCLElBQVI7QUFDQyxZQUFLLGlCQUFMO0FBQ0MsZ0JBQVFOLEtBQVI7QUFDQyxjQUFLLFVBQUw7QUFDQztBQUNBLGNBQUksQ0FBQ3JELEtBQUtJLFdBQUwsQ0FBaUIrQixLQUFqQixDQUFMLEVBQThCO0FBQzdCckMsZ0JBQUsyQixRQUFMO0FBQ0EvQixvQkFBUyxLQUFULEVBQWdCLEVBQWhCO0FBQ0E7QUFDQTs7QUFFRCxlQUFLLElBQUlXLElBQUksQ0FBYixFQUFnQkEsSUFBSThCLE1BQU03QixNQUExQixFQUFrQ0QsR0FBbEMsRUFBdUM7QUFDdEM7QUFDQSxlQUFJd0QsTUFBTTtBQUNUbkQsdUJBQVcsSUFERjtBQUVUb0Qsc0JBQVUzQixNQUFNOUIsQ0FBTixFQUFTeUQsUUFGVjtBQUdUWix1QkFBV2YsTUFBTTlCLENBQU4sRUFBUzBELFFBSFg7QUFJVFoscUJBQVNoQixNQUFNOUIsQ0FBTixFQUFTMkQsTUFKVDtBQUtUNUMsb0JBQVFlLE1BQU05QixDQUFOLEVBQVM0RCxPQUFULElBQW9CLEtBQXBCLEdBQTRCLENBQTVCLEdBQWdDO0FBTC9CLFlBQVY7O0FBUUEsZUFBSUMsZ0JBQWdCLE1BQU12RSxHQUFHYyxjQUFILENBQWtCLDRCQUFsQixFQUFnRG9ELEdBQWhELENBQTFCO0FBQ0EsZUFBSUssaUJBQWlCLENBQUNsRSxLQUFLbUUsYUFBTCxDQUFtQkQsYUFBbkIsQ0FBdEIsRUFBeUQ7QUFDeERMLGdCQUFJbkQsU0FBSixHQUFnQndELGNBQWN2RCxFQUE5QjtBQUNBO0FBQ0Esa0JBQU1oQixHQUFHZ0QsTUFBSCxDQUFVLHdDQUFWLEVBQW9Ea0IsR0FBcEQsQ0FBTjtBQUNBO0FBQ0Q7QUFDRC9ELGVBQUt1QixNQUFMO0FBQ0EzQixtQkFBUyxJQUFULEVBQWUsRUFBZjtBQUNBOztBQUVELGNBQUssVUFBTDtBQUNDO0FBQ0EsY0FBSSxDQUFDTSxLQUFLSSxXQUFMLENBQWlCK0IsS0FBakIsQ0FBTCxFQUE4QjtBQUM3QnJDLGdCQUFLMkIsUUFBTDtBQUNBL0Isb0JBQVMsS0FBVCxFQUFnQixFQUFoQjtBQUNBO0FBQ0E7O0FBRUQsZUFBSyxJQUFJVyxJQUFJLENBQWIsRUFBZ0JBLElBQUk4QixNQUFNN0IsTUFBMUIsRUFBa0NELEdBQWxDLEVBQXVDO0FBQ3RDO0FBQ0EsZUFBSXdELE1BQU07QUFDVG5ELHVCQUFXeUIsTUFBTTlCLENBQU4sRUFBU3lELFFBRFg7QUFFVEEsc0JBQVUzQixNQUFNOUIsQ0FBTixFQUFTeUQsUUFGVjtBQUdUTSw0QkFBZ0JqQyxNQUFNOUIsQ0FBTixFQUFTZ0UsU0FBVCxJQUFzQixJQUF0QixHQUE2QixDQUE3QixHQUFpQztBQUh4QyxZQUFWOztBQU1BLGVBQUlILGdCQUFnQixNQUFNdkUsR0FBR2MsY0FBSCxDQUFrQiw0QkFBbEIsRUFBZ0RvRCxHQUFoRCxDQUExQjtBQUNBLGVBQUlLLGlCQUFpQixDQUFDbEUsS0FBS21FLGFBQUwsQ0FBbUJELGFBQW5CLENBQXRCLEVBQXlEO0FBQ3hEO0FBQ0Esa0JBQU12RSxHQUFHZ0QsTUFBSCxDQUFVLDhCQUFWLEVBQTBDa0IsR0FBMUMsQ0FBTjtBQUNBO0FBQ0Q7O0FBRUQvRCxlQUFLdUIsTUFBTDtBQUNBM0IsbUJBQVMsSUFBVCxFQUFlLEVBQWY7QUFDQTtBQUNELGNBQUssZUFBTDtBQUNDLGNBQUlNLEtBQUt1QyxPQUFMLENBQWFKLEtBQWIsQ0FBSixFQUF5QjtBQUN4QnJDLGdCQUFLMkIsUUFBTDtBQUNBL0Isb0JBQVMsS0FBVCxFQUFnQixFQUFoQjtBQUNBO0FBQ0E7QUFDRCxjQUFJbUUsTUFBTTtBQUNUUyx1QkFBWSxJQURIO0FBRVRSLHFCQUFVckUsS0FBS3FFLFFBRk47QUFHVFMsa0NBQXVCcEMsU0FBUyxRQUFULEdBQW9CLENBQXBCLEdBQXdCO0FBSHRDLFdBQVY7QUFLQSxjQUFJK0IsZ0JBQWdCLE1BQU12RSxHQUFHYyxjQUFILENBQWtCLDRCQUFsQixFQUFnRG9ELEdBQWhELENBQTFCO0FBQ0EsY0FBSUssaUJBQWlCLENBQUNsRSxLQUFLbUUsYUFBTCxDQUFtQkQsYUFBbkIsQ0FBdEIsRUFBeUQ7QUFDeERMLGVBQUlTLFVBQUosR0FBaUJKLGNBQWNJLFVBQS9CO0FBQ0E7QUFDQSxpQkFBTTNFLEdBQUdnRCxNQUFILENBQVUsK0NBQVYsRUFBMkRrQixHQUEzRCxDQUFOO0FBQ0E7O0FBRUQvRCxlQUFLdUIsTUFBTDtBQUNBM0IsbUJBQVMsSUFBVCxFQUFlLEVBQWY7QUFDQTtBQTVFRjtBQThFQTtBQUNELFlBQUssa0JBQUw7QUFDQyxnQkFBUTJELEtBQVI7QUFDQyxjQUFLLGVBQUw7QUFDQyxjQUFJckQsS0FBS3VDLE9BQUwsQ0FBYUosS0FBYixDQUFKLEVBQXlCO0FBQ3hCckMsZ0JBQUsyQixRQUFMO0FBQ0EvQixvQkFBUyxLQUFULEVBQWdCLEVBQWhCO0FBQ0E7QUFDQTtBQUNELGNBQUltRSxNQUFNO0FBQ1RTLHVCQUFZLElBREg7QUFFVFIscUJBQVVyRSxLQUFLcUUsUUFGTjtBQUdUVSwyQ0FBZ0NyQyxTQUFTLFFBQVQsR0FBb0IsQ0FBcEIsR0FBd0I7QUFIL0MsV0FBVjtBQUtBLGNBQUkrQixnQkFBZ0IsTUFBTXZFLEdBQUdjLGNBQUgsQ0FBa0IsNEJBQWxCLEVBQWdEb0QsR0FBaEQsQ0FBMUI7QUFDQSxjQUFJSyxpQkFBaUIsQ0FBQ2xFLEtBQUttRSxhQUFMLENBQW1CRCxhQUFuQixDQUF0QixFQUF5RDtBQUN4REwsZUFBSVMsVUFBSixHQUFpQkosY0FBY0ksVUFBL0I7QUFDQTtBQUNBLGlCQUFNM0UsR0FBR2dELE1BQUgsQ0FBVSx1Q0FBVixFQUFtRGtCLEdBQW5ELENBQU47QUFDQTs7QUFFRC9ELGVBQUt1QixNQUFMO0FBQ0EzQixtQkFBUyxJQUFULEVBQWUsRUFBZjtBQUNBOztBQUdELGNBQUssWUFBTDtBQUNDLGNBQUlNLEtBQUt1QyxPQUFMLENBQWFKLEtBQWIsQ0FBSixFQUF5QjtBQUN4QnJDLGdCQUFLMkIsUUFBTDtBQUNBL0Isb0JBQVMsS0FBVCxFQUFnQixFQUFoQjtBQUNBO0FBQ0E7QUFDRCxjQUFJbUUsTUFBTTtBQUNUUyx1QkFBWSxJQURIO0FBRVRSLHFCQUFVckUsS0FBS3FFLFFBRk47QUFHVFcsK0JBQW9CdEMsU0FBUyxRQUFULEdBQW9CLENBQXBCLEdBQXdCO0FBSG5DLFdBQVY7QUFLQSxjQUFJK0IsZ0JBQWdCLE1BQU12RSxHQUFHYyxjQUFILENBQWtCLDRCQUFsQixFQUFnRG9ELEdBQWhELENBQTFCO0FBQ0EsY0FBSUssaUJBQWlCLENBQUNsRSxLQUFLbUUsYUFBTCxDQUFtQkQsYUFBbkIsQ0FBdEIsRUFBeUQ7QUFDeERMLGVBQUlTLFVBQUosR0FBaUJKLGNBQWNJLFVBQS9CO0FBQ0E7QUFDQSxpQkFBTTNFLEdBQUdnRCxNQUFILENBQVUsb0NBQVYsRUFBZ0RrQixHQUFoRCxDQUFOO0FBQ0E7O0FBRUQvRCxlQUFLdUIsTUFBTDtBQUNBM0IsbUJBQVMsSUFBVCxFQUFlLEVBQWY7QUFDQTs7QUFHRCxjQUFLLGFBQUw7QUFDQyxjQUFJTSxLQUFLdUMsT0FBTCxDQUFhSixLQUFiLENBQUosRUFBeUI7QUFDeEJyQyxnQkFBSzJCLFFBQUw7QUFDQS9CLG9CQUFTLEtBQVQsRUFBZ0IsRUFBaEI7QUFDQTtBQUNBO0FBQ0QsY0FBSW1FLE1BQU07QUFDVFMsdUJBQVksSUFESDtBQUVUUixxQkFBVXJFLEtBQUtxRSxRQUZOO0FBR1RZLGdDQUFxQnZDLFNBQVMsUUFBVCxHQUFvQixDQUFwQixHQUF3QjtBQUhwQyxXQUFWO0FBS0EsY0FBSStCLGdCQUFnQixNQUFNdkUsR0FBR2MsY0FBSCxDQUFrQiw0QkFBbEIsRUFBZ0RvRCxHQUFoRCxDQUExQjtBQUNBLGNBQUlLLGlCQUFpQixDQUFDbEUsS0FBS21FLGFBQUwsQ0FBbUJELGFBQW5CLENBQXRCLEVBQXlEO0FBQ3hETCxlQUFJUyxVQUFKLEdBQWlCSixjQUFjSSxVQUEvQjtBQUNBO0FBQ0EsaUJBQU0zRSxHQUFHZ0QsTUFBSCxDQUFVLHFDQUFWLEVBQWlEa0IsR0FBakQsQ0FBTjtBQUNBOztBQUVEL0QsZUFBS3VCLE1BQUw7QUFDQTNCLG1CQUFTLElBQVQsRUFBZSxFQUFmO0FBQ0E7O0FBRUQ7QUFDQyxjQUFJTSxLQUFLdUMsT0FBTCxDQUFhSixLQUFiLENBQUosRUFBeUI7QUFDeEJyQyxnQkFBSzJCLFFBQUw7QUFDQS9CLG9CQUFTLEtBQVQsRUFBZ0IsRUFBaEI7QUFDQTtBQUNBO0FBQ0QsY0FBSW1FLE1BQU07QUFDVFMsdUJBQVksSUFESDtBQUVUUixxQkFBVXJFLEtBQUtxRSxRQUZOO0FBR1RhLHdCQUFhZixRQUFRLENBQVIsRUFBV3pCLEtBQVgsR0FBbUJ5QixRQUFRLENBQVIsRUFBV3pCLEtBQTlCLEdBQXNDLENBSDFDO0FBSVR5Qyx5QkFBY2hCLFFBQVEsQ0FBUixFQUFXekIsS0FBWCxHQUFtQnlCLFFBQVEsQ0FBUixFQUFXekIsS0FBOUIsR0FBc0M7QUFKM0MsV0FBVjtBQU1BLGNBQUkrQixnQkFBZ0IsTUFBTXZFLEdBQUdjLGNBQUgsQ0FBa0IsNEJBQWxCLEVBQWdEb0QsR0FBaEQsQ0FBMUI7QUFDQSxjQUFJSyxpQkFBaUIsQ0FBQ2xFLEtBQUttRSxhQUFMLENBQW1CRCxhQUFuQixDQUF0QixFQUF5RDtBQUN4REwsZUFBSVMsVUFBSixHQUFpQkosY0FBY0ksVUFBL0I7QUFDQTtBQUNBLGlCQUFNM0UsR0FBR2dELE1BQUgsQ0FBVSxtQ0FBVixFQUErQ2tCLEdBQS9DLENBQU47QUFDQTs7QUFFRC9ELGVBQUt1QixNQUFMO0FBQ0EzQixtQkFBUyxJQUFULEVBQWUsRUFBZjtBQUNBO0FBMUZGO0FBNEZBO0FBQ0QsWUFBSyxFQUFMO0FBQ0M7QUFDRCxZQUFLLEVBQUw7QUFDQztBQWxMRjs7QUF1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUF4TUQsQ0F3TUUsT0FBTzRCLEdBQVAsRUFBWTtBQUNiQyxjQUFRQyxHQUFSLENBQVksYUFBWixFQUEyQkYsR0FBM0I7QUFDQXhCLFdBQUsyQixRQUFMO0FBQ0EvQixlQUFTLEtBQVQsRUFBZ0I0QixHQUFoQjtBQUNBO0FBQ0QsS0E5TUQ7QUErTUEsSUFuTkQsQ0FtTkUsT0FBT08sQ0FBUCxFQUFVO0FBQ1hOLFlBQVFDLEdBQVIsQ0FBWSxPQUFaLEVBQXFCSyxDQUFyQjtBQUNBbkMsYUFBUyxLQUFULEVBQWdCbUMsQ0FBaEI7QUFDQTtBQUNEOzs7O0VBcndCOEJnRCxxQjs7a0JBMndCakJyRixpQiIsImZpbGUiOiJNYWluRGV2aWNlU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2VydmljZSBmcm9tICcuL0Jhc2VTZXJ2aWNlJztcclxuY2xhc3MgTWFpbkRldmljZVNlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDEyLzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cclxuXHRnZXRMaXN0SW52ZXJ0ZXIoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdHRyeSB7XHJcblxyXG5cdFx0XHRcdGRhdGEuY3VycmVudF9kYXRlID0gTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShkYXRhLmN1cnJlbnRfZGF0ZSk7XHJcblx0XHRcdFx0dmFyIGRhdGFEZXZpY2UgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluRGV2aWNlLmdldExpc3RJbnZlcnRlclwiLCBkYXRhKTtcclxuXHRcdFx0XHRpZiAoTGlicy5pc0FycmF5RGF0YShkYXRhRGV2aWNlKSkge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhRGV2aWNlLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdHZhciBpdGVtID0gZGF0YURldmljZVtpXTtcclxuXHRcdFx0XHRcdFx0Ly8gZ2V0IGluZm8gcG93ZXIgbm93LCBlbmVyZ3ksIGxpZmV0aW1lXHJcblx0XHRcdFx0XHRcdGxldCBvYmpEYXRhID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNYWluRGV2aWNlLmdldERhdGFEZXZpY2VNb2RlbEluZm9cIiwge1xyXG5cdFx0XHRcdFx0XHRcdGlkX2RldmljZTogaXRlbS5pZCxcclxuXHRcdFx0XHRcdFx0XHRpZF9sYW5ndWFnZTogZGF0YS5pZF9sYW5ndWFnZSxcclxuXHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBpdGVtLnRhYmxlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0Y3VycmVudF9kYXRlOiBkYXRhLmN1cnJlbnRfZGF0ZVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdHN3aXRjaCAoaXRlbS50YWJsZV9uYW1lKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NUUDExMCc6XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAob2JqRGF0YSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLnBvd2VyRmFjdG9yID0gb2JqRGF0YS5wb3dlckZhY3RvcjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5yZWFjdGl2ZVBvd2VyID0gb2JqRGF0YS5yZWFjdGl2ZVBvd2VyO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmFjdGl2ZVBvd2VyID0gb2JqRGF0YS5hY3RpdmVQb3dlciAvIDEwMDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0uYWN0aXZlRW5lcmd5ID0gb2JqRGF0YS5hY3RpdmVFbmVyZ3kgLyAxMDAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmludGVybmFsVGVtcGVyYXR1cmUgPSBvYmpEYXRhLmNhYmluZXRUZW1wZXJhdHVyZTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0ucG93ZXJGYWN0b3IgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLnJlYWN0aXZlUG93ZXIgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmFjdGl2ZVBvd2VyID0gMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5hY3RpdmVFbmVyZ3kgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmludGVybmFsVGVtcGVyYXR1cmUgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBkYXRhRGV2aWNlW2ldLnN0YXR1cyA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NUUDUwJzpcclxuXHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU0hQNzUnOlxyXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX0FCQl9QVlMxMDAnOlxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKG9iakRhdGEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5wb3dlckZhY3RvciA9IG9iakRhdGEucG93ZXJGYWN0b3I7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0ucmVhY3RpdmVQb3dlciA9IG9iakRhdGEucmVhY3RpdmVQb3dlcjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5hY3RpdmVQb3dlciA9IG9iakRhdGEuYWN0aXZlUG93ZXIgLyAxMDAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmFjdGl2ZUVuZXJneSA9IG9iakRhdGEuYWN0aXZlRW5lcmd5IC8gMTAwMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5pbnRlcm5hbFRlbXBlcmF0dXJlID0gb2JqRGF0YS5pbnRlcm5hbFRlbXBlcmF0dXJlO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5wb3dlckZhY3RvciA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0ucmVhY3RpdmVQb3dlciA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0uYWN0aXZlUG93ZXIgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmFjdGl2ZUVuZXJneSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0uaW50ZXJuYWxUZW1wZXJhdHVyZSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGRhdGFEZXZpY2VbaV0uc3RhdHVzID0gMDtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLnBvd2VyRmFjdG9yID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0ucmVhY3RpdmVQb3dlciA9IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmFjdGl2ZVBvd2VyID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0uYWN0aXZlRW5lcmd5ID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0uaW50ZXJuYWxUZW1wZXJhdHVyZSA9IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLnN0YXR1cyA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZGF0YURldmljZSk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3RcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMi8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHJcblx0Z2V0TGlzdChkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0dHJ5IHtcclxuXHJcblx0XHRcdFx0ZGF0YS5jdXJyZW50X2RhdGUgPSBMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKGRhdGEuY3VycmVudF9kYXRlKTtcclxuXHRcdFx0XHR2YXIgZGF0YURldmljZSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5EZXZpY2UuZ2V0TGlzdFwiLCBkYXRhKTtcclxuXHRcdFx0XHRpZiAoTGlicy5pc0FycmF5RGF0YShkYXRhRGV2aWNlKSkge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhRGV2aWNlLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdHZhciBpdGVtID0gZGF0YURldmljZVtpXTtcclxuXHRcdFx0XHRcdFx0Ly8gR2V0IGxpc3QgYWxlcnRcclxuXHRcdFx0XHRcdFx0bGV0IGFsZXJ0cyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5EZXZpY2UuZ2V0QWxlcnRCeURldmljZVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBpdGVtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdGlkX2xhbmd1YWdlOiBkYXRhLmlkX2xhbmd1YWdlXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmFsZXJ0cyA9IGFsZXJ0cztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGFEZXZpY2UpO1xyXG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEzhuqV5IHThu5VuZyBz4buRIGTDsm5nXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTIvMDkvMjAyMVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IERldmljZX0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0Z2V0U2l6ZShkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTWFpbkRldmljZS5nZXRTaXplXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDEyLzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cclxuXHRnZXRMaXN0UGFyYW1ldGVyQnlEZXZpY2UoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dmFyIGRhdGFEZXZpY2UgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluRGV2aWNlLmdldExpc3RQYXJhbWV0ZXJCeURldmljZVwiLCBkYXRhKTtcclxuXHJcblx0XHRcdFx0bGV0IGdldExhc3RSb3dEYXRhRGV2aWNlID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNYWluRGV2aWNlLmdldExhc3RSb3dEYXRhRGV2aWNlXCIsIHtcclxuXHRcdFx0XHRcdGlkX2RldmljZTogZGF0YS5pZCxcclxuXHRcdFx0XHRcdGlkX2xhbmd1YWdlOiBkYXRhLmlkX2xhbmd1YWdlLFxyXG5cdFx0XHRcdFx0dGFibGVfbmFtZTogZGF0YS50YWJsZV9uYW1lXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0Y29uc3QgbW9tZW50ID0gcmVxdWlyZShcIm1vbWVudFwiKTtcclxuXHRcdFx0XHRsZXQgZGF0ZSA9IG1vbWVudCgpLmZvcm1hdCgnREQvTU0vWVlZWSBISDptbTpzcycpO1xyXG5cclxuXHRcdFx0XHRpZiAoTGlicy5pc0FycmF5RGF0YShkYXRhRGV2aWNlKSAmJiBnZXRMYXN0Um93RGF0YURldmljZSkge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhRGV2aWNlLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0udmFsdWUgPSBnZXRMYXN0Um93RGF0YURldmljZVtkYXRhRGV2aWNlW2ldLnNsdWddO1xyXG5cdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmxhc3RfY29tbXVuaWNhdGlvbiA9IGdldExhc3RSb3dEYXRhRGV2aWNlWydsYXN0X2NvbW11bmljYXRpb24nXTtcclxuXHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5sYXN0X2F0dGVtcHQgPSBkYXRlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhRGV2aWNlKTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdCBhbGVydCBieSBkZWl2Y2VcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxOC8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHRnZXRMaXN0QWxlcnRCeURldmljZShkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YSkpIHtcclxuXHRcdFx0XHRkYXRhLmN1cnJlbnRfcm93ID0gKHR5cGVvZiBkYXRhLmN1cnJlbnRfcm93ID09ICd1bmRlZmluZWQnKSA/IDAgOiBkYXRhLmN1cnJlbnRfcm93O1xyXG5cdFx0XHRcdGRhdGEubWF4X3JlY29yZCA9IENvbnN0YW50cy5kYXRhLm1heF9yZWNvcmQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5EZXZpY2UuZ2V0TGlzdEFsZXJ0QnlEZXZpY2VcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBM4bqleSB04buVbmcgc+G7kSBkw7JuZ1xyXG5cdCAqIEBhdXRob3IgbG9uZy5waGFtXHJcblx0ICogQHNpbmNlIDE4LzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdCBhbGVydH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0Z2V0TGlzdEFsZXJ0QnlEZXZpY2VTaXplKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJNYWluRGV2aWNlLmdldExpc3RBbGVydEJ5RGV2aWNlU2l6ZVwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIHN0YXR1c1xyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBFcnJvcn0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0dXBkYXRlT25PZmYoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi51cGRhdGUoXCJNYWluRGV2aWNlLnVwZGF0ZU9uT2ZmXCIsIGRhdGEsIChlcnIsIHJzKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGNhbGxCYWNrKGVyciwgcnMpXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcclxuXHRcdFx0Y2FsbEJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gSW5zZXJ0IGRhdGFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgRXJyb3JMZXZlbH0gZGF0YVxyXG5cdCAqL1xyXG5cdHNhdmVDb250cm9sQ2FsZW5kYXIoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblxyXG5cdFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTWFpbkRldmljZS5zYXZlQ29udHJvbENhbGVuZGFyXCIsIGRhdGEpO1xyXG5cdFx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yJywgZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBsaXN0XHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IEVycm9yTGV2ZWx9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHRnZXRMaXN0Q29udHJvbENhbGVuZGFyKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhKSkge1xyXG5cdFx0XHRcdGRhdGEuY3VycmVudF9yb3cgPSAodHlwZW9mIGRhdGEuY3VycmVudF9yb3cgPT0gJ3VuZGVmaW5lZCcpID8gMCA6IGRhdGEuY3VycmVudF9yb3c7XHJcblx0XHRcdFx0ZGF0YS5tYXhfcmVjb3JkID0gQ29uc3RhbnRzLmRhdGEubWF4X3JlY29yZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JMaXN0KFwiTWFpbkRldmljZS5nZXRMaXN0Q29udHJvbENhbGVuZGFyXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBJbnNlcnQgZGF0YVxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBFcnJvckxldmVsfSBkYXRhXHJcblx0ICovXHJcblx0c2F2ZUFyckNvbnRyb2xDYWxlbmRhcihkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBkYXRhRGV2aWNlcyA9IGRhdGEuZGF0YURldmljZXM7XHJcblx0XHRcdFx0XHRpZiAoZGF0YURldmljZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFEZXZpY2VzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGl0ZW0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGRhdGFEZXZpY2VzW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0ZV9mcm9tOiBkYXRhLmRhdGVfZnJvbSxcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGVfdG86IGRhdGEuZGF0ZV90b1xyXG5cdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLmluc2VydChcIk1haW5EZXZpY2Uuc2F2ZUNvbnRyb2xDYWxlbmRhclwiLCBpdGVtKTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdlcnJvcicsIGUpO1xyXG5cdFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBFcnJvckxldmVsfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0ICovXHJcblx0Z2V0TGlzdEJ5U2l0ZUNvbnRyb2xDYWxlbmRhcihkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YSkpIHtcclxuXHRcdFx0XHRkYXRhLmN1cnJlbnRfcm93ID0gKHR5cGVvZiBkYXRhLmN1cnJlbnRfcm93ID09ICd1bmRlZmluZWQnKSA/IDAgOiBkYXRhLmN1cnJlbnRfcm93O1xyXG5cdFx0XHRcdGRhdGEubWF4X3JlY29yZCA9IENvbnN0YW50cy5kYXRhLm1heF9yZWNvcmQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5EZXZpY2UuZ2V0TGlzdEJ5U2l0ZUNvbnRyb2xDYWxlbmRhclwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGlzX2RlbGV0ZSA9IDFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgRXJyb3JMZXZlbH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0ZGVsZXRlTGlzdENhbGVuZGFyQ29udHJvbChkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmRlbGV0ZShcIk1haW5EZXZpY2UuZGVsZXRlTGlzdENhbGVuZGFyQ29udHJvbFwiLCBkYXRhLCAoZXJyLCBycykgPT4ge1xyXG5cdFx0XHRcdHJldHVybiBjYWxsQmFjayhlcnIsIHJzKVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIGlzX2RlbGV0ZSA9IDFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgRXJyb3JMZXZlbH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0ZGVsZXRlSXRlbUNhbGVuZGFyQ29udHJvbChkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmRlbGV0ZShcIk1haW5EZXZpY2UuZGVsZXRlSXRlbUNhbGVuZGFyQ29udHJvbFwiLCBkYXRhLCAoZXJyLCBycykgPT4ge1xyXG5cdFx0XHRcdHJldHVybiBjYWxsQmFjayhlcnIsIHJzKVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBzdGF0dXNcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMS8wNy8yMDE5XHJcblx0ICogQHBhcmFtIHtPYmplY3QgRXJyb3J9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFja1xyXG5cdCAqL1xyXG5cdHVwZGF0ZUNvbnRyb2xNb2RlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIudXBkYXRlKFwiTWFpbkRldmljZS51cGRhdGVDb250cm9sTW9kZVwiLCBkYXRhLCAoZXJyLCBycykgPT4ge1xyXG5cdFx0XHRcdHJldHVybiBjYWxsQmFjayhlcnIsIHJzKVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQqIGdldCBkZXRhaWwgRXJyb3JcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHRnZXRQcm9qZWN0RGV0YWlsKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJNYWluRGV2aWNlLmdldFByb2plY3REZXRhaWxcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBLaWVtIHRyYSBlbXBsb3llZSBleGlzdCBieSBpZF9jb21wYW55LCBlbWFpbCBcclxuXHQgKiBAcGFyYW0ge09iamVjdH0gcGVybWlzc2lvbiBcclxuXHQgKi9cclxuXHRhc3luYyBnZXREZXZpY2VUZWNoRWRnZShkYXRhKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0cmV0dXJuIGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTWFpbkRldmljZS5nZXREZXZpY2VUZWNoRWRnZVwiLCBkYXRhKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlIHN0YXR1c1xyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDExLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBFcnJvcn0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0dXBkYXRlTW9kZVBvd2VyQW5kRW5lcmd5KGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIudXBkYXRlKFwiTWFpbkRldmljZS51cGRhdGVNb2RlUG93ZXJBbmRFbmVyZ3lcIiwgZGF0YSwgKGVyciwgcnMpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gY2FsbEJhY2soZXJyLCBycylcclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xyXG5cdFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHQvKipcclxuXHQqIGdldCBkZXRhaWwgcHJvamVjdCBwYWdlIHBsYW50XHJcblx0KiBAcGFyYW0geyp9IGRhdGEgXHJcblx0KiBAcGFyYW0geyp9IGNhbGxCYWNrIFxyXG5cdCovXHJcblxyXG5cdGdldFBvd2VyTm93QnlEYXkocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBvamJQYXJhbSA9IHBhcmFtO1xyXG5cclxuXHRcdFx0XHRcdHZhciBkYXRhTGlzdCA9IHBhcmFtLmRhdGFMaXN0O1xyXG5cclxuXHRcdFx0XHRcdGlmIChkYXRhTGlzdC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZGF0YUxpc3RbaV0uaWRfZGV2aWNlX3R5cGUgPT0gMSB8fCBkYXRhTGlzdFtpXS5pZF9kZXZpY2VfdHlwZSA9PSA0KSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgaXRlbSA9IGRhdGFMaXN0W2ldO1xyXG5cdFx0XHRcdFx0XHRcdFx0aXRlbS5jdXJyZW50X2RhdGUgPSBwYXJhbS5jdXJyZW50X2RhdGU7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgcnMgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1haW5EZXZpY2UuZ2V0UG93ZXJOb3dCeURheVwiLCBpdGVtKTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5lbmVyZ3lfdG9kYXkgPSBycy5lbmVyZ3lEYXk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdG9qYlBhcmFtLmRhdGFMaXN0ID0gZGF0YUxpc3Q7XHJcblxyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBvamJQYXJhbSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRpZiAoY29ubikge1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gSW5zZXJ0IGFsYXJtXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTIvMDkvMjAyMVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IG1vZGVsfSBkYXRhXHJcblx0ICovXHJcblx0c2F2ZVN0YXR1c0NNRChkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJkYXRhUG9zdDogXCIsIGRhdGEpO1xyXG5cclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgdHlwZSA9IGRhdGEudHlwZTtcclxuXHRcdFx0XHRcdHZhciBwYXlsb2FkID0gZGF0YS5wYXlsb2FkO1xyXG5cdFx0XHRcdFx0dmFyIHBhcmFtID0gcGF5bG9hZFswXS5wYXJhbTtcclxuXHRcdFx0XHRcdHZhciB2YWx1ZSA9IHBheWxvYWRbMF0udmFsdWU7XHJcblxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJwYXJhbTogXCIsIHBhcmFtKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwidmFsdWU6IFwiLCB2YWx1ZSk7XHJcblxyXG5cdFx0XHRcdFx0c3dpdGNoICh0eXBlKSB7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ3NjaGVkdWxlQ29udHJvbCc6XHJcblx0XHRcdFx0XHRcdFx0c3dpdGNoIChwYXJhbSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAnc2NoZWR1bGUnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBDYXAgbmhhdCBzY2hlZHVsZSBjb250cm9sIGF1dG8gbW9kZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNBcnJheURhdGEodmFsdWUpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gR2V0IGRldmljZSBkZXRhaWwgYnkgZGV2aWNlSURcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgb2JqID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlSUQ6IHZhbHVlW2ldLmRldmljZUlELFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0ZV9mcm9tOiB2YWx1ZVtpXS5kYXRlRnJvbSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGVfdG86IHZhbHVlW2ldLmRhdGVUbyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogdmFsdWVbaV0uY29tbWFuZCA9PSAnb2ZmJyA/IDEgOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGdldERldmljZUluZm8gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1haW5EZXZpY2UuZ2V0RGV2aWNlRGV0YWlsXCIsIG9iaik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGdldERldmljZUluZm8gJiYgIUxpYnMuaXNPYmplY3RFbXB0eShnZXREZXZpY2VJbmZvKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqLmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBVcGRhdGUgZGV2aWNlX2NvbnRyb2xfY2FsZW5kYXJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLnVwZGF0ZShcIk1haW5EZXZpY2UudXBkYXRlRGV2aWNlQ29udHJvbENhbGVuZGFyXCIsIG9iaik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAnY29tbWFuZHMnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBVcGRhdGUgZGV2aWNlIHN0YXR1cyBvbi9vZmZcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQXJyYXlEYXRhKHZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEdldCBkZXZpY2UgZGV0YWlsIGJ5IGRldmljZUlEXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIG9iaiA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogdmFsdWVbaV0uZGV2aWNlSUQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VJRDogdmFsdWVbaV0uZGV2aWNlSUQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNfY29udHJvbDogdmFsdWVbaV0uUExDU3RhdHVzID09ICdvbicgPyAxIDogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBnZXREZXZpY2VJbmZvID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNYWluRGV2aWNlLmdldERldmljZURldGFpbFwiLCBvYmopO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChnZXREZXZpY2VJbmZvICYmICFMaWJzLmlzT2JqZWN0RW1wdHkoZ2V0RGV2aWNlSW5mbykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBkZXZpY2Ugb24vb2ZmXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi51cGRhdGUoXCJNYWluRGV2aWNlLnVwZGF0ZURldmljZU9uT2ZmXCIsIG9iaik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAnb3BlcmF0aW9uTW9kZSc6XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChMaWJzLmlzQmxhbmsodmFsdWUpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBvYmogPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfcHJvamVjdDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VJRDogZGF0YS5kZXZpY2VJRCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzY2hlZHVsZV9jb250cm9sX21vZGU6IHZhbHVlID09ICdtYW51YWwnID8gMSA6IDJcclxuXHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGdldERldmljZUluZm8gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1haW5EZXZpY2UuZ2V0RGV2aWNlRGV0YWlsXCIsIG9iaik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChnZXREZXZpY2VJbmZvICYmICFMaWJzLmlzT2JqZWN0RW1wdHkoZ2V0RGV2aWNlSW5mbykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvYmouaWRfcHJvamVjdCA9IGdldERldmljZUluZm8uaWRfcHJvamVjdDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBVcGRhdGUgcHJvamVjdCBvcGVyYXRpb25Nb2RlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIudXBkYXRlKFwiTWFpbkRldmljZS51cGRhdGVQcm9qZWN0U2NoZWR1bGVPcGVyYXRpb25Nb2RlXCIsIG9iaik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlICdleHBvcnRMaW1pdGF0aW9uJzpcclxuXHRcdFx0XHRcdFx0XHRzd2l0Y2ggKHBhcmFtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdvcGVyYXRpb25Nb2RlJzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKExpYnMuaXNCbGFuayh2YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIG9iaiA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9wcm9qZWN0OiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZUlEOiBkYXRhLmRldmljZUlELFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGV4cG9ydF9saW1pdGF0aW9uX2NvbnRyb2xfbW9kZTogdmFsdWUgPT0gJ21hbnVhbCcgPyAxIDogMlxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgZ2V0RGV2aWNlSW5mbyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTWFpbkRldmljZS5nZXREZXZpY2VEZXRhaWxcIiwgb2JqKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGdldERldmljZUluZm8gJiYgIUxpYnMuaXNPYmplY3RFbXB0eShnZXREZXZpY2VJbmZvKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9iai5pZF9wcm9qZWN0ID0gZ2V0RGV2aWNlSW5mby5pZF9wcm9qZWN0O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBwcm9qZWN0IG9wZXJhdGlvbk1vZGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi51cGRhdGUoXCJNYWluRGV2aWNlLnVwZGF0ZVByb2plY3RPcGVyYXRpb25Nb2RlXCIsIG9iaik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2xpbWl0UG93ZXInOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoTGlicy5pc0JsYW5rKHZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgb2JqID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX3Byb2plY3Q6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlSUQ6IGRhdGEuZGV2aWNlSUQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGltaXRfcG93ZXJfc3RhdHVzOiB2YWx1ZSA9PSAnZW5hYmxlJyA/IDEgOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBnZXREZXZpY2VJbmZvID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNYWluRGV2aWNlLmdldERldmljZURldGFpbFwiLCBvYmopO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoZ2V0RGV2aWNlSW5mbyAmJiAhTGlicy5pc09iamVjdEVtcHR5KGdldERldmljZUluZm8pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqLmlkX3Byb2plY3QgPSBnZXREZXZpY2VJbmZvLmlkX3Byb2plY3Q7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIHByb2plY3Qgb3BlcmF0aW9uTW9kZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLnVwZGF0ZShcIk1haW5EZXZpY2UudXBkYXRlUHJvamVjdExpbWl0UG93ZXJcIiwgb2JqKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbGltaXRFbmVyZ3knOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoTGlicy5pc0JsYW5rKHZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgb2JqID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX3Byb2plY3Q6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlSUQ6IGRhdGEuZGV2aWNlSUQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGltaXRfZW5lcmd5X3N0YXR1czogdmFsdWUgPT0gJ2VuYWJsZScgPyAxIDogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgZ2V0RGV2aWNlSW5mbyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTWFpbkRldmljZS5nZXREZXZpY2VEZXRhaWxcIiwgb2JqKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGdldERldmljZUluZm8gJiYgIUxpYnMuaXNPYmplY3RFbXB0eShnZXREZXZpY2VJbmZvKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9iai5pZF9wcm9qZWN0ID0gZ2V0RGV2aWNlSW5mby5pZF9wcm9qZWN0O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBwcm9qZWN0IG9wZXJhdGlvbk1vZGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi51cGRhdGUoXCJNYWluRGV2aWNlLnVwZGF0ZVByb2plY3RMaW1pdEVuZXJneVwiLCBvYmopO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChMaWJzLmlzQmxhbmsodmFsdWUpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBvYmogPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfcHJvamVjdDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VJRDogZGF0YS5kZXZpY2VJRCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsaW1pdF9wb3dlcjogcGF5bG9hZFswXS52YWx1ZSA/IHBheWxvYWRbMF0udmFsdWUgOiAwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxpbWl0X2VuZXJneTogcGF5bG9hZFsxXS52YWx1ZSA/IHBheWxvYWRbMV0udmFsdWUgOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBnZXREZXZpY2VJbmZvID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNYWluRGV2aWNlLmdldERldmljZURldGFpbFwiLCBvYmopO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoZ2V0RGV2aWNlSW5mbyAmJiAhTGlicy5pc09iamVjdEVtcHR5KGdldERldmljZUluZm8pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqLmlkX3Byb2plY3QgPSBnZXREZXZpY2VJbmZvLmlkX3Byb2plY3Q7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIHByb2plY3QgbGltaXQgcG93ZXIgYW5kIGVuZXJneVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLnVwZGF0ZShcIk1haW5EZXZpY2UudXBkYXRlUmVnaXN0ZXJlZEVuZXJneVwiLCBvYmopO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnJzpcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnJzpcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHJcblxyXG5cclxuXHRcdFx0XHRcdC8vIGlmICghcnMpIHtcclxuXHRcdFx0XHRcdC8vIFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Ly8gXHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0Ly8gXHRyZXR1cm47XHJcblx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0Ly8gY29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdC8vIGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yJywgZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IE1haW5EZXZpY2VTZXJ2aWNlO1xyXG4iXX0=