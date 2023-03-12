'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseService2 = require('./BaseService');

var _BaseService3 = _interopRequireDefault(_BaseService2);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainPlantService = function (_BaseService) {
	_inherits(MainPlantService, _BaseService);

	function MainPlantService() {
		_classCallCheck(this, MainPlantService);

		return _possibleConstructorReturn(this, (MainPlantService.__proto__ || Object.getPrototypeOf(MainPlantService)).call(this));
	}

	/**
 * get detail project page plant
 * @param {*} data 
 * @param {*} callBack 
 */

	_createClass(MainPlantService, [{
		key: 'getDetail',
		value: function getDetail(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var totalInverterOn = 0,
						    totalInverter = 0;
						var rs = await db.queryForObject("MainPlant.getDetail", param);
						var getTotalInverter = await db.queryForObject("MainPlant.getTotalInverter", param);
						if (getTotalInverter) {
							totalInverter = getTotalInverter.totalInverter;
						}

						var deviceGroup = await db.queryForList("MainPlant.getGroupDeviceByProjectId", { id_project: rs.id });
						var irradiance = [],
						    ambient_emperature = [],
						    energy_today = 0,
						    lifetime = 0,
						    power_now = 0,
						    dc_power = 0,
						    consumption = 0,
						    using_meter_consumption = 0;
						if (Libs.isArrayData(deviceGroup)) {
							for (var j = 0; j < deviceGroup.length; j++) {
								switch (deviceGroup[j].table_name) {
									case 'model_inverter_SMA_STP110':
									case 'model_inverter_SMA_STP50':
									case 'model_inverter_SMA_SHP75':
									case 'model_inverter_ABB_PVS100':
										var objDevice = await db.queryForObject("MainPlant.getDataDeviceEnergy", {
											id_project: rs.id,
											id_device_group: deviceGroup[j].id,
											table_name: deviceGroup[j].table_name
										});
										if (objDevice) {
											totalInverterOn = totalInverterOn + objDevice.totalInverterOn;

											energy_today = energy_today + objDevice.today_activeEnergy;
											lifetime = lifetime + objDevice.lifetime;
											power_now = power_now + objDevice.power_now;
											dc_power = dc_power + objDevice.dc_power;
										}

										break;
									case 'model_inverter_Sungrow_SG110CX':
										break;
									case 'model_inverter_Growatt_GW80KTL3':
										break;
									case 'model_sensor_IMT_SiRS485':
										var objDeviceIrradiance = await db.queryForList("MainPlant.getDataDeviceIrradiance", {
											id_project: rs.id,
											id_device_group: deviceGroup[j].id,
											table_name: deviceGroup[j].table_name
										});
										if (Libs.isArrayData(objDeviceIrradiance)) {
											irradiance = objDeviceIrradiance;
										}
										break;
									case 'model_sensor_IMT_TaRS485':
										var objDeviceAmbientEmperature = await db.queryForList("MainPlant.getDataDeviceAmbientEmperature", {
											id_project: rs.id,
											id_device_group: deviceGroup[j].id,
											table_name: deviceGroup[j].table_name
										});
										if (Libs.isArrayData(objDeviceAmbientEmperature)) {
											ambient_emperature = objDeviceAmbientEmperature;
										}
										break;
									case 'model_emeter_Vinasino_VSE3T5':
										var objConsumption = await db.queryForObject("MainPlant.getmeterConsumption", {
											id_project: rs.id,
											id_device_group: deviceGroup[j].id,
											table_name: deviceGroup[j].table_name
										});

										if (objConsumption) {
											using_meter_consumption = 1;
											consumption = (0, _moment2.default)().format('H') < 19 ? objConsumption.activePower : 0;
										}
										break;
								}
							}
						}
						rs.totalInverterOn = totalInverterOn;
						rs.totalInverter = totalInverter;
						rs.energy_today = energy_today;
						rs.lifetime = lifetime;
						rs.revenue = lifetime * rs.config_revenue;
						rs.irradiance = irradiance;
						rs.today_revenue = energy_today / 1000 * rs.config_revenue;
						rs.total_revenue = lifetime / 1000 * rs.config_revenue;
						rs.power_now = power_now > 0 ? power_now / 1000 : 0;
						rs.irradiance = irradiance;
						rs.ambient_emperature = ambient_emperature;
						rs.dc_power = dc_power > 0 ? dc_power / 1000 : 0;
						rs.consumption = consumption;
						rs.using_meter_consumption = using_meter_consumption;
						conn.commit();
						callBack(false, rs);
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
  * get detail project page plant
  * @param {*} data 
  * @param {*} callBack 
  */

	}, {
		key: 'getChartData',
		value: function getChartData(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var dataEnergyToday = [];
						var getGroupInverter = await db.queryForList("MainPlant.getGroupDeviceInverter", param);

						if (!getGroupInverter) {
							conn.rollback();
							callBack(false, {});
							return;
						}
						var groupInverter = [];
						if (getGroupInverter.length > 0) {
							for (var i = 0, _len = getGroupInverter.length; i < _len; i++) {
								groupInverter.push({
									hash_id: param.hash_id,
									id_device_group: getGroupInverter[i].id_device_group,
									start_date: Libs.convertAllFormatDate(param.start_date),
									end_date: Libs.convertAllFormatDate(param.end_date),
									table_name: getGroupInverter[i].table_name
								});
							}
						}

						switch (param.filterBy) {
							case 'today':
								var getListDeviceInverter = [];
								// Check using emeter 
								// var getListDeviceEmeter = await db.queryForList("Plant.getListDeviceEmeter", param);
								// if(getListDeviceEmeter.length > 0){
								// 	getListDeviceInverter = getListDeviceEmeter;
								// } else {
								// 	getListDeviceInverter = await db.queryForList("Plant.getListDeviceInverter", param);
								// }
								getListDeviceInverter = await db.queryForList("MainPlant.getListDeviceInverter", param);
								// 5 minutes
								if (param.data_send_time == 1) {
									// Lấy danh sách device 
									var dataEnergyMerge = [];
									// genarete data 5 munites
									var curDate = Libs.convertAllFormatDate(param.end_date);
									var curDateFormat = (0, _moment2.default)(curDate).format('YYYY-MM-DD 05:00');
									for (var t = 0; t < 168; t++) {
										dataEnergyMerge.push({
											time_format: (0, _moment2.default)(curDateFormat).add(5 * t, 'minutes').format('YYYY-MM-DD HH:mm'),
											time_full: (0, _moment2.default)(curDateFormat).add(5 * t, 'minutes').format('DD/MM/YYYY HH:mm'),
											activePower: 0,
											activeEnergy: 0,
											group_day: ''
										});
									}

									if (getListDeviceInverter.length > 0) {
										for (var v = 0, len = getListDeviceInverter.length; v < len; v++) {
											getListDeviceInverter[v].start_date = Libs.convertAllFormatDate(param.start_date);
											getListDeviceInverter[v].end_date = Libs.convertAllFormatDate(param.end_date);
											var dataEnergyByDevice = await db.queryForList("MainPlant.dataEnergyByDevice", getListDeviceInverter[v]);

											if (dataEnergyByDevice.length > 0) {
												for (var k = 0, l = dataEnergyByDevice.length; k < l; k++) {
													if (k === 0) {
														dataEnergyByDevice[k].activeEnergy = 0;
													} else {
														var subEnergy = 0;
														if (dataEnergyByDevice[k].today_activeEnergy != 0 && dataEnergyByDevice[k - 1].today_activeEnergy != 0) {
															subEnergy = (dataEnergyByDevice[k].today_activeEnergy - dataEnergyByDevice[k - 1].today_activeEnergy) / 1000;
														}

														dataEnergyByDevice[k].activeEnergy = Libs.roundNumber(subEnergy, 1);
													}
												}
												dataEnergyMerge = Object.values([].concat(_toConsumableArray(dataEnergyMerge), _toConsumableArray(dataEnergyByDevice)).reduce(function (acc, _ref) {
													var time_format = _ref.time_format,
													    time_full = _ref.time_full,
													    activePower = _ref.activePower,
													    activeEnergy = _ref.activeEnergy,
													    group_day = _ref.group_day;

													acc[time_format] = {
														time_format: time_format,
														time_full: time_full,
														activePower: Libs.roundNumber((acc[time_format] ? acc[time_format].activePower : 0) + activePower, 1),
														activeEnergy: Libs.roundNumber((acc[time_format] ? acc[time_format].activeEnergy : 0) + activeEnergy, 1),
														group_day: group_day
													};
													return acc;
												}, {}));
											}
										}
									}
									dataEnergyToday = dataEnergyMerge;
								}

								// 15 minutes
								if (param.data_send_time == 2) {
									// genarete data 15 munites
									var _curDate = Libs.convertAllFormatDate(param.end_date);
									var curDateFormat15 = (0, _moment2.default)(_curDate).format('YYYY-MM-DD 05:00');
									var dataEnergyMerge15 = [];
									for (var _t = 0; _t <= 56; _t++) {
										dataEnergyMerge15.push({
											time_format: (0, _moment2.default)(curDateFormat15).add(15 * _t, 'minutes').format('YYYY-MM-DD HH:mm'),
											time_full: (0, _moment2.default)(curDateFormat15).add(15 * _t, 'minutes').format('DD/MM/YYYY HH:mm'),
											activePower: 0,
											activeEnergy: 0,
											group_day: ''
										});
									}

									if (getListDeviceInverter.length > 0) {
										for (var v = 0, len = getListDeviceInverter.length; v < len; v++) {
											getListDeviceInverter[v].start_date = Libs.convertAllFormatDate(param.start_date);
											getListDeviceInverter[v].end_date = Libs.convertAllFormatDate(param.end_date);
											var dataEnergyToday15 = await db.queryForList("MainPlant.dataEnergy15MinutesByDevice", getListDeviceInverter[v]);

											if (dataEnergyToday15.length > 0) {
												for (var _k = 0, _l = dataEnergyToday15.length; _k < _l; _k++) {
													if (_k === 0) {
														dataEnergyToday15[_k].activeEnergy = 0;
													} else {
														var subEnergy = 0;
														if (dataEnergyToday15[_k].today_activeEnergy > 0 && dataEnergyToday15[_k - 1].today_activeEnergy > 0) {
															subEnergy = (dataEnergyToday15[_k].today_activeEnergy - dataEnergyToday15[_k - 1].today_activeEnergy) / 1000;
														}

														dataEnergyToday15[_k].activeEnergy = Libs.roundNumber(subEnergy, 1);
													}
												}
												dataEnergyMerge15 = Object.values([].concat(_toConsumableArray(dataEnergyMerge15), _toConsumableArray(dataEnergyToday15)).reduce(function (acc, _ref2) {
													var time_format = _ref2.time_format,
													    time_full = _ref2.time_full,
													    activePower = _ref2.activePower,
													    activeEnergy = _ref2.activeEnergy,
													    group_day = _ref2.group_day;

													acc[time_format] = {
														time_format: time_format,
														time_full: time_full,
														activePower: Libs.roundNumber((acc[time_format] ? acc[time_format].activePower : 0) + activePower, 1),
														activeEnergy: Libs.roundNumber((acc[time_format] ? acc[time_format].activeEnergy : 0) + activeEnergy, 1),
														group_day: group_day
													};
													return acc;
												}, {}));
											}
										}
									}

									// var dataEnergyToday15 = await db.queryForList("MainPlant.getDataEnergyFifteenMinutes", { groupInverter });
									// // console.log(dataEnergyToday15);

									// if (dataEnergyToday15.length > 0) {
									// 	for (let i = 0, len = dataEnergyToday15.length; i < len; i++) {
									// 		if (i === 0) {
									// 			dataEnergyToday15[i].activeEnergy = 0;
									// 		} else {
									// 			let subEnergy = 0;
									// 			if (dataEnergyToday15[i].today_activeEnergy != 0 && dataEnergyToday15[i - 1].today_activeEnergy != 0) {
									// 				subEnergy = Libs.roundNumber((dataEnergyToday15[i].today_activeEnergy - dataEnergyToday15[i - 1].today_activeEnergy), 1);
									// 				console.log(dataEnergyToday15[i].time_format, ": ", dataEnergyToday15[i].today_activeEnergy, " -: ", dataEnergyToday15[i-1].time_format, " ", dataEnergyToday15[i - 1].today_activeEnergy);
									// 			}
									// 			dataEnergyToday15[i].activeEnergy = Libs.roundNumber((subEnergy > 5000 ? 0 : subEnergy), 1);
									// 		}
									// 	}
									// }

									// dataEnergyMerge15 = Object.values([...dataEnergyMerge15, ...dataEnergyToday15].reduce((acc, { time_format, time_full, activePower, activeEnergy, group_day }) => {
									// 	acc[time_format] = {
									// 		time_format,
									// 		time_full,
									// 		activePower: Libs.roundNumber(((acc[time_format] ? acc[time_format].activePower : 0) + activePower), 1),
									// 		activeEnergy: Libs.roundNumber(((acc[time_format] ? acc[time_format].activeEnergy : 0) + activeEnergy), 1),
									// 		group_day
									// 	};
									// 	return acc;
									// }, {}));

									dataEnergyToday = dataEnergyMerge15;
								}

								// 1 hour
								if (param.data_send_time == 3) {
									// genarete data 1 hour
									var curDate1h = Libs.convertAllFormatDate(param.end_date);
									var curDateFormat1h = (0, _moment2.default)(curDate1h).format('YYYY-MM-DD 05:00');
									var dataEnergyMerge1h = [];
									for (var _t2 = 0; _t2 <= 14; _t2++) {
										dataEnergyMerge1h.push({
											time_format: (0, _moment2.default)(curDateFormat1h).add(1 * _t2, 'hours').format('YYYY-MM-DD HH'),
											time_full: (0, _moment2.default)(curDateFormat1h).add(1 * _t2, 'hours').format('DD/MM/YYYY HH:mm'),
											activePower: 0,
											activeEnergy: 0,
											group_day: ''
										});
									}

									var dataEnergyToday1h = await db.queryForList("MainPlant.getDataEnergyHour", { groupInverter: groupInverter });
									dataEnergyMerge1h = Object.values([].concat(_toConsumableArray(dataEnergyMerge1h), _toConsumableArray(dataEnergyToday1h)).reduce(function (acc, _ref3) {
										var time_format = _ref3.time_format,
										    time_full = _ref3.time_full,
										    activePower = _ref3.activePower,
										    activeEnergy = _ref3.activeEnergy,
										    group_day = _ref3.group_day;

										acc[time_format] = {
											time_format: time_format,
											time_full: time_full,
											activePower: Libs.roundNumber((acc[time_format] ? acc[time_format].activePower : 0) + activePower, 1),
											activeEnergy: Libs.roundNumber((acc[time_format] ? acc[time_format].activeEnergy : 0) + activeEnergy, 1),
											group_day: group_day
										};
										return acc;
									}, {}));

									dataEnergyToday = dataEnergyMerge1h;
								}

								break;
							case '3_day':
								// 5 minutes
								if (param.data_send_time == 1) {
									var startDate5 = '',
									    endDate5 = '';
									for (var _i = 0; _i < 3; _i++) {
										var _dataEnergyToday;

										if (_i === 0) {
											startDate5 = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
											endDate5 = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD 19:00');
											for (var j = 0, _len2 = groupInverter.length; j < _len2; j++) {
												groupInverter[j].end_date = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
											}
										} else {
											startDate5 = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.start_date), _i)).format('YYYY-MM-DD HH:mm');
											endDate5 = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.start_date), _i)).format('YYYY-MM-DD 19:00');
											for (var _j = 0, _len3 = groupInverter.length; _j < _len3; _j++) {
												groupInverter[_j].start_date = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.start_date), _i)).format('YYYY-MM-DD HH:mm');
												groupInverter[_j].end_date = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.start_date), _i)).format('YYYY-MM-DD 19:00');
											}
										}

										var getListDeviceInverter = await db.queryForList("MainPlant.getListDeviceInverter", param);
										var dataEnergyMerge5 = [];
										var curDateFormat = (0, _moment2.default)(startDate5).format('YYYY-MM-DD 05:00');
										for (var t = 0; t <= 168; t++) {
											dataEnergyMerge5.push({
												time_format: (0, _moment2.default)(curDateFormat).add(5 * t, 'minutes').format('YYYY-MM-DD HH:mm'),
												time_full: (0, _moment2.default)(curDateFormat).add(5 * t, 'minutes').format('DD/MM/YYYY HH:mm'),
												activePower: 0,
												activeEnergy: 0,
												group_day: ''
											});
										}

										if (getListDeviceInverter.length > 0) {
											for (var v = 0, len = getListDeviceInverter.length; v < len; v++) {
												getListDeviceInverter[v].start_date = Libs.convertAllFormatDate(startDate5);
												getListDeviceInverter[v].end_date = Libs.convertAllFormatDate(endDate5);
												var dataEnergyByDevice = await db.queryForList("MainPlant.dataEnergyByDevice", getListDeviceInverter[v]);

												if (dataEnergyByDevice.length > 0) {
													for (var _k2 = 0, _l2 = dataEnergyByDevice.length; _k2 < _l2; _k2++) {
														if (_k2 === 0) {
															dataEnergyByDevice[_k2].activeEnergy = 0;
														} else {
															var subEnergy = 0;
															if (dataEnergyByDevice[_k2].today_activeEnergy != 0 && dataEnergyByDevice[_k2 - 1].today_activeEnergy != 0) {
																subEnergy = (dataEnergyByDevice[_k2].today_activeEnergy - dataEnergyByDevice[_k2 - 1].today_activeEnergy) / 1000;
															}

															dataEnergyByDevice[_k2].activeEnergy = Libs.roundNumber(subEnergy, 1);
														}
													}
													dataEnergyMerge5 = Object.values([].concat(_toConsumableArray(dataEnergyMerge5), _toConsumableArray(dataEnergyByDevice)).reduce(function (acc, _ref4) {
														var time_format = _ref4.time_format,
														    time_full = _ref4.time_full,
														    activePower = _ref4.activePower,
														    activeEnergy = _ref4.activeEnergy,
														    group_day = _ref4.group_day;

														acc[time_format] = {
															time_format: time_format,
															time_full: time_full,
															activePower: Libs.roundNumber((acc[time_format] ? acc[time_format].activePower : 0) + activePower, 1),
															activeEnergy: Libs.roundNumber((acc[time_format] ? acc[time_format].activeEnergy : 0) + activeEnergy, 1),
															group_day: group_day
														};
														return acc;
													}, {}));
												}
											}
										}

										(_dataEnergyToday = dataEnergyToday).push.apply(_dataEnergyToday, _toConsumableArray(dataEnergyMerge5));
									}
								}

								// 15 minutes
								if (param.data_send_time == 2) {
									for (var _i2 = 0; _i2 < 3; _i2++) {
										var _dataEnergyToday2;

										var curDate15 = '';
										if (_i2 === 0) {
											curDate15 = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
											for (var _j2 = 0, _len4 = groupInverter.length; _j2 < _len4; _j2++) {
												groupInverter[_j2].end_date = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
											}
										} else {
											curDate15 = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.start_date), _i2)).format('YYYY-MM-DD HH:mm');
											for (var _j3 = 0, _len5 = groupInverter.length; _j3 < _len5; _j3++) {
												groupInverter[_j3].start_date = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.start_date), _i2)).format('YYYY-MM-DD HH:mm');
												groupInverter[_j3].end_date = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.start_date), _i2)).format('YYYY-MM-DD 19:00');
											}
										}

										var _dataEnergyArr = await db.queryForList("MainPlant.getDataEnergyFifteenMinutes", { groupInverter: groupInverter });
										if (_dataEnergyArr.length > 0) {
											for (var _i3 = 0, _len6 = _dataEnergyArr.length; _i3 < _len6; _i3++) {
												if (_i3 === 0) {
													_dataEnergyArr[_i3].activeEnergy = 0;
												} else {
													var _subEnergy = 0;
													if (_dataEnergyArr[_i3].today_activeEnergy > 0 && _dataEnergyArr[_i3 - 1].today_activeEnergy > 0) {
														_subEnergy = Libs.roundNumber(_dataEnergyArr[_i3].today_activeEnergy - _dataEnergyArr[_i3 - 1].today_activeEnergy, 1);
													}
													_dataEnergyArr[_i3].activeEnergy = Libs.roundNumber(_subEnergy > 5000 ? 0 : _subEnergy, 1);
												}
											}
										}

										// genarete data 15 munites
										var curDateFormat15 = (0, _moment2.default)(curDate15).format('YYYY-MM-DD 05:00');
										var _dataEnergyMerge = [];
										for (var _t3 = 0; _t3 <= 56; _t3++) {
											_dataEnergyMerge.push({
												time_format: (0, _moment2.default)(curDateFormat15).add(15 * _t3, 'minutes').format('YYYY-MM-DD HH:mm'),
												time_full: (0, _moment2.default)(curDateFormat15).add(15 * _t3, 'minutes').format('DD/MM/YYYY HH:mm'),
												activePower: 0,
												activeEnergy: 0,
												group_day: ''
											});
										}

										_dataEnergyMerge = Object.values([].concat(_toConsumableArray(_dataEnergyMerge), _toConsumableArray(_dataEnergyArr)).reduce(function (acc, _ref5) {
											var time_format = _ref5.time_format,
											    time_full = _ref5.time_full,
											    activePower = _ref5.activePower,
											    activeEnergy = _ref5.activeEnergy,
											    group_day = _ref5.group_day;

											acc[time_format] = {
												time_format: time_format,
												time_full: time_full,
												activePower: Libs.roundNumber((acc[time_format] ? acc[time_format].activePower : 0) + activePower, 1),
												activeEnergy: Libs.roundNumber((acc[time_format] ? acc[time_format].activeEnergy : 0) + activeEnergy, 1),
												group_day: group_day
											};
											return acc;
										}, {}));

										(_dataEnergyToday2 = dataEnergyToday).push.apply(_dataEnergyToday2, _toConsumableArray(_dataEnergyMerge));
									}
								}

								// 1 hour
								if (param.data_send_time == 3) {
									for (var _i4 = 0; _i4 < 3; _i4++) {
										var _dataEnergyToday3;

										var startDate1h = '';
										if (_i4 === 0) {
											for (var _j4 = 0, _len7 = groupInverter.length; _j4 < _len7; _j4++) {
												startDate1h = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
												groupInverter[_j4].end_date = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
											}
										} else {
											for (var _j5 = 0, _len8 = groupInverter.length; _j5 < _len8; _j5++) {
												startDate1h = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.start_date), _i4)).format('YYYY-MM-DD HH:mm');
												groupInverter[_j5].start_date = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.start_date), _i4)).format('YYYY-MM-DD HH:mm');
												groupInverter[_j5].end_date = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.start_date), _i4)).format('YYYY-MM-DD 19:00');
											}
										}

										var curDateFormat1h = (0, _moment2.default)(startDate1h).format('YYYY-MM-DD 05:00');
										var _dataEnergyMerge1h = [];
										for (var _t4 = 0; _t4 <= 14; _t4++) {
											_dataEnergyMerge1h.push({
												time_format: (0, _moment2.default)(curDateFormat1h).add(1 * _t4, 'hours').format('YYYY-MM-DD HH'),
												time_full: (0, _moment2.default)(curDateFormat1h).add(1 * _t4, 'hours').format('DD/MM/YYYY HH:mm'),
												activePower: 0,
												activeEnergy: 0,
												group_day: ''
											});
										}

										var dataEnergyArr = await db.queryForList("MainPlant.getDataEnergyHour", { groupInverter: groupInverter });
										var dataEnergyToday1h = await db.queryForList("MainPlant.getDataEnergyHour", { groupInverter: groupInverter });
										_dataEnergyMerge1h = Object.values([].concat(_toConsumableArray(_dataEnergyMerge1h), _toConsumableArray(dataEnergyArr)).reduce(function (acc, _ref6) {
											var time_format = _ref6.time_format,
											    time_full = _ref6.time_full,
											    activePower = _ref6.activePower,
											    activeEnergy = _ref6.activeEnergy,
											    group_day = _ref6.group_day;

											acc[time_format] = {
												time_format: time_format,
												time_full: time_full,
												activePower: Libs.roundNumber((acc[time_format] ? acc[time_format].activePower : 0) + activePower, 1),
												activeEnergy: Libs.roundNumber((acc[time_format] ? acc[time_format].activeEnergy : 0) + activeEnergy, 1),
												group_day: group_day
											};
											return acc;
										}, {}));

										(_dataEnergyToday3 = dataEnergyToday).push.apply(_dataEnergyToday3, _toConsumableArray(_dataEnergyMerge1h));
									}
								}

								break;
							case 'last_month':
							case 'this_month':
								dataEnergyToday = await db.queryForList("MainPlant.getDataEnergyThisMonth", { groupInverter: groupInverter });
								break;

							case '12_month':
								dataEnergyToday = await db.queryForList("MainPlant.getDataEnergy12Month", { groupInverter: groupInverter });
								break;

							case 'lifetime':
								if (!Libs.isBlank(param.total_year) && param.total_year < 1) {
									dataEnergyToday = await db.queryForList("MainPlant.getDataEnergy12Month", { groupInverter: groupInverter });
								} else {
									dataEnergyToday = await db.queryForList("MainPlant.getDataEnergyLifetime", { groupInverter: groupInverter });
								}
								break;

						}

						conn.commit();
						callBack(false, dataEnergyToday);
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

	return MainPlantService;
}(_BaseService3.default);

