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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9NYWluUHJvamVjdFNlcnZpY2UuanMiXSwibmFtZXMiOlsiTWFpblByb2plY3RTZXJ2aWNlIiwiZGF0YSIsImNhbGxCYWNrIiwiZGIiLCJteVNxTERCIiwiYmVnaW5UcmFuc2FjdGlvbiIsImNvbm4iLCJkYXRhUHJvamVjdHMiLCJzY29wZSIsInF1ZXJ5Rm9yTGlzdCIsIkxpYnMiLCJpc0FycmF5RGF0YSIsImkiLCJsZW5ndGgiLCJpdGVtIiwiaWRfZW1wbG95ZWUiLCJsaXN0UHJvamVjdHMiLCJkYXRhQ2hpbGRzIiwicHVzaCIsImNvbW1pdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJyb2xsYmFjayIsImRhdGFMaXN0IiwiaXJyYWRpYW5jZSIsImlycmFkaWFuY2VBcnIiLCJpZF9wcm9qZWN0IiwiaXJyYWRpYW5jZVBvQSIsImFsZXJ0cyIsIkpTT04iLCJwYXJzZSIsImFsYXJtcyIsInJldmVudWUiLCJsaWZldGltZSIsImNvbmZpZ19yZXZlbnVlIiwiY2FsbGJhY2siLCJjb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcCIsInF1ZXJ5Rm9yT2JqZWN0IiwiZSIsImdldExhc3RSb3dJdGVtIiwidGFibGVfbmFtZSIsImlkIiwiYWN0aXZlRW5lcmd5IiwiYWN0aXZlUG93ZXIiLCJjdXJyZW50UGhhc2VBIiwiY3VycmVudFBoYXNlQiIsImN1cnJlbnRQaGFzZUMiLCJhY3RpdmVFbmVyZ3lSYXRlMSIsImFjdGl2ZUVuZXJneVJhdGUyIiwiYWN0aXZlRW5lcmd5UmF0ZTMiLCJwb3dlckZhY3RvciIsIkJhc2VTZXJ2aWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFDTUEsa0I7OztBQUNMLCtCQUFjO0FBQUE7O0FBQUE7QUFHYjs7QUFFRDs7Ozs7Ozs7Ozs7NENBTzBCQyxJLEVBQU1DLFEsRUFBVTtBQUN6QyxPQUFJQyxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxNQUFHRSxnQkFBSCxDQUFvQixn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cEMsSUFBaEMsQ0FBUDtBQUNBLFFBQUlFLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FELE9BQUdtQyxjQUFILENBQWtCLHdDQUFsQixFQUE0RHJDLElBQTVELEVBQWtFbUMsUUFBbEU7QUFDQSxJQUpELENBSUUsT0FBT0csQ0FBUCxFQUFVO0FBQ1hsQixZQUFRQyxHQUFSLENBQVlpQixDQUFaO0FBQ0EsV0FBT0gsU0FBUyxLQUFULEVBQWdCRyxDQUFoQixDQUFQO0FBQ0E7QUFDRDs7OztFQXpSK0JhLHFCOztrQkE2UmxCcEQsa0IiLCJmaWxlIjoiTWFpblByb2plY3RTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTZXJ2aWNlIGZyb20gJy4vQmFzZVNlcnZpY2UnO1xyXG5jbGFzcyBNYWluUHJvamVjdFNlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgYWxsXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMzAvMDcvMjAxOVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IEdyb3VwQXR0cmlidXRlc30gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cdGdldEFsbFByb2plY3RCeUVtcGxveWVlSWQoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dmFyIGRhdGFQcm9qZWN0cyA9IFtdO1xyXG5cdFx0XHRcdHZhciBzY29wZSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5Qcm9qZWN0LmdldEFsbFNjb3BlXCIsIGRhdGEpO1xyXG5cdFx0XHRcdGlmIChMaWJzLmlzQXJyYXlEYXRhKHNjb3BlKSkge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzY29wZS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHR2YXIgaXRlbSA9IHNjb3BlW2ldO1xyXG5cdFx0XHRcdFx0XHRpdGVtLmlkX2VtcGxveWVlID0gZGF0YS5pZF9lbXBsb3llZTtcclxuXHRcdFx0XHRcdFx0dmFyIGxpc3RQcm9qZWN0cyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1haW5Qcm9qZWN0LmdldEFsbFByb2plY3RCeUVtcGxveWVlSWRcIiwgaXRlbSk7XHJcblx0XHRcdFx0XHRcdGlmIChMaWJzLmlzQXJyYXlEYXRhKGxpc3RQcm9qZWN0cykgJiYgbGlzdFByb2plY3RzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRpdGVtLmRhdGFDaGlsZHMgPSBsaXN0UHJvamVjdHM7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YVByb2plY3RzLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGFQcm9qZWN0cyk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRjYWxsQmFjayh0cnVlLCBlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3QgcHJvamVjdCBieSBlbXBsb3llZSBpZFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdCBNYWluUHJvamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cdGdldExpc3RQcm9qZWN0QnlFbXBsb3llZShkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHQvLyB2YXIgZGF0YVByb2plY3RzID0gW107XHJcblx0XHRcdFx0dmFyIGRhdGFMaXN0ID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblByb2plY3QuZ2V0TGlzdFByb2plY3RCeUVtcGxveWVlXCIsIGRhdGEpO1xyXG5cdFx0XHRcdGlmIChMaWJzLmlzQXJyYXlEYXRhKGRhdGFMaXN0KSkge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhTGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHQvLyBnZXQgZ3JvdXAgZGV2aWNlXHJcblx0XHRcdFx0XHRcdHZhciBpdGVtID0gZGF0YUxpc3RbaV07XHJcblx0XHRcdFx0XHRcdC8vIHZhciBkZXZpY2VHcm91cEludmVydGVyID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblByb2plY3QuZ2V0R3JvdXBEZXZpY2VCeVByb2plY3RJZFwiLCBpdGVtKTtcclxuXHRcdFx0XHRcdFx0Ly8gdmFyIGVuZXJneV90b2RheSA9IDAsIGxpZmV0aW1lID0gMCwgYWN0aXZlUG93ZXIgPSAwLCBsYXN0X21vbnRoX2FjdGl2ZUVuZXJneSA9IDA7XHJcblx0XHRcdFx0XHRcdC8vIGlmIChkZXZpY2VHcm91cEludmVydGVyICYmIGRldmljZUdyb3VwSW52ZXJ0ZXIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIEdldCBkYXRhIGVuZXJneSBcclxuXHRcdFx0XHRcdFx0XHQvLyBsZXQgb2JqRGV2aWNlID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNYWluUHJvamVjdC5nZXREYXRhRGV2aWNlRW5lcmd5XCIsIHsgZGV2aWNlR3JvdXBJbnZlcnRlciB9KTtcclxuXHRcdFx0XHRcdFx0XHQvLyBpZiAob2JqRGV2aWNlKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRlbmVyZ3lfdG9kYXkgPSBvYmpEZXZpY2UudG9kYXlfYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0bGlmZXRpbWUgPSBvYmpEZXZpY2UubGlmZXRpbWU7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRhY3RpdmVQb3dlciA9IG9iakRldmljZS5hY3RpdmVQb3dlcjtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGxhc3RfbW9udGhfYWN0aXZlRW5lcmd5ID0gb2JqRGV2aWNlLmxhc3RfbW9udGhfYWN0aXZlRW5lcmd5O1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHRcdC8vIEdldCBpcnJhZGlhbmNlIGJ5IHByb2plY3RcclxuXHRcdFx0XHRcdFx0dmFyIGlycmFkaWFuY2UgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUHJvamVjdC5nZXRJcnJhZGlhbmNlQnlQcm9qZWN0SWRcIiwgaXRlbSk7XHJcblx0XHRcdFx0XHRcdHZhciBpcnJhZGlhbmNlQXJyID0gW107XHJcblx0XHRcdFx0XHRcdGlmKGlycmFkaWFuY2UubGVuZ3RoIDw9IDApe1xyXG5cdFx0XHRcdFx0XHRcdGlycmFkaWFuY2VBcnIgPSBbXHJcblx0XHRcdFx0XHRcdFx0XHR7IGlkX3Byb2plY3Q6ICcnLCBpcnJhZGlhbmNlUG9BOiBudWxsIH0sXHJcblx0XHRcdFx0XHRcdFx0XHR7IGlkX3Byb2plY3Q6ICcnLCBpcnJhZGlhbmNlUG9BOiBudWxsIH1cclxuXHRcdFx0XHRcdFx0XHRdO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGlycmFkaWFuY2VBcnIgPSBpcnJhZGlhbmNlOyBcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYoaXJyYWRpYW5jZUFyci5sZW5ndGggPT0gMSl7XHJcblx0XHRcdFx0XHRcdFx0aXJyYWRpYW5jZUFyci5wdXNoKHsgaWRfcHJvamVjdDogJycsIGlycmFkaWFuY2VQb0E6IG51bGwgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uYWxlcnRzID0gSlNPTi5wYXJzZShkYXRhTGlzdFtpXS5hbGFybXMpO1xyXG5cdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5pcnJhZGlhbmNlID0gaXJyYWRpYW5jZUFycjtcclxuXHJcblxyXG5cdFx0XHRcdFx0XHQvLyBkYXRhTGlzdFtpXS5lbmVyZ3lfdG9kYXkgPSBlbmVyZ3lfdG9kYXk7XHJcblx0XHRcdFx0XHRcdC8vIGRhdGFMaXN0W2ldLmxpZmV0aW1lID0gbGlmZXRpbWU7XHJcblx0XHRcdFx0XHRcdC8vIGRhdGFMaXN0W2ldLmxhc3RfbW9udGhfYWN0aXZlRW5lcmd5ID0gbGFzdF9tb250aF9hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0XHRcdC8vIGRhdGFMaXN0W2ldLmFjdGl2ZVBvd2VyID0gTGlicy5yb3VuZE51bWJlcigoYWN0aXZlUG93ZXIgLyAxMDAwKSwgMSk7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5yZXZlbnVlID0gKGRhdGFMaXN0W2ldLmxpZmV0aW1lIC8gMTAwMCkgKiBkYXRhTGlzdFtpXS5jb25maWdfcmV2ZW51ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGFMaXN0KTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBM4bqleSB04buVbmcgc+G7kSBkw7JuZ1xyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMThcclxuXHQgKiBAcGFyYW0ge09iamVjdCBVc2VyfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRnZXRMaXN0UHJvamVjdEJ5RW1wbG95ZWVTaXplKGRhdGEsIGNhbGxiYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRkYXRhID0gTGlicy5jb252ZXJ0RW1wdHlQcm9wVG9OdWxsUHJvcChkYXRhKTtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIucXVlcnlGb3JPYmplY3QoXCJNYWluUHJvamVjdC5nZXRMaXN0UHJvamVjdEJ5RW1wbG95ZWVTaXplXCIsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjayhmYWxzZSwgZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBHZXQgbGlzdCBwcm9qZWN0IHN1bW1hcnkgYnkgZW1wbG95ZWUgaWRcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAzMC8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3QgTWFpblByb2plY3R9IGRhdGFcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uIGNhbGxiYWNrfSBjYWxsYmFjayBcclxuXHQgKi9cclxuXHQgZ2V0TGlzdFBsYW50U3VtbWFyeShkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgZGF0YUxpc3QgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUHJvamVjdC5nZXRMaXN0R3JvdXBQcm9qZWN0XCIsIGRhdGEpO1xyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGFMaXN0KTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGxpc3QgcHJvamVjdCBieSBlbXBsb3llZSBpZFxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdCBNYWluUHJvamVjdH0gZGF0YVxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24gY2FsbGJhY2t9IGNhbGxiYWNrIFxyXG5cdCAqL1xyXG5cdCBnZXRMaXN0TWV0ZXJCeUVtcGxveWVlKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdC8vIHZhciBkYXRhUHJvamVjdHMgPSBbXTtcclxuXHRcdFx0XHR2YXIgZGF0YUxpc3QgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUHJvamVjdC5nZXRMaXN0TWV0ZXJCeUVtcGxveWVlXCIsIGRhdGEpO1xyXG5cdFx0XHRcdGlmIChMaWJzLmlzQXJyYXlEYXRhKGRhdGFMaXN0KSkgeyBcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0dmFyIGdldExhc3RSb3dJdGVtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNYWluUHJvamVjdC5nZXRMYXN0Um93SXRlbVwiLCB7IFxyXG5cdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGRhdGFMaXN0W2ldLnRhYmxlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0aWQ6IGRhdGFMaXN0W2ldLmlkXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRpZihnZXRMYXN0Um93SXRlbSl7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uYWN0aXZlRW5lcmd5ID0gZ2V0TGFzdFJvd0l0ZW0uYWN0aXZlRW5lcmd5ICogMTAwMDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5hY3RpdmVQb3dlciA9IGdldExhc3RSb3dJdGVtLmFjdGl2ZVBvd2VyO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFMaXN0W2ldLmN1cnJlbnRQaGFzZUEgPSBnZXRMYXN0Um93SXRlbS5jdXJyZW50UGhhc2VBO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFMaXN0W2ldLmN1cnJlbnRQaGFzZUIgPSBnZXRMYXN0Um93SXRlbS5jdXJyZW50UGhhc2VCO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFMaXN0W2ldLmN1cnJlbnRQaGFzZUMgPSBnZXRMYXN0Um93SXRlbS5jdXJyZW50UGhhc2VDO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFMaXN0W2ldLmFjdGl2ZUVuZXJneVJhdGUxID0gZ2V0TGFzdFJvd0l0ZW0uYWN0aXZlRW5lcmd5UmF0ZTE7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uYWN0aXZlRW5lcmd5UmF0ZTIgPSBnZXRMYXN0Um93SXRlbS5hY3RpdmVFbmVyZ3lSYXRlMjtcclxuXHRcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5hY3RpdmVFbmVyZ3lSYXRlMyA9IGdldExhc3RSb3dJdGVtLmFjdGl2ZUVuZXJneVJhdGUzO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFMaXN0W2ldLnBvd2VyRmFjdG9yID0gZ2V0TGFzdFJvd0l0ZW0ucG93ZXJGYWN0b3I7XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5hY3RpdmVFbmVyZ3kgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFMaXN0W2ldLmFjdGl2ZVBvd2VyID0gMDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5jdXJyZW50UGhhc2VBID0gMDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5jdXJyZW50UGhhc2VCID0gMDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5jdXJyZW50UGhhc2VDID0gMDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5hY3RpdmVFbmVyZ3lSYXRlMSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUxpc3RbaV0uYWN0aXZlRW5lcmd5UmF0ZTIgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFMaXN0W2ldLmFjdGl2ZUVuZXJneVJhdGUzID0gMDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhTGlzdFtpXS5wb3dlckZhY3RvciA9IDA7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIGlmIChMaWJzLmlzQXJyYXlEYXRhKGRhdGFMaXN0KSkgeyAgIFxyXG5cdFx0XHRcdC8vIFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhTGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdC8vIFx0XHQvLyBnZXQgZ3JvdXAgZGV2aWNlXHJcblx0XHRcdFx0Ly8gXHRcdHZhciBpdGVtID0gZGF0YUxpc3RbaV07XHJcblx0XHRcdFx0Ly8gXHRcdHZhciBkZXZpY2VHcm91cEludmVydGVyID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTWFpblByb2plY3QuZ2V0R3JvdXBEZXZpY2VCeVByb2plY3RJZFwiLCBpdGVtKTtcclxuXHRcdFx0XHQvLyBcdFx0Ly8gdmFyIGVuZXJneV90b2RheSA9IDAsIGxpZmV0aW1lID0gMCwgYWN0aXZlUG93ZXIgPSAwLCBsYXN0X21vbnRoX2FjdGl2ZUVuZXJneSA9IDA7XHJcblx0XHRcdFx0Ly8gXHRcdGlmIChkZXZpY2VHcm91cEludmVydGVyICYmIGRldmljZUdyb3VwSW52ZXJ0ZXIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdC8vIFx0XHRcdC8vIEdldCBkYXRhIGVuZXJneSBcclxuXHRcdFx0XHQvLyBcdFx0XHQvLyBsZXQgb2JqRGV2aWNlID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNYWluUHJvamVjdC5nZXREYXRhRGV2aWNlRW5lcmd5XCIsIHsgZGV2aWNlR3JvdXBJbnZlcnRlciB9KTtcclxuXHRcdFx0XHQvLyBcdFx0XHQvLyBpZiAob2JqRGV2aWNlKSB7XHJcblx0XHRcdFx0Ly8gXHRcdFx0Ly8gXHRlbmVyZ3lfdG9kYXkgPSBvYmpEZXZpY2UudG9kYXlfYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdC8vIFx0XHRcdC8vIFx0bGlmZXRpbWUgPSBvYmpEZXZpY2UubGlmZXRpbWU7XHJcblx0XHRcdFx0Ly8gXHRcdFx0Ly8gXHRhY3RpdmVQb3dlciA9IG9iakRldmljZS5hY3RpdmVQb3dlcjtcclxuXHRcdFx0XHQvLyBcdFx0XHQvLyBcdGxhc3RfbW9udGhfYWN0aXZlRW5lcmd5ID0gb2JqRGV2aWNlLmxhc3RfbW9udGhfYWN0aXZlRW5lcmd5O1xyXG5cclxuXHRcdFx0XHQvLyBcdFx0XHQvLyB9XHJcblx0XHRcdFx0Ly8gXHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gXHRcdC8vIEdldCBpcnJhZGlhbmNlIGJ5IHByb2plY3RcclxuXHRcdFx0XHQvLyBcdFx0dmFyIGlycmFkaWFuY2UgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNYWluUHJvamVjdC5nZXRJcnJhZGlhbmNlQnlQcm9qZWN0SWRcIiwgaXRlbSk7XHJcblx0XHRcdFx0Ly8gXHRcdHZhciBpcnJhZGlhbmNlQXJyID0gW107XHJcblx0XHRcdFx0Ly8gXHRcdGlmKGlycmFkaWFuY2UubGVuZ3RoIDw9IDApe1xyXG5cdFx0XHRcdC8vIFx0XHRcdGlycmFkaWFuY2VBcnIgPSBbXHJcblx0XHRcdFx0Ly8gXHRcdFx0XHR7IGlkX3Byb2plY3Q6ICcnLCBpcnJhZGlhbmNlUG9BOiBudWxsIH0sXHJcblx0XHRcdFx0Ly8gXHRcdFx0XHR7IGlkX3Byb2plY3Q6ICcnLCBpcnJhZGlhbmNlUG9BOiBudWxsIH1cclxuXHRcdFx0XHQvLyBcdFx0XHRdO1xyXG5cdFx0XHRcdC8vIFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vIFx0XHRcdGlycmFkaWFuY2VBcnIgPSBpcnJhZGlhbmNlOyBcclxuXHRcdFx0XHQvLyBcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBcdFx0aWYoaXJyYWRpYW5jZUFyci5sZW5ndGggPT0gMSl7XHJcblx0XHRcdFx0Ly8gXHRcdFx0aXJyYWRpYW5jZUFyci5wdXNoKHsgaWRfcHJvamVjdDogJycsIGlycmFkaWFuY2VQb0E6IG51bGwgfSk7XHJcblx0XHRcdFx0Ly8gXHRcdH1cclxuXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHQvLyBcdFx0ZGF0YUxpc3RbaV0uYWxlcnRzID0gSlNPTi5wYXJzZShkYXRhTGlzdFtpXS5hbGFybXMpO1xyXG5cdFx0XHRcdC8vIFx0XHRkYXRhTGlzdFtpXS5pcnJhZGlhbmNlID0gaXJyYWRpYW5jZUFycjtcclxuXHJcblxyXG5cdFx0XHRcdC8vIFx0XHQvLyBkYXRhTGlzdFtpXS5lbmVyZ3lfdG9kYXkgPSBlbmVyZ3lfdG9kYXk7XHJcblx0XHRcdFx0Ly8gXHRcdC8vIGRhdGFMaXN0W2ldLmxpZmV0aW1lID0gbGlmZXRpbWU7XHJcblx0XHRcdFx0Ly8gXHRcdC8vIGRhdGFMaXN0W2ldLmxhc3RfbW9udGhfYWN0aXZlRW5lcmd5ID0gbGFzdF9tb250aF9hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0Ly8gXHRcdC8vIGRhdGFMaXN0W2ldLmFjdGl2ZVBvd2VyID0gTGlicy5yb3VuZE51bWJlcigoYWN0aXZlUG93ZXIgLyAxMDAwKSwgMSk7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdC8vIFx0XHRkYXRhTGlzdFtpXS5yZXZlbnVlID0gKGRhdGFMaXN0W2ldLmxpZmV0aW1lIC8gMTAwMCkgKiBkYXRhTGlzdFtpXS5jb25maWdfcmV2ZW51ZTtcclxuXHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGRhdGFMaXN0KTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdGNhbGxCYWNrKHRydWUsIGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIEBkZXNjcmlwdGlvbiBM4bqleSB04buVbmcgc+G7kSBkw7JuZ1xyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDMwLzA3LzIwMThcclxuXHQgKiBAcGFyYW0ge09iamVjdCBVc2VyfSBkYXRhXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbiBjYWxsYmFja30gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRnZXRMaXN0TWV0ZXJCeUVtcGxveWVlU2l6ZShkYXRhLCBjYWxsYmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZGF0YSA9IExpYnMuY29udmVydEVtcHR5UHJvcFRvTnVsbFByb3AoZGF0YSk7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTWFpblByb2plY3QuZ2V0TGlzdE1ldGVyQnlFbXBsb3llZVNpemVcIiwgZGF0YSwgY2FsbGJhY2spO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBNYWluUHJvamVjdFNlcnZpY2U7XHJcbiJdfQ==