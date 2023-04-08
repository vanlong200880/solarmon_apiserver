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

var ClientAnalyticsService = function (_BaseService) {
	_inherits(ClientAnalyticsService, _BaseService);

	function ClientAnalyticsService() {
		_classCallCheck(this, ClientAnalyticsService);

		return _possibleConstructorReturn(this, (ClientAnalyticsService.__proto__ || Object.getPrototypeOf(ClientAnalyticsService)).call(this));
	}

	/**
 * get detail project page Client Analytics
 * @param {*} data 
 * @param {*} callBack 
 */

	_createClass(ClientAnalyticsService, [{
		key: 'getDataChartProfile',
		value: function getDataChartProfile(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var rs = await db.queryForObject("ClientAnalytics.getDetail", param);
						if (!rs) {
							conn.rollback();
							callBack(true, {});
							return;
						}

						var getListDeviceInverter = await db.queryForList("ClientAnalytics.getListDeviceInverter", param);
						var dataEnergyMerge = [];
						if (Libs.isArrayData(getListDeviceInverter)) {
							for (var v = 0, len = getListDeviceInverter.length; v < len; v++) {
								getListDeviceInverter[v].start_date = Libs.convertAllFormatDate(param.start_date);
								getListDeviceInverter[v].end_date = Libs.convertAllFormatDate(param.end_date);
								var dataEnergyByDevice = await db.queryForList("ClientAnalytics.dataEnergyByDevice", getListDeviceInverter[v]);

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
						var getGroupInverter = await db.queryForList("ClientAnalytics.getGroupDeviceInverter", param);
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

						rs.performanceLast12Months = await db.queryForList("ClientAnalytics.getDataEnergy12Month", { groupInverter: groupInverter });

						// Performance - Last 31 days
						rs.performanceLast30Days = await db.queryForList("ClientAnalytics.getDataEnergy30Days", { groupInverter: groupInverter });

						// Daily Max Power - Last 12 Months
						rs.maxPower12Months = await db.queryForList("ClientAnalytics.getDataMaxPower12Months", { groupInverter: groupInverter });
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
						var getListDevice = await db.queryForList("ClientAnalytics.getListDeviceByProject", param);
						if (!getListDevice) {
							conn.rollback();
							callBack(false, {});
							return;
						}

						if (getListDevice.length > 0) {
							for (var i = 0, len = getListDevice.length; i < len; i++) {
								getListDevice[i].dataParameter = await db.queryForList("ClientAnalytics.getParameterByDevice", getListDevice[i]);
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
							var dataEnergy = await db.queryForList("ClientAnalytics.getDataChartParameter", params);

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
						var rs = await db.queryForObject("ClientAnalytics.getDetail", param);
						if (!rs) {
							conn.rollback();
							callBack(true, {});
							return;
						}

						// Total Fleet Alerts
						param.id_project = rs.id;
						rs.totalFleetAlarm = await db.queryForList("ClientAnalytics.totalFleetAlarm", param);

						rs.alarmOPened = await db.queryForList("ClientAnalytics.alarmOPened", param);
						var alarmLast12Month = await db.queryForList("ClientAnalytics.alarmLast12Month", param);

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

	return ClientAnalyticsService;
}(_BaseService3.default);

exports.default = ClientAnalyticsService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9DbGllbnRBbmFseXRpY3NTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkNsaWVudEFuYWx5dGljc1NlcnZpY2UiLCJwYXJhbSIsImNhbGxCYWNrIiwiZGIiLCJteVNxTERCIiwiYmVnaW5UcmFuc2FjdGlvbiIsImNvbm4iLCJycyIsInF1ZXJ5Rm9yT2JqZWN0Iiwicm9sbGJhY2siLCJnZXRMaXN0RGV2aWNlSW52ZXJ0ZXIiLCJxdWVyeUZvckxpc3QiLCJkYXRhRW5lcmd5TWVyZ2UiLCJMaWJzIiwiaXNBcnJheURhdGEiLCJ2IiwibGVuIiwibGVuZ3RoIiwic3RhcnRfZGF0ZSIsImNvbnZlcnRBbGxGb3JtYXREYXRlIiwiZW5kX2RhdGUiLCJkYXRhRW5lcmd5QnlEZXZpY2UiLCJrIiwibCIsImFjdGl2ZUVuZXJneSIsInN1YkVuZXJneSIsInRvZGF5X2FjdGl2ZUVuZXJneSIsInJvdW5kTnVtYmVyIiwiT2JqZWN0IiwidmFsdWVzIiwicmVkdWNlIiwiYWNjIiwidGltZV9mb3JtYXQiLCJ0aW1lX2Z1bGwiLCJhY3RpdmVQb3dlciIsImdyb3VwX2RheSIsImRhdGFDaGFydFByb2ZpbGUiLCJnZXRHcm91cEludmVydGVyIiwiZ3JvdXBJbnZlcnRlciIsImkiLCJwdXNoIiwiaGFzaF9pZCIsImlkX2RldmljZV9ncm91cCIsInRhYmxlX25hbWUiLCJwZXJmb3JtYW5jZUxhc3QxMk1vbnRocyIsInBlcmZvcm1hbmNlTGFzdDMwRGF5cyIsIm1heFBvd2VyMTJNb250aHMiLCJjb21taXQiLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiZ2V0TGlzdERldmljZSIsImRhdGFQYXJhbWV0ZXIiLCJkYXRhIiwiZGF0YURldmljZSIsInBhcmFtcyIsImZpbHRlckJ5IiwiZGF0YV9zZW5kX3RpbWUiLCJpZCIsImRhdGFFbmVyZ3kiLCJhcnJUaW1lNSIsImN1ckRhdGU1IiwiY3VyRGF0ZUZvcm1hdDUiLCJmb3JtYXQiLCJ0IiwiYWRkIiwiY2F0ZWdvcmllc190aW1lIiwiY3VyRGF0ZTE1IiwiY3VyRGF0ZUZvcm1hdDE1IiwibiIsImN1ckRhdGUxaCIsImN1ckRhdGVGb3JtYXQxaCIsInN0YXJ0RGF0ZSIsImVuZERhdGUiLCJhZGREYXlzIiwiY3VyRGF0ZUZvcm1hdCIsImgiLCJkYXRhRW5lcmd5NSIsImFjQ3VycmVudCIsImN1cnJlbnRQaGFzZUEiLCJjdXJyZW50UGhhc2VCIiwiY3VycmVudFBoYXNlQyIsInZvbHRhZ2VQaGFzZUEiLCJ2b2x0YWdlUGhhc2VCIiwidm9sdGFnZVBoYXNlQyIsInBvd2VyRnJlcXVlbmN5IiwiYXBwYXJlbnRQb3dlciIsInJlYWN0aXZlUG93ZXIiLCJwb3dlckZhY3RvciIsImRjQ3VycmVudCIsImRjVm9sdGFnZSIsImRjUG93ZXIiLCJpbnRlcm5hbFRlbXBlcmF0dXJlIiwiaGVhdFNpbmtUZW1wZXJhdHVyZSIsInRyYW5zZm9ybWVyVGVtcGVyYXR1cmUiLCJtcHB0MUN1cnJlbnQiLCJtcHB0MVZvbHRhZ2UiLCJtcHB0MVBvd2VyIiwibXBwdDJDdXJyZW50IiwibXBwdDJWb2x0YWdlIiwibXBwdDJQb3dlciIsIm1wcHQzQ3VycmVudCIsIm1wcHQzVm9sdGFnZSIsIm1wcHQzUG93ZXIiLCJtcHB0NEN1cnJlbnQiLCJtcHB0NFZvbHRhZ2UiLCJtcHB0NFBvd2VyIiwibXBwdDVDdXJyZW50IiwibXBwdDVWb2x0YWdlIiwibXBwdDVQb3dlciIsIm1wcHQ2Q3VycmVudCIsIm1wcHQ2Vm9sdGFnZSIsIm1wcHQ2UG93ZXIiLCJkYWlseUVuZXJneSIsIm1hbnVmYWN0dXJlciIsIm1vZGVsIiwic2VyaWFsTnVtYmVyIiwibW9kYnVzVW5pdElkIiwiaXJyYWRpYW5jZVBvQSIsImNlbGxUZW1wIiwicGFuZWxUZW1wIiwiYW1iaWVudFRlbXAiLCJtZW1QZXJjZW50IiwibWVtVG90YWwiLCJtZW1Vc2VkIiwibWVtQXZhaWwiLCJtZW1GcmVlIiwiZGlza1BlcmNlbnQiLCJkaXNrVG90YWwiLCJkaXNrVXNlZCIsImRpc2tGcmVlIiwiY3B1VGVtcCIsInVwVGltZSIsImNhYmluZXRUZW1wZXJhdHVyZSIsIm1wcHQ3Q3VycmVudCIsIm1wcHQ3Vm9sdGFnZSIsIm1wcHQ3UG93ZXIiLCJtcHB0OEN1cnJlbnQiLCJtcHB0OFZvbHRhZ2UiLCJtcHB0OFBvd2VyIiwibXBwdDlDdXJyZW50IiwibXBwdDlWb2x0YWdlIiwibXBwdDlQb3dlciIsIm1wcHQxMEN1cnJlbnQiLCJtcHB0MTBWb2x0YWdlIiwibXBwdDEwUG93ZXIiLCJtcHB0MTFDdXJyZW50IiwibXBwdDExVm9sdGFnZSIsIm1wcHQxMVBvd2VyIiwibXBwdDEyQ3VycmVudCIsIm1wcHQxMlZvbHRhZ2UiLCJtcHB0MTJQb3dlciIsImFjdGl2ZUVuZXJneVJhdGUxIiwiYWN0aXZlRW5lcmd5UmF0ZTIiLCJhY3RpdmVFbmVyZ3lSYXRlMyIsInJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlIiwicmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMSIsInJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTIiLCJyZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUzIiwicmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlIiwicmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlUmF0ZTEiLCJyZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMiIsInJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUzIiwiYWN0aXZlUG93ZXJQaGFzZUEiLCJhY3RpdmVQb3dlclBoYXNlQiIsImFjdGl2ZVBvd2VyUGhhc2VDIiwicmVhY3RpdmVQb3dlclBoYXNlQSIsInJlYWN0aXZlUG93ZXJQaGFzZUIiLCJyZWFjdGl2ZVBvd2VyUGhhc2VDIiwiYWN0aXZlUG93ZXJNYXhEZW1hbmQiLCJhY3RpdmVQb3dlck1heERlbWFuZFJhdGUxIiwiYWN0aXZlUG93ZXJNYXhEZW1hbmRSYXRlMiIsImFjdGl2ZVBvd2VyTWF4RGVtYW5kUmF0ZTMiLCJwb3dlckZhY3RvclBoYXNlQSIsInBvd2VyRmFjdG9yUGhhc2VCIiwicG93ZXJGYWN0b3JQaGFzZUMiLCJDVHJhdGlvUHJpbWFyeSIsIkNUcmF0aW9TZWNvbmRhcnkiLCJQVHJhdGlvUHJpbWFyeSIsIlBUcmF0aW9TZWNvbmRhcnkiLCJhY3RpdmVFbmVyZ3lFeHBvcnQiLCJhY3RpdmVFbmVyZ3lFeHBvcnRSYXRlMSIsImFjdGl2ZUVuZXJneUV4cG9ydFJhdGUyIiwiYWN0aXZlRW5lcmd5RXhwb3J0UmF0ZTMiLCJhY3RpdmVFbmVyZ3lJbXBvcnQiLCJhY3RpdmVFbmVyZ3lJbXBvcnRSYXRlMSIsImFjdGl2ZUVuZXJneUltcG9ydFJhdGUyIiwiYWN0aXZlRW5lcmd5SW1wb3J0UmF0ZTMiLCJyZWFjdGl2ZUVuZXJneUV4cG9ydCIsInJlYWN0aXZlRW5lcmd5SW1wb3J0IiwicmV2ZXJzZUFjdGl2ZUVuZXJneSIsInJldmVyc2VBY3RpdmVFbmVyZ3lSYXRlMSIsInJldmVyc2VBY3RpdmVFbmVyZ3lSYXRlMiIsInJldmVyc2VBY3RpdmVFbmVyZ3lSYXRlMyIsInJldmVyc2VBY3RpdmVQb3dlciIsInJldmVyc2VSZWFjdGl2ZVBvd2VyIiwicmV2ZXJzZUFjdGl2ZVBvd2VyUGhhc2VBIiwicmV2ZXJzZUFjdGl2ZVBvd2VyUGhhc2VCIiwicmV2ZXJzZUFjdGl2ZVBvd2VyUGhhc2VDIiwicmV2ZXJzZVJlYWN0aXZlUG93ZXJQaGFzZUEiLCJyZXZlcnNlUmVhY3RpdmVQb3dlclBoYXNlQiIsInJldmVyc2VSZWFjdGl2ZVBvd2VyUGhhc2VDIiwiaWRfcHJvamVjdCIsInRvdGFsRmxlZXRBbGFybSIsImFsYXJtT1BlbmVkIiwiYWxhcm1MYXN0MTJNb250aCIsImRhdGFBbGFybU1vbnRoIiwidG90YWxfYWxhcm0iLCJCYXNlU2VydmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7OztJQUNNQSxzQjs7O0FBQ0wsbUNBQWM7QUFBQTs7QUFBQTtBQUdiOztBQUVEOzs7Ozs7OztzQ0FNb0JDLEssRUFBT0MsUSxFQUFVO0FBQ3BDLE9BQUk7QUFDSCxRQUFJQyxLQUFLLElBQUlDLE9BQUosRUFBVDtB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RUFBc0J3QixNQUF0QixDQUE2QixTQUE3QixDQURRO0FBRW5CZ0oscUJBQWE7QUFGTSxRQUFwQjtBQUlBO0FBQ0RELHVCQUFpQmxMLE9BQU9DLE1BQVAsQ0FBYyw2QkFBSWlMLGNBQUosc0JBQXVCRCxnQkFBdkIsR0FBeUMvSyxNQUF6QyxDQUFnRCxVQUFDQyxHQUFELFVBQXFDO0FBQUEsV0FBN0JFLFNBQTZCLFVBQTdCQSxTQUE2QjtBQUFBLFdBQWxCOEssV0FBa0IsVUFBbEJBLFdBQWtCOztBQUNuSGhMLFdBQUlFLFNBQUosSUFBaUI7QUFDaEJBLDRCQURnQjtBQUVoQjhLLHFCQUFhLENBQUNoTCxJQUFJRSxTQUFKLElBQWlCRixJQUFJRSxTQUFKLEVBQWU4SyxXQUFoQyxHQUE4QyxDQUEvQyxJQUFvREE7QUFGakQsUUFBakI7QUFJQSxjQUFPaEwsR0FBUDtBQUNBLE9BTjhCLEVBTTVCLEVBTjRCLENBQWQsQ0FBakI7O0FBUUF4QixTQUFHc00sZ0JBQUgsR0FBc0JDLGNBQXRCO0FBQ0F4TSxXQUFLeUMsTUFBTDtBQUNBN0MsZUFBUyxLQUFULEVBQWdCSyxFQUFoQjtBQUNBLE1BakNELENBaUNFLE9BQU95QyxHQUFQLEVBQVk7QUFDYkMsY0FBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJGLEdBQTNCO0FBQ0ExQyxXQUFLRyxRQUFMO0FBQ0FQLGVBQVMsSUFBVCxFQUFlOEMsR0FBZjtBQUNBO0FBQ0QsS0F2Q0Q7QUF3Q0EsSUExQ0QsQ0EwQ0UsT0FBT0EsR0FBUCxFQUFZO0FBQ2IsUUFBSTFDLElBQUosRUFBVTtBQUNUQSxVQUFLRyxRQUFMO0FBQ0E7QUFDRFAsYUFBUyxJQUFULEVBQWU4QyxHQUFmO0FBQ0E7QUFDRDs7OztFQWppQ21DZ0sscUI7O2tCQW1pQ3RCaE4sc0IiLCJmaWxlIjoiQ2xpZW50QW5hbHl0aWNzU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2VydmljZSBmcm9tICcuL0Jhc2VTZXJ2aWNlJztcclxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5jbGFzcyBDbGllbnRBbmFseXRpY3NTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQqIGdldCBkZXRhaWwgcHJvamVjdCBwYWdlIENsaWVudCBBbmFseXRpY3NcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHJcblx0Z2V0RGF0YUNoYXJ0UHJvZmlsZShwYXJhbSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJDbGllbnRBbmFseXRpY3MuZ2V0RGV0YWlsXCIsIHBhcmFtKTtcclxuXHRcdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCB7fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR2YXIgZ2V0TGlzdERldmljZUludmVydGVyID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50QW5hbHl0aWNzLmdldExpc3REZXZpY2VJbnZlcnRlclwiLCBwYXJhbSk7XHJcblx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneU1lcmdlID0gW107XHJcblx0XHRcdFx0XHRpZiAoTGlicy5pc0FycmF5RGF0YShnZXRMaXN0RGV2aWNlSW52ZXJ0ZXIpKSB7XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIHYgPSAwLCBsZW4gPSBnZXRMaXN0RGV2aWNlSW52ZXJ0ZXIubGVuZ3RoOyB2IDwgbGVuOyB2KyspIHtcclxuXHRcdFx0XHRcdFx0XHRnZXRMaXN0RGV2aWNlSW52ZXJ0ZXJbdl0uc3RhcnRfZGF0ZSA9IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSk7XHJcblx0XHRcdFx0XHRcdFx0Z2V0TGlzdERldmljZUludmVydGVyW3ZdLmVuZF9kYXRlID0gTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSk7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGRhdGFFbmVyZ3lCeURldmljZSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudEFuYWx5dGljcy5kYXRhRW5lcmd5QnlEZXZpY2VcIiwgZ2V0TGlzdERldmljZUludmVydGVyW3ZdKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKGRhdGFFbmVyZ3lCeURldmljZS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBrID0gMCwgbCA9IGRhdGFFbmVyZ3lCeURldmljZS5sZW5ndGg7IGsgPCBsOyBrKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGsgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5QnlEZXZpY2Vba10uYWN0aXZlRW5lcmd5ID0gMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgc3ViRW5lcmd5ID0gKGRhdGFFbmVyZ3lCeURldmljZVtrXS50b2RheV9hY3RpdmVFbmVyZ3kgLSBkYXRhRW5lcmd5QnlEZXZpY2VbayAtIDFdLnRvZGF5X2FjdGl2ZUVuZXJneSkgLyAxMDAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lCeURldmljZVtrXS5hY3RpdmVFbmVyZ3kgPSBMaWJzLnJvdW5kTnVtYmVyKHN1YkVuZXJneSwgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNZXJnZSA9IE9iamVjdC52YWx1ZXMoWy4uLmRhdGFFbmVyZ3lNZXJnZSwgLi4uZGF0YUVuZXJneUJ5RGV2aWNlXS5yZWR1Y2UoKGFjYywgeyB0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBhY3RpdmVQb3dlciwgYWN0aXZlRW5lcmd5LCBncm91cF9kYXkgfSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhY2NbdGltZV9mb3JtYXRdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogTGlicy5yb3VuZE51bWJlcigoKGFjY1t0aW1lX2Zvcm1hdF0gPyBhY2NbdGltZV9mb3JtYXRdLmFjdGl2ZVBvd2VyIDogMCkgKyBhY3RpdmVQb3dlciksIDEpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogTGlicy5yb3VuZE51bWJlcigoKGFjY1t0aW1lX2Zvcm1hdF0gPyBhY2NbdGltZV9mb3JtYXRdLmFjdGl2ZUVuZXJneSA6IDApICsgYWN0aXZlRW5lcmd5KSwgMSksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBfZGF5XHJcblx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cnMuZGF0YUNoYXJ0UHJvZmlsZSA9IGRhdGFFbmVyZ3lNZXJnZTtcclxuXHJcblxyXG5cdFx0XHRcdFx0Ly8gbGFzdCAxMiBtb250aHNcclxuXHRcdFx0XHRcdHZhciBnZXRHcm91cEludmVydGVyID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50QW5hbHl0aWNzLmdldEdyb3VwRGV2aWNlSW52ZXJ0ZXJcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0aWYgKCFnZXRHcm91cEludmVydGVyKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dmFyIGdyb3VwSW52ZXJ0ZXIgPSBbXTtcclxuXHRcdFx0XHRcdGlmIChnZXRHcm91cEludmVydGVyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IGdldEdyb3VwSW52ZXJ0ZXIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRncm91cEludmVydGVyLnB1c2goXHJcblx0XHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGhhc2hfaWQ6IHBhcmFtLmhhc2hfaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0R3JvdXBJbnZlcnRlcltpXS5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksXHJcblx0XHRcdFx0XHRcdFx0XHRcdGVuZF9kYXRlOiBMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZ2V0R3JvdXBJbnZlcnRlcltpXS50YWJsZV9uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHJzLnBlcmZvcm1hbmNlTGFzdDEyTW9udGhzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50QW5hbHl0aWNzLmdldERhdGFFbmVyZ3kxMk1vbnRoXCIsIHsgZ3JvdXBJbnZlcnRlciB9KTtcclxuXHJcblx0XHRcdFx0XHQvLyBQZXJmb3JtYW5jZSAtIExhc3QgMzEgZGF5c1xyXG5cdFx0XHRcdFx0cnMucGVyZm9ybWFuY2VMYXN0MzBEYXlzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50QW5hbHl0aWNzLmdldERhdGFFbmVyZ3kzMERheXNcIiwgeyBncm91cEludmVydGVyIH0pO1xyXG5cclxuXHRcdFx0XHRcdC8vIERhaWx5IE1heCBQb3dlciAtIExhc3QgMTIgTW9udGhzXHJcblx0XHRcdFx0XHRycy5tYXhQb3dlcjEyTW9udGhzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50QW5hbHl0aWNzLmdldERhdGFNYXhQb3dlcjEyTW9udGhzXCIsIHsgZ3JvdXBJbnZlcnRlciB9KTtcclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgcnMpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0aWYgKGNvbm4pIHtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHRnZXRMaXN0RGV2aWNlQnlQcm9qZWN0KHBhcmFtLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgZ2V0TGlzdERldmljZSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIkNsaWVudEFuYWx5dGljcy5nZXRMaXN0RGV2aWNlQnlQcm9qZWN0XCIsIHBhcmFtKTtcclxuXHRcdFx0XHRcdGlmICghZ2V0TGlzdERldmljZSkge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoZ2V0TGlzdERldmljZS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW4gPSBnZXRMaXN0RGV2aWNlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0Z2V0TGlzdERldmljZVtpXS5kYXRhUGFyYW1ldGVyID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50QW5hbHl0aWNzLmdldFBhcmFtZXRlckJ5RGV2aWNlXCIsIGdldExpc3REZXZpY2VbaV0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBnZXRMaXN0RGV2aWNlKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGdldENoYXJ0UGFyYW1ldGVyRGV2aWNlKHBhcmFtLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgZGF0YSA9IFtdO1xyXG5cdFx0XHRcdFx0dmFyIGRhdGFEZXZpY2UgPSBwYXJhbS5kYXRhRGV2aWNlO1xyXG5cdFx0XHRcdFx0aWYgKCFMaWJzLmlzQXJyYXlEYXRhKGRhdGFEZXZpY2UpKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW4gPSBkYXRhRGV2aWNlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdHZhciBwYXJhbXMgPSB7XHJcblx0XHRcdFx0XHRcdFx0ZmlsdGVyQnk6IHBhcmFtLmZpbHRlckJ5LFxyXG5cdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksXHJcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGU6IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpLFxyXG5cdFx0XHRcdFx0XHRcdGRhdGFfc2VuZF90aW1lOiBwYXJhbS5kYXRhX3NlbmRfdGltZSxcclxuXHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBkYXRhRGV2aWNlW2ldLnRhYmxlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0aWQ6IGRhdGFEZXZpY2VbaV0uaWRcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0dmFyIGRhdGFFbmVyZ3kgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnRBbmFseXRpY3MuZ2V0RGF0YUNoYXJ0UGFyYW1ldGVyXCIsIHBhcmFtcyk7XHJcblxyXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHBhcmFtLmZpbHRlckJ5KSB7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnM19kYXknOlxyXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3RvZGF5JzpcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBhcnJUaW1lNSA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHBhcmFtcy5maWx0ZXJCeSA9PSAndG9kYXknKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGdlbmFyZXRlIGRhdGEgNSBtdW5pdGVzXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChwYXJhbS5kYXRhX3NlbmRfdGltZSA9PSAxKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGN1ckRhdGU1ID0gTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGN1ckRhdGVGb3JtYXQ1ID0gbW9tZW50KGN1ckRhdGU1KS5mb3JtYXQoJ1lZWVktTU0tREQgMDU6MDAnKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciB0ID0gMDsgdCA8IDE2ODsgdCsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJUaW1lNS5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IG1vbWVudChjdXJEYXRlRm9ybWF0NSkuYWRkKDUgKiB0LCAnbWludXRlcycpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IG1vbWVudChjdXJEYXRlRm9ybWF0NSkuYWRkKDUgKiB0LCAnbWludXRlcycpLmZvcm1hdCgnREQvTU0vWVlZWSBISDptbScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzX3RpbWU6IG1vbWVudChjdXJEYXRlRm9ybWF0NSkuYWRkKDUgKiB0LCAnbWludXRlcycpLmZvcm1hdCgnSEg6bW0nKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gZ2VuYXJldGUgZGF0YSAxNSBtdW5pdGVzXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChwYXJhbS5kYXRhX3NlbmRfdGltZSA9PSAyKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGN1ckRhdGUxNSA9IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBjdXJEYXRlRm9ybWF0MTUgPSBtb21lbnQoY3VyRGF0ZTE1KS5mb3JtYXQoJ1lZWVktTU0tREQgMDU6MDAnKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBuID0gMDsgbiA8IDU2OyBuKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyclRpbWU1LnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdDogbW9tZW50KGN1ckRhdGVGb3JtYXQxNSkuYWRkKDE1ICogbiwgJ21pbnV0ZXMnKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiBtb21lbnQoY3VyRGF0ZUZvcm1hdDE1KS5hZGQoMTUgKiBuLCAnbWludXRlcycpLmZvcm1hdCgnREQvTU0vWVlZWSBISDptbScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzX3RpbWU6IG1vbWVudChjdXJEYXRlRm9ybWF0MTUpLmFkZCgxNSAqIG4sICdtaW51dGVzJykuZm9ybWF0KCdISDptbScpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBnZW5hcmV0ZSBkYXRhIDEgaG91clxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAocGFyYW0uZGF0YV9zZW5kX3RpbWUgPT0gMykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBjdXJEYXRlMWggPSBMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgY3VyRGF0ZUZvcm1hdDFoID0gbW9tZW50KGN1ckRhdGUxaCkuZm9ybWF0KCdZWVlZLU1NLUREIDA1OjAwJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgbiA9IDA7IG4gPCAxNDsgbisrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJUaW1lNS5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IG1vbWVudChjdXJEYXRlRm9ybWF0MWgpLmFkZCgxICogbiwgJ2hvdXJzJykuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogbW9tZW50KGN1ckRhdGVGb3JtYXQxaCkuYWRkKDEgKiBuLCAnaG91cnMnKS5mb3JtYXQoJ0REL01NL1lZWVkgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllc190aW1lOiBtb21lbnQoY3VyRGF0ZUZvcm1hdDFoKS5hZGQoMSAqIG4sICdob3VycycpLmZvcm1hdCgnSEg6bW0nKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZ2VuYXJldGUgZGF0YSA1IG11bml0ZXNcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChwYXJhbXMuZmlsdGVyQnkgPT0gJzNfZGF5JyAmJiBwYXJhbXMuZGF0YV9zZW5kX3RpbWUgPT0gMSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgc3RhcnREYXRlID0gJycsIGVuZERhdGUgPSAnJztcclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnREYXRlID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKSwgLTIpKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVuZERhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpLCAtMikpLmZvcm1hdCgnWVlZWS1NTS1ERCAxOTowMCcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydERhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksIGkpKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVuZERhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksIGkpKS5mb3JtYXQoJ1lZWVktTU0tREQgMTk6MDAnKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGN1ckRhdGVGb3JtYXQgPSBtb21lbnQoc3RhcnREYXRlKS5mb3JtYXQoJ1lZWVktTU0tREQgMDU6MDAnKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBoID0gMDsgaCA8IDE2ODsgaCsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJUaW1lNS5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IG1vbWVudChjdXJEYXRlRm9ybWF0KS5hZGQoNSAqIGgsICdtaW51dGVzJykuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogbW9tZW50KGN1ckRhdGVGb3JtYXQpLmFkZCg1ICogaCwgJ21pbnV0ZXMnKS5mb3JtYXQoJ0REL01NL1lZWVkgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllc190aW1lOiBtb21lbnQoY3VyRGF0ZUZvcm1hdCkuYWRkKDUgKiBoLCAnbWludXRlcycpLmZvcm1hdCgnRC4gTU1NJylcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGdlbmFyZXRlIGRhdGEgMTUgbXVuaXRlc1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHBhcmFtcy5maWx0ZXJCeSA9PSAnM19kYXknICYmIHBhcmFtcy5kYXRhX3NlbmRfdGltZSA9PSAyKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBzdGFydERhdGUgPSAnJywgZW5kRGF0ZSA9ICcnO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydERhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpLCAtMikpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW5kRGF0ZSA9IG1vbWVudChMaWJzLmFkZERheXMoTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSksIC0yKSkuZm9ybWF0KCdZWVlZLU1NLUREIDE5OjAwJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0RGF0ZSA9IG1vbWVudChMaWJzLmFkZERheXMoTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5zdGFydF9kYXRlKSwgaSkpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW5kRGF0ZSA9IG1vbWVudChMaWJzLmFkZERheXMoTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5zdGFydF9kYXRlKSwgaSkpLmZvcm1hdCgnWVlZWS1NTS1ERCAxOTowMCcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgY3VyRGF0ZUZvcm1hdCA9IG1vbWVudChzdGFydERhdGUpLmZvcm1hdCgnWVlZWS1NTS1ERCAwNTowMCcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGggPSAwOyBoIDwgNTY7IGgrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyVGltZTUucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiBtb21lbnQoY3VyRGF0ZUZvcm1hdCkuYWRkKDE1ICogaCwgJ21pbnV0ZXMnKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiBtb21lbnQoY3VyRGF0ZUZvcm1hdCkuYWRkKDE1ICogaCwgJ21pbnV0ZXMnKS5mb3JtYXQoJ0REL01NL1lZWVkgSEg6bW0nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllc190aW1lOiBtb21lbnQoY3VyRGF0ZUZvcm1hdCkuYWRkKDE1ICogaCwgJ21pbnV0ZXMnKS5mb3JtYXQoJ0QuIE1NTScpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZ2VuYXJldGUgZGF0YSAxIGhvdXJcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChwYXJhbXMuZmlsdGVyQnkgPT0gJzNfZGF5JyAmJiBwYXJhbXMuZGF0YV9zZW5kX3RpbWUgPT0gMykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgc3RhcnREYXRlID0gJycsIGVuZERhdGUgPSAnJztcclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnREYXRlID0gbW9tZW50KExpYnMuYWRkRGF5cyhMaWJzLmNvbnZlcnRBbGxGb3JtYXREYXRlKHBhcmFtLmVuZF9kYXRlKSwgLTIpKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVuZERhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpLCAtMikpLmZvcm1hdCgnWVlZWS1NTS1ERCAxOTowMCcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydERhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksIGkpKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVuZERhdGUgPSBtb21lbnQoTGlicy5hZGREYXlzKExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSksIGkpKS5mb3JtYXQoJ1lZWVktTU0tREQgMTk6MDAnKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGN1ckRhdGVGb3JtYXQgPSBtb21lbnQoc3RhcnREYXRlKS5mb3JtYXQoJ1lZWVktTU0tREQgMDU6MDAnKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBoID0gMDsgaCA8PSAxNDsgaCsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJUaW1lNS5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IG1vbWVudChjdXJEYXRlRm9ybWF0KS5hZGQoMSAqIGgsICdob3VycycpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IG1vbWVudChjdXJEYXRlRm9ybWF0KS5hZGQoMSAqIGgsICdob3VycycpLmZvcm1hdCgnREQvTU0vWVlZWSBISDptbScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzX3RpbWU6IG1vbWVudChjdXJEYXRlRm9ybWF0KS5hZGQoMSAqIGgsICdob3VycycpLmZvcm1hdCgnRC4gTU1NJylcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdHZhciBkYXRhRW5lcmd5NSA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdFx0c3dpdGNoIChkYXRhRGV2aWNlW2ldLnRhYmxlX25hbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NIUDc1JzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5NSA9IE9iamVjdC52YWx1ZXMoWy4uLmFyclRpbWU1LCAuLi5kYXRhRW5lcmd5XS5yZWR1Y2UoKGFjYywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQsIHRpbWVfZnVsbCwgY2F0ZWdvcmllc190aW1lLCBhY0N1cnJlbnQsIGN1cnJlbnRQaGFzZUEsIGN1cnJlbnRQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VDLCB2b2x0YWdlUGhhc2VBLCB2b2x0YWdlUGhhc2VCLCB2b2x0YWdlUGhhc2VDLCBhY3RpdmVQb3dlciwgcG93ZXJGcmVxdWVuY3ksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcHBhcmVudFBvd2VyLCByZWFjdGl2ZVBvd2VyLCBwb3dlckZhY3RvciwgYWN0aXZlRW5lcmd5LCBkY0N1cnJlbnQsIGRjVm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjUG93ZXIsIGludGVybmFsVGVtcGVyYXR1cmUsIGhlYXRTaW5rVGVtcGVyYXR1cmUsIHRyYW5zZm9ybWVyVGVtcGVyYXR1cmVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY2NbdGltZV9mdWxsXSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IHRpbWVfZm9ybWF0ID8gdGltZV9mb3JtYXQgOiBhY2NbdGltZV9mdWxsXS50aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiB0aW1lX2Z1bGwgPyB0aW1lX2Z1bGwgOiBhY2NbdGltZV9mdWxsXS50aW1lX2Z1bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNhdGVnb3JpZXNfdGltZTogY2F0ZWdvcmllc190aW1lID8gY2F0ZWdvcmllc190aW1lIDogYWNjW3RpbWVfZnVsbF0uY2F0ZWdvcmllc190aW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY0N1cnJlbnQ6IGFjQ3VycmVudCA/IGFjQ3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUE6IGN1cnJlbnRQaGFzZUEgPyBjdXJyZW50UGhhc2VBIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQjogY3VycmVudFBoYXNlQiA/IGN1cnJlbnRQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VDOiBjdXJyZW50UGhhc2VDID8gY3VycmVudFBoYXNlQyA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUE6IHZvbHRhZ2VQaGFzZUEgPyB2b2x0YWdlUGhhc2VBIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQjogdm9sdGFnZVBoYXNlQiA/IHZvbHRhZ2VQaGFzZUIgOiB2b2x0YWdlUGhhc2VCLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VDOiB2b2x0YWdlUGhhc2VDID8gdm9sdGFnZVBoYXNlQyA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyOiBhY3RpdmVQb3dlciA/IGFjdGl2ZVBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGcmVxdWVuY3k6IHBvd2VyRnJlcXVlbmN5ID8gcG93ZXJGcmVxdWVuY3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcHBhcmVudFBvd2VyOiBhcHBhcmVudFBvd2VyID8gYXBwYXJlbnRQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlUG93ZXI6IHJlYWN0aXZlUG93ZXIgPyByZWFjdGl2ZVBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3I6IHBvd2VyRmFjdG9yID8gcG93ZXJGYWN0b3IgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IGFjdGl2ZUVuZXJneSA/IGFjdGl2ZUVuZXJneSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjQ3VycmVudDogZGNDdXJyZW50ID8gZGNDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGNWb2x0YWdlOiBkY1ZvbHRhZ2UgPyBkY1ZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkY1Bvd2VyOiBkY1Bvd2VyID8gZGNQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGludGVybmFsVGVtcGVyYXR1cmU6IGludGVybmFsVGVtcGVyYXR1cmUgPyBpbnRlcm5hbFRlbXBlcmF0dXJlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhdFNpbmtUZW1wZXJhdHVyZTogaGVhdFNpbmtUZW1wZXJhdHVyZSA/IGhlYXRTaW5rVGVtcGVyYXR1cmUgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2Zvcm1lclRlbXBlcmF0dXJlOiB0cmFuc2Zvcm1lclRlbXBlcmF0dXJlID8gdHJhbnNmb3JtZXJUZW1wZXJhdHVyZSA6IG51bGxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0sIHt9KSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0uZGF0YSA9IGRhdGFFbmVyZ3k1O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfQUJCX1BWUzEwMCc6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneTUgPSBPYmplY3QudmFsdWVzKFsuLi5hcnJUaW1lNSwgLi4uZGF0YUVuZXJneV0ucmVkdWNlKChhY2MsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0LCB0aW1lX2Z1bGwsIGNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjQ3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VCLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VCLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGcmVxdWVuY3ksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcHBhcmVudFBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGNDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGNWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGNQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGludGVybmFsVGVtcGVyYXR1cmUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoZWF0U2lua1RlbXBlcmF0dXJlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDFDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDFWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDFQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQyQ3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQyVm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQyUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0M0N1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0M1ZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0M1Bvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDRDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDRWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDRQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ1Q3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ1Vm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ1UG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NkN1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NlZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NlBvd2VyXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiB0aW1lX2Zvcm1hdCA/IHRpbWVfZm9ybWF0IDogYWNjW3RpbWVfZnVsbF0udGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogdGltZV9mdWxsID8gdGltZV9mdWxsIDogYWNjW3RpbWVfZnVsbF0udGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzX3RpbWU6IGNhdGVnb3JpZXNfdGltZSA/IGNhdGVnb3JpZXNfdGltZSA6IGFjY1t0aW1lX2Z1bGxdLmNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNDdXJyZW50OiBhY0N1cnJlbnQgPyBhY0N1cnJlbnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VBOiBjdXJyZW50UGhhc2VBID8gY3VycmVudFBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUI6IGN1cnJlbnRQaGFzZUIgPyBjdXJyZW50UGhhc2VCIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQzogY3VycmVudFBoYXNlQyA/IGN1cnJlbnRQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VBOiB2b2x0YWdlUGhhc2VBID8gdm9sdGFnZVBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUI6IHZvbHRhZ2VQaGFzZUIgPyB2b2x0YWdlUGhhc2VCIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQzogdm9sdGFnZVBoYXNlQyA/IHZvbHRhZ2VQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogYWN0aXZlUG93ZXIgPyBhY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRnJlcXVlbmN5OiBwb3dlckZyZXF1ZW5jeSA/IHBvd2VyRnJlcXVlbmN5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXBwYXJlbnRQb3dlcjogYXBwYXJlbnRQb3dlciA/IGFwcGFyZW50UG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZVBvd2VyOiByZWFjdGl2ZVBvd2VyID8gcmVhY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yOiBwb3dlckZhY3RvciA/IHBvd2VyRmFjdG9yIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiBhY3RpdmVFbmVyZ3kgPyBhY3RpdmVFbmVyZ3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkY0N1cnJlbnQ6IGRjQ3VycmVudCA/IGRjQ3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjVm9sdGFnZTogZGNWb2x0YWdlID8gZGNWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGNQb3dlcjogZGNQb3dlciA/IGRjUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpbnRlcm5hbFRlbXBlcmF0dXJlOiBpbnRlcm5hbFRlbXBlcmF0dXJlID8gaW50ZXJuYWxUZW1wZXJhdHVyZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYXRTaW5rVGVtcGVyYXR1cmU6IGhlYXRTaW5rVGVtcGVyYXR1cmUgPyBoZWF0U2lua1RlbXBlcmF0dXJlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDFDdXJyZW50OiBtcHB0MUN1cnJlbnQgPyBtcHB0MUN1cnJlbnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MVZvbHRhZ2U6IG1wcHQxVm9sdGFnZSA/IG1wcHQxVm9sdGFnZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxUG93ZXI6IG1wcHQxUG93ZXIgPyBtcHB0MVBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDJDdXJyZW50OiBtcHB0MkN1cnJlbnQgPyBtcHB0MkN1cnJlbnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MlZvbHRhZ2U6IG1wcHQyVm9sdGFnZSA/IG1wcHQyVm9sdGFnZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQyUG93ZXI6IG1wcHQyUG93ZXIgPyBtcHB0MlBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDNDdXJyZW50OiBtcHB0M0N1cnJlbnQgPyBtcHB0M0N1cnJlbnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0M1ZvbHRhZ2U6IG1wcHQzVm9sdGFnZSA/IG1wcHQzVm9sdGFnZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQzUG93ZXI6IG1wcHQzUG93ZXIgPyBtcHB0M1Bvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDRDdXJyZW50OiBtcHB0NEN1cnJlbnQgPyBtcHB0NEN1cnJlbnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NFZvbHRhZ2U6IG1wcHQ0Vm9sdGFnZSA/IG1wcHQ0Vm9sdGFnZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ0UG93ZXI6IG1wcHQ0UG93ZXIgPyBtcHB0NFBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDVDdXJyZW50OiBtcHB0NUN1cnJlbnQgPyBtcHB0NUN1cnJlbnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NVZvbHRhZ2U6IG1wcHQ1Vm9sdGFnZSA/IG1wcHQ1Vm9sdGFnZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ1UG93ZXI6IG1wcHQ1UG93ZXIgPyBtcHB0NVBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDZDdXJyZW50OiBtcHB0NkN1cnJlbnQgPyBtcHB0NkN1cnJlbnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NlZvbHRhZ2U6IG1wcHQ2Vm9sdGFnZSA/IG1wcHQ2Vm9sdGFnZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ2UG93ZXI6IG1wcHQ2UG93ZXIgPyBtcHB0NlBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0sIHt9KSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0uZGF0YSA9IGRhdGFFbmVyZ3k1O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU1RQNTAnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3k1ID0gT2JqZWN0LnZhbHVlcyhbLi4uYXJyVGltZTUsIC4uLmRhdGFFbmVyZ3ldLnJlZHVjZSgoYWNjLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBjYXRlZ29yaWVzX3RpbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VBLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VBLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRnJlcXVlbmN5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXBwYXJlbnRQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZhY3RvcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhaWx5RW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGNDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGNWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGNQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGludGVybmFsVGVtcGVyYXR1cmUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MUN1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MVZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MVBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDJDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDJWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDJQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQzQ3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQzVm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQzUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NEN1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NFZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NFBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDVDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDVWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDVQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ2Q3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ2Vm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ2UG93ZXJcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiB0aW1lX2Zvcm1hdCA/IHRpbWVfZm9ybWF0IDogYWNjW3RpbWVfZnVsbF0udGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogdGltZV9mdWxsID8gdGltZV9mdWxsIDogYWNjW3RpbWVfZnVsbF0udGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzX3RpbWU6IGNhdGVnb3JpZXNfdGltZSA/IGNhdGVnb3JpZXNfdGltZSA6IGFjY1t0aW1lX2Z1bGxdLmNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQTogY3VycmVudFBoYXNlQSA/IGN1cnJlbnRQaGFzZUEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VCOiBjdXJyZW50UGhhc2VCID8gY3VycmVudFBoYXNlQiA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUM6IGN1cnJlbnRQaGFzZUMgPyBjdXJyZW50UGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQTogdm9sdGFnZVBoYXNlQSA/IHZvbHRhZ2VQaGFzZUEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VCOiB2b2x0YWdlUGhhc2VCID8gdm9sdGFnZVBoYXNlQiA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUM6IHZvbHRhZ2VQaGFzZUMgPyB2b2x0YWdlUGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXI6IGFjdGl2ZVBvd2VyID8gYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZyZXF1ZW5jeTogcG93ZXJGcmVxdWVuY3kgPyBwb3dlckZyZXF1ZW5jeSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFwcGFyZW50UG93ZXI6IGFwcGFyZW50UG93ZXIgPyBhcHBhcmVudFBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVQb3dlcjogcmVhY3RpdmVQb3dlciA/IHJlYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZhY3RvcjogcG93ZXJGYWN0b3IgPyBwb3dlckZhY3RvciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogYWN0aXZlRW5lcmd5ID8gYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGFpbHlFbmVyZ3k6IGRhaWx5RW5lcmd5ID8gZGFpbHlFbmVyZ3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkY0N1cnJlbnQ6IGRjQ3VycmVudCA/IGRjQ3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjVm9sdGFnZTogZGNWb2x0YWdlID8gZGNWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGNQb3dlcjogZGNQb3dlciA/IGRjUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpbnRlcm5hbFRlbXBlcmF0dXJlOiBpbnRlcm5hbFRlbXBlcmF0dXJlID8gaW50ZXJuYWxUZW1wZXJhdHVyZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxQ3VycmVudDogbXBwdDFDdXJyZW50ID8gbXBwdDFDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDFWb2x0YWdlOiBtcHB0MVZvbHRhZ2UgPyBtcHB0MVZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MVBvd2VyOiBtcHB0MVBvd2VyID8gbXBwdDFQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQyQ3VycmVudDogbXBwdDJDdXJyZW50ID8gbXBwdDJDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDJWb2x0YWdlOiBtcHB0MlZvbHRhZ2UgPyBtcHB0MlZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MlBvd2VyOiBtcHB0MlBvd2VyID8gbXBwdDJQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQzQ3VycmVudDogbXBwdDNDdXJyZW50ID8gbXBwdDNDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDNWb2x0YWdlOiBtcHB0M1ZvbHRhZ2UgPyBtcHB0M1ZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0M1Bvd2VyOiBtcHB0M1Bvd2VyID8gbXBwdDNQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ0Q3VycmVudDogbXBwdDRDdXJyZW50ID8gbXBwdDRDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDRWb2x0YWdlOiBtcHB0NFZvbHRhZ2UgPyBtcHB0NFZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NFBvd2VyOiBtcHB0NFBvd2VyID8gbXBwdDRQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ1Q3VycmVudDogbXBwdDVDdXJyZW50ID8gbXBwdDVDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDVWb2x0YWdlOiBtcHB0NVZvbHRhZ2UgPyBtcHB0NVZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NVBvd2VyOiBtcHB0NVBvd2VyID8gbXBwdDVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ2Q3VycmVudDogbXBwdDZDdXJyZW50ID8gbXBwdDZDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDZWb2x0YWdlOiBtcHB0NlZvbHRhZ2UgPyBtcHB0NlZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NlBvd2VyOiBtcHB0NlBvd2VyID8gbXBwdDZQb3dlciA6IG51bGxcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmRhdGEgPSBkYXRhRW5lcmd5NTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2xvZ2dlcl9TTUFfSU0yMCc6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneTUgPSBPYmplY3QudmFsdWVzKFsuLi5hcnJUaW1lNSwgLi4uZGF0YUVuZXJneV0ucmVkdWNlKChhY2MsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0LCB0aW1lX2Z1bGwsIGNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1hbnVmYWN0dXJlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZGVsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2VyaWFsTnVtYmVyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bW9kYnVzVW5pdElkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiB0aW1lX2Zvcm1hdCA/IHRpbWVfZm9ybWF0IDogYWNjW3RpbWVfZnVsbF0udGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogdGltZV9mdWxsID8gdGltZV9mdWxsIDogYWNjW3RpbWVfZnVsbF0udGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzX3RpbWU6IGNhdGVnb3JpZXNfdGltZSA/IGNhdGVnb3JpZXNfdGltZSA6IGFjY1t0aW1lX2Z1bGxdLmNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWFudWZhY3R1cmVyOiBtYW51ZmFjdHVyZXIgPyBtYW51ZmFjdHVyZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtb2RlbDogbW9kZWwgPyBtb2RlbCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNlcmlhbE51bWJlcjogc2VyaWFsTnVtYmVyID8gc2VyaWFsTnVtYmVyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bW9kYnVzVW5pdElkOiBtb2RidXNVbml0SWQgPyBtb2RidXNVbml0SWQgOiBudWxsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmRhdGEgPSBkYXRhRW5lcmd5NTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfc2Vuc29yX0lNVF9TaVJTNDg1JzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5NSA9IE9iamVjdC52YWx1ZXMoWy4uLmFyclRpbWU1LCAuLi5kYXRhRW5lcmd5XS5yZWR1Y2UoKGFjYywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQsIHRpbWVfZnVsbCwgY2F0ZWdvcmllc190aW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXJyYWRpYW5jZVBvQSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNlbGxUZW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cGFuZWxUZW1wXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjY1t0aW1lX2Z1bGxdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdDogdGltZV9mb3JtYXQgPyB0aW1lX2Zvcm1hdCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IHRpbWVfZnVsbCA/IHRpbWVfZnVsbCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllc190aW1lOiBjYXRlZ29yaWVzX3RpbWUgPyBjYXRlZ29yaWVzX3RpbWUgOiBhY2NbdGltZV9mdWxsXS5jYXRlZ29yaWVzX3RpbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlycmFkaWFuY2VQb0E6IGlycmFkaWFuY2VQb0EgPyBpcnJhZGlhbmNlUG9BIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2VsbFRlbXA6IGNlbGxUZW1wID8gY2VsbFRlbXAgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwYW5lbFRlbXA6IHBhbmVsVGVtcCA/IHBhbmVsVGVtcCA6IG51bGxcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmRhdGEgPSBkYXRhRW5lcmd5NTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfc2Vuc29yX0lNVF9UYVJTNDg1JzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5NSA9IE9iamVjdC52YWx1ZXMoWy4uLmFyclRpbWU1LCAuLi5kYXRhRW5lcmd5XS5yZWR1Y2UoKGFjYywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQsIHRpbWVfZnVsbCwgY2F0ZWdvcmllc190aW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YW1iaWVudFRlbXBcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiB0aW1lX2Zvcm1hdCA/IHRpbWVfZm9ybWF0IDogYWNjW3RpbWVfZnVsbF0udGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogdGltZV9mdWxsID8gdGltZV9mdWxsIDogYWNjW3RpbWVfZnVsbF0udGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzX3RpbWU6IGNhdGVnb3JpZXNfdGltZSA/IGNhdGVnb3JpZXNfdGltZSA6IGFjY1t0aW1lX2Z1bGxdLmNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YW1iaWVudFRlbXA6IGFtYmllbnRUZW1wID8gYW1iaWVudFRlbXAgOiBudWxsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmRhdGEgPSBkYXRhRW5lcmd5NTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfdGVjaGVkZ2UnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3k1ID0gT2JqZWN0LnZhbHVlcyhbLi4uYXJyVGltZTUsIC4uLmRhdGFFbmVyZ3ldLnJlZHVjZSgoYWNjLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBjYXRlZ29yaWVzX3RpbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZW1QZXJjZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVtVG90YWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZW1Vc2VkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVtQXZhaWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZW1GcmVlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGlza1BlcmNlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkaXNrVG90YWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkaXNrVXNlZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRpc2tGcmVlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3B1VGVtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVwVGltZVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY2NbdGltZV9mdWxsXSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IHRpbWVfZm9ybWF0ID8gdGltZV9mb3JtYXQgOiBhY2NbdGltZV9mdWxsXS50aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiB0aW1lX2Z1bGwgPyB0aW1lX2Z1bGwgOiBhY2NbdGltZV9mdWxsXS50aW1lX2Z1bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNhdGVnb3JpZXNfdGltZTogY2F0ZWdvcmllc190aW1lID8gY2F0ZWdvcmllc190aW1lIDogYWNjW3RpbWVfZnVsbF0uY2F0ZWdvcmllc190aW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZW1QZXJjZW50OiBtZW1QZXJjZW50ID8gbWVtUGVyY2VudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lbVRvdGFsOiBtZW1Ub3RhbCA/IG1lbVRvdGFsIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVtVXNlZDogbWVtVXNlZCA/IG1lbVVzZWQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZW1BdmFpbDogbWVtQXZhaWwgPyBtZW1BdmFpbCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lbUZyZWU6IG1lbUZyZWUgPyBtZW1GcmVlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGlza1BlcmNlbnQ6IGRpc2tQZXJjZW50ID8gZGlza1BlcmNlbnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkaXNrVG90YWw6IGRpc2tUb3RhbCA/IGRpc2tUb3RhbCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRpc2tVc2VkOiBkaXNrVXNlZCA/IGRpc2tVc2VkIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGlza0ZyZWU6IGRpc2tGcmVlID8gZGlza0ZyZWUgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjcHVUZW1wOiBjcHVUZW1wID8gY3B1VGVtcCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVwVGltZTogdXBUaW1lID8gdXBUaW1lIDogbnVsbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5kYXRhID0gZGF0YUVuZXJneTU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TVFAxMTAnOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3k1ID0gT2JqZWN0LnZhbHVlcyhbLi4uYXJyVGltZTUsIC4uLmRhdGFFbmVyZ3ldLnJlZHVjZSgoYWNjLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBjYXRlZ29yaWVzX3RpbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY0N1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VBLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VBLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRnJlcXVlbmN5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXBwYXJlbnRQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZhY3RvcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjQ3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjVm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYWJpbmV0VGVtcGVyYXR1cmUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MUN1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MVZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MVBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDJDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDJWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDJQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQzQ3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQzVm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQzUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NEN1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NFZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NFBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDVDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDVWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDVQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ2Q3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ2Vm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ2UG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0N0N1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0N1ZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0N1Bvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDhDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDhWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDhQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ5Q3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ5Vm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ5UG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MTBDdXJyZW50LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDEwVm9sdGFnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxMFBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDExQ3VycmVudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxMVZvbHRhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MTFQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxMkN1cnJlbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MTJWb2x0YWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDEyUG93ZXJcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiB0aW1lX2Zvcm1hdCA/IHRpbWVfZm9ybWF0IDogYWNjW3RpbWVfZnVsbF0udGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogdGltZV9mdWxsID8gdGltZV9mdWxsIDogYWNjW3RpbWVfZnVsbF0udGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzX3RpbWU6IGNhdGVnb3JpZXNfdGltZSA/IGNhdGVnb3JpZXNfdGltZSA6IGFjY1t0aW1lX2Z1bGxdLmNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNDdXJyZW50OiBhY0N1cnJlbnQgPyBhY0N1cnJlbnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VBOiBjdXJyZW50UGhhc2VBID8gY3VycmVudFBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUI6IGN1cnJlbnRQaGFzZUIgPyBjdXJyZW50UGhhc2VCIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQzogY3VycmVudFBoYXNlQyA/IGN1cnJlbnRQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VBOiB2b2x0YWdlUGhhc2VBID8gdm9sdGFnZVBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUI6IHZvbHRhZ2VQaGFzZUIgPyB2b2x0YWdlUGhhc2VCIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQzogdm9sdGFnZVBoYXNlQyA/IHZvbHRhZ2VQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogYWN0aXZlUG93ZXIgPyBhY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRnJlcXVlbmN5OiBwb3dlckZyZXF1ZW5jeSA/IHBvd2VyRnJlcXVlbmN5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXBwYXJlbnRQb3dlcjogYXBwYXJlbnRQb3dlciA/IGFwcGFyZW50UG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZVBvd2VyOiByZWFjdGl2ZVBvd2VyID8gcmVhY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yOiBwb3dlckZhY3RvciA/IHBvd2VyRmFjdG9yIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiBhY3RpdmVFbmVyZ3kgPyBhY3RpdmVFbmVyZ3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkY0N1cnJlbnQ6IGRjQ3VycmVudCA/IGRjQ3VycmVudCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRjVm9sdGFnZTogZGNWb2x0YWdlID8gZGNWb2x0YWdlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGNQb3dlcjogZGNQb3dlciA/IGRjUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYWJpbmV0VGVtcGVyYXR1cmU6IGNhYmluZXRUZW1wZXJhdHVyZSA/IGNhYmluZXRUZW1wZXJhdHVyZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxQ3VycmVudDogbXBwdDFDdXJyZW50ID8gbXBwdDFDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDFWb2x0YWdlOiBtcHB0MVZvbHRhZ2UgPyBtcHB0MVZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MVBvd2VyOiBtcHB0MVBvd2VyID8gbXBwdDFQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQyQ3VycmVudDogbXBwdDJDdXJyZW50ID8gbXBwdDJDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDJWb2x0YWdlOiBtcHB0MlZvbHRhZ2UgPyBtcHB0MlZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MlBvd2VyOiBtcHB0MlBvd2VyID8gbXBwdDJQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQzQ3VycmVudDogbXBwdDNDdXJyZW50ID8gbXBwdDNDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDNWb2x0YWdlOiBtcHB0M1ZvbHRhZ2UgPyBtcHB0M1ZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0M1Bvd2VyOiBtcHB0M1Bvd2VyID8gbXBwdDNQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ0Q3VycmVudDogbXBwdDRDdXJyZW50ID8gbXBwdDRDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDRWb2x0YWdlOiBtcHB0NFZvbHRhZ2UgPyBtcHB0NFZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NFBvd2VyOiBtcHB0NFBvd2VyID8gbXBwdDRQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ1Q3VycmVudDogbXBwdDVDdXJyZW50ID8gbXBwdDVDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDVWb2x0YWdlOiBtcHB0NVZvbHRhZ2UgPyBtcHB0NVZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NVBvd2VyOiBtcHB0NVBvd2VyID8gbXBwdDVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ2Q3VycmVudDogbXBwdDZDdXJyZW50ID8gbXBwdDZDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDZWb2x0YWdlOiBtcHB0NlZvbHRhZ2UgPyBtcHB0NlZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0NlBvd2VyOiBtcHB0NlBvd2VyID8gbXBwdDZQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ3Q3VycmVudDogbXBwdDdDdXJyZW50ID8gbXBwdDdDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDdWb2x0YWdlOiBtcHB0N1ZvbHRhZ2UgPyBtcHB0N1ZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0N1Bvd2VyOiBtcHB0N1Bvd2VyID8gbXBwdDdQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ4Q3VycmVudDogbXBwdDhDdXJyZW50ID8gbXBwdDhDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDhWb2x0YWdlOiBtcHB0OFZvbHRhZ2UgPyBtcHB0OFZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0OFBvd2VyOiBtcHB0OFBvd2VyID8gbXBwdDhQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQ5Q3VycmVudDogbXBwdDlDdXJyZW50ID8gbXBwdDlDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDlWb2x0YWdlOiBtcHB0OVZvbHRhZ2UgPyBtcHB0OVZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0OVBvd2VyOiBtcHB0OVBvd2VyID8gbXBwdDlQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxMEN1cnJlbnQ6IG1wcHQxMEN1cnJlbnQgPyBtcHB0MTBDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDEwVm9sdGFnZTogbXBwdDEwVm9sdGFnZSA/IG1wcHQxMFZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MTBQb3dlcjogbXBwdDEwUG93ZXIgPyBtcHB0MTBQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxMUN1cnJlbnQ6IG1wcHQxMUN1cnJlbnQgPyBtcHB0MTFDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDExVm9sdGFnZTogbXBwdDExVm9sdGFnZSA/IG1wcHQxMVZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MTFQb3dlcjogbXBwdDExUG93ZXIgPyBtcHB0MTFQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1wcHQxMkN1cnJlbnQ6IG1wcHQxMkN1cnJlbnQgPyBtcHB0MTJDdXJyZW50IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bXBwdDEyVm9sdGFnZTogbXBwdDEyVm9sdGFnZSA/IG1wcHQxMlZvbHRhZ2UgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtcHB0MTJQb3dlcjogbXBwdDEyUG93ZXIgPyBtcHB0MTJQb3dlciA6IG51bGxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0sIHt9KSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFEZXZpY2VbaV0uZGF0YSA9IGRhdGFFbmVyZ3k1O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfZW1ldGVyX1ZpbmFzaW5vX1ZTRTNUNSc6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneTUgPSBPYmplY3QudmFsdWVzKFsuLi5hcnJUaW1lNSwgLi4uZGF0YUVuZXJneV0ucmVkdWNlKChhY2MsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0LCB0aW1lX2Z1bGwsIGNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneVJhdGUxLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5UmF0ZTIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lSYXRlMyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlUmF0ZTEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGcmVxdWVuY3ksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZhY3RvcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyUGhhc2VBLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXJQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlclBoYXNlQyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlUG93ZXJQaGFzZUEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZVBvd2VyUGhhc2VCLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVQb3dlclBoYXNlQyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyTWF4RGVtYW5kLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXJNYXhEZW1hbmRSYXRlMSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyTWF4RGVtYW5kUmF0ZTIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlck1heERlbWFuZFJhdGUzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3JQaGFzZUEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZhY3RvclBoYXNlQixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Q1RyYXRpb1ByaW1hcnksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRDVHJhdGlvU2Vjb25kYXJ5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0UFRyYXRpb1ByaW1hcnksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRQVHJhdGlvU2Vjb25kYXJ5XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiB0aW1lX2Zvcm1hdCA/IHRpbWVfZm9ybWF0IDogYWNjW3RpbWVfZnVsbF0udGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogdGltZV9mdWxsID8gdGltZV9mdWxsIDogYWNjW3RpbWVfZnVsbF0udGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzX3RpbWU6IGNhdGVnb3JpZXNfdGltZSA/IGNhdGVnb3JpZXNfdGltZSA6IGFjY1t0aW1lX2Z1bGxdLmNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiBhY3RpdmVFbmVyZ3kgPyBhY3RpdmVFbmVyZ3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lSYXRlMTogYWN0aXZlRW5lcmd5UmF0ZTEgPyBhY3RpdmVFbmVyZ3lSYXRlMSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneVJhdGUyOiBhY3RpdmVFbmVyZ3lSYXRlMiA/IGFjdGl2ZUVuZXJneVJhdGUyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5UmF0ZTM6IGFjdGl2ZUVuZXJneVJhdGUzID8gYWN0aXZlRW5lcmd5UmF0ZTMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUluZHVjdGl2ZTogcmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmUgPyByZWFjdGl2ZUVuZXJneUluZHVjdGl2ZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTE6IHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTEgPyByZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUxIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMjogcmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMiA/IHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUzOiByZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUzID8gcmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMyA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZTogcmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlID8gcmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlUmF0ZTE6IHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUxID8gcmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlUmF0ZTEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMjogcmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlUmF0ZTIgPyByZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMiA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUzOiByZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMyA/IHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUzIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQTogY3VycmVudFBoYXNlQSA/IGN1cnJlbnRQaGFzZUEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VCOiBjdXJyZW50UGhhc2VCID8gY3VycmVudFBoYXNlQiA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUM6IGN1cnJlbnRQaGFzZUMgPyBjdXJyZW50UGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQTogdm9sdGFnZVBoYXNlQSA/IHZvbHRhZ2VQaGFzZUEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VCOiB2b2x0YWdlUGhhc2VCID8gdm9sdGFnZVBoYXNlQiA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUM6IHZvbHRhZ2VQaGFzZUMgPyB2b2x0YWdlUGhhc2VDIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGcmVxdWVuY3k6IHBvd2VyRnJlcXVlbmN5ID8gcG93ZXJGcmVxdWVuY3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogYWN0aXZlUG93ZXIgPyBhY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlUG93ZXI6IHJlYWN0aXZlUG93ZXIgPyByZWFjdGl2ZVBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3I6IHBvd2VyRmFjdG9yID8gcG93ZXJGYWN0b3IgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlclBoYXNlQTogYWN0aXZlUG93ZXJQaGFzZUEgPyBhY3RpdmVQb3dlclBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyUGhhc2VCOiBhY3RpdmVQb3dlclBoYXNlQiA/IGFjdGl2ZVBvd2VyUGhhc2VCIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXJQaGFzZUM6IGFjdGl2ZVBvd2VyUGhhc2VDID8gYWN0aXZlUG93ZXJQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZVBvd2VyUGhhc2VBOiByZWFjdGl2ZVBvd2VyUGhhc2VBID8gcmVhY3RpdmVQb3dlclBoYXNlQSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlUG93ZXJQaGFzZUI6IHJlYWN0aXZlUG93ZXJQaGFzZUIgPyByZWFjdGl2ZVBvd2VyUGhhc2VCIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVQb3dlclBoYXNlQzogcmVhY3RpdmVQb3dlclBoYXNlQyA/IHJlYWN0aXZlUG93ZXJQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlck1heERlbWFuZDogYWN0aXZlUG93ZXJNYXhEZW1hbmQgPyBhY3RpdmVQb3dlck1heERlbWFuZCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyTWF4RGVtYW5kUmF0ZTE6IGFjdGl2ZVBvd2VyTWF4RGVtYW5kUmF0ZTEgPyBhY3RpdmVQb3dlck1heERlbWFuZFJhdGUxIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXJNYXhEZW1hbmRSYXRlMjogYWN0aXZlUG93ZXJNYXhEZW1hbmRSYXRlMiA/IGFjdGl2ZVBvd2VyTWF4RGVtYW5kUmF0ZTIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlck1heERlbWFuZFJhdGUzOiBhY3RpdmVQb3dlck1heERlbWFuZFJhdGUzID8gYWN0aXZlUG93ZXJNYXhEZW1hbmRSYXRlMyA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yUGhhc2VBOiBwb3dlckZhY3RvclBoYXNlQSA/IHBvd2VyRmFjdG9yUGhhc2VBIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3JQaGFzZUI6IHBvd2VyRmFjdG9yUGhhc2VCID8gcG93ZXJGYWN0b3JQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZhY3RvclBoYXNlQzogcG93ZXJGYWN0b3JQaGFzZUMgPyBwb3dlckZhY3RvclBoYXNlQyA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdENUcmF0aW9QcmltYXJ5OiBDVHJhdGlvUHJpbWFyeSA/IENUcmF0aW9QcmltYXJ5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Q1RyYXRpb1NlY29uZGFyeTogQ1RyYXRpb1NlY29uZGFyeSA/IENUcmF0aW9TZWNvbmRhcnkgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRQVHJhdGlvUHJpbWFyeTogUFRyYXRpb1ByaW1hcnkgPyBQVHJhdGlvUHJpbWFyeSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFBUcmF0aW9TZWNvbmRhcnk6IFBUcmF0aW9TZWNvbmRhcnkgPyBQVHJhdGlvU2Vjb25kYXJ5IDogbnVsbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5kYXRhID0gZGF0YUVuZXJneTU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfZW1ldGVyX0dlbGV4RW1pY19NRTQxJzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3k1ID0gT2JqZWN0LnZhbHVlcyhbLi4uYXJyVGltZTUsIC4uLmRhdGFFbmVyZ3ldLnJlZHVjZSgoYWNjLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0LCB0aW1lX2Z1bGwsIGNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lFeHBvcnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneUV4cG9ydFJhdGUxLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lFeHBvcnRSYXRlMixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5RXhwb3J0UmF0ZTMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneUltcG9ydCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5SW1wb3J0UmF0ZTEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneUltcG9ydFJhdGUyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lJbXBvcnRSYXRlMyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lFeHBvcnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5SW1wb3J0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VBLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VCLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VBLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VCLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlckZhY3RvcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQ6IHRpbWVfZm9ybWF0ID8gdGltZV9mb3JtYXQgOiBhY2NbdGltZV9mdWxsXS50aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IHRpbWVfZnVsbCA/IHRpbWVfZnVsbCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzX3RpbWU6IGNhdGVnb3JpZXNfdGltZSA/IGNhdGVnb3JpZXNfdGltZSA6IGFjY1t0aW1lX2Z1bGxdLmNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IGFjdGl2ZUVuZXJneSA/IGFjdGl2ZUVuZXJneSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5RXhwb3J0OiBhY3RpdmVFbmVyZ3lFeHBvcnQgPyBhY3RpdmVFbmVyZ3lFeHBvcnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneUV4cG9ydFJhdGUxOiBhY3RpdmVFbmVyZ3lFeHBvcnRSYXRlMSA/IGFjdGl2ZUVuZXJneUV4cG9ydFJhdGUxIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lFeHBvcnRSYXRlMjogYWN0aXZlRW5lcmd5RXhwb3J0UmF0ZTIgPyBhY3RpdmVFbmVyZ3lFeHBvcnRSYXRlMiA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5RXhwb3J0UmF0ZTM6IGFjdGl2ZUVuZXJneUV4cG9ydFJhdGUzID8gYWN0aXZlRW5lcmd5RXhwb3J0UmF0ZTMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneUltcG9ydDogYWN0aXZlRW5lcmd5SW1wb3J0ID8gYWN0aXZlRW5lcmd5SW1wb3J0IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3lJbXBvcnRSYXRlMTogYWN0aXZlRW5lcmd5SW1wb3J0UmF0ZTEgPyBhY3RpdmVFbmVyZ3lJbXBvcnRSYXRlMSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5SW1wb3J0UmF0ZTI6IGFjdGl2ZUVuZXJneUltcG9ydFJhdGUyID8gYWN0aXZlRW5lcmd5SW1wb3J0UmF0ZTIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneUltcG9ydFJhdGUzOiBhY3RpdmVFbmVyZ3lJbXBvcnRSYXRlMyA/IGFjdGl2ZUVuZXJneUltcG9ydFJhdGUzIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUV4cG9ydDogcmVhY3RpdmVFbmVyZ3lFeHBvcnQgPyByZWFjdGl2ZUVuZXJneUV4cG9ydCA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lJbXBvcnQ6IHJlYWN0aXZlRW5lcmd5SW1wb3J0ID8gcmVhY3RpdmVFbmVyZ3lJbXBvcnQgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUE6IHZvbHRhZ2VQaGFzZUEgPyB2b2x0YWdlUGhhc2VBIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VCOiB2b2x0YWdlUGhhc2VCID8gdm9sdGFnZVBoYXNlQiA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQzogdm9sdGFnZVBoYXNlQyA/IHZvbHRhZ2VQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUE6IGN1cnJlbnRQaGFzZUEgPyBjdXJyZW50UGhhc2VBIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VCOiBjdXJyZW50UGhhc2VCID8gY3VycmVudFBoYXNlQiA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQzogY3VycmVudFBoYXNlQyA/IGN1cnJlbnRQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yOiBwb3dlckZhY3RvciA/IHBvd2VyRmFjdG9yIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogYWN0aXZlUG93ZXIgPyBhY3RpdmVQb3dlciA6IG51bGxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0sIHt9KSk7XHJcblx0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRGV2aWNlW2ldLmRhdGEgPSBkYXRhRW5lcmd5NTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2VtZXRlcl9WaW5hc2lub19WU0UzVDUyMDIzJzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneTUgPSBPYmplY3QudmFsdWVzKFsuLi5hcnJUaW1lNSwgLi4uZGF0YUVuZXJneV0ucmVkdWNlKChhY2MsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBjYXRlZ29yaWVzX3RpbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneVJhdGUxLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneVJhdGUyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneVJhdGUzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VBY3RpdmVFbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZUFjdGl2ZUVuZXJneVJhdGUxLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VBY3RpdmVFbmVyZ3lSYXRlMixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXZlcnNlQWN0aXZlRW5lcmd5UmF0ZTMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lJbmR1Y3RpdmVSYXRlMSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUxLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50UGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHRhZ2VQaGFzZUEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2b2x0YWdlUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRnJlcXVlbmN5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VBY3RpdmVQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZVBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VSZWFjdGl2ZVBvd2VyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyUGhhc2VBLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyUGhhc2VCLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZVBvd2VyUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VBY3RpdmVQb3dlclBoYXNlQSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXZlcnNlQWN0aXZlUG93ZXJQaGFzZUIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZUFjdGl2ZVBvd2VyUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlUG93ZXJQaGFzZUEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVQb3dlclBoYXNlQixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFjdGl2ZVBvd2VyUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VSZWFjdGl2ZVBvd2VyUGhhc2VBLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VSZWFjdGl2ZVBvd2VyUGhhc2VCLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VSZWFjdGl2ZVBvd2VyUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yUGhhc2VBLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yUGhhc2VCLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyRmFjdG9yUGhhc2VDLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdENUcmF0aW9QcmltYXJ5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdENUcmF0aW9TZWNvbmRhcnksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0UFRyYXRpb1ByaW1hcnksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0UFRyYXRpb1NlY29uZGFyeVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdDogdGltZV9mb3JtYXQgPyB0aW1lX2Zvcm1hdCA6IGFjY1t0aW1lX2Z1bGxdLnRpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiB0aW1lX2Z1bGwgPyB0aW1lX2Z1bGwgOiBhY2NbdGltZV9mdWxsXS50aW1lX2Z1bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzX3RpbWU6IGNhdGVnb3JpZXNfdGltZSA/IGNhdGVnb3JpZXNfdGltZSA6IGFjY1t0aW1lX2Z1bGxdLmNhdGVnb3JpZXNfdGltZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogYWN0aXZlRW5lcmd5ID8gYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneVJhdGUxOiBhY3RpdmVFbmVyZ3lSYXRlMSA/IGFjdGl2ZUVuZXJneVJhdGUxIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneVJhdGUyOiBhY3RpdmVFbmVyZ3lSYXRlMiA/IGFjdGl2ZUVuZXJneVJhdGUyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneVJhdGUzOiBhY3RpdmVFbmVyZ3lSYXRlMyA/IGFjdGl2ZUVuZXJneVJhdGUzIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VBY3RpdmVFbmVyZ3k6IHJldmVyc2VBY3RpdmVFbmVyZ3kgPyByZXZlcnNlQWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VBY3RpdmVFbmVyZ3lSYXRlMTogcmV2ZXJzZUFjdGl2ZUVuZXJneVJhdGUxID8gcmV2ZXJzZUFjdGl2ZUVuZXJneVJhdGUxIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VBY3RpdmVFbmVyZ3lSYXRlMjogcmV2ZXJzZUFjdGl2ZUVuZXJneVJhdGUyID8gcmV2ZXJzZUFjdGl2ZUVuZXJneVJhdGUyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldmVyc2VBY3RpdmVFbmVyZ3lSYXRlMzogcmV2ZXJzZUFjdGl2ZUVuZXJneVJhdGUzID8gcmV2ZXJzZUFjdGl2ZUVuZXJneVJhdGUzIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlOiByZWFjdGl2ZUVuZXJneUluZHVjdGl2ZSA/IHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTE6IHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTEgPyByZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUxIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTI6IHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTIgPyByZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTM6IHJlYWN0aXZlRW5lcmd5SW5kdWN0aXZlUmF0ZTMgPyByZWFjdGl2ZUVuZXJneUluZHVjdGl2ZVJhdGUzIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZTogcmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlID8gcmVhY3RpdmVFbmVyZ3lDYXBhY2l0aXZlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUxOiByZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMSA/IHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUxIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUyOiByZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMiA/IHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUzOiByZWFjdGl2ZUVuZXJneUNhcGFjaXRpdmVSYXRlMyA/IHJlYWN0aXZlRW5lcmd5Q2FwYWNpdGl2ZVJhdGUzIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUE6IGN1cnJlbnRQaGFzZUEgPyBjdXJyZW50UGhhc2VBIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRQaGFzZUI6IGN1cnJlbnRQaGFzZUI/IGN1cnJlbnRQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFBoYXNlQzogY3VycmVudFBoYXNlQyA/IGN1cnJlbnRQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQTogdm9sdGFnZVBoYXNlQSA/IHZvbHRhZ2VQaGFzZUEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQjogdm9sdGFnZVBoYXNlQiA/IHZvbHRhZ2VQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdGFnZVBoYXNlQzogdm9sdGFnZVBoYXNlQyA/IHZvbHRhZ2VQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGcmVxdWVuY3k6IHBvd2VyRnJlcXVlbmN5ID8gcG93ZXJGcmVxdWVuY3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXI6IGFjdGl2ZVBvd2VyID8gYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZUFjdGl2ZVBvd2VyOiByZXZlcnNlQWN0aXZlUG93ZXIgPyByZXZlcnNlQWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVQb3dlcjogcmVhY3RpdmVQb3dlciA/IHJlYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZVJlYWN0aXZlUG93ZXI6IHJldmVyc2VSZWFjdGl2ZVBvd2VyID8gcmV2ZXJzZVJlYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3I6IHBvd2VyRmFjdG9yID8gcG93ZXJGYWN0b3IgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXJQaGFzZUE6IGFjdGl2ZVBvd2VyUGhhc2VBID8gYWN0aXZlUG93ZXJQaGFzZUEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXJQaGFzZUI6IGFjdGl2ZVBvd2VyUGhhc2VCID8gYWN0aXZlUG93ZXJQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXJQaGFzZUM6IGFjdGl2ZVBvd2VyUGhhc2VDID8gYWN0aXZlUG93ZXJQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZUFjdGl2ZVBvd2VyUGhhc2VBOiByZXZlcnNlQWN0aXZlUG93ZXJQaGFzZUEgPyByZXZlcnNlQWN0aXZlUG93ZXJQaGFzZUEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZUFjdGl2ZVBvd2VyUGhhc2VCOiByZXZlcnNlQWN0aXZlUG93ZXJQaGFzZUIgPyByZXZlcnNlQWN0aXZlUG93ZXJQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZUFjdGl2ZVBvd2VyUGhhc2VDOiByZXZlcnNlQWN0aXZlUG93ZXJQaGFzZUMgPyByZXZlcnNlQWN0aXZlUG93ZXJQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVQb3dlclBoYXNlQTogcmVhY3RpdmVQb3dlclBoYXNlQSA/ICByZWFjdGl2ZVBvd2VyUGhhc2VBOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVQb3dlclBoYXNlQjogcmVhY3RpdmVQb3dlclBoYXNlQiA/IHJlYWN0aXZlUG93ZXJQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhY3RpdmVQb3dlclBoYXNlQzogcmVhY3RpdmVQb3dlclBoYXNlQyA/IHJlYWN0aXZlUG93ZXJQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZVJlYWN0aXZlUG93ZXJQaGFzZUE6IHJldmVyc2VSZWFjdGl2ZVBvd2VyUGhhc2VBID8gcmV2ZXJzZVJlYWN0aXZlUG93ZXJQaGFzZUEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZVJlYWN0aXZlUG93ZXJQaGFzZUI6IHJldmVyc2VSZWFjdGl2ZVBvd2VyUGhhc2VCID8gcmV2ZXJzZVJlYWN0aXZlUG93ZXJQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV2ZXJzZVJlYWN0aXZlUG93ZXJQaGFzZUM6IHJldmVyc2VSZWFjdGl2ZVBvd2VyUGhhc2VDID8gcmV2ZXJzZVJlYWN0aXZlUG93ZXJQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3JQaGFzZUE6IHBvd2VyRmFjdG9yUGhhc2VBID8gcG93ZXJGYWN0b3JQaGFzZUEgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3JQaGFzZUI6IHBvd2VyRmFjdG9yUGhhc2VCID8gcG93ZXJGYWN0b3JQaGFzZUIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJGYWN0b3JQaGFzZUM6IHBvd2VyRmFjdG9yUGhhc2VDID8gcG93ZXJGYWN0b3JQaGFzZUMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Q1RyYXRpb1ByaW1hcnk6IENUcmF0aW9QcmltYXJ5ID8gQ1RyYXRpb1ByaW1hcnkgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Q1RyYXRpb1NlY29uZGFyeTogQ1RyYXRpb1NlY29uZGFyeSA/IENUcmF0aW9TZWNvbmRhcnkgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0UFRyYXRpb1ByaW1hcnk6IFBUcmF0aW9QcmltYXJ5ID8gUFRyYXRpb1ByaW1hcnkgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0UFRyYXRpb1NlY29uZGFyeTogUFRyYXRpb1NlY29uZGFyeSA/IFBUcmF0aW9TZWNvbmRhcnk6IG51bGxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0sIHt9KSk7XHJcblx0XHRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5kYXRhID0gZGF0YUVuZXJneTU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRjYXNlICd0aGlzX21vbnRoJzpcclxuXHRcdFx0XHRcdFx0XHRjYXNlICdsYXN0X21vbnRoJzpcclxuXHRcdFx0XHRcdFx0XHRjYXNlICcxMl9tb250aCc6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbGlmZXRpbWUnOlxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YURldmljZVtpXS5kYXRhID0gZGF0YUVuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGRhdGEucHVzaChkYXRhRGV2aWNlW2ldKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGEpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0aWYgKGNvbm4pIHtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblxyXG5cdC8qKlxyXG5cdCogZ2V0IGRldGFpbCBwcm9qZWN0IHBhZ2UgQ2xpZW50IEFuYWx5dGljc1xyXG5cdCogQHBhcmFtIHsqfSBkYXRhIFxyXG5cdCogQHBhcmFtIHsqfSBjYWxsQmFjayBcclxuXHQqL1xyXG5cclxuXHRnZXRDaGFydEFsYXJtKHBhcmFtLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgcnMgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIkNsaWVudEFuYWx5dGljcy5nZXREZXRhaWxcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIFRvdGFsIEZsZWV0IEFsZXJ0c1xyXG5cdFx0XHRcdFx0cGFyYW0uaWRfcHJvamVjdCA9IHJzLmlkO1xyXG5cdFx0XHRcdFx0cnMudG90YWxGbGVldEFsYXJtID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiQ2xpZW50QW5hbHl0aWNzLnRvdGFsRmxlZXRBbGFybVwiLCBwYXJhbSk7XHJcblxyXG5cdFx0XHRcdFx0cnMuYWxhcm1PUGVuZWQgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnRBbmFseXRpY3MuYWxhcm1PUGVuZWRcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0dmFyIGFsYXJtTGFzdDEyTW9udGggPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJDbGllbnRBbmFseXRpY3MuYWxhcm1MYXN0MTJNb250aFwiLCBwYXJhbSk7XHJcblxyXG5cdFx0XHRcdFx0dmFyIGRhdGFBbGFybU1vbnRoID0gW107XHJcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMTE7IGkgPj0gMDsgaS0tKSB7XHJcblx0XHRcdFx0XHRcdGRhdGFBbGFybU1vbnRoLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogbW9tZW50KCkuYWRkKC1pLCAnTScpLmZvcm1hdCgnTU0vWVlZWScpLFxyXG5cdFx0XHRcdFx0XHRcdHRvdGFsX2FsYXJtOiAwXHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRkYXRhQWxhcm1Nb250aCA9IE9iamVjdC52YWx1ZXMoWy4uLmRhdGFBbGFybU1vbnRoLCAuLi5hbGFybUxhc3QxMk1vbnRoXS5yZWR1Y2UoKGFjYywgeyB0aW1lX2Z1bGwsIHRvdGFsX2FsYXJtIH0pID0+IHtcclxuXHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0dGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdHRvdGFsX2FsYXJtOiAoYWNjW3RpbWVfZnVsbF0gPyBhY2NbdGltZV9mdWxsXS50b3RhbF9hbGFybSA6IDApICsgdG90YWxfYWxhcm0sXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cclxuXHRcdFx0XHRcdHJzLmFsYXJtTGFzdDEyTW9udGggPSBkYXRhQWxhcm1Nb250aDtcclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgcnMpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0aWYgKGNvbm4pIHtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50QW5hbHl0aWNzU2VydmljZTtcclxuIl19