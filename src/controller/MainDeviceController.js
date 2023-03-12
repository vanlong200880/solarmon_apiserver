import BaseController from '../core/BaseController';
import MainDeviceService from '../services/MainDeviceService';
import DeviceEntity from '../entities/DeviceEntity';
import DeviceControlCalendarEntity from '../entities/DeviceControlCalendarEntity';
import ProjectEntity from '../entities/ProjectEntity';
import DeviceControlCalendarValidate from '../validator/DeviceControlCalendarValidate';
import Sync from 'sync';
import FLHttp from '../utils/FLHttp';

class MainDeviceController extends BaseController {
    constructor() {
        super();
    }


    /**
     * @description Get List item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {} res 
     * @param {*} postData 
     */
    getListInverter(res, postData) {

        try {
            let service = new MainDeviceService();
            let entity = new DeviceEntity();
            entity = Object.assign({}, entity, postData);
            service.getListInverter(entity, function (err, rs) {
                if (!err) {
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    }
                    res.send(resData);
                } else {
                    resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    res.send(resData);
                }
            });
        } catch (e) {
            this.logger.error("Lỗi: " + e);
            var resData = {};
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }

    /**
     * @description Get List item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {} res 
     * @param {*} postData 
     */
    getList(res, postData) {

        try {
            let service = new MainDeviceService();
            let entity = new DeviceEntity();
            entity = Object.assign({}, entity, postData);
            service.getList(entity, function (err, rs) {
                if (!err) {
                    service.getSize(entity, function (err1, rs1) {
                        if (!err1) {
                            resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, rs1.totalRow);
                        } else {
                            resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                        }
                        res.send(resData);
                    });
                } else {
                    resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    res.send(resData);
                }
            });
        } catch (e) {
            this.logger.error("Lỗi: " + e);
            var resData = {};
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }



    /**
     * @description Get List parameter by device id
     * @author Long.Pham
     * @since 14/09/2021
     * @param {} res 
     * @param {*} postData 
     */
    getListParameterByDevice(res, postData) {
        try {
            let service = new MainDeviceService();
            let entity = new DeviceEntity();
            entity = Object.assign({}, entity, postData);
            service.getListParameterByDevice(entity, function (err, rs) {
                if (!err) {
                    resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
                    res.send(resData);
                } else {
                    resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    res.send(resData);
                }
            });
        } catch (e) {
            this.logger.error("Lỗi: " + e);
            var resData = {};
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }



    /**
     * @description Get List alert by device id
     * @author Long.Pham
     * @since 10/09/2021
     * @param {} res 
     * @param {*} postData 
     */
    getListAlertByDevice(res, postData) {
        try {
            let service = new MainDeviceService();
            let entity = new DeviceEntity();
            entity = Object.assign({}, entity, postData);
            if (!Libs.isBlank(entity.date_from)) {
                entity.date_from = Libs.convertStr2DateV01(entity.date_from, "dd/mm/yyyy", "/");
            }

            if (!Libs.isBlank(entity.date_to)) {
                entity.date_to = Libs.convertStr2DateV01(entity.date_to, "dd/mm/yyyy", "/");
            }

            service.getListAlertByDevice(entity, function (err, rs) {
                if (!err) {
                    service.getListAlertByDeviceSize(entity, function (err1, rs1) {
                        if (!err1) {
                            resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, rs1.totalRow);
                        } else {
                            resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                        }
                        res.send(resData);
                    });
                } else {
                    resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    res.send(resData);
                }
            });
        } catch (e) {
            this.logger.error("Lỗi: " + e);
            var resData = {};
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }

    }

