import BaseService from './BaseService';
import ModelSensorRT1Entity from '../entities/ModelSensorRT1Entity';
import ModelSensorIMTTaRS485Entity from '../entities/ModelSensorIMTTaRS485Entity';
import ModelSensorIMTSiRS485Entity from '../entities/ModelSensorIMTSiRS485Entity';
import ModelLoggerSMAIM20Entity from '../entities/ModelLoggerSMAIM20Entity';
import ModelInverterSungrowSG110CXEntity from '../entities/ModelInverterSungrowSG110CXEntity';
import ModelInverterSMASTP50Entity from '../entities/ModelInverterSMASTP50Entity';
import ModelInverterSMASHP75Entity from '../entities/ModelInverterSMASHP75Entity';
import ModelInverterGrowattGW80KTL3Entity from '../entities/ModelInverterGrowattGW80KTL3Entity';
import ModelInverterABBPVS100Entity from '../entities/ModelInverterABBPVS100Entity';
import ModelEmeterJanitzaUMG96S2Entity from '../entities/ModelEmeterJanitzaUMG96S2Entity';
import ModelTechedgeEntity from '../entities/ModelTechedgeEntity';
import ModelInverterSMASTP110Entity from '../entities/ModelInverterSMASTP110Entity';
import ModelEmeterVinasinoVSE3T5Entity from '../entities/ModelEmeterVinasinoVSE3T5Entity';

class ReadingAIService extends BaseService {
	constructor() {
		super();
	}

