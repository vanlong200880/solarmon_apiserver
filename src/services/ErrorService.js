import BaseService from './BaseService';
class ErrorService extends BaseService {
	constructor() {
		super();

	}

	/**
     * @description Get list
     * @author Long.Pham
     * @since 30/07/2019
     * @param {Object Error} data
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
			db.queryForList("Error.getList", data, callback);
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
			db.queryForObject("Error.getSize", data, callback);
		} catch (e) {
			console.log(e);
			return callback(false, e);
		}
	}

	/**
     * @description Insert data
     * @author Long.Pham
     * @since 30/07/2019
     * @param {Object Error} data
     */
	insertError(data, callBack) {
		try {
			let self = this;
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {

					var rs = await db.insert("Error.insertError", data);
					var curId = rs.insertId;
				
					if (!rs) {
						conn.rollback();
						callBack(false, {});
						return;
					}

					// insert table Error detail
					let dataDetail = data.data;
					if (dataDetail.length > 0) {
						for (let i = 0; i < dataDetail.length; i++) {
							dataDetail[i].id_error = curId;
						}
						rs = await db.insert("Error.insertErrorDetail", { dataDetail });
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
     * @param {Object Error} data
     * @param {function callback} callback
     */
	updateError(data, callBack) {
		let self = this;
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				
				var rs = await db.delete("Error.deleteErrorDetail", data);
				rs = await db.update("Error.updateError", data);
				if (!rs) {
					conn.rollback();
					callBack(false, {});
					return;
				}

				// insert table Error detail
				let dataDetail = data.data;
				if (dataDetail.length > 0) {
					await db.insert("Error.insertErrorDetail", { dataDetail });
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
     * @param {Object Error} data
     * @param {function callback} callback
     */
	updateStatus(data, callBack) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.update("Error.updateStatus", data, (err, rs) => {
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
     * @param {Object Error} data
     * @param {function callback} callback
     */
	delete(data, callBack) {
		try {
			data = Libs.convertEmptyPropToNullProp(data);
			var db = new mySqLDB();
			db.delete("Error.delete", data, (err, rs) => {
				return callBack(err, rs)
			});
		} catch (e) {
			this.logger.error(e);
			callBack(false, e);
		}
	}


	/**
	* get detail Error
	* @param {*} data 
	* @param {*} callBack 
	*/
	getDetail(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.queryForList("Error.getDetail", param);
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
			// console.log('error get material order for voucher out', err);
			if (conn) {
				conn.rollback();
			}
			callBack(true, err);
		}
	}
}
export default ErrorService;
