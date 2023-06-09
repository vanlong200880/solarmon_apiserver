import BaseService from './BaseService';
class ProjectGroupService extends BaseService {
	constructor() {
		super();

	}

	/**
	 * @description Get list
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object} data
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
			db.queryForList("ProjectGroup.getList", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}

	/**
	 * @description Get all
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object ProjectGroup} data
	 * @param {function callback} callback 
	 */
	getDropDownList(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.queryForList("ProjectGroup.getDropDownList", data, callback);
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
			db.queryForObject("ProjectGroup.getSize", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}

	/**
	 * @description Insert data
	 * @author Long.Pham
	 * @since 30/07/2019
	 * @param {Object ProjectGroup} data
	 */
	insert(data, callBack) {
		try {
			let self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.insert("ProjectGroup.insert", data);
					var curId = rs.insertId;
					if (!rs) {
						conn.rollback();
						callBack(true, {});
						return;
					}


					// insert table detail
					let dataDetail = data.data;
					if (dataDetail.length > 0) {
						for (var i = 0; i < dataDetail.length; i++) {
							dataDetail[i].id_project_group = curId;
						}
						await db.insert("ProjectGroup.insertProjectGroupDetail", { dataDetail });
					}


					conn.commit();
					callBack(false, rs);
				} catch (err) {
					console.log("Lỗi rolback", err);
					conn.rollback();
					callBack(true, err);
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
	 * @param {Object ProjectGroup} data
	 * @param {function callback} callback
	 */

	update(data, callBack) {
		let self = this;
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				var rs = await db.delete("ProjectGroup.deleteProjectGroupDetail", data);
				rs = await db.update("ProjectGroup.updateProjectGroup", data);
				if (!rs) {
					conn.rollback();
					callBack(false, {});
					return;
				}

				// insert table detail
				let dataDetail = data.data
				if (dataDetail.length > 0) {
					await db.insert("ProjectGroup.insertProjectGroupDetail", { dataDetail });
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
	 * @param {Object ProjectGroup} data
	 * @param {function callback} callback
	 */
	updateStatus(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.update("ProjectGroup.updateStatus", data, (err, rs) => {
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
	 * @param {Object ProjectGroup} data
	 * @param {function callback} callback
	 */
	delete(data, callback) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.delete("ProjectGroup.delete", data, (err, rs) => {
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
					var rs = await db.queryForList("ProjectGroup.getDetail", param);
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
	
}
export default ProjectGroupService;
