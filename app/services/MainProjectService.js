"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseService2 = require("./BaseService");

var _BaseService3 = _interopRequireDefault(_BaseService2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainProjectService = function (_BaseService) {
	_inherits(MainProjectService, _BaseService);

	function MainProjectService() {
		_classCallCheck(this, MainProjectService);

		return _possibleConstructorReturn(this, (MainProjectService.__proto__ || Object.getPrototypeOf(MainProjectService)).call(this));
	}

	/**
  * @description Get all
  * @author Long.Pham
  * @since 30/07/2019
  * @param {Object GroupAttributes} data
  * @param {function callback} callback 
  */


	_createClass(MainProjectService, [{
		key: "getAllProjectByEmployeeId",
		value: function getAllProjectByEmployeeId(data, callBack) {
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

	}, {
		key: "getListProjectByEmployee",
		value: function getListProjectByEmployee(data, callBack) {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					// var dataProjects = [];
					var dataList = await db.queryForList("MainProject.getListProjectByEmployee", data);
					if (Libs.isArrayData(dataList)) {
						for (var i = 0; i < dataList.length; i++) {
							// get group device
							var item = dataList[i];
							var deviceGroupInverter = await db.queryForList("MainProject.getGroupDeviceByProjectId", item);
							// var energy_today = 0, lifetime = 0, activePower = 0, last_month_activeEnergy = 0;
							if (deviceGroupInverter && deviceGroupInverter.length > 0) {}
							// Get data energy 
							// let objDevice = await db.queryForObject("MainProject.getDataDeviceEnergy", { deviceGroupInverter });
							// if (objDevice) {
							// 	energy_today = objDevice.today_activeEnergy;
							// 	lifetime = objDevice.lifetime;
							// 	activePower = objDevice.activePower;
							// 	last_month_activeEnergy = objDevice.last_month_activeEnergy;

							// }


							// Get irradiance by project
							var irradiance = await db.queryForList("MainProject.getIrradianceByProjectId", item);
							var irradianceArr = [];
							if (irradiance.length <= 0) {
								irradianceArr = [{ id_project: '', irradiancePoA: null }, { id_project: '', irradiancePoA: null }];
							} else {
								irradianceArr = irradiance;
							}

							if (irradianceArr.length == 1) {
								irradianceArr.push({ id_project: '', irradiancePoA: null });
							}

							dataList[i].alerts = JSON.parse(dataList[i].alarms);
							dataList[i].irradiance = irradianceArr;

							// dataList[i].energy_today = energy_today;
							// dataList[i].lifetime = lifetime;
							// dataList[i].last_month_activeEnergy = last_month_activeEnergy;
							// dataList[i].activePower = Libs.roundNumber((activePower / 1000), 1);

							dataList[i].revenue = dataList[i].lifetime / 1000 * dataList[i].config_revenue;
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

	}, {
		key: "getListProjectByEmployeeSize",
		value: function getListProjectByEmployeeSize(data, callback) {
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

	}, {
		key: "getListPlantSummary",
		value: function getListPlantSummary(data, callBack) {
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

	}, {
		key: "getListMeterByEmployee",
		value: function getListMeterByEmployee(data, callBack) {
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
							if (getLastRowItem) {
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

	}, {
		key: "getListMeterByEmployeeSize",
		value: function getListMeterByEmployeeSize(data, callback) {
			try {
				data = Libs.convertEmptyPropToNullProp(data);
				var db = new mySqLDB();
				db.queryForObject("MainProject.getListMeterByEmployeeSize", data, callback);
			} catch (e) {
				console.log(e);
				return callback(false, e);
			}
		}
	}]);

	return MainProjectService;
}(_BaseService3.default);

exports.default = MainProjectService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9NYWluUHJvamVjdFNlcnZpY2UuanMiXSwibmFtZXMiOlsiTWFpblByb2plY3RTZXJ2aWNlIiwiZGF0YSIsImNhbGxCYWNrIiwiZGIiLCJteVNxTERCIiwiYmVnaW5UcmFuc2FjdGlvbiIsImNvbm4iLCJkYXRhUHJvamVjdHMiLCJzY29wZSIsInF1ZXJ5Rm9yTGlzdCIsIkxpYnMiLCJpc0FycmF5RGF0YSIsImkiLCJsZW5ndGgiLCJpdGVtIiwiaWRfZW1wbG95ZWUiLCJsaXN0UHJvamVjdHMiLCJkYXRhQ2hpbGRzIiwicHVzaCIsImNvbW1pdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJyb2xsYmFjayIsImRhdGFMaXN0IiwiZGV2aWNlR3JvdXBJbnZlcnRlciIsImlycmFkaWFuY2UiLCJpcnJhZGlhbmNlQXJyIiwiaWRfcHJvamVjdCIsImlycmFkaWFuY2VQb0EiLCJhbGVydHMiLCJKU09OIiwicGFyc2UiLCJhbGFybXMiLCJyZXZlbnVlIiwibGlmZXRpbWUiLCJjb25maWdfcmV2ZW51ZSIsImNhbGxiYWNrIiwiY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AiLCJxdWVyeUZvck9iamVjdCIsImUiLCJnZXRMYXN0Um93SXRlbSIsInRhYmxlX25hbWUiLCJpZCIsImFjdGl2ZUVuZXJneSIsImFjdGl2ZVBvd2VyIiwiY3VycmVudFBoYXNlQSIsImN1cnJlbnRQaGFzZUIiLCJjdXJyZW50UGhhc2VDIiwiYWN0aXZlRW5lcmd5UmF0ZTEiLCJhY3RpdmVFbmVyZ3lSYXRlMiIsImFjdGl2ZUVuZXJneVJhdGUzIiwicG93ZXJGYWN0b3IiLCJCYXNlU2VydmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBQ01BLGtCOzs7QUFDTCwrQkFBYztBQUFBOztBQUFBO0FBR2I7O0FBRUQ7Ozs7Ozs7Ozs7OzRDQU8wQkMsSSxFQUFNQyxRLEVBQVU7QUFDekMsT0FBSUMsS0FBSyxJQUFJQyxPQUFKLEVBQVQ7QUFD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QUFDQXJCLGNBQVMsSUFBVCxFQUFla0IsR0FBZjtBQUNBO0FBQ0QsSUEzRkQ7QUE0RkE7O0FBSUQ7Ozs7Ozs7Ozs7NkNBTzJCbkIsSSxFQUFNb0MsUSxFQUFVO0FBQzFDLE9BQUk7QUFDSHBDLFdBQU9TLEtBQUs0QiwwQkFBTCxDQUFnQ3JDLElBQWhDLENBQVA7QUFDQSxRQUFJRSxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxPQUFHb0MsY0FBSCxDQUFrQix3Q0FBbEIsRUFBNER0QyxJQUE1RCxFQUFrRW9DLFFBQWxFO0FBQ0EsSUFKRCxDQUlFLE9BQU9HLENBQVAsRUFBVTtBQUNYbkIsWUFBUUMsR0FBUixDQUFZa0IsQ0FBWjtBQUNBLFdBQU9ILFNBQVMsS0FBVCxFQUFnQkcsQ0FBaEIsQ0FBUDtBQUNBO0FBQ0Q7Ozs7RUF6UitCYSxxQjs7a0JBNlJsQnJELGtCIiwiZmlsZSI6Ik1haW5Qcm9qZWN0U2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2VydmljZSBmcm9tICcuL0Jhc2VTZXJ2aWNlJztcclxuY2xhc3MgTWFpblByb2plY3RTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGFsbFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMTlcclxuXHQgKiBAcGFyYW0ge09iamVjdCBHcm91cEF0dHJpYnV0ZXN9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHRnZXRBbGxQcm9qZWN0QnlFbXBsb3llZUlkKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciBkYXRhUHJvamVjdHMgPSBbXTtcclxuXHRcdFx0XHR2YXIgc2NvcGUgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUHJvamVjdC5nZXRBbGxTY29wZVwiLCBkYXRhKTtcclxuXHRcdFx0XHRpZiAoTGlicy5pc0FycmF5RGF0YShzY29wZSkpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2NvcGUubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0dmFyIGl0ZW0gPSBzY29wZVtpXTtcclxuXHRcdFx0XHRcdFx0aXRlbS5pZF9lbXBsb3llZSA9IGRhdGEuaWRfZW1wbG95ZWU7XHJcblx0XHRcdFx0XHRcdHZhciBsaXN0UHJvamVjdHMgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUHJvamVjdC5nZXRBbGxQcm9qZWN0QnlFbXBsb3llZUlkXCIsIGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRpZiAoTGlicy5pc0FycmF5RGF0YShsaXN0UHJvamVjdHMpICYmIGxpc3RQcm9qZWN0cy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0aXRlbS5kYXRhQ2hpbGRzID0gbGlzdFByb2plY3RzO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFQcm9qZWN0cy5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhUHJvamVjdHMpO1xyXG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgZXJyKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBsaXN0IHByb2plY3QgYnkgZW1wbG95ZWUgaWRcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3QgTWFpblByb2plY3R9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHRnZXRMaXN0UHJvamVjdEJ5RW1wbG95ZWUoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0Ly8gdmFyIGRhdGFQcm9qZWN0cyA9IFtdO1xyXG5cdFx0XHRcdHZhciBkYXRhTGlzdCA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5Qcm9qZWN0LmdldExpc3RQcm9qZWN0QnlFbXBsb3llZVwiLCBkYXRhKTtcclxuXHRcdFx0XHRpZiAoTGlicy5pc0FycmF5RGF0YShkYXRhTGlzdCkpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0Ly8gZ2V0IGdyb3VwIGRldmljZVxyXG5cdFx0XHRcdFx0XHR2YXIgaXRlbSA9IGRhdGFMaXN0W2ldO1xyXG5cdFx0XHRcdFx0XHR2YXIgZGV2aWNlR3JvdXBJbnZlcnRlciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5Qcm9qZWN0LmdldEdyb3VwRGV2aWNlQnlQcm9qZWN0SWRcIiwgaXRlbSk7XHJcblx0XHRcdFx0XHRcdC8vIHZhciBlbmVyZ3lfdG9kYXkgPSAwLCBsaWZldGltZSA9IDAsIGFjdGl2ZVBvd2VyID0gMCwgbGFzdF9tb250aF9hY3RpdmVFbmVyZ3kgPSAwO1xyXG5cdFx0XHRcdFx0XHRpZiAoZGV2aWNlR3JvdXBJbnZlcnRlciAmJiBkZXZpY2VHcm91cEludmVydGVyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBHZXQgZGF0YSBlbmVyZ3kgXHJcblx0XHRcdFx0XHRcdFx0Ly8gbGV0IG9iakRldmljZSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTWFpblByb2plY3QuZ2V0RGF0YURldmljZUVuZXJneVwiLCB7IGRldmljZUdyb3VwSW52ZXJ0ZXIgfSk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gaWYgKG9iakRldmljZSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0ZW5lcmd5X3RvZGF5ID0gb2JqRGV2aWNlLnRvZGF5X2FjdGl2ZUVuZXJneTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGxpZmV0aW1lID0gb2JqRGV2aWNlLmxpZmV0aW1lO1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0YWN0aXZlUG93ZXIgPSBvYmpEZXZpY2UuYWN0aXZlUG93ZXI7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRsYXN0X21vbnRoX2FjdGl2ZUVuZXJneSA9IG9iakRldmljZS5sYXN0X21vbnRoX2FjdGl2ZUVuZXJneTtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBHZXQgaXJyYWRpYW5jZSBieSBwcm9qZWN0XHJcblx0XHRcdFx0XHRcdHZhciBpcnJhZGlhbmNlID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblByb2plY3QuZ2V0SXJyYWRpYW5jZUJ5UHJvamVjdElkXCIsIGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHR2YXIgaXJyYWRpYW5jZUFyciA9IFtdO1xyXG5cdFx0XHRcdFx0XHRpZihpcnJhZGlhbmNlLmxlbmd0aCA8PSAwKXtcclxuXHRcdFx0XHRcdFx0XHRpcnJhZGlhbmNlQXJyID0gW1xyXG5cdFx0XHRcdFx0XHRcdFx0eyBpZF9wcm9qZWN0OiAnJywgaXJyYWRpYW5jZVBvQTogbnVsbCB9LFxyXG5cdFx0XHRcdFx0XHRcdFx0eyBpZF9wcm9qZWN0OiAnJywgaXJyYWRpYW5jZVBvQTogbnVsbCB9XHJcblx0XHRcdFx0XHRcdFx0XTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpcnJhZGlhbmNlQXJyID0gaXJyYWRpYW5jZTsgXHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGlmKGlycmFkaWFuY2VBcnIubGVuZ3RoID09IDEpe1xyXG5cdFx0XHRcdFx0XHRcdGlycmFkaWFuY2VBcnIucHVzaCh7IGlkX3Byb2plY3Q6ICcnLCBpcnJhZGlhbmNlUG9BOiBudWxsIH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGRhdGFMaXN0W2ldLmFsZXJ0cyA9IEpTT04ucGFyc2UoZGF0YUxpc3RbaV0uYWxhcm1zKTtcclxuXHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uaXJyYWRpYW5jZSA9IGlycmFkaWFuY2VBcnI7XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gZGF0YUxpc3RbaV0uZW5lcmd5X3RvZGF5ID0gZW5lcmd5X3RvZGF5O1xyXG5cdFx0XHRcdFx0XHQvLyBkYXRhTGlzdFtpXS5saWZldGltZSA9IGxpZmV0aW1lO1xyXG5cdFx0XHRcdFx0XHQvLyBkYXRhTGlzdFtpXS5sYXN0X21vbnRoX2FjdGl2ZUVuZXJneSA9IGxhc3RfbW9udGhfYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHQvLyBkYXRhTGlzdFtpXS5hY3RpdmVQb3dlciA9IExpYnMucm91bmROdW1iZXIoKGFjdGl2ZVBvd2VyIC8gMTAwMCksIDEpO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0ucmV2ZW51ZSA9IChkYXRhTGlzdFtpXS5saWZldGltZSAvIDEwMDApICogZGF0YUxpc3RbaV0uY29uZmlnX3JldmVudWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhTGlzdCk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHRcclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gTOG6pXkgdOG7lW5nIHPhu5EgZMOybmdcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE4XHJcblx0ICogQHBhcmFtIHtPYmplY3QgVXNlcn0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0Z2V0TGlzdFByb2plY3RCeUVtcGxveWVlU2l6ZShkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTWFpblByb2plY3QuZ2V0TGlzdFByb2plY3RCeUVtcGxveWVlU2l6ZVwiLCBkYXRhLCBjYWxsYmFjayk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3QgcHJvamVjdCBzdW1tYXJ5IGJ5IGVtcGxveWVlIGlkXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMzAvMDkvMjAyMVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IE1haW5Qcm9qZWN0fSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2sgXHJcblx0ICovXHJcblx0IGdldExpc3RQbGFudFN1bW1hcnkoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIGRhdGFMaXN0ID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblByb2plY3QuZ2V0TGlzdEdyb3VwUHJvamVjdFwiLCBkYXRhKTtcclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhTGlzdCk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEdldCBsaXN0IHByb2plY3QgYnkgZW1wbG95ZWUgaWRcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3QgTWFpblByb2plY3R9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHQgZ2V0TGlzdE1ldGVyQnlFbXBsb3llZShkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHQvLyB2YXIgZGF0YVByb2plY3RzID0gW107XHJcblx0XHRcdFx0dmFyIGRhdGFMaXN0ID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblByb2plY3QuZ2V0TGlzdE1ldGVyQnlFbXBsb3llZVwiLCBkYXRhKTtcclxuXHRcdFx0XHRpZiAoTGlicy5pc0FycmF5RGF0YShkYXRhTGlzdCkpIHsgXHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdHZhciBnZXRMYXN0Um93SXRlbSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTWFpblByb2plY3QuZ2V0TGFzdFJvd0l0ZW1cIiwgeyBcclxuXHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBkYXRhTGlzdFtpXS50YWJsZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdGlkOiBkYXRhTGlzdFtpXS5pZFxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0aWYoZ2V0TGFzdFJvd0l0ZW0pe1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFMaXN0W2ldLmFjdGl2ZUVuZXJneSA9IGdldExhc3RSb3dJdGVtLmFjdGl2ZUVuZXJneSAqIDEwMDA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uYWN0aXZlUG93ZXIgPSBnZXRMYXN0Um93SXRlbS5hY3RpdmVQb3dlcjtcclxuXHRcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5jdXJyZW50UGhhc2VBID0gZ2V0TGFzdFJvd0l0ZW0uY3VycmVudFBoYXNlQTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5jdXJyZW50UGhhc2VCID0gZ2V0TGFzdFJvd0l0ZW0uY3VycmVudFBoYXNlQjtcclxuXHRcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5jdXJyZW50UGhhc2VDID0gZ2V0TGFzdFJvd0l0ZW0uY3VycmVudFBoYXNlQztcclxuXHRcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5hY3RpdmVFbmVyZ3lSYXRlMSA9IGdldExhc3RSb3dJdGVtLmFjdGl2ZUVuZXJneVJhdGUxO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFMaXN0W2ldLmFjdGl2ZUVuZXJneVJhdGUyID0gZ2V0TGFzdFJvd0l0ZW0uYWN0aXZlRW5lcmd5UmF0ZTI7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uYWN0aXZlRW5lcmd5UmF0ZTMgPSBnZXRMYXN0Um93SXRlbS5hY3RpdmVFbmVyZ3lSYXRlMztcclxuXHRcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5wb3dlckZhY3RvciA9IGdldExhc3RSb3dJdGVtLnBvd2VyRmFjdG9yO1xyXG5cclxuXHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uYWN0aXZlRW5lcmd5ID0gMDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5hY3RpdmVQb3dlciA9IDA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uY3VycmVudFBoYXNlQSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uY3VycmVudFBoYXNlQiA9IDA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uY3VycmVudFBoYXNlQyA9IDA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uYWN0aXZlRW5lcmd5UmF0ZTEgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFMaXN0W2ldLmFjdGl2ZUVuZXJneVJhdGUyID0gMDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5hY3RpdmVFbmVyZ3lSYXRlMyA9IDA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0ucG93ZXJGYWN0b3IgPSAwO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBpZiAoTGlicy5pc0FycmF5RGF0YShkYXRhTGlzdCkpIHsgICBcclxuXHRcdFx0XHQvLyBcdGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHQvLyBcdFx0Ly8gZ2V0IGdyb3VwIGRldmljZVxyXG5cdFx0XHRcdC8vIFx0XHR2YXIgaXRlbSA9IGRhdGFMaXN0W2ldO1xyXG5cdFx0XHRcdC8vIFx0XHR2YXIgZGV2aWNlR3JvdXBJbnZlcnRlciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5Qcm9qZWN0LmdldEdyb3VwRGV2aWNlQnlQcm9qZWN0SWRcIiwgaXRlbSk7XHJcblx0XHRcdFx0Ly8gXHRcdC8vIHZhciBlbmVyZ3lfdG9kYXkgPSAwLCBsaWZldGltZSA9IDAsIGFjdGl2ZVBvd2VyID0gMCwgbGFzdF9tb250aF9hY3RpdmVFbmVyZ3kgPSAwO1xyXG5cdFx0XHRcdC8vIFx0XHRpZiAoZGV2aWNlR3JvdXBJbnZlcnRlciAmJiBkZXZpY2VHcm91cEludmVydGVyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHQvLyBcdFx0XHQvLyBHZXQgZGF0YSBlbmVyZ3kgXHJcblx0XHRcdFx0Ly8gXHRcdFx0Ly8gbGV0IG9iakRldmljZSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTWFpblByb2plY3QuZ2V0RGF0YURldmljZUVuZXJneVwiLCB7IGRldmljZUdyb3VwSW52ZXJ0ZXIgfSk7XHJcblx0XHRcdFx0Ly8gXHRcdFx0Ly8gaWYgKG9iakRldmljZSkge1xyXG5cdFx0XHRcdC8vIFx0XHRcdC8vIFx0ZW5lcmd5X3RvZGF5ID0gb2JqRGV2aWNlLnRvZGF5X2FjdGl2ZUVuZXJneTtcclxuXHRcdFx0XHQvLyBcdFx0XHQvLyBcdGxpZmV0aW1lID0gb2JqRGV2aWNlLmxpZmV0aW1lO1xyXG5cdFx0XHRcdC8vIFx0XHRcdC8vIFx0YWN0aXZlUG93ZXIgPSBvYmpEZXZpY2UuYWN0aXZlUG93ZXI7XHJcblx0XHRcdFx0Ly8gXHRcdFx0Ly8gXHRsYXN0X21vbnRoX2FjdGl2ZUVuZXJneSA9IG9iakRldmljZS5sYXN0X21vbnRoX2FjdGl2ZUVuZXJneTtcclxuXHJcblx0XHRcdFx0Ly8gXHRcdFx0Ly8gfVxyXG5cdFx0XHRcdC8vIFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFx0XHQvLyBHZXQgaXJyYWRpYW5jZSBieSBwcm9qZWN0XHJcblx0XHRcdFx0Ly8gXHRcdHZhciBpcnJhZGlhbmNlID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblByb2plY3QuZ2V0SXJyYWRpYW5jZUJ5UHJvamVjdElkXCIsIGl0ZW0pO1xyXG5cdFx0XHRcdC8vIFx0XHR2YXIgaXJyYWRpYW5jZUFyciA9IFtdO1xyXG5cdFx0XHRcdC8vIFx0XHRpZihpcnJhZGlhbmNlLmxlbmd0aCA8PSAwKXtcclxuXHRcdFx0XHQvLyBcdFx0XHRpcnJhZGlhbmNlQXJyID0gW1xyXG5cdFx0XHRcdC8vIFx0XHRcdFx0eyBpZF9wcm9qZWN0OiAnJywgaXJyYWRpYW5jZVBvQTogbnVsbCB9LFxyXG5cdFx0XHRcdC8vIFx0XHRcdFx0eyBpZF9wcm9qZWN0OiAnJywgaXJyYWRpYW5jZVBvQTogbnVsbCB9XHJcblx0XHRcdFx0Ly8gXHRcdFx0XTtcclxuXHRcdFx0XHQvLyBcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBcdFx0XHRpcnJhZGlhbmNlQXJyID0gaXJyYWRpYW5jZTsgXHJcblx0XHRcdFx0Ly8gXHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gXHRcdGlmKGlycmFkaWFuY2VBcnIubGVuZ3RoID09IDEpe1xyXG5cdFx0XHRcdC8vIFx0XHRcdGlycmFkaWFuY2VBcnIucHVzaCh7IGlkX3Byb2plY3Q6ICcnLCBpcnJhZGlhbmNlUG9BOiBudWxsIH0pO1xyXG5cdFx0XHRcdC8vIFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0Ly8gXHRcdGRhdGFMaXN0W2ldLmFsZXJ0cyA9IEpTT04ucGFyc2UoZGF0YUxpc3RbaV0uYWxhcm1zKTtcclxuXHRcdFx0XHQvLyBcdFx0ZGF0YUxpc3RbaV0uaXJyYWRpYW5jZSA9IGlycmFkaWFuY2VBcnI7XHJcblxyXG5cclxuXHRcdFx0XHQvLyBcdFx0Ly8gZGF0YUxpc3RbaV0uZW5lcmd5X3RvZGF5ID0gZW5lcmd5X3RvZGF5O1xyXG5cdFx0XHRcdC8vIFx0XHQvLyBkYXRhTGlzdFtpXS5saWZldGltZSA9IGxpZmV0aW1lO1xyXG5cdFx0XHRcdC8vIFx0XHQvLyBkYXRhTGlzdFtpXS5sYXN0X21vbnRoX2FjdGl2ZUVuZXJneSA9IGxhc3RfbW9udGhfYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdC8vIFx0XHQvLyBkYXRhTGlzdFtpXS5hY3RpdmVQb3dlciA9IExpYnMucm91bmROdW1iZXIoKGFjdGl2ZVBvd2VyIC8gMTAwMCksIDEpO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHQvLyBcdFx0ZGF0YUxpc3RbaV0ucmV2ZW51ZSA9IChkYXRhTGlzdFtpXS5saWZldGltZSAvIDEwMDApICogZGF0YUxpc3RbaV0uY29uZmlnX3JldmVudWU7XHJcblx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBkYXRhTGlzdCk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHRcclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gTOG6pXkgdOG7lW5nIHPhu5EgZMOybmdcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wNy8yMDE4XHJcblx0ICogQHBhcmFtIHtPYmplY3QgVXNlcn0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrXHJcblx0ICovXHJcblx0Z2V0TGlzdE1ldGVyQnlFbXBsb3llZVNpemUoZGF0YSwgY2FsbGJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEgPSBMaWJzLmNvbnZlcnRFbXB0eVByb3BUb051bGxQcm9wKGRhdGEpO1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5xdWVyeUZvck9iamVjdChcIk1haW5Qcm9qZWN0LmdldExpc3RNZXRlckJ5RW1wbG95ZWVTaXplXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgTWFpblByb2plY3RTZXJ2aWNlO1xyXG4iXX0=