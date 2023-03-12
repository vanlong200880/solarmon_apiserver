import BaseService from './BaseService';
class ClientConfigService extends BaseService {
	constructor() {
		super();

	}

	/**
	 * @description Get device by project hash_id
	 * @author Long.Pham
	 * @since 12/09/2021
	 * @param {Object} data
	 * @param {function callback} callback 
	 */

	getListAllDeviceByProject(data, callBack) {
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				var rs = await db.queryForList("ClientConfig.getListAllDeviceByProject", data);
				if (!rs) {
					conn.rollback();
					callBack(false, {});
					return;
				}

				conn.commit();
				callBack(false, rs);
			} catch (err) {
				console.log("Lỗi rolback", err);
				conn.rollback();
				callBack(true, err);
			}
		});
	}


	
	/**
	* get detail
	* @param {*} data 
	* @param {*} callBack 
	*/
	getDeviceDetail(param, callBack) {
		try {
			var db = new mySqLDB();
			db.beginTransaction(async function (conn) {
				try {
					var rs = await db.queryForObject("ClientConfig.getDeviceDetail", param);
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
	 * @description Update data
	 * @author Long.Pham
	 * @since 11/07/2019
	 * @param {Object Role} data
	 * @param {function callback} callback
	 */

	 updateDevice(data, callBack) {
		let self = this;
		var db = new mySqLDB();
		db.beginTransaction(async function (conn) {
			try {
				var rs = await db.update("ClientConfig.updateDevice", data);
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
}
export default ClientConfigService;