	/**
	 * @description Insert data
	 * @author Long.Pham
	 * @since 10/09/2021
	 * @param {Object model} data
	 */
	 insertReadingAI(data, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {

					var getDeviceInfo = await db.queryForObject("ModelReadings.getDeviceInfo", data);
					if (Libs.isObjectEmpty(dataPayload) || !getDeviceInfo || Libs.isObjectEmpty(getDeviceInfo) || Libs.isBlank(getDeviceInfo.table_name) || Libs.isBlank(getDeviceInfo.id)) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					let dataEntity = {}, rs = {}, checkExistAlerm = null;
					switch (getDeviceInfo.table_name) {

						case 'model_emeter_Vinasino_VSE3T5':
							dataEntity = Object.assign({}, new ModelEmeterVinasinoVSE3T5Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 626
							});

							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 626,
										start_date: data.timestamp,
										status: 1
									});
								}

								// Get last row by device 
								var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
									id_device: getDeviceInfo.id,
									table_name: getDeviceInfo.table_name
								});
								if (lastRow) {
									dataEntity.activeEnergy = lastRow.activeEnergy;
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 626,
										status: 0
									});
								}
							}

							if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelEmeterVinasinoVSE3T5", dataEntity);
								// Update device 
								// if (rs) {
								// 	let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
								// 		id_device: getDeviceInfo.id,
								// 		table_name: getDeviceInfo.table_name
								// 	});
								// 	if (lastRowDataUpdated) {
								// 		let deviceUpdated = {
								// 			id: getDeviceInfo.id,
								// 			power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
								// 			energy_today: lastRowDataUpdated.energy_today,
								// 			last_month: lastRowDataUpdated.energy_last_month,
								// 			lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
								// 			last_updated: dataEntity.time
								// 		};
								// 		db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// 	}
								// }
							}

							break;


						case 'model_inverter_SMA_STP110':
							dataEntity = Object.assign({}, new ModelInverterSMASTP110Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 437
							});

							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 437,
										start_date: data.timestamp,
										status: 1
									});
								}

								// Get last row by device 
								var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
									id_device: getDeviceInfo.id,
									table_name: getDeviceInfo.table_name
								});
								if (lastRow) {
									dataEntity.activeEnergy = lastRow.activeEnergy;
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 437,
										status: 0
									});
								}
							}

							if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelInverterSMASTP110", dataEntity);
								// Update device 
								// if (rs) {
								// 	let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
								// 		id_device: getDeviceInfo.id,
								// 		table_name: getDeviceInfo.table_name
								// 	});
								// 	if (lastRowDataUpdated) {
								// 		let deviceUpdated = {
								// 			id: getDeviceInfo.id,
								// 			power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
								// 			energy_today: lastRowDataUpdated.energy_today,
								// 			last_month: lastRowDataUpdated.energy_last_month,
								// 			lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
								// 			last_updated: dataEntity.time
								// 		};
								// 		db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// 	}
								// }
							}

							break;

						case 'model_inverter_ABB_PVS100':
							dataEntity = Object.assign({}, new ModelInverterABBPVS100Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 428
							});

							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 428,
										start_date: data.timestamp,
										status: 1
									});
								}

								// Get last row by device 
								var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
									id_device: getDeviceInfo.id,
									table_name: getDeviceInfo.table_name
								});
								if (lastRow) {
									dataEntity.activeEnergy = lastRow.activeEnergy;
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 428,
										status: 0
									});
								}
							}

							if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelInverterABBPVS100", dataEntity);
								// Update device 
								// if (rs) {
								// 	let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
								// 		id_device: getDeviceInfo.id,
								// 		table_name: getDeviceInfo.table_name
								// 	});
								// 	if (lastRowDataUpdated) {
								// 		let deviceUpdated = {
								// 			id: getDeviceInfo.id,
								// 			power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
								// 			energy_today: lastRowDataUpdated.energy_today,
								// 			last_month: lastRowDataUpdated.energy_last_month,
								// 			lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
								// 			last_updated: dataEntity.time
								// 		};
								// 		db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// 	}
								// }
							}

							break;
						case 'model_sensor_RT1':
							dataEntity = Object.assign({}, new ModelSensorRT1Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 432
							});

							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 432,
										start_date: data.timestamp,
										status: 1
									});
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 432,
										status: 0
									});
								}
							}

							rs = await db.insert("ModelReadings.insertModelSensorRT1", dataEntity);
							if (rs) {
								// Update device 
								// let deviceUpdated = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
								// db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
							}
							break;

						case 'model_techedge':
							dataEntity = Object.assign({}, new ModelTechedgeEntity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 435
							});
							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 435,
										start_date: data.timestamp,
										status: 1
									});
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 435,
										status: 0
									});
								}
							}

							rs = await db.insert("ModelReadings.insertModelTechedge", dataEntity);
							if (rs) {
								// Update device 
								// let deviceUpdated = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
								// db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
							}
							break;

						case 'model_sensor_IMT_TaRS485':
							dataEntity = Object.assign({}, new ModelSensorIMTTaRS485Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 434
							});
							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 434,
										start_date: data.timestamp,
										status: 1
									});
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 434,
										status: 0
									});
								}
							}

							rs = await db.insert("ModelReadings.insertModelSensorIMTTaRS485", dataEntity);
							if (rs) {
								// Update device 
								// let deviceUpdated = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
								// db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
							}
							break;
						case 'model_sensor_IMT_SiRS485':
							dataEntity = Object.assign({}, new ModelSensorIMTSiRS485Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 433
							});
							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 433,
										start_date: data.timestamp,
										status: 1
									});
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 433,
										status: 0
									});
								}
							}

							rs = await db.insert("ModelReadings.insertModelSensorIMTSiRS485", dataEntity);
							if (rs) {
								// Update device 
								// let deviceUpdated = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
								// db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
							}
							break;
						case 'model_logger_SMA_IM20':
							dataEntity = Object.assign({}, new ModelLoggerSMAIM20Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 431
							});
							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 431,
										start_date: data.timestamp,
										status: 1
									});
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 431,
										status: 0
									});
								}
							}

							rs = await db.insert("ModelReadings.insertModelLoggerSMAIM20", dataEntity);
							if (rs) {
								// Update device 
								// let deviceUpdated = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
								// db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
							}
							break;
						case 'model_inverter_Sungrow_SG110CX':
							break;
						case 'model_inverter_SMA_STP50':
							dataEntity = Object.assign({}, new ModelInverterSMASTP50Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 430
							});
							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 430,
										start_date: data.timestamp,
										status: 1
									});
								}

								// Get last row by device 
								var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
									id_device: getDeviceInfo.id,
									table_name: getDeviceInfo.table_name
								});
								if (lastRow) {
									dataEntity.activeEnergy = lastRow.activeEnergy;
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 430,
										status: 0
									});
								}
							}

							if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelInverterSMASTP50", dataEntity);
								// Update device 
								// if (rs) {
								// 	let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
								// 		id_device: getDeviceInfo.id,
								// 		table_name: getDeviceInfo.table_name
								// 	});
								// 	if (lastRowDataUpdated) {
								// 		let deviceUpdated = {
								// 			id: getDeviceInfo.id,
								// 			power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
								// 			energy_today: lastRowDataUpdated.energy_today,
								// 			last_month: lastRowDataUpdated.energy_last_month,
								// 			lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
								// 			last_updated: dataEntity.time
								// 		};
								// 		db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// 	}
								// }
							}

							break;
						case 'model_inverter_SMA_SHP75':
							dataEntity = Object.assign({}, new ModelInverterSMASHP75Entity(), dataPayload);
							dataEntity.time = data.timestamp;
							dataEntity.id_device = getDeviceInfo.id;
							// Check status DISCONNECTED
							checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								id_device: getDeviceInfo.id,
								id_error: 429
							});

							if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// Insert alert error system disconnected
								if (!checkExistAlerm) {
									rs = await db.insert("ModelReadings.insertAlert", {
										id_device: getDeviceInfo.id,
										id_error: 429,
										start_date: data.timestamp,
										status: 1
									});
								}

								// Get last row by device 
								var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
									id_device: getDeviceInfo.id,
									table_name: getDeviceInfo.table_name
								});
								if (lastRow) {
									dataEntity.activeEnergy = lastRow.activeEnergy;
								}
							} else {
								// close alarm 
								if (checkExistAlerm) {
									await db.delete("ModelReadings.closeAlarmDisconnected", {
										id: checkExistAlerm.id,
										id_device: getDeviceInfo.id,
										id_error: 429,
										status: 0
									});
								}
							}
							if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelInverterSMASHP75", dataEntity);
								// Update device 
								// if (rs) {
								// 	let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
								// 		id_device: getDeviceInfo.id,
								// 		table_name: getDeviceInfo.table_name
								// 	});
								// 	if (lastRowDataUpdated) {
								// 		let deviceUpdated = {
								// 			id: getDeviceInfo.id,
								// 			power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
								// 			energy_today: lastRowDataUpdated.energy_today,
								// 			last_month: lastRowDataUpdated.energy_last_month,
								// 			lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
								// 			last_updated: dataEntity.time
								// 		};
								// 		db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// 	}
								// }

							}

							break;
						case 'model_inverter_Growatt_GW80KTL3':
							break;
						case 'model_emeter_Janitza_UMG96S2':
							// dataEntity = Object.assign({}, new ModelEmeterJanitzaUMG96S2Entity(), dataPayload);
							// dataEntity.time = data.timestamp;
							// dataEntity.id_device = getDeviceInfo.id;
							// // Check status DISCONNECTED
							// checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
							// 	id_device: getDeviceInfo.id,
							// 	id_error: 427
							// });
							// if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
							// 	// Insert alert error system disconnected
							// 	if (!checkExistAlerm) {
							// 		rs = await db.insert("ModelReadings.insertAlert", {
							// 			id_device: getDeviceInfo.id,
							// 			id_error: 427,
							// 			start_date: data.timestamp,
							// 			status: 1
							// 		});
							// 	}
							// } else {
							// 	// close alarm 
							// 	if (checkExistAlerm) {
							// 		await db.delete("ModelReadings.closeAlarmDisconnected", {
							// 			id: checkExistAlerm.id,
							// 			id_device: getDeviceInfo.id,
							// 			id_error: 427,
							// 			status: 0
							// 		});
							// 	}
							// }

							// rs = await db.insert("ModelReadings.insertModelEmeterJanitzaUMG96S2", dataEntity);
							break;
					}

					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					conn.commit();
					callBack(true, rs);
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
export default ReadingAIService;
