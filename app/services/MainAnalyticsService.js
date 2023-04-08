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

var MainAnalyticsService = function (_BaseService) {
	_inherits(MainAnalyticsService, _BaseService);

	function MainAnalyticsService() {
		_classCallCheck(this, MainAnalyticsService);

		return _possibleConstructorReturn(this, (MainAnalyticsService.__proto__ || Object.getPrototypeOf(MainAnalyticsService)).call(this));
	}

	/**
 * get detail project page Client Analytics
 * @param {*} data 
 * @param {*} callBack 
 */

	_createClass(MainAnalyticsService, [{
		key: 'getDataChartProfile',
		value: function getDataChartProfile(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.queryForObject("MainAnalytics.getDetail", param);
						if (!rs) {
							conn.rollback();
							callBack(true, {});
							return;
						}

						var getListDeviceInverter = await db.queryForList("MainAnalytics.getListDeviceInverter", param);
						var dataEnergyMerge = [];
						if (Libs.isArrayData(getListDeviceInverter)) {
							for (var v = 0, len = getListDeviceInverter.length; v < len; v++) {
								getListDeviceInverter[v].start_date = Libs.convertAllFormatDate(param.start_date);
								getListDeviceInverter[v].end_date = Libs.convertAllFormatDate(param.end_date);
								var dataEnergyByDevice = await db.queryForList("MainAnalytics.dataEnergyByDevice", getListDeviceInverter[v]);

								if (dataEnergyByDevice.length > 0) {
									for (var k = 0, l = dataEnergyByDevice.length; k < l; k++) {
										if (k === 0) {
											dataEnergyByDevice[k].activeEnergy = 0;
										} else {
											var subEnergy = (dataEnergyByDevice[k].today_activeEnergy - dataEnergyByDevice[k - 1].today_activeEnergy) / 1000;
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
						rs.dataChartProfile = dataEnergyMerge;

						// last 12 months
						var getGroupInverter = await db.queryForList("MainAnalytics.getGroupDeviceInverter", param);
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

						rs.performanceLast12Months = await db.queryForList("MainAnalytics.getDataEnergy12Month", { groupInverter: groupInverter });

						// Performance - Last 31 days
						rs.performanceLast30Days = await db.queryForList("MainAnalytics.getDataEnergy30Days", { groupInverter: groupInverter });

						// Daily Max Power - Last 12 Months
						rs.maxPower12Months = await db.queryForList("MainAnalytics.getDataMaxPower12Months", { groupInverter: groupInverter });
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
	}, {
		key: 'getListDeviceByProject',
		value: function getListDeviceByProject(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var getListDevice = await db.queryForList("MainAnalytics.getListDeviceByProject", param);
						if (!getListDevice) {
							conn.rollback();
							callBack(false, {});
							return;
						}

						if (getListDevice.length > 0) {
							for (var i = 0, len = getListDevice.length; i < len; i++) {
								getListDevice[i].dataParameter = await db.queryForList("MainAnalytics.getParameterByDevice", getListDevice[i]);
							}
						}

						conn.commit();
						callBack(false, getListDevice);
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
	}, {
		key: 'getChartParameterDevice',
		value: function getChartParameterDevice(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var data = [];
						var dataDevice = param.dataDevice;
						if (!Libs.isArrayData(dataDevice)) {
							conn.rollback();
							callBack(false, {});
							return;
						}

						for (var i = 0, len = dataDevice.length; i < len; i++) {
							var params = {
								filterBy: param.filterBy,
								start_date: Libs.convertAllFormatDate(param.start_date),
								end_date: Libs.convertAllFormatDate(param.end_date),
								data_send_time: param.data_send_time,
								table_name: dataDevice[i].table_name,
								id: dataDevice[i].id
							};
							var dataEnergy = await db.queryForList("MainAnalytics.getDataChartParameter", params);

							switch (param.filterBy) {
								case '3_day':
								case 'today':
									var arrTime5 = [];
									if (params.filterBy == 'today') {
										// genarete data 5 munites
										if (param.data_send_time == 1) {
											var curDate5 = Libs.convertAllFormatDate(param.end_date);
											var curDateFormat5 = (0, _moment2.default)(curDate5).format('YYYY-MM-DD 05:00');
											for (var t = 0; t < 168; t++) {
												arrTime5.push({
													time_format: (0, _moment2.default)(curDateFormat5).add(5 * t, 'minutes').format('YYYY-MM-DD HH:mm'),
													time_full: (0, _moment2.default)(curDateFormat5).add(5 * t, 'minutes').format('DD/MM/YYYY HH:mm'),
													categories_time: (0, _moment2.default)(curDateFormat5).add(5 * t, 'minutes').format('HH:mm')
												});
											}
										}

										// genarete data 15 munites
										if (param.data_send_time == 2) {
											var curDate15 = Libs.convertAllFormatDate(param.end_date);
											var curDateFormat15 = (0, _moment2.default)(curDate15).format('YYYY-MM-DD 05:00');
											for (var n = 0; n < 56; n++) {
												arrTime5.push({
													time_format: (0, _moment2.default)(curDateFormat15).add(15 * n, 'minutes').format('YYYY-MM-DD HH:mm'),
													time_full: (0, _moment2.default)(curDateFormat15).add(15 * n, 'minutes').format('DD/MM/YYYY HH:mm'),
													categories_time: (0, _moment2.default)(curDateFormat15).add(15 * n, 'minutes').format('HH:mm')
												});
											}
										}

										// genarete data 1 hour
										if (param.data_send_time == 3) {
											var curDate1h = Libs.convertAllFormatDate(param.end_date);
											var curDateFormat1h = (0, _moment2.default)(curDate1h).format('YYYY-MM-DD 05:00');
											for (var n = 0; n < 14; n++) {
												arrTime5.push({
													time_format: (0, _moment2.default)(curDateFormat1h).add(1 * n, 'hours').format('YYYY-MM-DD HH:mm'),
													time_full: (0, _moment2.default)(curDateFormat1h).add(1 * n, 'hours').format('DD/MM/YYYY HH:mm'),
													categories_time: (0, _moment2.default)(curDateFormat1h).add(1 * n, 'hours').format('HH:mm')
												});
											}
										}
									}

									// genarete data 5 munites
									if (params.filterBy == '3_day' && params.data_send_time == 1) {
										var startDate = '',
										    endDate = '';
										for (var _i = 0; _i < 3; _i++) {
											if (_i === 0) {
												startDate = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
												endDate = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD 19:00');
											} else {
												startDate = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.start_date), _i)).format('YYYY-MM-DD HH:mm');
												endDate = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.start_date), _i)).format('YYYY-MM-DD 19:00');
											}

											var curDateFormat = (0, _moment2.default)(startDate).format('YYYY-MM-DD 05:00');
											for (var h = 0; h < 168; h++) {
												arrTime5.push({
													time_format: (0, _moment2.default)(curDateFormat).add(5 * h, 'minutes').format('YYYY-MM-DD HH:mm'),
													time_full: (0, _moment2.default)(curDateFormat).add(5 * h, 'minutes').format('DD/MM/YYYY HH:mm'),
													categories_time: (0, _moment2.default)(curDateFormat).add(5 * h, 'minutes').format('D. MMM')
												});
											}
										}
									}

									// genarete data 15 munites
									if (params.filterBy == '3_day' && params.data_send_time == 2) {
										var _startDate = '',
										    _endDate = '';
										for (var _i2 = 0; _i2 < 3; _i2++) {
											if (_i2 === 0) {
												_startDate = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
												_endDate = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD 19:00');
											} else {
												_startDate = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.start_date), _i2)).format('YYYY-MM-DD HH:mm');
												_endDate = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.start_date), _i2)).format('YYYY-MM-DD 19:00');
											}

											var curDateFormat = (0, _moment2.default)(_startDate).format('YYYY-MM-DD 05:00');
											for (var h = 0; h < 56; h++) {
												arrTime5.push({
													time_format: (0, _moment2.default)(curDateFormat).add(15 * h, 'minutes').format('YYYY-MM-DD HH:mm'),
													time_full: (0, _moment2.default)(curDateFormat).add(15 * h, 'minutes').format('DD/MM/YYYY HH:mm'),
													categories_time: (0, _moment2.default)(curDateFormat).add(15 * h, 'minutes').format('D. MMM')
												});
											}
										}
									}

									// genarete data 1 hour
									if (params.filterBy == '3_day' && params.data_send_time == 3) {
										var _startDate2 = '',
										    _endDate2 = '';
										for (var _i3 = 0; _i3 < 3; _i3++) {
											if (_i3 === 0) {
												_startDate2 = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
												_endDate2 = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD 19:00');
											} else {
												_startDate2 = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.start_date), _i3)).format('YYYY-MM-DD HH:mm');
												_endDate2 = (0, _moment2.default)(Libs.addDays(Libs.convertAllFormatDate(param.start_date), _i3)).format('YYYY-MM-DD 19:00');
											}

											var curDateFormat = (0, _moment2.default)(_startDate2).format('YYYY-MM-DD 05:00');
											for (var h = 0; h <= 14; h++) {
												arrTime5.push({
													time_format: (0, _moment2.default)(curDateFormat).add(1 * h, 'hours').format('YYYY-MM-DD HH:mm'),
													time_full: (0, _moment2.default)(curDateFormat).add(1 * h, 'hours').format('DD/MM/YYYY HH:mm'),
													categories_time: (0, _moment2.default)(curDateFormat).add(1 * h, 'hours').format('D. MMM')
												});
											}
										}
									}

									var dataEnergy5 = [];
									switch (dataDevice[i].table_name) {
										case 'model_inverter_SMA_SHP75':
											dataEnergy5 = Object.values([].concat(arrTime5, _toConsumableArray(dataEnergy)).reduce(function (acc, _ref2) {
												var time_format = _ref2.time_format,
												    time_full = _ref2.time_full,
												    categories_time = _ref2.categories_time,
												    acCurrent = _ref2.acCurrent,
												    currentPhaseA = _ref2.currentPhaseA,
												    currentPhaseB = _ref2.currentPhaseB,
												    currentPhaseC = _ref2.currentPhaseC,
												    voltagePhaseA = _ref2.voltagePhaseA,
												    voltagePhaseB = _ref2.voltagePhaseB,
												    voltagePhaseC = _ref2.voltagePhaseC,
												    activePower = _ref2.activePower,
												    powerFrequency = _ref2.powerFrequency,
												    apparentPower = _ref2.apparentPower,
												    reactivePower = _ref2.reactivePower,
												    powerFactor = _ref2.powerFactor,
												    activeEnergy = _ref2.activeEnergy,
												    dcCurrent = _ref2.dcCurrent,
												    dcVoltage = _ref2.dcVoltage,
												    dcPower = _ref2.dcPower,
												    internalTemperature = _ref2.internalTemperature,
												    heatSinkTemperature = _ref2.heatSinkTemperature,
												    transformerTemperature = _ref2.transformerTemperature;

												acc[time_full] = {
													time_format: time_format ? time_format : acc[time_full].time_format,
													time_full: time_full ? time_full : acc[time_full].time_full,
													categories_time: categories_time ? categories_time : acc[time_full].categories_time,
													acCurrent: acCurrent ? acCurrent : null,
													currentPhaseA: currentPhaseA ? currentPhaseA : null,
													currentPhaseB: currentPhaseB ? currentPhaseB : null,
													currentPhaseC: currentPhaseC ? currentPhaseC : null,
													voltagePhaseA: voltagePhaseA ? voltagePhaseA : null,
													voltagePhaseB: voltagePhaseB ? voltagePhaseB : voltagePhaseB,
													voltagePhaseC: voltagePhaseC ? voltagePhaseC : null,
													activePower: activePower ? activePower : null,
													powerFrequency: powerFrequency ? powerFrequency : null,
													apparentPower: apparentPower ? apparentPower : null,
													reactivePower: reactivePower ? reactivePower : null,
													powerFactor: powerFactor ? powerFactor : null,
													activeEnergy: activeEnergy ? activeEnergy : null,
													dcCurrent: dcCurrent ? dcCurrent : null,
													dcVoltage: dcVoltage ? dcVoltage : null,
													dcPower: dcPower ? dcPower : null,
													internalTemperature: internalTemperature ? internalTemperature : null,
													heatSinkTemperature: heatSinkTemperature ? heatSinkTemperature : null,
													transformerTemperature: transformerTemperature ? transformerTemperature : null
												};
												return acc;
											}, {}));

											dataDevice[i].data = dataEnergy5;
											break;

										case 'model_inverter_ABB_PVS100':
											dataEnergy5 = Object.values([].concat(arrTime5, _toConsumableArray(dataEnergy)).reduce(function (acc, _ref3) {
												var time_format = _ref3.time_format,
												    time_full = _ref3.time_full,
												    categories_time = _ref3.categories_time,
												    acCurrent = _ref3.acCurrent,
												    currentPhaseA = _ref3.currentPhaseA,
												    currentPhaseB = _ref3.currentPhaseB,
												    currentPhaseC = _ref3.currentPhaseC,
												    voltagePhaseA = _ref3.voltagePhaseA,
												    voltagePhaseB = _ref3.voltagePhaseB,
												    voltagePhaseC = _ref3.voltagePhaseC,
												    activePower = _ref3.activePower,
												    powerFrequency = _ref3.powerFrequency,
												    apparentPower = _ref3.apparentPower,
												    reactivePower = _ref3.reactivePower,
												    powerFactor = _ref3.powerFactor,
												    activeEnergy = _ref3.activeEnergy,
												    dcCurrent = _ref3.dcCurrent,
												    dcVoltage = _ref3.dcVoltage,
												    dcPower = _ref3.dcPower,
												    internalTemperature = _ref3.internalTemperature,
												    heatSinkTemperature = _ref3.heatSinkTemperature,
												    mppt1Current = _ref3.mppt1Current,
												    mppt1Voltage = _ref3.mppt1Voltage,
												    mppt1Power = _ref3.mppt1Power,
												    mppt2Current = _ref3.mppt2Current,
												    mppt2Voltage = _ref3.mppt2Voltage,
												    mppt2Power = _ref3.mppt2Power,
												    mppt3Current = _ref3.mppt3Current,
												    mppt3Voltage = _ref3.mppt3Voltage,
												    mppt3Power = _ref3.mppt3Power,
												    mppt4Current = _ref3.mppt4Current,
												    mppt4Voltage = _ref3.mppt4Voltage,
												    mppt4Power = _ref3.mppt4Power,
												    mppt5Current = _ref3.mppt5Current,
												    mppt5Voltage = _ref3.mppt5Voltage,
												    mppt5Power = _ref3.mppt5Power,
												    mppt6Current = _ref3.mppt6Current,
												    mppt6Voltage = _ref3.mppt6Voltage,
												    mppt6Power = _ref3.mppt6Power;

												acc[time_full] = {
													time_format: time_format ? time_format : acc[time_full].time_format,
													time_full: time_full ? time_full : acc[time_full].time_full,
													categories_time: categories_time ? categories_time : acc[time_full].categories_time,
													acCurrent: acCurrent ? acCurrent : null,
													currentPhaseA: currentPhaseA ? currentPhaseA : null,
													currentPhaseB: currentPhaseB ? currentPhaseB : null,
													currentPhaseC: currentPhaseC ? currentPhaseC : null,
													voltagePhaseA: voltagePhaseA ? voltagePhaseA : null,
													voltagePhaseB: voltagePhaseB ? voltagePhaseB : null,
													voltagePhaseC: voltagePhaseC ? voltagePhaseC : null,
													activePower: activePower ? activePower : null,
													powerFrequency: powerFrequency ? powerFrequency : null,
													apparentPower: apparentPower ? apparentPower : null,
													reactivePower: reactivePower ? reactivePower : null,
													powerFactor: powerFactor ? powerFactor : null,
													activeEnergy: activeEnergy ? activeEnergy : null,
													dcCurrent: dcCurrent ? dcCurrent : null,
													dcVoltage: dcVoltage ? dcVoltage : null,
													dcPower: dcPower ? dcPower : null,
													internalTemperature: internalTemperature ? internalTemperature : null,
													heatSinkTemperature: heatSinkTemperature ? heatSinkTemperature : null,
													mppt1Current: mppt1Current ? mppt1Current : null,
													mppt1Voltage: mppt1Voltage ? mppt1Voltage : null,
													mppt1Power: mppt1Power ? mppt1Power : null,
													mppt2Current: mppt2Current ? mppt2Current : null,
													mppt2Voltage: mppt2Voltage ? mppt2Voltage : null,
													mppt2Power: mppt2Power ? mppt2Power : null,
													mppt3Current: mppt3Current ? mppt3Current : null,
													mppt3Voltage: mppt3Voltage ? mppt3Voltage : null,
													mppt3Power: mppt3Power ? mppt3Power : null,
													mppt4Current: mppt4Current ? mppt4Current : null,
													mppt4Voltage: mppt4Voltage ? mppt4Voltage : null,
													mppt4Power: mppt4Power ? mppt4Power : null,
													mppt5Current: mppt5Current ? mppt5Current : null,
													mppt5Voltage: mppt5Voltage ? mppt5Voltage : null,
													mppt5Power: mppt5Power ? mppt5Power : null,
													mppt6Current: mppt6Current ? mppt6Current : null,
													mppt6Voltage: mppt6Voltage ? mppt6Voltage : null,
													mppt6Power: mppt6Power ? mppt6Power : null
												};
												return acc;
											}, {}));

											dataDevice[i].data = dataEnergy5;
											break;
										case 'model_inverter_SMA_STP50':
											dataEnergy5 = Object.values([].concat(arrTime5, _toConsumableArray(dataEnergy)).reduce(function (acc, _ref4) {
												var time_format = _ref4.time_format,
												    time_full = _ref4.time_full,
												    categories_time = _ref4.categories_time,
												    currentPhaseA = _ref4.currentPhaseA,
												    currentPhaseB = _ref4.currentPhaseB,
												    currentPhaseC = _ref4.currentPhaseC,
												    voltagePhaseA = _ref4.voltagePhaseA,
												    voltagePhaseB = _ref4.voltagePhaseB,
												    voltagePhaseC = _ref4.voltagePhaseC,
												    activePower = _ref4.activePower,
												    powerFrequency = _ref4.powerFrequency,
												    apparentPower = _ref4.apparentPower,
												    reactivePower = _ref4.reactivePower,
												    powerFactor = _ref4.powerFactor,
												    activeEnergy = _ref4.activeEnergy,
												    dailyEnergy = _ref4.dailyEnergy,
												    dcCurrent = _ref4.dcCurrent,
												    dcVoltage = _ref4.dcVoltage,
												    dcPower = _ref4.dcPower,
												    internalTemperature = _ref4.internalTemperature,
												    mppt1Current = _ref4.mppt1Current,
												    mppt1Voltage = _ref4.mppt1Voltage,
												    mppt1Power = _ref4.mppt1Power,
												    mppt2Current = _ref4.mppt2Current,
												    mppt2Voltage = _ref4.mppt2Voltage,
												    mppt2Power = _ref4.mppt2Power,
												    mppt3Current = _ref4.mppt3Current,
												    mppt3Voltage = _ref4.mppt3Voltage,
												    mppt3Power = _ref4.mppt3Power,
												    mppt4Current = _ref4.mppt4Current,
												    mppt4Voltage = _ref4.mppt4Voltage,
												    mppt4Power = _ref4.mppt4Power,
												    mppt5Current = _ref4.mppt5Current,
												    mppt5Voltage = _ref4.mppt5Voltage,
												    mppt5Power = _ref4.mppt5Power,
												    mppt6Current = _ref4.mppt6Current,
												    mppt6Voltage = _ref4.mppt6Voltage,
												    mppt6Power = _ref4.mppt6Power;

												acc[time_full] = {
													time_format: time_format ? time_format : acc[time_full].time_format,
													time_full: time_full ? time_full : acc[time_full].time_full,
													categories_time: categories_time ? categories_time : acc[time_full].categories_time,
													currentPhaseA: currentPhaseA ? currentPhaseA : null,
													currentPhaseB: currentPhaseB ? currentPhaseB : null,
													currentPhaseC: currentPhaseC ? currentPhaseC : null,
													voltagePhaseA: voltagePhaseA ? voltagePhaseA : null,
													voltagePhaseB: voltagePhaseB ? voltagePhaseB : null,
													voltagePhaseC: voltagePhaseC ? voltagePhaseC : null,
													activePower: activePower ? activePower : null,
													powerFrequency: powerFrequency ? powerFrequency : null,
													apparentPower: apparentPower ? apparentPower : null,
													reactivePower: reactivePower ? reactivePower : null,
													powerFactor: powerFactor ? powerFactor : null,
													activeEnergy: activeEnergy ? activeEnergy : null,
													dailyEnergy: dailyEnergy ? dailyEnergy : null,
													dcCurrent: dcCurrent ? dcCurrent : null,
													dcVoltage: dcVoltage ? dcVoltage : null,
													dcPower: dcPower ? dcPower : null,
													internalTemperature: internalTemperature ? internalTemperature : null,
													mppt1Current: mppt1Current ? mppt1Current : null,
													mppt1Voltage: mppt1Voltage ? mppt1Voltage : null,
													mppt1Power: mppt1Power ? mppt1Power : null,
													mppt2Current: mppt2Current ? mppt2Current : null,
													mppt2Voltage: mppt2Voltage ? mppt2Voltage : null,
													mppt2Power: mppt2Power ? mppt2Power : null,
													mppt3Current: mppt3Current ? mppt3Current : null,
													mppt3Voltage: mppt3Voltage ? mppt3Voltage : null,
													mppt3Power: mppt3Power ? mppt3Power : null,
													mppt4Current: mppt4Current ? mppt4Current : null,
													mppt4Voltage: mppt4Voltage ? mppt4Voltage : null,
													mppt4Power: mppt4Power ? mppt4Power : null,
													mppt5Current: mppt5Current ? mppt5Current : null,
													mppt5Voltage: mppt5Voltage ? mppt5Voltage : null,
													mppt5Power: mppt5Power ? mppt5Power : null,
													mppt6Current: mppt6Current ? mppt6Current : null,
													mppt6Voltage: mppt6Voltage ? mppt6Voltage : null,
													mppt6Power: mppt6Power ? mppt6Power : null

												};
												return acc;
											}, {}));

											dataDevice[i].data = dataEnergy5;

											break;
										case 'model_logger_SMA_IM20':
											dataEnergy5 = Object.values([].concat(arrTime5, _toConsumableArray(dataEnergy)).reduce(function (acc, _ref5) {
												var time_format = _ref5.time_format,
												    time_full = _ref5.time_full,
												    categories_time = _ref5.categories_time,
												    manufacturer = _ref5.manufacturer,
												    model = _ref5.model,
												    serialNumber = _ref5.serialNumber,
												    modbusUnitId = _ref5.modbusUnitId;

												acc[time_full] = {
													time_format: time_format ? time_format : acc[time_full].time_format,
													time_full: time_full ? time_full : acc[time_full].time_full,
													categories_time: categories_time ? categories_time : acc[time_full].categories_time,
													manufacturer: manufacturer ? manufacturer : null,
													model: model ? model : null,
													serialNumber: serialNumber ? serialNumber : null,
													modbusUnitId: modbusUnitId ? modbusUnitId : null
												};
												return acc;
											}, {}));

											dataDevice[i].data = dataEnergy5;
											break;
										case 'model_sensor_IMT_SiRS485':
											dataEnergy5 = Object.values([].concat(arrTime5, _toConsumableArray(dataEnergy)).reduce(function (acc, _ref6) {
												var time_format = _ref6.time_format,
												    time_full = _ref6.time_full,
												    categories_time = _ref6.categories_time,
												    irradiancePoA = _ref6.irradiancePoA,
												    cellTemp = _ref6.cellTemp,
												    panelTemp = _ref6.panelTemp;

												acc[time_full] = {
													time_format: time_format ? time_format : acc[time_full].time_format,
													time_full: time_full ? time_full : acc[time_full].time_full,
													categories_time: categories_time ? categories_time : acc[time_full].categories_time,
													irradiancePoA: irradiancePoA ? irradiancePoA : null,
													cellTemp: cellTemp ? cellTemp : null,
													panelTemp: panelTemp ? panelTemp : null

												};
												return acc;
											}, {}));

											dataDevice[i].data = dataEnergy5;
											break;
										case 'model_sensor_IMT_TaRS485':
											dataEnergy5 = Object.values([].concat(arrTime5, _toConsumableArray(dataEnergy)).reduce(function (acc, _ref7) {
												var time_format = _ref7.time_format,
												    time_full = _ref7.time_full,
												    categories_time = _ref7.categories_time,
												    ambientTemp = _ref7.ambientTemp;

												acc[time_full] = {
													time_format: time_format ? time_format : acc[time_full].time_format,
													time_full: time_full ? time_full : acc[time_full].time_full,
													categories_time: categories_time ? categories_time : acc[time_full].categories_time,
													ambientTemp: ambientTemp ? ambientTemp : null
												};
												return acc;
											}, {}));

											dataDevice[i].data = dataEnergy5;
											break;
										case 'model_techedge':
											dataEnergy5 = Object.values([].concat(arrTime5, _toConsumableArray(dataEnergy)).reduce(function (acc, _ref8) {
												var time_format = _ref8.time_format,
												    time_full = _ref8.time_full,
												    categories_time = _ref8.categories_time,
												    memPercent = _ref8.memPercent,
												    memTotal = _ref8.memTotal,
												    memUsed = _ref8.memUsed,
												    memAvail = _ref8.memAvail,
												    memFree = _ref8.memFree,
												    diskPercent = _ref8.diskPercent,
												    diskTotal = _ref8.diskTotal,
												    diskUsed = _ref8.diskUsed,
												    diskFree = _ref8.diskFree,
												    cpuTemp = _ref8.cpuTemp,
												    upTime = _ref8.upTime;

												acc[time_full] = {
													time_format: time_format ? time_format : acc[time_full].time_format,
													time_full: time_full ? time_full : acc[time_full].time_full,
													categories_time: categories_time ? categories_time : acc[time_full].categories_time,
													memPercent: memPercent ? memPercent : null,
													memTotal: memTotal ? memTotal : null,
													memUsed: memUsed ? memUsed : null,
													memAvail: memAvail ? memAvail : null,
													memFree: memFree ? memFree : null,
													diskPercent: diskPercent ? diskPercent : null,
													diskTotal: diskTotal ? diskTotal : null,
													diskUsed: diskUsed ? diskUsed : null,
													diskFree: diskFree ? diskFree : null,
													cpuTemp: cpuTemp ? cpuTemp : null,
													upTime: upTime ? upTime : null
												};
												return acc;
											}, {}));

											dataDevice[i].data = dataEnergy5;
											break;
										case 'model_inverter_SMA_STP110':
											dataEnergy5 = Object.values([].concat(arrTime5, _toConsumableArray(dataEnergy)).reduce(function (acc, _ref9) {
												var time_format = _ref9.time_format,
												    time_full = _ref9.time_full,
												    categories_time = _ref9.categories_time,
												    acCurrent = _ref9.acCurrent,
												    currentPhaseA = _ref9.currentPhaseA,
												    currentPhaseB = _ref9.currentPhaseB,
												    currentPhaseC = _ref9.currentPhaseC,
												    voltagePhaseA = _ref9.voltagePhaseA,
												    voltagePhaseB = _ref9.voltagePhaseB,
												    voltagePhaseC = _ref9.voltagePhaseC,
												    activePower = _ref9.activePower,
												    powerFrequency = _ref9.powerFrequency,
												    apparentPower = _ref9.apparentPower,
												    reactivePower = _ref9.reactivePower,
												    powerFactor = _ref9.powerFactor,
												    activeEnergy = _ref9.activeEnergy,
												    dcCurrent = _ref9.dcCurrent,
												    dcVoltage = _ref9.dcVoltage,
												    dcPower = _ref9.dcPower,
												    cabinetTemperature = _ref9.cabinetTemperature,
												    mppt1Current = _ref9.mppt1Current,
												    mppt1Voltage = _ref9.mppt1Voltage,
												    mppt1Power = _ref9.mppt1Power,
												    mppt2Current = _ref9.mppt2Current,
												    mppt2Voltage = _ref9.mppt2Voltage,
												    mppt2Power = _ref9.mppt2Power,
												    mppt3Current = _ref9.mppt3Current,
												    mppt3Voltage = _ref9.mppt3Voltage,
												    mppt3Power = _ref9.mppt3Power,
												    mppt4Current = _ref9.mppt4Current,
												    mppt4Voltage = _ref9.mppt4Voltage,
												    mppt4Power = _ref9.mppt4Power,
												    mppt5Current = _ref9.mppt5Current,
												    mppt5Voltage = _ref9.mppt5Voltage,
												    mppt5Power = _ref9.mppt5Power,
												    mppt6Current = _ref9.mppt6Current,
												    mppt6Voltage = _ref9.mppt6Voltage,
												    mppt6Power = _ref9.mppt6Power,
												    mppt7Current = _ref9.mppt7Current,
												    mppt7Voltage = _ref9.mppt7Voltage,
												    mppt7Power = _ref9.mppt7Power,
												    mppt8Current = _ref9.mppt8Current,
												    mppt8Voltage = _ref9.mppt8Voltage,
												    mppt8Power = _ref9.mppt8Power,
												    mppt9Current = _ref9.mppt9Current,
												    mppt9Voltage = _ref9.mppt9Voltage,
												    mppt9Power = _ref9.mppt9Power,
												    mppt10Current = _ref9.mppt10Current,
												    mppt10Voltage = _ref9.mppt10Voltage,
												    mppt10Power = _ref9.mppt10Power,
												    mppt11Current = _ref9.mppt11Current,
												    mppt11Voltage = _ref9.mppt11Voltage,
												    mppt11Power = _ref9.mppt11Power,
												    mppt12Current = _ref9.mppt12Current,
												    mppt12Voltage = _ref9.mppt12Voltage,
												    mppt12Power = _ref9.mppt12Power;

												acc[time_full] = {
													time_format: time_format ? time_format : acc[time_full].time_format,
													time_full: time_full ? time_full : acc[time_full].time_full,
													categories_time: categories_time ? categories_time : acc[time_full].categories_time,
													acCurrent: acCurrent ? acCurrent : null,
													currentPhaseA: currentPhaseA ? currentPhaseA : null,
													currentPhaseB: currentPhaseB ? currentPhaseB : null,
													currentPhaseC: currentPhaseC ? currentPhaseC : null,
													voltagePhaseA: voltagePhaseA ? voltagePhaseA : null,
													voltagePhaseB: voltagePhaseB ? voltagePhaseB : null,
													voltagePhaseC: voltagePhaseC ? voltagePhaseC : null,
													activePower: activePower ? activePower : null,
													powerFrequency: powerFrequency ? powerFrequency : null,
													apparentPower: apparentPower ? apparentPower : null,
													reactivePower: reactivePower ? reactivePower : null,
													powerFactor: powerFactor ? powerFactor : null,
													activeEnergy: activeEnergy ? activeEnergy : null,
													dcCurrent: dcCurrent ? dcCurrent : null,
													dcVoltage: dcVoltage ? dcVoltage : null,
													dcPower: dcPower ? dcPower : null,
													cabinetTemperature: cabinetTemperature ? cabinetTemperature : null,
													mppt1Current: mppt1Current ? mppt1Current : null,
													mppt1Voltage: mppt1Voltage ? mppt1Voltage : null,
													mppt1Power: mppt1Power ? mppt1Power : null,
													mppt2Current: mppt2Current ? mppt2Current : null,
													mppt2Voltage: mppt2Voltage ? mppt2Voltage : null,
													mppt2Power: mppt2Power ? mppt2Power : null,
													mppt3Current: mppt3Current ? mppt3Current : null,
													mppt3Voltage: mppt3Voltage ? mppt3Voltage : null,
													mppt3Power: mppt3Power ? mppt3Power : null,
													mppt4Current: mppt4Current ? mppt4Current : null,
													mppt4Voltage: mppt4Voltage ? mppt4Voltage : null,
													mppt4Power: mppt4Power ? mppt4Power : null,
													mppt5Current: mppt5Current ? mppt5Current : null,
													mppt5Voltage: mppt5Voltage ? mppt5Voltage : null,
													mppt5Power: mppt5Power ? mppt5Power : null,
													mppt6Current: mppt6Current ? mppt6Current : null,
													mppt6Voltage: mppt6Voltage ? mppt6Voltage : null,
													mppt6Power: mppt6Power ? mppt6Power : null,
													mppt7Current: mppt7Current ? mppt7Current : null,
													mppt7Voltage: mppt7Voltage ? mppt7Voltage : null,
													mppt7Power: mppt7Power ? mppt7Power : null,
													mppt8Current: mppt8Current ? mppt8Current : null,
													mppt8Voltage: mppt8Voltage ? mppt8Voltage : null,
													mppt8Power: mppt8Power ? mppt8Power : null,
													mppt9Current: mppt9Current ? mppt9Current : null,
													mppt9Voltage: mppt9Voltage ? mppt9Voltage : null,
													mppt9Power: mppt9Power ? mppt9Power : null,
													mppt10Current: mppt10Current ? mppt10Current : null,
													mppt10Voltage: mppt10Voltage ? mppt10Voltage : null,
													mppt10Power: mppt10Power ? mppt10Power : null,
													mppt11Current: mppt11Current ? mppt11Current : null,
													mppt11Voltage: mppt11Voltage ? mppt11Voltage : null,
													mppt11Power: mppt11Power ? mppt11Power : null,
													mppt12Current: mppt12Current ? mppt12Current : null,
													mppt12Voltage: mppt12Voltage ? mppt12Voltage : null,
													mppt12Power: mppt12Power ? mppt12Power : null
												};
												return acc;
											}, {}));

											dataDevice[i].data = dataEnergy5;
											break;
										case 'model_emeter_Vinasino_VSE3T5':
											dataEnergy5 = Object.values([].concat(arrTime5, _toConsumableArray(dataEnergy)).reduce(function (acc, _ref10) {
												var time_format = _ref10.time_format,
												    time_full = _ref10.time_full,
												    categories_time = _ref10.categories_time,
												    activeEnergy = _ref10.activeEnergy,
												    activeEnergyRate1 = _ref10.activeEnergyRate1,
												    activeEnergyRate2 = _ref10.activeEnergyRate2,
												    activeEnergyRate3 = _ref10.activeEnergyRate3,
												    reactiveEnergyInductive = _ref10.reactiveEnergyInductive,
												    reactiveEnergyInductiveRate1 = _ref10.reactiveEnergyInductiveRate1,
												    reactiveEnergyInductiveRate2 = _ref10.reactiveEnergyInductiveRate2,
												    reactiveEnergyInductiveRate3 = _ref10.reactiveEnergyInductiveRate3,
												    reactiveEnergyCapacitive = _ref10.reactiveEnergyCapacitive,
												    reactiveEnergyCapacitiveRate1 = _ref10.reactiveEnergyCapacitiveRate1,
												    reactiveEnergyCapacitiveRate2 = _ref10.reactiveEnergyCapacitiveRate2,
												    reactiveEnergyCapacitiveRate3 = _ref10.reactiveEnergyCapacitiveRate3,
												    currentPhaseA = _ref10.currentPhaseA,
												    currentPhaseB = _ref10.currentPhaseB,
												    currentPhaseC = _ref10.currentPhaseC,
												    voltagePhaseA = _ref10.voltagePhaseA,
												    voltagePhaseB = _ref10.voltagePhaseB,
												    voltagePhaseC = _ref10.voltagePhaseC,
												    powerFrequency = _ref10.powerFrequency,
												    activePower = _ref10.activePower,
												    reactivePower = _ref10.reactivePower,
												    powerFactor = _ref10.powerFactor,
												    activePowerPhaseA = _ref10.activePowerPhaseA,
												    activePowerPhaseB = _ref10.activePowerPhaseB,
												    activePowerPhaseC = _ref10.activePowerPhaseC,
												    reactivePowerPhaseA = _ref10.reactivePowerPhaseA,
												    reactivePowerPhaseB = _ref10.reactivePowerPhaseB,
												    reactivePowerPhaseC = _ref10.reactivePowerPhaseC,
												    activePowerMaxDemand = _ref10.activePowerMaxDemand,
												    activePowerMaxDemandRate1 = _ref10.activePowerMaxDemandRate1,
												    activePowerMaxDemandRate2 = _ref10.activePowerMaxDemandRate2,
												    activePowerMaxDemandRate3 = _ref10.activePowerMaxDemandRate3,
												    powerFactorPhaseA = _ref10.powerFactorPhaseA,
												    powerFactorPhaseB = _ref10.powerFactorPhaseB,
												    powerFactorPhaseC = _ref10.powerFactorPhaseC,
												    CTratioPrimary = _ref10.CTratioPrimary,
												    CTratioSecondary = _ref10.CTratioSecondary,
												    PTratioPrimary = _ref10.PTratioPrimary,
												    PTratioSecondary = _ref10.PTratioSecondary;

												acc[time_full] = {
													time_format: time_format ? time_format : acc[time_full].time_format,
													time_full: time_full ? time_full : acc[time_full].time_full,
													categories_time: categories_time ? categories_time : acc[time_full].categories_time,
													activeEnergy: activeEnergy ? activeEnergy : null,
													activeEnergyRate1: activeEnergyRate1 ? activeEnergyRate1 : null,
													activeEnergyRate2: activeEnergyRate2 ? activeEnergyRate2 : null,
													activeEnergyRate3: activeEnergyRate3 ? activeEnergyRate3 : null,
													reactiveEnergyInductive: reactiveEnergyInductive ? reactiveEnergyInductive : null,
													reactiveEnergyInductiveRate1: reactiveEnergyInductiveRate1 ? reactiveEnergyInductiveRate1 : null,
													reactiveEnergyInductiveRate2: reactiveEnergyInductiveRate2 ? reactiveEnergyInductiveRate2 : null,
													reactiveEnergyInductiveRate3: reactiveEnergyInductiveRate3 ? reactiveEnergyInductiveRate3 : null,
													reactiveEnergyCapacitive: reactiveEnergyCapacitive ? reactiveEnergyCapacitive : null,
													reactiveEnergyCapacitiveRate1: reactiveEnergyCapacitiveRate1 ? reactiveEnergyCapacitiveRate1 : null,
													reactiveEnergyCapacitiveRate2: reactiveEnergyCapacitiveRate2 ? reactiveEnergyCapacitiveRate2 : null,
													reactiveEnergyCapacitiveRate3: reactiveEnergyCapacitiveRate3 ? reactiveEnergyCapacitiveRate3 : null,
													currentPhaseA: currentPhaseA ? currentPhaseA : null,
													currentPhaseB: currentPhaseB ? currentPhaseB : null,
													currentPhaseC: currentPhaseC ? currentPhaseC : null,
													voltagePhaseA: voltagePhaseA ? voltagePhaseA : null,
													voltagePhaseB: voltagePhaseB ? voltagePhaseB : null,
													voltagePhaseC: voltagePhaseC ? voltagePhaseC : null,
													powerFrequency: powerFrequency ? powerFrequency : null,
													activePower: activePower ? activePower : null,
													reactivePower: reactivePower ? reactivePower : null,
													powerFactor: powerFactor ? powerFactor : null,
													activePowerPhaseA: activePowerPhaseA ? activePowerPhaseA : null,
													activePowerPhaseB: activePowerPhaseB ? activePowerPhaseB : null,
													activePowerPhaseC: activePowerPhaseC ? activePowerPhaseC : null,
													reactivePowerPhaseA: reactivePowerPhaseA ? reactivePowerPhaseA : null,
													reactivePowerPhaseB: reactivePowerPhaseB ? reactivePowerPhaseB : null,
													reactivePowerPhaseC: reactivePowerPhaseC ? reactivePowerPhaseC : null,
													activePowerMaxDemand: activePowerMaxDemand ? activePowerMaxDemand : null,
													activePowerMaxDemandRate1: activePowerMaxDemandRate1 ? activePowerMaxDemandRate1 : null,
													activePowerMaxDemandRate2: activePowerMaxDemandRate2 ? activePowerMaxDemandRate2 : null,
													activePowerMaxDemandRate3: activePowerMaxDemandRate3 ? activePowerMaxDemandRate3 : null,
													powerFactorPhaseA: powerFactorPhaseA ? powerFactorPhaseA : null,
													powerFactorPhaseB: powerFactorPhaseB ? powerFactorPhaseB : null,
													powerFactorPhaseC: powerFactorPhaseC ? powerFactorPhaseC : null,
													CTratioPrimary: CTratioPrimary ? CTratioPrimary : null,
													CTratioSecondary: CTratioSecondary ? CTratioSecondary : null,
													PTratioPrimary: PTratioPrimary ? PTratioPrimary : null,
													PTratioSecondary: PTratioSecondary ? PTratioSecondary : null
												};
												return acc;
											}, {}));

											dataDevice[i].data = dataEnergy5;
											break;

										case 'model_emeter_GelexEmic_ME41':
											dataEnergy5 = Object.values([].concat(arrTime5, _toConsumableArray(dataEnergy)).reduce(function (acc, _ref11) {
												var time_format = _ref11.time_format,
												    time_full = _ref11.time_full,
												    categories_time = _ref11.categories_time,
												    activeEnergy = _ref11.activeEnergy,
												    activeEnergyExport = _ref11.activeEnergyExport,
												    activeEnergyExportRate1 = _ref11.activeEnergyExportRate1,
												    activeEnergyExportRate2 = _ref11.activeEnergyExportRate2,
												    activeEnergyExportRate3 = _ref11.activeEnergyExportRate3,
												    activeEnergyImport = _ref11.activeEnergyImport,
												    activeEnergyImportRate1 = _ref11.activeEnergyImportRate1,
												    activeEnergyImportRate2 = _ref11.activeEnergyImportRate2,
												    activeEnergyImportRate3 = _ref11.activeEnergyImportRate3,
												    reactiveEnergyExport = _ref11.reactiveEnergyExport,
												    reactiveEnergyImport = _ref11.reactiveEnergyImport,
												    voltagePhaseA = _ref11.voltagePhaseA,
												    voltagePhaseB = _ref11.voltagePhaseB,
												    voltagePhaseC = _ref11.voltagePhaseC,
												    currentPhaseA = _ref11.currentPhaseA,
												    currentPhaseB = _ref11.currentPhaseB,
												    currentPhaseC = _ref11.currentPhaseC,
												    powerFactor = _ref11.powerFactor,
												    activePower = _ref11.activePower;

												acc[time_full] = {
													time_format: time_format ? time_format : acc[time_full].time_format,
													time_full: time_full ? time_full : acc[time_full].time_full,
													categories_time: categories_time ? categories_time : acc[time_full].categories_time,
													activeEnergy: activeEnergy ? activeEnergy : null,
													activeEnergyExport: activeEnergyExport ? activeEnergyExport : null,
													activeEnergyExportRate1: activeEnergyExportRate1 ? activeEnergyExportRate1 : null,
													activeEnergyExportRate2: activeEnergyExportRate2 ? activeEnergyExportRate2 : null,
													activeEnergyExportRate3: activeEnergyExportRate3 ? activeEnergyExportRate3 : null,
													activeEnergyImport: activeEnergyImport ? activeEnergyImport : null,
													activeEnergyImportRate1: activeEnergyImportRate1 ? activeEnergyImportRate1 : null,
													activeEnergyImportRate2: activeEnergyImportRate2 ? activeEnergyImportRate2 : null,
													activeEnergyImportRate3: activeEnergyImportRate3 ? activeEnergyImportRate3 : null,
													reactiveEnergyExport: reactiveEnergyExport ? reactiveEnergyExport : null,
													reactiveEnergyImport: reactiveEnergyImport ? reactiveEnergyImport : null,
													voltagePhaseA: voltagePhaseA ? voltagePhaseA : null,
													voltagePhaseB: voltagePhaseB ? voltagePhaseB : null,
													voltagePhaseC: voltagePhaseC ? voltagePhaseC : null,
													currentPhaseA: currentPhaseA ? currentPhaseA : null,
													currentPhaseB: currentPhaseB ? currentPhaseB : null,
													currentPhaseC: currentPhaseC ? currentPhaseC : null,
													powerFactor: powerFactor ? powerFactor : null,
													activePower: activePower ? activePower : null
												};
												return acc;
											}, {}));

											dataDevice[i].data = dataEnergy5;
											break;

										case 'model_emeter_Vinasino_VSE3T52023':
											dataEnergy5 = Object.values([].concat(arrTime5, _toConsumableArray(dataEnergy)).reduce(function (acc, _ref12) {
												var time_format = _ref12.time_format,
												    time_full = _ref12.time_full,
												    categories_time = _ref12.categories_time,
												    activeEnergy = _ref12.activeEnergy,
												    activeEnergyRate1 = _ref12.activeEnergyRate1,
												    activeEnergyRate2 = _ref12.activeEnergyRate2,
												    activeEnergyRate3 = _ref12.activeEnergyRate3,
												    reverseActiveEnergy = _ref12.reverseActiveEnergy,
												    reverseActiveEnergyRate1 = _ref12.reverseActiveEnergyRate1,
												    reverseActiveEnergyRate2 = _ref12.reverseActiveEnergyRate2,
												    reverseActiveEnergyRate3 = _ref12.reverseActiveEnergyRate3,
												    reactiveEnergyInductive = _ref12.reactiveEnergyInductive,
												    reactiveEnergyInductiveRate1 = _ref12.reactiveEnergyInductiveRate1,
												    reactiveEnergyInductiveRate2 = _ref12.reactiveEnergyInductiveRate2,
												    reactiveEnergyInductiveRate3 = _ref12.reactiveEnergyInductiveRate3,
												    reactiveEnergyCapacitive = _ref12.reactiveEnergyCapacitive,
												    reactiveEnergyCapacitiveRate1 = _ref12.reactiveEnergyCapacitiveRate1,
												    reactiveEnergyCapacitiveRate2 = _ref12.reactiveEnergyCapacitiveRate2,
												    reactiveEnergyCapacitiveRate3 = _ref12.reactiveEnergyCapacitiveRate3,
												    currentPhaseA = _ref12.currentPhaseA,
												    currentPhaseB = _ref12.currentPhaseB,
												    currentPhaseC = _ref12.currentPhaseC,
												    voltagePhaseA = _ref12.voltagePhaseA,
												    voltagePhaseB = _ref12.voltagePhaseB,
												    voltagePhaseC = _ref12.voltagePhaseC,
												    powerFrequency = _ref12.powerFrequency,
												    activePower = _ref12.activePower,
												    reverseActivePower = _ref12.reverseActivePower,
												    reactivePower = _ref12.reactivePower,
												    reverseReactivePower = _ref12.reverseReactivePower,
												    powerFactor = _ref12.powerFactor,
												    activePowerPhaseA = _ref12.activePowerPhaseA,
												    activePowerPhaseB = _ref12.activePowerPhaseB,
												    activePowerPhaseC = _ref12.activePowerPhaseC,
												    reverseActivePowerPhaseA = _ref12.reverseActivePowerPhaseA,
												    reverseActivePowerPhaseB = _ref12.reverseActivePowerPhaseB,
												    reverseActivePowerPhaseC = _ref12.reverseActivePowerPhaseC,
												    reactivePowerPhaseA = _ref12.reactivePowerPhaseA,
												    reactivePowerPhaseB = _ref12.reactivePowerPhaseB,
												    reactivePowerPhaseC = _ref12.reactivePowerPhaseC,
												    reverseReactivePowerPhaseA = _ref12.reverseReactivePowerPhaseA,
												    reverseReactivePowerPhaseB = _ref12.reverseReactivePowerPhaseB,
												    reverseReactivePowerPhaseC = _ref12.reverseReactivePowerPhaseC,
												    powerFactorPhaseA = _ref12.powerFactorPhaseA,
												    powerFactorPhaseB = _ref12.powerFactorPhaseB,
												    powerFactorPhaseC = _ref12.powerFactorPhaseC,
												    CTratioPrimary = _ref12.CTratioPrimary,
												    CTratioSecondary = _ref12.CTratioSecondary,
												    PTratioPrimary = _ref12.PTratioPrimary,
												    PTratioSecondary = _ref12.PTratioSecondary;

												acc[time_full] = {
													time_format: time_format ? time_format : acc[time_full].time_format,
													time_full: time_full ? time_full : acc[time_full].time_full,
													categories_time: categories_time ? categories_time : acc[time_full].categories_time,
													activeEnergy: activeEnergy ? activeEnergy : null,
													activeEnergyRate1: activeEnergyRate1 ? activeEnergyRate1 : null,
													activeEnergyRate2: activeEnergyRate2 ? activeEnergyRate2 : null,
													activeEnergyRate3: activeEnergyRate3 ? activeEnergyRate3 : null,
													reverseActiveEnergy: reverseActiveEnergy ? reverseActiveEnergy : null,
													reverseActiveEnergyRate1: reverseActiveEnergyRate1 ? reverseActiveEnergyRate1 : null,
													reverseActiveEnergyRate2: reverseActiveEnergyRate2 ? reverseActiveEnergyRate2 : null,
													reverseActiveEnergyRate3: reverseActiveEnergyRate3 ? reverseActiveEnergyRate3 : null,
													reactiveEnergyInductive: reactiveEnergyInductive ? reactiveEnergyInductive : null,
													reactiveEnergyInductiveRate1: reactiveEnergyInductiveRate1 ? reactiveEnergyInductiveRate1 : null,
													reactiveEnergyInductiveRate2: reactiveEnergyInductiveRate2 ? reactiveEnergyInductiveRate2 : null,
													reactiveEnergyInductiveRate3: reactiveEnergyInductiveRate3 ? reactiveEnergyInductiveRate3 : null,
													reactiveEnergyCapacitive: reactiveEnergyCapacitive ? reactiveEnergyCapacitive : null,
													reactiveEnergyCapacitiveRate1: reactiveEnergyCapacitiveRate1 ? reactiveEnergyCapacitiveRate1 : null,
													reactiveEnergyCapacitiveRate2: reactiveEnergyCapacitiveRate2 ? reactiveEnergyCapacitiveRate2 : null,
													reactiveEnergyCapacitiveRate3: reactiveEnergyCapacitiveRate3 ? reactiveEnergyCapacitiveRate3 : null,
													currentPhaseA: currentPhaseA ? currentPhaseA : null,
													currentPhaseB: currentPhaseB ? currentPhaseB : null,
													currentPhaseC: currentPhaseC ? currentPhaseC : null,
													voltagePhaseA: voltagePhaseA ? voltagePhaseA : null,
													voltagePhaseB: voltagePhaseB ? voltagePhaseB : null,
													voltagePhaseC: voltagePhaseC ? voltagePhaseC : null,
													powerFrequency: powerFrequency ? powerFrequency : null,
													activePower: activePower ? activePower : null,
													reverseActivePower: reverseActivePower ? reverseActivePower : null,
													reactivePower: reactivePower ? reactivePower : null,
													reverseReactivePower: reverseReactivePower ? reverseReactivePower : null,
													powerFactor: powerFactor ? powerFactor : null,
													activePowerPhaseA: activePowerPhaseA ? activePowerPhaseA : null,
													activePowerPhaseB: activePowerPhaseB ? activePowerPhaseB : null,
													activePowerPhaseC: activePowerPhaseC ? activePowerPhaseC : null,
													reverseActivePowerPhaseA: reverseActivePowerPhaseA ? reverseActivePowerPhaseA : null,
													reverseActivePowerPhaseB: reverseActivePowerPhaseB ? reverseActivePowerPhaseB : null,
													reverseActivePowerPhaseC: reverseActivePowerPhaseC ? reverseActivePowerPhaseC : null,
													reactivePowerPhaseA: reactivePowerPhaseA ? reactivePowerPhaseA : null,
													reactivePowerPhaseB: reactivePowerPhaseB ? reactivePowerPhaseB : null,
													reactivePowerPhaseC: reactivePowerPhaseC ? reactivePowerPhaseC : null,
													reverseReactivePowerPhaseA: reverseReactivePowerPhaseA ? reverseReactivePowerPhaseA : null,
													reverseReactivePowerPhaseB: reverseReactivePowerPhaseB ? reverseReactivePowerPhaseB : null,
													reverseReactivePowerPhaseC: reverseReactivePowerPhaseC ? reverseReactivePowerPhaseC : null,
													powerFactorPhaseA: powerFactorPhaseA ? powerFactorPhaseA : null,
													powerFactorPhaseB: powerFactorPhaseB ? powerFactorPhaseB : null,
													powerFactorPhaseC: powerFactorPhaseC ? powerFactorPhaseC : null,
													CTratioPrimary: CTratioPrimary ? CTratioPrimary : null,
													CTratioSecondary: CTratioSecondary ? CTratioSecondary : null,
													PTratioPrimary: PTratioPrimary ? PTratioPrimary : null,
													PTratioSecondary: PTratioSecondary ? PTratioSecondary : null
												};
												return acc;
											}, {}));

											dataDevice[i].data = dataEnergy5;
											break;
									}

									break;
								case 'this_month':
								case 'last_month':
								case '12_month':
								case 'lifetime':
									dataDevice[i].data = dataEnergy;
									break;
							}
							data.push(dataDevice[i]);
						}

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

		/**
  * get detail project page Client Analytics
  * @param {*} data 
  * @param {*} callBack 
  */

	}, {
		key: 'getChartAlarm',
		value: function getChartAlarm(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.queryForObject("MainAnalytics.getDetail", param);
						if (!rs) {
							conn.rollback();
							callBack(true, {});
							return;
						}

						// Total Fleet Alerts
						param.id_project = rs.id;
						rs.totalFleetAlarm = await db.queryForList("MainAnalytics.totalFleetAlarm", param);

						rs.alarmOPened = await db.queryForList("MainAnalytics.alarmOPened", param);
						var alarmLast12Month = await db.queryForList("MainAnalytics.alarmLast12Month", param);

						var dataAlarmMonth = [];
						for (var i = 11; i >= 0; i--) {
							dataAlarmMonth.push({
								time_full: (0, _moment2.default)().add(-i, 'M').format('MM/YYYY'),
								total_alarm: 0
							});
						}
						dataAlarmMonth = Object.values([].concat(_toConsumableArray(dataAlarmMonth), _toConsumableArray(alarmLast12Month)).reduce(function (acc, _ref13) {
							var time_full = _ref13.time_full,
							    total_alarm = _ref13.total_alarm;

							acc[time_full] = {
								time_full: time_full,
								total_alarm: (acc[time_full] ? acc[time_full].total_alarm : 0) + total_alarm
							};
							return acc;
						}, {}));

						rs.alarmLast12Month = dataAlarmMonth;
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
	}]);

	return MainAnalyticsService;
}(_BaseService3.default);