    /**
     * @description Save action
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    async saveAction(res, postData) {

    }


    /**
     * @description Delete item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    deleteAction(res, postData) {

    }



    /**
     * @description Save action
     * @author Long.Pham
     * @since 11/07/2019
     * @param {*} res 
     * @param {*} postData 
     */
    async updateOnOff(res, postData) {
        try {
            let service = new MainDeviceService();
            let entity = Object.assign({}, new DeviceEntity(), postData);
            entity.status = (!entity.status || entity.status == -1) ? 0 : 1;

            if (Libs.isBlank(entity.id)) {
                var resData = {};
                resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                res.send(resData);
                return;
            }

            // get Techedge device
            let deviceTechEdge = await service.getDeviceTechEdge(entity);
            if (Libs.isObjectEmpty(deviceTechEdge)) {
                let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                res.send(resData);
                return;
            }

            var params = {
                timestamp: new Date().getTime(),
                "deviceID": deviceTechEdge.id_device,
                type: "scheduleControl",
                payload: [
                    {
                        param: "commands",
                        value: [
                            {
                                "deviceID": entity.id_device,
                                "command": entity.status == 1 ? "on" : "off"
                            }
                        ]
                    }]
            }


            if (Libs.isObjectEmpty(params)) {
                let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                res.send(resData);
                return;
            }

            let http = new FLHttp();
            http.setHeader({
                contentType: "application/json",
                method: "POST"
            });


            http.post(Constants.api_control_url + '/control/cmd', params, (status, rs) => {
                console.log(status, rs);
                var data = rs.data;
                if (status && rs.status == 200 && data && data.status == 'OK') {
                    Sync(function () {
                        service.updateOnOff(entity, function (err, rsupdate) {
                            try {
                                if (!rsupdate) {
                                    let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                    res.send(resData);
                                    return;
                                }
                                let resData = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                                res.send(resData);
                            } catch (error) {
                                let resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                                res.send(resData);
                            }
                        });
                    });
                } else {
                    let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                    res.send(resData);
                    return;
                }
            });


        } catch (e) {
            var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }





    /**
    * @description Save action
    * @author Long.Pham
    * @since 11/07/2019
    * @param {*} res 
    * @param {*} postData 
    */
    async saveControlCalendar(res, postData) {
        try {
            let service = new MainDeviceService();
            let entity = Object.assign({}, new DeviceControlCalendarEntity(), postData);
            let validate = new DeviceControlCalendarValidate();

            let errors = await validate.FLValidationAll(entity);
            if (errors != null) {
                errors.validate = false;
                res.send(Libs.returnJsonResult(false, "", errors, 0));
                return;
            }

            if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                Sync(function () {
                    service.saveControlCalendar(entity, async function (err, rs) {
                        if (rs && err) {
                            // get Techedge device
                            let deviceTechEdge = await service.getDeviceTechEdge(entity);
                            if (Libs.isObjectEmpty(deviceTechEdge)) {
                                let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                                res.send(resData);
                                return;
                            }

                            service.getListBySiteControlCalendar(entity, function (err, rs) {
                                if (!err) {
                                    var devices = [];
                                    for (var i = 0; i < rs.length; i++) {
                                        devices.push({
                                            device_id: rs[i].id,
                                            deviceID: rs[i].id_device,
                                            dateFrom: rs[i].date_from,
                                            dateTo: rs[i].date_to,
                                            command: "off"
                                        });
                                    }

                                    var params = {
                                        timestamp: new Date().getTime(),
                                        deviceID: deviceTechEdge.id_device,
                                        type: "scheduleControl",
                                        payload: [
                                            {
                                                param: "schedule",
                                                value: devices
                                            }
                                        ]
                                    };

                                    let http = new FLHttp();
                                    http.setHeader({
                                        contentType: "application/json",
                                        method: "POST"
                                    });

                                    http.post(Constants.api_control_url + '/control/cmd', params, (status, rs) => {
                                        var data = rs.data;
                                        if (status && rs.status == 200 && data && data.status == 'OK') {
                                            let resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                                            res.send(resData);
                                        } else {
                                            let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                                            res.send(resData);
                                            return;
                                        }
                                    });
                                } else {
                                    resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                                    res.send(resData);
                                }
                            });



                        } else {
                            let resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                            res.send(resData);
                        }
                    });
                });
            }

        } catch (e) {
            var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }



    /**
     * @description Get List item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {} res 
     * @param {*} postData 
     */
    getListControlCalendar(res, postData) {
        try {
            let service = new MainDeviceService();
            let entity = new DeviceControlCalendarEntity();
            entity = Object.assign({}, entity, postData);
            service.getListControlCalendar(entity, function (err, rs) {
                if (!err) {
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    }
                    res.send(resData);
                } else {
                    resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    res.send(resData);
                }
            });
        } catch (e) {
            this.logger.error("Lỗi: " + e);
            var resData = {};
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }



    /**
    * @description Save action
    * @author Long.Pham
    * @since 11/07/2019
    * @param {*} res 
    * @param {*} postData 
    */
    async saveArrControlCalendar(res, postData) {
        try {
            let service = new MainDeviceService();
            let entity = Object.assign({}, new DeviceControlCalendarEntity(), postData);
            let validate = new DeviceControlCalendarValidate();

            let errors = await validate.FLValidationAll(entity);
            if (errors != null) {
                errors.validate = false;
                res.send(Libs.returnJsonResult(false, "", errors, 0));
                return;
            }

            if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                // get Techedge device
                let deviceTechEdge = await service.getDeviceTechEdge(entity);
                if (Libs.isObjectEmpty(deviceTechEdge)) {
                    let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                    res.send(resData);
                    return;
                }

                var dataDevices = entity.dataDevices;
                if (!Libs.isArrayData(dataDevices)) {
                    let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                    res.send(resData);
                    return;
                }

                var devices = [];
                for (var i = 0; i < dataDevices.length; i++) {
                    devices.push({
                        device_id: dataDevices[i].id,
                        deviceID: dataDevices[i].id_device,
                        dateFrom: entity.date_from,
                        dateTo: entity.date_to,
                        command: "off"
                    });
                }

                if (!Libs.isArrayData(devices)) {
                    let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                    res.send(resData);
                    return;
                }

                var params = {
                    timestamp: new Date().getTime(),
                    deviceID: deviceTechEdge.id_device,
                    type: "scheduleControl",
                    payload: [
                        {
                            param: "schedule",
                            value: devices
                        }
                    ]
                };

                let http = new FLHttp();
                http.setHeader({
                    contentType: "application/json",
                    method: "POST"
                });


                http.post(Constants.api_control_url + '/control/cmd', params, (status, rs) => {
                    var data = rs.data;
                    if (status && rs.status == 200 && data && data.status == 'OK') {
                        Sync(function () {
                            service.saveArrControlCalendar(entity, function (err, rs) {
                                if (rs && err) {
                                    let resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                                    res.send(resData);
                                } else {
                                    let resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                                    res.send(resData);
                                }
                            });
                        });

                    } else {
                        let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                        res.send(resData);
                        return;
                    }
                });


            }

        } catch (e) {
            var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }




    /**
     * @description Get List item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {} res 
     * @param {*} postData 
     */
    getListBySiteControlCalendar(res, postData) {
        try {
            let service = new MainDeviceService();
            let entity = new DeviceControlCalendarEntity();
            entity = Object.assign({}, entity, postData);
            service.getListBySiteControlCalendar(entity, function (err, rs) {
                if (!err) {
                    if (!err) {
                        resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    }
                    res.send(resData);
                } else {
                    resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                    res.send(resData);
                }
            });
        } catch (e) {
            this.logger.error("Lỗi: " + e);
            var resData = {};
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }



    /**
     * @description Delete list
     * @author Long.Pham
     * @since 11/07/2018
     * @param {*} res 
     * @param {*} postData 
     */
    deleteListCalendarControl(res, postData) {
        try {
            let service = new MainDeviceService();
            let entity = new DeviceControlCalendarEntity();
            entity = Object.assign({}, entity, postData);
            if (Libs.isBlank(entity.hash_id)) {
                var resData = {};
                resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                res.send(resData);
                return;
            }
            service.deleteListCalendarControl(entity, function (err, rs) {
                var resData = {};
                if (!err) {
                    if (rs) {
                        resData = Libs.returnJsonResult(true, i18n.__('ACTION.DELETE_SUCCESS'), entity, 1);
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__('ACTION.DELETE_FAIL'), {}, 1);
                    }
                } else {
                    resData = Libs.returnJsonResult(false, i18n.__('ACTION.DELETE_FAIL'), {}, 1);
                }
                res.send(resData);
            });
        } catch (e) {
            var resData = {};
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }


    /**
     * @description Delete item
     * @author Long.Pham
     * @since 11/07/2018
     * @param {*} res 
     * @param {*} postData 
     */
    deleteItemCalendarControl(res, postData) {
        try {
            let service = new MainDeviceService();
            let entity = new DeviceControlCalendarEntity();
            entity = Object.assign({}, entity, postData);
            if (Libs.isBlank(entity.id)) {
                var resData = {};
                resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                res.send(resData);
                return;
            }
            service.deleteItemCalendarControl(entity, function (err, rs) {
                var resData = {};
                if (!err) {
                    if (rs) {
                        resData = Libs.returnJsonResult(true, i18n.__('ACTION.DELETE_SUCCESS'), entity, 1);
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__('ACTION.DELETE_FAIL'), {}, 1);
                    }
                } else {
                    resData = Libs.returnJsonResult(false, i18n.__('ACTION.DELETE_FAIL'), {}, 1);
                }
                res.send(resData);
            });
        } catch (e) {
            var resData = {};
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }




    /**
     * @description Save action
     * @author Long.Pham
     * @since 11/07/2019
     * @param {*} res 
     * @param {*} postData 
     */
    async updateControlMode(res, postData) {
        try {
            let service = new MainDeviceService();
            let entity = Object.assign({}, new ProjectEntity(), postData);

            if (Libs.isBlank(entity.hash_id)) {
                var resData = {};
                resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                res.send(resData);
                return;
            }

            // get Techedge device
            let deviceTechEdge = await service.getDeviceTechEdge(entity);
            if (Libs.isObjectEmpty(deviceTechEdge)) {
                let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                res.send(resData);
                return;
            }

            let params = {};
            if (entity.type == 'schedule_control') {
                params = {
                    timestamp: new Date().getTime(),
                    "deviceID": deviceTechEdge.id_device,
                    type: "scheduleControl",
                    payload: [{
                        param: "operationMode",
                        value: entity.schedule_control_mode == 1 ? "manual" : "auto"
                    }]
                };
            } else if (entity.type == 'export_control') {
                params = {
                    "timestamp": new Date().getTime(),
                    "deviceID": deviceTechEdge.id_device,
                    "type": "exportLimitation",
                    "payload": [{
                        "param": "operationMode",
                        "value": entity.export_limitation_control_mode == 1 ? "manual" : "auto"
                    }]
                };
            }

            if (Libs.isObjectEmpty(params)) {
                let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                res.send(resData);
                return;
            }

            let http = new FLHttp();
            http.setHeader({
                contentType: "application/json",
                method: "POST"
            });

            http.post(Constants.api_control_url + '/control/cmd', params, (status, rs) => {
                var data = rs.data;
                if (status && rs.status == 200 && data && data.status == 'OK') {
                    Sync(function () {
                        service.updateControlMode(entity, function (err, rsupdate) {
                            try {
                                if (!rsupdate) {
                                    let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                    res.send(resData);
                                    return;
                                }
                                let resData = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                                res.send(resData);
                            } catch (error) {
                                let resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                                res.send(resData);
                            }
                        });
                    });
                } else {
                    let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                    res.send(resData);
                    return;
                }
            });
        } catch (e) {
            var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }



    /**
     * @description Get detail item
     * @author Long.Pham
     * @since 11/07/2019
     * @param {*} res 
     * @param {*} postData 
     */
    getProjectDetail(res, postData) {
        try {
            var service = new MainDeviceService();
            let entity = new ProjectEntity();
            entity = Object.assign({}, entity, postData);
            service.getProjectDetail(entity, function (err, rs) {
                var resData = {};
                if (!err) {
                    resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
                } else {
                    resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                }
                res.send(resData);
            });
        } catch (e) {
            var resData = {};
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }



    /**
    * @description Save action
    * @author Long.Pham
    * @since 11/07/2019
    * @param {*} res 
    * @param {*} postData 
    */
    async updateModePowerAndEnergy(res, postData) {
        try {
            let service = new MainDeviceService();
            let entity = Object.assign({}, new ProjectEntity(), postData);

            if (Libs.isBlank(entity.hash_id)) {
                var resData = {};
                resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                res.send(resData);
                return;
            }

            // get Techedge device
            let deviceTechEdge = await service.getDeviceTechEdge(entity);
            if (Libs.isObjectEmpty(deviceTechEdge)) {
                let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                res.send(resData);
                return;
            }

            let params = {};

            if (entity.type == 'power') {
                params = {
                    timestamp: new Date().getTime(),
                    "deviceID": deviceTechEdge.id_device,
                    type: "exportLimitation",
                    payload: [{
                        param: "limitPower",
                        value: entity.limit_power_status == 1 ? "enable" : "disable"
                    }]
                };
            } else if (entity.type == 'energy') {
                params = {
                    "timestamp": new Date().getTime(),
                    "deviceID": deviceTechEdge.id_device,
                    "type": "exportLimitation",
                    "payload": [{
                        "param": "limitEnergy",
                        "value": entity.limit_energy_status == 1 ? "enable" : "disable"
                    }]
                };
            } else if (entity.type == 'save') {
                params = {
                    "timestamp": new Date().getTime(),
                    "deviceID": deviceTechEdge.id_device,
                    "type": "exportLimitation",
                    "payload": [
                        {
                            "param": "registeredPower",
                            "value": parseFloat(entity.limit_power)
                        },
                        {
                            "param": "registeredEnergy",
                            "value": parseFloat(entity.limit_energy)
                        }
                    ]
                };
            }

            if (Libs.isObjectEmpty(params)) {
                let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                res.send(resData);
                return;
            }

            let http = new FLHttp();
            http.setHeader({
                contentType: "application/json",
                method: "POST"
            });

            http.post(Constants.api_control_url + '/control/cmd', params, (status, rs) => {
                var data = rs.data;
                if (status && data && data.status == 'OK') {
                    Sync(function () {
                        service.updateModePowerAndEnergy(entity, function (err, rsupdate) {
                            try {
                                if (!rsupdate) {
                                    let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                    res.send(resData);
                                    return;
                                }
                                let resData = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                                res.send(resData);
                            } catch (error) {
                                let resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                                res.send(resData);
                            }
                        });
                    });
                } else {
                    let resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                    res.send(resData);
                    return;
                }
            });
        } catch (e) {
            var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }



    /**
     * @description Get control cmd
     * @author Long.Pham
     * @since 10/03/2022
     * @param {*} res 
     * @param {*} postData 
     */
    cmd(res, postData) {
        try {
            let resData = {};
            if (Libs.isObjectEmpty(postData)) {
                resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }

            var type = postData.type;
            var deviceID = postData.deviceID;
            var payload = postData.payload;

            if (Libs.isBlank(type) || Libs.isBlank(deviceID) || !Libs.isArrayData(payload)) {
                resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }

            let service = new MainDeviceService();
            Sync(function () {
                service.saveStatusCMD(postData, function (err, rs) {
                    if (rs && err) {
                        resData = Libs.returnJsonResult(true, "Done", {}, 0);
                    } else {
                        resData = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                    }
                    res.send(resData);
                });

            });

            // resData = Libs.returnJsonResult(true, "Done", {}, 0);
            // res.send(resData);

        } catch (e) {
            var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }






    /**
     * @description Get detail item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {*} res 
     * @param {*} postData 
     */
    getPowerNowByDay(res, postData) {
        try {
            var service = new MainDeviceService();
            let entity = new DeviceEntity();
            entity = Object.assign({}, entity, postData);
            service.getPowerNowByDay(entity, function (err, rs) {
                var resData = {};
                if (!err) {
                    resData = Libs.returnJsonResult(true, i18n.__("ACTION.SUCCESS"), rs, 0);
                } else {
                    resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                }
                res.send(resData);
            });
        } catch (e) {
            var resData = {};
            resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
            res.send(resData);
        }
    }



}
export default MainDeviceController;