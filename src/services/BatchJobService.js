import BaseService from './BaseService';
import moment from 'moment';
class BatchJobService extends BaseService {
	constructor() {
		super();

	}


	/**
	* run batch job no comminication
	* @param {*} data 
	* @param {*} callBack 
	*/
	runNoCommunication(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var startDate = moment().format('YYYY-MM-DD') + " 05:30:00";
					var endDate = moment().format('YYYY-MM-DD') + " 17:30:00";
					var startDiff = moment().isAfter(startDate);
					var endDiff = moment().isBefore(endDate);
					if (!startDiff || !endDiff) {
						conn.rollback();
						callBack(true, {});
						return;
					}

					// when don’t receive any package from gateway for 10mins. -> Lý do: router4G issue/sim expired/cúp điện/... 
					var allDevice = await db.queryForList("BatchJob.getAllDevice", { type: 'gw' });
					if (allDevice.length > 0) {
						for (let i = 0; i < allDevice.length; i++) {
							var item = allDevice[i];
							var lastRowItem = await db.queryForObject("BatchJob.getLastRowItem", item);
							// Check error exits no communication
							var id_error = null;
							switch (item.table_name) {
								case 'model_techedge':
									id_error = 635;
									break;

							}

							if (lastRowItem && !Libs.isBlank(lastRowItem.max_time) && lastRowItem.diff >= 10) {
								if (!Libs.isBlank(id_error)) {
									let checkExistAlerm = await db.queryForObject("BatchJob.checkExistAlerm", {
										id_device: item.id,
										id_error: id_error
									});
									if (!checkExistAlerm) {
										await db.insert("BatchJob.insertAlert", {
											id_device: item.id,
											id_error: id_error,
											start_date: lastRowItem.max_time,
											status: 1
										});
									}
								}
							} else {
								// auto close no communication
								if (!Libs.isBlank(id_error)) {
									let checkExistAlerm = await db.queryForObject("BatchJob.checkExistAlerm", {
										id_device: item.id,
										id_error: id_error
									});

									if (checkExistAlerm) {
										await db.update("BatchJob.closeAlarm", {
											id: checkExistAlerm.id,
											id_device: item.id,
											id_error: id_error,
											status: 0
										});
									}
								}
							}
						}
					}


					// - Không nhận thêm các gói tin nào từ thiết bị (trừ gw) trong 10ph;
					// - Inverter, meter, sensor, Manager 
					// - Message Lost communication 
					var allDeviceIMSM = await db.queryForList("BatchJob.getAllDevice", { type: 'inverter-meter-sensor-manager' });
					if (allDeviceIMSM.length > 0) {
						for (let j = 0; j < allDeviceIMSM.length; j++) {
							let itemIMSM = allDeviceIMSM[j];
							var lastRowItemIMSM = await db.queryForObject("BatchJob.getLastRowItem", itemIMSM);
							// Check error exits no communication
							var id_error_imsm = null;
							switch (itemIMSM.table_name) {
								case 'model_emeter_Janitza_UMG96S2':
									id_error_imsm = 627;
									break;
								case 'model_inverter_ABB_PVS100':
									id_error_imsm = 628;
									break;
								case 'model_inverter_Growatt_GW80KTL3':
									break;
								case 'model_inverter_SMA_SHP75':
									id_error_imsm = 629;
									break;
								case 'model_inverter_SMA_STP50':
									id_error_imsm = 630;
									break;
								case 'model_inverter_Sungrow_SG110CX':
									break;
								case 'model_logger_SMA_IM20':
									id_error_imsm = 631;
									break;
								case 'model_sensor_RT1':
									id_error_imsm = 632;
									break;
								case 'model_sensor_IMT_SiRS485':
									id_error_imsm = 633;
									break;
								case 'model_sensor_IMT_TaRS485':
									id_error_imsm = 634;
									break;
								case 'model_inverter_SMA_STP110':
									id_error_imsm = 636;
									break;
								case 'model_emeter_Vinasino_VSE3T5':
									id_error_imsm = 637;
									break;
							}

							if (lastRowItemIMSM && !Libs.isBlank(lastRowItemIMSM.max_time) && lastRowItemIMSM.diff >= 10) {
								if (!Libs.isBlank(id_error)) {
									let checkExistAlermIMSM = await db.queryForObject("BatchJob.checkExistAlerm", {
										id_device: itemIMSM.id,
										id_error: id_error_imsm
									});
									if (!checkExistAlermIMSM) {
										await db.insert("BatchJob.insertAlert", {
											id_device: itemIMSM.id,
											id_error: id_error_imsm,
											start_date: lastRowItemIMSM.max_time,
											status: 1
										});
									}
								}
							} else {
								// auto close no communication
								if (!Libs.isBlank(id_error_imsm)) {
									let checkExistAlermIMSM = await db.queryForObject("BatchJob.checkExistAlerm", {
										id_device: itemIMSM.id,
										id_error: id_error_imsm
									});

									if (checkExistAlermIMSM) {
										await db.update("BatchJob.closeAlarm", {
											id: checkExistAlermIMSM.id,
											id_device: itemIMSM.id,
											id_error: id_error_imsm,
											status: 0
										});
									}
								}
							}
						}
					}


					// 

					conn.commit();
					callBack(false, {});
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
	* run batch job reset energy today
	* @param {*} data 
	* @param {*} callBack 
	*/
	resetTodayEnergy(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.update("BatchJob.resetTodayEnergy", { energy_today: null });
					if (!rs) {
						conn.rollback();
						callBack(true, {});
						return;
					}
					conn.commit();
					callBack(false, {});
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
	* run batch job reset power now
	* @param {*} data 
	* @param {*} callBack 
	*/
	resetPowerNow(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.update("BatchJob.resetPowerNow", { power_now: null });
					if (!rs) {
						conn.rollback();
						callBack(true, {});
						return;
					}
					conn.commit();
					callBack(false, {});
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
	* run batch job update device data
	* @param {*} data 
	* @param {*} callBack 
	*/
	updatedDevicePlant(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var listDevice = await db.queryForList("BatchJob.getListDevice", {});
					var dataDeviceUpdate = [];
					if (listDevice.length > 0) {
						for (let i = 0; i < listDevice.length; i++) {
							if (listDevice[i].id_device_type == 1 || listDevice[i].id_device_type == 4) {
								// Device inverter, meter
								let lastRowDataUpdated = await db.queryForObject("BatchJob.getDataUpdateDevice", {
									id_device: listDevice[i].id,
									table_name: listDevice[i].table_name,
									id_device_type: listDevice[i].id_device_type
								});
								if (lastRowDataUpdated) {
									dataDeviceUpdate.push({
										id: listDevice[i].id,
										power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
										energy_today: lastRowDataUpdated.energy_today,
										last_month: lastRowDataUpdated.energy_last_month,
										lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
										last_updated: lastRowDataUpdated.time
									});
								}
							} else {
								// Device not inverter
								var dataLastUpdate = await db.queryForObject("BatchJob.getDataLastUpdate", {
									id_device: listDevice[i].id,
									table_name: listDevice[i].table_name,
									id_device_type: listDevice[i].id_device_type
								});
								if (dataLastUpdate) {
									dataDeviceUpdate.push({
										id: listDevice[i].id,
										power_now: null,
										energy_today: null,
										last_month: null,
										lifetime: null,
										last_updated: dataLastUpdate.time
									}
									);
								}
							}


						}
					}
					if (dataDeviceUpdate.length > 0) {
						await db.update("BatchJob.updatedDevicePlant", { dataDeviceUpdate });
					}

					conn.commit();
					callBack(false, {});
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
	* run batch job check performace index meter and inverter
	* @param {*} data 
	* @param {*} callBack 
	*/
	checkPerformanceIndex(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var listDevice = await db.queryForList("BatchJob.getListDevicePerformanceIndex", {});
					if (listDevice.length > 0) {
						var dataErrors = [];
						for (let i = 0; i < listDevice.length; i++) {
							// get energy today by device
							let getTodayProduct = await db.queryForObject("BatchJob.getTodayProd", {
								table_name: listDevice[i].table_name,
								id_device: listDevice[i].id
							});

							if (getTodayProduct && getTodayProduct.todayProd > 0) {
								let todayProd = getTodayProduct.todayProd;
								let averageDailyProd = getTodayProduct.averageDailyProd;
								let percent = ((todayProd / averageDailyProd) * 100);
								switch (parseInt(listDevice[i].pi_type)) {
									case 1:
										// From today production
										if (percent < (listDevice[i].pi_index_value * 100)) {
											switch (listDevice[i].table_name) {
												case 'model_inverter_ABB_PVS100':
													dataErrors.push({ id_device: listDevice[i].id, id_error: 650, status: 1 });
													break;
												case 'model_inverter_SMA_SHP75':
													dataErrors.push({ id_device: listDevice[i].id, id_error: 651, status: 1 });
													break;
												case 'model_inverter_SMA_STP50':
													dataErrors.push({ id_device: listDevice[i].id, id_error: 652, status: 1 });
													break;
												case 'model_inverter_SMA_STP110':
													dataErrors.push({ id_device: listDevice[i].id, id_error: 653, status: 1 });
													break;
												case 'model_emeter_Vinasino_VSE3T5':
													dataErrors.push({ id_device: listDevice[i].id, id_error: 654, status: 1 });
													break;
												case 'model_emeter_GelexEmic_ME41':
													dataErrors.push({ id_device: listDevice[i].id, id_error: 655, status: 1 });
													break;
											}
										}
										break;
									case 2:
										// From sensor
										// Tinh toan poa_irradiance
										if (listDevice[i].poa_irradiance != null && listDevice[i].panel_temperature != null) {
											// get sensor type, table, poa_irradiance
											var deviceInfoIrradiance = await db.queryForObject("BatchJob.getDeviceInfo", { id_device: listDevice[i].poa_irradiance });
											if (deviceInfoIrradiance) {
												// get data sensor 
												var dataSensor = await db.queryForList("BatchJob.getDataSensor", {
													id_device: listDevice[i].poa_irradiance
												});

												if (dataSensor.length > 0) {
													// Lay data inverter 
													var dataDevice = await db.queryForList("BatchJob.getDataDevice", {
														id_device: listDevice[i].id,
														table_name: listDevice[i].table_name
													});

													if (dataDevice.length > 0) {
														// Tinh toan tu sensor
														var calSensorSum = 0;
														for (var j = 0; j < dataDevice.length; j++) {
															var tmpIrradiancePoA = Libs.find(dataSensor, 'time_format', dataSensor[j].time_format);
															var irr = Libs.isBlank(tmpIrradiancePoA.irradiancePoA) ? 0 : tmpIrradiancePoA.irradiancePoA;
															var panelTemp = Libs.isBlank(tmpIrradiancePoA.panelTemp) ? 0 : tmpIrradiancePoA.panelTemp;
															if (!Libs.isBlank(tmpIrradiancePoA.irradiancePoA) && tmpIrradiancePoA.irradiancePoA > 0 && !Libs.isBlank(tmpIrradiancePoA.panelTemp) && tmpIrradiancePoA.panelTemp > 0) {
																var calSensor = (1 - (listDevice[i].temperature_coefficient / 100) * (panelTemp - 25)) * listDevice[i].dc_size * (irr / 1000) * 0.25;
																calSensorSum = calSensorSum + calSensor;
															}
														}
														
														let percent = ((todayProd / calSensorSum) * 100);
														if (percent < (listDevice[i].pi_index_value * 100)) {
															switch (listDevice[i].table_name) {
																case 'model_inverter_ABB_PVS100':
																	dataErrors.push({ id_device: listDevice[i].id, id_error: 650, status: 1 });
																	break;
																case 'model_inverter_SMA_SHP75':
																	dataErrors.push({ id_device: listDevice[i].id, id_error: 651, status: 1 });
																	break;
																case 'model_inverter_SMA_STP50':
																	dataErrors.push({ id_device: listDevice[i].id, id_error: 652, status: 1 });
																	break;
																case 'model_inverter_SMA_STP110':
																	dataErrors.push({ id_device: listDevice[i].id, id_error: 653, status: 1 });
																	break;
																case 'model_emeter_Vinasino_VSE3T5':
																	dataErrors.push({ id_device: listDevice[i].id, id_error: 654, status: 1 });
																	break;
																case 'model_emeter_GelexEmic_ME41':
																	dataErrors.push({ id_device: listDevice[i].id, id_error: 655, status: 1 });
																	break;
															}
														}

													}
												}
											}
										}

										break;
									case 3:
										// From AI
										break
								}
							}
						}

						if (dataErrors.length > 0) {
							await db.insert("BatchJob.insertAlertPerformanceIndex", { dataErrors });
						}
					}

					conn.commit();
					callBack(false, {});
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



}
export default BatchJobService;
