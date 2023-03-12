'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseService2 = require('./BaseService');

var _BaseService3 = _interopRequireDefault(_BaseService2);

var _ModelSensorRT1Entity = require('../entities/ModelSensorRT1Entity');

var _ModelSensorRT1Entity2 = _interopRequireDefault(_ModelSensorRT1Entity);

var _ModelSensorIMTTaRS485Entity = require('../entities/ModelSensorIMTTaRS485Entity');

var _ModelSensorIMTTaRS485Entity2 = _interopRequireDefault(_ModelSensorIMTTaRS485Entity);

var _ModelSensorIMTSiRS485Entity = require('../entities/ModelSensorIMTSiRS485Entity');

var _ModelSensorIMTSiRS485Entity2 = _interopRequireDefault(_ModelSensorIMTSiRS485Entity);

var _ModelLoggerSMAIM20Entity = require('../entities/ModelLoggerSMAIM20Entity');

var _ModelLoggerSMAIM20Entity2 = _interopRequireDefault(_ModelLoggerSMAIM20Entity);

var _ModelInverterSungrowSG110CXEntity = require('../entities/ModelInverterSungrowSG110CXEntity');

var _ModelInverterSungrowSG110CXEntity2 = _interopRequireDefault(_ModelInverterSungrowSG110CXEntity);

var _ModelInverterSMASTP50Entity = require('../entities/ModelInverterSMASTP50Entity');

var _ModelInverterSMASTP50Entity2 = _interopRequireDefault(_ModelInverterSMASTP50Entity);

var _ModelInverterSMASHP75Entity = require('../entities/ModelInverterSMASHP75Entity');

var _ModelInverterSMASHP75Entity2 = _interopRequireDefault(_ModelInverterSMASHP75Entity);

var _ModelInverterGrowattGW80KTL3Entity = require('../entities/ModelInverterGrowattGW80KTL3Entity');

var _ModelInverterGrowattGW80KTL3Entity2 = _interopRequireDefault(_ModelInverterGrowattGW80KTL3Entity);

var _ModelInverterABBPVS100Entity = require('../entities/ModelInverterABBPVS100Entity');

var _ModelInverterABBPVS100Entity2 = _interopRequireDefault(_ModelInverterABBPVS100Entity);

var _ModelEmeterJanitzaUMG96S2Entity = require('../entities/ModelEmeterJanitzaUMG96S2Entity');

var _ModelEmeterJanitzaUMG96S2Entity2 = _interopRequireDefault(_ModelEmeterJanitzaUMG96S2Entity);

var _ModelTechedgeEntity = require('../entities/ModelTechedgeEntity');

var _ModelTechedgeEntity2 = _interopRequireDefault(_ModelTechedgeEntity);

var _ModelInverterSMASTP110Entity = require('../entities/ModelInverterSMASTP110Entity');

var _ModelInverterSMASTP110Entity2 = _interopRequireDefault(_ModelInverterSMASTP110Entity);

var _ModelEmeterVinasinoVSE3T5Entity = require('../entities/ModelEmeterVinasinoVSE3T5Entity');