exports.default = MainPlantService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9NYWluUGxhbnRTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIk1haW5QbGFudFNlcnZpY2UiLCJwYXJhbSIsImNhbGxCYWNrIiwiZGIiLCJteVNxTERCIiwiYmVnaW5UcmFuc2FjdGlvbiIsImNvbm4iLCJ0b3RhbEludmVydGVyT24iLCJ0b3RhbEludmVydGVyIiwicnMiLCJxdWVyeUZvck9iamVjdCIsImdldFRvdGFsSW52ZXJ0ZXIiLCJkZXZpY2VHcm91cCIsInF1ZXJ5Rm9yTGlzdCIsImlkX3Byb2plY3QiLCJpZCIsImlycmFkaWFuY2UiLCJhbWJpZW50X2VtcGVyYXR1cmUiLCJlbmVyZ3lfdG9kYXkiLCJsaWZldGltZSIsInBvd2VyX25vdyIsImRjX3Bvd2VyIiwiY29uc3VtcHRpb24iLCJ1c2luZ19tZXRlcl9jb25zdW1wdGlvbiIsIkxpYnMiLCJpc0FycmF5RGF0YSIsImoiLCJsZW5ndGgiLCJ0YWJsZV9uYW1lIiwib2JqRGV2aWNlIiwiaWRfZGV2aWNlX2dyb3VwIiwidG9kYXlfYWN0aXZlRW5lcmd5Iiwib2JqRGV2aWNlSXJyYWRpYW5jZSIsIm9iakRldmljZUFtYmllbnRFbXBlcmF0dXJlIiwib2JqQ29uc3VtcHRpb24iLCJmb3JtYXQiLCJhY3RpdmVQb3dlciIsInJldmVudWUiLCJjb25maWdfcmV2ZW51ZSIsInRvZGF5X3JldmVudWUiLCJ0b3RhbF9yZXZlbnVlIiwiY29tbWl0IiwiZXJyIiwiY29uc29sZSIsImxvZyIsInJvbGxiYWNrIiwiZGF0YUVuZXJneVRvZGF5IiwiZ2V0R3JvdXBJbnZlcnRlciIsImdyb3VwSW52ZXJ0ZXIiLCJpIiwibGVuIiwicHVzaCIsImhhc2hfaWQiLCJzdGFydF9kYXRlIiwiY29udmVydEFsbEZvcm1hdERhdGUiLCJlbmRfZGF0ZSIsImZpbHRlckJ5IiwiZ2V0TGlzdERldmljZUludmVydGVyIiwiZGF0YV9zZW5kX3RpbWUiLCJkYXRhRW5lcmd5TWVyZ2UiLCJjdXJEYXRlIiwiY3VyRGF0ZUZvcm1hdCIsInQiLCJ0aW1lX2Zvcm1hdCIsImFkZCIsInRpbWVfZnVsbCIsImFjdGl2ZUVuZXJneSIsImdyb3VwX2RheSIsInYiLCJkYXRhRW5lcmd5QnlEZXZpY2UiLCJrIiwibCIsInN1YkVuZXJneSIsInJvdW5kTnVtYmVyIiwiT2JqZWN0IiwidmFsdWVzIiwicmVkdWNlIiwiYWNjIiwiY3VyRGF0ZTE1IiwiY3VyRGF0ZUZvcm1hdDE1IiwiZGF0YUVuZXJneU1lcmdlMTUiLCJkYXRhRW5lcmd5VG9kYXkxNSIsImN1ckRhdGUxaCIsImN1ckRhdGVGb3JtYXQxaCIsImRhdGFFbmVyZ3lNZXJnZTFoIiwiZGF0YUVuZXJneVRvZGF5MWgiLCJzdGFydERhdGU1IiwiZW5kRGF0ZTUiLCJhZGREYXlzIiwiZGF0YUVuZXJneU1lcmdlNSIsImRhdGFFbmVyZ3lBcnIiLCJzdGFydERhdGUxaCIsImlzQmxhbmsiLCJ0b3RhbF95ZWFyIiwiQmFzZVNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7SUFDTUEsZ0I7OztBQUNMLDZCQUFjO0FBQUE7O0FBQUE7QUFHYjs7QUFFRDs7Ozs7Ozs7NEJBTVVDLEssRUFBT0MsUSxFQUFVO0FBQzFCLE9BQUk7QUFDSCxRQUFJQyxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxPQUFHRSxnQkFBSCxDQUFvQixnQkFBZ0JDLElBQWhCLEVBQXNCO0FBQ3pDLFNBQUk7QUFDSCxVQUFJQyxrQkFBa0IsQ0FBdEI7QUFBQSxVQUF5QkMsZ0JBQWdCLENBQXpDO0FBQ0EsVUFBSUMsS0FBSyxNQUFNTixHQUFHTyxjQUFILENBQWtCLHFCQUFsQixFQUF5Q1QsS0FBekMsQ0FBZjtBQUNBLFVBQUlVLG1CQUFtQixNQUFNUixHQUFHTyxjQUFILENBQWtCLDRCQUFsQixFQUFnRFQsS0FBaEQsQ0FBN0I7QUFDQSxVQUFJVSxnQkFBSixFQUFzQjtBQUNyQkgsdUJBQWdCRyxpQkFBaUJILGFBQWpDO0FBQ0E7O0FBRUQsVUFBSUksY0FBYyxNQUFNVCxHQUFHVSxZQUFILENBQWdCLHFDQUFoQixFQUF1RCxFQUFFQyxZQUFZTCxHQUFHTSxFQUFqQixFQUF2RCxDQUF4QjtBQUNBLFVBQUlDLGFBQWEsRUFBakI7QUFBQSxVQUFxQkMscUJBQXFCLEVBQTFDO0FBQUEsVUFBOENDLGVBQWUsQ0FBN0Q7QUFBQSxVQUFnRUMsV0FBVyxDQUEzRTtBQUFBLFVBQThFQyxZQUFZLENBQTFGO0FBQUEsVUFBNkZDLFdBQVcsQ0FBeEc7QUFBQSxVQUEyR0MsY0FBYyxDQUF6SDtBQUFBLFVBQTRIQywwQkFBMEIsQ0FBdEo7QUFDQSxVQUFJQyxLQUFLQyxXQUFMLENBQWlCYixXQUFqQixDQUFKLEVBQW1DO0FBQ2xDLFlBQUssSUFBSWMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJZCxZQUFZZSxNQUFoQyxFQUF3Q0QsR0FBeEMsRUFBNkM7QUFDNUMsZ0JBQVFkLFlBQVljLENBQVosRUFBZUUsVUFBdkI7QUFDQyxjQUFLLDJCQUFMO0FBQ0EsY0FBSywwQkFBTDtBQUNBLGNBQUssMEJBQUw7QUFDQSxjQUFLLDJCQUFMO0FBQ0MsY0FBSUMsWUFBWSxNQUFNMUIsR0FBR08sY0FBSCxDQUFrQiwrQkFBbEIsRUFBbUQ7QUFDeEVJLHVCQUFZTCxHQUFHTSxFQUR5RDtBQUV4RWUsNEJBQWlCbEIsWUFBWWMsQ0FBWixFQUFlWCxFQUZ3QztBQUd4RWEsdUJBQVloQixZQUFZYyxDQUFaLEVBQWVFO0FBSDZDLFdBQW5ELENBQXRCO0FBS0EsY0FBSUMsU0FBSixFQUFlO0FBQ2R0Qiw2QkFBa0JBLGtCQUFrQnNCLFVBQVV0QixlQUE5Qzs7QUFFQVcsMEJBQWVBLGVBQWVXLFVBQVVFLGtCQUF4QztBQUNBWixzQkFBV0EsV0FBV1UsVUFBVVYsUUFBaEM7QUFDQUMsdUJBQVlBLFlBQVlTLFVBQVVULFNBQWxDO0FBQ0FDLHNCQUFXQSxXQUFXUSxVQUFVUixRQUFoQztBQUNBOztBQUdEO0FBQ0QsY0FBSyxnQ0FBTDtBQUNDO0FBQ0QsY0FBSyxpQ0FBTDtBQUNDO0FBQ0QsY0FBSywwQkFBTDtBQUNDLGNBQUlXLHNCQUFzQixNQUFNN0IsR0FBR1UsWUFBSCxDQUFnQixtQ0FBaEIsRUFBcUQ7QUFDcEZDLHVCQUFZTCxHQUFHTSxFQURxRTtBQUVwRmUsNEJBQWlCbEIsWUFBWWMsQ0FBWixFQUFlWCxFQUZvRDtBQUdwRmEsdUJBQVloQixZQUFZYyxDQUFaLEVBQWVFO0FBSHlELFdBQXJELENBQWhDO0FBS0EsY0FBSUosS0FBS0MsV0FBTCxDQUFpQk8sbUJBQWpCLENBQUosRUFBMkM7QUFDMUNoQix3QkFBYWdCLG1CQUFiO0FBQ0E7QUFDRDtBQUNELGNBQUssMEJBQUw7QUFDQyxjQUFJQyw2QkFBNkIsTUFBTTlCLEdBQUdVLFlBQUgsQ0FBZ0IsMENBQWhCLEVBQTREO0FBQ2xHQyx1QkFBWUwsR0FBR00sRUFEbUY7QUFFbEdlLDRCQUFpQmxCLFlBQVljLENBQVosRUFBZVgsRUFGa0U7QUFHbEdhLHVCQUFZaEIsWUFBWWMsQ0FBWixFQUFlRTtBQUh1RSxXQUE1RCxDQUF2QztBQUtBLGNBQUlKLEtBQUtDLFdBQUwsQ0FBaUJRLDBCQUFqQixDQUFKLEVBQWtEO0FBQ2pEaEIsZ0NBQXFCZ0IsMEJBQXJCO0FBQ0E7QUFDRDtBQUNELGNBQUssOEJBQUw7QUFDQyxjQUFJQyxpQkFBaUIsTUFBTS9CLEdBQUdPLGNBQUgsQ0FBa0IsK0JBQWxCLEVBQW1EO0FBQzdFSSx1QkFBWUwsR0FBR00sRUFEOEQ7QUFFN0VlLDRCQUFpQmxCLFlBQVljLENBQVosRUFBZVgsRUFGNkM7QUFHN0VhLHVCQUFZaEIsWUFBWWMsQ0FBWixFQUFlRTtBQUhrRCxXQUFuRCxDQUEzQjs7QUFNQSxjQUFJTSxjQUFKLEVBQW9CO0FBQ25CWCxxQ0FBMEIsQ0FBMUI7QUFDQUQseUJBQWUsd0JBQVNhLE1BQVQsQ0FBZ0IsR0FBaEIsSUFBdUIsRUFBeEIsR0FBOEJELGVBQWVFLFdBQTdDLEdBQTJELENBQXpFO0FBQ0E7QUFDRDtBQXhERjtBQTBEQTtBQUNEO0FBQ0QzQixTQUFHRixlQUFILEdBQXFCQSxlQUFyQjtBQUNBRSxTQUFHRCxhQUFILEdBQW1CQSxhQUFuQjtBQUNBQyxTQUFHUyxZQUFILEdBQWtCQSxZQUFsQjtBQUNBVCxTQUFHVSxRQUFILEdBQWNBLFFBQWQ7QUFDQVYsU0FBRzRCLE9BQUgsR0FBYWxCLFdBQVdWLEdBQUc2QixjQUEzQjtBQUNBN0IsU0FBR08sVUFBSCxHQUFnQkEsVUFBaEI7QUFDQVAsU0FBRzhCLGFBQUgsR0FBb0JyQixlQUFlLElBQWhCLEdBQXdCVCxHQUFHNkIsY0FBOUM7QUFDQTdCLFNBQUcrQixhQUFILEdBQW9CckIsV0FBVyxJQUFaLEdBQW9CVixHQUFHNkIsY0FBMUM7QUFDQTdCLFNBQUdXLFNBQUgsR0FBZUEsWUFBWSxDQUFaLEdBQWdCQSxZQUFZLElBQTVCLEdBQW1DLENBQWxEO0FBQ0FYLFNBQUdPLFVBQUgsR0FBZ0JBLFVBQWhCO0FBQ0FQLFNBQUdRLGtCQUFILEdBQXdCQSxrQkFBeEI7QUFDQVIsU0FBR1ksUUFBSCxHQUFjQSxXQUFXLENBQVgsR0FBZUEsV0FBVyxJQUExQixHQUFpQyxDQUEvQztBQUNBWixTQUFHYSxXQUFILEdBQWlCQSxXQUFqQjtBQUNBYixTQUFHYyx1QkFBSCxHQUE2QkEsdUJBQTdCO0FBQ0FqQixXQUFLbUMsTUFBTDtBQUNBdkMsZUFBUyxLQUFULEVBQWdCTyxFQUFoQjtBQUNBLE1BeEZELENBd0ZFLE9BQU9pQyxHQUFQLEVBQVk7QUFDYkMsY0FBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJGLEdBQTNCO0FBQ0FwQyxXQUFLdUMsUUFBTDtBQUNBM0MsZUFBUyxJQUFULEVBQWV3QyxHQUFmO0FBQ0E7QUFDRCxLQTlGRDtBQStGQSxJQWpHRCxDQWlHRSxPQUFPQSxHQUFQLEVBQVk7QUFDYixRQUFJcEMsSUFBSixFQUFVO0FBQ1RBLFVBQUt1QyxRQUFMO0FBQ0E7QUFDRDNDLGFBQVMsSUFBVCxFQUFld0MsR0FBZjtBQUNBO0FBQ0Q7O0FBSUQ7Ozs7Ozs7OytCQU1hekMsSyxFQUFPQyxRLEVBQVU7QUFDN0IsT0FBSTtBQUNILFFBQUlDLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FELE9BQUdFLGdCQUFILENBQW9CLGdCQUFnQkMsSUFBaEIsRUFBc0I7QUFDekMsU0FBSTtBQUNILFVBQUl3QyxrQkFBa0IsRUFBdEI7QUFDQSxVQUFJQyxtQkFBbUIsTUFBTTVDLEdBQUdVLFlBQUgsQ0FBZ0Isa0NBQWhCLEVBQW9EWixLQUFwRCxDQUE3Qjs7QUFFQSxVQUFJLENBQUM4QyxnQkFBTCxFQUF1QjtBQUN0QnpDLFlBQUt1QyxRQUFMO0FBQ0EzQyxnQkFBUyxLQUFULEVBQWdCLEVBQWhCO0FBQ0E7QUFDQTtBQUNELFVBQUk4QyxnQkFBZ0IsRUFBcEI7QUFDQSxVQUFJRCxpQkFBaUJwQixNQUFqQixHQUEwQixDQUE5QixFQUFpQztBQUNoQyxZQUFLLElBQUlzQixJQUFJLENBQVIsRUFBV0MsT0FBTUgsaUJBQWlCcEIsTUFBdkMsRUFBK0NzQixJQUFJQyxJQUFuRCxFQUF3REQsR0FBeEQsRUFBNkQ7QUFDNURELHNCQUFjRyxJQUFkLENBQ0M7QUFDQ0Msa0JBQVNuRCxNQUFNbUQsT0FEaEI7QUFFQ3RCLDBCQUFpQmlCLGlCQUFpQkUsQ0FBakIsRUFBb0JuQixlQUZ0QztBQUdDdUIscUJBQVk3QixLQUFLOEIsb0JBQUwsQ0FBMEJyRCxNQUFNb0QsVUFBaEMsQ0FIYjtBQUlDRSxtQkFBVS9CLEtBQUs4QixvQkFBTCxDQUEwQnJELE1BQU1zRCxRQUFoQyxDQUpYO0FBS0MzQixxQkFBWW1CLGlCQUFpQkUsQ0FBakIsRUFBb0JyQjtBQUxqQyxTQUREO0FBU0E7QUFDRDs7QUFFRCxjQUFRM0IsTUFBTXVELFFBQWQ7QUFDQyxZQUFLLE9BQUw7QUFDQyxZQUFJQyx3QkFBd0IsRUFBNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQSxnQ0FBd0IsTUFBTXRELEdBQUdVLFlBQUgsQ0FBZ0IsaUNBQWhCLEVBQW1EWixLQUFuRCxDQUE5QjtBQUNBO0FBQ0EsWUFBSUEsTUFBTXlELGNBQU4sSUFBd0IsQ0FBNUIsRUFBK0I7QUFDOUI7QUFDQSxhQUFJQyxrQkFBa0IsRUFBdEI7QUFDQTtBQUNBLGFBQUlDLFVBQVVwQyxLQUFLOEIsb0JBQUwsQ0FBMEJyRCxNQUFNc0QsUUFBaEMsQ0FBZDtBQUNBLGFBQUlNLGdCQUFnQixzQkFBT0QsT0FBUCxFQUFnQnpCLE1BQWhCLENBQXVCLGtCQUF2QixDQUFwQjtBQUNBLGNBQUssSUFBSTJCLElBQUksQ0FBYixFQUFnQkEsSUFBSSxHQUFwQixFQUF5QkEsR0FBekIsRUFBOEI7QUFDN0JILDBCQUFnQlIsSUFBaEIsQ0FBcUI7QUFDcEJZLHdCQUFhLHNCQUFPRixhQUFQLEVBQXNCRyxHQUF0QixDQUEwQixJQUFJRixDQUE5QixFQUFpQyxTQUFqQyxFQUE0QzNCLE1BQTVDLENBQW1ELGtCQUFuRCxDQURPO0FBRXBCOEIsc0JBQVcsc0JBQU9KLGFBQVAsRUFBc0JHLEdBQXRCLENBQTBCLElBQUlGLENBQTlCLEVBQWlDLFNBQWpDLEVBQTRDM0IsTUFBNUMsQ0FBbUQsa0JBQW5ELENBRlM7QUFHcEJDLHdCQUFhLENBSE87QUFJcEI4Qix5QkFBYyxDQUpNO0FBS3BCQyxzQkFBVztBQUxTLFdBQXJCO0FBT0E7O0FBRUQsYUFBSVYsc0JBQXNCOUIsTUFBdEIsR0FBK0IsQ0FBbkMsRUFBc0M7QUFDckMsZUFBSyxJQUFJeUMsSUFBSSxDQUFSLEVBQVdsQixNQUFNTyxzQkFBc0I5QixNQUE1QyxFQUFvRHlDLElBQUlsQixHQUF4RCxFQUE2RGtCLEdBQTdELEVBQWtFO0FBQ2pFWCxpQ0FBc0JXLENBQXRCLEVBQXlCZixVQUF6QixHQUFzQzdCLEtBQUs4QixvQkFBTCxDQUEwQnJELE1BQU1vRCxVQUFoQyxDQUF0QztBQUNBSSxpQ0FBc0JXLENBQXRCLEVBQXlCYixRQUF6QixHQUFvQy9CLEtBQUs4QixvQkFBTCxDQUEwQnJELE1BQU1zRCxRQUFoQyxDQUFwQztBQUNBLGVBQUljLHFCQUFxQixNQUFNbEUsR0FBR1UsWUFBSCxDQUFnQiw4QkFBaEIsRUFBZ0Q0QyxzQkFBc0JXLENBQXRCLENBQWhELENBQS9COztBQUVBLGVBQUlDLG1CQUFtQjFDLE1BQW5CLEdBQTRCLENBQWhDLEVBQW1DO0FBQ2xDLGlCQUFLLElBQUkyQyxJQUFJLENBQVIsRUFBV0MsSUFBSUYsbUJBQW1CMUMsTUFBdkMsRUFBK0MyQyxJQUFJQyxDQUFuRCxFQUFzREQsR0FBdEQsRUFBMkQ7QUFDMUQsaUJBQUlBLE1BQU0sQ0FBVixFQUFhO0FBQ1pELGlDQUFtQkMsQ0FBbkIsRUFBc0JKLFlBQXRCLEdBQXFDLENBQXJDO0FBQ0EsY0FGRCxNQUVPO0FBQ04sa0JBQUlNLFlBQVksQ0FBaEI7QUFDQSxrQkFBSUgsbUJBQW1CQyxDQUFuQixFQUFzQnZDLGtCQUF0QixJQUE0QyxDQUE1QyxJQUFpRHNDLG1CQUFtQkMsSUFBSSxDQUF2QixFQUEwQnZDLGtCQUExQixJQUFnRCxDQUFyRyxFQUF3RztBQUN2R3lDLDJCQUFZLENBQUNILG1CQUFtQkMsQ0FBbkIsRUFBc0J2QyxrQkFBdEIsR0FBMkNzQyxtQkFBbUJDLElBQUksQ0FBdkIsRUFBMEJ2QyxrQkFBdEUsSUFBNEYsSUFBeEc7QUFDQTs7QUFFRHNDLGlDQUFtQkMsQ0FBbkIsRUFBc0JKLFlBQXRCLEdBQXFDMUMsS0FBS2lELFdBQUwsQ0FBaUJELFNBQWpCLEVBQTRCLENBQTVCLENBQXJDO0FBQ0E7QUFDRDtBQUNEYiw4QkFBa0JlLE9BQU9DLE1BQVAsQ0FBYyw2QkFBSWhCLGVBQUosc0JBQXdCVSxrQkFBeEIsR0FBNENPLE1BQTVDLENBQW1ELFVBQUNDLEdBQUQsUUFBMkU7QUFBQSxpQkFBbkVkLFdBQW1FLFFBQW5FQSxXQUFtRTtBQUFBLGlCQUF0REUsU0FBc0QsUUFBdERBLFNBQXNEO0FBQUEsaUJBQTNDN0IsV0FBMkMsUUFBM0NBLFdBQTJDO0FBQUEsaUJBQTlCOEIsWUFBOEIsUUFBOUJBLFlBQThCO0FBQUEsaUJBQWhCQyxTQUFnQixRQUFoQkEsU0FBZ0I7O0FBQzdKVSxpQkFBSWQsV0FBSixJQUFtQjtBQUNsQkEsc0NBRGtCO0FBRWxCRSxrQ0FGa0I7QUFHbEI3QiwyQkFBYVosS0FBS2lELFdBQUwsQ0FBa0IsQ0FBQ0ksSUFBSWQsV0FBSixJQUFtQmMsSUFBSWQsV0FBSixFQUFpQjNCLFdBQXBDLEdBQWtELENBQW5ELElBQXdEQSxXQUExRSxFQUF3RixDQUF4RixDQUhLO0FBSWxCOEIsNEJBQWMxQyxLQUFLaUQsV0FBTCxDQUFrQixDQUFDSSxJQUFJZCxXQUFKLElBQW1CYyxJQUFJZCxXQUFKLEVBQWlCRyxZQUFwQyxHQUFtRCxDQUFwRCxJQUF5REEsWUFBM0UsRUFBMEYsQ0FBMUYsQ0FKSTtBQUtsQkM7QUFMa0IsY0FBbkI7QUFPQSxvQkFBT1UsR0FBUDtBQUNBLGFBVCtCLEVBUzdCLEVBVDZCLENBQWQsQ0FBbEI7QUFVQTtBQUNEO0FBQ0Q7QUFDRC9CLDJCQUFrQmEsZUFBbEI7QUFDQTs7QUFFRDtBQUNBLFlBQUkxRCxNQUFNeUQsY0FBTixJQUF3QixDQUE1QixFQUErQjtBQUM5QjtBQUNBLGFBQUlvQixXQUFZdEQsS0FBSzhCLG9CQUFMLENBQTBCckQsTUFBTXNELFFBQWhDLENBQWhCO0FBQ0EsYUFBSXdCLGtCQUFrQixzQkFBT0QsUUFBUCxFQUFrQjNDLE1BQWxCLENBQXlCLGtCQUF6QixDQUF0QjtBQUNBLGFBQUk2QyxvQkFBb0IsRUFBeEI7QUFDQSxjQUFLLElBQUlsQixLQUFJLENBQWIsRUFBZ0JBLE1BQUssRUFBckIsRUFBeUJBLElBQXpCLEVBQThCO0FBQzdCa0IsNEJBQWtCN0IsSUFBbEIsQ0FBdUI7QUFDdEJZLHdCQUFhLHNCQUFPZ0IsZUFBUCxFQUF3QmYsR0FBeEIsQ0FBNEIsS0FBS0YsRUFBakMsRUFBb0MsU0FBcEMsRUFBK0MzQixNQUEvQyxDQUFzRCxrQkFBdEQsQ0FEUztBQUV0QjhCLHNCQUFXLHNCQUFPYyxlQUFQLEVBQXdCZixHQUF4QixDQUE0QixLQUFLRixFQUFqQyxFQUFvQyxTQUFwQyxFQUErQzNCLE1BQS9DLENBQXNELGtCQUF0RCxDQUZXO0FBR3RCQyx3QkFBYSxDQUhTO0FBSXRCOEIseUJBQWMsQ0FKUTtBQUt0QkMsc0JBQVc7QUFMVyxXQUF2QjtBQU9BOztBQUdELGFBQUdWLHNCQUFzQjlCLE1BQXRCLEdBQStCLENBQWxDLEVBQW9DO0FBQ25DLGVBQUssSUFBSXlDLElBQUksQ0FBUixFQUFXbEIsTUFBTU8sc0JBQXNCOUIsTUFBNUMsRUFBb0R5QyxJQUFJbEIsR0FBeEQsRUFBNkRrQixHQUE3RCxFQUFrRTtBQUNqRVgsaUNBQXNCVyxDQUF0QixFQUF5QmYsVUFBekIsR0FBc0M3QixLQUFLOEIsb0JBQUwsQ0FBMEJyRCxNQUFNb0QsVUFBaEMsQ0FBdEM7QUFDQUksaUNBQXNCVyxDQUF0QixFQUF5QmIsUUFBekIsR0FBb0MvQixLQUFLOEIsb0JBQUwsQ0FBMEJyRCxNQUFNc0QsUUFBaEMsQ0FBcEM7QUFDQSxlQUFJMEIsb0JBQW9CLE1BQU05RSxHQUFHVSxZQUFILENBQWdCLHVDQUFoQixFQUF5RDRDLHNCQUFzQlcsQ0FBdEIsQ0FBekQsQ0FBOUI7O0FBRUEsZUFBSWEsa0JBQWtCdEQsTUFBbEIsR0FBMkIsQ0FBL0IsRUFBa0M7QUFDakMsaUJBQUssSUFBSTJDLEtBQUksQ0FBUixFQUFXQyxLQUFJVSxrQkFBa0J0RCxNQUF0QyxFQUE4QzJDLEtBQUlDLEVBQWxELEVBQXFERCxJQUFyRCxFQUEwRDtBQUN6RCxpQkFBSUEsT0FBTSxDQUFWLEVBQWE7QUFDWlcsZ0NBQWtCWCxFQUFsQixFQUFxQkosWUFBckIsR0FBb0MsQ0FBcEM7QUFDQSxjQUZELE1BRU87QUFDTixrQkFBSU0sWUFBWSxDQUFoQjtBQUNBLGtCQUFJUyxrQkFBa0JYLEVBQWxCLEVBQXFCdkMsa0JBQXJCLEdBQTBDLENBQTFDLElBQStDa0Qsa0JBQWtCWCxLQUFJLENBQXRCLEVBQXlCdkMsa0JBQXpCLEdBQThDLENBQWpHLEVBQW9HO0FBQ25HeUMsMkJBQVksQ0FBQ1Msa0JBQWtCWCxFQUFsQixFQUFxQnZDLGtCQUFyQixHQUEwQ2tELGtCQUFrQlgsS0FBSSxDQUF0QixFQUF5QnZDLGtCQUFwRSxJQUEwRixJQUF0RztBQUNBOztBQUVEa0QsZ0NBQWtCWCxFQUFsQixFQUFxQkosWUFBckIsR0FBb0MxQyxLQUFLaUQsV0FBTCxDQUFpQkQsU0FBakIsRUFBNEIsQ0FBNUIsQ0FBcEM7QUFDQTtBQUNEO0FBQ0RRLGdDQUFvQk4sT0FBT0MsTUFBUCxDQUFjLDZCQUFJSyxpQkFBSixzQkFBMEJDLGlCQUExQixHQUE2Q0wsTUFBN0MsQ0FBb0QsVUFBQ0MsR0FBRCxTQUEyRTtBQUFBLGlCQUFuRWQsV0FBbUUsU0FBbkVBLFdBQW1FO0FBQUEsaUJBQXRERSxTQUFzRCxTQUF0REEsU0FBc0Q7QUFBQSxpQkFBM0M3QixXQUEyQyxTQUEzQ0EsV0FBMkM7QUFBQSxpQkFBOUI4QixZQUE4QixTQUE5QkEsWUFBOEI7QUFBQSxpQkFBaEJDLFNBQWdCLFNBQWhCQSxTQUFnQjs7QUFDaEtVLGlCQUFJZCxXQUFKLElBQW1CO0FBQ2xCQSxzQ0FEa0I7QUFFbEJFLGtDQUZrQjtBQUdsQjdCLDJCQUFhWixLQUFLaUQsV0FBTCxDQUFrQixDQUFDSSxJQUFJZCxXQUFKLElBQW1CYyxJQUFJZCxXQUFKLEVBQWlCM0IsV0FBcEMsR0FBa0QsQ0FBbkQsSUFBd0RBLFdBQTFFLEVBQXdGLENBQXhGLENBSEs7QUFJbEI4Qiw0QkFBYzFDLEtBQUtpRCxXQUFMLENBQWtCLENBQUNJLElBQUlkLFdBQUosSUFBbUJjLElBQUlkLFdBQUosRUFBaUJHLFlBQXBDLEdBQW1ELENBQXBELElBQXlEQSxZQUEzRSxFQUEwRixDQUExRixDQUpJO0FBS2xCQztBQUxrQixjQUFuQjtBQU9BLG9CQUFPVSxHQUFQO0FBQ0EsYUFUaUMsRUFTL0IsRUFUK0IsQ0FBZCxDQUFwQjtBQVVBO0FBQ0Q7QUFDRDs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEvQiwyQkFBa0JrQyxpQkFBbEI7QUFFQTs7QUFFRDtBQUNBLFlBQUkvRSxNQUFNeUQsY0FBTixJQUF3QixDQUE1QixFQUErQjtBQUM5QjtBQUNBLGFBQUl3QixZQUFZMUQsS0FBSzhCLG9CQUFMLENBQTBCckQsTUFBTXNELFFBQWhDLENBQWhCO0FBQ0EsYUFBSTRCLGtCQUFrQixzQkFBT0QsU0FBUCxFQUFrQi9DLE1BQWxCLENBQXlCLGtCQUF6QixDQUF0QjtBQUNBLGFBQUlpRCxvQkFBb0IsRUFBeEI7QUFDQSxjQUFLLElBQUl0QixNQUFJLENBQWIsRUFBZ0JBLE9BQUssRUFBckIsRUFBeUJBLEtBQXpCLEVBQThCO0FBQzdCc0IsNEJBQWtCakMsSUFBbEIsQ0FBdUI7QUFDdEJZLHdCQUFhLHNCQUFPb0IsZUFBUCxFQUF3Qm5CLEdBQXhCLENBQTRCLElBQUlGLEdBQWhDLEVBQW1DLE9BQW5DLEVBQTRDM0IsTUFBNUMsQ0FBbUQsZUFBbkQsQ0FEUztBQUV0QjhCLHNCQUFXLHNCQUFPa0IsZUFBUCxFQUF3Qm5CLEdBQXhCLENBQTRCLElBQUlGLEdBQWhDLEVBQW1DLE9BQW5DLEVBQTRDM0IsTUFBNUMsQ0FBbUQsa0JBQW5ELENBRlc7QUFHdEJDLHdCQUFhLENBSFM7QUFJdEI4Qix5QkFBYyxDQUpRO0FBS3RCQyxzQkFBVztBQUxXLFdBQXZCO0FBT0E7O0FBR0QsYUFBSWtCLG9CQUFvQixNQUFNbEYsR0FBR1UsWUFBSCxDQUFnQiw2QkFBaEIsRUFBK0MsRUFBRW1DLDRCQUFGLEVBQS9DLENBQTlCO0FBQ0FvQyw2QkFBb0JWLE9BQU9DLE1BQVAsQ0FBYyw2QkFBSVMsaUJBQUosc0JBQTBCQyxpQkFBMUIsR0FBNkNULE1BQTdDLENBQW9ELFVBQUNDLEdBQUQsU0FBMkU7QUFBQSxjQUFuRWQsV0FBbUUsU0FBbkVBLFdBQW1FO0FBQUEsY0FBdERFLFNBQXNELFNBQXREQSxTQUFzRDtBQUFBLGNBQTNDN0IsV0FBMkMsU0FBM0NBLFdBQTJDO0FBQUEsY0FBOUI4QixZQUE4QixTQUE5QkEsWUFBOEI7QUFBQSxjQUFoQkMsU0FBZ0IsU0FBaEJBLFNBQWdCOztBQUNoS1UsY0FBSWQsV0FBSixJQUFtQjtBQUNsQkEsbUNBRGtCO0FBRWxCRSwrQkFGa0I7QUFHbEI3Qix3QkFBYVosS0FBS2lELFdBQUwsQ0FBa0IsQ0FBQ0ksSUFBSWQsV0FBSixJQUFtQmMsSUFBSWQsV0FBSixFQUFpQjNCLFdBQXBDLEdBQWtELENBQW5ELElBQXdEQSxXQUExRSxFQUF3RixDQUF4RixDQUhLO0FBSWxCOEIseUJBQWMxQyxLQUFLaUQsV0FBTCxDQUFrQixDQUFDSSxJQUFJZCxXQUFKLElBQW1CYyxJQUFJZCxXQUFKLEVBQWlCRyxZQUFwQyxHQUFtRCxDQUFwRCxJQUF5REEsWUFBM0UsRUFBMEYsQ0FBMUYsQ0FKSTtBQUtsQkM7QUFMa0IsV0FBbkI7QUFPQSxpQkFBT1UsR0FBUDtBQUNBLFVBVGlDLEVBUy9CLEVBVCtCLENBQWQsQ0FBcEI7O0FBWUEvQiwyQkFBa0JzQyxpQkFBbEI7QUFFQTs7QUFFRDtBQUNELFlBQUssT0FBTDtBQUNDO0FBQ0EsWUFBSW5GLE1BQU15RCxjQUFOLElBQXdCLENBQTVCLEVBQStCO0FBQzlCLGFBQUk0QixhQUFhLEVBQWpCO0FBQUEsYUFBcUJDLFdBQVcsRUFBaEM7QUFDQSxjQUFLLElBQUl0QyxLQUFJLENBQWIsRUFBZ0JBLEtBQUksQ0FBcEIsRUFBdUJBLElBQXZCLEVBQTRCO0FBQUE7O0FBQzNCLGNBQUlBLE9BQU0sQ0FBVixFQUFhO0FBQ1pxQyx3QkFBYSxzQkFBTzlELEtBQUtnRSxPQUFMLENBQWFoRSxLQUFLOEIsb0JBQUwsQ0FBMEJyRCxNQUFNc0QsUUFBaEMsQ0FBYixFQUF3RCxDQUFDLENBQXpELENBQVAsRUFBb0VwQixNQUFwRSxDQUEyRSxrQkFBM0UsQ0FBYjtBQUNBb0Qsc0JBQVcsc0JBQU8vRCxLQUFLZ0UsT0FBTCxDQUFhaEUsS0FBSzhCLG9CQUFMLENBQTBCckQsTUFBTXNELFFBQWhDLENBQWIsRUFBd0QsQ0FBQyxDQUF6RCxDQUFQLEVBQW9FcEIsTUFBcEUsQ0FBMkUsa0JBQTNFLENBQVg7QUFDQSxnQkFBSyxJQUFJVCxJQUFJLENBQVIsRUFBV3dCLFFBQU1GLGNBQWNyQixNQUFwQyxFQUE0Q0QsSUFBSXdCLEtBQWhELEVBQXFEeEIsR0FBckQsRUFBMEQ7QUFDekRzQiwwQkFBY3RCLENBQWQsRUFBaUI2QixRQUFqQixHQUE0QixzQkFBTy9CLEtBQUtnRSxPQUFMLENBQWFoRSxLQUFLOEIsb0JBQUwsQ0FBMEJyRCxNQUFNc0QsUUFBaEMsQ0FBYixFQUF3RCxDQUFDLENBQXpELENBQVAsRUFBb0VwQixNQUFwRSxDQUEyRSxrQkFBM0UsQ0FBNUI7QUFDQTtBQUNELFdBTkQsTUFNTztBQUNObUQsd0JBQWEsc0JBQU85RCxLQUFLZ0UsT0FBTCxDQUFhaEUsS0FBSzhCLG9CQUFMLENBQTBCckQsTUFBTW9ELFVBQWhDLENBQWIsRUFBMERKLEVBQTFELENBQVAsRUFBcUVkLE1BQXJFLENBQTRFLGtCQUE1RSxDQUFiO0FBQ0FvRCxzQkFBVyxzQkFBTy9ELEtBQUtnRSxPQUFMLENBQWFoRSxLQUFLOEIsb0JBQUwsQ0FBMEJyRCxNQUFNb0QsVUFBaEMsQ0FBYixFQUEwREosRUFBMUQsQ0FBUCxFQUFxRWQsTUFBckUsQ0FBNEUsa0JBQTVFLENBQVg7QUFDQSxnQkFBSyxJQUFJVCxLQUFJLENBQVIsRUFBV3dCLFFBQU1GLGNBQWNyQixNQUFwQyxFQUE0Q0QsS0FBSXdCLEtBQWhELEVBQXFEeEIsSUFBckQsRUFBMEQ7QUFDekRzQiwwQkFBY3RCLEVBQWQsRUFBaUIyQixVQUFqQixHQUE4QixzQkFBTzdCLEtBQUtnRSxPQUFMLENBQWFoRSxLQUFLOEIsb0JBQUwsQ0FBMEJyRCxNQUFNb0QsVUFBaEMsQ0FBYixFQUEwREosRUFBMUQsQ0FBUCxFQUFxRWQsTUFBckUsQ0FBNEUsa0JBQTVFLENBQTlCO0FBQ0FhLDBCQUFjdEIsRUFBZCxFQUFpQjZCLFFBQWpCLEdBQTRCLHNCQUFPL0IsS0FBS2dFLE9BQUwsQ0FBYWhFLEtBQUs4QixvQkFBTCxDQUEwQnJELE1BQU1vRCxVQUFoQyxDQUFiLEVBQTBESixFQUExRCxDQUFQLEVBQXFFZCxNQUFyRSxDQUE0RSxrQkFBNUUsQ0FBNUI7QUFDQTtBQUNEOztBQUVELGNBQUlzQix3QkFBd0IsTUFBTXRELEdBQUdVLFlBQUgsQ0FBZ0IsaUNBQWhCLEVBQW1EWixLQUFuRCxDQUFsQztBQUNBLGNBQUl3RixtQkFBbUIsRUFBdkI7QUFDQSxjQUFJNUIsZ0JBQWdCLHNCQUFPeUIsVUFBUCxFQUFtQm5ELE1BQW5CLENBQTBCLGtCQUExQixDQUFwQjtBQUNBLGVBQUssSUFBSTJCLElBQUksQ0FBYixFQUFnQkEsS0FBSyxHQUFyQixFQUEwQkEsR0FBMUIsRUFBK0I7QUFDOUIyQiw0QkFBaUJ0QyxJQUFqQixDQUFzQjtBQUNyQlkseUJBQWEsc0JBQU9GLGFBQVAsRUFBc0JHLEdBQXRCLENBQTBCLElBQUlGLENBQTlCLEVBQWlDLFNBQWpDLEVBQTRDM0IsTUFBNUMsQ0FBbUQsa0JBQW5ELENBRFE7QUFFckI4Qix1QkFBVyxzQkFBT0osYUFBUCxFQUFzQkcsR0FBdEIsQ0FBMEIsSUFBSUYsQ0FBOUIsRUFBaUMsU0FBakMsRUFBNEMzQixNQUE1QyxDQUFtRCxrQkFBbkQsQ0FGVTtBQUdyQkMseUJBQWEsQ0FIUTtBQUlyQjhCLDBCQUFjLENBSk87QUFLckJDLHVCQUFXO0FBTFUsWUFBdEI7QUFPQTs7QUFFRCxjQUFJVixzQkFBc0I5QixNQUF0QixHQUErQixDQUFuQyxFQUFzQztBQUNyQyxnQkFBSyxJQUFJeUMsSUFBSSxDQUFSLEVBQVdsQixNQUFNTyxzQkFBc0I5QixNQUE1QyxFQUFvRHlDLElBQUlsQixHQUF4RCxFQUE2RGtCLEdBQTdELEVBQWtFO0FBQ2pFWCxrQ0FBc0JXLENBQXRCLEVBQXlCZixVQUF6QixHQUFzQzdCLEtBQUs4QixvQkFBTCxDQUEwQmdDLFVBQTFCLENBQXRDO0FBQ0E3QixrQ0FBc0JXLENBQXRCLEVBQXlCYixRQUF6QixHQUFvQy9CLEtBQUs4QixvQkFBTCxDQUEwQmlDLFFBQTFCLENBQXBDO0FBQ0EsZ0JBQUlsQixxQkFBcUIsTUFBTWxFLEdBQUdVLFlBQUgsQ0FBZ0IsOEJBQWhCLEVBQWdENEMsc0JBQXNCVyxDQUF0QixDQUFoRCxDQUEvQjs7QUFFQSxnQkFBSUMsbUJBQW1CMUMsTUFBbkIsR0FBNEIsQ0FBaEMsRUFBbUM7QUFDbEMsa0JBQUssSUFBSTJDLE1BQUksQ0FBUixFQUFXQyxNQUFJRixtQkFBbUIxQyxNQUF2QyxFQUErQzJDLE1BQUlDLEdBQW5ELEVBQXNERCxLQUF0RCxFQUEyRDtBQUMxRCxrQkFBSUEsUUFBTSxDQUFWLEVBQWE7QUFDWkQsa0NBQW1CQyxHQUFuQixFQUFzQkosWUFBdEIsR0FBcUMsQ0FBckM7QUFDQSxlQUZELE1BRU87QUFDTixtQkFBSU0sWUFBWSxDQUFoQjtBQUNBLG1CQUFJSCxtQkFBbUJDLEdBQW5CLEVBQXNCdkMsa0JBQXRCLElBQTRDLENBQTVDLElBQWlEc0MsbUJBQW1CQyxNQUFJLENBQXZCLEVBQTBCdkMsa0JBQTFCLElBQWdELENBQXJHLEVBQXdHO0FBQ3ZHeUMsNEJBQVksQ0FBQ0gsbUJBQW1CQyxHQUFuQixFQUFzQnZDLGtCQUF0QixHQUEyQ3NDLG1CQUFtQkMsTUFBSSxDQUF2QixFQUEwQnZDLGtCQUF0RSxJQUE0RixJQUF4RztBQUNBOztBQUVEc0Msa0NBQW1CQyxHQUFuQixFQUFzQkosWUFBdEIsR0FBcUMxQyxLQUFLaUQsV0FBTCxDQUFpQkQsU0FBakIsRUFBNEIsQ0FBNUIsQ0FBckM7QUFDQTtBQUNEO0FBQ0RpQixnQ0FBbUJmLE9BQU9DLE1BQVAsQ0FBYyw2QkFBSWMsZ0JBQUosc0JBQXlCcEIsa0JBQXpCLEdBQTZDTyxNQUE3QyxDQUFvRCxVQUFDQyxHQUFELFNBQTJFO0FBQUEsa0JBQW5FZCxXQUFtRSxTQUFuRUEsV0FBbUU7QUFBQSxrQkFBdERFLFNBQXNELFNBQXREQSxTQUFzRDtBQUFBLGtCQUEzQzdCLFdBQTJDLFNBQTNDQSxXQUEyQztBQUFBLGtCQUE5QjhCLFlBQThCLFNBQTlCQSxZQUE4QjtBQUFBLGtCQUFoQkMsU0FBZ0IsU0FBaEJBLFNBQWdCOztBQUMvSlUsa0JBQUlkLFdBQUosSUFBbUI7QUFDbEJBLHVDQURrQjtBQUVsQkUsbUNBRmtCO0FBR2xCN0IsNEJBQWFaLEtBQUtpRCxXQUFMLENBQWtCLENBQUNJLElBQUlkLFdBQUosSUFBbUJjLElBQUlkLFdBQUosRUFBaUIzQixXQUFwQyxHQUFrRCxDQUFuRCxJQUF3REEsV0FBMUUsRUFBd0YsQ0FBeEYsQ0FISztBQUlsQjhCLDZCQUFjMUMsS0FBS2lELFdBQUwsQ0FBa0IsQ0FBQ0ksSUFBSWQsV0FBSixJQUFtQmMsSUFBSWQsV0FBSixFQUFpQkcsWUFBcEMsR0FBbUQsQ0FBcEQsSUFBeURBLFlBQTNFLEVBQTBGLENBQTFGLENBSkk7QUFLbEJDO0FBTGtCLGVBQW5CO0FBT0EscUJBQU9VLEdBQVA7QUFDQSxjQVRnQyxFQVM5QixFQVQ4QixDQUFkLENBQW5CO0FBVUE7QUFDRDtBQUNEOztBQUVELCtDQUFnQjFCLElBQWhCLDRDQUF3QnNDLGdCQUF4QjtBQUVBO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFJeEYsTUFBTXlELGNBQU4sSUFBd0IsQ0FBNUIsRUFBK0I7QUFDOUIsY0FBSyxJQUFJVCxNQUFJLENBQWIsRUFBZ0JBLE1BQUksQ0FBcEIsRUFBdUJBLEtBQXZCLEVBQTRCO0FBQUE7O0FBQzNCLGNBQUk2QixZQUFZLEVBQWhCO0FBQ0EsY0FBSTdCLFFBQU0sQ0FBVixFQUFhO0FBQ1o2Qix1QkFBWSxzQkFBT3RELEtBQUtnRSxPQUFMLENBQWFoRSxLQUFLOEIsb0JBQUwsQ0FBMEJyRCxNQUFNc0QsUUFBaEMsQ0FBYixFQUF3RCxDQUFDLENBQXpELENBQVAsRUFBb0VwQixNQUFwRSxDQUEyRSxrQkFBM0UsQ0FBWjtBQUNBLGdCQUFLLElBQUlULE1BQUksQ0FBUixFQUFXd0IsUUFBTUYsY0FBY3JCLE1BQXBDLEVBQTRDRCxNQUFJd0IsS0FBaEQsRUFBcUR4QixLQUFyRCxFQUEwRDtBQUN6RHNCLDBCQUFjdEIsR0FBZCxFQUFpQjZCLFFBQWpCLEdBQTRCLHNCQUFPL0IsS0FBS2dFLE9BQUwsQ0FBYWhFLEtBQUs4QixvQkFBTCxDQUEwQnJELE1BQU1zRCxRQUFoQyxDQUFiLEVBQXdELENBQUMsQ0FBekQsQ0FBUCxFQUFvRXBCLE1BQXBFLENBQTJFLGtCQUEzRSxDQUE1QjtBQUNBO0FBQ0QsV0FMRCxNQUtPO0FBQ04yQyx1QkFBWSxzQkFBT3RELEtBQUtnRSxPQUFMLENBQWFoRSxLQUFLOEIsb0JBQUwsQ0FBMEJyRCxNQUFNb0QsVUFBaEMsQ0FBYixFQUEwREosR0FBMUQsQ0FBUCxFQUFxRWQsTUFBckUsQ0FBNEUsa0JBQTVFLENBQVo7QUFDQSxnQkFBSyxJQUFJVCxNQUFJLENBQVIsRUFBV3dCLFFBQU1GLGNBQWNyQixNQUFwQyxFQUE0Q0QsTUFBSXdCLEtBQWhELEVBQXFEeEIsS0FBckQsRUFBMEQ7QUFDekRzQiwwQkFBY3RCLEdBQWQsRUFBaUIyQixVQUFqQixHQUE4QixzQkFBTzdCLEtBQUtnRSxPQUFMLENBQWFoRSxLQUFLOEIsb0JBQUwsQ0FBMEJyRCxNQUFNb0QsVUFBaEMsQ0FBYixFQUEwREosR0FBMUQsQ0FBUCxFQUFxRWQsTUFBckUsQ0FBNEUsa0JBQTVFLENBQTlCO0FBQ0FhLDBCQUFjdEIsR0FBZCxFQUFpQjZCLFFBQWpCLEdBQTRCLHNCQUFPL0IsS0FBS2dFLE9BQUwsQ0FBYWhFLEtBQUs4QixvQkFBTCxDQUEwQnJELE1BQU1vRCxVQUFoQyxDQUFiLEVBQTBESixHQUExRCxDQUFQLEVBQXFFZCxNQUFyRSxDQUE0RSxrQkFBNUUsQ0FBNUI7QUFDQTtBQUNEOztBQUVELGNBQUl1RCxpQkFBZ0IsTUFBTXZGLEdBQUdVLFlBQUgsQ0FBZ0IsdUNBQWhCLEVBQXlELEVBQUVtQyw0QkFBRixFQUF6RCxDQUExQjtBQUNBLGNBQUkwQyxlQUFjL0QsTUFBZCxHQUF1QixDQUEzQixFQUE4QjtBQUM3QixnQkFBSyxJQUFJc0IsTUFBSSxDQUFSLEVBQVdDLFFBQU13QyxlQUFjL0QsTUFBcEMsRUFBNENzQixNQUFJQyxLQUFoRCxFQUFxREQsS0FBckQsRUFBMEQ7QUFDekQsZ0JBQUlBLFFBQU0sQ0FBVixFQUFhO0FBQ1p5Qyw0QkFBY3pDLEdBQWQsRUFBaUJpQixZQUFqQixHQUFnQyxDQUFoQztBQUNBLGFBRkQsTUFFTztBQUNOLGlCQUFJTSxhQUFZLENBQWhCO0FBQ0EsaUJBQUdrQixlQUFjekMsR0FBZCxFQUFpQmxCLGtCQUFqQixHQUFzQyxDQUF0QyxJQUEyQzJELGVBQWN6QyxNQUFJLENBQWxCLEVBQXFCbEIsa0JBQXJCLEdBQTBDLENBQXhGLEVBQTBGO0FBQ3pGeUMsMkJBQVloRCxLQUFLaUQsV0FBTCxDQUFrQmlCLGVBQWN6QyxHQUFkLEVBQWlCbEIsa0JBQWpCLEdBQXNDMkQsZUFBY3pDLE1BQUksQ0FBbEIsRUFBcUJsQixrQkFBN0UsRUFBa0csQ0FBbEcsQ0FBWjtBQUNBO0FBQ0QyRCw0QkFBY3pDLEdBQWQsRUFBaUJpQixZQUFqQixHQUFnQzFDLEtBQUtpRCxXQUFMLENBQWtCRCxhQUFZLElBQVosR0FBbUIsQ0FBbkIsR0FBdUJBLFVBQXpDLEVBQXFELENBQXJELENBQWhDO0FBQ0E7QUFDRDtBQUNEOztBQUVEO0FBQ0EsY0FBSU8sa0JBQWtCLHNCQUFPRCxTQUFQLEVBQWtCM0MsTUFBbEIsQ0FBeUIsa0JBQXpCLENBQXRCO0FBQ0EsY0FBSTZDLG1CQUFvQixFQUF4QjtBQUNBLGVBQUssSUFBSWxCLE1BQUksQ0FBYixFQUFnQkEsT0FBSyxFQUFyQixFQUF5QkEsS0FBekIsRUFBOEI7QUFDN0JrQiw0QkFBa0I3QixJQUFsQixDQUF1QjtBQUN0QlkseUJBQWEsc0JBQU9nQixlQUFQLEVBQXdCZixHQUF4QixDQUE0QixLQUFLRixHQUFqQyxFQUFvQyxTQUFwQyxFQUErQzNCLE1BQS9DLENBQXNELGtCQUF0RCxDQURTO0FBRXRCOEIsdUJBQVcsc0JBQU9jLGVBQVAsRUFBd0JmLEdBQXhCLENBQTRCLEtBQUtGLEdBQWpDLEVBQW9DLFNBQXBDLEVBQStDM0IsTUFBL0MsQ0FBc0Qsa0JBQXRELENBRlc7QUFHdEJDLHlCQUFhLENBSFM7QUFJdEI4QiwwQkFBYyxDQUpRO0FBS3RCQyx1QkFBVztBQUxXLFlBQXZCO0FBT0E7O0FBRURhLDZCQUFvQk4sT0FBT0MsTUFBUCxDQUFjLDZCQUFJSyxnQkFBSixzQkFBMEJVLGNBQTFCLEdBQXlDZCxNQUF6QyxDQUFnRCxVQUFDQyxHQUFELFNBQTJFO0FBQUEsZUFBbkVkLFdBQW1FLFNBQW5FQSxXQUFtRTtBQUFBLGVBQXRERSxTQUFzRCxTQUF0REEsU0FBc0Q7QUFBQSxlQUEzQzdCLFdBQTJDLFNBQTNDQSxXQUEyQztBQUFBLGVBQTlCOEIsWUFBOEIsU0FBOUJBLFlBQThCO0FBQUEsZUFBaEJDLFNBQWdCLFNBQWhCQSxTQUFnQjs7QUFDNUpVLGVBQUlkLFdBQUosSUFBbUI7QUFDbEJBLG9DQURrQjtBQUVsQkUsZ0NBRmtCO0FBR2xCN0IseUJBQWFaLEtBQUtpRCxXQUFMLENBQWtCLENBQUNJLElBQUlkLFdBQUosSUFBbUJjLElBQUlkLFdBQUosRUFBaUIzQixXQUFwQyxHQUFrRCxDQUFuRCxJQUF3REEsV0FBMUUsRUFBd0YsQ0FBeEYsQ0FISztBQUlsQjhCLDBCQUFjMUMsS0FBS2lELFdBQUwsQ0FBa0IsQ0FBQ0ksSUFBSWQsV0FBSixJQUFtQmMsSUFBSWQsV0FBSixFQUFpQkcsWUFBcEMsR0FBbUQsQ0FBcEQsSUFBeURBLFlBQTNFLEVBQTBGLENBQTFGLENBSkk7QUFLbEJDO0FBTGtCLFlBQW5CO0FBT0Esa0JBQU9VLEdBQVA7QUFDQSxXQVRpQyxFQVMvQixFQVQrQixDQUFkLENBQXBCOztBQVdBLGdEQUFnQjFCLElBQWhCLDZDQUF3QjZCLGdCQUF4QjtBQUVBO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFJL0UsTUFBTXlELGNBQU4sSUFBd0IsQ0FBNUIsRUFBK0I7QUFDOUIsY0FBSyxJQUFJVCxNQUFJLENBQWIsRUFBZ0JBLE1BQUksQ0FBcEIsRUFBdUJBLEtBQXZCLEVBQTRCO0FBQUE7O0FBQzNCLGNBQUkwQyxjQUFjLEVBQWxCO0FBQ0EsY0FBSTFDLFFBQU0sQ0FBVixFQUFhO0FBQ1osZ0JBQUssSUFBSXZCLE1BQUksQ0FBUixFQUFXd0IsUUFBTUYsY0FBY3JCLE1BQXBDLEVBQTRDRCxNQUFJd0IsS0FBaEQsRUFBcUR4QixLQUFyRCxFQUEwRDtBQUN6RGlFLDBCQUFjLHNCQUFPbkUsS0FBS2dFLE9BQUwsQ0FBYWhFLEtBQUs4QixvQkFBTCxDQUEwQnJELE1BQU1zRCxRQUFoQyxDQUFiLEVBQXdELENBQUMsQ0FBekQsQ0FBUCxFQUFvRXBCLE1BQXBFLENBQTJFLGtCQUEzRSxDQUFkO0FBQ0FhLDBCQUFjdEIsR0FBZCxFQUFpQjZCLFFBQWpCLEdBQTRCLHNCQUFPL0IsS0FBS2dFLE9BQUwsQ0FBYWhFLEtBQUs4QixvQkFBTCxDQUEwQnJELE1BQU1zRCxRQUFoQyxDQUFiLEVBQXdELENBQUMsQ0FBekQsQ0FBUCxFQUFvRXBCLE1BQXBFLENBQTJFLGtCQUEzRSxDQUE1QjtBQUNBO0FBQ0QsV0FMRCxNQUtPO0FBQ04sZ0JBQUssSUFBSVQsTUFBSSxDQUFSLEVBQVd3QixRQUFNRixjQUFjckIsTUFBcEMsRUFBNENELE1BQUl3QixLQUFoRCxFQUFxRHhCLEtBQXJELEVBQTBEO0FBQ3pEaUUsMEJBQWMsc0JBQU9uRSxLQUFLZ0UsT0FBTCxDQUFhaEUsS0FBSzhCLG9CQUFMLENBQTBCckQsTUFBTW9ELFVBQWhDLENBQWIsRUFBMERKLEdBQTFELENBQVAsRUFBcUVkLE1BQXJFLENBQTRFLGtCQUE1RSxDQUFkO0FBQ0FhLDBCQUFjdEIsR0FBZCxFQUFpQjJCLFVBQWpCLEdBQThCLHNCQUFPN0IsS0FBS2dFLE9BQUwsQ0FBYWhFLEtBQUs4QixvQkFBTCxDQUEwQnJELE1BQU1vRCxVQUFoQyxDQUFiLEVBQTBESixHQUExRCxDQUFQLEVBQXFFZCxNQUFyRSxDQUE0RSxrQkFBNUUsQ0FBOUI7QUFDQWEsMEJBQWN0QixHQUFkLEVBQWlCNkIsUUFBakIsR0FBNEIsc0JBQU8vQixLQUFLZ0UsT0FBTCxDQUFhaEUsS0FBSzhCLG9CQUFMLENBQTBCckQsTUFBTW9ELFVBQWhDLENBQWIsRUFBMERKLEdBQTFELENBQVAsRUFBcUVkLE1BQXJFLENBQTRFLGtCQUE1RSxDQUE1QjtBQUNBO0FBQ0Q7O0FBR0QsY0FBSWdELGtCQUFrQixzQkFBT1EsV0FBUCxFQUFvQnhELE1BQXBCLENBQTJCLGtCQUEzQixDQUF0QjtBQUNBLGNBQUlpRCxxQkFBb0IsRUFBeEI7QUFDQSxlQUFLLElBQUl0QixNQUFJLENBQWIsRUFBZ0JBLE9BQUssRUFBckIsRUFBeUJBLEtBQXpCLEVBQThCO0FBQzdCc0IsOEJBQWtCakMsSUFBbEIsQ0FBdUI7QUFDdEJZLHlCQUFhLHNCQUFPb0IsZUFBUCxFQUF3Qm5CLEdBQXhCLENBQTRCLElBQUlGLEdBQWhDLEVBQW1DLE9BQW5DLEVBQTRDM0IsTUFBNUMsQ0FBbUQsZUFBbkQsQ0FEUztBQUV0QjhCLHVCQUFXLHNCQUFPa0IsZUFBUCxFQUF3Qm5CLEdBQXhCLENBQTRCLElBQUlGLEdBQWhDLEVBQW1DLE9BQW5DLEVBQTRDM0IsTUFBNUMsQ0FBbUQsa0JBQW5ELENBRlc7QUFHdEJDLHlCQUFhLENBSFM7QUFJdEI4QiwwQkFBYyxDQUpRO0FBS3RCQyx1QkFBVztBQUxXLFlBQXZCO0FBT0E7O0FBRUQsY0FBSXVCLGdCQUFnQixNQUFNdkYsR0FBR1UsWUFBSCxDQUFnQiw2QkFBaEIsRUFBK0MsRUFBRW1DLDRCQUFGLEVBQS9DLENBQTFCO0FBQ0EsY0FBSXFDLG9CQUFvQixNQUFNbEYsR0FBR1UsWUFBSCxDQUFnQiw2QkFBaEIsRUFBK0MsRUFBRW1DLDRCQUFGLEVBQS9DLENBQTlCO0FBQ0FvQywrQkFBb0JWLE9BQU9DLE1BQVAsQ0FBYyw2QkFBSVMsa0JBQUosc0JBQTBCTSxhQUExQixHQUF5Q2QsTUFBekMsQ0FBZ0QsVUFBQ0MsR0FBRCxTQUEyRTtBQUFBLGVBQW5FZCxXQUFtRSxTQUFuRUEsV0FBbUU7QUFBQSxlQUF0REUsU0FBc0QsU0FBdERBLFNBQXNEO0FBQUEsZUFBM0M3QixXQUEyQyxTQUEzQ0EsV0FBMkM7QUFBQSxlQUE5QjhCLFlBQThCLFNBQTlCQSxZQUE4QjtBQUFBLGVBQWhCQyxTQUFnQixTQUFoQkEsU0FBZ0I7O0FBQzVKVSxlQUFJZCxXQUFKLElBQW1CO0FBQ2xCQSxvQ0FEa0I7QUFFbEJFLGdDQUZrQjtBQUdsQjdCLHlCQUFhWixLQUFLaUQsV0FBTCxDQUFrQixDQUFDSSxJQUFJZCxXQUFKLElBQW1CYyxJQUFJZCxXQUFKLEVBQWlCM0IsV0FBcEMsR0FBa0QsQ0FBbkQsSUFBd0RBLFdBQTFFLEVBQXdGLENBQXhGLENBSEs7QUFJbEI4QiwwQkFBYzFDLEtBQUtpRCxXQUFMLENBQWtCLENBQUNJLElBQUlkLFdBQUosSUFBbUJjLElBQUlkLFdBQUosRUFBaUJHLFlBQXBDLEdBQW1ELENBQXBELElBQXlEQSxZQUEzRSxFQUEwRixDQUExRixDQUpJO0FBS2xCQztBQUxrQixZQUFuQjtBQU9BLGtCQUFPVSxHQUFQO0FBQ0EsV0FUaUMsRUFTL0IsRUFUK0IsQ0FBZCxDQUFwQjs7QUFXQSxnREFBZ0IxQixJQUFoQiw2Q0FBd0JpQyxrQkFBeEI7QUFDQTtBQUNEOztBQUVEO0FBQ0QsWUFBSyxZQUFMO0FBQ0EsWUFBSyxZQUFMO0FBQ0N0QywwQkFBa0IsTUFBTTNDLEdBQUdVLFlBQUgsQ0FBZ0Isa0NBQWhCLEVBQW9ELEVBQUVtQyw0QkFBRixFQUFwRCxDQUF4QjtBQUNBOztBQUVELFlBQUssVUFBTDtBQUNDRiwwQkFBa0IsTUFBTTNDLEdBQUdVLFlBQUgsQ0FBZ0IsZ0NBQWhCLEVBQWtELEVBQUVtQyw0QkFBRixFQUFsRCxDQUF4QjtBQUNBOztBQUVELFlBQUssVUFBTDtBQUNDLFlBQUksQ0FBQ3hCLEtBQUtvRSxPQUFMLENBQWEzRixNQUFNNEYsVUFBbkIsQ0FBRCxJQUFtQzVGLE1BQU00RixVQUFOLEdBQW1CLENBQTFELEVBQTZEO0FBQzVEL0MsMkJBQWtCLE1BQU0zQyxHQUFHVSxZQUFILENBQWdCLGdDQUFoQixFQUFrRCxFQUFFbUMsNEJBQUYsRUFBbEQsQ0FBeEI7QUFDQSxTQUZELE1BRU87QUFDTkYsMkJBQWtCLE1BQU0zQyxHQUFHVSxZQUFILENBQWdCLGlDQUFoQixFQUFtRCxFQUFFbUMsNEJBQUYsRUFBbkQsQ0FBeEI7QUFDQTtBQUNEOztBQXhYRjs7QUE0WEExQyxXQUFLbUMsTUFBTDtBQUNBdkMsZUFBUyxLQUFULEVBQWdCNEMsZUFBaEI7QUFDQSxNQXRaRCxDQXNaRSxPQUFPSixHQUFQLEVBQVk7QUFDYkMsY0FBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJGLEdBQTNCO0FBQ0FwQyxXQUFLdUMsUUFBTDtBQUNBM0MsZUFBUyxJQUFULEVBQWV3QyxHQUFmO0FBQ0E7QUFDRCxLQTVaRDtBQTZaQSxJQS9aRCxDQStaRSxPQUFPQSxHQUFQLEVBQVk7QUFDYixRQUFJcEMsSUFBSixFQUFVO0FBQ1RBLFVBQUt1QyxRQUFMO0FBQ0E7QUFDRDNDLGFBQVMsSUFBVCxFQUFld0MsR0FBZjtBQUNBO0FBQ0Q7Ozs7RUFwaUI2Qm9ELHFCOztrQkFzaUJoQjlGLGdCIiwiZmlsZSI6Ik1haW5QbGFudFNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNlcnZpY2UgZnJvbSAnLi9CYXNlU2VydmljZSc7XHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuY2xhc3MgTWFpblBsYW50U2VydmljZSBleHRlbmRzIEJhc2VTZXJ2aWNlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0KiBnZXQgZGV0YWlsIHByb2plY3QgcGFnZSBwbGFudFxyXG5cdCogQHBhcmFtIHsqfSBkYXRhIFxyXG5cdCogQHBhcmFtIHsqfSBjYWxsQmFjayBcclxuXHQqL1xyXG5cclxuXHRnZXREZXRhaWwocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciB0b3RhbEludmVydGVyT24gPSAwLCB0b3RhbEludmVydGVyID0gMDtcclxuXHRcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTWFpblBsYW50LmdldERldGFpbFwiLCBwYXJhbSk7XHJcblx0XHRcdFx0XHR2YXIgZ2V0VG90YWxJbnZlcnRlciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTWFpblBsYW50LmdldFRvdGFsSW52ZXJ0ZXJcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0aWYgKGdldFRvdGFsSW52ZXJ0ZXIpIHtcclxuXHRcdFx0XHRcdFx0dG90YWxJbnZlcnRlciA9IGdldFRvdGFsSW52ZXJ0ZXIudG90YWxJbnZlcnRlcjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR2YXIgZGV2aWNlR3JvdXAgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUGxhbnQuZ2V0R3JvdXBEZXZpY2VCeVByb2plY3RJZFwiLCB7IGlkX3Byb2plY3Q6IHJzLmlkIH0pO1xyXG5cdFx0XHRcdFx0dmFyIGlycmFkaWFuY2UgPSBbXSwgYW1iaWVudF9lbXBlcmF0dXJlID0gW10sIGVuZXJneV90b2RheSA9IDAsIGxpZmV0aW1lID0gMCwgcG93ZXJfbm93ID0gMCwgZGNfcG93ZXIgPSAwLCBjb25zdW1wdGlvbiA9IDAsIHVzaW5nX21ldGVyX2NvbnN1bXB0aW9uID0gMDtcclxuXHRcdFx0XHRcdGlmIChMaWJzLmlzQXJyYXlEYXRhKGRldmljZUdyb3VwKSkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGRldmljZUdyb3VwLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0XHRcdFx0c3dpdGNoIChkZXZpY2VHcm91cFtqXS50YWJsZV9uYW1lKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU1RQMTEwJzpcclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TVFA1MCc6XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU0hQNzUnOlxyXG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfQUJCX1BWUzEwMCc6XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpEZXZpY2UgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1haW5QbGFudC5nZXREYXRhRGV2aWNlRW5lcmd5XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9wcm9qZWN0OiBycy5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGRldmljZUdyb3VwW2pdLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGRldmljZUdyb3VwW2pdLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvYmpEZXZpY2UpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0b3RhbEludmVydGVyT24gPSB0b3RhbEludmVydGVyT24gKyBvYmpEZXZpY2UudG90YWxJbnZlcnRlck9uO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbmVyZ3lfdG9kYXkgPSBlbmVyZ3lfdG9kYXkgKyBvYmpEZXZpY2UudG9kYXlfYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxpZmV0aW1lID0gbGlmZXRpbWUgKyBvYmpEZXZpY2UubGlmZXRpbWU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJfbm93ID0gcG93ZXJfbm93ICsgb2JqRGV2aWNlLnBvd2VyX25vdztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkY19wb3dlciA9IGRjX3Bvd2VyICsgb2JqRGV2aWNlLmRjX3Bvd2VyO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TdW5ncm93X1NHMTEwQ1gnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX0dyb3dhdHRfR1c4MEtUTDMnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX3NlbnNvcl9JTVRfU2lSUzQ4NSc6XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpEZXZpY2VJcnJhZGlhbmNlID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblBsYW50LmdldERhdGFEZXZpY2VJcnJhZGlhbmNlXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9wcm9qZWN0OiBycy5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGRldmljZUdyb3VwW2pdLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGRldmljZUdyb3VwW2pdLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChMaWJzLmlzQXJyYXlEYXRhKG9iakRldmljZUlycmFkaWFuY2UpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXJyYWRpYW5jZSA9IG9iakRldmljZUlycmFkaWFuY2U7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9zZW5zb3JfSU1UX1RhUlM0ODUnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqRGV2aWNlQW1iaWVudEVtcGVyYXR1cmUgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUGxhbnQuZ2V0RGF0YURldmljZUFtYmllbnRFbXBlcmF0dXJlXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9wcm9qZWN0OiBycy5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGRldmljZUdyb3VwW2pdLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGRldmljZUdyb3VwW2pdLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChMaWJzLmlzQXJyYXlEYXRhKG9iakRldmljZUFtYmllbnRFbXBlcmF0dXJlKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFtYmllbnRfZW1wZXJhdHVyZSA9IG9iakRldmljZUFtYmllbnRFbXBlcmF0dXJlO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfZW1ldGVyX1ZpbmFzaW5vX1ZTRTNUNSc6XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpDb25zdW1wdGlvbiA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTWFpblBsYW50LmdldG1ldGVyQ29uc3VtcHRpb25cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX3Byb2plY3Q6IHJzLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZGV2aWNlR3JvdXBbal0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZGV2aWNlR3JvdXBbal0udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvYmpDb25zdW1wdGlvbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHVzaW5nX21ldGVyX2NvbnN1bXB0aW9uID0gMTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdW1wdGlvbiA9IChtb21lbnQoKS5mb3JtYXQoJ0gnKSA8IDE5KSA/IG9iakNvbnN1bXB0aW9uLmFjdGl2ZVBvd2VyIDogMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJzLnRvdGFsSW52ZXJ0ZXJPbiA9IHRvdGFsSW52ZXJ0ZXJPbjtcclxuXHRcdFx0XHRcdHJzLnRvdGFsSW52ZXJ0ZXIgPSB0b3RhbEludmVydGVyO1xyXG5cdFx0XHRcdFx0cnMuZW5lcmd5X3RvZGF5ID0gZW5lcmd5X3RvZGF5O1xyXG5cdFx0XHRcdFx0cnMubGlmZXRpbWUgPSBsaWZldGltZTtcclxuXHRcdFx0XHRcdHJzLnJldmVudWUgPSBsaWZldGltZSAqIHJzLmNvbmZpZ19yZXZlbnVlO1xyXG5cdFx0XHRcdFx0cnMuaXJyYWRpYW5jZSA9IGlycmFkaWFuY2U7XHJcblx0XHRcdFx0XHRycy50b2RheV9yZXZlbnVlID0gKGVuZXJneV90b2RheSAvIDEwMDApICogcnMuY29uZmlnX3JldmVudWU7XHJcblx0XHRcdFx0XHRycy50b3RhbF9yZXZlbnVlID0gKGxpZmV0aW1lIC8gMTAwMCkgKiBycy5jb25maWdfcmV2ZW51ZTtcclxuXHRcdFx0XHRcdHJzLnBvd2VyX25vdyA9IHBvd2VyX25vdyA+IDAgPyBwb3dlcl9ub3cgLyAxMDAwIDogMDtcclxuXHRcdFx0XHRcdHJzLmlycmFkaWFuY2UgPSBpcnJhZGlhbmNlO1xyXG5cdFx0XHRcdFx0cnMuYW1iaWVudF9lbXBlcmF0dXJlID0gYW1iaWVudF9lbXBlcmF0dXJlO1xyXG5cdFx0XHRcdFx0cnMuZGNfcG93ZXIgPSBkY19wb3dlciA+IDAgPyBkY19wb3dlciAvIDEwMDAgOiAwO1xyXG5cdFx0XHRcdFx0cnMuY29uc3VtcHRpb24gPSBjb25zdW1wdGlvbjtcclxuXHRcdFx0XHRcdHJzLnVzaW5nX21ldGVyX2NvbnN1bXB0aW9uID0gdXNpbmdfbWV0ZXJfY29uc3VtcHRpb247XHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHJzKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8qKlxyXG5cdCogZ2V0IGRldGFpbCBwcm9qZWN0IHBhZ2UgcGxhbnRcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHJcblx0Z2V0Q2hhcnREYXRhKHBhcmFtLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneVRvZGF5ID0gW107XHJcblx0XHRcdFx0XHR2YXIgZ2V0R3JvdXBJbnZlcnRlciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5QbGFudC5nZXRHcm91cERldmljZUludmVydGVyXCIsIHBhcmFtKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIWdldEdyb3VwSW52ZXJ0ZXIpIHtcclxuXHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR2YXIgZ3JvdXBJbnZlcnRlciA9IFtdO1xyXG5cdFx0XHRcdFx0aWYgKGdldEdyb3VwSW52ZXJ0ZXIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMCwgbGVuID0gZ2V0R3JvdXBJbnZlcnRlci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdGdyb3VwSW52ZXJ0ZXIucHVzaChcclxuXHRcdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aGFzaF9pZDogcGFyYW0uaGFzaF9pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXRHcm91cEludmVydGVyW2ldLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5zdGFydF9kYXRlKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZW5kX2RhdGU6IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBnZXRHcm91cEludmVydGVyW2ldLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0c3dpdGNoIChwYXJhbS5maWx0ZXJCeSkge1xyXG5cdFx0XHRcdFx0XHRjYXNlICd0b2RheSc6XHJcblx0XHRcdFx0XHRcdFx0dmFyIGdldExpc3REZXZpY2VJbnZlcnRlciA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdC8vIENoZWNrIHVzaW5nIGVtZXRlciBcclxuXHRcdFx0XHRcdFx0XHQvLyB2YXIgZ2V0TGlzdERldmljZUVtZXRlciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIlBsYW50LmdldExpc3REZXZpY2VFbWV0ZXJcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGlmKGdldExpc3REZXZpY2VFbWV0ZXIubGVuZ3RoID4gMCl7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRnZXRMaXN0RGV2aWNlSW52ZXJ0ZXIgPSBnZXRMaXN0RGV2aWNlRW1ldGVyO1xyXG5cdFx0XHRcdFx0XHRcdC8vIH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRnZXRMaXN0RGV2aWNlSW52ZXJ0ZXIgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJQbGFudC5nZXRMaXN0RGV2aWNlSW52ZXJ0ZXJcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHRcdFx0XHRnZXRMaXN0RGV2aWNlSW52ZXJ0ZXIgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUGxhbnQuZ2V0TGlzdERldmljZUludmVydGVyXCIsIHBhcmFtKTtcclxuXHRcdFx0XHRcdFx0XHQvLyA1IG1pbnV0ZXNcclxuXHRcdFx0XHRcdFx0XHRpZiAocGFyYW0uZGF0YV9zZW5kX3RpbWUgPT0gMSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gTOG6pXkgZGFuaCBzw6FjaCBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneU1lcmdlID0gW107XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBnZW5hcmV0ZSBkYXRhIDUgbXVuaXRlc1xyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IGN1ckRhdGUgPSBMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKTtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBjdXJEYXRlRm9ybWF0ID0gbW9tZW50KGN1ckRhdGUpLmZvcm1hdCgnWVlZWS1NTS1ERCAwNTowMCcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgdCA9IDA7IHQgPCAxNjg7IHQrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TWVyZ2UucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IG1vbWVudChjdXJEYXRlRm9ybWF0KS5hZGQoNSAqIHQsICdtaW51dGVzJykuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiBtb21lbnQoY3VyRGF0ZUZvcm1hdCkuYWRkKDUgKiB0LCAnbWludXRlcycpLmZvcm1hdCgnREQvTU0vWVlZWSBISDptbScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiAwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cF9kYXk6ICcnXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGlmIChnZXRMaXN0RGV2aWNlSW52ZXJ0ZXIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciB2ID0gMCwgbGVuID0gZ2V0TGlzdERldmljZUludmVydGVyLmxlbmd0aDsgdiA8IGxlbjsgdisrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Z2V0TGlzdERldmljZUludmVydGVyW3ZdLnN0YXJ0X2RhdGUgPSBMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLnN0YXJ0X2RhdGUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGdldExpc3REZXZpY2VJbnZlcnRlclt2XS5lbmRfZGF0ZSA9IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBkYXRhRW5lcmd5QnlEZXZpY2UgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUGxhbnQuZGF0YUVuZXJneUJ5RGV2aWNlXCIsIGdldExpc3REZXZpY2VJbnZlcnRlclt2XSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChkYXRhRW5lcmd5QnlEZXZpY2UubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDAsIGwgPSBkYXRhRW5lcmd5QnlEZXZpY2UubGVuZ3RoOyBrIDwgbDsgaysrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneUJ5RGV2aWNlW2tdLmFjdGl2ZUVuZXJneSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIHN1YkVuZXJneSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGRhdGFFbmVyZ3lCeURldmljZVtrXS50b2RheV9hY3RpdmVFbmVyZ3kgIT0gMCAmJiBkYXRhRW5lcmd5QnlEZXZpY2VbayAtIDFdLnRvZGF5X2FjdGl2ZUVuZXJneSAhPSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdWJFbmVyZ3kgPSAoZGF0YUVuZXJneUJ5RGV2aWNlW2tdLnRvZGF5X2FjdGl2ZUVuZXJneSAtIGRhdGFFbmVyZ3lCeURldmljZVtrIC0gMV0udG9kYXlfYWN0aXZlRW5lcmd5KSAvIDEwMDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5QnlEZXZpY2Vba10uYWN0aXZlRW5lcmd5ID0gTGlicy5yb3VuZE51bWJlcihzdWJFbmVyZ3ksIDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TWVyZ2UgPSBPYmplY3QudmFsdWVzKFsuLi5kYXRhRW5lcmd5TWVyZ2UsIC4uLmRhdGFFbmVyZ3lCeURldmljZV0ucmVkdWNlKChhY2MsIHsgdGltZV9mb3JtYXQsIHRpbWVfZnVsbCwgYWN0aXZlUG93ZXIsIGFjdGl2ZUVuZXJneSwgZ3JvdXBfZGF5IH0pID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNjW3RpbWVfZm9ybWF0XSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXI6IExpYnMucm91bmROdW1iZXIoKChhY2NbdGltZV9mb3JtYXRdID8gYWNjW3RpbWVfZm9ybWF0XS5hY3RpdmVQb3dlciA6IDApICsgYWN0aXZlUG93ZXIpLCAxKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IExpYnMucm91bmROdW1iZXIoKChhY2NbdGltZV9mb3JtYXRdID8gYWNjW3RpbWVfZm9ybWF0XS5hY3RpdmVFbmVyZ3kgOiAwKSArIGFjdGl2ZUVuZXJneSksIDEpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwX2RheVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lUb2RheSA9IGRhdGFFbmVyZ3lNZXJnZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIDE1IG1pbnV0ZXNcclxuXHRcdFx0XHRcdFx0XHRpZiAocGFyYW0uZGF0YV9zZW5kX3RpbWUgPT0gMikge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZ2VuYXJldGUgZGF0YSAxNSBtdW5pdGVzXHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgY3VyRGF0ZTE1ID0gTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSk7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgY3VyRGF0ZUZvcm1hdDE1ID0gbW9tZW50KGN1ckRhdGUxNSkuZm9ybWF0KCdZWVlZLU1NLUREIDA1OjAwJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUVuZXJneU1lcmdlMTUgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IHQgPSAwOyB0IDw9IDU2OyB0KyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1lcmdlMTUucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IG1vbWVudChjdXJEYXRlRm9ybWF0MTUpLmFkZCgxNSAqIHQsICdtaW51dGVzJykuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiBtb21lbnQoY3VyRGF0ZUZvcm1hdDE1KS5hZGQoMTUgKiB0LCAnbWludXRlcycpLmZvcm1hdCgnREQvTU0vWVlZWSBISDptbScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiAwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cF9kYXk6ICcnXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRpZihnZXRMaXN0RGV2aWNlSW52ZXJ0ZXIubGVuZ3RoID4gMCl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIHYgPSAwLCBsZW4gPSBnZXRMaXN0RGV2aWNlSW52ZXJ0ZXIubGVuZ3RoOyB2IDwgbGVuOyB2KyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRnZXRMaXN0RGV2aWNlSW52ZXJ0ZXJbdl0uc3RhcnRfZGF0ZSA9IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Z2V0TGlzdERldmljZUludmVydGVyW3ZdLmVuZF9kYXRlID0gTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGRhdGFFbmVyZ3lUb2RheTE1ID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblBsYW50LmRhdGFFbmVyZ3kxNU1pbnV0ZXNCeURldmljZVwiLCBnZXRMaXN0RGV2aWNlSW52ZXJ0ZXJbdl0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZGF0YUVuZXJneVRvZGF5MTUubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDAsIGwgPSBkYXRhRW5lcmd5VG9kYXkxNS5sZW5ndGg7IGsgPCBsOyBrKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGsgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5VG9kYXkxNVtrXS5hY3RpdmVFbmVyZ3kgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBzdWJFbmVyZ3kgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChkYXRhRW5lcmd5VG9kYXkxNVtrXS50b2RheV9hY3RpdmVFbmVyZ3kgPiAwICYmIGRhdGFFbmVyZ3lUb2RheTE1W2sgLSAxXS50b2RheV9hY3RpdmVFbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdWJFbmVyZ3kgPSAoZGF0YUVuZXJneVRvZGF5MTVba10udG9kYXlfYWN0aXZlRW5lcmd5IC0gZGF0YUVuZXJneVRvZGF5MTVbayAtIDFdLnRvZGF5X2FjdGl2ZUVuZXJneSkgLyAxMDAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneVRvZGF5MTVba10uYWN0aXZlRW5lcmd5ID0gTGlicy5yb3VuZE51bWJlcihzdWJFbmVyZ3ksIDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TWVyZ2UxNSA9IE9iamVjdC52YWx1ZXMoWy4uLmRhdGFFbmVyZ3lNZXJnZTE1LCAuLi5kYXRhRW5lcmd5VG9kYXkxNV0ucmVkdWNlKChhY2MsIHsgdGltZV9mb3JtYXQsIHRpbWVfZnVsbCwgYWN0aXZlUG93ZXIsIGFjdGl2ZUVuZXJneSwgZ3JvdXBfZGF5IH0pID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNjW3RpbWVfZm9ybWF0XSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXI6IExpYnMucm91bmROdW1iZXIoKChhY2NbdGltZV9mb3JtYXRdID8gYWNjW3RpbWVfZm9ybWF0XS5hY3RpdmVQb3dlciA6IDApICsgYWN0aXZlUG93ZXIpLCAxKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IExpYnMucm91bmROdW1iZXIoKChhY2NbdGltZV9mb3JtYXRdID8gYWNjW3RpbWVfZm9ybWF0XS5hY3RpdmVFbmVyZ3kgOiAwKSArIGFjdGl2ZUVuZXJneSksIDEpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwX2RheVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyB2YXIgZGF0YUVuZXJneVRvZGF5MTUgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUGxhbnQuZ2V0RGF0YUVuZXJneUZpZnRlZW5NaW51dGVzXCIsIHsgZ3JvdXBJbnZlcnRlciB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIC8vIGNvbnNvbGUubG9nKGRhdGFFbmVyZ3lUb2RheTE1KTtcclxuXHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gaWYgKGRhdGFFbmVyZ3lUb2RheTE1Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IGRhdGFFbmVyZ3lUb2RheTE1Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0aWYgKGkgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGRhdGFFbmVyZ3lUb2RheTE1W2ldLmFjdGl2ZUVuZXJneSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGxldCBzdWJFbmVyZ3kgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWYgKGRhdGFFbmVyZ3lUb2RheTE1W2ldLnRvZGF5X2FjdGl2ZUVuZXJneSAhPSAwICYmIGRhdGFFbmVyZ3lUb2RheTE1W2kgLSAxXS50b2RheV9hY3RpdmVFbmVyZ3kgIT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRzdWJFbmVyZ3kgPSBMaWJzLnJvdW5kTnVtYmVyKChkYXRhRW5lcmd5VG9kYXkxNVtpXS50b2RheV9hY3RpdmVFbmVyZ3kgLSBkYXRhRW5lcmd5VG9kYXkxNVtpIC0gMV0udG9kYXlfYWN0aXZlRW5lcmd5KSwgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGNvbnNvbGUubG9nKGRhdGFFbmVyZ3lUb2RheTE1W2ldLnRpbWVfZm9ybWF0LCBcIjogXCIsIGRhdGFFbmVyZ3lUb2RheTE1W2ldLnRvZGF5X2FjdGl2ZUVuZXJneSwgXCIgLTogXCIsIGRhdGFFbmVyZ3lUb2RheTE1W2ktMV0udGltZV9mb3JtYXQsIFwiIFwiLCBkYXRhRW5lcmd5VG9kYXkxNVtpIC0gMV0udG9kYXlfYWN0aXZlRW5lcmd5KTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGRhdGFFbmVyZ3lUb2RheTE1W2ldLmFjdGl2ZUVuZXJneSA9IExpYnMucm91bmROdW1iZXIoKHN1YkVuZXJneSA+IDUwMDAgPyAwIDogc3ViRW5lcmd5KSwgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZGF0YUVuZXJneU1lcmdlMTUgPSBPYmplY3QudmFsdWVzKFsuLi5kYXRhRW5lcmd5TWVyZ2UxNSwgLi4uZGF0YUVuZXJneVRvZGF5MTVdLnJlZHVjZSgoYWNjLCB7IHRpbWVfZm9ybWF0LCB0aW1lX2Z1bGwsIGFjdGl2ZVBvd2VyLCBhY3RpdmVFbmVyZ3ksIGdyb3VwX2RheSB9KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdGFjY1t0aW1lX2Zvcm1hdF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0dGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0dGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdGFjdGl2ZVBvd2VyOiBMaWJzLnJvdW5kTnVtYmVyKCgoYWNjW3RpbWVfZm9ybWF0XSA/IGFjY1t0aW1lX2Zvcm1hdF0uYWN0aXZlUG93ZXIgOiAwKSArIGFjdGl2ZVBvd2VyKSwgMSksXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0YWN0aXZlRW5lcmd5OiBMaWJzLnJvdW5kTnVtYmVyKCgoYWNjW3RpbWVfZm9ybWF0XSA/IGFjY1t0aW1lX2Zvcm1hdF0uYWN0aXZlRW5lcmd5IDogMCkgKyBhY3RpdmVFbmVyZ3kpLCAxKSxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRncm91cF9kYXlcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdC8vIH0sIHt9KSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneVRvZGF5ID0gZGF0YUVuZXJneU1lcmdlMTU7XHJcblxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gMSBob3VyXHJcblx0XHRcdFx0XHRcdFx0aWYgKHBhcmFtLmRhdGFfc2VuZF90aW1lID09IDMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGdlbmFyZXRlIGRhdGEgMSBob3VyXHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgY3VyRGF0ZTFoID0gTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSk7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgY3VyRGF0ZUZvcm1hdDFoID0gbW9tZW50KGN1ckRhdGUxaCkuZm9ybWF0KCdZWVlZLU1NLUREIDA1OjAwJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUVuZXJneU1lcmdlMWggPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IHQgPSAwOyB0IDw9IDE0OyB0KyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1lcmdlMWgucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IG1vbWVudChjdXJEYXRlRm9ybWF0MWgpLmFkZCgxICogdCwgJ2hvdXJzJykuZm9ybWF0KCdZWVlZLU1NLUREIEhIJyksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiBtb21lbnQoY3VyRGF0ZUZvcm1hdDFoKS5hZGQoMSAqIHQsICdob3VycycpLmZvcm1hdCgnREQvTU0vWVlZWSBISDptbScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiAwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cF9kYXk6ICcnXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneVRvZGF5MWggPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUGxhbnQuZ2V0RGF0YUVuZXJneUhvdXJcIiwgeyBncm91cEludmVydGVyIH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1lcmdlMWggPSBPYmplY3QudmFsdWVzKFsuLi5kYXRhRW5lcmd5TWVyZ2UxaCwgLi4uZGF0YUVuZXJneVRvZGF5MWhdLnJlZHVjZSgoYWNjLCB7IHRpbWVfZm9ybWF0LCB0aW1lX2Z1bGwsIGFjdGl2ZVBvd2VyLCBhY3RpdmVFbmVyZ3ksIGdyb3VwX2RheSB9KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGFjY1t0aW1lX2Zvcm1hdF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiBMaWJzLnJvdW5kTnVtYmVyKCgoYWNjW3RpbWVfZm9ybWF0XSA/IGFjY1t0aW1lX2Zvcm1hdF0uYWN0aXZlUG93ZXIgOiAwKSArIGFjdGl2ZVBvd2VyKSwgMSksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiBMaWJzLnJvdW5kTnVtYmVyKCgoYWNjW3RpbWVfZm9ybWF0XSA/IGFjY1t0aW1lX2Zvcm1hdF0uYWN0aXZlRW5lcmd5IDogMCkgKyBhY3RpdmVFbmVyZ3kpLCAxKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cF9kYXlcclxuXHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdH0sIHt9KSk7XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lUb2RheSA9IGRhdGFFbmVyZ3lNZXJnZTFoO1xyXG5cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlICczX2RheSc6XHJcblx0XHRcdFx0XHRcdFx0Ly8gNSBtaW51dGVzXHJcblx0XHRcdFx0XHRcdFx0aWYgKHBhcmFtLmRhdGFfc2VuZF90aW1lID09IDEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGxldCBzdGFydERhdGU1ID0gJycsIGVuZERhdGU1ID0gJyc7XHJcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoaSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0RGF0ZTUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpLCAtMikpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVuZERhdGU1ID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKSwgLTIpKS5mb3JtYXQoJ1lZWVktTU0tREQgMTk6MDAnKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBqID0gMCwgbGVuID0gZ3JvdXBJbnZlcnRlci5sZW5ndGg7IGogPCBsZW47IGorKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBJbnZlcnRlcltqXS5lbmRfZGF0ZSA9IG1vbWVudChMaWJzLmFkZERheXMoTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSksIC0yKSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0RGF0ZTUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksIGkpKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbmREYXRlNSA9IG1vbWVudChMaWJzLmFkZERheXMoTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5zdGFydF9kYXRlKSwgaSkpLmZvcm1hdCgnWVlZWS1NTS1ERCAxOTowMCcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGogPSAwLCBsZW4gPSBncm91cEludmVydGVyLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cEludmVydGVyW2pdLnN0YXJ0X2RhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksIGkpKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwSW52ZXJ0ZXJbal0uZW5kX2RhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksIGkpKS5mb3JtYXQoJ1lZWVktTU0tREQgMTk6MDAnKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBnZXRMaXN0RGV2aWNlSW52ZXJ0ZXIgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUGxhbnQuZ2V0TGlzdERldmljZUludmVydGVyXCIsIHBhcmFtKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGRhdGFFbmVyZ3lNZXJnZTUgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGN1ckRhdGVGb3JtYXQgPSBtb21lbnQoc3RhcnREYXRlNSkuZm9ybWF0KCdZWVlZLU1NLUREIDA1OjAwJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIHQgPSAwOyB0IDw9IDE2ODsgdCsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1lcmdlNS5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiBtb21lbnQoY3VyRGF0ZUZvcm1hdCkuYWRkKDUgKiB0LCAnbWludXRlcycpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiBtb21lbnQoY3VyRGF0ZUZvcm1hdCkuYWRkKDUgKiB0LCAnbWludXRlcycpLmZvcm1hdCgnREQvTU0vWVlZWSBISDptbScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXI6IDAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IDAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cF9kYXk6ICcnXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChnZXRMaXN0RGV2aWNlSW52ZXJ0ZXIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIHYgPSAwLCBsZW4gPSBnZXRMaXN0RGV2aWNlSW52ZXJ0ZXIubGVuZ3RoOyB2IDwgbGVuOyB2KyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGdldExpc3REZXZpY2VJbnZlcnRlclt2XS5zdGFydF9kYXRlID0gTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShzdGFydERhdGU1KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGdldExpc3REZXZpY2VJbnZlcnRlclt2XS5lbmRfZGF0ZSA9IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUoZW5kRGF0ZTUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGRhdGFFbmVyZ3lCeURldmljZSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5QbGFudC5kYXRhRW5lcmd5QnlEZXZpY2VcIiwgZ2V0TGlzdERldmljZUludmVydGVyW3ZdKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZGF0YUVuZXJneUJ5RGV2aWNlLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDAsIGwgPSBkYXRhRW5lcmd5QnlEZXZpY2UubGVuZ3RoOyBrIDwgbDsgaysrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGsgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lCeURldmljZVtrXS5hY3RpdmVFbmVyZ3kgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgc3ViRW5lcmd5ID0gMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChkYXRhRW5lcmd5QnlEZXZpY2Vba10udG9kYXlfYWN0aXZlRW5lcmd5ICE9IDAgJiYgZGF0YUVuZXJneUJ5RGV2aWNlW2sgLSAxXS50b2RheV9hY3RpdmVFbmVyZ3kgIT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdWJFbmVyZ3kgPSAoZGF0YUVuZXJneUJ5RGV2aWNlW2tdLnRvZGF5X2FjdGl2ZUVuZXJneSAtIGRhdGFFbmVyZ3lCeURldmljZVtrIC0gMV0udG9kYXlfYWN0aXZlRW5lcmd5KSAvIDEwMDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneUJ5RGV2aWNlW2tdLmFjdGl2ZUVuZXJneSA9IExpYnMucm91bmROdW1iZXIoc3ViRW5lcmd5LCAxKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1lcmdlNSA9IE9iamVjdC52YWx1ZXMoWy4uLmRhdGFFbmVyZ3lNZXJnZTUsIC4uLmRhdGFFbmVyZ3lCeURldmljZV0ucmVkdWNlKChhY2MsIHsgdGltZV9mb3JtYXQsIHRpbWVfZnVsbCwgYWN0aXZlUG93ZXIsIGFjdGl2ZUVuZXJneSwgZ3JvdXBfZGF5IH0pID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY2NbdGltZV9mb3JtYXRdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogTGlicy5yb3VuZE51bWJlcigoKGFjY1t0aW1lX2Zvcm1hdF0gPyBhY2NbdGltZV9mb3JtYXRdLmFjdGl2ZVBvd2VyIDogMCkgKyBhY3RpdmVQb3dlciksIDEpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiBMaWJzLnJvdW5kTnVtYmVyKCgoYWNjW3RpbWVfZm9ybWF0XSA/IGFjY1t0aW1lX2Zvcm1hdF0uYWN0aXZlRW5lcmd5IDogMCkgKyBhY3RpdmVFbmVyZ3kpLCAxKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwX2RheVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lUb2RheS5wdXNoKC4uLmRhdGFFbmVyZ3lNZXJnZTUpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIDE1IG1pbnV0ZXNcclxuXHRcdFx0XHRcdFx0XHRpZiAocGFyYW0uZGF0YV9zZW5kX3RpbWUgPT0gMikge1xyXG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGN1ckRhdGUxNSA9ICcnO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoaSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGN1ckRhdGUxNSA9IG1vbWVudChMaWJzLmFkZERheXMoTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSksIC0yKSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaiA9IDAsIGxlbiA9IGdyb3VwSW52ZXJ0ZXIubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwSW52ZXJ0ZXJbal0uZW5kX2RhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpLCAtMikpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJEYXRlMTUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksIGkpKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBqID0gMCwgbGVuID0gZ3JvdXBJbnZlcnRlci5sZW5ndGg7IGogPCBsZW47IGorKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBJbnZlcnRlcltqXS5zdGFydF9kYXRlID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLnN0YXJ0X2RhdGUpLCBpKSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cEludmVydGVyW2pdLmVuZF9kYXRlID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLnN0YXJ0X2RhdGUpLCBpKSkuZm9ybWF0KCdZWVlZLU1NLUREIDE5OjAwJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUVuZXJneUFyciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5QbGFudC5nZXREYXRhRW5lcmd5RmlmdGVlbk1pbnV0ZXNcIiwgeyBncm91cEludmVydGVyIH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoZGF0YUVuZXJneUFyci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IGRhdGFFbmVyZ3lBcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lBcnJbaV0uYWN0aXZlRW5lcmd5ID0gMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBzdWJFbmVyZ3kgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihkYXRhRW5lcmd5QXJyW2ldLnRvZGF5X2FjdGl2ZUVuZXJneSA+IDAgJiYgZGF0YUVuZXJneUFycltpIC0gMV0udG9kYXlfYWN0aXZlRW5lcmd5ID4gMCl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3ViRW5lcmd5ID0gTGlicy5yb3VuZE51bWJlcigoZGF0YUVuZXJneUFycltpXS50b2RheV9hY3RpdmVFbmVyZ3kgLSBkYXRhRW5lcmd5QXJyW2kgLSAxXS50b2RheV9hY3RpdmVFbmVyZ3kpLCAxKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5QXJyW2ldLmFjdGl2ZUVuZXJneSA9IExpYnMucm91bmROdW1iZXIoKHN1YkVuZXJneSA+IDUwMDAgPyAwIDogc3ViRW5lcmd5KSwgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBnZW5hcmV0ZSBkYXRhIDE1IG11bml0ZXNcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGN1ckRhdGVGb3JtYXQxNSA9IG1vbWVudChjdXJEYXRlMTUpLmZvcm1hdCgnWVlZWS1NTS1ERCAwNTowMCcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUVuZXJneU1lcmdlMTUgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgdCA9IDA7IHQgPD0gNTY7IHQrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNZXJnZTE1LnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IG1vbWVudChjdXJEYXRlRm9ybWF0MTUpLmFkZCgxNSAqIHQsICdtaW51dGVzJykuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IG1vbWVudChjdXJEYXRlRm9ybWF0MTUpLmFkZCgxNSAqIHQsICdtaW51dGVzJykuZm9ybWF0KCdERC9NTS9ZWVlZIEhIOm1tJyksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwX2RheTogJydcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1lcmdlMTUgPSBPYmplY3QudmFsdWVzKFsuLi5kYXRhRW5lcmd5TWVyZ2UxNSwgLi4uZGF0YUVuZXJneUFycl0ucmVkdWNlKChhY2MsIHsgdGltZV9mb3JtYXQsIHRpbWVfZnVsbCwgYWN0aXZlUG93ZXIsIGFjdGl2ZUVuZXJneSwgZ3JvdXBfZGF5IH0pID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY2NbdGltZV9mb3JtYXRdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogTGlicy5yb3VuZE51bWJlcigoKGFjY1t0aW1lX2Zvcm1hdF0gPyBhY2NbdGltZV9mb3JtYXRdLmFjdGl2ZVBvd2VyIDogMCkgKyBhY3RpdmVQb3dlciksIDEpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiBMaWJzLnJvdW5kTnVtYmVyKCgoYWNjW3RpbWVfZm9ybWF0XSA/IGFjY1t0aW1lX2Zvcm1hdF0uYWN0aXZlRW5lcmd5IDogMCkgKyBhY3RpdmVFbmVyZ3kpLCAxKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwX2RheVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lUb2RheS5wdXNoKC4uLmRhdGFFbmVyZ3lNZXJnZTE1KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyAxIGhvdXJcclxuXHRcdFx0XHRcdFx0XHRpZiAocGFyYW0uZGF0YV9zZW5kX3RpbWUgPT0gMykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IHN0YXJ0RGF0ZTFoID0gJyc7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChpID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaiA9IDAsIGxlbiA9IGdyb3VwSW52ZXJ0ZXIubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0RGF0ZTFoID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKSwgLTIpKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwSW52ZXJ0ZXJbal0uZW5kX2RhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpLCAtMikpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBqID0gMCwgbGVuID0gZ3JvdXBJbnZlcnRlci5sZW5ndGg7IGogPCBsZW47IGorKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnREYXRlMWggPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksIGkpKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwSW52ZXJ0ZXJbal0uc3RhcnRfZGF0ZSA9IG1vbWVudChMaWJzLmFkZERheXMoTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5zdGFydF9kYXRlKSwgaSkpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBJbnZlcnRlcltqXS5lbmRfZGF0ZSA9IG1vbWVudChMaWJzLmFkZERheXMoTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5zdGFydF9kYXRlKSwgaSkpLmZvcm1hdCgnWVlZWS1NTS1ERCAxOTowMCcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBjdXJEYXRlRm9ybWF0MWggPSBtb21lbnQoc3RhcnREYXRlMWgpLmZvcm1hdCgnWVlZWS1NTS1ERCAwNTowMCcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUVuZXJneU1lcmdlMWggPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgdCA9IDA7IHQgPD0gMTQ7IHQrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNZXJnZTFoLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IG1vbWVudChjdXJEYXRlRm9ybWF0MWgpLmFkZCgxICogdCwgJ2hvdXJzJykuZm9ybWF0KCdZWVlZLU1NLUREIEhIJyksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IG1vbWVudChjdXJEYXRlRm9ybWF0MWgpLmFkZCgxICogdCwgJ2hvdXJzJykuZm9ybWF0KCdERC9NTS9ZWVlZIEhIOm1tJyksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwX2RheTogJydcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGRhdGFFbmVyZ3lBcnIgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUGxhbnQuZ2V0RGF0YUVuZXJneUhvdXJcIiwgeyBncm91cEludmVydGVyIH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneVRvZGF5MWggPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUGxhbnQuZ2V0RGF0YUVuZXJneUhvdXJcIiwgeyBncm91cEludmVydGVyIH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TWVyZ2UxaCA9IE9iamVjdC52YWx1ZXMoWy4uLmRhdGFFbmVyZ3lNZXJnZTFoLCAuLi5kYXRhRW5lcmd5QXJyXS5yZWR1Y2UoKGFjYywgeyB0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBhY3RpdmVQb3dlciwgYWN0aXZlRW5lcmd5LCBncm91cF9kYXkgfSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjY1t0aW1lX2Zvcm1hdF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiBMaWJzLnJvdW5kTnVtYmVyKCgoYWNjW3RpbWVfZm9ybWF0XSA/IGFjY1t0aW1lX2Zvcm1hdF0uYWN0aXZlUG93ZXIgOiAwKSArIGFjdGl2ZVBvd2VyKSwgMSksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IExpYnMucm91bmROdW1iZXIoKChhY2NbdGltZV9mb3JtYXRdID8gYWNjW3RpbWVfZm9ybWF0XS5hY3RpdmVFbmVyZ3kgOiAwKSArIGFjdGl2ZUVuZXJneSksIDEpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBfZGF5XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneVRvZGF5LnB1c2goLi4uZGF0YUVuZXJneU1lcmdlMWgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ2xhc3RfbW9udGgnOlxyXG5cdFx0XHRcdFx0XHRjYXNlICd0aGlzX21vbnRoJzpcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5VG9kYXkgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUGxhbnQuZ2V0RGF0YUVuZXJneVRoaXNNb250aFwiLCB7IGdyb3VwSW52ZXJ0ZXIgfSk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRjYXNlICcxMl9tb250aCc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneVRvZGF5ID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblBsYW50LmdldERhdGFFbmVyZ3kxMk1vbnRoXCIsIHsgZ3JvdXBJbnZlcnRlciB9KTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdGNhc2UgJ2xpZmV0aW1lJzpcclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhwYXJhbS50b3RhbF95ZWFyKSAmJiBwYXJhbS50b3RhbF95ZWFyIDwgMSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneVRvZGF5ID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblBsYW50LmdldERhdGFFbmVyZ3kxMk1vbnRoXCIsIHsgZ3JvdXBJbnZlcnRlciB9KTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneVRvZGF5ID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblBsYW50LmdldERhdGFFbmVyZ3lMaWZldGltZVwiLCB7IGdyb3VwSW52ZXJ0ZXIgfSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGFFbmVyZ3lUb2RheSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRpZiAoY29ubikge1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBNYWluUGxhbnRTZXJ2aWNlO1xyXG4iXX0=