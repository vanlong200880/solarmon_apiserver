import BaseService from './BaseService';
class RoleService extends BaseService {
	constructor() {
		super();

	}

	/**
	 * @description Get list
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object Role} data
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
			db.queryForList("Role.getList", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}

	/**
	 * @description Get all
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object Role} data
	 * @param {function callback} callback 
	 */
	getDropDownList(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForList("Role.getDropDownList", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}

	/**
	 * @description Lấy tổng số dòng
	 * @author thanh.bay
	 * @since 30/07/2018
	 * @param {Object User} data
	 * @param {function callback} callback
	 */
	getSize(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForObject("Role.getSize", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}

	/**
	 * @description Insert data
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object Role} data
	 */
	insert(data, callBack) {
		try {
			let self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.insert("Role.insert", data);
					var curId = rs.insertId;
					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}
					

					// insert table category detail
					let dataDetail = data.data;
					if (dataDetail.length > 0) {
						for (var i = 0; i < dataDetail.length; i++) {
							dataDetail[i].id_role = curId;
						}
						await db.insert("Role.insertRoleDetail", { dataDetail });
					}

					// insert table role_screen_map
					var screenMap = await db.queryForList("Role.getScreenMap", data);
					if (Libs.isArrayData(screenMap)) {
						for (var i = 0; i < screenMap.length; i++) {
							await db.insert("Role.insertRoleScreenMap", { 
								id_role: curId, 
								id_screen: screenMap[i].id_screen,
								auths: screenMap[i].auths,
							 });
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
		} catch (e) {
			console.log('error', e);
			callBack(false, e);
		}
	}

	/**
	 * @description Update data
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Role} data
	 * @param {function callback} callback
	 */

	update(data, callBack) {
		let self = this;
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				var rs = await db.delete("Role.deleteRoleDetail", data);
				rs = await db.update("Role.updateRole", data);
				if (!rs) {
					conn.rollback();
					callBack(false, {});
					return;
				}

				// insert table detail
				let dataDetail = data.data
				if (dataDetail.length > 0) {
					await db.insert("Role.insertRoleDetail", { dataDetail });
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
	 * @param {Object Role} data
	 * @param {function callback} callback
	 */
	updateStatus(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.update("Role.updateStatus", data, (err, rs) => {
				return callback(err, rs)
			});
		} catch (e) {
			this.logger.error(e);
			callback(false, e);
		}
	}

	/**
	 * @description Update status -1
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Role} data
	 * @param {function callback} callback
	 */
	delete(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.delete("Role.delete", data, (err, rs) => {
				return callback(err, rs)
			});
		} catch (e) {
			this.logger.error(e);
			callback(false, e);
		}
	}

	/**
	* get detail
	* @param {*} data 
	* @param {*} callBack 
	*/
	getDetail(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.queryForList("Role.getDetail", param);
					var data = rs[0][0];
					data.data = rs[1];
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
	 * @description Get all
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object Roles} data
	 * @param {function callback} callback 
	 */
	getListScreenPermissions(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForList("Role.getListScreenPermissions", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}


	/**
	* update role company screeen
	* @param {*} data 
	* @param {*} callBack 
	*/
	async updateRolePermissions(data, callBack) {
		let self = this;
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				var update = db.update("Role.updateRolePermissions", data);
				if (!update) {
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





	async updateRoleMapScreen(data, callBack) {
		let self = this;
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				var screenMap = await db.queryForList("Role.getScreenMap", data);
				if (Libs.isArrayData(screenMap)) {
					for (var i = 0; i < screenMap.length; i++) {
						var checkExist = await db.queryForList("Role.checkExistRoleScreenMap", {id_role: data.id_role, id_screen: screenMap[i].id_screen});
						if (checkExist.length === 0) {
							await db.insert("Role.insertRoleScreenMap", { 
								id_role: data.id_role, 
								id_screen: screenMap[i].id_screen,
								auths: screenMap[i].auths,
							 });
						}
						
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

}
export default RoleService;