var _ModelEmeterVinasinoVSE3T5Entity2 = _interopRequireDefault(_ModelEmeterVinasinoVSE3T5Entity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReadingAIService = function (_BaseService) {
	_inherits(ReadingAIService, _BaseService);

	function ReadingAIService() {
		_classCallCheck(this, ReadingAIService);

		return _possibleConstructorReturn(this, (ReadingAIService.__proto__ || Object.getPrototypeOf(ReadingAIService)).call(this));
	}

	/**
  * @description Insert data
  * @author Long.Pham
  * @since 10/09/2021
  * @param {Object model} data
  */


	_createClass(ReadingAIService, [{
		key: 'insertReadingAI',
		value: function insertReadingAI(data, callBack) {
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

						var dataEntity = {},
						    rs = {},
						    checkExistAlerm = null;
						switch (getDeviceInfo.table_name) {

							case 'model_emeter_Vinasino_VSE3T5':
								dataEntity = Object.assign({}, new _ModelEmeterVinasinoVSE3T5Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelInverterSMASTP110Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelInverterABBPVS100Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelSensorRT1Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelTechedgeEntity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelSensorIMTTaRS485Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelSensorIMTSiRS485Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelLoggerSMAIM20Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelInverterSMASTP50Entity2.default(), dataPayload);
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
								dataEntity = Object.assign({}, new _ModelInverterSMASHP75Entity2.default(), dataPayload);
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
	}]);

	return ReadingAIService;
}(_BaseService3.default);

exports.default = ReadingAIService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9SZWFkaW5nQUlTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIlJlYWRpbmdBSVNlcnZpY2UiLCJkYXRhIiwiY2FsbEJhY2siLCJkYiIsIm15U3FMREIiLCJiZWdpblRyYW5zYWN0aW9uIiwiY29ubiIsImdldERldmljZUluZm8iLCJxdWVyeUZvck9iamVjdCIsIkxpYnMiLCJpc09iamVjdEVtcHR5IiwiZGF0YVBheWxvYWQiLCJpc0JsYW5rIiwidGFibGVfbmFtZSIsImlkIiwicm9sbGJhY2siLCJkYXRhRW50aXR5IiwicnMiLCJjaGVja0V4aXN0QWxlcm0iLCJPYmplY3QiLCJhc3NpZ24iLCJNb2RlbEVtZXRlclZpbmFzaW5vVlNFM1Q1RW50aXR5IiwidGltZSIsInRpbWVzdGFtcCIsImlkX2RldmljZSIsImlkX2Vycm9yIiwic3RhdHVzIiwiaW5zZXJ0Iiwic3RhcnRfZGF0ZSIsImxhc3RSb3ciLCJhY3RpdmVFbmVyZ3kiLCJkZWxldGUiLCJNb2RlbEludmVydGVyU01BU1RQMTEwRW50aXR5IiwiTW9kZWxJbnZlcnRlckFCQlBWUzEwMEVudGl0eSIsIk1vZGVsU2Vuc29yUlQxRW50aXR5IiwiTW9kZWxUZWNoZWRnZUVudGl0eSIsIk1vZGVsU2Vuc29ySU1UVGFSUzQ4NUVudGl0eSIsIk1vZGVsU2Vuc29ySU1UU2lSUzQ4NUVudGl0eSIsIk1vZGVsTG9nZ2VyU01BSU0yMEVudGl0eSIsIk1vZGVsSW52ZXJ0ZXJTTUFTVFA1MEVudGl0eSIsIk1vZGVsSW52ZXJ0ZXJTTUFTSFA3NUVudGl0eSIsImNvbW1pdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJlIiwiQmFzZVNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7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QUF1RFgsVUFBdkQsQ0FBWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVEO0FBQ0QsWUFBSyxpQ0FBTDtBQUNDO0FBQ0QsWUFBSyw4QkFBTDtBQUNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQXppQkY7O0FBNGlCQSxVQUFJLENBQUNDLEVBQUwsRUFBUztBQUNSWCxZQUFLUyxRQUFMO0FBQ0FiLGdCQUFTLEtBQVQsRUFBZ0IsRUFBaEI7QUFDQTtBQUNBOztBQUVESSxXQUFLbUMsTUFBTDtBQUNBdkMsZUFBUyxJQUFULEVBQWVlLEVBQWY7QUFDQSxNQTlqQkQsQ0E4akJFLE9BQU95QixHQUFQLEVBQVk7QUFDYkMsY0FBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJGLEdBQTNCO0FBQ0FwQyxXQUFLUyxRQUFMO0FBQ0FiLGVBQVMsS0FBVCxFQUFnQndDLEdBQWhCO0FBQ0E7QUFDRCxLQXBrQkQ7QUFxa0JBLElBdmtCRCxDQXVrQkUsT0FBT0csQ0FBUCxFQUFVO0FBQ1hGLFlBQVFDLEdBQVIsQ0FBWSxPQUFaLEVBQXFCQyxDQUFyQjtBQUNBM0MsYUFBUyxLQUFULEVBQWdCMkMsQ0FBaEI7QUFDQTtBQUNEOzs7O0VBdmxCNkJDLHFCOztrQkF5bEJoQjlDLGdCIiwiZmlsZSI6IlJlYWRpbmdBSVNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNlcnZpY2UgZnJvbSAnLi9CYXNlU2VydmljZSc7XHJcbmltcG9ydCBNb2RlbFNlbnNvclJUMUVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbFNlbnNvclJUMUVudGl0eSc7XHJcbmltcG9ydCBNb2RlbFNlbnNvcklNVFRhUlM0ODVFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxTZW5zb3JJTVRUYVJTNDg1RW50aXR5JztcclxuaW1wb3J0IE1vZGVsU2Vuc29ySU1UU2lSUzQ4NUVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbFNlbnNvcklNVFNpUlM0ODVFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxMb2dnZXJTTUFJTTIwRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsTG9nZ2VyU01BSU0yMEVudGl0eSc7XHJcbmltcG9ydCBNb2RlbEludmVydGVyU3VuZ3Jvd1NHMTEwQ1hFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxJbnZlcnRlclN1bmdyb3dTRzExMENYRW50aXR5JztcclxuaW1wb3J0IE1vZGVsSW52ZXJ0ZXJTTUFTVFA1MEVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbEludmVydGVyU01BU1RQNTBFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxJbnZlcnRlclNNQVNIUDc1RW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsSW52ZXJ0ZXJTTUFTSFA3NUVudGl0eSc7XHJcbmltcG9ydCBNb2RlbEludmVydGVyR3Jvd2F0dEdXODBLVEwzRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsSW52ZXJ0ZXJHcm93YXR0R1c4MEtUTDNFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxJbnZlcnRlckFCQlBWUzEwMEVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbEludmVydGVyQUJCUFZTMTAwRW50aXR5JztcclxuaW1wb3J0IE1vZGVsRW1ldGVySmFuaXR6YVVNRzk2UzJFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxFbWV0ZXJKYW5pdHphVU1HOTZTMkVudGl0eSc7XHJcbmltcG9ydCBNb2RlbFRlY2hlZGdlRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsVGVjaGVkZ2VFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxJbnZlcnRlclNNQVNUUDExMEVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbEludmVydGVyU01BU1RQMTEwRW50aXR5JztcclxuaW1wb3J0IE1vZGVsRW1ldGVyVmluYXNpbm9WU0UzVDVFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxFbWV0ZXJWaW5hc2lub1ZTRTNUNUVudGl0eSc7XHJcblxyXG5jbGFzcyBSZWFkaW5nQUlTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBJbnNlcnQgZGF0YVxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDEwLzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdCBtb2RlbH0gZGF0YVxyXG5cdCAqL1xyXG5cdCBpbnNlcnRSZWFkaW5nQUkoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cclxuXHRcdFx0XHRcdHZhciBnZXREZXZpY2VJbmZvID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldERldmljZUluZm9cIiwgZGF0YSk7XHJcblx0XHRcdFx0XHRpZiAoTGlicy5pc09iamVjdEVtcHR5KGRhdGFQYXlsb2FkKSB8fCAhZ2V0RGV2aWNlSW5mbyB8fCBMaWJzLmlzT2JqZWN0RW1wdHkoZ2V0RGV2aWNlSW5mbykgfHwgTGlicy5pc0JsYW5rKGdldERldmljZUluZm8udGFibGVfbmFtZSkgfHwgTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uaWQpKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGxldCBkYXRhRW50aXR5ID0ge30sIHJzID0ge30sIGNoZWNrRXhpc3RBbGVybSA9IG51bGw7XHJcblx0XHRcdFx0XHRzd2l0Y2ggKGdldERldmljZUluZm8udGFibGVfbmFtZSkge1xyXG5cclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfZW1ldGVyX1ZpbmFzaW5vX1ZTRTNUNSc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbEVtZXRlclZpbmFzaW5vVlNFM1Q1RW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDYyNlxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNjI2LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBHZXQgbGFzdCByb3cgYnkgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGxhc3RSb3cgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGFzdFJvd0RhdGFcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAobGFzdFJvdykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA9IGxhc3RSb3cuYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNjI2LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5KSAmJiBkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbEVtZXRlclZpbmFzaW5vVlNFM1Q1XCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRsZXQgbGFzdFJvd0RhdGFVcGRhdGVkID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldERhdGFVcGRhdGVEZXZpY2VcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdGlmIChsYXN0Um93RGF0YVVwZGF0ZWQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRsZXQgZGV2aWNlVXBkYXRlZCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0cG93ZXJfbm93OiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZW5lcmd5X3RvZGF5OiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X3RvZGF5LFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGFzdF9tb250aDogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV9sYXN0X21vbnRoLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGlmZXRpbWU6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NUUDExMCc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbEludmVydGVyU01BU1RQMTEwRW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzN1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDM3LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBHZXQgbGFzdCByb3cgYnkgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGxhc3RSb3cgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGFzdFJvd0RhdGFcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAobGFzdFJvdykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA9IGxhc3RSb3cuYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDM3LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5KSAmJiBkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbEludmVydGVyU01BU1RQMTEwXCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRsZXQgbGFzdFJvd0RhdGFVcGRhdGVkID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldERhdGFVcGRhdGVEZXZpY2VcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdGlmIChsYXN0Um93RGF0YVVwZGF0ZWQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRsZXQgZGV2aWNlVXBkYXRlZCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0cG93ZXJfbm93OiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZW5lcmd5X3RvZGF5OiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X3RvZGF5LFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGFzdF9tb250aDogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV9sYXN0X21vbnRoLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGlmZXRpbWU6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9BQkJfUFZTMTAwJzpcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IE1vZGVsSW52ZXJ0ZXJBQkJQVlMxMDBFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDI4XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MjgsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIEdldCBsYXN0IHJvdyBieSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgbGFzdFJvdyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMYXN0Um93RGF0YVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZ2V0RGV2aWNlSW5mby50YWJsZV9uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChsYXN0Um93KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID0gbGFzdFJvdy5hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MjgsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kpICYmIGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydE1vZGVsSW52ZXJ0ZXJBQkJQVlMxMDBcIiwgZGF0YUVudGl0eSk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBVcGRhdGUgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gaWYgKHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdGxldCBsYXN0Um93RGF0YVVwZGF0ZWQgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RGF0YVVwZGF0ZURldmljZVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0aWYgKGxhc3RSb3dEYXRhVXBkYXRlZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdGxldCBkZXZpY2VVcGRhdGVkID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWQ6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRwb3dlcl9ub3c6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVQb3dlciA/IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRlbmVyZ3lfdG9kYXk6IGxhc3RSb3dEYXRhVXBkYXRlZC5lbmVyZ3lfdG9kYXksXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRsYXN0X21vbnRoOiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X2xhc3RfbW9udGgsXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRsaWZldGltZTogbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZUVuZXJneSA/IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGFzdF91cGRhdGVkOiBkYXRhRW50aXR5LnRpbWVcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdGRiLnVwZGF0ZShcIk1vZGVsUmVhZGluZ3MudXBkYXRlZERldmljZVBsYW50XCIsIGRldmljZVVwZGF0ZWQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfc2Vuc29yX1JUMSc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbFNlbnNvclJUMUVudGl0eSgpLCBkYXRhUGF5bG9hZCk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS50aW1lID0gZGF0YS50aW1lc3RhbXA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5pZF9kZXZpY2UgPSBnZXREZXZpY2VJbmZvLmlkO1xyXG5cdFx0XHRcdFx0XHRcdC8vIENoZWNrIHN0YXR1cyBESVNDT05ORUNURURcclxuXHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzJcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5zdGF0dXMpICYmIGRhdGEuc3RhdHVzID09ICdESVNDT05ORUNURUQnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnQgZXJyb3Igc3lzdGVtIGRpc2Nvbm5lY3RlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzMixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydE1vZGVsU2Vuc29yUlQxXCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGxldCBkZXZpY2VVcGRhdGVkID0geyBpZDogZ2V0RGV2aWNlSW5mby5pZCwgcG93ZXJfbm93OiBudWxsLCBlbmVyZ3lfdG9kYXk6IG51bGwsIGxhc3RfbW9udGg6IG51bGwsIGxpZmV0aW1lOiBudWxsLCBsYXN0X3VwZGF0ZWQ6IGRhdGFFbnRpdHkudGltZSB9O1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZGIudXBkYXRlKFwiTW9kZWxSZWFkaW5ncy51cGRhdGVkRGV2aWNlUGxhbnRcIiwgZGV2aWNlVXBkYXRlZCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfdGVjaGVkZ2UnOlxyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgTW9kZWxUZWNoZWRnZUVudGl0eSgpLCBkYXRhUGF5bG9hZCk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS50aW1lID0gZGF0YS50aW1lc3RhbXA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5pZF9kZXZpY2UgPSBnZXREZXZpY2VJbmZvLmlkO1xyXG5cdFx0XHRcdFx0XHRcdC8vIENoZWNrIHN0YXR1cyBESVNDT05ORUNURURcclxuXHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzVcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDM1LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2xvc2UgYWxhcm0gXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmRlbGV0ZShcIk1vZGVsUmVhZGluZ3MuY2xvc2VBbGFybURpc2Nvbm5lY3RlZFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzNSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDBcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxUZWNoZWRnZVwiLCBkYXRhRW50aXR5KTtcclxuXHRcdFx0XHRcdFx0XHRpZiAocnMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBsZXQgZGV2aWNlVXBkYXRlZCA9IHsgaWQ6IGdldERldmljZUluZm8uaWQsIHBvd2VyX25vdzogbnVsbCwgZW5lcmd5X3RvZGF5OiBudWxsLCBsYXN0X21vbnRoOiBudWxsLCBsaWZldGltZTogbnVsbCwgbGFzdF91cGRhdGVkOiBkYXRhRW50aXR5LnRpbWUgfTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGRiLnVwZGF0ZShcIk1vZGVsUmVhZGluZ3MudXBkYXRlZERldmljZVBsYW50XCIsIGRldmljZVVwZGF0ZWQpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX3NlbnNvcl9JTVRfVGFSUzQ4NSc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbFNlbnNvcklNVFRhUlM0ODVFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDM0XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5zdGF0dXMpICYmIGRhdGEuc3RhdHVzID09ICdESVNDT05ORUNURUQnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnQgZXJyb3Igc3lzdGVtIGRpc2Nvbm5lY3RlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzNCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydE1vZGVsU2Vuc29ySU1UVGFSUzQ4NVwiLCBkYXRhRW50aXR5KTtcclxuXHRcdFx0XHRcdFx0XHRpZiAocnMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBsZXQgZGV2aWNlVXBkYXRlZCA9IHsgaWQ6IGdldERldmljZUluZm8uaWQsIHBvd2VyX25vdzogbnVsbCwgZW5lcmd5X3RvZGF5OiBudWxsLCBsYXN0X21vbnRoOiBudWxsLCBsaWZldGltZTogbnVsbCwgbGFzdF91cGRhdGVkOiBkYXRhRW50aXR5LnRpbWUgfTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGRiLnVwZGF0ZShcIk1vZGVsUmVhZGluZ3MudXBkYXRlZERldmljZVBsYW50XCIsIGRldmljZVVwZGF0ZWQpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfc2Vuc29yX0lNVF9TaVJTNDg1JzpcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IE1vZGVsU2Vuc29ySU1UU2lSUzQ4NUVudGl0eSgpLCBkYXRhUGF5bG9hZCk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS50aW1lID0gZGF0YS50aW1lc3RhbXA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5pZF9kZXZpY2UgPSBnZXREZXZpY2VJbmZvLmlkO1xyXG5cdFx0XHRcdFx0XHRcdC8vIENoZWNrIHN0YXR1cyBESVNDT05ORUNURURcclxuXHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzNcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDMzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2xvc2UgYWxhcm0gXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmRlbGV0ZShcIk1vZGVsUmVhZGluZ3MuY2xvc2VBbGFybURpc2Nvbm5lY3RlZFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzMyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDBcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxTZW5zb3JJTVRTaVJTNDg1XCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGxldCBkZXZpY2VVcGRhdGVkID0geyBpZDogZ2V0RGV2aWNlSW5mby5pZCwgcG93ZXJfbm93OiBudWxsLCBlbmVyZ3lfdG9kYXk6IG51bGwsIGxhc3RfbW9udGg6IG51bGwsIGxpZmV0aW1lOiBudWxsLCBsYXN0X3VwZGF0ZWQ6IGRhdGFFbnRpdHkudGltZSB9O1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZGIudXBkYXRlKFwiTW9kZWxSZWFkaW5ncy51cGRhdGVkRGV2aWNlUGxhbnRcIiwgZGV2aWNlVXBkYXRlZCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9sb2dnZXJfU01BX0lNMjAnOlxyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgTW9kZWxMb2dnZXJTTUFJTTIwRW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzMVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDMxLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbExvZ2dlclNNQUlNMjBcIiwgZGF0YUVudGl0eSk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBVcGRhdGUgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gbGV0IGRldmljZVVwZGF0ZWQgPSB7IGlkOiBnZXREZXZpY2VJbmZvLmlkLCBwb3dlcl9ub3c6IG51bGwsIGVuZXJneV90b2RheTogbnVsbCwgbGFzdF9tb250aDogbnVsbCwgbGlmZXRpbWU6IG51bGwsIGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lIH07XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1N1bmdyb3dfU0cxMTBDWCc6XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TVFA1MCc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbEludmVydGVyU01BU1RQNTBFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDMwXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5zdGF0dXMpICYmIGRhdGEuc3RhdHVzID09ICdESVNDT05ORUNURUQnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnQgZXJyb3Igc3lzdGVtIGRpc2Nvbm5lY3RlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gR2V0IGxhc3Qgcm93IGJ5IGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBsYXN0Um93ID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldExhc3RSb3dEYXRhXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGxhc3RSb3cpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPSBsYXN0Um93LmFjdGl2ZUVuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2xvc2UgYWxhcm0gXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmRlbGV0ZShcIk1vZGVsUmVhZGluZ3MuY2xvc2VBbGFybURpc2Nvbm5lY3RlZFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDBcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSkgJiYgZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxJbnZlcnRlclNNQVNUUDUwXCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRsZXQgbGFzdFJvd0RhdGFVcGRhdGVkID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldERhdGFVcGRhdGVEZXZpY2VcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdGlmIChsYXN0Um93RGF0YVVwZGF0ZWQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRsZXQgZGV2aWNlVXBkYXRlZCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0cG93ZXJfbm93OiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZW5lcmd5X3RvZGF5OiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X3RvZGF5LFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGFzdF9tb250aDogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV9sYXN0X21vbnRoLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGlmZXRpbWU6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TSFA3NSc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbEludmVydGVyU01BU0hQNzVFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDI5XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MjksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIEdldCBsYXN0IHJvdyBieSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgbGFzdFJvdyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMYXN0Um93RGF0YVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZ2V0RGV2aWNlSW5mby50YWJsZV9uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChsYXN0Um93KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID0gbGFzdFJvdy5hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MjksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSkgJiYgZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxJbnZlcnRlclNNQVNIUDc1XCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRsZXQgbGFzdFJvd0RhdGFVcGRhdGVkID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldERhdGFVcGRhdGVEZXZpY2VcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdGlmIChsYXN0Um93RGF0YVVwZGF0ZWQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRsZXQgZGV2aWNlVXBkYXRlZCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0cG93ZXJfbm93OiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZW5lcmd5X3RvZGF5OiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X3RvZGF5LFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGFzdF9tb250aDogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV9sYXN0X21vbnRoLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGlmZXRpbWU6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9Hcm93YXR0X0dXODBLVEwzJzpcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfZW1ldGVyX0phbml0emFfVU1HOTZTMic6XHJcblx0XHRcdFx0XHRcdFx0Ly8gZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbEVtZXRlckphbml0emFVTUc5NlMyRW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHQvLyBkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHQvLyBkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0Ly8gLy8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdC8vIGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0aWRfZXJyb3I6IDQyN1xyXG5cdFx0XHRcdFx0XHRcdC8vIH0pO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkX2Vycm9yOiA0MjcsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHRcdC8vIH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRpZF9lcnJvcjogNDI3LFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbEVtZXRlckphbml0emFVTUc5NlMyXCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHJzKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yJywgZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgUmVhZGluZ0FJU2VydmljZTtcclxuIl19