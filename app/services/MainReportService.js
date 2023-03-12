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

var MainReportService = function (_BaseService) {
	_inherits(MainReportService, _BaseService);

	function MainReportService() {
		_classCallCheck(this, MainReportService);

		return _possibleConstructorReturn(this, (MainReportService.__proto__ || Object.getPrototypeOf(MainReportService)).call(this));
	}

	/**
 * get detail project page Client Analytics
 * @param {*} data 
 * @param {*} callBack 
 */


	_createClass(MainReportService, [{
		key: 'getDataDailyReportEmail',
		value: function getDataDailyReportEmail(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var listUser = await db.queryForList("MainReport.getListUserDailyReport", {});

						if (listUser.length > 0) {
							// Get list alarm by ids_project
							for (var i = 0; i < listUser.length; i++) {
								var alerts = [];
								if (!Libs.isBlank(listUser[i].ids_project)) {
									var idsProjectString = listUser[i].ids_project;
									var idsProject = idsProjectString.split(",");
									if (idsProject.length > 0) {
										alerts = await db.queryForList("MainReport.getAlertsDailyReport", { idsProject: idsProject });
									}
								}
								listUser[i].alerts = alerts;
							}
						}

						conn.commit();
						callBack(false, listUser);
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
		key: 'getDataReportMonthEmail',
		value: function getDataReportMonthEmail(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var data = [];
						var listProject = await db.queryForList("MainReport.getListProject", {});
						var itemProject = {};
						if (listProject.length > 0) {
							for (var i = 0; i < listProject.length; i++) {
								itemProject = listProject[i];

								// Get data group inverter
								var dataGroupInverter = await db.queryForList("MainReport.getDataGroupInverter", itemProject);

								var groupInverter = [];
								if (dataGroupInverter.length > 0) {
									for (var _i = 0, len = dataGroupInverter.length; _i < len; _i++) {
										groupInverter.push({
											hash_id: itemProject.hash_id,
											id_device_group: dataGroupInverter[_i].id_device_group,
											table_name: dataGroupInverter[_i].table_name
										});
									}
								}

								var dataEnergyMonth = [];
								if (!Libs.isBlank(itemProject.last_day)) {
									for (var _i2 = 1; _i2 <= parseInt(itemProject.last_day); _i2++) {
										dataEnergyMonth.push({
											time_format: '',
											time_full: '',
											category_time_format: '',
											last_day: '',
											day: _i2,
											activePower: 0,
											activeEnergy: 0,
											max_activeEnergy: 0,
											min_activeEnergy: 0
										});
									}
								}

								// get data energy by month
								if (groupInverter.length > 0) {
									var dataEnergy = await db.queryForList("MainReport.dataEnergyMonthEmail", { groupInverter: groupInverter });
									if (dataEnergy) {
										dataEnergyMonth = Object.values([].concat(_toConsumableArray(dataEnergyMonth), _toConsumableArray(dataEnergy)).reduce(function (acc, _ref) {
											var time_format = _ref.time_format,
											    time_full = _ref.time_full,
											    category_time_format = _ref.category_time_format,
											    last_day = _ref.last_day,
											    day = _ref.day,
											    activePower = _ref.activePower,
											    activeEnergy = _ref.activeEnergy,
											    max_activeEnergy = _ref.max_activeEnergy,
											    min_activeEnergy = _ref.min_activeEnergy;

											acc[day] = {
												time_format: time_format,
												time_full: time_full,
												category_time_format: category_time_format,
												last_day: last_day,
												day: day,
												activePower: activePower,
												activeEnergy: activeEnergy,
												max_activeEnergy: max_activeEnergy,
												min_activeEnergy: min_activeEnergy
											};
											return acc;
										}, {}));
									}
									itemProject.dataEnergyMonth = dataEnergyMonth;

									var energyMonth = dataEnergyMonth.reduce(function (a, b) {
										return {
											activeEnergy: a.activeEnergy + b.activeEnergy,
											max_activeEnergy: Libs.roundNumber(a.max_activeEnergy + b.max_activeEnergy, 1),
											min_activeEnergy: Libs.roundNumber(a.min_activeEnergy + b.min_activeEnergy, 1)
										};
									});

									itemProject.energyMonth = !Libs.isObjectEmpty(energyMonth) ? energyMonth.activeEnergy : 0;
									itemProject.max_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.max_activeEnergy : 0;
									itemProject.min_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.min_activeEnergy : 0;
									itemProject.revenue = Libs.formatNum(energyMonth.activeEnergy * itemProject.config_revenue, '#,###');
								}

								// Get list alert
								var alerts = await db.queryForList("MainReport.getDataAlertReportMonth", itemProject);
								itemProject.alerts = alerts;
								data.push(itemProject);
							}
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
		key: 'getDataReportYearEmail',
		value: function getDataReportYearEmail(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var data = [];

						var year = (0, _moment2.default)().format('YYYY');
						var startDateOfTheYear = (0, _moment2.default)([year]).format('YYYY-MM-DD hh:mm:ss');
						var endDateOfTheYear = (0, _moment2.default)([year]).endOf('year').format('YYYY-MM-DD hh:mm:ss');
						param.start_date = startDateOfTheYear;
						param.end_date = endDateOfTheYear;
						var listProject = await db.queryForList("MainReport.getListProjectYearEmail", param);
						var itemProject = {};

						if (listProject.length > 0) {
							for (var i = 0; i < listProject.length; i++) {
								itemProject = listProject[i];
								itemProject.start_date = startDateOfTheYear;
								itemProject.end_date = endDateOfTheYear;

								// Get data group inverter
								var dataGroupInverter = await db.queryForList("MainReport.getDataGroupInverter", itemProject);
								var groupInverter = [];
								if (dataGroupInverter.length > 0) {
									for (var _i3 = 0, len = dataGroupInverter.length; _i3 < len; _i3++) {
										groupInverter.push({
											hash_id: itemProject.hash_id,
											id_device_group: dataGroupInverter[_i3].id_device_group,
											start_date: itemProject.start_date,
											end_date: itemProject.end_date,
											table_name: dataGroupInverter[_i3].table_name
										});
									}
								}

								var getTotalFeetAlarms = await db.queryForList("MainReport.getTotalFeetAlarms", itemProject);
								itemProject.totalFeetAlarms = getTotalFeetAlarms;

								// get data alerts
								var alerts = await db.queryForList("MainReport.getListAlarmYearEmail", itemProject);
								var dataAlerts = [];
								for (var _i4 = 11; _i4 >= 0; _i4--) {
									dataAlerts.push({
										time_full: (0, _moment2.default)(itemProject.end_date).add(-_i4, 'M').format('MM/YYYY'),
										total_alarm: 0
									});
								}
								dataAlerts = Object.values([].concat(_toConsumableArray(dataAlerts), _toConsumableArray(alerts)).reduce(function (acc, _ref2) {
									var time_full = _ref2.time_full,
									    total_alarm = _ref2.total_alarm;

									acc[time_full] = {
										time_full: time_full,
										total_alarm: (acc[time_full] ? acc[time_full].total_alarm : 0) + total_alarm
									};
									return acc;
								}, {}));

								itemProject.dataAlerts = dataAlerts;

								// Get data energy
								var dataConfigEstimate = await db.queryForObject("MainReport.getConfigEstimate", itemProject);
								var dataEnergyMonth = [];
								if (!Libs.isBlank(itemProject.last_day)) {
									for (var _i5 = 1; _i5 <= parseInt(12); _i5++) {
										var estimate_energy = null;
										if (dataConfigEstimate) {
											switch (_i5) {
												case 1:
													estimate_energy = dataConfigEstimate['jan'];
													break;
												case 2:
													estimate_energy = dataConfigEstimate['feb'];
													break;
												case 3:
													estimate_energy = dataConfigEstimate['mar'];
													break;
												case 4:
													estimate_energy = dataConfigEstimate['apr'];
													break;
												case 5:
													estimate_energy = dataConfigEstimate['may'];
													break;
												case 6:
													estimate_energy = dataConfigEstimate['jun'];
													break;
												case 7:
													estimate_energy = dataConfigEstimate['jul'];
													break;
												case 8:
													estimate_energy = dataConfigEstimate['aug'];
													break;
												case 9:
													estimate_energy = dataConfigEstimate['sep'];
													break;
												case 10:
													estimate_energy = dataConfigEstimate['oct'];
													break;
												case 11:
													estimate_energy = dataConfigEstimate['nov'];
													break;
												case 12:
													estimate_energy = dataConfigEstimate['dec'];
													break;
											}
										}
										dataEnergyMonth.push({
											time_format: '',
											time_full: (_i5 < 10 ? '0' + _i5 : _i5) + "/" + itemProject.year,
											category_time_format: '',
											last_day: '',
											month: _i5,
											activePower: null,
											activeEnergy: 0,
											estimate_energy: estimate_energy,
											month_str: null,
											diff_energy: null,
											diff_percent: null,
											sum_activeEnergy: null,
											sum_estimate_energy: null,
											sum_diff_energy: null,
											sum_diff_percent: null

										});
									}
								}

								var dataEnergy = await db.queryForList("MainReport.dataEnergyYear", { groupInverter: groupInverter });

								if (dataEnergy) {
									dataEnergyMonth = Object.values([].concat(_toConsumableArray(dataEnergyMonth), _toConsumableArray(dataEnergy)).reduce(function (acc, _ref3) {
										var time_format = _ref3.time_format,
										    time_full = _ref3.time_full,
										    category_time_format = _ref3.category_time_format,
										    month = _ref3.month,
										    activePower = _ref3.activePower,
										    activeEnergy = _ref3.activeEnergy,
										    month_str = _ref3.month_str,
										    estimate_energy = _ref3.estimate_energy;

										acc[month] = {
											time_format: time_format,
											time_full: time_full,
											category_time_format: category_time_format,
											month: month,
											activePower: activePower,
											activeEnergy: activeEnergy,
											month_str: month_str,
											estimate_energy: (acc[month] ? acc[month].estimate_energy : 0) + estimate_energy
										};
										return acc;
									}, {}));
								}

								var totalEnergy = 0,
								    pr = 0,
								    totalEstimate = 0;

								if (Libs.isArrayData(dataEnergyMonth)) {
									var length = 0;
									if (itemProject.year == (0, _moment2.default)().format('YYYY')) {
										length = (0, _moment2.default)().format('MM');
									} else {
										length = dataEnergyMonth.length;
									}

									for (var j = 0, _len = dataEnergyMonth.length; j < _len; j++) {
										totalEnergy = totalEnergy + dataEnergyMonth[j].activeEnergy;
										totalEstimate = totalEstimate + dataEnergyMonth[j].estimate_energy;
										if (!Libs.isBlank(dataEnergyMonth[j].estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].activeEnergy) && dataEnergyMonth[j].estimate_energy > 0 && dataEnergyMonth[j].activeEnergy > 0) {
											var diffEnergy = dataEnergyMonth[j].activeEnergy - dataEnergyMonth[j].estimate_energy;
											dataEnergyMonth[j].diff_energy = Libs.roundNumber(diffEnergy, 0);
											dataEnergyMonth[j].diff_percent = Libs.roundNumber(diffEnergy / dataEnergyMonth[j].activeEnergy * 100, 1);
										} else {
											dataEnergyMonth[j].diff_energy = null;
											dataEnergyMonth[j].diff_percent = null;
										}

										// Tinh tich luy
										if (j == 0) {
											dataEnergyMonth[j].sum_activeEnergy = dataEnergyMonth[j].activeEnergy;
											dataEnergyMonth[j].sum_estimate_energy = dataEnergyMonth[j].estimate_energy;

											if (!Libs.isBlank(dataEnergyMonth[j].estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].activeEnergy) && dataEnergyMonth[j].estimate_energy > 0 && dataEnergyMonth[j].activeEnergy > 0) {
												var _diffEnergy = dataEnergyMonth[j].sum_activeEnergy - dataEnergyMonth[j].sum_estimate_energy;
												dataEnergyMonth[j].sum_diff_energy = Libs.roundNumber(_diffEnergy, 0);
												dataEnergyMonth[j].sum_diff_percent = Libs.roundNumber(_diffEnergy / dataEnergyMonth[j].activeEnergy * 100, 1);
											} else {
												dataEnergyMonth[j].sum_diff_energy = null;
												dataEnergyMonth[j].sum_diff_percent = null;
											}
										} else {
											dataEnergyMonth[j].sum_activeEnergy = dataEnergyMonth[j - 1].sum_activeEnergy + dataEnergyMonth[j].activeEnergy == 0 ? 0 : Libs.roundNumber(dataEnergyMonth[j - 1].sum_activeEnergy + dataEnergyMonth[j].activeEnergy, 0);
											dataEnergyMonth[j].sum_estimate_energy = dataEnergyMonth[j - 1].sum_estimate_energy + dataEnergyMonth[j].estimate_energy == 0 ? 0 : Libs.roundNumber(dataEnergyMonth[j - 1].sum_estimate_energy + dataEnergyMonth[j].estimate_energy, 0);
											if (!Libs.isBlank(dataEnergyMonth[j].sum_estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].sum_activeEnergy) && dataEnergyMonth[j].sum_estimate_energy > 0 && dataEnergyMonth[j].sum_activeEnergy > 0) {

												var _diffEnergy2 = dataEnergyMonth[j].sum_activeEnergy - dataEnergyMonth[j].sum_estimate_energy;
												dataEnergyMonth[j].sum_diff_energy = Libs.roundNumber(_diffEnergy2, 0);
												dataEnergyMonth[j].sum_diff_percent = Libs.roundNumber(_diffEnergy2 / dataEnergyMonth[j].sum_activeEnergy * 100, 1);
											} else {
												dataEnergyMonth[j].sum_diff_energy = null;
												dataEnergyMonth[j].sum_diff_percent = null;
											}
										}
									}
								}

								itemProject.totalEnergy = Libs.roundNumber(totalEnergy, 1);
								itemProject.totalEstimate = Libs.roundNumber(totalEstimate, 1);
								itemProject.pr = Libs.roundNumber(totalEnergy / totalEstimate, 2);
								itemProject.dataEnergyMonth = dataEnergyMonth;
								data.push(itemProject);

								// var groupInverter = [];
								// if (dataGroupInverter.length > 0) {
								// 	for (let i = 0, len = dataGroupInverter.length; i < len; i++) {
								// 		groupInverter.push(
								// 			{
								// 				hash_id: itemProject.hash_id,
								// 				id_device_group: dataGroupInverter[i].id_device_group,
								// 				table_name: dataGroupInverter[i].table_name
								// 			}
								// 		);
								// 	}
								// }

								// var dataEnergyMonth = [];
								// if (!Libs.isBlank(itemProject.last_day)) {
								// 	for (let i = 1; i <= parseInt(itemProject.last_day); i++) {
								// 		dataEnergyMonth.push({
								// 			time_format: '',
								// 			time_full: '',
								// 			category_time_format: '',
								// 			last_day: '',
								// 			day: i,
								// 			activePower: 0,
								// 			activeEnergy: 0,
								// 			max_activeEnergy: 0,
								// 			min_activeEnergy: 0
								// 		});
								// 	}
								// }

								// // get data energy by month
								// if (groupInverter.length > 0) {
								// 	var dataEnergy = await db.queryForList("MainReport.dataEnergyMonthEmail", { groupInverter });
								// 	if (dataEnergy) {
								// 		dataEnergyMonth = Object.values([...dataEnergyMonth, ...dataEnergy].reduce((acc, { time_format, time_full, category_time_format, last_day, day, activePower, activeEnergy, max_activeEnergy, min_activeEnergy }) => {
								// 			acc[day] = {
								// 				time_format,
								// 				time_full,
								// 				category_time_format,
								// 				last_day,
								// 				day,
								// 				activePower,
								// 				activeEnergy,
								// 				max_activeEnergy,
								// 				min_activeEnergy
								// 			};
								// 			return acc;
								// 		}, {}));
								// 	}
								// 	itemProject.dataEnergyMonth = dataEnergyMonth;

								// 	let energyMonth = dataEnergyMonth.reduce(function (a, b) {
								// 		return {
								// 			activeEnergy: a.activeEnergy + b.activeEnergy,
								// 			max_activeEnergy: Libs.roundNumber((a.max_activeEnergy + b.max_activeEnergy), 1),
								// 			min_activeEnergy: Libs.roundNumber((a.min_activeEnergy + b.min_activeEnergy), 1)
								// 		};
								// 	});

								// 	itemProject.energyMonth = !Libs.isObjectEmpty(energyMonth) ? energyMonth.activeEnergy: 0;
								// 	itemProject.max_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.max_activeEnergy: 0;
								// 	itemProject.min_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.min_activeEnergy: 0;
								// 	itemProject.revenue = Libs.formatNum((energyMonth.activeEnergy * itemProject.config_revenue), '#,###');

								// }

								// // Get list alert
								// var alerts = await db.queryForList("MainReport.getDataAlertReportMonth", itemProject);
								// itemProject.alerts = alerts;
								// data.push(itemProject);
							}
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
		key: 'getDataReportMonth',
		value: function getDataReportMonth(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						param.start_date = Libs.convertAllFormatDate(param.start_date);
						param.end_date = Libs.convertAllFormatDate(param.end_date);
						var rs = await db.queryForList("MainReport.getDataReportMonth", param);
						if (!rs) {
							conn.rollback();
							callBack(true, {});
							return;
						}

						var data = rs[0][0];
						var groupInverter = [];
						var getGroupInverter = rs[1];
						if (getGroupInverter.length > 0) {
							for (var i = 0, len = getGroupInverter.length; i < len; i++) {
								groupInverter.push({
									hash_id: param.hash_id,
									id_device_group: getGroupInverter[i].id_device_group,
									start_date: param.start_date,
									end_date: param.end_date,
									table_name: getGroupInverter[i].table_name
								});
							}
						}

						var dataEnergyMonth = [];
						if (!Libs.isBlank(data.last_day)) {
							for (var _i6 = 1; _i6 <= parseInt(data.last_day); _i6++) {
								dataEnergyMonth.push({
									time_format: '',
									time_full: '',
									category_time_format: '',
									last_day: '',
									day: _i6,
									activePower: 0,
									activeEnergy: 0,
									max_activeEnergy: 0,
									min_activeEnergy: 0
								});
							}
						}

						var dataEnergy = await db.queryForList("MainReport.dataEnergyMonth", { groupInverter: groupInverter });

						if (dataEnergy) {
							dataEnergyMonth = Object.values([].concat(_toConsumableArray(dataEnergyMonth), _toConsumableArray(dataEnergy)).reduce(function (acc, _ref4) {
								var time_format = _ref4.time_format,
								    time_full = _ref4.time_full,
								    category_time_format = _ref4.category_time_format,
								    last_day = _ref4.last_day,
								    day = _ref4.day,
								    activePower = _ref4.activePower,
								    activeEnergy = _ref4.activeEnergy,
								    max_activeEnergy = _ref4.max_activeEnergy,
								    min_activeEnergy = _ref4.min_activeEnergy;

								acc[day] = {
									time_format: time_format,
									time_full: time_full,
									category_time_format: category_time_format,
									last_day: last_day,
									day: day,
									activePower: activePower,
									activeEnergy: activeEnergy,
									max_activeEnergy: max_activeEnergy,
									min_activeEnergy: min_activeEnergy
								};
								return acc;
							}, {}));
						}

						var energyMonth = dataEnergyMonth.reduce(function (a, b) {
							return {
								activeEnergy: a.activeEnergy + b.activeEnergy,
								max_activeEnergy: Libs.roundNumber(a.max_activeEnergy + b.max_activeEnergy, 1),
								min_activeEnergy: Libs.roundNumber(a.min_activeEnergy + b.min_activeEnergy, 1)
							};
						});

						data.energyMonth = !Libs.isObjectEmpty(energyMonth) ? energyMonth.activeEnergy : 0;
						data.max_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.max_activeEnergy : 0;
						data.min_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.min_activeEnergy : 0;
						data.revenue = Libs.formatNum(energyMonth.activeEnergy * data.config_revenue, '#,###');

						data.dataEnergyMonth = dataEnergyMonth;
						data.alarmOPened = rs[2];
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
		key: 'getDataReportYear',
		value: function getDataReportYear(param, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						// if (param.type == 1) {
						// 	var year = param.end_date.substr(-4);
						// 	var startDateOfTheYear = moment([year]).format('YYYY-MM-DD hh:mm:ss');
						// 	var endDateOfTheYear = moment([year]).endOf('year').format('YYYY-MM-DD hh:mm:ss');
						// 	param.start_date = startDateOfTheYear;
						// 	param.end_date = endDateOfTheYear;
						// } else {
						// 	param.start_date = Libs.convertAllFormatDate(param.start_date);
						// 	param.end_date = Libs.convertAllFormatDate(param.end_date);
						// }

						param.start_date = Libs.convertAllFormatDate(param.start_date);
						param.end_date = Libs.convertAllFormatDate(param.end_date);
						var startDate = param.start_date;
						var endDate = param.end_date;
						var months = (0, _moment2.default)(endDate).diff(startDate, 'months');

						var rs = await db.queryForList("MainReport.getDataReportYear", param);
						if (!rs) {
							conn.rollback();
							callBack(true, {});
							return;
						}

						var data = rs[0][0];
						var groupInverter = [];
						var getGroupInverter = rs[1];
						if (getGroupInverter.length > 0) {
							for (var i = 0, len = getGroupInverter.length; i < len; i++) {
								groupInverter.push({
									hash_id: param.hash_id,
									id_device_group: getGroupInverter[i].id_device_group,
									start_date: param.start_date,
									end_date: param.end_date,
									table_name: getGroupInverter[i].table_name
								});
							}
						}

						data.totalFeetAlarms = rs[2];
						var dataAlarms = rs[3];
						var dataAlerts = [];

						for (var _i7 = 0; _i7 <= parseInt(months); _i7++) {
							dataAlerts.push({
								time_full: (0, _moment2.default)(param.start_date).add(_i7, 'M').format('MM/YYYY'),
								total_alarm: 0
							});
						}

						dataAlerts = Object.values([].concat(_toConsumableArray(dataAlerts), _toConsumableArray(dataAlarms)).reduce(function (acc, _ref5) {
							var time_full = _ref5.time_full,
							    total_alarm = _ref5.total_alarm;

							acc[time_full] = {
								time_full: time_full,
								total_alarm: (acc[time_full] ? acc[time_full].total_alarm : 0) + total_alarm
							};
							return acc;
						}, {}));

						data.dataAlarms = dataAlerts;

						var dataConfigEstimate = rs[4].length > 0 ? rs[4][0] : {};
						var dataEnergyMonth = [];

						if (!Libs.isBlank(data.last_day)) {
							for (var _i8 = 0; _i8 <= parseInt(months); _i8++) {
								var estimate_energy = null;
								var n = _i8 + 1;
								if (dataConfigEstimate) {
									switch (n) {
										case 1:
											estimate_energy = dataConfigEstimate['jan'];
											break;
										case 2:
											estimate_energy = dataConfigEstimate['feb'];
											break;
										case 3:
											estimate_energy = dataConfigEstimate['mar'];
											break;
										case 4:
											estimate_energy = dataConfigEstimate['apr'];
											break;
										case 5:
											estimate_energy = dataConfigEstimate['may'];
											break;
										case 6:
											estimate_energy = dataConfigEstimate['jun'];
											break;
										case 7:
											estimate_energy = dataConfigEstimate['jul'];
											break;
										case 8:
											estimate_energy = dataConfigEstimate['aug'];
											break;
										case 9:
											estimate_energy = dataConfigEstimate['sep'];
											break;
										case 10:
											estimate_energy = dataConfigEstimate['oct'];
											break;
										case 11:
											estimate_energy = dataConfigEstimate['nov'];
											break;
										case 12:
											estimate_energy = dataConfigEstimate['dec'];
											break;
									}
								}

								dataEnergyMonth.push({
									time_format: '',
									time_full: (0, _moment2.default)(param.start_date).add(_i8, 'M').format('MM/YYYY'),
									category_time_format: '',
									last_day: '',
									month: (0, _moment2.default)(param.start_date).add(_i8, 'M').format('MM/YYYY'),
									activePower: null,
									activeEnergy: 0,
									estimate_energy: estimate_energy,
									month_str: null,
									diff_energy: null,
									diff_percent: null,
									sum_activeEnergy: null,
									sum_estimate_energy: null,
									sum_diff_energy: null,
									sum_diff_percent: null,
									max_activeEnergy: 0,
									min_activeEnergy: 0

								});
							}
						}

						var dataEnergy = await db.queryForList("MainReport.dataEnergyYear", { groupInverter: groupInverter });

						if (dataEnergy) {
							dataEnergyMonth = Object.values([].concat(_toConsumableArray(dataEnergyMonth), _toConsumableArray(dataEnergy)).reduce(function (acc, _ref6) {
								var time_format = _ref6.time_format,
								    time_full = _ref6.time_full,
								    category_time_format = _ref6.category_time_format,
								    month = _ref6.month,
								    activePower = _ref6.activePower,
								    activeEnergy = _ref6.activeEnergy,
								    month_str = _ref6.month_str,
								    estimate_energy = _ref6.estimate_energy,
								    max_activeEnergy = _ref6.max_activeEnergy,
								    min_activeEnergy = _ref6.min_activeEnergy;

								acc[time_full] = {
									time_format: time_format,
									time_full: time_full,
									category_time_format: category_time_format,
									month: month,
									activePower: activePower,
									activeEnergy: activeEnergy,
									month_str: month_str,
									estimate_energy: (acc[time_full] ? acc[time_full].estimate_energy : 0) + estimate_energy,
									max_activeEnergy: max_activeEnergy,
									min_activeEnergy: min_activeEnergy
								};
								return acc;
							}, {}));
						}

						if (Libs.isArrayData(dataEnergyMonth)) {
							for (var j = 0, _len2 = dataEnergyMonth.length; j < _len2; j++) {
								if (!Libs.isBlank(dataEnergyMonth[j].estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].activeEnergy) && dataEnergyMonth[j].estimate_energy > 0 && dataEnergyMonth[j].activeEnergy > 0) {
									var diffEnergy = dataEnergyMonth[j].activeEnergy - dataEnergyMonth[j].estimate_energy;
									dataEnergyMonth[j].diff_energy = Libs.roundNumber(diffEnergy, 0);
									dataEnergyMonth[j].diff_percent = Libs.roundNumber(diffEnergy / dataEnergyMonth[j].activeEnergy * 100, 1);
								} else {
									dataEnergyMonth[j].diff_energy = null;
									dataEnergyMonth[j].diff_percent = null;
								}

								// Tinh tich luy
								if (j == 0) {
									dataEnergyMonth[j].sum_activeEnergy = dataEnergyMonth[j].activeEnergy;
									dataEnergyMonth[j].sum_estimate_energy = dataEnergyMonth[j].estimate_energy;

									if (!Libs.isBlank(dataEnergyMonth[j].estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].activeEnergy) && dataEnergyMonth[j].estimate_energy > 0 && dataEnergyMonth[j].activeEnergy > 0) {
										var _diffEnergy3 = dataEnergyMonth[j].sum_activeEnergy - dataEnergyMonth[j].sum_estimate_energy;
										dataEnergyMonth[j].sum_diff_energy = Libs.roundNumber(_diffEnergy3, 0);
										dataEnergyMonth[j].sum_diff_percent = Libs.roundNumber(_diffEnergy3 / dataEnergyMonth[j].activeEnergy * 100, 1);
									} else {
										dataEnergyMonth[j].sum_diff_energy = null;
										dataEnergyMonth[j].sum_diff_percent = null;
									}
								} else {
									dataEnergyMonth[j].sum_activeEnergy = dataEnergyMonth[j - 1].sum_activeEnergy + dataEnergyMonth[j].activeEnergy == 0 ? 0 : Libs.roundNumber(dataEnergyMonth[j - 1].sum_activeEnergy + dataEnergyMonth[j].activeEnergy, 0);
									dataEnergyMonth[j].sum_estimate_energy = dataEnergyMonth[j - 1].sum_estimate_energy + dataEnergyMonth[j].estimate_energy == 0 ? 0 : Libs.roundNumber(dataEnergyMonth[j - 1].sum_estimate_energy + dataEnergyMonth[j].estimate_energy, 0);
									if (!Libs.isBlank(dataEnergyMonth[j].sum_estimate_energy) && !Libs.isBlank(dataEnergyMonth[j].sum_activeEnergy) && dataEnergyMonth[j].sum_estimate_energy > 0 && dataEnergyMonth[j].sum_activeEnergy > 0) {

										var _diffEnergy4 = dataEnergyMonth[j].sum_activeEnergy - dataEnergyMonth[j].sum_estimate_energy;
										dataEnergyMonth[j].sum_diff_energy = Libs.roundNumber(_diffEnergy4, 0);
										dataEnergyMonth[j].sum_diff_percent = Libs.roundNumber(_diffEnergy4 / dataEnergyMonth[j].sum_activeEnergy * 100, 1);
									} else {
										dataEnergyMonth[j].sum_diff_energy = null;
										dataEnergyMonth[j].sum_diff_percent = null;
									}
								}
							}
						}

						var energyMonth = dataEnergyMonth.reduce(function (a, b) {
							return {
								activeEnergy: a.activeEnergy + b.activeEnergy,
								max_activeEnergy: Libs.roundNumber(a.max_activeEnergy + b.max_activeEnergy, 1),
								min_activeEnergy: Libs.roundNumber(a.min_activeEnergy + b.min_activeEnergy, 1)
							};
						});

						data.energyMonth = !Libs.isObjectEmpty(energyMonth) ? energyMonth.activeEnergy : 0;
						data.max_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.max_activeEnergy : 0;
						data.min_activeEnergy = !Libs.isObjectEmpty(energyMonth) ? energyMonth.min_activeEnergy : 0;
						data.revenue = Libs.formatNum(energyMonth.activeEnergy * data.config_revenue, '#,###');

						data.dataEnergyMonth = dataEnergyMonth;

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
	}]);

	return MainReportService;
}(_BaseService3.default);

exports.default = MainReportService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9NYWluUmVwb3J0U2VydmljZS5qcyJdLCJuYW1lcyI6WyJNYWluUmVwb3J0U2VydmljZSIsInBhcmFtIiwiY2FsbEJhY2siLCJkYiIsIm15U3FMREIiLCJiZWdpblRyYW5zYWN0aW9uIiwiY29ubiIsImxpc3RVc2VyIiwicXVlcnlGb3JMaXN0IiwibGVuZ3RoIiwiaSIsImFsZXJ0cyIsIkxpYnMiLCJpc0JsYW5rIiwiaWRzX3Byb2plY3QiLCJpZHNQcm9qZWN0U3RyaW5nIiwiaWRzUHJvamVjdCIsInNwbGl0IiwiY29tbWl0IiwiZXJyIiwiY29uc29sZSIsImxvZyIsInJvbGxiYWNrIiwiZGF0YSIsImxpc3RQcm9qZWN0IiwiaXRlbVByb2plY3QiLCJkYXRhR3JvdXBJbnZlcnRlciIsImdyb3VwSW52ZXJ0ZXIiLCJsZW4iLCJwdXNoIiwiaGFzaF9pZCIsImlkX2RldmljZV9ncm91cCIsInRhYmxlX25hbWUiLCJkYXRhRW5lcmd5TW9udGgiLCJsYXN0X2RheSIsInBhcnNlSW50IiwidGltZV9mb3JtYXQiLCJ0aW1lX2Z1bGwiLCJjYXRlZ29yeV90aW1lX2Zvcm1hdCIsImRheSIsImFjdGl2ZVBvd2VyIiwiYWN0aXZlRW5lcmd5IiwibWF4X2FjdGl2ZUVuZXJneSIsIm1pbl9hY3RpdmVFbmVyZ3kiLCJkYXRhRW5lcmd5IiwiT2JqZWN0IiwidmFsdWVzIiwicmVkdWNlIiwiYWNjIiwiZW5lcmd5TW9udGgiLCJhIiwiYiIsInJvdW5kTnVtYmVyIiwiaXNPYmplY3RFbXB0eSIsInJldmVudWUiLCJmb3JtYXROdW0iLCJjb25maWdfcmV2ZW51ZSIsInllYXIiLCJmb3JtYXQiLCJzdGFydERhdGVPZlRoZVllYXIiLCJlbmREYXRlT2ZUaGVZZWFyIiwiZW5kT2YiLCJzdGFydF9kYXRlIiwiZW5kX2RhdGUiLCJnZXRUb3RhbEZlZXRBbGFybXMiLCJ0b3RhbEZlZXRBbGFybXMiLCJkYXRhQWxlcnRzIiwiYWRkIiwidG90YWxfYWxhcm0iLCJkYXRhQ29uZmlnRXN0aW1hdGUiLCJxdWVyeUZvck9iamVjdCIsImVzdGltYXRlX2VuZXJneSIsIm1vbnRoIiwibW9udGhfc3RyIiwiZGlmZl9lbmVyZ3kiLCJkaWZmX3BlcmNlbnQiLCJzdW1fYWN0aXZlRW5lcmd5Iiwic3VtX2VzdGltYXRlX2VuZXJneSIsInN1bV9kaWZmX2VuZXJneSIsInN1bV9kaWZmX3BlcmNlbnQiLCJ0b3RhbEVuZXJneSIsInByIiwidG90YWxFc3RpbWF0ZSIsImlzQXJyYXlEYXRhIiwiaiIsImRpZmZFbmVyZ3kiLCJjb252ZXJ0QWxsRm9ybWF0RGF0ZSIsInJzIiwiZ2V0R3JvdXBJbnZlcnRlciIsImFsYXJtT1BlbmVkIiwic3RhcnREYXRlIiwiZW5kRGF0ZSIsIm1vbnRocyIsImRpZmYiLCJkYXRhQWxhcm1zIiwibiIsIkJhc2VTZXJ2aWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0lBQ01BLGlCOzs7QUFDTCw4QkFBYztBQUFBOztBQUFBO0FBR2I7O0FBR0Q7Ozs7Ozs7OzswQ0FLd0JDLEssRUFBT0MsUSxFQUFVO0FBQ3hDLE9BQUk7QUFDSCxRQUFJQyxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxPQUFHRSxnQkFBSCxDQUFvQixnQkFBZ0JDLElBQWhCLEVBQXNCO0FBQ3pDLFNBQUk7QUFDSCxVQUFJQyxXQUFXLE1BQU1KLEdBQUdLLFlBQUgsQ0FBZ0IsbUNBQWhCLEVBQXFELEVBQXJELENBQXJCOztBQUVBLFVBQUdELFNBQVNFLE1BQVQsR0FBa0IsQ0FBckIsRUFBdUI7QUFDdEI7QUFDQSxZQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsU0FBU0UsTUFBN0IsRUFBcUNDLEdBQXJDLEVBQTBDO0FBQ3pDLFlBQUlDLFNBQVMsRUFBYjtBQUNBLFlBQUcsQ0FBQ0MsS0FBS0MsT0FBTCxDQUFhTixTQUFTRyxDQUFULEVBQVlJLFdBQXpCLENBQUosRUFBMEM7QUFDekMsYUFBSUMsbUJBQW1CUixTQUFTRyxDQUFU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QUFZO0FBQ2JDLGNBQVFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCRixHQUEzQjtBQUNBYixXQUFLZ0IsUUFBTDtBQUNBcEIsZUFBUyxJQUFULEVBQWVpQixHQUFmO0FBQ0E7QUFDRCxLQWxPRDtBQW1PQSxJQXJPRCxDQXFPRSxPQUFPQSxHQUFQLEVBQVk7QUFDYixRQUFJYixJQUFKLEVBQVU7QUFDVEEsVUFBS2dCLFFBQUw7QUFDQTtBQUNEcEIsYUFBUyxJQUFULEVBQWVpQixHQUFmO0FBQ0E7QUFDRDs7OztFQS95QjhCNkUscUI7O2tCQWt6QmpCaEcsaUIiLCJmaWxlIjoiTWFpblJlcG9ydFNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNlcnZpY2UgZnJvbSAnLi9CYXNlU2VydmljZSc7XHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuY2xhc3MgTWFpblJlcG9ydFNlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQqIGdldCBkZXRhaWwgcHJvamVjdCBwYWdlIENsaWVudCBBbmFseXRpY3NcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHRnZXREYXRhRGFpbHlSZXBvcnRFbWFpbChwYXJhbSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIGxpc3RVc2VyID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblJlcG9ydC5nZXRMaXN0VXNlckRhaWx5UmVwb3J0XCIsIHt9KTtcclxuXHJcblx0XHRcdFx0XHRpZihsaXN0VXNlci5sZW5ndGggPiAwKXtcclxuXHRcdFx0XHRcdFx0Ly8gR2V0IGxpc3QgYWxhcm0gYnkgaWRzX3Byb2plY3RcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0VXNlci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBhbGVydHMgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRpZighTGlicy5pc0JsYW5rKGxpc3RVc2VyW2ldLmlkc19wcm9qZWN0KSl7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgaWRzUHJvamVjdFN0cmluZyA9IGxpc3RVc2VyW2ldLmlkc19wcm9qZWN0O1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGlkc1Byb2plY3QgPSBpZHNQcm9qZWN0U3RyaW5nLnNwbGl0KFwiLFwiKTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmKGlkc1Byb2plY3QubGVuZ3RoID4gMCl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGFsZXJ0cyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5SZXBvcnQuZ2V0QWxlcnRzRGFpbHlSZXBvcnRcIiwge2lkc1Byb2plY3R9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRsaXN0VXNlcltpXS5hbGVydHMgPSBhbGVydHM7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGxpc3RVc2VyKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0KiBnZXQgZGV0YWlsIHByb2plY3QgcGFnZSBDbGllbnQgQW5hbHl0aWNzXHJcblx0KiBAcGFyYW0geyp9IGRhdGEgXHJcblx0KiBAcGFyYW0geyp9IGNhbGxCYWNrIFxyXG5cdCovXHJcblx0Z2V0RGF0YVJlcG9ydE1vbnRoRW1haWwocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBkYXRhID0gW107XHJcblx0XHRcdFx0XHR2YXIgbGlzdFByb2plY3QgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUmVwb3J0LmdldExpc3RQcm9qZWN0XCIsIHt9KTtcclxuXHRcdFx0XHRcdHZhciBpdGVtUHJvamVjdCA9IHt9O1xyXG5cdFx0XHRcdFx0aWYgKGxpc3RQcm9qZWN0Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0UHJvamVjdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW1Qcm9qZWN0ID0gbGlzdFByb2plY3RbaV07XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIEdldCBkYXRhIGdyb3VwIGludmVydGVyXHJcblx0XHRcdFx0XHRcdFx0dmFyIGRhdGFHcm91cEludmVydGVyID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblJlcG9ydC5nZXREYXRhR3JvdXBJbnZlcnRlclwiLCBpdGVtUHJvamVjdCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHZhciBncm91cEludmVydGVyID0gW107XHJcblx0XHRcdFx0XHRcdFx0aWYgKGRhdGFHcm91cEludmVydGVyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW4gPSBkYXRhR3JvdXBJbnZlcnRlci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRncm91cEludmVydGVyLnB1c2goXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGFzaF9pZDogaXRlbVByb2plY3QuaGFzaF9pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZGF0YUdyb3VwSW52ZXJ0ZXJbaV0uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZGF0YUdyb3VwSW52ZXJ0ZXJbaV0udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHZhciBkYXRhRW5lcmd5TW9udGggPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhpdGVtUHJvamVjdC5sYXN0X2RheSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAxOyBpIDw9IHBhcnNlSW50KGl0ZW1Qcm9qZWN0Lmxhc3RfZGF5KTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aC5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdDogJycsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiAnJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yeV90aW1lX2Zvcm1hdDogJycsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGFzdF9kYXk6ICcnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRheTogaSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IDAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bWF4X2FjdGl2ZUVuZXJneTogMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtaW5fYWN0aXZlRW5lcmd5OiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gZ2V0IGRhdGEgZW5lcmd5IGJ5IG1vbnRoXHJcblx0XHRcdFx0XHRcdFx0aWYgKGdyb3VwSW52ZXJ0ZXIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGRhdGFFbmVyZ3kgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUmVwb3J0LmRhdGFFbmVyZ3lNb250aEVtYWlsXCIsIHsgZ3JvdXBJbnZlcnRlciB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkYXRhRW5lcmd5KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aCA9IE9iamVjdC52YWx1ZXMoWy4uLmRhdGFFbmVyZ3lNb250aCwgLi4uZGF0YUVuZXJneV0ucmVkdWNlKChhY2MsIHsgdGltZV9mb3JtYXQsIHRpbWVfZnVsbCwgY2F0ZWdvcnlfdGltZV9mb3JtYXQsIGxhc3RfZGF5LCBkYXksIGFjdGl2ZVBvd2VyLCBhY3RpdmVFbmVyZ3ksIG1heF9hY3RpdmVFbmVyZ3ksIG1pbl9hY3RpdmVFbmVyZ3kgfSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjY1tkYXldID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yeV90aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhc3RfZGF5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtYXhfYWN0aXZlRW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWluX2FjdGl2ZUVuZXJneVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGl0ZW1Qcm9qZWN0LmRhdGFFbmVyZ3lNb250aCA9IGRhdGFFbmVyZ3lNb250aDtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgZW5lcmd5TW9udGggPSBkYXRhRW5lcmd5TW9udGgucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aXZlRW5lcmd5OiBhLmFjdGl2ZUVuZXJneSArIGIuYWN0aXZlRW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1heF9hY3RpdmVFbmVyZ3k6IExpYnMucm91bmROdW1iZXIoKGEubWF4X2FjdGl2ZUVuZXJneSArIGIubWF4X2FjdGl2ZUVuZXJneSksIDEpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1pbl9hY3RpdmVFbmVyZ3k6IExpYnMucm91bmROdW1iZXIoKGEubWluX2FjdGl2ZUVuZXJneSArIGIubWluX2FjdGl2ZUVuZXJneSksIDEpXHJcblx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRpdGVtUHJvamVjdC5lbmVyZ3lNb250aCA9ICFMaWJzLmlzT2JqZWN0RW1wdHkoZW5lcmd5TW9udGgpID8gZW5lcmd5TW9udGguYWN0aXZlRW5lcmd5IDogMDtcclxuXHRcdFx0XHRcdFx0XHRcdGl0ZW1Qcm9qZWN0Lm1heF9hY3RpdmVFbmVyZ3kgPSAhTGlicy5pc09iamVjdEVtcHR5KGVuZXJneU1vbnRoKSA/IGVuZXJneU1vbnRoLm1heF9hY3RpdmVFbmVyZ3kgOiAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0aXRlbVByb2plY3QubWluX2FjdGl2ZUVuZXJneSA9ICFMaWJzLmlzT2JqZWN0RW1wdHkoZW5lcmd5TW9udGgpID8gZW5lcmd5TW9udGgubWluX2FjdGl2ZUVuZXJneSA6IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRpdGVtUHJvamVjdC5yZXZlbnVlID0gTGlicy5mb3JtYXROdW0oKGVuZXJneU1vbnRoLmFjdGl2ZUVuZXJneSAqIGl0ZW1Qcm9qZWN0LmNvbmZpZ19yZXZlbnVlKSwgJyMsIyMjJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gR2V0IGxpc3QgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHR2YXIgYWxlcnRzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblJlcG9ydC5nZXREYXRhQWxlcnRSZXBvcnRNb250aFwiLCBpdGVtUHJvamVjdCk7XHJcblx0XHRcdFx0XHRcdFx0aXRlbVByb2plY3QuYWxlcnRzID0gYWxlcnRzO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGEucHVzaChpdGVtUHJvamVjdCk7XHJcblxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGEpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0aWYgKGNvbm4pIHtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0KiBnZXQgZGV0YWlsIHByb2plY3QgcGFnZSBDbGllbnQgQW5hbHl0aWNzXHJcblx0KiBAcGFyYW0geyp9IGRhdGEgXHJcblx0KiBAcGFyYW0geyp9IGNhbGxCYWNrIFxyXG5cdCovXHJcblx0Z2V0RGF0YVJlcG9ydFllYXJFbWFpbChwYXJhbSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIGRhdGEgPSBbXTtcclxuXHJcblx0XHRcdFx0XHR2YXIgeWVhciA9IG1vbWVudCgpLmZvcm1hdCgnWVlZWScpO1xyXG5cdFx0XHRcdFx0dmFyIHN0YXJ0RGF0ZU9mVGhlWWVhciA9IG1vbWVudChbeWVhcl0pLmZvcm1hdCgnWVlZWS1NTS1ERCBoaDptbTpzcycpO1xyXG5cdFx0XHRcdFx0dmFyIGVuZERhdGVPZlRoZVllYXIgPSBtb21lbnQoW3llYXJdKS5lbmRPZigneWVhcicpLmZvcm1hdCgnWVlZWS1NTS1ERCBoaDptbTpzcycpO1xyXG5cdFx0XHRcdFx0cGFyYW0uc3RhcnRfZGF0ZSA9IHN0YXJ0RGF0ZU9mVGhlWWVhcjtcclxuXHRcdFx0XHRcdHBhcmFtLmVuZF9kYXRlID0gZW5kRGF0ZU9mVGhlWWVhcjtcclxuXHRcdFx0XHRcdHZhciBsaXN0UHJvamVjdCA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5SZXBvcnQuZ2V0TGlzdFByb2plY3RZZWFyRW1haWxcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0dmFyIGl0ZW1Qcm9qZWN0ID0ge307XHJcblxyXG5cdFx0XHRcdFx0aWYgKGxpc3RQcm9qZWN0Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0UHJvamVjdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW1Qcm9qZWN0ID0gbGlzdFByb2plY3RbaV07XHJcblx0XHRcdFx0XHRcdFx0aXRlbVByb2plY3Quc3RhcnRfZGF0ZSA9IHN0YXJ0RGF0ZU9mVGhlWWVhcjtcclxuXHRcdFx0XHRcdFx0XHRpdGVtUHJvamVjdC5lbmRfZGF0ZSA9IGVuZERhdGVPZlRoZVllYXI7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIEdldCBkYXRhIGdyb3VwIGludmVydGVyXHJcblx0XHRcdFx0XHRcdFx0dmFyIGRhdGFHcm91cEludmVydGVyID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblJlcG9ydC5nZXREYXRhR3JvdXBJbnZlcnRlclwiLCBpdGVtUHJvamVjdCk7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGdyb3VwSW52ZXJ0ZXIgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZGF0YUdyb3VwSW52ZXJ0ZXIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IGRhdGFHcm91cEludmVydGVyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwSW52ZXJ0ZXIucHVzaChcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoYXNoX2lkOiBpdGVtUHJvamVjdC5oYXNoX2lkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBkYXRhR3JvdXBJbnZlcnRlcltpXS5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBpdGVtUHJvamVjdC5zdGFydF9kYXRlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW5kX2RhdGU6IGl0ZW1Qcm9qZWN0LmVuZF9kYXRlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZGF0YUdyb3VwSW52ZXJ0ZXJbaV0udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHZhciBnZXRUb3RhbEZlZXRBbGFybXMgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUmVwb3J0LmdldFRvdGFsRmVldEFsYXJtc1wiLCBpdGVtUHJvamVjdCk7XHJcblx0XHRcdFx0XHRcdFx0aXRlbVByb2plY3QudG90YWxGZWV0QWxhcm1zID0gZ2V0VG90YWxGZWV0QWxhcm1zO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBnZXQgZGF0YSBhbGVydHNcclxuXHRcdFx0XHRcdFx0XHR2YXIgYWxlcnRzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblJlcG9ydC5nZXRMaXN0QWxhcm1ZZWFyRW1haWxcIiwgaXRlbVByb2plY3QpO1xyXG5cdFx0XHRcdFx0XHRcdHZhciBkYXRhQWxlcnRzID0gW107XHJcblx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDExOyBpID49IDA7IGktLSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUFsZXJ0cy5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiBtb21lbnQoaXRlbVByb2plY3QuZW5kX2RhdGUpLmFkZCgtaSwgJ00nKS5mb3JtYXQoJ01NL1lZWVknKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dG90YWxfYWxhcm06IDBcclxuXHRcdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGRhdGFBbGVydHMgPSBPYmplY3QudmFsdWVzKFsuLi5kYXRhQWxlcnRzLCAuLi5hbGVydHNdLnJlZHVjZSgoYWNjLCB7IHRpbWVfZnVsbCwgdG90YWxfYWxhcm0gfSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dG90YWxfYWxhcm06IChhY2NbdGltZV9mdWxsXSA/IGFjY1t0aW1lX2Z1bGxdLnRvdGFsX2FsYXJtIDogMCkgKyB0b3RhbF9hbGFybSxcclxuXHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0XHRcdFx0XHRcdH0sIHt9KSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGl0ZW1Qcm9qZWN0LmRhdGFBbGVydHMgPSBkYXRhQWxlcnRzO1xyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gR2V0IGRhdGEgZW5lcmd5XHJcblx0XHRcdFx0XHRcdFx0dmFyIGRhdGFDb25maWdFc3RpbWF0ZSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTWFpblJlcG9ydC5nZXRDb25maWdFc3RpbWF0ZVwiLCBpdGVtUHJvamVjdCk7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGRhdGFFbmVyZ3lNb250aCA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGl0ZW1Qcm9qZWN0Lmxhc3RfZGF5KSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDE7IGkgPD0gcGFyc2VJbnQoMTIpOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVzdGltYXRlX2VuZXJneSA9IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChkYXRhQ29uZmlnRXN0aW1hdGUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzd2l0Y2ggKGkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUNvbmZpZ0VzdGltYXRlWydqYW4nXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneSA9IGRhdGFDb25maWdFc3RpbWF0ZVsnZmViJ107XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAzOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3kgPSBkYXRhQ29uZmlnRXN0aW1hdGVbJ21hciddO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgNDpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUNvbmZpZ0VzdGltYXRlWydhcHInXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXNlIDU6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneSA9IGRhdGFDb25maWdFc3RpbWF0ZVsnbWF5J107XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSA2OlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3kgPSBkYXRhQ29uZmlnRXN0aW1hdGVbJ2p1biddO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgNzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUNvbmZpZ0VzdGltYXRlWydqdWwnXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXNlIDg6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneSA9IGRhdGFDb25maWdFc3RpbWF0ZVsnYXVnJ107XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSA5OlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3kgPSBkYXRhQ29uZmlnRXN0aW1hdGVbJ3NlcCddO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgMTA6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneSA9IGRhdGFDb25maWdFc3RpbWF0ZVsnb2N0J107XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAxMTpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUNvbmZpZ0VzdGltYXRlWydub3YnXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXNlIDEyOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3kgPSBkYXRhQ29uZmlnRXN0aW1hdGVbJ2RlYyddO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiAnJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6IChpIDwgMTAgPyAnMCcgKyBpIDogaSkgKyBcIi9cIiArIGl0ZW1Qcm9qZWN0LnllYXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcnlfdGltZV9mb3JtYXQ6ICcnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxhc3RfZGF5OiAnJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtb250aDogaSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IDAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5OiBlc3RpbWF0ZV9lbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bW9udGhfc3RyOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRpZmZfZW5lcmd5OiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRpZmZfcGVyY2VudDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdW1fYWN0aXZlRW5lcmd5OiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN1bV9lc3RpbWF0ZV9lbmVyZ3k6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3VtX2RpZmZfZW5lcmd5OiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN1bV9kaWZmX3BlcmNlbnQ6IG51bGxcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdHZhciBkYXRhRW5lcmd5ID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblJlcG9ydC5kYXRhRW5lcmd5WWVhclwiLCB7IGdyb3VwSW52ZXJ0ZXIgfSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIChkYXRhRW5lcmd5KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGggPSBPYmplY3QudmFsdWVzKFsuLi5kYXRhRW5lcmd5TW9udGgsIC4uLmRhdGFFbmVyZ3ldLnJlZHVjZSgoYWNjLCB7IHRpbWVfZm9ybWF0LCB0aW1lX2Z1bGwsIGNhdGVnb3J5X3RpbWVfZm9ybWF0LCBtb250aCwgYWN0aXZlUG93ZXIsIGFjdGl2ZUVuZXJneSwgbW9udGhfc3RyLCBlc3RpbWF0ZV9lbmVyZ3kgfSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhY2NbbW9udGhdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yeV90aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtb250aCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bW9udGhfc3RyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneTogKGFjY1ttb250aF0gPyBhY2NbbW9udGhdLmVzdGltYXRlX2VuZXJneSA6IDApICsgZXN0aW1hdGVfZW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSwge30pKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHZhciB0b3RhbEVuZXJneSA9IDAsIHByID0gMCwgdG90YWxFc3RpbWF0ZSA9IDA7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIChMaWJzLmlzQXJyYXlEYXRhKGRhdGFFbmVyZ3lNb250aCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBsZW5ndGggPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGl0ZW1Qcm9qZWN0LnllYXIgPT0gbW9tZW50KCkuZm9ybWF0KCdZWVlZJykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGVuZ3RoID0gbW9tZW50KCkuZm9ybWF0KCdNTScpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGVuZ3RoID0gZGF0YUVuZXJneU1vbnRoLmxlbmd0aFxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaiA9IDAsIGxlbiA9IGRhdGFFbmVyZ3lNb250aC5sZW5ndGg7IGogPCBsZW47IGorKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0b3RhbEVuZXJneSA9IHRvdGFsRW5lcmd5ICsgZGF0YUVuZXJneU1vbnRoW2pdLmFjdGl2ZUVuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dG90YWxFc3RpbWF0ZSA9IHRvdGFsRXN0aW1hdGUgKyBkYXRhRW5lcmd5TW9udGhbal0uZXN0aW1hdGVfZW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhRW5lcmd5TW9udGhbal0uZXN0aW1hdGVfZW5lcmd5KSAmJiAhTGlicy5pc0JsYW5rKGRhdGFFbmVyZ3lNb250aFtqXS5hY3RpdmVFbmVyZ3kpICYmIGRhdGFFbmVyZ3lNb250aFtqXS5lc3RpbWF0ZV9lbmVyZ3kgPiAwICYmIGRhdGFFbmVyZ3lNb250aFtqXS5hY3RpdmVFbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRpZmZFbmVyZ3kgPSBkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5IC0gZGF0YUVuZXJneU1vbnRoW2pdLmVzdGltYXRlX2VuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uZGlmZl9lbmVyZ3kgPSBMaWJzLnJvdW5kTnVtYmVyKGRpZmZFbmVyZ3ksIDApO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5kaWZmX3BlcmNlbnQgPSBMaWJzLnJvdW5kTnVtYmVyKChkaWZmRW5lcmd5IC8gZGF0YUVuZXJneU1vbnRoW2pdLmFjdGl2ZUVuZXJneSkgKiAxMDAsIDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5kaWZmX2VuZXJneSA9IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLmRpZmZfcGVyY2VudCA9IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIFRpbmggdGljaCBsdXlcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGogPT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fYWN0aXZlRW5lcmd5ID0gZGF0YUVuZXJneU1vbnRoW2pdLmFjdGl2ZUVuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uc3VtX2VzdGltYXRlX2VuZXJneSA9IGRhdGFFbmVyZ3lNb250aFtqXS5lc3RpbWF0ZV9lbmVyZ3k7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGFFbmVyZ3lNb250aFtqXS5lc3RpbWF0ZV9lbmVyZ3kpICYmICFMaWJzLmlzQmxhbmsoZGF0YUVuZXJneU1vbnRoW2pdLmFjdGl2ZUVuZXJneSkgJiYgZGF0YUVuZXJneU1vbnRoW2pdLmVzdGltYXRlX2VuZXJneSA+IDAgJiYgZGF0YUVuZXJneU1vbnRoW2pdLmFjdGl2ZUVuZXJneSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkaWZmRW5lcmd5ID0gZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9hY3RpdmVFbmVyZ3kgLSBkYXRhRW5lcmd5TW9udGhbal0uc3VtX2VzdGltYXRlX2VuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZGlmZl9lbmVyZ3kgPSBMaWJzLnJvdW5kTnVtYmVyKGRpZmZFbmVyZ3ksIDApO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9kaWZmX3BlcmNlbnQgPSBMaWJzLnJvdW5kTnVtYmVyKChkaWZmRW5lcmd5IC8gZGF0YUVuZXJneU1vbnRoW2pdLmFjdGl2ZUVuZXJneSkgKiAxMDAsIDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uc3VtX2RpZmZfZW5lcmd5ID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZGlmZl9wZXJjZW50ID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9hY3RpdmVFbmVyZ3kgPSAoZGF0YUVuZXJneU1vbnRoW2ogLSAxXS5zdW1fYWN0aXZlRW5lcmd5ICsgZGF0YUVuZXJneU1vbnRoW2pdLmFjdGl2ZUVuZXJneSkgPT0gMCA/IDAgOiBMaWJzLnJvdW5kTnVtYmVyKChkYXRhRW5lcmd5TW9udGhbaiAtIDFdLnN1bV9hY3RpdmVFbmVyZ3kgKyBkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5KSwgMCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9lc3RpbWF0ZV9lbmVyZ3kgPSAoZGF0YUVuZXJneU1vbnRoW2ogLSAxXS5zdW1fZXN0aW1hdGVfZW5lcmd5ICsgZGF0YUVuZXJneU1vbnRoW2pdLmVzdGltYXRlX2VuZXJneSkgPT0gMCA/IDAgOiBMaWJzLnJvdW5kTnVtYmVyKChkYXRhRW5lcmd5TW9udGhbaiAtIDFdLnN1bV9lc3RpbWF0ZV9lbmVyZ3kgKyBkYXRhRW5lcmd5TW9udGhbal0uZXN0aW1hdGVfZW5lcmd5KSwgMCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9lc3RpbWF0ZV9lbmVyZ3kpICYmICFMaWJzLmlzQmxhbmsoZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9hY3RpdmVFbmVyZ3kpICYmIGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZXN0aW1hdGVfZW5lcmd5ID4gMCAmJiBkYXRhRW5lcmd5TW9udGhbal0uc3VtX2FjdGl2ZUVuZXJneSA+IDApIHtcclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRpZmZFbmVyZ3kgPSBkYXRhRW5lcmd5TW9udGhbal0uc3VtX2FjdGl2ZUVuZXJneSAtIGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZXN0aW1hdGVfZW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9kaWZmX2VuZXJneSA9IExpYnMucm91bmROdW1iZXIoZGlmZkVuZXJneSwgMCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uc3VtX2RpZmZfcGVyY2VudCA9IExpYnMucm91bmROdW1iZXIoKGRpZmZFbmVyZ3kgLyBkYXRhRW5lcmd5TW9udGhbal0uc3VtX2FjdGl2ZUVuZXJneSkgKiAxMDAsIDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uc3VtX2RpZmZfZW5lcmd5ID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZGlmZl9wZXJjZW50ID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpdGVtUHJvamVjdC50b3RhbEVuZXJneSA9IExpYnMucm91bmROdW1iZXIodG90YWxFbmVyZ3ksIDEpO1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW1Qcm9qZWN0LnRvdGFsRXN0aW1hdGUgPSBMaWJzLnJvdW5kTnVtYmVyKHRvdGFsRXN0aW1hdGUsIDEpO1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW1Qcm9qZWN0LnByID0gTGlicy5yb3VuZE51bWJlcih0b3RhbEVuZXJneSAvIHRvdGFsRXN0aW1hdGUsIDIpO1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW1Qcm9qZWN0LmRhdGFFbmVyZ3lNb250aCA9IGRhdGFFbmVyZ3lNb250aDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhLnB1c2goaXRlbVByb2plY3QpO1xyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gdmFyIGdyb3VwSW52ZXJ0ZXIgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHQvLyBpZiAoZGF0YUdyb3VwSW52ZXJ0ZXIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IGRhdGFHcm91cEludmVydGVyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdGdyb3VwSW52ZXJ0ZXIucHVzaChcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRoYXNoX2lkOiBpdGVtUHJvamVjdC5oYXNoX2lkLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBkYXRhR3JvdXBJbnZlcnRlcltpXS5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHR0YWJsZV9uYW1lOiBkYXRhR3JvdXBJbnZlcnRlcltpXS50YWJsZV9uYW1lXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHQpO1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gdmFyIGRhdGFFbmVyZ3lNb250aCA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGlmICghTGlicy5pc0JsYW5rKGl0ZW1Qcm9qZWN0Lmxhc3RfZGF5KSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0Zm9yIChsZXQgaSA9IDE7IGkgPD0gcGFyc2VJbnQoaXRlbVByb2plY3QubGFzdF9kYXkpOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0ZGF0YUVuZXJneU1vbnRoLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdHRpbWVfZm9ybWF0OiAnJyxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHR0aW1lX2Z1bGw6ICcnLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGNhdGVnb3J5X3RpbWVfZm9ybWF0OiAnJyxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRsYXN0X2RheTogJycsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGF5OiBpLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGFjdGl2ZVBvd2VyOiAwLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGFjdGl2ZUVuZXJneTogMCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRtYXhfYWN0aXZlRW5lcmd5OiAwLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdG1pbl9hY3RpdmVFbmVyZ3k6IDBcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyAvLyBnZXQgZGF0YSBlbmVyZ3kgYnkgbW9udGhcclxuXHRcdFx0XHRcdFx0XHQvLyBpZiAoZ3JvdXBJbnZlcnRlci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHR2YXIgZGF0YUVuZXJneSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5SZXBvcnQuZGF0YUVuZXJneU1vbnRoRW1haWxcIiwgeyBncm91cEludmVydGVyIH0pO1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0aWYgKGRhdGFFbmVyZ3kpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0ZGF0YUVuZXJneU1vbnRoID0gT2JqZWN0LnZhbHVlcyhbLi4uZGF0YUVuZXJneU1vbnRoLCAuLi5kYXRhRW5lcmd5XS5yZWR1Y2UoKGFjYywgeyB0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBjYXRlZ29yeV90aW1lX2Zvcm1hdCwgbGFzdF9kYXksIGRheSwgYWN0aXZlUG93ZXIsIGFjdGl2ZUVuZXJneSwgbWF4X2FjdGl2ZUVuZXJneSwgbWluX2FjdGl2ZUVuZXJneSB9KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0YWNjW2RheV0gPSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHR0aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdHRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGNhdGVnb3J5X3RpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGFzdF9kYXksXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRkYXksXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRhY3RpdmVQb3dlcixcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGFjdGl2ZUVuZXJneSxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRcdG1heF9hY3RpdmVFbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRtaW5fYWN0aXZlRW5lcmd5XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHR9LCB7fSkpO1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0aXRlbVByb2plY3QuZGF0YUVuZXJneU1vbnRoID0gZGF0YUVuZXJneU1vbnRoO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBcdGxldCBlbmVyZ3lNb250aCA9IGRhdGFFbmVyZ3lNb250aC5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRhY3RpdmVFbmVyZ3k6IGEuYWN0aXZlRW5lcmd5ICsgYi5hY3RpdmVFbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bWF4X2FjdGl2ZUVuZXJneTogTGlicy5yb3VuZE51bWJlcigoYS5tYXhfYWN0aXZlRW5lcmd5ICsgYi5tYXhfYWN0aXZlRW5lcmd5KSwgMSksXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bWluX2FjdGl2ZUVuZXJneTogTGlicy5yb3VuZE51bWJlcigoYS5taW5fYWN0aXZlRW5lcmd5ICsgYi5taW5fYWN0aXZlRW5lcmd5KSwgMSlcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBcdGl0ZW1Qcm9qZWN0LmVuZXJneU1vbnRoID0gIUxpYnMuaXNPYmplY3RFbXB0eShlbmVyZ3lNb250aCkgPyBlbmVyZ3lNb250aC5hY3RpdmVFbmVyZ3k6IDA7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRpdGVtUHJvamVjdC5tYXhfYWN0aXZlRW5lcmd5ID0gIUxpYnMuaXNPYmplY3RFbXB0eShlbmVyZ3lNb250aCkgPyBlbmVyZ3lNb250aC5tYXhfYWN0aXZlRW5lcmd5OiAwO1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0aXRlbVByb2plY3QubWluX2FjdGl2ZUVuZXJneSA9ICFMaWJzLmlzT2JqZWN0RW1wdHkoZW5lcmd5TW9udGgpID8gZW5lcmd5TW9udGgubWluX2FjdGl2ZUVuZXJneTogMDtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGl0ZW1Qcm9qZWN0LnJldmVudWUgPSBMaWJzLmZvcm1hdE51bSgoZW5lcmd5TW9udGguYWN0aXZlRW5lcmd5ICogaXRlbVByb2plY3QuY29uZmlnX3JldmVudWUpLCAnIywjIyMnKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyAvLyBHZXQgbGlzdCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdC8vIHZhciBhbGVydHMgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUmVwb3J0LmdldERhdGFBbGVydFJlcG9ydE1vbnRoXCIsIGl0ZW1Qcm9qZWN0KTtcclxuXHRcdFx0XHRcdFx0XHQvLyBpdGVtUHJvamVjdC5hbGVydHMgPSBhbGVydHM7XHJcblx0XHRcdFx0XHRcdFx0Ly8gZGF0YS5wdXNoKGl0ZW1Qcm9qZWN0KTtcclxuXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZGF0YSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRpZiAoY29ubikge1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0KiBnZXQgZGV0YWlsIHByb2plY3QgcGFnZSBDbGllbnQgQW5hbHl0aWNzXHJcblx0KiBAcGFyYW0geyp9IGRhdGEgXHJcblx0KiBAcGFyYW0geyp9IGNhbGxCYWNrIFxyXG5cdCovXHJcblxyXG5cdGdldERhdGFSZXBvcnRNb250aChwYXJhbSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0cGFyYW0uc3RhcnRfZGF0ZSA9IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSk7XHJcblx0XHRcdFx0XHRwYXJhbS5lbmRfZGF0ZSA9IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpO1xyXG5cdFx0XHRcdFx0dmFyIHJzID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblJlcG9ydC5nZXREYXRhUmVwb3J0TW9udGhcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZhciBkYXRhID0gcnNbMF1bMF07XHJcblx0XHRcdFx0XHR2YXIgZ3JvdXBJbnZlcnRlciA9IFtdO1xyXG5cdFx0XHRcdFx0dmFyIGdldEdyb3VwSW52ZXJ0ZXIgPSByc1sxXTtcclxuXHRcdFx0XHRcdGlmIChnZXRHcm91cEludmVydGVyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IGdldEdyb3VwSW52ZXJ0ZXIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRncm91cEludmVydGVyLnB1c2goXHJcblx0XHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGhhc2hfaWQ6IHBhcmFtLmhhc2hfaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0R3JvdXBJbnZlcnRlcltpXS5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IHBhcmFtLnN0YXJ0X2RhdGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGVuZF9kYXRlOiBwYXJhbS5lbmRfZGF0ZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZ2V0R3JvdXBJbnZlcnRlcltpXS50YWJsZV9uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZhciBkYXRhRW5lcmd5TW9udGggPSBbXTtcclxuXHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEubGFzdF9kYXkpKSB7XHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAxOyBpIDw9IHBhcnNlSW50KGRhdGEubGFzdF9kYXkpOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGgucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdDogJycsXHJcblx0XHRcdFx0XHRcdFx0XHR0aW1lX2Z1bGw6ICcnLFxyXG5cdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcnlfdGltZV9mb3JtYXQ6ICcnLFxyXG5cdFx0XHRcdFx0XHRcdFx0bGFzdF9kYXk6ICcnLFxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF5OiBpLFxyXG5cdFx0XHRcdFx0XHRcdFx0YWN0aXZlUG93ZXI6IDAsXHJcblx0XHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IDAsXHJcblx0XHRcdFx0XHRcdFx0XHRtYXhfYWN0aXZlRW5lcmd5OiAwLFxyXG5cdFx0XHRcdFx0XHRcdFx0bWluX2FjdGl2ZUVuZXJneTogMFxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dmFyIGRhdGFFbmVyZ3kgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUmVwb3J0LmRhdGFFbmVyZ3lNb250aFwiLCB7IGdyb3VwSW52ZXJ0ZXIgfSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGRhdGFFbmVyZ3kpIHtcclxuXHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoID0gT2JqZWN0LnZhbHVlcyhbLi4uZGF0YUVuZXJneU1vbnRoLCAuLi5kYXRhRW5lcmd5XS5yZWR1Y2UoKGFjYywgeyB0aW1lX2Zvcm1hdCwgdGltZV9mdWxsLCBjYXRlZ29yeV90aW1lX2Zvcm1hdCwgbGFzdF9kYXksIGRheSwgYWN0aXZlUG93ZXIsIGFjdGl2ZUVuZXJneSwgbWF4X2FjdGl2ZUVuZXJneSwgbWluX2FjdGl2ZUVuZXJneSB9KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0YWNjW2RheV0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdGNhdGVnb3J5X3RpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdFx0bGFzdF9kYXksXHJcblx0XHRcdFx0XHRcdFx0XHRkYXksXHJcblx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneSxcclxuXHRcdFx0XHRcdFx0XHRcdG1heF9hY3RpdmVFbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0XHRtaW5fYWN0aXZlRW5lcmd5XHJcblx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGxldCBlbmVyZ3lNb250aCA9IGRhdGFFbmVyZ3lNb250aC5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IGEuYWN0aXZlRW5lcmd5ICsgYi5hY3RpdmVFbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0bWF4X2FjdGl2ZUVuZXJneTogTGlicy5yb3VuZE51bWJlcigoYS5tYXhfYWN0aXZlRW5lcmd5ICsgYi5tYXhfYWN0aXZlRW5lcmd5KSwgMSksXHJcblx0XHRcdFx0XHRcdFx0bWluX2FjdGl2ZUVuZXJneTogTGlicy5yb3VuZE51bWJlcigoYS5taW5fYWN0aXZlRW5lcmd5ICsgYi5taW5fYWN0aXZlRW5lcmd5KSwgMSlcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdGRhdGEuZW5lcmd5TW9udGggPSAhTGlicy5pc09iamVjdEVtcHR5KGVuZXJneU1vbnRoKSA/IGVuZXJneU1vbnRoLmFjdGl2ZUVuZXJneSA6IDA7XHJcblx0XHRcdFx0XHRkYXRhLm1heF9hY3RpdmVFbmVyZ3kgPSAhTGlicy5pc09iamVjdEVtcHR5KGVuZXJneU1vbnRoKSA/IGVuZXJneU1vbnRoLm1heF9hY3RpdmVFbmVyZ3kgOiAwO1xyXG5cdFx0XHRcdFx0ZGF0YS5taW5fYWN0aXZlRW5lcmd5ID0gIUxpYnMuaXNPYmplY3RFbXB0eShlbmVyZ3lNb250aCkgPyBlbmVyZ3lNb250aC5taW5fYWN0aXZlRW5lcmd5IDogMDtcclxuXHRcdFx0XHRcdGRhdGEucmV2ZW51ZSA9IExpYnMuZm9ybWF0TnVtKChlbmVyZ3lNb250aC5hY3RpdmVFbmVyZ3kgKiBkYXRhLmNvbmZpZ19yZXZlbnVlKSwgJyMsIyMjJyk7XHJcblxyXG5cclxuXHRcdFx0XHRcdGRhdGEuZGF0YUVuZXJneU1vbnRoID0gZGF0YUVuZXJneU1vbnRoO1xyXG5cdFx0XHRcdFx0ZGF0YS5hbGFybU9QZW5lZCA9IHJzWzJdO1xyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGlmIChjb25uKSB7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHQvKipcclxuXHQqIGdldCBkZXRhaWwgcHJvamVjdCBwYWdlIENsaWVudCBBbmFseXRpY3NcclxuXHQqIEBwYXJhbSB7Kn0gZGF0YSBcclxuXHQqIEBwYXJhbSB7Kn0gY2FsbEJhY2sgXHJcblx0Ki9cclxuXHJcblx0Z2V0RGF0YVJlcG9ydFllYXIocGFyYW0sIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdC8vIGlmIChwYXJhbS50eXBlID09IDEpIHtcclxuXHRcdFx0XHRcdC8vIFx0dmFyIHllYXIgPSBwYXJhbS5lbmRfZGF0ZS5zdWJzdHIoLTQpO1xyXG5cdFx0XHRcdFx0Ly8gXHR2YXIgc3RhcnREYXRlT2ZUaGVZZWFyID0gbW9tZW50KFt5ZWFyXSkuZm9ybWF0KCdZWVlZLU1NLUREIGhoOm1tOnNzJyk7XHJcblx0XHRcdFx0XHQvLyBcdHZhciBlbmREYXRlT2ZUaGVZZWFyID0gbW9tZW50KFt5ZWFyXSkuZW5kT2YoJ3llYXInKS5mb3JtYXQoJ1lZWVktTU0tREQgaGg6bW06c3MnKTtcclxuXHRcdFx0XHRcdC8vIFx0cGFyYW0uc3RhcnRfZGF0ZSA9IHN0YXJ0RGF0ZU9mVGhlWWVhcjtcclxuXHRcdFx0XHRcdC8vIFx0cGFyYW0uZW5kX2RhdGUgPSBlbmREYXRlT2ZUaGVZZWFyO1xyXG5cdFx0XHRcdFx0Ly8gfSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIFx0cGFyYW0uc3RhcnRfZGF0ZSA9IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSk7XHJcblx0XHRcdFx0XHQvLyBcdHBhcmFtLmVuZF9kYXRlID0gTGlicy5jb252ZXJ0QWxsRm9ybWF0RGF0ZShwYXJhbS5lbmRfZGF0ZSk7XHJcblx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0cGFyYW0uc3RhcnRfZGF0ZSA9IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uc3RhcnRfZGF0ZSk7XHJcblx0XHRcdFx0XHRwYXJhbS5lbmRfZGF0ZSA9IExpYnMuY29udmVydEFsbEZvcm1hdERhdGUocGFyYW0uZW5kX2RhdGUpO1xyXG5cdFx0XHRcdFx0dmFyIHN0YXJ0RGF0ZSA9IHBhcmFtLnN0YXJ0X2RhdGU7XHJcblx0XHRcdFx0XHR2YXIgZW5kRGF0ZSA9IHBhcmFtLmVuZF9kYXRlO1xyXG5cdFx0XHRcdFx0dmFyIG1vbnRocyA9IG1vbWVudChlbmREYXRlKS5kaWZmKHN0YXJ0RGF0ZSwgJ21vbnRocycpO1xyXG5cclxuXHRcdFx0XHRcdHZhciBycyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5SZXBvcnQuZ2V0RGF0YVJlcG9ydFllYXJcIiwgcGFyYW0pO1xyXG5cdFx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZhciBkYXRhID0gcnNbMF1bMF07XHJcblx0XHRcdFx0XHR2YXIgZ3JvdXBJbnZlcnRlciA9IFtdO1xyXG5cdFx0XHRcdFx0dmFyIGdldEdyb3VwSW52ZXJ0ZXIgPSByc1sxXTtcclxuXHRcdFx0XHRcdGlmIChnZXRHcm91cEludmVydGVyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IGdldEdyb3VwSW52ZXJ0ZXIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRncm91cEludmVydGVyLnB1c2goXHJcblx0XHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGhhc2hfaWQ6IHBhcmFtLmhhc2hfaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0R3JvdXBJbnZlcnRlcltpXS5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IHBhcmFtLnN0YXJ0X2RhdGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGVuZF9kYXRlOiBwYXJhbS5lbmRfZGF0ZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZ2V0R3JvdXBJbnZlcnRlcltpXS50YWJsZV9uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRkYXRhLnRvdGFsRmVldEFsYXJtcyA9IHJzWzJdO1xyXG5cdFx0XHRcdFx0dmFyIGRhdGFBbGFybXMgPSByc1szXTtcclxuXHRcdFx0XHRcdHZhciBkYXRhQWxlcnRzID0gW107XHJcblxyXG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPD0gcGFyc2VJbnQobW9udGhzKTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGRhdGFBbGVydHMucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0dGltZV9mdWxsOiBtb21lbnQocGFyYW0uc3RhcnRfZGF0ZSkuYWRkKCBpICwgJ00nKS5mb3JtYXQoJ01NL1lZWVknKSxcclxuXHRcdFx0XHRcdFx0XHR0b3RhbF9hbGFybTogMFxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGRhdGFBbGVydHMgPSBPYmplY3QudmFsdWVzKFsuLi5kYXRhQWxlcnRzLCAuLi5kYXRhQWxhcm1zXS5yZWR1Y2UoKGFjYywgeyB0aW1lX2Z1bGwsIHRvdGFsX2FsYXJtIH0pID0+IHtcclxuXHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0dGltZV9mdWxsLFxyXG5cdFx0XHRcdFx0XHRcdHRvdGFsX2FsYXJtOiAoYWNjW3RpbWVfZnVsbF0gPyBhY2NbdGltZV9mdWxsXS50b3RhbF9hbGFybSA6IDApICsgdG90YWxfYWxhcm0sXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cclxuXHRcdFx0XHRcdGRhdGEuZGF0YUFsYXJtcyA9IGRhdGFBbGVydHM7XHJcblxyXG5cclxuXHJcblx0XHRcdFx0XHR2YXIgZGF0YUNvbmZpZ0VzdGltYXRlID0gcnNbNF0ubGVuZ3RoID4gMCA/IHJzWzRdWzBdIDoge307XHJcblx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneU1vbnRoID0gW107XHJcblxyXG5cclxuXHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEubGFzdF9kYXkpKSB7XHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDw9IHBhcnNlSW50KG1vbnRocyk7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBlc3RpbWF0ZV9lbmVyZ3kgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdHZhciBuID0gKGkgKyAxKTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZGF0YUNvbmZpZ0VzdGltYXRlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRzd2l0Y2ggKG4pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneSA9IGRhdGFDb25maWdFc3RpbWF0ZVsnamFuJ107XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3kgPSBkYXRhQ29uZmlnRXN0aW1hdGVbJ2ZlYiddO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUNvbmZpZ0VzdGltYXRlWydtYXInXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSA0OlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneSA9IGRhdGFDb25maWdFc3RpbWF0ZVsnYXByJ107XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgNTpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3kgPSBkYXRhQ29uZmlnRXN0aW1hdGVbJ21heSddO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlIDY6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUNvbmZpZ0VzdGltYXRlWydqdW4nXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSA3OlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneSA9IGRhdGFDb25maWdFc3RpbWF0ZVsnanVsJ107XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgODpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3kgPSBkYXRhQ29uZmlnRXN0aW1hdGVbJ2F1ZyddO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlIDk6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUNvbmZpZ0VzdGltYXRlWydzZXAnXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAxMDpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RpbWF0ZV9lbmVyZ3kgPSBkYXRhQ29uZmlnRXN0aW1hdGVbJ29jdCddO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlIDExOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneSA9IGRhdGFDb25maWdFc3RpbWF0ZVsnbm92J107XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgMTI6XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5ID0gZGF0YUNvbmZpZ0VzdGltYXRlWydkZWMnXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aC5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRcdHRpbWVfZm9ybWF0OiAnJyxcclxuXHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbDogbW9tZW50KHBhcmFtLnN0YXJ0X2RhdGUpLmFkZCggaSAsICdNJykuZm9ybWF0KCdNTS9ZWVlZJyksXHJcblx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yeV90aW1lX2Zvcm1hdDogJycsXHJcblx0XHRcdFx0XHRcdFx0XHRsYXN0X2RheTogJycsXHJcblx0XHRcdFx0XHRcdFx0XHRtb250aDogbW9tZW50KHBhcmFtLnN0YXJ0X2RhdGUpLmFkZCggaSAsICdNJykuZm9ybWF0KCdNTS9ZWVlZJyksXHJcblx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcjogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneTogMCxcclxuXHRcdFx0XHRcdFx0XHRcdGVzdGltYXRlX2VuZXJneTogZXN0aW1hdGVfZW5lcmd5LFxyXG5cdFx0XHRcdFx0XHRcdFx0bW9udGhfc3RyOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0ZGlmZl9lbmVyZ3k6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRkaWZmX3BlcmNlbnQ6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRzdW1fYWN0aXZlRW5lcmd5OiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0c3VtX2VzdGltYXRlX2VuZXJneTogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdHN1bV9kaWZmX2VuZXJneTogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdHN1bV9kaWZmX3BlcmNlbnQ6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRtYXhfYWN0aXZlRW5lcmd5OiAwLFxyXG5cdFx0XHRcdFx0XHRcdFx0bWluX2FjdGl2ZUVuZXJneTogMFxyXG5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHR2YXIgZGF0YUVuZXJneSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5SZXBvcnQuZGF0YUVuZXJneVllYXJcIiwgeyBncm91cEludmVydGVyIH0pO1xyXG5cclxuXHRcdFx0XHRcdGlmIChkYXRhRW5lcmd5KSB7XHJcblx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aCA9IE9iamVjdC52YWx1ZXMoWy4uLmRhdGFFbmVyZ3lNb250aCwgLi4uZGF0YUVuZXJneV0ucmVkdWNlKChhY2MsIHsgdGltZV9mb3JtYXQsIHRpbWVfZnVsbCwgY2F0ZWdvcnlfdGltZV9mb3JtYXQsIG1vbnRoLCBhY3RpdmVQb3dlciwgYWN0aXZlRW5lcmd5LCBtb250aF9zdHIsIGVzdGltYXRlX2VuZXJneSwgbWF4X2FjdGl2ZUVuZXJneSwgbWluX2FjdGl2ZUVuZXJneSB9KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0YWNjW3RpbWVfZnVsbF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0aW1lX2Zvcm1hdCxcclxuXHRcdFx0XHRcdFx0XHRcdHRpbWVfZnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdGNhdGVnb3J5X3RpbWVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0XHRcdFx0bW9udGgsXHJcblx0XHRcdFx0XHRcdFx0XHRhY3RpdmVQb3dlcixcclxuXHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUVuZXJneSxcdFxyXG5cdFx0XHRcdFx0XHRcdFx0bW9udGhfc3RyLFxyXG5cdFx0XHRcdFx0XHRcdFx0ZXN0aW1hdGVfZW5lcmd5OiAoYWNjW3RpbWVfZnVsbF0gPyBhY2NbdGltZV9mdWxsXS5lc3RpbWF0ZV9lbmVyZ3kgOiAwKSArIGVzdGltYXRlX2VuZXJneSxcclxuXHRcdFx0XHRcdFx0XHRcdG1heF9hY3RpdmVFbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0XHRtaW5fYWN0aXZlRW5lcmd5XHJcblx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0XHRcdFx0XHR9LCB7fSkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmIChMaWJzLmlzQXJyYXlEYXRhKGRhdGFFbmVyZ3lNb250aCkpIHtcclxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaiA9IDAsIGxlbiA9IGRhdGFFbmVyZ3lNb250aC5sZW5ndGg7IGogPCBsZW47IGorKykge1xyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGFFbmVyZ3lNb250aFtqXS5lc3RpbWF0ZV9lbmVyZ3kpICYmICFMaWJzLmlzQmxhbmsoZGF0YUVuZXJneU1vbnRoW2pdLmFjdGl2ZUVuZXJneSkgJiYgZGF0YUVuZXJneU1vbnRoW2pdLmVzdGltYXRlX2VuZXJneSA+IDAgJiYgZGF0YUVuZXJneU1vbnRoW2pdLmFjdGl2ZUVuZXJneSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdGxldCBkaWZmRW5lcmd5ID0gZGF0YUVuZXJneU1vbnRoW2pdLmFjdGl2ZUVuZXJneSAtIGRhdGFFbmVyZ3lNb250aFtqXS5lc3RpbWF0ZV9lbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uZGlmZl9lbmVyZ3kgPSBMaWJzLnJvdW5kTnVtYmVyKGRpZmZFbmVyZ3ksIDApO1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLmRpZmZfcGVyY2VudCA9IExpYnMucm91bmROdW1iZXIoKGRpZmZFbmVyZ3kgLyBkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5KSAqIDEwMCwgMSk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5kaWZmX2VuZXJneSA9IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uZGlmZl9wZXJjZW50ID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIFRpbmggdGljaCBsdXlcclxuXHRcdFx0XHRcdFx0XHRpZiAoaiA9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uc3VtX2FjdGl2ZUVuZXJneSA9IGRhdGFFbmVyZ3lNb250aFtqXS5hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uc3VtX2VzdGltYXRlX2VuZXJneSA9IGRhdGFFbmVyZ3lNb250aFtqXS5lc3RpbWF0ZV9lbmVyZ3k7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YUVuZXJneU1vbnRoW2pdLmVzdGltYXRlX2VuZXJneSkgJiYgIUxpYnMuaXNCbGFuayhkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5KSAmJiBkYXRhRW5lcmd5TW9udGhbal0uZXN0aW1hdGVfZW5lcmd5ID4gMCAmJiBkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGlmZkVuZXJneSA9IGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fYWN0aXZlRW5lcmd5IC0gZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9lc3RpbWF0ZV9lbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZGlmZl9lbmVyZ3kgPSBMaWJzLnJvdW5kTnVtYmVyKGRpZmZFbmVyZ3ksIDApO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uc3VtX2RpZmZfcGVyY2VudCA9IExpYnMucm91bmROdW1iZXIoKGRpZmZFbmVyZ3kgLyBkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5KSAqIDEwMCwgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uc3VtX2RpZmZfZW5lcmd5ID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9kaWZmX3BlcmNlbnQgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uc3VtX2FjdGl2ZUVuZXJneSA9IChkYXRhRW5lcmd5TW9udGhbaiAtIDFdLnN1bV9hY3RpdmVFbmVyZ3kgKyBkYXRhRW5lcmd5TW9udGhbal0uYWN0aXZlRW5lcmd5KSA9PSAwID8gMCA6IExpYnMucm91bmROdW1iZXIoKGRhdGFFbmVyZ3lNb250aFtqIC0gMV0uc3VtX2FjdGl2ZUVuZXJneSArIGRhdGFFbmVyZ3lNb250aFtqXS5hY3RpdmVFbmVyZ3kpLCAwKTtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZXN0aW1hdGVfZW5lcmd5ID0gKGRhdGFFbmVyZ3lNb250aFtqIC0gMV0uc3VtX2VzdGltYXRlX2VuZXJneSArIGRhdGFFbmVyZ3lNb250aFtqXS5lc3RpbWF0ZV9lbmVyZ3kpID09IDAgPyAwIDogTGlicy5yb3VuZE51bWJlcigoZGF0YUVuZXJneU1vbnRoW2ogLSAxXS5zdW1fZXN0aW1hdGVfZW5lcmd5ICsgZGF0YUVuZXJneU1vbnRoW2pdLmVzdGltYXRlX2VuZXJneSksIDApO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9lc3RpbWF0ZV9lbmVyZ3kpICYmICFMaWJzLmlzQmxhbmsoZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9hY3RpdmVFbmVyZ3kpICYmIGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZXN0aW1hdGVfZW5lcmd5ID4gMCAmJiBkYXRhRW5lcmd5TW9udGhbal0uc3VtX2FjdGl2ZUVuZXJneSA+IDApIHtcclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGlmZkVuZXJneSA9IGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fYWN0aXZlRW5lcmd5IC0gZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9lc3RpbWF0ZV9lbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZGlmZl9lbmVyZ3kgPSBMaWJzLnJvdW5kTnVtYmVyKGRpZmZFbmVyZ3ksIDApO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW5lcmd5TW9udGhbal0uc3VtX2RpZmZfcGVyY2VudCA9IExpYnMucm91bmROdW1iZXIoKGRpZmZFbmVyZ3kgLyBkYXRhRW5lcmd5TW9udGhbal0uc3VtX2FjdGl2ZUVuZXJneSkgKiAxMDAsIDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVuZXJneU1vbnRoW2pdLnN1bV9kaWZmX2VuZXJneSA9IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbmVyZ3lNb250aFtqXS5zdW1fZGlmZl9wZXJjZW50ID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdGxldCBlbmVyZ3lNb250aCA9IGRhdGFFbmVyZ3lNb250aC5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdFx0XHRhY3RpdmVFbmVyZ3k6IGEuYWN0aXZlRW5lcmd5ICsgYi5hY3RpdmVFbmVyZ3ksXHJcblx0XHRcdFx0XHRcdFx0bWF4X2FjdGl2ZUVuZXJneTogTGlicy5yb3VuZE51bWJlcigoYS5tYXhfYWN0aXZlRW5lcmd5ICsgYi5tYXhfYWN0aXZlRW5lcmd5KSwgMSksXHJcblx0XHRcdFx0XHRcdFx0bWluX2FjdGl2ZUVuZXJneTogTGlicy5yb3VuZE51bWJlcigoYS5taW5fYWN0aXZlRW5lcmd5ICsgYi5taW5fYWN0aXZlRW5lcmd5KSwgMSlcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdGRhdGEuZW5lcmd5TW9udGggPSAhTGlicy5pc09iamVjdEVtcHR5KGVuZXJneU1vbnRoKSA/IGVuZXJneU1vbnRoLmFjdGl2ZUVuZXJneSA6IDA7XHJcblx0XHRcdFx0XHRkYXRhLm1heF9hY3RpdmVFbmVyZ3kgPSAhTGlicy5pc09iamVjdEVtcHR5KGVuZXJneU1vbnRoKSA/IGVuZXJneU1vbnRoLm1heF9hY3RpdmVFbmVyZ3kgOiAwO1xyXG5cdFx0XHRcdFx0ZGF0YS5taW5fYWN0aXZlRW5lcmd5ID0gIUxpYnMuaXNPYmplY3RFbXB0eShlbmVyZ3lNb250aCkgPyBlbmVyZ3lNb250aC5taW5fYWN0aXZlRW5lcmd5IDogMDtcclxuXHRcdFx0XHRcdGRhdGEucmV2ZW51ZSA9IExpYnMuZm9ybWF0TnVtKChlbmVyZ3lNb250aC5hY3RpdmVFbmVyZ3kgKiBkYXRhLmNvbmZpZ19yZXZlbnVlKSwgJyMsIyMjJyk7XHJcblxyXG5cclxuXHRcdFx0XHRcdGRhdGEuZGF0YUVuZXJneU1vbnRoID0gZGF0YUVuZXJneU1vbnRoO1xyXG5cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZGF0YSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRpZiAoY29ubikge1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgTWFpblJlcG9ydFNlcnZpY2U7XHJcbiJdfQ==