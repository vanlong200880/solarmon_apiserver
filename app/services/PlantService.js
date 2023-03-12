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

var PlantService = function (_BaseService) {
	_inherits(PlantService, _BaseService);

	function PlantService() {
		_classCallCheck(this, PlantService);

		return _possibleConstructorReturn(this, (PlantService.__proto__ || Object.getPrototypeOf(PlantService)).call(this));
	}

	/**
 * get detail project page plant
 * @param {*} data 
 * @param {*} callBack 
 */

	_createClass(PlantService, [{
		key: 'getDetail',
		value: function getDetail(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var totalInverterOn = 0,
						    totalInverter = 0;
						var rs = await db.queryForObject("Plant.getDetail", param);
						var getTotalInverter = await db.queryForObject("Plant.getTotalInverter", param);
						if (getTotalInverter) {
							totalInverter = getTotalInverter.totalInverter;
						}

						var deviceGroup = await db.queryForList("Plant.getGroupDeviceByProjectId", { id_project: rs.id });
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
										var objDevice = await db.queryForObject("Plant.getDataDeviceEnergy", {
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
										var objDeviceIrradiance = await db.queryForList("Plant.getDataDeviceIrradiance", {
											id_project: rs.id,
											id_device_group: deviceGroup[j].id,
											table_name: deviceGroup[j].table_name
										});
										if (Libs.isArrayData(objDeviceIrradiance)) {
											irradiance = objDeviceIrradiance;
										}
										break;
									case 'model_sensor_IMT_TaRS485':
										var objDeviceAmbientEmperature = await db.queryForList("Plant.getDataDeviceAmbientEmperature", {
											id_project: rs.id,
											id_device_group: deviceGroup[j].id,
											table_name: deviceGroup[j].table_name
										});
										if (Libs.isArrayData(objDeviceAmbientEmperature)) {
											ambient_emperature = objDeviceAmbientEmperature;
										}
										break;
									case 'model_emeter_Vinasino_VSE3T5':
										var objConsumption = await db.queryForObject("Plant.getmeterConsumption", {
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
						var getGroupInverter = await db.queryForList("Plant.getGroupDeviceInverter", param);

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
								getListDeviceInverter = await db.queryForList("Plant.getListDeviceInverter", param);
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
											var dataEnergyByDevice = await db.queryForList("Plant.dataEnergyByDevice", getListDeviceInverter[v]);

											if (dataEnergyByDevice.length > 0) {
												for (var k = 0, l = dataEnergyByDevice.length; k < l; k++) {
													if (k === 0) {
														dataEnergyByDevice[k].activeEnergy = 0;
													} else {
														var subEnergy = 0;
														if (dataEnergyByDevice[k].today_activeEnergy > 0 && dataEnergyByDevice[k - 1].today_activeEnergy > 0) {
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
									var getListDeviceInverter = await db.queryForList("Plant.getListDeviceInverter", param);
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
											var dataEnergyToday15 = await db.queryForList("Plant.dataEnergy15MinutesByDevice", getListDeviceInverter[v]);

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
									// var dataEnergyToday15 = await db.queryForList("Plant.getDataEnergyFifteenMinutes", { groupInverter });
									// if (dataEnergyToday15.length > 0) {
									// 	for (let i = 0, len = dataEnergyToday15.length; i < len; i++) {
									// 		if (i === 0) {
									// 			dataEnergyToday15[i].activeEnergy = 0;
									// 		} else {
									// 			let subEnergy = 0;

									// 			if (dataEnergyToday15[i].today_activeEnergy > 0 && dataEnergyToday15[i - 1].today_activeEnergy > 0) {
									// 				subEnergy = Libs.roundNumber((dataEnergyToday15[i].today_activeEnergy - dataEnergyToday15[i - 1].today_activeEnergy), 1);
									// 			}
									// 			dataEnergyToday15[i].activeEnergy = Libs.roundNumber((subEnergy > 1000 ? 0 : subEnergy), 1);

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

									var dataEnergyToday1h = await db.queryForList("Plant.getDataEnergyHour", { groupInverter: groupInverter });
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

										var getListDeviceInverter = await db.queryForList("Plant.getListDeviceInverter", param);
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
												var dataEnergyByDevice = await db.queryForList("Plant.dataEnergyByDevice", getListDeviceInverter[v]);

												if (dataEnergyByDevice.length > 0) {
													for (var _k2 = 0, _l2 = dataEnergyByDevice.length; _k2 < _l2; _k2++) {
														if (_k2 === 0) {
															dataEnergyByDevice[_k2].activeEnergy = 0;
														} else {
															var subEnergy = 0;
															if (dataEnergyByDevice[_k2].today_activeEnergy > 0 && dataEnergyByDevice[_k2 - 1].today_activeEnergy > 0) {
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

										var _dataEnergyArr = await db.queryForList("Plant.getDataEnergyFifteenMinutes", { groupInverter: groupInverter });
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

										var dataEnergyArr = await db.queryForList("Plant.getDataEnergyHour", { groupInverter: groupInverter });
										var dataEnergyToday1h = await db.queryForList("Plant.getDataEnergyHour", { groupInverter: groupInverter });
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
								dataEnergyToday = await db.queryForList("Plant.getDataEnergyThisMonth", { groupInverter: groupInverter });
								break;

							case '12_month':
								dataEnergyToday = await db.queryForList("Plant.getDataEnergy12Month", { groupInverter: groupInverter });
								break;

							case 'lifetime':
								if (!Libs.isBlank(param.total_year) && param.total_year < 1) {
									dataEnergyToday = await db.queryForList("Plant.getDataEnergy12Month", { groupInverter: groupInverter });
								} else {
									dataEnergyToday = await db.queryForList("Plant.getDataEnergyLifetime", { groupInverter: groupInverter });
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

	return PlantService;
}(_BaseService3.default);

exports.default = PlantService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9QbGFudFNlcnZpY2UuanMiXSwibmFtZXMiOlsiUGxhbnRTZXJ2aWNlIiwicGFyYW0iLCJjYWxsQmFjayIsImRiIiwibXlTcUxEQiIsImJlZ2luVHJhbnNhY3Rpb24iLCJjb25uIiwidG90YWxJbnZlcnRlck9uIiwidG90YWxJbnZlcnRlciIsInJzIiwicXVlcnlGb3JPYmplY3QiLCJnZXRUb3RhbEludmVydGVyIiwiZGV2aWNlR3JvdXAiLCJxdWVyeUZvckxpc3QiLCJpZF9wcm9qZWN0IiwiaWQiLCJpcnJhZGlhbmNlIiwiYW1iaWVudF9lbXBlcmF0dXJlIiwiZW5lcmd5X3RvZGF5IiwibGlmZXRpbWUiLCJwb3dlcl9ub3ciLCJkY19wb3dlciIsImNvbnN1bXB0aW9uIiwidXNpbmdfbWV0ZXJfY29uc3VtcHRpb24iLCJMaWJzIiwiaXNBcnJheURhdGEiLCJqIiwibGVuZ3RoIiwidGFibGVfbmFtZSIsIm9iakRldmljZSIsImlkX2RldmljZV9ncm91cCIsInRvZGF5X2FjdGl2ZUVuZXJneSIsIm9iakRldmljZUlycmFkaWFuY2UiLCJvYmpEZXZpY2VBbWJpZW50RW1wZXJhdHVyZSIsIm9iakNvbnN1bXB0aW9uIiwiZm9ybWF0IiwiYWN0aXZlUG93ZXIiLCJyZXZlbnVlIiwiY29uZmlnX3JldmVudWUiLCJ0b2RheV9yZXZlbnVlIiwidG90YWxfcmV2ZW51ZSIsImNvbW1pdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJyb2xsYmFjayIsImRhdGFFbmVyZ3lUb2RheSIsImdldEdyb3VwSW52ZXJ0ZXIiLCJncm91cEludmVydGVyIiwiaSIsImxlbiIsInB1c2giLCJoYXNoX2lkIiwic3RhcnRfZGF0ZSIsImNvbnZlcnRBbGxGb3JtYXREYXRlIiwiZW5kX2RhdGUiLCJmaWx0ZXJCeSIsImdldExpc3REZXZpY2VJbnZlcnRlciIsImRhdGFfc2VuZF90aW1lIiwiZGF0YUVuZXJneU1lcmdlIiwiY3VyRGF0ZSIsImN1ckRhdGVGb3JtYXQiLCJ0IiwidGltZV9mb3JtYXQiLCJhZGQiLCJ0aW1lX2Z1bGwiLCJhY3RpdmVFbmVyZ3kiLCJncm91cF9kYXkiLCJ2IiwiZGF0YUVuZXJneUJ5RGV2aWNlIiwiayIsImwiLCJzdWJFbmVyZ3kiLCJyb3VuZE51bWJlciIsIk9iamVjdCIsInZhbHVlcyIsInJlZHVjZSIsImFjYyIsImN1ckRhdGUxNSIsImN1ckRhdGVGb3JtYXQxNSIsImRhdGFFbmVyZ3lNZXJnZTE1IiwiZGF0YUVuZXJneVRvZGF5MTUiLCJjdXJEYXRlMWgiLCJjdXJEYXRlRm9ybWF0MWgiLCJkYXRhRW5lcmd5TWVyZ2UxaCIsImRhdGFFbmVyZ3lUb2RheTFoIiwic3RhcnREYXRlNSIsImVuZERhdGU1IiwiYWRkRGF5cyIsImRhdGFFbmVyZ3lNZXJnZTUiLCJkYXRhRW5lcmd5QXJyIiwic3RhcnREYXRlMWgiLCJpc0JsYW5rIiwidG90YWxfeWVhciIsIkJhc2VTZXJ2aWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0lBQ01BLFk7OztBQUNMLHlCQUFjO0FBQUE7O0FBQUE7QUFHYjs7QUFFRDs7Ozs7Ozs7NEJBTVVDLEssRUFBT0MsUSxFQUFVO0FBQzFCLE9BQUk7QUFDSCxRQUFJQyxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxPQUFHRSxnQkFBSCxDQUFvQixnQkFBZ0JDLElBQWhCLEVBQXNCO0FBQ3pDLFNBQUk7QUFDSCxVQUFJQyxrQkFBa0IsQ0FBdEI7QUFBQSxVQUF5QkMsZ0JBQWdCLENBQXpDO0FBQ0EsVUFBSUMsS0FBSyxNQUFNTixHQUFHTyxjQUFILENBQWtCLGlCQUFsQixFQUFxQ1QsS0FBckMsQ0FBZjtBQUNBLFVBQUlVLG1CQUFtQixNQUFNUixHQUFHTyxjQUFILENBQWtCLHdCQUFsQixFQUE0Q1QsS0FBNUMsQ0FBN0I7QUFDQSxVQUFJVSxnQkFBSixFQUFzQjtBQUNyQkgsdUJBQWdCRyxpQkFBaUJILGFBQWpDO0FBQ0E7O0FBRUQsVUFBSUksY0FBYyxNQUFNVCxHQUFH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QUFSLENBQVksYUFBWixFQUEyQkYsR0FBM0I7QUFDQXBDLFdBQUt1QyxRQUFMO0FBQ0EzQyxlQUFTLElBQVQsRUFBZXdDLEdBQWY7QUFDQTtBQUNELEtBM1pEO0FBNFpBLElBOVpELENBOFpFLE9BQU9BLEdBQVAsRUFBWTtBQUNiLFFBQUlwQyxJQUFKLEVBQVU7QUFDVEEsVUFBS3VDLFFBQUw7QUFDQTtBQUNEM0MsYUFBUyxJQUFULEVBQWV3QyxHQUFmO0FBQ0E7QUFDRDs7OztFQW5pQnlCb0QscUI7O2tCQXFpQlo5RixZIiwiZmlsZSI6IlBsYW50U2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2VydmljZSBmcm9tICcuL0Jhc2VTZXJ2aWNlJztcclxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5jbGFzcyBQbGFudFNlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCogZ2V0IGRldGFpbCBwcm9qZWN0IHBhZ2UgcGxhbnRcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHJcblx0Z2V0RGV0YWlsKHBhcmFtLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgdG90YWxJbnZlcnRlck9uID0gMCwgdG90YWxJbnZlcnRlciA9IDA7XHJcblx0XHRcdFx0XHR2YXIgcnMgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIlBsYW50LmdldERldGFpbFwiLCBwYXJhbSk7XHJcblx0XHRcdFx0XHR2YXIgZ2V0VG90YWxJbnZlcnRlciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiUGxhbnQuZ2V0VG90YWxJbnZlcnRlclwiLCBwYXJhbSk7XHJcblx0XHRcdFx0XHRpZiAoZ2V0VG90YWxJbnZlcnRlcikge1xyXG5cdFx0XHRcdFx0XHR0b3RhbEludmVydGVyID0gZ2V0VG90YWxJbnZlcnRlci50b3RhbEludmVydGVyO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZhciBkZXZpY2VHcm91cCA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIlBsYW50LmdldEdyb3VwRGV2aWNlQnlQcm9qZWN0SWRcIiwgeyBpZF9wcm9qZWN0OiBycy5pZCB9KTtcclxuXHRcdFx0XHRcdHZhciBpcnJhZGlhbmNlID0gW10sIGFtYmllbnRfZW1wZXJhdHVyZSA9IFtdLCBlbmVyZ3lfdG9kYXkgPSAwLCBsaWZldGltZSA9IDAsIHBvd2VyX25vdyA9IDAsIGRjX3Bvd2VyID0gMCwgY29uc3VtcHRpb24gPSAwLCB1c2luZ19tZXRlcl9jb25zdW1wdGlvbiA9IDA7XHJcblx0XHRcdFx0XHRpZiAoTGlicy5pc0FycmF5RGF0YShkZXZpY2VHcm91cCkpIHtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBkZXZpY2VHcm91cC5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdFx0XHRcdHN3aXRjaCAoZGV2aWNlR3JvdXBbal0udGFibGVfbmFtZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NUUDExMCc6XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU1RQNTAnOlxyXG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NIUDc1JzpcclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX0FCQl9QVlMxMDAnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqRGV2aWNlID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJQbGFudC5nZXREYXRhRGV2aWNlRW5lcmd5XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9wcm9qZWN0OiBycy5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGRldmljZUdyb3VwW2pdLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGRldmljZUdyb3VwW2pdLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvYmpEZXZpY2UpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0b3RhbEludmVydGVyT24gPSB0b3RhbEludmVydGVyT24gKyBvYmpEZXZpY2UudG90YWxJbnZlcnRlck9uO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbmVyZ3lfdG9kYXkgPSBlbmVyZ3lfdG9kYXkgKyBvYmpEZXZpY2UudG9kYXlfYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxpZmV0aW1lID0gbGlmZXRpbWUgKyBvYmpEZXZpY2UubGlmZXRpbWU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJfbm93ID0gcG93ZXJfbm93ICsgb2JqRGV2aWNlLnBvd2VyX25vdztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkY19wb3dlciA9IGRjX3Bvd2VyICsgb2JqRGV2aWNlLmRjX3Bvd2VyO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TdW5ncm93X1NHMTEwQ1gnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX0dyb3dhdHRfR1c4MEtUTDMnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX3NlbnNvcl9JTVRfU2lSUzQ4NSc6XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpEZXZpY2VJcnJhZGlhbmNlID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiUGxhbnQuZ2V0RGF0YURldmljZUlycmFkaWFuY2VcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX3Byb2plY3Q6IHJzLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZGV2aWNlR3JvdXBbal0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZGV2aWNlR3JvdXBbal0udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKExpYnMuaXNBcnJheURhdGEob2JqRGV2aWNlSXJyYWRpYW5jZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpcnJhZGlhbmNlID0gb2JqRGV2aWNlSXJyYWRpYW5jZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX3NlbnNvcl9JTVRfVGFSUzQ4NSc6XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpEZXZpY2VBbWJpZW50RW1wZXJhdHVyZSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIlBsYW50LmdldERhdGFEZXZpY2VBbWJpZW50RW1wZXJhdHVyZVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfcHJvamVjdDogcnMuaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBkZXZpY2VHcm91cFtqXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBkZXZpY2VHcm91cFtqXS50YWJsZV9uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoTGlicy5pc0FycmF5RGF0YShvYmpEZXZpY2VBbWJpZW50RW1wZXJhdHVyZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhbWJpZW50X2VtcGVyYXR1cmUgPSBvYmpEZXZpY2VBbWJpZW50RW1wZXJhdHVyZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2VtZXRlcl9WaW5hc2lub19WU0UzVDUnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqQ29uc3VtcHRpb24gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIlBsYW50LmdldG1ldGVyQ29uc3VtcHRpb25cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX3Byb2plY3Q6IHJzLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZGV2aWNlR3JvdXBbal0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZGV2aWNlR3JvdXBbal0udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvYmpDb25zdW1wdGlvbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHVzaW5nX21ldGVyX2NvbnN1bXB0aW9uID0gMTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdW1wdGlvbiA9IChtb21lbnQoKS5mb3JtYXQoJ0gnKSA8IDE5KSA/IG9iakNvbnN1bXB0aW9uLmFjdGl2ZVBvd2VyIDogMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJzLnRvdGFsSW52ZXJ0ZXJPbiA9IHRvdGFsSW52ZXJ0ZXJPbjtcclxuXHRcdFx0XHRcdHJzLnRvdGFsSW52ZXJ0ZXIgPSB0b3RhbEludmVydGVyO1xyXG5cdFx0XHRcdFx0cnMuZW5lcmd5X3RvZGF5ID0gZW5lcmd5X3RvZGF5O1xyXG5cdFx0XHRcdFx0cnMubGlmZXRpbWUgPSBsaWZldGltZTtcclxuXHRcdFx0XHRcdHJzLnJldmVudWUgPSBsaWZldGltZSAqIHJzLmNvbmZpZ19yZXZlbnVlO1xyXG5cdFx0XHRcdFx0cnMuaXJyYWRpYW5jZSA9IGlycmFkaWFuY2U7XHJcblx0XHRcdFx0XHRycy50b2RheV9yZXZlbnVlID0gKGVuZXJneV90b2RheSAvIDEwMDApICogcnMuY29uZmlnX3JldmVudWU7XHJcblx0XHRcdFx0XHRycy50b3RhbF9yZXZlbnVlID0gKGxpZmV0aW1lIC8gMTAwMCkgKiBycy5jb25maWdfcmV2ZW51ZTtcclxuXHRcdFx0XHRcdHJzLnBvd2VyX25vdyA9IHBvd2VyX25vdyA+IDAgPyBwb3dlcl9ub3cgLyAxMDAwIDogMDtcclxuXHRcdFx0XHRcdHJzLmlycmFkaWFuY2UgPSBpcnJhZGlhbmNlO1xyXG5cdFx0XHRcdFx0cnMuYW1iaWVudF9lbXBlcmF0dXJlID0gYW1iaWVudF9lbXBlcmF0dXJlO1xyXG5cdFx0XHRcdFx0cnMuZGNfcG93ZXIgPSBkY19wb3dlciA+IDAgPyBkY19wb3dlciAvIDEwMDAgOiAwO1xyXG5cdFx0XHRcdFx0cnMuY29uc3VtcHRpb24gPSBjb25zdW1wdGlvbjtcclxuXHRcdFx0XHRcdHJzLnVzaW5nX21ldGVyX2NvbnN1bXB0aW9uID0gdXNpbmdfbWV0ZXJfY29uc3VtcHRpb247XHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHJzKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8qKlxyXG5cdCogZ2V0IGRldGFpbCBwcm9qZWN0IHBhZ2UgcGxhbnRcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHJcblx0Z2V0Q2hhcnREYXRhKHBhcmFtLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneVRvZGF5ID0gW107XHJcblx0XHRcdFx0XHR2YXIgZ2V0R3JvdXBJbnZlcnRlciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIlBsYW50LmdldEdyb3VwRGV2aWNlSW52ZXJ0ZXJcIiwgcGFyYW0pO1xyXG5cclxuXHRcdFx0XHRcdGlmICghZ2V0R3JvdXBJbnZlcnRlcikge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHZhciBncm91cEludmVydGVyID0gW107XHJcblx0XHRcdFx0XHRpZiAoZ2V0R3JvdXBJbnZlcnRlci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW4gPSBnZXRHcm91cEludmVydGVyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0Z3JvdXBJbnZlcnRlci5wdXNoKFxyXG5cdFx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRoYXNoX2lkOiBwYXJhbS5oYXNoX2lkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldEdyb3VwSW52ZXJ0ZXJbaV0uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLnN0YXJ0X2RhdGUpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbmRfZGF0ZTogTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSksXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGdldEdyb3VwSW52ZXJ0ZXJbaV0udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRzd2l0Y2ggKHBhcmFtLmZpbHRlckJ5KSB7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ3RvZGF5JzpcclxuXHRcdFx0XHRcdFx0XHR2YXIgZ2V0TGlzdERldmljZUludmVydGVyID0gW107XHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgdXNpbmcgZW1ldGVyIFxyXG5cdFx0XHRcdFx0XHRcdC8vIHZhciBnZXRMaXN0RGV2aWNlRW1ldGVyID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiUGxhbnQuZ2V0TGlzdERldmljZUVtZXRlclwiLCBwYXJhbSk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gaWYoZ2V0TGlzdERldmljZUVtZXRlci5sZW5ndGggPiAwKXtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGdldExpc3REZXZpY2VJbnZlcnRlciA9IGdldExpc3REZXZpY2VFbWV0ZXI7XHJcblx0XHRcdFx0XHRcdFx0Ly8gfSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGdldExpc3REZXZpY2VJbnZlcnRlciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIlBsYW50LmdldExpc3REZXZpY2VJbnZlcnRlclwiLCBwYXJhbSk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0XHRcdGdldExpc3REZXZpY2VJbnZlcnRlciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIlBsYW50LmdldExpc3REZXZpY2VJbnZlcnRlclwiLCBwYXJhbSk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gNSBtaW51dGVzXHJcblx0XHRcdFx0XHRcdFx0aWYgKHBhcmFtLmRhdGFfc2VuZF90aW1lID09IDEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEzhuqV5IGRhbmggc8OhY2ggZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGRhdGFFbmVyZ3lNZXJnZSA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZ2VuYXJldGUgZGF0YSA1IG11bml0ZXNcclxuXHRcdFx0XHRcdFx0XHRcdGxldCBjdXJEYXRlID0gTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSk7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgY3VyRGF0ZUZvcm1hdCA9IG1vbWVudChjdXJEYXRlKS5mb3JtYXQoJ1lZWVktTU0tREQgMDU6MDAnKTtcclxuXHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIHQgPSAwOyB0IDwgMTY4OyB0KyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1lcmdlLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiBtb21lbnQoY3VyRGF0ZUZvcm1hdCkuYWRkKDUgKiB0LCAnbWludXRlcycpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogbW9tZW50KGN1ckRhdGVGb3JtYXQpLmFkZCg1ICogdCwgJ21pbnV0ZXMnKS5mb3JtYXQoJ0REL01NL1lZWVkgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IDAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBfZGF5OiAnJ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZ2V0TGlzdERldmljZUludmVydGVyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgdiA9IDAsIGxlbiA9IGdldExpc3REZXZpY2VJbnZlcnRlci5sZW5ndGg7IHYgPCBsZW47IHYrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGdldExpc3REZXZpY2VJbnZlcnRlclt2XS5zdGFydF9kYXRlID0gTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5zdGFydF9kYXRlKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRnZXRMaXN0RGV2aWNlSW52ZXJ0ZXJbdl0uZW5kX2RhdGUgPSBMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneUJ5RGV2aWNlID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiUGxhbnQuZGF0YUVuZXJneUJ5RGV2aWNlXCIsIGdldExpc3REZXZpY2VJbnZlcnRlclt2XSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChkYXRhRW5lcmd5QnlEZXZpY2UubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDAsIGwgPSBkYXRhRW5lcmd5QnlEZXZpY2UubGVuZ3RoOyBrIDwgbDsgaysrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneUJ5RGV2aWNlW2tdLmFjdGl2ZUVuZXJneSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIHN1YkVuZXJneSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGRhdGFFbmVyZ3lCeURldmljZVtrXS50b2RheV9hY3RpdmVFbmVyZ3kgPiAwICYmIGRhdGFFbmVyZ3lCeURldmljZVtrIC0gMV0udG9kYXlfYWN0aXZlRW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3ViRW5lcmd5ID0gKGRhdGFFbmVyZ3lCeURldmljZVtrXS50b2RheV9hY3RpdmVFbmVyZ3kgLSBkYXRhRW5lcmd5QnlEZXZpY2VbayAtIDFdLnRvZGF5X2FjdGl2ZUVuZXJneSkgLyAxMDAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneUJ5RGV2aWNlW2tdLmFjdGl2ZUVuZXJneSA9IExpYnMucm91bmROdW1iZXIoc3ViRW5lcmd5LCAxKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1lcmdlID0gT2JqZWN0LnZhbHVlcyhbLi4uZGF0YUVuZXJneU1lcmdlLCAuLi5kYXRhRW5lcmd5QnlEZXZpY2VdLnJlZHVjZSgoYWNjLCB7IHRpbWVfZm9ybWF0LCB0aW1lX2Z1bGwsIGFjdGl2ZVBvd2VyLCBhY3RpdmVFbmVyZ3ksIGdyb3VwX2RheSB9KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjY1t0aW1lX2Zvcm1hdF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiBMaWJzLnJvdW5kTnVtYmVyKCgoYWNjW3RpbWVfZm9ybWF0XSA/IGFjY1t0aW1lX2Zvcm1hdF0uYWN0aXZlUG93ZXIgOiAwKSArIGFjdGl2ZVBvd2VyKSwgMSksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiBMaWJzLnJvdW5kTnVtYmVyKCgoYWNjW3RpbWVfZm9ybWF0XSA/IGFjY1t0aW1lX2Zvcm1hdF0uYWN0aXZlRW5lcmd5IDogMCkgKyBhY3RpdmVFbmVyZ3kpLCAxKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cF9kYXlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0sIHt9KSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5VG9kYXkgPSBkYXRhRW5lcmd5TWVyZ2U7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyAxNSBtaW51dGVzXHJcblx0XHRcdFx0XHRcdFx0aWYgKHBhcmFtLmRhdGFfc2VuZF90aW1lID09IDIpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBnZXRMaXN0RGV2aWNlSW52ZXJ0ZXIgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJQbGFudC5nZXRMaXN0RGV2aWNlSW52ZXJ0ZXJcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZ2VuYXJldGUgZGF0YSAxNSBtdW5pdGVzXHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgY3VyRGF0ZTE1ID0gTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSk7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgY3VyRGF0ZUZvcm1hdDE1ID0gbW9tZW50KGN1ckRhdGUxNSkuZm9ybWF0KCdZWVlZLU1NLUREIDA1OjAwJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUVuZXJneU1lcmdlMTUgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IHQgPSAwOyB0IDw9IDU2OyB0KyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1lcmdlMTUucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IG1vbWVudChjdXJEYXRlRm9ybWF0MTUpLmFkZCgxNSAqIHQsICdtaW51dGVzJykuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiBtb21lbnQoY3VyRGF0ZUZvcm1hdDE1KS5hZGQoMTUgKiB0LCAnbWludXRlcycpLmZvcm1hdCgnREQvTU0vWVlZWSBISDptbScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiAwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cF9kYXk6ICcnXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGlmKGdldExpc3REZXZpY2VJbnZlcnRlci5sZW5ndGggPiAwKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgdiA9IDAsIGxlbiA9IGdldExpc3REZXZpY2VJbnZlcnRlci5sZW5ndGg7IHYgPCBsZW47IHYrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGdldExpc3REZXZpY2VJbnZlcnRlclt2XS5zdGFydF9kYXRlID0gTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5zdGFydF9kYXRlKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRnZXRMaXN0RGV2aWNlSW52ZXJ0ZXJbdl0uZW5kX2RhdGUgPSBMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneVRvZGF5MTUgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJQbGFudC5kYXRhRW5lcmd5MTVNaW51dGVzQnlEZXZpY2VcIiwgZ2V0TGlzdERldmljZUludmVydGVyW3ZdKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGRhdGFFbmVyZ3lUb2RheTE1Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGsgPSAwLCBsID0gZGF0YUVuZXJneVRvZGF5MTUubGVuZ3RoOyBrIDwgbDsgaysrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneVRvZGF5MTVba10uYWN0aXZlRW5lcmd5ID0gMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgc3ViRW5lcmd5ID0gMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZGF0YUVuZXJneVRvZGF5MTVba10udG9kYXlfYWN0aXZlRW5lcmd5ID4gMCAmJiBkYXRhRW5lcmd5VG9kYXkxNVtrIC0gMV0udG9kYXlfYWN0aXZlRW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3ViRW5lcmd5ID0gKGRhdGFFbmVyZ3lUb2RheTE1W2tdLnRvZGF5X2FjdGl2ZUVuZXJneSAtIGRhdGFFbmVyZ3lUb2RheTE1W2sgLSAxXS50b2RheV9hY3RpdmVFbmVyZ3kpIC8gMTAwMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lUb2RheTE1W2tdLmFjdGl2ZUVuZXJneSA9IExpYnMucm91bmROdW1iZXIoc3ViRW5lcmd5LCAxKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1lcmdlMTUgPSBPYmplY3QudmFsdWVzKFsuLi5kYXRhRW5lcmd5TWVyZ2UxNSwgLi4uZGF0YUVuZXJneVRvZGF5MTVdLnJlZHVjZSgoYWNjLCB7IHRpbWVfZm9ybWF0LCB0aW1lX2Z1bGwsIGFjdGl2ZVBvd2VyLCBhY3RpdmVFbmVyZ3ksIGdyb3VwX2RheSB9KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjY1t0aW1lX2Zvcm1hdF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiBMaWJzLnJvdW5kTnVtYmVyKCgoYWNjW3RpbWVfZm9ybWF0XSA/IGFjY1t0aW1lX2Zvcm1hdF0uYWN0aXZlUG93ZXIgOiAwKSArIGFjdGl2ZVBvd2VyKSwgMSksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiBMaWJzLnJvdW5kTnVtYmVyKCgoYWNjW3RpbWVfZm9ybWF0XSA/IGFjY1t0aW1lX2Zvcm1hdF0uYWN0aXZlRW5lcmd5IDogMCkgKyBhY3RpdmVFbmVyZ3kpLCAxKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cF9kYXlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0sIHt9KSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHQvLyB2YXIgZGF0YUVuZXJneVRvZGF5MTUgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJQbGFudC5nZXREYXRhRW5lcmd5RmlmdGVlbk1pbnV0ZXNcIiwgeyBncm91cEludmVydGVyIH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gaWYgKGRhdGFFbmVyZ3lUb2RheTE1Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IGRhdGFFbmVyZ3lUb2RheTE1Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0aWYgKGkgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGRhdGFFbmVyZ3lUb2RheTE1W2ldLmFjdGl2ZUVuZXJneSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGxldCBzdWJFbmVyZ3kgPSAwO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlmIChkYXRhRW5lcmd5VG9kYXkxNVtpXS50b2RheV9hY3RpdmVFbmVyZ3kgPiAwICYmIGRhdGFFbmVyZ3lUb2RheTE1W2kgLSAxXS50b2RheV9hY3RpdmVFbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdHN1YkVuZXJneSA9IExpYnMucm91bmROdW1iZXIoKGRhdGFFbmVyZ3lUb2RheTE1W2ldLnRvZGF5X2FjdGl2ZUVuZXJneSAtIGRhdGFFbmVyZ3lUb2RheTE1W2kgLSAxXS50b2RheV9hY3RpdmVFbmVyZ3kpLCAxKTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGRhdGFFbmVyZ3lUb2RheTE1W2ldLmFjdGl2ZUVuZXJneSA9IExpYnMucm91bmROdW1iZXIoKHN1YkVuZXJneSA+IDEwMDAgPyAwIDogc3ViRW5lcmd5KSwgMSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGRhdGFFbmVyZ3lNZXJnZTE1ID0gT2JqZWN0LnZhbHVlcyhbLi4uZGF0YUVuZXJneU1lcmdlMTUsIC4uLmRhdGFFbmVyZ3lUb2RheTE1XS5yZWR1Y2UoKGFjYywgeyB0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBhY3RpdmVQb3dlciwgYWN0aXZlRW5lcmd5LCBncm91cF9kYXkgfSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRhY2NbdGltZV9mb3JtYXRdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdHRpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdHRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRhY3RpdmVQb3dlcjogTGlicy5yb3VuZE51bWJlcigoKGFjY1t0aW1lX2Zvcm1hdF0gPyBhY2NbdGltZV9mb3JtYXRdLmFjdGl2ZVBvd2VyIDogMCkgKyBhY3RpdmVQb3dlciksIDEpLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdGFjdGl2ZUVuZXJneTogTGlicy5yb3VuZE51bWJlcigoKGFjY1t0aW1lX2Zvcm1hdF0gPyBhY2NbdGltZV9mb3JtYXRdLmFjdGl2ZUVuZXJneSA6IDApICsgYWN0aXZlRW5lcmd5KSwgMSksXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0Z3JvdXBfZGF5XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdH07XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyB9LCB7fSkpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lUb2RheSA9IGRhdGFFbmVyZ3lNZXJnZTE1O1xyXG5cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIDEgaG91clxyXG5cdFx0XHRcdFx0XHRcdGlmIChwYXJhbS5kYXRhX3NlbmRfdGltZSA9PSAzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBnZW5hcmV0ZSBkYXRhIDEgaG91clxyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IGN1ckRhdGUxaCA9IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGN1ckRhdGVGb3JtYXQxaCA9IG1vbWVudChjdXJEYXRlMWgpLmZvcm1hdCgnWVlZWS1NTS1ERCAwNTowMCcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFFbmVyZ3lNZXJnZTFoID0gW107XHJcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCB0ID0gMDsgdCA8PSAxNDsgdCsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNZXJnZTFoLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiBtb21lbnQoY3VyRGF0ZUZvcm1hdDFoKS5hZGQoMSAqIHQsICdob3VycycpLmZvcm1hdCgnWVlZWS1NTS1ERCBISCcpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogbW9tZW50KGN1ckRhdGVGb3JtYXQxaCkuYWRkKDEgKiB0LCAnaG91cnMnKS5mb3JtYXQoJ0REL01NL1lZWVkgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IDAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBfZGF5OiAnJ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGRhdGFFbmVyZ3lUb2RheTFoID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiUGxhbnQuZ2V0RGF0YUVuZXJneUhvdXJcIiwgeyBncm91cEludmVydGVyIH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1lcmdlMWggPSBPYmplY3QudmFsdWVzKFsuLi5kYXRhRW5lcmd5TWVyZ2UxaCwgLi4uZGF0YUVuZXJneVRvZGF5MWhdLnJlZHVjZSgoYWNjLCB7IHRpbWVfZm9ybWF0LCB0aW1lX2Z1bGwsIGFjdGl2ZVBvd2VyLCBhY3RpdmVFbmVyZ3ksIGdyb3VwX2RheSB9KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGFjY1t0aW1lX2Zvcm1hdF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiBMaWJzLnJvdW5kTnVtYmVyKCgoYWNjW3RpbWVfZm9ybWF0XSA/IGFjY1t0aW1lX2Zvcm1hdF0uYWN0aXZlUG93ZXIgOiAwKSArIGFjdGl2ZVBvd2VyKSwgMSksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiBMaWJzLnJvdW5kTnVtYmVyKCgoYWNjW3RpbWVfZm9ybWF0XSA/IGFjY1t0aW1lX2Zvcm1hdF0uYWN0aXZlRW5lcmd5IDogMCkgKyBhY3RpdmVFbmVyZ3kpLCAxKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cF9kYXlcclxuXHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdH0sIHt9KSk7XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lUb2RheSA9IGRhdGFFbmVyZ3lNZXJnZTFoO1xyXG5cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlICczX2RheSc6XHJcblx0XHRcdFx0XHRcdFx0Ly8gNSBtaW51dGVzXHJcblx0XHRcdFx0XHRcdFx0aWYgKHBhcmFtLmRhdGFfc2VuZF90aW1lID09IDEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGxldCBzdGFydERhdGU1ID0gJycsIGVuZERhdGU1ID0gJyc7XHJcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoaSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0RGF0ZTUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpLCAtMikpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVuZERhdGU1ID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKSwgLTIpKS5mb3JtYXQoJ1lZWVktTU0tREQgMTk6MDAnKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBqID0gMCwgbGVuID0gZ3JvdXBJbnZlcnRlci5sZW5ndGg7IGogPCBsZW47IGorKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBJbnZlcnRlcltqXS5lbmRfZGF0ZSA9IG1vbWVudChMaWJzLmFkZERheXMoTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSksIC0yKSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0RGF0ZTUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksIGkpKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbmREYXRlNSA9IG1vbWVudChMaWJzLmFkZERheXMoTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5zdGFydF9kYXRlKSwgaSkpLmZvcm1hdCgnWVlZWS1NTS1ERCAxOTowMCcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGogPSAwLCBsZW4gPSBncm91cEludmVydGVyLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cEludmVydGVyW2pdLnN0YXJ0X2RhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksIGkpKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwSW52ZXJ0ZXJbal0uZW5kX2RhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksIGkpKS5mb3JtYXQoJ1lZWVktTU0tREQgMTk6MDAnKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBnZXRMaXN0RGV2aWNlSW52ZXJ0ZXIgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJQbGFudC5nZXRMaXN0RGV2aWNlSW52ZXJ0ZXJcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneU1lcmdlNSA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgY3VyRGF0ZUZvcm1hdCA9IG1vbWVudChzdGFydERhdGU1KS5mb3JtYXQoJ1lZWVktTU0tREQgMDU6MDAnKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgdCA9IDA7IHQgPD0gMTY4OyB0KyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TWVyZ2U1LnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IG1vbWVudChjdXJEYXRlRm9ybWF0KS5hZGQoNSAqIHQsICdtaW51dGVzJykuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IG1vbWVudChjdXJEYXRlRm9ybWF0KS5hZGQoNSAqIHQsICdtaW51dGVzJykuZm9ybWF0KCdERC9NTS9ZWVlZIEhIOm1tJyksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwX2RheTogJydcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGdldExpc3REZXZpY2VJbnZlcnRlci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgdiA9IDAsIGxlbiA9IGdldExpc3REZXZpY2VJbnZlcnRlci5sZW5ndGg7IHYgPCBsZW47IHYrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z2V0TGlzdERldmljZUludmVydGVyW3ZdLnN0YXJ0X2RhdGUgPSBMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHN0YXJ0RGF0ZTUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z2V0TGlzdERldmljZUludmVydGVyW3ZdLmVuZF9kYXRlID0gTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShlbmREYXRlNSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneUJ5RGV2aWNlID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiUGxhbnQuZGF0YUVuZXJneUJ5RGV2aWNlXCIsIGdldExpc3REZXZpY2VJbnZlcnRlclt2XSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGRhdGFFbmVyZ3lCeURldmljZS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGsgPSAwLCBsID0gZGF0YUVuZXJneUJ5RGV2aWNlLmxlbmd0aDsgayA8IGw7IGsrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5QnlEZXZpY2Vba10uYWN0aXZlRW5lcmd5ID0gMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIHN1YkVuZXJneSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZGF0YUVuZXJneUJ5RGV2aWNlW2tdLnRvZGF5X2FjdGl2ZUVuZXJneSA+IDAgJiYgZGF0YUVuZXJneUJ5RGV2aWNlW2sgLSAxXS50b2RheV9hY3RpdmVFbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN1YkVuZXJneSA9IChkYXRhRW5lcmd5QnlEZXZpY2Vba10udG9kYXlfYWN0aXZlRW5lcmd5IC0gZGF0YUVuZXJneUJ5RGV2aWNlW2sgLSAxXS50b2RheV9hY3RpdmVFbmVyZ3kpIC8gMTAwMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5QnlEZXZpY2Vba10uYWN0aXZlRW5lcmd5ID0gTGlicy5yb3VuZE51bWJlcihzdWJFbmVyZ3ksIDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TWVyZ2U1ID0gT2JqZWN0LnZhbHVlcyhbLi4uZGF0YUVuZXJneU1lcmdlNSwgLi4uZGF0YUVuZXJneUJ5RGV2aWNlXS5yZWR1Y2UoKGFjYywgeyB0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBhY3RpdmVQb3dlciwgYWN0aXZlRW5lcmd5LCBncm91cF9kYXkgfSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjY1t0aW1lX2Zvcm1hdF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiBMaWJzLnJvdW5kTnVtYmVyKCgoYWNjW3RpbWVfZm9ybWF0XSA/IGFjY1t0aW1lX2Zvcm1hdF0uYWN0aXZlUG93ZXIgOiAwKSArIGFjdGl2ZVBvd2VyKSwgMSksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IExpYnMucm91bmROdW1iZXIoKChhY2NbdGltZV9mb3JtYXRdID8gYWNjW3RpbWVfZm9ybWF0XS5hY3RpdmVFbmVyZ3kgOiAwKSArIGFjdGl2ZUVuZXJneSksIDEpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBfZGF5XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneVRvZGF5LnB1c2goLi4uZGF0YUVuZXJneU1lcmdlNSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gMTUgbWludXRlc1xyXG5cdFx0XHRcdFx0XHRcdGlmIChwYXJhbS5kYXRhX3NlbmRfdGltZSA9PSAyKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgY3VyRGF0ZTE1ID0gJyc7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChpID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VyRGF0ZTE1ID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKSwgLTIpKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBqID0gMCwgbGVuID0gZ3JvdXBJbnZlcnRlci5sZW5ndGg7IGogPCBsZW47IGorKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBJbnZlcnRlcltqXS5lbmRfZGF0ZSA9IG1vbWVudChMaWJzLmFkZERheXMoTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSksIC0yKSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGN1ckRhdGUxNSA9IG1vbWVudChMaWJzLmFkZERheXMoTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5zdGFydF9kYXRlKSwgaSkpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGogPSAwLCBsZW4gPSBncm91cEludmVydGVyLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cEludmVydGVyW2pdLnN0YXJ0X2RhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksIGkpKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwSW52ZXJ0ZXJbal0uZW5kX2RhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksIGkpKS5mb3JtYXQoJ1lZWVktTU0tREQgMTk6MDAnKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhRW5lcmd5QXJyID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiUGxhbnQuZ2V0RGF0YUVuZXJneUZpZnRlZW5NaW51dGVzXCIsIHsgZ3JvdXBJbnZlcnRlciB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGRhdGFFbmVyZ3lBcnIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW4gPSBkYXRhRW5lcmd5QXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5QXJyW2ldLmFjdGl2ZUVuZXJneSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IHN1YkVuZXJneSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGRhdGFFbmVyZ3lBcnJbaV0udG9kYXlfYWN0aXZlRW5lcmd5ID4gMCAmJiBkYXRhRW5lcmd5QXJyW2kgLSAxXS50b2RheV9hY3RpdmVFbmVyZ3kgPiAwKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdWJFbmVyZ3kgPSBMaWJzLnJvdW5kTnVtYmVyKChkYXRhRW5lcmd5QXJyW2ldLnRvZGF5X2FjdGl2ZUVuZXJneSAtIGRhdGFFbmVyZ3lBcnJbaSAtIDFdLnRvZGF5X2FjdGl2ZUVuZXJneSksIDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lBcnJbaV0uYWN0aXZlRW5lcmd5ID0gTGlicy5yb3VuZE51bWJlcigoc3ViRW5lcmd5ID4gNTAwMCA/IDAgOiBzdWJFbmVyZ3kpLCAxKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGdlbmFyZXRlIGRhdGEgMTUgbXVuaXRlc1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgY3VyRGF0ZUZvcm1hdDE1ID0gbW9tZW50KGN1ckRhdGUxNSkuZm9ybWF0KCdZWVlZLU1NLUREIDA1OjAwJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhRW5lcmd5TWVyZ2UxNSA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCB0ID0gMDsgdCA8PSA1NjsgdCsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1lcmdlMTUucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdDogbW9tZW50KGN1ckRhdGVGb3JtYXQxNSkuYWRkKDE1ICogdCwgJ21pbnV0ZXMnKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogbW9tZW50KGN1ckRhdGVGb3JtYXQxNSkuYWRkKDE1ICogdCwgJ21pbnV0ZXMnKS5mb3JtYXQoJ0REL01NL1lZWVkgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiAwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiAwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBfZGF5OiAnJ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TWVyZ2UxNSA9IE9iamVjdC52YWx1ZXMoWy4uLmRhdGFFbmVyZ3lNZXJnZTE1LCAuLi5kYXRhRW5lcmd5QXJyXS5yZWR1Y2UoKGFjYywgeyB0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBhY3RpdmVQb3dlciwgYWN0aXZlRW5lcmd5LCBncm91cF9kYXkgfSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjY1t0aW1lX2Zvcm1hdF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiBMaWJzLnJvdW5kTnVtYmVyKCgoYWNjW3RpbWVfZm9ybWF0XSA/IGFjY1t0aW1lX2Zvcm1hdF0uYWN0aXZlUG93ZXIgOiAwKSArIGFjdGl2ZVBvd2VyKSwgMSksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IExpYnMucm91bmROdW1iZXIoKChhY2NbdGltZV9mb3JtYXRdID8gYWNjW3RpbWVfZm9ybWF0XS5hY3RpdmVFbmVyZ3kgOiAwKSArIGFjdGl2ZUVuZXJneSksIDEpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBfZGF5XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneVRvZGF5LnB1c2goLi4uZGF0YUVuZXJneU1lcmdlMTUpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIDEgaG91clxyXG5cdFx0XHRcdFx0XHRcdGlmIChwYXJhbS5kYXRhX3NlbmRfdGltZSA9PSAzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgc3RhcnREYXRlMWggPSAnJztcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGkgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBqID0gMCwgbGVuID0gZ3JvdXBJbnZlcnRlci5sZW5ndGg7IGogPCBsZW47IGorKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnREYXRlMWggPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpLCAtMikpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBJbnZlcnRlcltqXS5lbmRfZGF0ZSA9IG1vbWVudChMaWJzLmFkZERheXMoTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSksIC0yKSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGogPSAwLCBsZW4gPSBncm91cEludmVydGVyLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydERhdGUxaCA9IG1vbWVudChMaWJzLmFkZERheXMoTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5zdGFydF9kYXRlKSwgaSkpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBJbnZlcnRlcltqXS5zdGFydF9kYXRlID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLnN0YXJ0X2RhdGUpLCBpKSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cEludmVydGVyW2pdLmVuZF9kYXRlID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLnN0YXJ0X2RhdGUpLCBpKSkuZm9ybWF0KCdZWVlZLU1NLUREIDE5OjAwJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGN1ckRhdGVGb3JtYXQxaCA9IG1vbWVudChzdGFydERhdGUxaCkuZm9ybWF0KCdZWVlZLU1NLUREIDA1OjAwJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhRW5lcmd5TWVyZ2UxaCA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCB0ID0gMDsgdCA8PSAxNDsgdCsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1lcmdlMWgucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdDogbW9tZW50KGN1ckRhdGVGb3JtYXQxaCkuYWRkKDEgKiB0LCAnaG91cnMnKS5mb3JtYXQoJ1lZWVktTU0tREQgSEgnKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogbW9tZW50KGN1ckRhdGVGb3JtYXQxaCkuYWRkKDEgKiB0LCAnaG91cnMnKS5mb3JtYXQoJ0REL01NL1lZWVkgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiAwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiAwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBfZGF5OiAnJ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneUFyciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIlBsYW50LmdldERhdGFFbmVyZ3lIb3VyXCIsIHsgZ3JvdXBJbnZlcnRlciB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGRhdGFFbmVyZ3lUb2RheTFoID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiUGxhbnQuZ2V0RGF0YUVuZXJneUhvdXJcIiwgeyBncm91cEludmVydGVyIH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TWVyZ2UxaCA9IE9iamVjdC52YWx1ZXMoWy4uLmRhdGFFbmVyZ3lNZXJnZTFoLCAuLi5kYXRhRW5lcmd5QXJyXS5yZWR1Y2UoKGFjYywgeyB0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBhY3RpdmVQb3dlciwgYWN0aXZlRW5lcmd5LCBncm91cF9kYXkgfSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjY1t0aW1lX2Zvcm1hdF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiBMaWJzLnJvdW5kTnVtYmVyKCgoYWNjW3RpbWVfZm9ybWF0XSA/IGFjY1t0aW1lX2Zvcm1hdF0uYWN0aXZlUG93ZXIgOiAwKSArIGFjdGl2ZVBvd2VyKSwgMSksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IExpYnMucm91bmROdW1iZXIoKChhY2NbdGltZV9mb3JtYXRdID8gYWNjW3RpbWVfZm9ybWF0XS5hY3RpdmVFbmVyZ3kgOiAwKSArIGFjdGl2ZUVuZXJneSksIDEpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBfZGF5XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneVRvZGF5LnB1c2goLi4uZGF0YUVuZXJneU1lcmdlMWgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ2xhc3RfbW9udGgnOlxyXG5cdFx0XHRcdFx0XHRjYXNlICd0aGlzX21vbnRoJzpcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5VG9kYXkgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJQbGFudC5nZXREYXRhRW5lcmd5VGhpc01vbnRoXCIsIHsgZ3JvdXBJbnZlcnRlciB9KTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdGNhc2UgJzEyX21vbnRoJzpcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5VG9kYXkgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJQbGFudC5nZXREYXRhRW5lcmd5MTJNb250aFwiLCB7IGdyb3VwSW52ZXJ0ZXIgfSk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRjYXNlICdsaWZldGltZSc6XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsocGFyYW0udG90YWxfeWVhcikgJiYgcGFyYW0udG90YWxfeWVhciA8IDEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lUb2RheSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIlBsYW50LmdldERhdGFFbmVyZ3kxMk1vbnRoXCIsIHsgZ3JvdXBJbnZlcnRlciB9KTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneVRvZGF5ID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiUGxhbnQuZ2V0RGF0YUVuZXJneUxpZmV0aW1lXCIsIHsgZ3JvdXBJbnZlcnRlciB9KTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZGF0YUVuZXJneVRvZGF5KTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFBsYW50U2VydmljZTtcclxuIl19