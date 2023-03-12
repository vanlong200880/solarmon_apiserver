import BaseService from './BaseService';
class ProjectService extends BaseService {
	constructor() {
		super();

	}

	/**
	 * @description Get list
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object Project} data
	 * @param {function callback} callback 
	 */
	getList(data, callback) {
		try {
			if (!Libs.isBlank(data)) {
				data.current_row = (typeof data.current_row == 'undefined') ? 0 : data.current_row;
				data.max_record = Constants.data.max_record;
			}
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForList("Project.getList", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}

	/**
	 * @description Lấy tổng số dòng
	 * @author Long.Pham
	 * @since 30/07/2018
	 * @param {Object User} data
	 * @param {function callback} callback
	 */
	getSize(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForObject("Project.getSize", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}

	/**
	 * @description Insert data
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object Project} data
	 */
	insertProject(data, callBack) {
		try {
			let self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {

					var rs = await db.insert("Project.insertProject", data);
					var curId = rs.insertId;

					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					// insert table Project detail
					let dataDetail = data.data;
					if (dataDetail.length > 0) {
						for (let i = 0; i < dataDetail.length; i++) {
							dataDetail[i].id_project = curId;
						}
						rs = await db.insert("Project.insertProjectDetail", { dataDetail });
					}

					let dataEmployees = data.dataEmployees;
					if (dataEmployees.length > 0) {
						for (let i = 0; i < dataEmployees.length; i++) {
							dataEmployees[i].id_project = curId;
						}
						rs = await db.insert("Project.insertProjectEmployeeMap", { dataEmployees });
					}

					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}
					conn.commit();
					callBack(true, {});
				} catch (err) {
					console.log("Lỗi rolback", err);
					conn.rollback();
					callBack(false, err);
				}
			})
		} catch (e) {
			console.log('error', e);
			callBack(false, e);
		}
	}


	/**
	 * @description Update data
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Project} data
	 * @param {function callback} callback
	 */
	updateProject(data, callBack) {
		let self = this;
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {

				var rs = await db.delete("Project.deleteProjectDetail", data);
				rs = await db.delete("Project.deleteEmployeeProjectMap", data);
				rs = await db.update("Project.updateProject", data);
				if (!rs) {
					conn.rollback();
					callBack(false, {});
					return;
				}

				// insert table Project detail
				let dataDetail = data.data;
				if (dataDetail.length > 0) {
					await db.insert("Project.insertProjectDetail", { dataDetail });
				}

				let dataEmployees = data.dataEmployees;
				if (dataEmployees.length > 0) {
					for (let i = 0; i < dataEmployees.length; i++) {
						dataEmployees[i].id_project = data.id;
					}
					rs = await db.insert("Project.insertProjectEmployeeMap", { dataEmployees });
				}


				conn.commit();
				callBack(true, {});
			} catch (err) {
				console.log("Lỗi rolback", err);
				conn.rollback();
				callBack(false, err);
			}
		})
	}


	/**
	 * @description Update data
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Project} data
	 * @param {function callback} callback
	 */
	updateProjectConfig(data, callBack) {
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {

				var rs = await db.queryForObject("Project.getConfigEstimate", data);
				if (rs) {
					rs = await db.update("Project.updateConfigEstimate", data);
				} else {
					rs = await db.insert("Project.insertConfigEstimate", data);
				}
				await db.delete("Project.deleteConfigRevenue", data);
				var dataConfigRevenue = data.dataConfigRevenue;
				if (dataConfigRevenue.length > 0) {
					for (var i = 0, len = dataConfigRevenue.length; i < len; i++) {
						dataConfigRevenue[i].id_project = data.id_project;
					}
					await db.insert("Project.insertConfigRevenue", { dataConfigRevenue });
				}

				if (!rs) {
					conn.rollback();
					callBack(false, {});
					return;
				}

				conn.commit();
				callBack(true, {});
			} catch (err) {
				console.log("Lỗi rolback", err);
				conn.rollback();
				callBack(false, err);
			}
		})
	}



	

	/**
	 * @description Update data
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Project} data
	 * @param {function callback} callback
	 */
	 saveMoveDevice(data, callBack) {
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				var dataList = data.dataList;
				if (dataList.length > 0) {
					for (var i = 0, len = dataList.length; i < len; i++) {
						await db.update("Project.saveMoveDevice", dataList[i]);
					}
				}

				conn.commit();
				callBack(true, {});
			} catch (err) {
				console.log("Lỗi rolback", err);
				conn.rollback();
				callBack(false, err);
			}
		})
	}

	
	/**
	 * @description Update data
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Project} data
	 * @param {function callback} callback
	 */
	 saveConfigEstimationSensor(data, callBack) {
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {

				var rs = await db.update("Project.saveConfigEstimationSensor", data);
				if (!rs) {
					conn.rollback();
					callBack(false, {});
					return;
				}

				conn.commit();
				callBack(true, {});
			} catch (err) {
				console.log("Lỗi rolback", err);
				conn.rollback();
				callBack(false, err);
			}
		})
	}



	/**
	 * @description Update status
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Project} data
	 * @param {function callback} callback
	 */
	updateStatus(data, callBack) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.update("Project.updateStatus", data, (err, rs) => {
				return callBack(err, rs)
			});
		} catch (e) {
			this.logger.error(e);
			callBack(false, e);
		}
	}

	/**
	 * @description Update is_delete = 1
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Project} data
	 * @param {function callback} callback
	 */
	delete(data, callBack) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.delete("Project.delete", data, (err, rs) => {
				return callBack(err, rs)
			});
		} catch (e) {
			this.logger.error(e);
			callBack(false, e);
		}
	}


	/**
	* get detail Project
	* @param {*} data 
	* @param {*} callBack 
	*/
	getDetail(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.queryForList("Project.getDetail", param);
					var data = rs[0][0];
					data.data = rs[1];
					data.dataEmployees = rs[2];
					data.dataConfigRevenue = rs[3];
					data.dataConfigEstimate = rs[4];
					conn.commit();
					callBack(false, data);
				} catch (err) {
					console.log("Lỗi rolback", err);
					conn.rollback();
					callBack(true, err);
				}
			});
		} catch (err) {
			// console.log('error get material order for voucher out', err);
			if (conn) {
				conn.rollback();
			}
			callBack(true, err);
		}
	}


	/**
	* get detail Project
	* @param {*} data 
	* @param {*} callBack 
	*/
	getDetailConfig(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.queryForList("Project.getDetailConfig", param);
					var data = rs[0][0] ? rs[0][0]: {};
					data.dataConfigRevenue = rs[1];
					conn.commit();
					callBack(false, data);
				} catch (err) {
					console.log("Lỗi rolback", err);
					conn.rollback();
					callBack(true, err);
				}
			});
		} catch (err) {
			// console.log('error get material order for voucher out', err);
			if (conn) {
				conn.rollback();
			}
			callBack(true, err);
		}
	}


	/**
	 * @description Get all
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object project} data
	 * @param {function callback} callback 
	 */
	getDropDownList(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForList("Project.getDropDownList", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}

}
export default ProjectService;
