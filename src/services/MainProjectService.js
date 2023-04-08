import BaseService from './BaseService';
class MainProjectService extends BaseService {
	constructor() {
		super();

	}

	/**
	 * @description Get all
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object GroupAttributes} data
	 * @param {function callback} callback 
	 */
	getAllProjectByEmployeeId(data, callBack) {
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				var dataProjects = [];
				var scope = await db.queryForList("MainProject.getAllScope", data);
				if (Libs.isArrayData(scope)) {
					for (var i = 0; i < scope.length; i++) {
						var item = scope[i];
						item.id_employee = data.id_employee;
						var listProjects = await db.queryForList("MainProject.getAllProjectByEmployeeId", item);
						if (Libs.isArrayData(listProjects) && listProjects.length > 0) {
							item.dataChilds = listProjects;
							dataProjects.push(item);
						}
					}
				}

				conn.commit();
				callBack(false, dataProjects);
			} catch (err) {
				console.log("Lỗi rolback", err);
				conn.rollback();
				callBack(true, err);
			}
		});
	}


	/**
	 * @description Get list project by employee id
	 * @author Long.Pham
	 * @since 30/09/2021
	 * @param {Object MainProject} data
	 * @param {function callback} callback 
	 */
	getListProjectByEmployee(data, callBack) {
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				// var dataProjects = [];
				var dataList = await db.queryForList("MainProject.getListProjectByEmployee", data);
				if (Libs.isArrayData(dataList)) {
					for (var i = 0; i < dataList.length; i++) {
						// get group device
						var item = dataList[i];
						// var deviceGroupInverter = await db.queryForList("MainProject.getGroupDeviceByProjectId", item);
						// var energy_today = 0, lifetime = 0, activePower = 0, last_month_activeEnergy = 0;
						// if (deviceGroupInverter && deviceGroupInverter.length > 0) {
							// Get data energy 
							// let objDevice = await db.queryForObject("MainProject.getDataDeviceEnergy", { deviceGroupInverter });
							// if (objDevice) {
							// 	energy_today = objDevice.today_activeEnergy;
							// 	lifetime = objDevice.lifetime;
							// 	activePower = objDevice.activePower;
							// 	last_month_activeEnergy = objDevice.last_month_activeEnergy;

							// }
						// }

						// Get irradiance by project
						var irradiance = await db.queryForList("MainProject.getIrradianceByProjectId", item);
						var irradianceArr = [];
						if(irradiance.length <= 0){
							irradianceArr = [
								{ id_project: '', irradiancePoA: null },
								{ id_project: '', irradiancePoA: null }
							];
						} else {
							irradianceArr = irradiance; 
						}

						if(irradianceArr.length == 1){
							irradianceArr.push({ id_project: '', irradiancePoA: null });
						}

					
						dataList[i].alerts = JSON.parse(dataList[i].alarms);
						dataList[i].irradiance = irradianceArr;


						// dataList[i].energy_today = energy_today;
						// dataList[i].lifetime = lifetime;
						// dataList[i].last_month_activeEnergy = last_month_activeEnergy;
						// dataList[i].activePower = Libs.roundNumber((activePower / 1000), 1);
						
						dataList[i].revenue = (dataList[i].lifetime / 1000) * dataList[i].config_revenue;
					}
				}

				conn.commit();
				callBack(false, dataList);
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
	 * @since 30/07/2018
	 * @param {Object User} data
	 * @param {function callback} callback
	 */
	getListProjectByEmployeeSize(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForObject("MainProject.getListProjectByEmployeeSize", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}



	/**
	 * @description Get list project summary by employee id
	 * @author Long.Pham
	 * @since 30/09/2021
	 * @param {Object MainProject} data
	 * @param {function callback} callback 
	 */
	 getListPlantSummary(data, callBack) {
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				
				var dataList = await db.queryForList("MainProject.getListGroupProject", data);
				conn.commit();
				callBack(false, dataList);
			} catch (err) {
				console.log("Lỗi rolback", err);
				conn.rollback();
				callBack(true, err);
			}
		});
	}



	/**
	 * @description Get list project by employee id
	 * @author Long.Pham
	 * @since 30/09/2021
	 * @param {Object MainProject} data
	 * @param {function callback} callback 
	 */
	 getListMeterByEmployee(data, callBack) {
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				// var dataProjects = [];
				var dataList = await db.queryForList("MainProject.getListMeterByEmployee", data);
				if (Libs.isArrayData(dataList)) { 
					for (var i = 0; i < dataList.length; i++) {
						var getLastRowItem = await db.queryForObject("MainProject.getLastRowItem", { 
							table_name: dataList[i].table_name,
							id: dataList[i].id
						});
						if(getLastRowItem){
							dataList[i].activeEnergy = getLastRowItem.activeEnergy * 1000;
							dataList[i].activePower = getLastRowItem.activePower;
							dataList[i].currentPhaseA = getLastRowItem.currentPhaseA;
							dataList[i].currentPhaseB = getLastRowItem.currentPhaseB;
							dataList[i].currentPhaseC = getLastRowItem.currentPhaseC;
							dataList[i].activeEnergyRate1 = getLastRowItem.activeEnergyRate1;
							dataList[i].activeEnergyRate2 = getLastRowItem.activeEnergyRate2;
							dataList[i].activeEnergyRate3 = getLastRowItem.activeEnergyRate3;
							dataList[i].powerFactor = getLastRowItem.powerFactor;


						} else {
							dataList[i].activeEnergy = 0;
							dataList[i].activePower = 0;
							dataList[i].currentPhaseA = 0;
							dataList[i].currentPhaseB = 0;
							dataList[i].currentPhaseC = 0;
							dataList[i].activeEnergyRate1 = 0;
							dataList[i].activeEnergyRate2 = 0;
							dataList[i].activeEnergyRate3 = 0;
							dataList[i].powerFactor = 0;
						}
						
					}
				}
				// if (Libs.isArrayData(dataList)) {   
				// 	for (var i = 0; i < dataList.length; i++) {
				// 		// get group device
				// 		var item = dataList[i];
				// 		var deviceGroupInverter = await db.queryForList("MainProject.getGroupDeviceByProjectId", item);
				// 		// var energy_today = 0, lifetime = 0, activePower = 0, last_month_activeEnergy = 0;
				// 		if (deviceGroupInverter && deviceGroupInverter.length > 0) {
				// 			// Get data energy 
				// 			// let objDevice = await db.queryForObject("MainProject.getDataDeviceEnergy", { deviceGroupInverter });
				// 			// if (objDevice) {
				// 			// 	energy_today = objDevice.today_activeEnergy;
				// 			// 	lifetime = objDevice.lifetime;
				// 			// 	activePower = objDevice.activePower;
				// 			// 	last_month_activeEnergy = objDevice.last_month_activeEnergy;

				// 			// }
				// 		}

				// 		// Get irradiance by project
				// 		var irradiance = await db.queryForList("MainProject.getIrradianceByProjectId", item);
				// 		var irradianceArr = [];
				// 		if(irradiance.length <= 0){
				// 			irradianceArr = [
				// 				{ id_project: '', irradiancePoA: null },
				// 				{ id_project: '', irradiancePoA: null }
				// 			];
				// 		} else {
				// 			irradianceArr = irradiance; 
				// 		}

				// 		if(irradianceArr.length == 1){
				// 			irradianceArr.push({ id_project: '', irradiancePoA: null });
				// 		}

					
				// 		dataList[i].alerts = JSON.parse(dataList[i].alarms);
				// 		dataList[i].irradiance = irradianceArr;


				// 		// dataList[i].energy_today = energy_today;
				// 		// dataList[i].lifetime = lifetime;
				// 		// dataList[i].last_month_activeEnergy = last_month_activeEnergy;
				// 		// dataList[i].activePower = Libs.roundNumber((activePower / 1000), 1);
						
				// 		dataList[i].revenue = (dataList[i].lifetime / 1000) * dataList[i].config_revenue;
				// 	}
				// }

				conn.commit();
				callBack(false, dataList);
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
	 * @since 30/07/2018
	 * @param {Object User} data
	 * @param {function callback} callback
	 */
	getListMeterByEmployeeSize(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForObject("MainProject.getListMeterByEmployeeSize", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}


}
export default MainProjectService;