exports.default = MainAnalyticsService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9NYWluQW5hbHl0aWNzU2VydmljZS5qcyJdLCJuYW1lcyI6WyJNYWluQW5hbHl0aWNzU2VydmljZSIsInBhcmFtIiwiY2FsbEJhY2siLCJkYiIsIm15U3FMREIiLCJiZWdpblRyYW5zYWN0aW9uIiwiY29ubiIsInJzIiwicXVlcnlGb3JPYmplY3QiLCJyb2xsYmFjayIsImdldExpc3REZXZpY2VJbnZlcnRlciIsInF1ZXJ5Rm9yTGlzdCIsImRhdGFFbmVyZ3lNZXJnZSIsIkxpYnMiLCJpc0FycmF5RGF0YSIsInYiLCJsZW4iLCJsZW5ndGgiLCJzdGFydF9kYXRlIiwiY29udmVydEFsbEZvcm1hdERhdGUiLCJlbmRfZGF0ZSIsImRhdGFFbmVyZ3lCeURldmljZSIsImsiLCJsIiwiYWN0aXZlRW5lcmd5Iiwic3ViRW5lcmd5IiwidG9kYXlfYWN0aXZlRW5lcmd5Iiwicm91bmROdW1iZXIiLCJPYmplY3QiLCJ2YWx1ZXMiLCJyZWR1Y2UiLCJhY2MiLCJ0aW1lX2Zvcm1hdCIsInRpbWVfZnVsbCIsImFjdGl2ZVBvd2VyIiwiZ3JvdXBfZGF5IiwiZGF0YUNoYXJ0UHJvZmlsZSIsImdldEdyb3VwSW52ZXJ0ZXIiLCJncm91cEludmVydGVyIiwiaSIsInB1c2giLCJoYXNoX2lkIiwiaWRfZGV2aWNlX2dyb3VwIiwidGFibGVfbmFtZSIsInBlcmZvcm1hbmNlTGFzdDEyTW9udGhzIiwicGVyZm9ybWFuY2VMYXN0MzBEYXlzIiwibWF4UG93ZXIxMk1vbnRocyIsImNvbW1pdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJnZXRMaXN0RGV2aWNlIiwiZGF0YVBhcmFtZXRlciIsImRhdGEiLCJkYXRhRGV2aWNlIiwicGFyYW1zIiwiZmlsdGVyQnkiLCJkYXRhX3NlbmRfdGltZSIsImlkIiwiZGF0YUVuZXJneSIsImFyclRpbWU1IiwiY3VyRGF0ZTUiLCJjdXJEYXRlRm9ybWF0NSIsImZvcm1hdCIsInQiLCJhZGQiLCJjYXRlZ29yaWVzX3RpbWUiLCJjdXJEYXRlMTUiLCJjdXJEYXRlRm9ybWF0MTUiLCJuIiwiY3VyRGF0ZTFoIiwiY3VyRGF0ZUZvcm1hdDFoIiwic3RhcnREYXRlIiwiZW5kRGF0ZSIsImFkZERheXMiLCJjdXJEYXRlRm9ybWF0IiwiaCIsImRhdGFFbmVyZ3k1IiwiYWNDdXJyZW50IiwiY3VycmVudFBoYXNlQSIsImN1cnJlbnRQaGFzZUIiLCJjdXJyZW50UGhhc2VDIiwidm9sdGFnZVBoYXNlQSIsInZvbHRhZ2VQaGFzZUIiLCJ2b2x0YWdlUGhhc2VDIiwicG93ZXJGcmVxdWVuY3kiLCJhcHBhcmVudFBvd2VyIiwicmVhY3RpdmVQb3dlciIsInBvd2VyRmFjdG9yIiwiZGNDdXJyZW50IiwiZGNWb2x0YWdlIiwiZGNQb3dlciIsImludGVybmFsVGVtcGVyYXR1cmUiLCJoZWF0U2lua1RlbXBlcmF0dXJlIiwidHJhbnNmb3JtZXJUZW1wZXJhdHVyZSIsIm1wcHQxQ3VycmVudCIsIm1wcHQxVm9sdGFnZSIsIm1wcHQxUG93ZXIiLCJtcHB0MkN1cnJlbnQiLCJtcHB0MlZvbHRhZ2UiLCJtcHB0MlBvd2VyIiwibXBwdDNDdXJyZW50IiwibXBwdDNWb2x0YWdlIiwibXBwdDNQb3dlciIsIm1wcHQ0Q3VycmVudCIsIm1wcHQ0Vm9sdGFnZSIsIm1wcHQ0UG93ZXIiLCJtcHB0NUN1cnJlbnQiLCJtcHB0NVZvbHRhZ2UiLCJtcHB0NVBvd2VyIiwibXBwdDZDdXJyZW50IiwibXBwdDZWb2x0YWdlIiwibXBwdDZQb3dlciIsImRhaWx5RW5lcmd5IiwibWFudWZhY3R1cmVyIiwibW9kZWwiLCJzZXJpYWxOdW1iZXIiLCJtb2RidXNVbml0SWQiLCJpcnJhZGlhbmNlUG9BIiwiY2VsbFRlbXAiLCJwYW5lbFRlbXAiLCJhbWJpZW50VGVtcCIsIm1lbVBlcmNlbnQiLCJtZW1Ub3RhbCIsIm1lbVVzZWQiLCJtZW1BdmFpbCIsIm1lbUZyZWUiLCJkaXNrUGVyY2VudCIsImRpc2tUb3RhbCIsImRpc2tVc2VkIiwiZGlza0ZyZWUiLCJjcHVUZW1wIiwidXBUaW1lIiwiY2FiaW5ldFRlbXBlcmF0dXJlIiwibXBwdDdDdXJyZW50IiwibXBwdDdWb2x0YWdlIiwibXBwdDdQb3dlciIsIm1wcHQ4Q3VycmVudCIsIm1wcHQ4Vm9sdGFnZSIsIm1wcHQ4UG93ZXIiLCJtcHB0OUN1cnJlbnQiLCJtcHB0OVZvbHRhZ2UiLCJtcHB0OVBvd2VyIiwibXBwdDEwQ3VycmVudCIsIm1wcHQxMFZvbHRhZ2UiLCJtcHB0MTBQb3dlciIsIm1wcHQxMUN1cnJlbnQiLCJtcHB0MTFWb2x0YWdlIiwibXBwdDExUG93ZXIiLCJtcHB0MTJDdXJyZW50IiwibXBwdDEyVm9sdGFnZSIsIm1wcHQxMlBvd2VyIiwiYWN0aXZlRW5lcmd5UmF0ZTEiLCJhY3RpdmVFbmVyZ3lSYXRlMiIsImFjdGl2ZUVuZXJneVJhdGUzIiwicmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmUiLCJyZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUxIiwicmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMiIsInJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTMiLCJyZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmUiLCJyZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMSIsInJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUyIiwicmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlUmF0ZTMiLCJhY3RpdmVQb3dlclBoYXNlQSIsImFjdGl2ZVBvd2VyUGhhc2VCIiwiYWN0aXZlUG93ZXJQaGFzZUMiLCJyZWFjdGl2ZVBvd2VyUGhhc2VBIiwicmVhY3RpdmVQb3dlclBoYXNlQiIsInJlYWN0aXZlUG93ZXJQaGFzZUMiLCJhY3RpdmVQb3dlck1heERlbWFuZCIsImFjdGl2ZVBvd2VyTWF4RGVtYW5kUmF0ZTEiLCJhY3RpdmVQb3dlck1heERlbWFuZFJhdGUyIiwiYWN0aXZlUG93ZXJNYXhEZW1hbmRSYXRlMyIsInBvd2VyRmFjdG9yUGhhc2VBIiwicG93ZXJGYWN0b3JQaGFzZUIiLCJwb3dlckZhY3RvclBoYXNlQyIsIkNUcmF0aW9QcmltYXJ5IiwiQ1RyYXRpb1NlY29uZGFyeSIsIlBUcmF0aW9QcmltYXJ5IiwiUFRyYXRpb1NlY29uZGFyeSIsImFjdGl2ZUVuZXJneUV4cG9ydCIsImFjdGl2ZUVuZXJneUV4cG9ydFJhdGUxIiwiYWN0aXZlRW5lcmd5RXhwb3J0UmF0ZTIiLCJhY3RpdmVFbmVyZ3lFeHBvcnRSYXRlMyIsImFjdGl2ZUVuZXJneUltcG9ydCIsImFjdGl2ZUVuZXJneUltcG9ydFJhdGUxIiwiYWN0aXZlRW5lcmd5SW1wb3J0UmF0ZTIiLCJhY3RpdmVFbmVyZ3lJbXBvcnRSYXRlMyIsInJlYWN0aXZlRW5lcmd5RXhwb3J0IiwicmVhY3RpdmVFbmVyZ3lJbXBvcnQiLCJyZXZlcnNlQWN0aXZlRW5lcmd5IiwicmV2ZXJzZUFjdGl2ZUVuZXJneVJhdGUxIiwicmV2ZXJzZUFjdGl2ZUVuZXJneVJhdGUyIiwicmV2ZXJzZUFjdGl2ZUVuZXJneVJhdGUzIiwicmV2ZXJzZUFjdGl2ZVBvd2VyIiwicmV2ZXJzZVJlYWN0aXZlUG93ZXIiLCJyZXZlcnNlQWN0aXZlUG93ZXJQaGFzZUEiLCJyZXZlcnNlQWN0aXZlUG93ZXJQaGFzZUIiLCJyZXZlcnNlQWN0aXZlUG93ZXJQaGFzZUMiLCJyZXZlcnNlUmVhY3RpdmVQb3dlclBoYXNlQSIsInJldmVyc2VSZWFjdGl2ZVBvd2VyUGhhc2VCIiwicmV2ZXJzZVJlYWN0aXZlUG93ZXJQaGFzZUMiLCJpZF9wcm9qZWN0IiwidG90YWxGbGVldEFsYXJtIiwiYWxhcm1PUGVuZWQiLCJhbGFybUxhc3QxMk1vbnRoIiwiZGF0YUFsYXJtTW9udGgiLCJ0b3RhbF9hbGFybSIsIkJhc2VTZXJ2aWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0lBQ01BLG9COzs7QUFDTCxpQ0FBYztBQUFBOztBQUFBO0FBR2I7O0FBRUQ7Ozs7Ozs7O3NDQU1vQkMsSyxFQUFPQyxRLEVBQVU7QUFDcEMsT0FBSTtBQUNILFFBQUlDLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FE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d0IsTUFBdEIsQ0FBNkIsU0FBN0IsQ0FEUTtBQUVuQmdKLHFCQUFhO0FBRk0sUUFBcEI7QUFJQTtBQUNERCx1QkFBaUJsTCxPQUFPQyxNQUFQLENBQWMsNkJBQUlpTCxjQUFKLHNCQUF1QkQsZ0JBQXZCLEdBQXlDL0ssTUFBekMsQ0FBZ0QsVUFBQ0MsR0FBRCxVQUFxQztBQUFBLFdBQTdCRSxTQUE2QixVQUE3QkEsU0FBNkI7QUFBQSxXQUFsQjhLLFdBQWtCLFVBQWxCQSxXQUFrQjs7QUFDbkhoTCxXQUFJRSxTQUFKLElBQWlCO0FBQ2hCQSw0QkFEZ0I7QUFFaEI4SyxxQkFBYSxDQUFDaEwsSUFBSUUsU0FBSixJQUFpQkYsSUFBSUUsU0FBSixFQUFlOEssV0FBaEMsR0FBOEMsQ0FBL0MsSUFBb0RBO0FBRmpELFFBQWpCO0FBSUEsY0FBT2hMLEdBQVA7QUFDQSxPQU44QixFQU01QixFQU40QixDQUFkLENBQWpCOztBQVFBeEIsU0FBR3NNLGdCQUFILEdBQXNCQyxjQUF0QjtBQUNBeE0sV0FBS3lDLE1BQUw7QUFDQTdDLGVBQVMsS0FBVCxFQUFnQkssRUFBaEI7QUFDQSxNQWpDRCxDQWlDRSxPQUFPeUMsR0FBUCxFQUFZO0FBQ2JDLGNBQVFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCRixHQUEzQjtBQUNBMUMsV0FBS0csUUFBTDtBQUNBUCxlQUFTLElBQVQsRUFBZThDLEdBQWY7QUFDQTtBQUNELEtBdkNEO0FBd0NBLElBMUNELENBMENFLE9BQU9BLEdBQVAsRUFBWTtBQUNiLFFBQUkxQyxJQUFKLEVBQVU7QUFDVEEsVUFBS0csUUFBTDtBQUNBO0FBQ0RQLGFBQVMsSUFBVCxFQUFlOEMsR0FBZjtBQUNBO0FBQ0Q7Ozs7RUEvaENpQ2dLLHFCOztrQkFpaUNwQmhOLG9CIiwiZmlsZSI6Ik1haW5BbmFseXRpY3NTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTZXJ2aWNlIGZyb20gJy4vQmFzZVNlcnZpY2UnO1xyXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcbmNsYXNzIE1haW5BbmFseXRpY3NTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQqIGdldCBkZXRhaWwgcHJvamVjdCBwYWdlIENsaWVudCBBbmFseXRpY3NcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHJcblx0Z2V0RGF0YUNoYXJ0UHJvZmlsZShwYXJhbSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNYWluQW5hbHl0aWNzLmdldERldGFpbFwiLCBwYXJhbSk7XHJcblx0XHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dmFyIGdldExpc3REZXZpY2VJbnZlcnRlciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5BbmFseXRpY3MuZ2V0TGlzdERldmljZUludmVydGVyXCIsIHBhcmFtKTtcclxuXHRcdFx0XHRcdHZhciBkYXRhRW5lcmd5TWVyZ2UgPSBbXTtcclxuXHRcdFx0XHRcdGlmIChMaWJzLmlzQXJyYXlEYXRhKGdldExpc3REZXZpY2VJbnZlcnRlcikpIHtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgdiA9IDAsIGxlbiA9IGdldExpc3REZXZpY2VJbnZlcnRlci5sZW5ndGg7IHYgPCBsZW47IHYrKykge1xyXG5cdFx0XHRcdFx0XHRcdGdldExpc3REZXZpY2VJbnZlcnRlclt2XS5zdGFydF9kYXRlID0gTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5zdGFydF9kYXRlKTtcclxuXHRcdFx0XHRcdFx0XHRnZXRMaXN0RGV2aWNlSW52ZXJ0ZXJbdl0uZW5kX2RhdGUgPSBMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKTtcclxuXHRcdFx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneUJ5RGV2aWNlID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpbkFuYWx5dGljcy5kYXRhRW5lcmd5QnlEZXZpY2VcIiwgZ2V0TGlzdERldmljZUludmVydGVyW3ZdKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKGRhdGFFbmVyZ3lCeURldmljZS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBrID0gMCwgbCA9IGRhdGFFbmVyZ3lCeURldmljZS5sZW5ndGg7IGsgPCBsOyBrKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGsgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5QnlEZXZpY2Vba10uYWN0aXZlRW5lcmd5ID0gMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgc3ViRW5lcmd5ID0gKGRhdGFFbmVyZ3lCeURldmljZVtrXS50b2RheV9hY3RpdmVFbmVyZ3kgLSBkYXRhRW5lcmd5QnlEZXZpY2VbayAtIDFdLnRvZGF5X2FjdGl2ZUVuZXJneSkgLyAxMDAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lCeURldmljZVtrXS5hY3RpdmVFbmVyZ3kgPSBMaWJzLnJvdW5kTnVtYmVyKHN1YkVuZXJneSwgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNZXJnZSA9IE9iamVjdC52YWx1ZXMoWy4uLmRhdGFFbmVyZ3lNZXJnZSwgLi4uZGF0YUVuZXJneUJ5RGV2aWNlXS5yZWR1Y2UoKGFjYywgeyB0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBhY3RpdmVQb3dlciwgYWN0aXZlRW5lcmd5LCBncm91cF9kYXkgfSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhY2NbdGltZV9mb3JtYXRdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogTGlicy5yb3VuZE51bWJlcigoKGFjY1t0aW1lX2Zvcm1hdF0gPyBhY2NbdGltZV9mb3JtYXRdLmFjdGl2ZVBvd2VyIDogMCkgKyBhY3RpdmVQb3dlciksIDEpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogTGlicy5yb3VuZE51bWJlcigoKGFjY1t0aW1lX2Zvcm1hdF0gPyBhY2NbdGltZV9mb3JtYXRdLmFjdGl2ZUVuZXJneSA6IDApICsgYWN0aXZlRW5lcmd5KSwgMSksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBfZGF5XHJcblx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cnMuZGF0YUNoYXJ0UHJvZmlsZSA9IGRhdGFFbmVyZ3lNZXJnZTtcclxuXHJcblxyXG5cdFx0XHRcdFx0Ly8gbGFzdCAxMiBtb250aHNcclxuXHRcdFx0XHRcdHZhciBnZXRHcm91cEludmVydGVyID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpbkFuYWx5dGljcy5nZXRHcm91cERldmljZUludmVydGVyXCIsIHBhcmFtKTtcclxuXHRcdFx0XHRcdGlmICghZ2V0R3JvdXBJbnZlcnRlcikge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHZhciBncm91cEludmVydGVyID0gW107XHJcblx0XHRcdFx0XHRpZiAoZ2V0R3JvdXBJbnZlcnRlci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW4gPSBnZXRHcm91cEludmVydGVyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0Z3JvdXBJbnZlcnRlci5wdXNoKFxyXG5cdFx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRoYXNoX2lkOiBwYXJhbS5oYXNoX2lkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldEdyb3VwSW52ZXJ0ZXJbaV0uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLnN0YXJ0X2RhdGUpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbmRfZGF0ZTogTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSksXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGdldEdyb3VwSW52ZXJ0ZXJbaV0udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRycy5wZXJmb3JtYW5jZUxhc3QxMk1vbnRocyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5BbmFseXRpY3MuZ2V0RGF0YUVuZXJneTEyTW9udGhcIiwgeyBncm91cEludmVydGVyIH0pO1xyXG5cclxuXHRcdFx0XHRcdC8vIFBlcmZvcm1hbmNlIC0gTGFzdCAzMSBkYXlzXHJcblx0XHRcdFx0XHRycy5wZXJmb3JtYW5jZUxhc3QzMERheXMgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluQW5hbHl0aWNzLmdldERhdGFFbmVyZ3kzMERheXNcIiwgeyBncm91cEludmVydGVyIH0pO1xyXG5cclxuXHRcdFx0XHRcdC8vIERhaWx5IE1heCBQb3dlciAtIExhc3QgMTIgTW9udGhzXHJcblx0XHRcdFx0XHRycy5tYXhQb3dlcjEyTW9udGhzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpbkFuYWx5dGljcy5nZXREYXRhTWF4UG93ZXIxMk1vbnRoc1wiLCB7IGdyb3VwSW52ZXJ0ZXIgfSk7XHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHJzKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0Z2V0TGlzdERldmljZUJ5UHJvamVjdChwYXJhbSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIGdldExpc3REZXZpY2UgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluQW5hbHl0aWNzLmdldExpc3REZXZpY2VCeVByb2plY3RcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0aWYgKCFnZXRMaXN0RGV2aWNlKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmIChnZXRMaXN0RGV2aWNlLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IGdldExpc3REZXZpY2UubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRnZXRMaXN0RGV2aWNlW2ldLmRhdGFQYXJhbWV0ZXIgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluQW5hbHl0aWNzLmdldFBhcmFtZXRlckJ5RGV2aWNlXCIsIGdldExpc3REZXZpY2VbaV0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBnZXRMaXN0RGV2aWNlKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGdldENoYXJ0UGFyYW1ldGVyRGV2aWNlKHBhcmFtLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgZGF0YSA9IFtdO1xyXG5cdFx0XHRcdFx0dmFyIGRhdGFEZXZpY2UgPSBwYXJhbS5kYXRhRGV2aWNlO1xyXG5cdFx0XHRcdFx0aWYgKCFMaWJzLmlzQXJyYXlEYXRhKGRhdGFEZXZpY2UpKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW4gPSBkYXRhRGV2aWNlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdHZhciBwYXJhbXMgPSB7XHJcblx0XHRcdFx0XHRcdFx0ZmlsdGVyQnk6IHBhcmFtLmZpbHRlckJ5LFxyXG5cdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksXHJcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGU6IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpLFxyXG5cdFx0XHRcdFx0XHRcdGRhdGFfc2VuZF90aW1lOiBwYXJhbS5kYXRhX3NlbmRfdGltZSxcclxuXHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBkYXRhRGV2aWNlW2ldLnRhYmxlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0aWQ6IGRhdGFEZXZpY2VbaV0uaWRcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0dmFyIGRhdGFFbmVyZ3kgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluQW5hbHl0aWNzLmdldERhdGFDaGFydFBhcmFtZXRlclwiLCBwYXJhbXMpO1xyXG5cclxuXHRcdFx0XHRcdFx0c3dpdGNoIChwYXJhbS5maWx0ZXJCeSkge1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgJzNfZGF5JzpcclxuXHRcdFx0XHRcdFx0XHRjYXNlICd0b2RheSc6XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgYXJyVGltZTUgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChwYXJhbXMuZmlsdGVyQnkgPT0gJ3RvZGF5Jykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBnZW5hcmV0ZSBkYXRhIDUgbXVuaXRlc1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAocGFyYW0uZGF0YV9zZW5kX3RpbWUgPT0gMSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBjdXJEYXRlNSA9IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBjdXJEYXRlRm9ybWF0NSA9IG1vbWVudChjdXJEYXRlNSkuZm9ybWF0KCdZWVlZLU1NLUREIDA1OjAwJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgdCA9IDA7IHQgPCAxNjg7IHQrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyVGltZTUucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiBtb21lbnQoY3VyRGF0ZUZvcm1hdDUpLmFkZCg1ICogdCwgJ21pbnV0ZXMnKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiBtb21lbnQoY3VyRGF0ZUZvcm1hdDUpLmFkZCg1ICogdCwgJ21pbnV0ZXMnKS5mb3JtYXQoJ0REL01NL1lZWVkgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllc190aW1lOiBtb21lbnQoY3VyRGF0ZUZvcm1hdDUpLmFkZCg1ICogdCwgJ21pbnV0ZXMnKS5mb3JtYXQoJ0hIOm1tJylcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGdlbmFyZXRlIGRhdGEgMTUgbXVuaXRlc1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAocGFyYW0uZGF0YV9zZW5kX3RpbWUgPT0gMikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBjdXJEYXRlMTUgPSBMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgY3VyRGF0ZUZvcm1hdDE1ID0gbW9tZW50KGN1ckRhdGUxNSkuZm9ybWF0KCdZWVlZLU1NLUREIDA1OjAwJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgbiA9IDA7IG4gPCA1NjsgbisrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJUaW1lNS5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IG1vbWVudChjdXJEYXRlRm9ybWF0MTUpLmFkZCgxNSAqIG4sICdtaW51dGVzJykuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogbW9tZW50KGN1ckRhdGVGb3JtYXQxNSkuYWRkKDE1ICogbiwgJ21pbnV0ZXMnKS5mb3JtYXQoJ0REL01NL1lZWVkgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllc190aW1lOiBtb21lbnQoY3VyRGF0ZUZvcm1hdDE1KS5hZGQoMTUgKiBuLCAnbWludXRlcycpLmZvcm1hdCgnSEg6bW0nKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gZ2VuYXJldGUgZGF0YSAxIGhvdXJcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHBhcmFtLmRhdGFfc2VuZF90aW1lID09IDMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgY3VyRGF0ZTFoID0gTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGN1ckRhdGVGb3JtYXQxaCA9IG1vbWVudChjdXJEYXRlMWgpLmZvcm1hdCgnWVlZWS1NTS1ERCAwNTowMCcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIG4gPSAwOyBuIDwgMTQ7IG4rKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyVGltZTUucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiBtb21lbnQoY3VyRGF0ZUZvcm1hdDFoKS5hZGQoMSAqIG4sICdob3VycycpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IG1vbWVudChjdXJEYXRlRm9ybWF0MWgpLmFkZCgxICogbiwgJ2hvdXJzJykuZm9ybWF0KCdERC9NTS9ZWVlZIEhIOm1tJyksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNhdGVnb3JpZXNfdGltZTogbW9tZW50KGN1ckRhdGVGb3JtYXQxaCkuYWRkKDEgKiBuLCAnaG91cnMnKS5mb3JtYXQoJ0hIOm1tJylcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGdlbmFyZXRlIGRhdGEgNSBtdW5pdGVzXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAocGFyYW1zLmZpbHRlckJ5ID09ICczX2RheScgJiYgcGFyYW1zLmRhdGFfc2VuZF90aW1lID09IDEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IHN0YXJ0RGF0ZSA9ICcnLCBlbmREYXRlID0gJyc7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGkgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0RGF0ZSA9IG1vbWVudChMaWJzLmFkZERheXMoTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSksIC0yKSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbmREYXRlID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKSwgLTIpKS5mb3JtYXQoJ1lZWVktTU0tREQgMTk6MDAnKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnREYXRlID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLnN0YXJ0X2RhdGUpLCBpKSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbmREYXRlID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLnN0YXJ0X2RhdGUpLCBpKSkuZm9ybWF0KCdZWVlZLU1NLUREIDE5OjAwJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgY3VyRGF0ZUZvcm1hdCA9IG1vbWVudChzdGFydERhdGUpLmZvcm1hdCgnWVlZWS1NTS1ERCAwNTowMCcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGggPSAwOyBoIDwgMTY4OyBoKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyclRpbWU1LnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdDogbW9tZW50KGN1ckRhdGVGb3JtYXQpLmFkZCg1ICogaCwgJ21pbnV0ZXMnKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiBtb21lbnQoY3VyRGF0ZUZvcm1hdCkuYWRkKDUgKiBoLCAnbWludXRlcycpLmZvcm1hdCgnREQvTU0vWVlZWSBISDptbScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzX3RpbWU6IG1vbWVudChjdXJEYXRlRm9ybWF0KS5hZGQoNSAqIGgsICdtaW51dGVzJykuZm9ybWF0KCdELiBNTU0nKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZ2VuYXJldGUgZGF0YSAxNSBtdW5pdGVzXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAocGFyYW1zLmZpbHRlckJ5ID09ICczX2RheScgJiYgcGFyYW1zLmRhdGFfc2VuZF90aW1lID09IDIpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IHN0YXJ0RGF0ZSA9ICcnLCBlbmREYXRlID0gJyc7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGkgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0RGF0ZSA9IG1vbWVudChMaWJzLmFkZERheXMoTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSksIC0yKSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbmREYXRlID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKSwgLTIpKS5mb3JtYXQoJ1lZWVktTU0tREQgMTk6MDAnKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnREYXRlID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLnN0YXJ0X2RhdGUpLCBpKSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbmREYXRlID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLnN0YXJ0X2RhdGUpLCBpKSkuZm9ybWF0KCdZWVlZLU1NLUREIDE5OjAwJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgY3VyRGF0ZUZvcm1hdCA9IG1vbWVudChzdGFydERhdGUpLmZvcm1hdCgnWVlZWS1NTS1ERCAwNTowMCcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGggPSAwOyBoIDwgNTY7IGgrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyVGltZTUucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiBtb21lbnQoY3VyRGF0ZUZvcm1hdCkuYWRkKDE1ICogaCwgJ21pbnV0ZXMnKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiBtb21lbnQoY3VyRGF0ZUZvcm1hdCkuYWRkKDE1ICogaCwgJ21pbnV0ZXMnKS5mb3JtYXQoJ0REL01NL1lZWVkgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllc190aW1lOiBtb21lbnQoY3VyRGF0ZUZvcm1hdCkuYWRkKDE1ICogaCwgJ21pbnV0ZXMnKS5mb3JtYXQoJ0QuIE1NTScpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZ2VuYXJldGUgZGF0YSAxIGhvdXJcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChwYXJhbXMuZmlsdGVyQnkgPT0gJzNfZGF5JyAmJiBwYXJhbXMuZGF0YV9zZW5kX3RpbWUgPT0gMykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgc3RhcnREYXRlID0gJycsIGVuZERhdGUgPSAnJztcclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnREYXRlID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKSwgLTIpKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVuZERhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpLCAtMikpLmZvcm1hdCgnWVlZWS1NTS1ERCAxOTowMCcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydERhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksIGkpKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVuZERhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksIGkpKS5mb3JtYXQoJ1lZWVktTU0tREQgMTk6MDAnKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBjdXJEYXRlRm9ybWF0ID0gbW9tZW50KHN0YXJ0RGF0ZSkuZm9ybWF0KCdZWVlZLU1NLUREIDA1OjAwJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaCA9IDA7IGggPD0gMTQ7IGgrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyVGltZTUucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiBtb21lbnQoY3VyRGF0ZUZvcm1hdCkuYWRkKDEgKiBoLCAnaG91cnMnKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiBtb21lbnQoY3VyRGF0ZUZvcm1hdCkuYWRkKDEgKiBoLCAnaG91cnMnKS5mb3JtYXQoJ0REL01NL1lZWVkgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllc190aW1lOiBtb21lbnQoY3VyRGF0ZUZvcm1hdCkuYWRkKDEgKiBoLCAnaG91cnMnKS5mb3JtYXQoJ0QuIE1NTScpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneTUgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRcdHN3aXRjaCAoZGF0YURldmljZVtpXS50YWJsZV9uYW1lKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TSFA3NSc6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneTUgPSBPYmplY3QudmFsdWVzKFsuLi5hcnJUaW1lNSwgLi4uZGF0YUVuZXJneV0ucmVkdWNlKChhY2MsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0LCB0aW1lX2Z1bGwsIGNhdGVnb3JpZXNfdGltZSwgYWNDdXJyZW50LCBjdXJyZW50UGhhc2VBLCBjdXJyZW50UGhhc2VCLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQywgdm9sdGFnZVBoYXNlQSwgdm9sdGFnZVBoYXNlQiwgdm9sdGFnZVBoYXNlQywgYWN0aXZlUG93ZXIsIHBvd2VyRnJlcXVlbmN5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXBwYXJlbnRQb3dlciwgcmVhY3RpdmVQb3dlciwgcG93ZXJGYWN0b3IsIGFjdGl2ZUVuZXJneSwgZGNDdXJyZW50LCBkY1ZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkY1Bvd2VyLCBpbnRlcm5hbFRlbXBlcmF0dXJlLCBoZWF0U2lua1RlbXBlcmF0dXJlLCB0cmFuc2Zvcm1lclRlbXBlcmF0dXJlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiB0aW1lX2Zvcm1hdCA/IHRpbWVfZm9ybWF0IDogYWNjW3RpbWVfZnVsbF0udGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogdGltZV9mdWxsID8gdGltZV9mdWxsIDogYWNjW3RpbWVfZnVsbF0udGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzX3RpbWU6IGNhdGVnb3JpZXNfdGltZSA/IGNhdGVnb3JpZXNfdGltZSA6IGFjY1t0aW1lX2Z1bGxdLmNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNDdXJyZW50OiBhY0N1cnJlbnQgPyBhY0N1cnJlbnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VBOiBjdXJyZW50UGhhc2VBID8gY3VycmVudFBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUI6IGN1cnJlbnRQaGFzZUIgPyBjdXJyZW50UGhhc2VCIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQzogY3VycmVudFBoYXNlQyA/IGN1cnJlbnRQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VBOiB2b2x0YWdlUGhhc2VBID8gdm9sdGFnZVBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUI6IHZvbHRhZ2VQaGFzZUIgPyB2b2x0YWdlUGhhc2VCIDogdm9sdGFnZVBoYXNlQixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQzogdm9sdGFnZVBoYXNlQyA/IHZvbHRhZ2VQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogYWN0aXZlUG93ZXIgPyBhY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRnJlcXVlbmN5OiBwb3dlckZyZXF1ZW5jeSA/IHBvd2VyRnJlcXVlbmN5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXBwYXJlbnRQb3dlcjogYXBwYXJlbnRQb3dlciA/IGFwcGFyZW50UG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZVBvd2VyOiByZWFjdGl2ZVBvd2VyID8gcmVhY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yOiBwb3dlckZhY3RvciA/IHBvd2VyRmFjdG9yIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiBhY3RpdmVFbmVyZ3kgPyBhY3RpdmVFbmVyZ3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkY0N1cnJlbnQ6IGRjQ3VycmVudCA/IGRjQ3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjVm9sdGFnZTogZGNWb2x0YWdlID8gZGNWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGNQb3dlcjogZGNQb3dlciA/IGRjUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpbnRlcm5hbFRlbXBlcmF0dXJlOiBpbnRlcm5hbFRlbXBlcmF0dXJlID8gaW50ZXJuYWxUZW1wZXJhdHVyZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYXRTaW5rVGVtcGVyYXR1cmU6IGhlYXRTaW5rVGVtcGVyYXR1cmUgPyBoZWF0U2lua1RlbXBlcmF0dXJlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHJhbnNmb3JtZXJUZW1wZXJhdHVyZTogdHJhbnNmb3JtZXJUZW1wZXJhdHVyZSA/IHRyYW5zZm9ybWVyVGVtcGVyYXR1cmUgOiBudWxsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmRhdGEgPSBkYXRhRW5lcmd5NTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX0FCQl9QVlMxMDAnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3k1ID0gT2JqZWN0LnZhbHVlcyhbLi4uYXJyVGltZTUsIC4uLmRhdGFFbmVyZ3ldLnJlZHVjZSgoYWNjLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBjYXRlZ29yaWVzX3RpbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY0N1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VBLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VBLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRnJlcXVlbmN5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXBwYXJlbnRQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZhY3RvcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjQ3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjVm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpbnRlcm5hbFRlbXBlcmF0dXJlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhdFNpbmtUZW1wZXJhdHVyZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxQ3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxVm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MkN1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MlZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MlBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDNDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDNWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDNQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ0Q3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ0Vm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ0UG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NUN1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NVZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NVBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDZDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDZWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDZQb3dlclxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjY1t0aW1lX2Z1bGxdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdDogdGltZV9mb3JtYXQgPyB0aW1lX2Zvcm1hdCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IHRpbWVfZnVsbCA/IHRpbWVfZnVsbCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllc190aW1lOiBjYXRlZ29yaWVzX3RpbWUgPyBjYXRlZ29yaWVzX3RpbWUgOiBhY2NbdGltZV9mdWxsXS5jYXRlZ29yaWVzX3RpbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjQ3VycmVudDogYWNDdXJyZW50ID8gYWNDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQTogY3VycmVudFBoYXNlQSA/IGN1cnJlbnRQaGFzZUEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VCOiBjdXJyZW50UGhhc2VCID8gY3VycmVudFBoYXNlQiA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUM6IGN1cnJlbnRQaGFzZUMgPyBjdXJyZW50UGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQTogdm9sdGFnZVBoYXNlQSA/IHZvbHRhZ2VQaGFzZUEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VCOiB2b2x0YWdlUGhhc2VCID8gdm9sdGFnZVBoYXNlQiA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUM6IHZvbHRhZ2VQaGFzZUMgPyB2b2x0YWdlUGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXI6IGFjdGl2ZVBvd2VyID8gYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZyZXF1ZW5jeTogcG93ZXJGcmVxdWVuY3kgPyBwb3dlckZyZXF1ZW5jeSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFwcGFyZW50UG93ZXI6IGFwcGFyZW50UG93ZXIgPyBhcHBhcmVudFBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVQb3dlcjogcmVhY3RpdmVQb3dlciA/IHJlYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZhY3RvcjogcG93ZXJGYWN0b3IgPyBwb3dlckZhY3RvciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogYWN0aXZlRW5lcmd5ID8gYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGNDdXJyZW50OiBkY0N1cnJlbnQgPyBkY0N1cnJlbnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkY1ZvbHRhZ2U6IGRjVm9sdGFnZSA/IGRjVm9sdGFnZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjUG93ZXI6IGRjUG93ZXIgPyBkY1Bvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aW50ZXJuYWxUZW1wZXJhdHVyZTogaW50ZXJuYWxUZW1wZXJhdHVyZSA/IGludGVybmFsVGVtcGVyYXR1cmUgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoZWF0U2lua1RlbXBlcmF0dXJlOiBoZWF0U2lua1RlbXBlcmF0dXJlID8gaGVhdFNpbmtUZW1wZXJhdHVyZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxQ3VycmVudDogbXBwdDFDdXJyZW50ID8gbXBwdDFDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDFWb2x0YWdlOiBtcHB0MVZvbHRhZ2UgPyBtcHB0MVZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MVBvd2VyOiBtcHB0MVBvd2VyID8gbXBwdDFQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQyQ3VycmVudDogbXBwdDJDdXJyZW50ID8gbXBwdDJDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDJWb2x0YWdlOiBtcHB0MlZvbHRhZ2UgPyBtcHB0MlZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MlBvd2VyOiBtcHB0MlBvd2VyID8gbXBwdDJQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQzQ3VycmVudDogbXBwdDNDdXJyZW50ID8gbXBwdDNDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDNWb2x0YWdlOiBtcHB0M1ZvbHRhZ2UgPyBtcHB0M1ZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0M1Bvd2VyOiBtcHB0M1Bvd2VyID8gbXBwdDNQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ0Q3VycmVudDogbXBwdDRDdXJyZW50ID8gbXBwdDRDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDRWb2x0YWdlOiBtcHB0NFZvbHRhZ2UgPyBtcHB0NFZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NFBvd2VyOiBtcHB0NFBvd2VyID8gbXBwdDRQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ1Q3VycmVudDogbXBwdDVDdXJyZW50ID8gbXBwdDVDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDVWb2x0YWdlOiBtcHB0NVZvbHRhZ2UgPyBtcHB0NVZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NVBvd2VyOiBtcHB0NVBvd2VyID8gbXBwdDVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ2Q3VycmVudDogbXBwdDZDdXJyZW50ID8gbXBwdDZDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDZWb2x0YWdlOiBtcHB0NlZvbHRhZ2UgPyBtcHB0NlZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NlBvd2VyOiBtcHB0NlBvd2VyID8gbXBwdDZQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmRhdGEgPSBkYXRhRW5lcmd5NTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NUUDUwJzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5NSA9IE9iamVjdC52YWx1ZXMoWy4uLmFyclRpbWU1LCAuLi5kYXRhRW5lcmd5XS5yZWR1Y2UoKGFjYywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQsIHRpbWVfZnVsbCwgY2F0ZWdvcmllc190aW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZyZXF1ZW5jeSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFwcGFyZW50UG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZVBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3IsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYWlseUVuZXJneSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjQ3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjVm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpbnRlcm5hbFRlbXBlcmF0dXJlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDFDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDFWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDFQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQyQ3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQyVm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQyUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0M0N1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0M1ZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0M1Bvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDRDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDRWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDRQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ1Q3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ1Vm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ1UG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NkN1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NlZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NlBvd2VyXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjY1t0aW1lX2Z1bGxdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdDogdGltZV9mb3JtYXQgPyB0aW1lX2Zvcm1hdCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IHRpbWVfZnVsbCA/IHRpbWVfZnVsbCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllc190aW1lOiBjYXRlZ29yaWVzX3RpbWUgPyBjYXRlZ29yaWVzX3RpbWUgOiBhY2NbdGltZV9mdWxsXS5jYXRlZ29yaWVzX3RpbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUE6IGN1cnJlbnRQaGFzZUEgPyBjdXJyZW50UGhhc2VBIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQjogY3VycmVudFBoYXNlQiA/IGN1cnJlbnRQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VDOiBjdXJyZW50UGhhc2VDID8gY3VycmVudFBoYXNlQyA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUE6IHZvbHRhZ2VQaGFzZUEgPyB2b2x0YWdlUGhhc2VBIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQjogdm9sdGFnZVBoYXNlQiA/IHZvbHRhZ2VQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VDOiB2b2x0YWdlUGhhc2VDID8gdm9sdGFnZVBoYXNlQyA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiBhY3RpdmVQb3dlciA/IGFjdGl2ZVBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGcmVxdWVuY3k6IHBvd2VyRnJlcXVlbmN5ID8gcG93ZXJGcmVxdWVuY3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcHBhcmVudFBvd2VyOiBhcHBhcmVudFBvd2VyID8gYXBwYXJlbnRQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlUG93ZXI6IHJlYWN0aXZlUG93ZXIgPyByZWFjdGl2ZVBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3I6IHBvd2VyRmFjdG9yID8gcG93ZXJGYWN0b3IgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IGFjdGl2ZUVuZXJneSA/IGFjdGl2ZUVuZXJneSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhaWx5RW5lcmd5OiBkYWlseUVuZXJneSA/IGRhaWx5RW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGNDdXJyZW50OiBkY0N1cnJlbnQgPyBkY0N1cnJlbnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkY1ZvbHRhZ2U6IGRjVm9sdGFnZSA/IGRjVm9sdGFnZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjUG93ZXI6IGRjUG93ZXIgPyBkY1Bvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aW50ZXJuYWxUZW1wZXJhdHVyZTogaW50ZXJuYWxUZW1wZXJhdHVyZSA/IGludGVybmFsVGVtcGVyYXR1cmUgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MUN1cnJlbnQ6IG1wcHQxQ3VycmVudCA/IG1wcHQxQ3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxVm9sdGFnZTogbXBwdDFWb2x0YWdlID8gbXBwdDFWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDFQb3dlcjogbXBwdDFQb3dlciA/IG1wcHQxUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MkN1cnJlbnQ6IG1wcHQyQ3VycmVudCA/IG1wcHQyQ3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQyVm9sdGFnZTogbXBwdDJWb2x0YWdlID8gbXBwdDJWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDJQb3dlcjogbXBwdDJQb3dlciA/IG1wcHQyUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0M0N1cnJlbnQ6IG1wcHQzQ3VycmVudCA/IG1wcHQzQ3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQzVm9sdGFnZTogbXBwdDNWb2x0YWdlID8gbXBwdDNWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDNQb3dlcjogbXBwdDNQb3dlciA/IG1wcHQzUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NEN1cnJlbnQ6IG1wcHQ0Q3VycmVudCA/IG1wcHQ0Q3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ0Vm9sdGFnZTogbXBwdDRWb2x0YWdlID8gbXBwdDRWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDRQb3dlcjogbXBwdDRQb3dlciA/IG1wcHQ0UG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NUN1cnJlbnQ6IG1wcHQ1Q3VycmVudCA/IG1wcHQ1Q3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ1Vm9sdGFnZTogbXBwdDVWb2x0YWdlID8gbXBwdDVWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDVQb3dlcjogbXBwdDVQb3dlciA/IG1wcHQ1UG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NkN1cnJlbnQ6IG1wcHQ2Q3VycmVudCA/IG1wcHQ2Q3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ2Vm9sdGFnZTogbXBwdDZWb2x0YWdlID8gbXBwdDZWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDZQb3dlcjogbXBwdDZQb3dlciA/IG1wcHQ2UG93ZXIgOiBudWxsXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5kYXRhID0gZGF0YUVuZXJneTU7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9sb2dnZXJfU01BX0lNMjAnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3k1ID0gT2JqZWN0LnZhbHVlcyhbLi4uYXJyVGltZTUsIC4uLmRhdGFFbmVyZ3ldLnJlZHVjZSgoYWNjLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBjYXRlZ29yaWVzX3RpbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtYW51ZmFjdHVyZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtb2RlbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNlcmlhbE51bWJlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZGJ1c1VuaXRJZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjY1t0aW1lX2Z1bGxdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdDogdGltZV9mb3JtYXQgPyB0aW1lX2Zvcm1hdCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IHRpbWVfZnVsbCA/IHRpbWVfZnVsbCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllc190aW1lOiBjYXRlZ29yaWVzX3RpbWUgPyBjYXRlZ29yaWVzX3RpbWUgOiBhY2NbdGltZV9mdWxsXS5jYXRlZ29yaWVzX3RpbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1hbnVmYWN0dXJlcjogbWFudWZhY3R1cmVyID8gbWFudWZhY3R1cmVyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bW9kZWw6IG1vZGVsID8gbW9kZWwgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZXJpYWxOdW1iZXI6IHNlcmlhbE51bWJlciA/IHNlcmlhbE51bWJlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZGJ1c1VuaXRJZDogbW9kYnVzVW5pdElkID8gbW9kYnVzVW5pdElkIDogbnVsbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5kYXRhID0gZGF0YUVuZXJneTU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX3NlbnNvcl9JTVRfU2lSUzQ4NSc6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneTUgPSBPYmplY3QudmFsdWVzKFsuLi5hcnJUaW1lNSwgLi4uZGF0YUVuZXJneV0ucmVkdWNlKChhY2MsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0LCB0aW1lX2Z1bGwsIGNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlycmFkaWFuY2VQb0EsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjZWxsVGVtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBhbmVsVGVtcFxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY2NbdGltZV9mdWxsXSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IHRpbWVfZm9ybWF0ID8gdGltZV9mb3JtYXQgOiBhY2NbdGltZV9mdWxsXS50aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiB0aW1lX2Z1bGwgPyB0aW1lX2Z1bGwgOiBhY2NbdGltZV9mdWxsXS50aW1lX2Z1bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNhdGVnb3JpZXNfdGltZTogY2F0ZWdvcmllc190aW1lID8gY2F0ZWdvcmllc190aW1lIDogYWNjW3RpbWVfZnVsbF0uY2F0ZWdvcmllc190aW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpcnJhZGlhbmNlUG9BOiBpcnJhZGlhbmNlUG9BID8gaXJyYWRpYW5jZVBvQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNlbGxUZW1wOiBjZWxsVGVtcCA/IGNlbGxUZW1wIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cGFuZWxUZW1wOiBwYW5lbFRlbXAgPyBwYW5lbFRlbXAgOiBudWxsXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5kYXRhID0gZGF0YUVuZXJneTU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX3NlbnNvcl9JTVRfVGFSUzQ4NSc6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneTUgPSBPYmplY3QudmFsdWVzKFsuLi5hcnJUaW1lNSwgLi4uZGF0YUVuZXJneV0ucmVkdWNlKChhY2MsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0LCB0aW1lX2Z1bGwsIGNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFtYmllbnRUZW1wXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjY1t0aW1lX2Z1bGxdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdDogdGltZV9mb3JtYXQgPyB0aW1lX2Zvcm1hdCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IHRpbWVfZnVsbCA/IHRpbWVfZnVsbCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllc190aW1lOiBjYXRlZ29yaWVzX3RpbWUgPyBjYXRlZ29yaWVzX3RpbWUgOiBhY2NbdGltZV9mdWxsXS5jYXRlZ29yaWVzX3RpbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFtYmllbnRUZW1wOiBhbWJpZW50VGVtcCA/IGFtYmllbnRUZW1wIDogbnVsbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5kYXRhID0gZGF0YUVuZXJneTU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX3RlY2hlZGdlJzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5NSA9IE9iamVjdC52YWx1ZXMoWy4uLmFyclRpbWU1LCAuLi5kYXRhRW5lcmd5XS5yZWR1Y2UoKGFjYywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQsIHRpbWVfZnVsbCwgY2F0ZWdvcmllc190aW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVtUGVyY2VudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lbVRvdGFsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVtVXNlZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lbUF2YWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVtRnJlZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRpc2tQZXJjZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGlza1RvdGFsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGlza1VzZWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkaXNrRnJlZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNwdVRlbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR1cFRpbWVcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiB0aW1lX2Zvcm1hdCA/IHRpbWVfZm9ybWF0IDogYWNjW3RpbWVfZnVsbF0udGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogdGltZV9mdWxsID8gdGltZV9mdWxsIDogYWNjW3RpbWVfZnVsbF0udGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzX3RpbWU6IGNhdGVnb3JpZXNfdGltZSA/IGNhdGVnb3JpZXNfdGltZSA6IGFjY1t0aW1lX2Z1bGxdLmNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVtUGVyY2VudDogbWVtUGVyY2VudCA/IG1lbVBlcmNlbnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZW1Ub3RhbDogbWVtVG90YWwgPyBtZW1Ub3RhbCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lbVVzZWQ6IG1lbVVzZWQgPyBtZW1Vc2VkIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVtQXZhaWw6IG1lbUF2YWlsID8gbWVtQXZhaWwgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZW1GcmVlOiBtZW1GcmVlID8gbWVtRnJlZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRpc2tQZXJjZW50OiBkaXNrUGVyY2VudCA/IGRpc2tQZXJjZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGlza1RvdGFsOiBkaXNrVG90YWwgPyBkaXNrVG90YWwgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkaXNrVXNlZDogZGlza1VzZWQgPyBkaXNrVXNlZCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRpc2tGcmVlOiBkaXNrRnJlZSA/IGRpc2tGcmVlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3B1VGVtcDogY3B1VGVtcCA/IGNwdVRlbXAgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR1cFRpbWU6IHVwVGltZSA/IHVwVGltZSA6IG51bGxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0sIHt9KSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0uZGF0YSA9IGRhdGFFbmVyZ3k1O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU1RQMTEwJzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5NSA9IE9iamVjdC52YWx1ZXMoWy4uLmFyclRpbWU1LCAuLi5kYXRhRW5lcmd5XS5yZWR1Y2UoKGFjYywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQsIHRpbWVfZnVsbCwgY2F0ZWdvcmllc190aW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZyZXF1ZW5jeSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFwcGFyZW50UG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZVBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3IsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkY0N1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkY1ZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkY1Bvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FiaW5ldFRlbXBlcmF0dXJlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDFDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDFWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDFQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQyQ3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQyVm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQyUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0M0N1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0M1ZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0M1Bvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDRDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDRWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDRQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ1Q3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ1Vm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ1UG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NkN1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NlZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NlBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDdDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDdWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDdQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ4Q3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ4Vm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ4UG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0OUN1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0OVZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0OVBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDEwQ3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxMFZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MTBQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxMUN1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MTFWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDExUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MTJDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDEyVm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxMlBvd2VyXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjY1t0aW1lX2Z1bGxdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdDogdGltZV9mb3JtYXQgPyB0aW1lX2Zvcm1hdCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IHRpbWVfZnVsbCA/IHRpbWVfZnVsbCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllc190aW1lOiBjYXRlZ29yaWVzX3RpbWUgPyBjYXRlZ29yaWVzX3RpbWUgOiBhY2NbdGltZV9mdWxsXS5jYXRlZ29yaWVzX3RpbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjQ3VycmVudDogYWNDdXJyZW50ID8gYWNDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQTogY3VycmVudFBoYXNlQSA/IGN1cnJlbnRQaGFzZUEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VCOiBjdXJyZW50UGhhc2VCID8gY3VycmVudFBoYXNlQiA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUM6IGN1cnJlbnRQaGFzZUMgPyBjdXJyZW50UGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQTogdm9sdGFnZVBoYXNlQSA/IHZvbHRhZ2VQaGFzZUEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VCOiB2b2x0YWdlUGhhc2VCID8gdm9sdGFnZVBoYXNlQiA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUM6IHZvbHRhZ2VQaGFzZUMgPyB2b2x0YWdlUGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXI6IGFjdGl2ZVBvd2VyID8gYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZyZXF1ZW5jeTogcG93ZXJGcmVxdWVuY3kgPyBwb3dlckZyZXF1ZW5jeSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFwcGFyZW50UG93ZXI6IGFwcGFyZW50UG93ZXIgPyBhcHBhcmVudFBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVQb3dlcjogcmVhY3RpdmVQb3dlciA/IHJlYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZhY3RvcjogcG93ZXJGYWN0b3IgPyBwb3dlckZhY3RvciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogYWN0aXZlRW5lcmd5ID8gYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGNDdXJyZW50OiBkY0N1cnJlbnQgPyBkY0N1cnJlbnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkY1ZvbHRhZ2U6IGRjVm9sdGFnZSA/IGRjVm9sdGFnZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjUG93ZXI6IGRjUG93ZXIgPyBkY1Bvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FiaW5ldFRlbXBlcmF0dXJlOiBjYWJpbmV0VGVtcGVyYXR1cmUgPyBjYWJpbmV0VGVtcGVyYXR1cmUgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MUN1cnJlbnQ6IG1wcHQxQ3VycmVudCA/IG1wcHQxQ3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxVm9sdGFnZTogbXBwdDFWb2x0YWdlID8gbXBwdDFWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDFQb3dlcjogbXBwdDFQb3dlciA/IG1wcHQxUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MkN1cnJlbnQ6IG1wcHQyQ3VycmVudCA/IG1wcHQyQ3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQyVm9sdGFnZTogbXBwdDJWb2x0YWdlID8gbXBwdDJWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDJQb3dlcjogbXBwdDJQb3dlciA/IG1wcHQyUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0M0N1cnJlbnQ6IG1wcHQzQ3VycmVudCA/IG1wcHQzQ3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQzVm9sdGFnZTogbXBwdDNWb2x0YWdlID8gbXBwdDNWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDNQb3dlcjogbXBwdDNQb3dlciA/IG1wcHQzUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NEN1cnJlbnQ6IG1wcHQ0Q3VycmVudCA/IG1wcHQ0Q3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ0Vm9sdGFnZTogbXBwdDRWb2x0YWdlID8gbXBwdDRWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDRQb3dlcjogbXBwdDRQb3dlciA/IG1wcHQ0UG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NUN1cnJlbnQ6IG1wcHQ1Q3VycmVudCA/IG1wcHQ1Q3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ1Vm9sdGFnZTogbXBwdDVWb2x0YWdlID8gbXBwdDVWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDVQb3dlcjogbXBwdDVQb3dlciA/IG1wcHQ1UG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NkN1cnJlbnQ6IG1wcHQ2Q3VycmVudCA/IG1wcHQ2Q3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ2Vm9sdGFnZTogbXBwdDZWb2x0YWdlID8gbXBwdDZWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDZQb3dlcjogbXBwdDZQb3dlciA/IG1wcHQ2UG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0N0N1cnJlbnQ6IG1wcHQ3Q3VycmVudCA/IG1wcHQ3Q3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ3Vm9sdGFnZTogbXBwdDdWb2x0YWdlID8gbXBwdDdWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDdQb3dlcjogbXBwdDdQb3dlciA/IG1wcHQ3UG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0OEN1cnJlbnQ6IG1wcHQ4Q3VycmVudCA/IG1wcHQ4Q3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ4Vm9sdGFnZTogbXBwdDhWb2x0YWdlID8gbXBwdDhWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDhQb3dlcjogbXBwdDhQb3dlciA/IG1wcHQ4UG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0OUN1cnJlbnQ6IG1wcHQ5Q3VycmVudCA/IG1wcHQ5Q3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ5Vm9sdGFnZTogbXBwdDlWb2x0YWdlID8gbXBwdDlWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDlQb3dlcjogbXBwdDlQb3dlciA/IG1wcHQ5UG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MTBDdXJyZW50OiBtcHB0MTBDdXJyZW50ID8gbXBwdDEwQ3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxMFZvbHRhZ2U6IG1wcHQxMFZvbHRhZ2UgPyBtcHB0MTBWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDEwUG93ZXI6IG1wcHQxMFBvd2VyID8gbXBwdDEwUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MTFDdXJyZW50OiBtcHB0MTFDdXJyZW50ID8gbXBwdDExQ3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxMVZvbHRhZ2U6IG1wcHQxMVZvbHRhZ2UgPyBtcHB0MTFWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDExUG93ZXI6IG1wcHQxMVBvd2VyID8gbXBwdDExUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MTJDdXJyZW50OiBtcHB0MTJDdXJyZW50ID8gbXBwdDEyQ3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxMlZvbHRhZ2U6IG1wcHQxMlZvbHRhZ2UgPyBtcHB0MTJWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDEyUG93ZXI6IG1wcHQxMlBvd2VyID8gbXBwdDEyUG93ZXIgOiBudWxsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmRhdGEgPSBkYXRhRW5lcmd5NTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfZW1ldGVyX1ZpbmFzaW5vX1ZTRTNUNSc6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneTUgPSBPYmplY3QudmFsdWVzKFsuLi5hcnJUaW1lNSwgLi4uZGF0YUVuZXJneV0ucmVkdWNlKChhY2MsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0LCB0aW1lX2Z1bGwsIGNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneVJhdGUxLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5UmF0ZTIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lSYXRlMyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlUmF0ZTEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGcmVxdWVuY3ksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZhY3RvcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyUGhhc2VBLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXJQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlclBoYXNlQyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlUG93ZXJQaGFzZUEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZVBvd2VyUGhhc2VCLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVQb3dlclBoYXNlQyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyTWF4RGVtYW5kLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXJNYXhEZW1hbmRSYXRlMSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyTWF4RGVtYW5kUmF0ZTIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlck1heERlbWFuZFJhdGUzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3JQaGFzZUEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZhY3RvclBoYXNlQixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Q1RyYXRpb1ByaW1hcnksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRDVHJhdGlvU2Vjb25kYXJ5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0UFRyYXRpb1ByaW1hcnksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRQVHJhdGlvU2Vjb25kYXJ5XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiB0aW1lX2Zvcm1hdCA/IHRpbWVfZm9ybWF0IDogYWNjW3RpbWVfZnVsbF0udGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogdGltZV9mdWxsID8gdGltZV9mdWxsIDogYWNjW3RpbWVfZnVsbF0udGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzX3RpbWU6IGNhdGVnb3JpZXNfdGltZSA/IGNhdGVnb3JpZXNfdGltZSA6IGFjY1t0aW1lX2Z1bGxdLmNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiBhY3RpdmVFbmVyZ3kgPyBhY3RpdmVFbmVyZ3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lSYXRlMTogYWN0aXZlRW5lcmd5UmF0ZTEgPyBhY3RpdmVFbmVyZ3lSYXRlMSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneVJhdGUyOiBhY3RpdmVFbmVyZ3lSYXRlMiA/IGFjdGl2ZUVuZXJneVJhdGUyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5UmF0ZTM6IGFjdGl2ZUVuZXJneVJhdGUzID8gYWN0aXZlRW5lcmd5UmF0ZTMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUluZHVjdGl2ZTogcmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmUgPyByZWFjdGl2ZUVuZXJneUluZHVjdGl2ZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTE6IHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTEgPyByZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUxIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMjogcmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMiA/IHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUzOiByZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUzID8gcmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMyA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZTogcmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlID8gcmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlUmF0ZTE6IHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUxID8gcmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlUmF0ZTEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMjogcmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlUmF0ZTIgPyByZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMiA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUzOiByZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMyA/IHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUzIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQTogY3VycmVudFBoYXNlQSA/IGN1cnJlbnRQaGFzZUEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VCOiBjdXJyZW50UGhhc2VCID8gY3VycmVudFBoYXNlQiA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUM6IGN1cnJlbnRQaGFzZUMgPyBjdXJyZW50UGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQTogdm9sdGFnZVBoYXNlQSA/IHZvbHRhZ2VQaGFzZUEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VCOiB2b2x0YWdlUGhhc2VCID8gdm9sdGFnZVBoYXNlQiA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUM6IHZvbHRhZ2VQaGFzZUMgPyB2b2x0YWdlUGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGcmVxdWVuY3k6IHBvd2VyRnJlcXVlbmN5ID8gcG93ZXJGcmVxdWVuY3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogYWN0aXZlUG93ZXIgPyBhY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlUG93ZXI6IHJlYWN0aXZlUG93ZXIgPyByZWFjdGl2ZVBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3I6IHBvd2VyRmFjdG9yID8gcG93ZXJGYWN0b3IgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlclBoYXNlQTogYWN0aXZlUG93ZXJQaGFzZUEgPyBhY3RpdmVQb3dlclBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyUGhhc2VCOiBhY3RpdmVQb3dlclBoYXNlQiA/IGFjdGl2ZVBvd2VyUGhhc2VCIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXJQaGFzZUM6IGFjdGl2ZVBvd2VyUGhhc2VDID8gYWN0aXZlUG93ZXJQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZVBvd2VyUGhhc2VBOiByZWFjdGl2ZVBvd2VyUGhhc2VBID8gcmVhY3RpdmVQb3dlclBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlUG93ZXJQaGFzZUI6IHJlYWN0aXZlUG93ZXJQaGFzZUIgPyByZWFjdGl2ZVBvd2VyUGhhc2VCIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVQb3dlclBoYXNlQzogcmVhY3RpdmVQb3dlclBoYXNlQyA/IHJlYWN0aXZlUG93ZXJQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlck1heERlbWFuZDogYWN0aXZlUG93ZXJNYXhEZW1hbmQgPyBhY3RpdmVQb3dlck1heERlbWFuZCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyTWF4RGVtYW5kUmF0ZTE6IGFjdGl2ZVBvd2VyTWF4RGVtYW5kUmF0ZTEgPyBhY3RpdmVQb3dlck1heERlbWFuZFJhdGUxIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXJNYXhEZW1hbmRSYXRlMjogYWN0aXZlUG93ZXJNYXhEZW1hbmRSYXRlMiA/IGFjdGl2ZVBvd2VyTWF4RGVtYW5kUmF0ZTIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlck1heERlbWFuZFJhdGUzOiBhY3RpdmVQb3dlck1heERlbWFuZFJhdGUzID8gYWN0aXZlUG93ZXJNYXhEZW1hbmRSYXRlMyA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yUGhhc2VBOiBwb3dlckZhY3RvclBoYXNlQSA/IHBvd2VyRmFjdG9yUGhhc2VBIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3JQaGFzZUI6IHBvd2VyRmFjdG9yUGhhc2VCID8gcG93ZXJGYWN0b3JQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZhY3RvclBoYXNlQzogcG93ZXJGYWN0b3JQaGFzZUMgPyBwb3dlckZhY3RvclBoYXNlQyA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdENUcmF0aW9QcmltYXJ5OiBDVHJhdGlvUHJpbWFyeSA/IENUcmF0aW9QcmltYXJ5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Q1RyYXRpb1NlY29uZGFyeTogQ1RyYXRpb1NlY29uZGFyeSA/IENUcmF0aW9TZWNvbmRhcnkgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRQVHJhdGlvUHJpbWFyeTogUFRyYXRpb1ByaW1hcnkgPyBQVHJhdGlvUHJpbWFyeSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFBUcmF0aW9TZWNvbmRhcnk6IFBUcmF0aW9TZWNvbmRhcnkgPyBQVHJhdGlvU2Vjb25kYXJ5IDogbnVsbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5kYXRhID0gZGF0YUVuZXJneTU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9lbWV0ZXJfR2VsZXhFbWljX01FNDEnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3k1ID0gT2JqZWN0LnZhbHVlcyhbLi4uYXJyVGltZTUsIC4uLmRhdGFFbmVyZ3ldLnJlZHVjZSgoYWNjLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBjYXRlZ29yaWVzX3RpbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lFeHBvcnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lFeHBvcnRSYXRlMSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneUV4cG9ydFJhdGUyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5RXhwb3J0UmF0ZTMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lJbXBvcnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lJbXBvcnRSYXRlMSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneUltcG9ydFJhdGUyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5SW1wb3J0UmF0ZTMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUV4cG9ydCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5SW1wb3J0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3IsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlclxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjY1t0aW1lX2Z1bGxdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdDogdGltZV9mb3JtYXQgPyB0aW1lX2Zvcm1hdCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IHRpbWVfZnVsbCA/IHRpbWVfZnVsbCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllc190aW1lOiBjYXRlZ29yaWVzX3RpbWUgPyBjYXRlZ29yaWVzX3RpbWUgOiBhY2NbdGltZV9mdWxsXS5jYXRlZ29yaWVzX3RpbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogYWN0aXZlRW5lcmd5ID8gYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5RXhwb3J0OiBhY3RpdmVFbmVyZ3lFeHBvcnQgPyBhY3RpdmVFbmVyZ3lFeHBvcnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lFeHBvcnRSYXRlMTogYWN0aXZlRW5lcmd5RXhwb3J0UmF0ZTEgPyBhY3RpdmVFbmVyZ3lFeHBvcnRSYXRlMSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneUV4cG9ydFJhdGUyOiBhY3RpdmVFbmVyZ3lFeHBvcnRSYXRlMiA/IGFjdGl2ZUVuZXJneUV4cG9ydFJhdGUyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5RXhwb3J0UmF0ZTM6IGFjdGl2ZUVuZXJneUV4cG9ydFJhdGUzID8gYWN0aXZlRW5lcmd5RXhwb3J0UmF0ZTMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lJbXBvcnQ6IGFjdGl2ZUVuZXJneUltcG9ydCA/IGFjdGl2ZUVuZXJneUltcG9ydCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneUltcG9ydFJhdGUxOiBhY3RpdmVFbmVyZ3lJbXBvcnRSYXRlMSA/IGFjdGl2ZUVuZXJneUltcG9ydFJhdGUxIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5SW1wb3J0UmF0ZTI6IGFjdGl2ZUVuZXJneUltcG9ydFJhdGUyID8gYWN0aXZlRW5lcmd5SW1wb3J0UmF0ZTIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lJbXBvcnRSYXRlMzogYWN0aXZlRW5lcmd5SW1wb3J0UmF0ZTMgPyBhY3RpdmVFbmVyZ3lJbXBvcnRSYXRlMyA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5RXhwb3J0OiByZWFjdGl2ZUVuZXJneUV4cG9ydCA/IHJlYWN0aXZlRW5lcmd5RXhwb3J0IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lJbXBvcnQ6IHJlYWN0aXZlRW5lcmd5SW1wb3J0ID8gcmVhY3RpdmVFbmVyZ3lJbXBvcnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VBOiB2b2x0YWdlUGhhc2VBID8gdm9sdGFnZVBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUI6IHZvbHRhZ2VQaGFzZUIgPyB2b2x0YWdlUGhhc2VCIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQzogdm9sdGFnZVBoYXNlQyA/IHZvbHRhZ2VQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VBOiBjdXJyZW50UGhhc2VBID8gY3VycmVudFBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUI6IGN1cnJlbnRQaGFzZUIgPyBjdXJyZW50UGhhc2VCIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQzogY3VycmVudFBoYXNlQyA/IGN1cnJlbnRQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZhY3RvcjogcG93ZXJGYWN0b3IgPyBwb3dlckZhY3RvciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiBhY3RpdmVQb3dlciA/IGFjdGl2ZVBvd2VyIDogbnVsbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5kYXRhID0gZGF0YUVuZXJneTU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2VtZXRlcl9WaW5hc2lub19WU0UzVDUyMDIzJzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3k1ID0gT2JqZWN0LnZhbHVlcyhbLi4uYXJyVGltZTUsIC4uLmRhdGFFbmVyZ3ldLnJlZHVjZSgoYWNjLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0LCB0aW1lX2Z1bGwsIGNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lSYXRlMSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5UmF0ZTIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneVJhdGUzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXZlcnNlQWN0aXZlRW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXZlcnNlQWN0aXZlRW5lcmd5UmF0ZTEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VBY3RpdmVFbmVyZ3lSYXRlMixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZUFjdGl2ZUVuZXJneVJhdGUzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUluZHVjdGl2ZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlUmF0ZTIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VBLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VCLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VBLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VCLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZyZXF1ZW5jeSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VBY3RpdmVQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZVJlYWN0aXZlUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlclBoYXNlQSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXJQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXZlcnNlQWN0aXZlUG93ZXJQaGFzZUEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VBY3RpdmVQb3dlclBoYXNlQixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZUFjdGl2ZVBvd2VyUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZVBvd2VyUGhhc2VBLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZVBvd2VyUGhhc2VCLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZVBvd2VyUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXZlcnNlUmVhY3RpdmVQb3dlclBoYXNlQSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZVJlYWN0aXZlUG93ZXJQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VSZWFjdGl2ZVBvd2VyUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZhY3RvclBoYXNlQSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3JQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRDVHJhdGlvUHJpbWFyeSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Q1RyYXRpb1NlY29uZGFyeSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0UFRyYXRpb1ByaW1hcnksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFBUcmF0aW9TZWNvbmRhcnlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IHRpbWVfZm9ybWF0ID8gdGltZV9mb3JtYXQgOiBhY2NbdGltZV9mdWxsXS50aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IHRpbWVfZnVsbCA/IHRpbWVfZnVsbCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzX3RpbWU6IGNhdGVnb3JpZXNfdGltZSA/IGNhdGVnb3JpZXNfdGltZSA6IGFjY1t0aW1lX2Z1bGxdLmNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IGFjdGl2ZUVuZXJneSA/IGFjdGl2ZUVuZXJneSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5UmF0ZTE6IGFjdGl2ZUVuZXJneVJhdGUxID8gYWN0aXZlRW5lcmd5UmF0ZTEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneVJhdGUyOiBhY3RpdmVFbmVyZ3lSYXRlMiA/IGFjdGl2ZUVuZXJneVJhdGUyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lSYXRlMzogYWN0aXZlRW5lcmd5UmF0ZTMgPyBhY3RpdmVFbmVyZ3lSYXRlMyA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZUFjdGl2ZUVuZXJneTogcmV2ZXJzZUFjdGl2ZUVuZXJneSA/IHJldmVyc2VBY3RpdmVFbmVyZ3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VBY3RpdmVFbmVyZ3lSYXRlMTogcmV2ZXJzZUFjdGl2ZUVuZXJneVJhdGUxID8gcmV2ZXJzZUFjdGl2ZUVuZXJneVJhdGUxIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXZlcnNlQWN0aXZlRW5lcmd5UmF0ZTI6IHJldmVyc2VBY3RpdmVFbmVyZ3lSYXRlMiA/IHJldmVyc2VBY3RpdmVFbmVyZ3lSYXRlMiA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZUFjdGl2ZUVuZXJneVJhdGUzOiByZXZlcnNlQWN0aXZlRW5lcmd5UmF0ZTMgPyByZXZlcnNlQWN0aXZlRW5lcmd5UmF0ZTMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlOiByZWFjdGl2ZUVuZXJneUluZHVjdGl2ZSA/IHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUxOiByZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUxID8gcmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMjogcmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMiA/IHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTM6IHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTMgPyByZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUzIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmU6IHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZSA/IHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlUmF0ZTE6IHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUxID8gcmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlUmF0ZTEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUyOiByZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMiA/IHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMzogcmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlUmF0ZTMgPyByZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMyA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQTogY3VycmVudFBoYXNlQSA/IGN1cnJlbnRQaGFzZUEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUI6IGN1cnJlbnRQaGFzZUI/IGN1cnJlbnRQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUM6IGN1cnJlbnRQaGFzZUMgPyBjdXJyZW50UGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VBOiB2b2x0YWdlUGhhc2VBID8gdm9sdGFnZVBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQjogdm9sdGFnZVBoYXNlQiA/IHZvbHRhZ2VQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUM6IHZvbHRhZ2VQaGFzZUMgPyB2b2x0YWdlUGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZyZXF1ZW5jeTogcG93ZXJGcmVxdWVuY3kgPyBwb3dlckZyZXF1ZW5jeSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXI6IGFjdGl2ZVBvd2VyID8gYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VBY3RpdmVQb3dlcjogcmV2ZXJzZUFjdGl2ZVBvd2VyID8gcmV2ZXJzZUFjdGl2ZVBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZVBvd2VyOiByZWFjdGl2ZVBvd2VyID8gcmVhY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZVJlYWN0aXZlUG93ZXI6IHJldmVyc2VSZWFjdGl2ZVBvd2VyID8gcmV2ZXJzZVJlYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yOiBwb3dlckZhY3RvciA/IHBvd2VyRmFjdG9yIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlclBoYXNlQTogYWN0aXZlUG93ZXJQaGFzZUEgPyBhY3RpdmVQb3dlclBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXJQaGFzZUI6IGFjdGl2ZVBvd2VyUGhhc2VCID8gYWN0aXZlUG93ZXJQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyUGhhc2VDOiBhY3RpdmVQb3dlclBoYXNlQyA/IGFjdGl2ZVBvd2VyUGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXZlcnNlQWN0aXZlUG93ZXJQaGFzZUE6IHJldmVyc2VBY3RpdmVQb3dlclBoYXNlQSA/IHJldmVyc2VBY3RpdmVQb3dlclBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZUFjdGl2ZVBvd2VyUGhhc2VCOiByZXZlcnNlQWN0aXZlUG93ZXJQaGFzZUIgPyByZXZlcnNlQWN0aXZlUG93ZXJQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VBY3RpdmVQb3dlclBoYXNlQzogcmV2ZXJzZUFjdGl2ZVBvd2VyUGhhc2VDID8gcmV2ZXJzZUFjdGl2ZVBvd2VyUGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZVBvd2VyUGhhc2VBOiByZWFjdGl2ZVBvd2VyUGhhc2VBID8gIHJlYWN0aXZlUG93ZXJQaGFzZUE6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVQb3dlclBoYXNlQjogcmVhY3RpdmVQb3dlclBoYXNlQiA/IHJlYWN0aXZlUG93ZXJQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlUG93ZXJQaGFzZUM6IHJlYWN0aXZlUG93ZXJQaGFzZUMgPyByZWFjdGl2ZVBvd2VyUGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXZlcnNlUmVhY3RpdmVQb3dlclBoYXNlQTogcmV2ZXJzZVJlYWN0aXZlUG93ZXJQaGFzZUEgPyByZXZlcnNlUmVhY3RpdmVQb3dlclBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZVJlYWN0aXZlUG93ZXJQaGFzZUI6IHJldmVyc2VSZWFjdGl2ZVBvd2VyUGhhc2VCID8gcmV2ZXJzZVJlYWN0aXZlUG93ZXJQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VSZWFjdGl2ZVBvd2VyUGhhc2VDOiByZXZlcnNlUmVhY3RpdmVQb3dlclBoYXNlQyA/IHJldmVyc2VSZWFjdGl2ZVBvd2VyUGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZhY3RvclBoYXNlQTogcG93ZXJGYWN0b3JQaGFzZUEgPyBwb3dlckZhY3RvclBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3JQaGFzZUI6IHBvd2VyRmFjdG9yUGhhc2VCID8gcG93ZXJGYWN0b3JQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yUGhhc2VDOiBwb3dlckZhY3RvclBoYXNlQyA/IHBvd2VyRmFjdG9yUGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRDVHJhdGlvUHJpbWFyeTogQ1RyYXRpb1ByaW1hcnkgPyBDVHJhdGlvUHJpbWFyeSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Q1RyYXRpb1NlY29uZGFyeTogQ1RyYXRpb1NlY29uZGFyeSA/IENUcmF0aW9TZWNvbmRhcnkgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFBUcmF0aW9QcmltYXJ5OiBQVHJhdGlvUHJpbWFyeSA/IFBUcmF0aW9QcmltYXJ5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRQVHJhdGlvU2Vjb25kYXJ5OiBQVHJhdGlvU2Vjb25kYXJ5ID8gUFRyYXRpb1NlY29uZGFyeTogbnVsbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0uZGF0YSA9IGRhdGFFbmVyZ3k1O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAndGhpc19tb250aCc6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbGFzdF9tb250aCc6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnMTJfbW9udGgnOlxyXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2xpZmV0aW1lJzpcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0uZGF0YSA9IGRhdGFFbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRkYXRhLnB1c2goZGF0YURldmljZVtpXSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHQvKipcclxuXHQqIGdldCBkZXRhaWwgcHJvamVjdCBwYWdlIENsaWVudCBBbmFseXRpY3NcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHJcblx0Z2V0Q2hhcnRBbGFybShwYXJhbSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNYWluQW5hbHl0aWNzLmdldERldGFpbFwiLCBwYXJhbSk7XHJcblx0XHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gVG90YWwgRmxlZXQgQWxlcnRzXHJcblx0XHRcdFx0XHRwYXJhbS5pZF9wcm9qZWN0ID0gcnMuaWQ7XHJcblx0XHRcdFx0XHRycy50b3RhbEZsZWV0QWxhcm0gPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluQW5hbHl0aWNzLnRvdGFsRmxlZXRBbGFybVwiLCBwYXJhbSk7XHJcblxyXG5cdFx0XHRcdFx0cnMuYWxhcm1PUGVuZWQgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluQW5hbHl0aWNzLmFsYXJtT1BlbmVkXCIsIHBhcmFtKTtcclxuXHRcdFx0XHRcdHZhciBhbGFybUxhc3QxMk1vbnRoID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpbkFuYWx5dGljcy5hbGFybUxhc3QxMk1vbnRoXCIsIHBhcmFtKTtcclxuXHJcblx0XHRcdFx0XHR2YXIgZGF0YUFsYXJtTW9udGggPSBbXTtcclxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAxMTsgaSA+PSAwOyBpLS0pIHtcclxuXHRcdFx0XHRcdFx0ZGF0YUFsYXJtTW9udGgucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiBtb21lbnQoKS5hZGQoLWksICdNJykuZm9ybWF0KCdNTS9ZWVlZJyksXHJcblx0XHRcdFx0XHRcdFx0dG90YWxfYWxhcm06IDBcclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGRhdGFBbGFybU1vbnRoID0gT2JqZWN0LnZhbHVlcyhbLi4uZGF0YUFsYXJtTW9udGgsIC4uLmFsYXJtTGFzdDEyTW9udGhdLnJlZHVjZSgoYWNjLCB7IHRpbWVfZnVsbCwgdG90YWxfYWxhcm0gfSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRhY2NbdGltZV9mdWxsXSA9IHtcclxuXHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGwsXHJcblx0XHRcdFx0XHRcdFx0dG90YWxfYWxhcm06IChhY2NbdGltZV9mdWxsXSA/IGFjY1t0aW1lX2Z1bGxdLnRvdGFsX2FsYXJtIDogMCkgKyB0b3RhbF9hbGFybSxcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdH0sIHt9KSk7XHJcblxyXG5cdFx0XHRcdFx0cnMuYWxhcm1MYXN0MTJNb250aCA9IGRhdGFBbGFybU1vbnRoO1xyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBycyk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRpZiAoY29ubikge1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBNYWluQW5hbHl0aWNzU2VydmljZTtcclxuIl19