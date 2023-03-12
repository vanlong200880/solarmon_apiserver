import BaseService from './BaseService';
class MainDeviceService extends BaseService {
	constructor() {
		super();

	}

	/**
	 * @description Get list
	 * @author Long.Pham
	 * @since 12/09/2021
	 * @param {Object} data
	 * @param {function callback} callback 
	 */

	getListInverter(data, callBack) {
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {

				data.current_date = Libs.convertAllFormatDate(data.current_date);
				var dataDevice = await db.queryForList("MainDevice.getListInverter", data);
				if (Libs.isArrayData(dataDevice)) {
					for (var i = 0; i < dataDevice.length; i++) {
						var item = dataDevice[i];
						// get info power now, energy, lifetime
						let objData = await db.queryForObject("MainDevice.getDataDeviceModelInfo", {
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

	getList(data, callBack) {
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {

				data.current_date = Libs.convertAllFormatDate(data.current_date);
				var dataDevice = await db.queryForList("MainDevice.getList", data);
				if (Libs.isArrayData(dataDevice)) {
					for (var i = 0; i < dataDevice.length; i++) {
						var item = dataDevice[i];
						// Get list alert
						let alerts = await db.queryForList("MainDevice.getAlertByDevice", {
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
	getSize(data, callback) {
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

	getListParameterByDevice(data, callBack) {
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				var dataDevice = await db.queryForList("MainDevice.getListParameterByDevice", data);

				let getLastRowDataDevice = await db.queryForObject("MainDevice.getLastRowDataDevice", {
					id_device: data.id,
					id_language: data.id_language,
					table_name: data.table_name
				});
				const moment = require("moment");
				let date = moment().format('DD/MM/YYYY HH:mm:ss');

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
	getListAlertByDevice(data, callback) {
		try {
			if (!Libs.isBlank(data)) {
				data.current_row = (typeof data.current_row == 'undefined') ? 0 : data.current_row;
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
	getListAlertByDeviceSize(data, callback) {
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
	updateOnOff(data, callBack) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.update("MainDevice.updateOnOff", data, (err, rs) => {
				return callBack(err, rs)
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
	saveControlCalendar(data, callBack) {
		try {
			let self = this;
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
			})
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
	getListControlCalendar(data, callback) {
		try {
			if (!Libs.isBlank(data)) {
				data.current_row = (typeof data.current_row == 'undefined') ? 0 : data.current_row;
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
	saveArrControlCalendar(data, callBack) {
		try {
			let self = this;
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
			})
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
	getListBySiteControlCalendar(data, callback) {
		try {
			if (!Libs.isBlank(data)) {
				data.current_row = (typeof data.current_row == 'undefined') ? 0 : data.current_row;
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
	deleteListCalendarControl(data, callBack) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.delete("MainDevice.deleteListCalendarControl", data, (err, rs) => {
				return callBack(err, rs)
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
	deleteItemCalendarControl(data, callBack) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.delete("MainDevice.deleteItemCalendarControl", data, (err, rs) => {
				return callBack(err, rs)
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
	updateControlMode(data, callBack) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.update("MainDevice.updateControlMode", data, (err, rs) => {
				return callBack(err, rs)
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
	getProjectDetail(data, callback) {
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
	async getDeviceTechEdge(data) {
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
	updateModePowerAndEnergy(data, callBack) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.update("MainDevice.updateModePowerAndEnergy", data, (err, rs) => {
				return callBack(err, rs)
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

	getPowerNowByDay(param, callBack) {
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
	saveStatusCMD(data, callBack) {
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




}
export default MainDeviceService;
