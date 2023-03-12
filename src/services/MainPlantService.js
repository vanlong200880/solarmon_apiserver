import BaseService from './BaseService';
import moment from 'moment';
class MainPlantService extends BaseService {
	constructor() {
		super();

	}

	/**
	* get detail project page plant
	* @param {*} data 
	* @param {*} callBack 
	*/

	getDetail(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var totalInverterOn = 0, totalInverter = 0;
					var rs = await db.queryForObject("MainPlant.getDetail", param);
					var getTotalInverter = await db.queryForObject("MainPlant.getTotalInverter", param);
					if (getTotalInverter) {
						totalInverter = getTotalInverter.totalInverter;
					}

					var deviceGroup = await db.queryForList("MainPlant.getGroupDeviceByProjectId", { id_project: rs.id });
					var irradiance = [], ambient_emperature = [], energy_today = 0, lifetime = 0, power_now = 0, dc_power = 0, consumption = 0, using_meter_consumption = 0;
					if (Libs.isArrayData(deviceGroup)) {
						for (var j = 0; j < deviceGroup.length; j++) {
							switch (deviceGroup[j].table_name) {
								case 'model_inverter_SMA_STP110':
								case 'model_inverter_SMA_STP50':
								case 'model_inverter_SMA_SHP75':
								case 'model_inverter_ABB_PVS100':
									let objDevice = await db.queryForObject("MainPlant.getDataDeviceEnergy", {
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
									let objDeviceIrradiance = await db.queryForList("MainPlant.getDataDeviceIrradiance", {
										id_project: rs.id,
										id_device_group: deviceGroup[j].id,
										table_name: deviceGroup[j].table_name
									});
									if (Libs.isArrayData(objDeviceIrradiance)) {
										irradiance = objDeviceIrradiance;
									}
									break;
								case 'model_sensor_IMT_TaRS485':
									let objDeviceAmbientEmperature = await db.queryForList("MainPlant.getDataDeviceAmbientEmperature", {
										id_project: rs.id,
										id_device_group: deviceGroup[j].id,
										table_name: deviceGroup[j].table_name
									});
									if (Libs.isArrayData(objDeviceAmbientEmperature)) {
										ambient_emperature = objDeviceAmbientEmperature;
									}
									break;
								case 'model_emeter_Vinasino_VSE3T5':
									let objConsumption = await db.queryForObject("MainPlant.getmeterConsumption", {
										id_project: rs.id,
										id_device_group: deviceGroup[j].id,
										table_name: deviceGroup[j].table_name
									});

									if (objConsumption) {
										using_meter_consumption = 1;
										consumption = (moment().format('H') < 19) ? objConsumption.activePower : 0;
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
					rs.today_revenue = (energy_today / 1000) * rs.config_revenue;
					rs.total_revenue = (lifetime / 1000) * rs.config_revenue;
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

	getChartData(param, callBack) {
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
						for (let i = 0, len = getGroupInverter.length; i < len; i++) {
							groupInverter.push(
								{
									hash_id: param.hash_id,
									id_device_group: getGroupInverter[i].id_device_group,
									start_date: Libs.convertAllFormatDate(param.start_date),
									end_date: Libs.convertAllFormatDate(param.end_date),
									table_name: getGroupInverter[i].table_name
								}
							);
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
								let curDate = Libs.convertAllFormatDate(param.end_date);
								var curDateFormat = moment(curDate).format('YYYY-MM-DD 05:00');
								for (var t = 0; t < 168; t++) {
									dataEnergyMerge.push({
										time_format: moment(curDateFormat).add(5 * t, 'minutes').format('YYYY-MM-DD HH:mm'),
										time_full: moment(curDateFormat).add(5 * t, 'minutes').format('DD/MM/YYYY HH:mm'),
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
											for (let k = 0, l = dataEnergyByDevice.length; k < l; k++) {
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
											dataEnergyMerge = Object.values([...dataEnergyMerge, ...dataEnergyByDevice].reduce((acc, { time_format, time_full, activePower, activeEnergy, group_day }) => {
												acc[time_format] = {
													time_format,
													time_full,
													activePower: Libs.roundNumber(((acc[time_format] ? acc[time_format].activePower : 0) + activePower), 1),
													activeEnergy: Libs.roundNumber(((acc[time_format] ? acc[time_format].activeEnergy : 0) + activeEnergy), 1),
													group_day
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
								let curDate15 = Libs.convertAllFormatDate(param.end_date);
								var curDateFormat15 = moment(curDate15).format('YYYY-MM-DD 05:00');
								let dataEnergyMerge15 = [];
								for (let t = 0; t <= 56; t++) {
									dataEnergyMerge15.push({
										time_format: moment(curDateFormat15).add(15 * t, 'minutes').format('YYYY-MM-DD HH:mm'),
										time_full: moment(curDateFormat15).add(15 * t, 'minutes').format('DD/MM/YYYY HH:mm'),
										activePower: 0,
										activeEnergy: 0,
										group_day: ''
									});
								}


								if(getListDeviceInverter.length > 0){
									for (var v = 0, len = getListDeviceInverter.length; v < len; v++) {
										getListDeviceInverter[v].start_date = Libs.convertAllFormatDate(param.start_date);
										getListDeviceInverter[v].end_date = Libs.convertAllFormatDate(param.end_date);
										var dataEnergyToday15 = await db.queryForList("MainPlant.dataEnergy15MinutesByDevice", getListDeviceInverter[v]);

										if (dataEnergyToday15.length > 0) {
											for (let k = 0, l = dataEnergyToday15.length; k < l; k++) {
												if (k === 0) {
													dataEnergyToday15[k].activeEnergy = 0;
												} else {
													var subEnergy = 0;
													if (dataEnergyToday15[k].today_activeEnergy > 0 && dataEnergyToday15[k - 1].today_activeEnergy > 0) {
														subEnergy = (dataEnergyToday15[k].today_activeEnergy - dataEnergyToday15[k - 1].today_activeEnergy) / 1000;
													}

													dataEnergyToday15[k].activeEnergy = Libs.roundNumber(subEnergy, 1);
												}
											}
											dataEnergyMerge15 = Object.values([...dataEnergyMerge15, ...dataEnergyToday15].reduce((acc, { time_format, time_full, activePower, activeEnergy, group_day }) => {
												acc[time_format] = {
													time_format,
													time_full,
													activePower: Libs.roundNumber(((acc[time_format] ? acc[time_format].activePower : 0) + activePower), 1),
													activeEnergy: Libs.roundNumber(((acc[time_format] ? acc[time_format].activeEnergy : 0) + activeEnergy), 1),
													group_day
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
								let curDate1h = Libs.convertAllFormatDate(param.end_date);
								var curDateFormat1h = moment(curDate1h).format('YYYY-MM-DD 05:00');
								let dataEnergyMerge1h = [];
								for (let t = 0; t <= 14; t++) {
									dataEnergyMerge1h.push({
										time_format: moment(curDateFormat1h).add(1 * t, 'hours').format('YYYY-MM-DD HH'),
										time_full: moment(curDateFormat1h).add(1 * t, 'hours').format('DD/MM/YYYY HH:mm'),
										activePower: 0,
										activeEnergy: 0,
										group_day: ''
									});
								}


								var dataEnergyToday1h = await db.queryForList("MainPlant.getDataEnergyHour", { groupInverter });
								dataEnergyMerge1h = Object.values([...dataEnergyMerge1h, ...dataEnergyToday1h].reduce((acc, { time_format, time_full, activePower, activeEnergy, group_day }) => {
									acc[time_format] = {
										time_format,
										time_full,
										activePower: Libs.roundNumber(((acc[time_format] ? acc[time_format].activePower : 0) + activePower), 1),
										activeEnergy: Libs.roundNumber(((acc[time_format] ? acc[time_format].activeEnergy : 0) + activeEnergy), 1),
										group_day
									};
									return acc;
								}, {}));


								dataEnergyToday = dataEnergyMerge1h;

							}

							break;
						case '3_day':
							// 5 minutes
							if (param.data_send_time == 1) {
								let startDate5 = '', endDate5 = '';
								for (let i = 0; i < 3; i++) {
									if (i === 0) {
										startDate5 = moment(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
										endDate5 = moment(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD 19:00');
										for (let j = 0, len = groupInverter.length; j < len; j++) {
											groupInverter[j].end_date = moment(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
										}
									} else {
										startDate5 = moment(Libs.addDays(Libs.convertAllFormatDate(param.start_date), i)).format('YYYY-MM-DD HH:mm');
										endDate5 = moment(Libs.addDays(Libs.convertAllFormatDate(param.start_date), i)).format('YYYY-MM-DD 19:00');
										for (let j = 0, len = groupInverter.length; j < len; j++) {
											groupInverter[j].start_date = moment(Libs.addDays(Libs.convertAllFormatDate(param.start_date), i)).format('YYYY-MM-DD HH:mm');
											groupInverter[j].end_date = moment(Libs.addDays(Libs.convertAllFormatDate(param.start_date), i)).format('YYYY-MM-DD 19:00');
										}
									}

									var getListDeviceInverter = await db.queryForList("MainPlant.getListDeviceInverter", param);
									var dataEnergyMerge5 = [];
									var curDateFormat = moment(startDate5).format('YYYY-MM-DD 05:00');
									for (var t = 0; t <= 168; t++) {
										dataEnergyMerge5.push({
											time_format: moment(curDateFormat).add(5 * t, 'minutes').format('YYYY-MM-DD HH:mm'),
											time_full: moment(curDateFormat).add(5 * t, 'minutes').format('DD/MM/YYYY HH:mm'),
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
												for (let k = 0, l = dataEnergyByDevice.length; k < l; k++) {
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
												dataEnergyMerge5 = Object.values([...dataEnergyMerge5, ...dataEnergyByDevice].reduce((acc, { time_format, time_full, activePower, activeEnergy, group_day }) => {
													acc[time_format] = {
														time_format,
														time_full,
														activePower: Libs.roundNumber(((acc[time_format] ? acc[time_format].activePower : 0) + activePower), 1),
														activeEnergy: Libs.roundNumber(((acc[time_format] ? acc[time_format].activeEnergy : 0) + activeEnergy), 1),
														group_day
													};
													return acc;
												}, {}));
											}
										}
									}

									dataEnergyToday.push(...dataEnergyMerge5);

								}
							}

							// 15 minutes
							if (param.data_send_time == 2) {
								for (let i = 0; i < 3; i++) {
									var curDate15 = '';
									if (i === 0) {
										curDate15 = moment(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
										for (let j = 0, len = groupInverter.length; j < len; j++) {
											groupInverter[j].end_date = moment(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
										}
									} else {
										curDate15 = moment(Libs.addDays(Libs.convertAllFormatDate(param.start_date), i)).format('YYYY-MM-DD HH:mm');
										for (let j = 0, len = groupInverter.length; j < len; j++) {
											groupInverter[j].start_date = moment(Libs.addDays(Libs.convertAllFormatDate(param.start_date), i)).format('YYYY-MM-DD HH:mm');
											groupInverter[j].end_date = moment(Libs.addDays(Libs.convertAllFormatDate(param.start_date), i)).format('YYYY-MM-DD 19:00');
										}
									}

									let dataEnergyArr = await db.queryForList("MainPlant.getDataEnergyFifteenMinutes", { groupInverter });
									if (dataEnergyArr.length > 0) {
										for (let i = 0, len = dataEnergyArr.length; i < len; i++) {
											if (i === 0) {
												dataEnergyArr[i].activeEnergy = 0;
											} else {
												let subEnergy = 0;
												if(dataEnergyArr[i].today_activeEnergy > 0 && dataEnergyArr[i - 1].today_activeEnergy > 0){
													subEnergy = Libs.roundNumber((dataEnergyArr[i].today_activeEnergy - dataEnergyArr[i - 1].today_activeEnergy), 1);
												}
												dataEnergyArr[i].activeEnergy = Libs.roundNumber((subEnergy > 5000 ? 0 : subEnergy), 1);
											}
										}
									}

									// genarete data 15 munites
									var curDateFormat15 = moment(curDate15).format('YYYY-MM-DD 05:00');
									let dataEnergyMerge15 = [];
									for (let t = 0; t <= 56; t++) {
										dataEnergyMerge15.push({
											time_format: moment(curDateFormat15).add(15 * t, 'minutes').format('YYYY-MM-DD HH:mm'),
											time_full: moment(curDateFormat15).add(15 * t, 'minutes').format('DD/MM/YYYY HH:mm'),
											activePower: 0,
											activeEnergy: 0,
											group_day: ''
										});
									}

									dataEnergyMerge15 = Object.values([...dataEnergyMerge15, ...dataEnergyArr].reduce((acc, { time_format, time_full, activePower, activeEnergy, group_day }) => {
										acc[time_format] = {
											time_format,
											time_full,
											activePower: Libs.roundNumber(((acc[time_format] ? acc[time_format].activePower : 0) + activePower), 1),
											activeEnergy: Libs.roundNumber(((acc[time_format] ? acc[time_format].activeEnergy : 0) + activeEnergy), 1),
											group_day
										};
										return acc;
									}, {}));

									dataEnergyToday.push(...dataEnergyMerge15);

								}
							}

							// 1 hour
							if (param.data_send_time == 3) {
								for (let i = 0; i < 3; i++) {
									let startDate1h = '';
									if (i === 0) {
										for (let j = 0, len = groupInverter.length; j < len; j++) {
											startDate1h = moment(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
											groupInverter[j].end_date = moment(Libs.addDays(Libs.convertAllFormatDate(param.end_date), -2)).format('YYYY-MM-DD HH:mm');
										}
									} else {
										for (let j = 0, len = groupInverter.length; j < len; j++) {
											startDate1h = moment(Libs.addDays(Libs.convertAllFormatDate(param.start_date), i)).format('YYYY-MM-DD HH:mm');
											groupInverter[j].start_date = moment(Libs.addDays(Libs.convertAllFormatDate(param.start_date), i)).format('YYYY-MM-DD HH:mm');
											groupInverter[j].end_date = moment(Libs.addDays(Libs.convertAllFormatDate(param.start_date), i)).format('YYYY-MM-DD 19:00');
										}
									}


									var curDateFormat1h = moment(startDate1h).format('YYYY-MM-DD 05:00');
									let dataEnergyMerge1h = [];
									for (let t = 0; t <= 14; t++) {
										dataEnergyMerge1h.push({
											time_format: moment(curDateFormat1h).add(1 * t, 'hours').format('YYYY-MM-DD HH'),
											time_full: moment(curDateFormat1h).add(1 * t, 'hours').format('DD/MM/YYYY HH:mm'),
											activePower: 0,
											activeEnergy: 0,
											group_day: ''
										});
									}

									var dataEnergyArr = await db.queryForList("MainPlant.getDataEnergyHour", { groupInverter });
									var dataEnergyToday1h = await db.queryForList("MainPlant.getDataEnergyHour", { groupInverter });
									dataEnergyMerge1h = Object.values([...dataEnergyMerge1h, ...dataEnergyArr].reduce((acc, { time_format, time_full, activePower, activeEnergy, group_day }) => {
										acc[time_format] = {
											time_format,
											time_full,
											activePower: Libs.roundNumber(((acc[time_format] ? acc[time_format].activePower : 0) + activePower), 1),
											activeEnergy: Libs.roundNumber(((acc[time_format] ? acc[time_format].activeEnergy : 0) + activeEnergy), 1),
											group_day
										};
										return acc;
									}, {}));

									dataEnergyToday.push(...dataEnergyMerge1h);
								}
							}

							break;
						case 'last_month':
						case 'this_month':
							dataEnergyToday = await db.queryForList("MainPlant.getDataEnergyThisMonth", { groupInverter });
							break;

						case '12_month':
							dataEnergyToday = await db.queryForList("MainPlant.getDataEnergy12Month", { groupInverter });
							break;

						case 'lifetime':
							if (!Libs.isBlank(param.total_year) && param.total_year < 1) {
								dataEnergyToday = await db.queryForList("MainPlant.getDataEnergy12Month", { groupInverter });
							} else {
								dataEnergyToday = await db.queryForList("MainPlant.getDataEnergyLifetime", { groupInverter });
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
}
export default MainPlantService;
