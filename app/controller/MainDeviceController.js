'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseController2 = require('../core/BaseController');

var _BaseController3 = _interopRequireDefault(_BaseController2);

var _MainDeviceService = require('../services/MainDeviceService');

var _MainDeviceService2 = _interopRequireDefault(_MainDeviceService);

var _DeviceEntity = require('../entities/DeviceEntity');

var _DeviceEntity2 = _interopRequireDefault(_DeviceEntity);

var _DeviceControlCalendarEntity = require('../entities/DeviceControlCalendarEntity');

var _DeviceControlCalendarEntity2 = _interopRequireDefault(_DeviceControlCalendarEntity);

var _ProjectEntity = require('../entities/ProjectEntity');

var _ProjectEntity2 = _interopRequireDefault(_ProjectEntity);

var _DeviceControlCalendarValidate = require('../validator/DeviceControlCalendarValidate');

var _DeviceControlCalendarValidate2 = _interopRequireDefault(_DeviceControlCalendarValidate);

var _sync = require('sync');

var _sync2 = _interopRequireDefault(_sync);

var _FLHttp = require('../utils/FLHttp');

var _FLHttp2 = _interopRequireDefault(_FLHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainDeviceController = function (_BaseController) {
    _inherits(MainDeviceController, _BaseController);

    function MainDeviceController() {
        _classCallCheck(this, MainDeviceController);

        return _possibleConstructorReturn(this, (MainDeviceController.__proto__ || Object.getPrototypeOf(MainDeviceController)).call(this));
    }

    /**
     * @description Get List item
     * @author Long.Pham
     * @since 14/09/2021
     * @param {} res 
     * @param {*} postData 
     */


    _createClass(MainDeviceController, [{
        key: 'getListInverter',
        value: function getListInverter(res, postData) {

            try {
                var service = new _MainDeviceService2.default();
                var entity = new _DeviceEntity2.default();
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

    }, {
        key: 'getList',
        value: function getList(res, postData) {

            try {
                var service = new _MainDeviceService2.default();
                var entity = new _DeviceEntity2.default();
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

    }, {
        key: 'getListParameterByDevice',
        value: function getListParameterByDevice(res, postData) {
            try {
                var service = new _MainDeviceService2.default();
                var entity = new _DeviceEntity2.default();
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

    }, {
        key: 'getListAlertByDevice',
        value: function getListAlertByDevice(res, postData) {
            try {
                var service = new _MainDeviceService2.default();
                var entity = new _DeviceEntity2.default();
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

    }, {
        key: 'saveAction',
        value: async function saveAction(res, postData) {}

        /**
         * @description Delete item
         * @author Long.Pham
         * @since 14/09/2021
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'deleteAction',
        value: function deleteAction(res, postData) {}

        /**
         * @description Save action
         * @author Long.Pham
         * @since 11/07/2019
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'updateOnOff',
        value: async function updateOnOff(res, postData) {
            try {
                var service = new _MainDeviceService2.default();
                var entity = Object.assign({}, new _DeviceEntity2.default(), postData);
                entity.status = !entity.status || entity.status == -1 ? 0 : 1;

                if (Libs.isBlank(entity.id)) {
                    var resData = {};
                    resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                    res.send(resData);
                    return;
                }

                // get Techedge device
                var deviceTechEdge = await service.getDeviceTechEdge(entity);
                if (Libs.isObjectEmpty(deviceTechEdge)) {
                    var _resData = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                    res.send(_resData);
                    return;
                }

                var params = {
                    timestamp: new Date().getTime(),
                    "deviceID": deviceTechEdge.id_device,
                    type: "scheduleControl",
                    payload: [{
                        param: "commands",
                        value: [{
                            "deviceID": entity.id_device,
                            "command": entity.status == 1 ? "on" : "off"
                        }]
                    }]
                };

                if (Libs.isObjectEmpty(params)) {
                    var _resData2 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                    res.send(_resData2);
                    return;
                }

                var http = new _FLHttp2.default();
                http.setHeader({
                    contentType: "application/json",
                    method: "POST"
                });

                http.post(Constants.api_control_url + '/control/cmd', params, function (status, rs) {
                    console.log(status, rs);
                    var data = rs.data;
                    if (status && rs.status == 200 && data && data.status == 'OK') {
                        (0, _sync2.default)(function () {
                            service.updateOnOff(entity, function (err, rsupdate) {
                                try {
                                    if (!rsupdate) {
                                        var _resData4 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                        res.send(_resData4);
                                        return;
                                    }
                                    var _resData3 = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                                    res.send(_resData3);
                                } catch (error) {
                                    var _resData5 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                                    res.send(_resData5);
                                }
                            });
                        });
                    } else {
                        var _resData6 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                        res.send(_resData6);
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

    }, {
        key: 'saveControlCalendar',
        value: async function saveControlCalendar(res, postData) {
            try {
                var service = new _MainDeviceService2.default();
                var entity = Object.assign({}, new _DeviceControlCalendarEntity2.default(), postData);
                var validate = new _DeviceControlCalendarValidate2.default();

                var errors = await validate.FLValidationAll(entity);
                if (errors != null) {
                    errors.validate = false;
                    res.send(Libs.returnJsonResult(false, "", errors, 0));
                    return;
                }

                if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                    (0, _sync2.default)(function () {
                        service.saveControlCalendar(entity, async function (err, rs) {
                            if (rs && err) {
                                // get Techedge device
                                var deviceTechEdge = await service.getDeviceTechEdge(entity);
                                if (Libs.isObjectEmpty(deviceTechEdge)) {
                                    var _resData7 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                                    res.send(_resData7);
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
                                            payload: [{
                                                param: "schedule",
                                                value: devices
                                            }]
                                        };

                                        var http = new _FLHttp2.default();
                                        http.setHeader({
                                            contentType: "application/json",
                                            method: "POST"
                                        });

                                        http.post(Constants.api_control_url + '/control/cmd', params, function (status, rs) {
                                            var data = rs.data;
                                            if (status && rs.status == 200 && data && data.status == 'OK') {
                                                var _resData8 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                                                res.send(_resData8);
                                            } else {
                                                var _resData9 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                                                res.send(_resData9);
                                                return;
                                            }
                                        });
                                    } else {
                                        resData = Libs.returnJsonResult(false, i18n.__("ACTION.FAIL"), {}, 0);
                                        res.send(resData);
                                    }
                                });
                            } else {
                                var _resData10 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                                res.send(_resData10);
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

    }, {
        key: 'getListControlCalendar',
        value: function getListControlCalendar(res, postData) {
            try {
                var service = new _MainDeviceService2.default();
                var entity = new _DeviceControlCalendarEntity2.default();
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

    }, {
        key: 'saveArrControlCalendar',
        value: async function saveArrControlCalendar(res, postData) {
            try {
                var service = new _MainDeviceService2.default();
                var entity = Object.assign({}, new _DeviceControlCalendarEntity2.default(), postData);
                var validate = new _DeviceControlCalendarValidate2.default();

                var errors = await validate.FLValidationAll(entity);
                if (errors != null) {
                    errors.validate = false;
                    res.send(Libs.returnJsonResult(false, "", errors, 0));
                    return;
                }

                if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                    // get Techedge device
                    var deviceTechEdge = await service.getDeviceTechEdge(entity);
                    if (Libs.isObjectEmpty(deviceTechEdge)) {
                        var _resData11 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                        res.send(_resData11);
                        return;
                    }

                    var dataDevices = entity.dataDevices;
                    if (!Libs.isArrayData(dataDevices)) {
                        var _resData12 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                        res.send(_resData12);
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
                        var _resData13 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                        res.send(_resData13);
                        return;
                    }

                    var params = {
                        timestamp: new Date().getTime(),
                        deviceID: deviceTechEdge.id_device,
                        type: "scheduleControl",
                        payload: [{
                            param: "schedule",
                            value: devices
                        }]
                    };

                    var http = new _FLHttp2.default();
                    http.setHeader({
                        contentType: "application/json",
                        method: "POST"
                    });

                    http.post(Constants.api_control_url + '/control/cmd', params, function (status, rs) {
                        var data = rs.data;
                        if (status && rs.status == 200 && data && data.status == 'OK') {
                            (0, _sync2.default)(function () {
                                service.saveArrControlCalendar(entity, function (err, rs) {
                                    if (rs && err) {
                                        var _resData14 = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, 0);
                                        res.send(_resData14);
                                    } else {
                                        var _resData15 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                                        res.send(_resData15);
                                    }
                                });
                            });
                        } else {
                            var _resData16 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                            res.send(_resData16);
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

    }, {
        key: 'getListBySiteControlCalendar',
        value: function getListBySiteControlCalendar(res, postData) {
            try {
                var service = new _MainDeviceService2.default();
                var entity = new _DeviceControlCalendarEntity2.default();
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

    }, {
        key: 'deleteListCalendarControl',
        value: function deleteListCalendarControl(res, postData) {
            try {
                var service = new _MainDeviceService2.default();
                var entity = new _DeviceControlCalendarEntity2.default();
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

    }, {
        key: 'deleteItemCalendarControl',
        value: function deleteItemCalendarControl(res, postData) {
            try {
                var service = new _MainDeviceService2.default();
                var entity = new _DeviceControlCalendarEntity2.default();
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

    }, {
        key: 'updateControlMode',
        value: async function updateControlMode(res, postData) {
            try {
                var service = new _MainDeviceService2.default();
                var entity = Object.assign({}, new _ProjectEntity2.default(), postData);

                if (Libs.isBlank(entity.hash_id)) {
                    var resData = {};
                    resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                    res.send(resData);
                    return;
                }

                // get Techedge device
                var deviceTechEdge = await service.getDeviceTechEdge(entity);
                if (Libs.isObjectEmpty(deviceTechEdge)) {
                    var _resData17 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                    res.send(_resData17);
                    return;
                }

                var params = {};
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
                    var _resData18 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                    res.send(_resData18);
                    return;
                }

                var http = new _FLHttp2.default();
                http.setHeader({
                    contentType: "application/json",
                    method: "POST"
                });

                http.post(Constants.api_control_url + '/control/cmd', params, function (status, rs) {
                    var data = rs.data;
                    if (status && rs.status == 200 && data && data.status == 'OK') {
                        (0, _sync2.default)(function () {
                            service.updateControlMode(entity, function (err, rsupdate) {
                                try {
                                    if (!rsupdate) {
                                        var _resData20 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                        res.send(_resData20);
                                        return;
                                    }
                                    var _resData19 = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                                    res.send(_resData19);
                                } catch (error) {
                                    var _resData21 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                                    res.send(_resData21);
                                }
                            });
                        });
                    } else {
                        var _resData22 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                        res.send(_resData22);
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

    }, {
        key: 'getProjectDetail',
        value: function getProjectDetail(res, postData) {
            try {
                var service = new _MainDeviceService2.default();
                var entity = new _ProjectEntity2.default();
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

    }, {
        key: 'updateModePowerAndEnergy',
        value: async function updateModePowerAndEnergy(res, postData) {
            try {
                var service = new _MainDeviceService2.default();
                var entity = Object.assign({}, new _ProjectEntity2.default(), postData);

                if (Libs.isBlank(entity.hash_id)) {
                    var resData = {};
                    resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                    res.send(resData);
                    return;
                }

                // get Techedge device
                var deviceTechEdge = await service.getDeviceTechEdge(entity);
                if (Libs.isObjectEmpty(deviceTechEdge)) {
                    var _resData23 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                    res.send(_resData23);
                    return;
                }

                var params = {};

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
                        "payload": [{
                            "param": "registeredPower",
                            "value": parseFloat(entity.limit_power)
                        }, {
                            "param": "registeredEnergy",
                            "value": parseFloat(entity.limit_energy)
                        }]
                    };
                }

                if (Libs.isObjectEmpty(params)) {
                    var _resData24 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                    res.send(_resData24);
                    return;
                }

                var http = new _FLHttp2.default();
                http.setHeader({
                    contentType: "application/json",
                    method: "POST"
                });

                http.post(Constants.api_control_url + '/control/cmd', params, function (status, rs) {
                    var data = rs.data;
                    if (status && data && data.status == 'OK') {
                        (0, _sync2.default)(function () {
                            service.updateModePowerAndEnergy(entity, function (err, rsupdate) {
                                try {
                                    if (!rsupdate) {
                                        var _resData26 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                        res.send(_resData26);
                                        return;
                                    }
                                    var _resData25 = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                                    res.send(_resData25);
                                } catch (error) {
                                    var _resData27 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                                    res.send(_resData27);
                                }
                            });
                        });
                    } else {
                        var _resData28 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": 'error' }, 0);
                        res.send(_resData28);
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

    }, {
        key: 'cmd',
        value: function cmd(res, postData) {
            try {
                var _resData29 = {};
                if (Libs.isObjectEmpty(postData)) {
                    _resData29 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                    res.send(_resData29);
                }

                var type = postData.type;
                var deviceID = postData.deviceID;
                var payload = postData.payload;

                if (Libs.isBlank(type) || Libs.isBlank(deviceID) || !Libs.isArrayData(payload)) {
                    _resData29 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                    res.send(_resData29);
                }

                var service = new _MainDeviceService2.default();
                (0, _sync2.default)(function () {
                    service.saveStatusCMD(postData, function (err, rs) {
                        if (rs && err) {
                            _resData29 = Libs.returnJsonResult(true, "Done", {}, 0);
                        } else {
                            _resData29 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                        }
                        res.send(_resData29);
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

    }, {
        key: 'getPowerNowByDay',
        value: function getPowerNowByDay(res, postData) {
            try {
                var service = new _MainDeviceService2.default();
                var entity = new _DeviceEntity2.default();
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
    }]);

    return MainDeviceController;
}(_BaseController3.default);

exports.default = MainDeviceController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL01haW5EZXZpY2VDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIk1haW5EZXZpY2VDb250cm9sbGVyIiwicmVzIiwicG9zdERhdGEiLCJzZXJ2aWNlIiwiTWFpbkRldmljZVNlcnZpY2UiLCJlbnRpdHkiLCJEZXZpY2VFbnRpdHkiLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRMaXN0SW52ZXJ0ZXIiLCJlcnIiLCJycyIsInJlc0RhdGEiLCJMaWJzIiwicmV0dXJuSnNvblJlc3VsdCIsImkxOG4iLCJfXyIsInNlbmQiLCJlIiwibG9nZ2VyIiwiZXJyb3IiLCJnZXRMaXN0IiwiZ2V0U2l6ZSIsImVycjEiLCJyczEiLCJ0b3RhbFJvdyIsImdldExpc3RQYXJhbWV0ZXJCeURldmljZSIsImlzQmxhbmsiLCJkYXRlX2Zyb20iLCJjb252ZXJ0U3RyMkRhdGVWMDEiLCJkYXRlX3RvIiwiZ2V0TGlzdEFsZXJ0QnlEZXZpY2UiLCJnZXRMaXN0QWxlcnRCeURldmljZVNpemUiLCJzdGF0dXMiLCJpZCIsImRldmljZVRlY2hFZGdlIiwiZ2V0RGV2aWNlVGVjaEVkZ2UiLCJpc09iamVjdEVtcHR5IiwicGFyYW1zIiwidGltZXN0YW1wIiwiRGF0ZSIsImdldFRpbWUiLCJpZF9kZXZpY2UiLCJ0eXBlIiwicGF5bG9hZCIsInBhcmFtIiwidmFsdWUiLCJodHRwIiwiRkxIdHRwIiwic2V0SGVhZGVyIiwiY29udGVudFR5cGUiLCJtZXRob2QiLCJwb3N0IiwiQ29uc3RhbnRzIiwiYXBpX2NvbnRyb2xfdXJsIiwiY29uc29sZSIsImxvZyIsImRhdGEiLCJ1cGRhdGVPbk9mZiIsInJzdXBkYXRlIiwiRGV2aWNlQ29udHJvbENhbGVuZGFyRW50aXR5IiwidmFsaWRhdGUiLCJEZXZpY2VDb250cm9sQ2FsZW5kYXJWYWxpZGF0ZSIsImVycm9ycyIsIkZMVmFsaWRhdGlvbkFsbCIsImhhc093blByb3BlcnR5Iiwic2NyZWVuX21vZGUiLCJpbnNlcnQiLCJzYXZlQ29udHJvbENhbGVuZGFyIiwiZ2V0TGlzdEJ5U2l0ZUNvbnRyb2xDYWxlbmRhciIsImRldmljZXMiLCJpIiwibGVuZ3RoIiwicHVzaCIsImRldmljZV9pZCIsImRldmljZUlEIiwiZGF0ZUZyb20iLCJkYXRlVG8iLCJjb21tYW5kIiwiZ2V0TGlzdENvbnRyb2xDYWxlbmRhciIsImRhdGFEZXZpY2VzIiwiaXNBcnJheURhdGEiLCJzYXZlQXJyQ29udHJvbENhbGVuZGFyIiwiaGFzaF9pZCIsImRlbGV0ZUxpc3RDYWxlbmRhckNvbnRyb2wiLCJkZWxldGVJdGVtQ2FsZW5kYXJDb250cm9sIiwiUHJvamVjdEVudGl0eSIsInNjaGVkdWxlX2NvbnRyb2xfbW9kZSIsImV4cG9ydF9saW1pdGF0aW9uX2NvbnRyb2xfbW9kZSIsInVwZGF0ZUNvbnRyb2xNb2RlIiwiZ2V0UHJvamVjdERldGFpbCIsImxpbWl0X3Bvd2VyX3N0YXR1cyIsImxpbWl0X2VuZXJneV9zdGF0dXMiLCJwYXJzZUZsb2F0IiwibGltaXRfcG93ZXIiLCJsaW1pdF9lbmVyZ3kiLCJ1cGRhdGVNb2RlUG93ZXJBbmRFbmVyZ3kiLCJzYXZlU3RhdHVzQ01EIiwiZ2V0UG93ZXJOb3dCeURheSIsIkJhc2VDb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSxvQjs7O0FBQ0Ysb0NBQWM7QUFBQTs7QUFBQTtBQUViOztBQUdEOzs7Ozs7Ozs7Ozt3Q0FPZ0JDLEcsRUFBS0MsUSxFQUFVOztBQUUzQixnQkFBSTtBQUNBLG9CQUFJQyxVQUFVLElBQUlDLDJCQUFKLEVBQWQ7QUFDQSxvQkFBSUMsU0FBUyxJQUFJQyxzQkFBSixFQUFiO0FBQ0FELHlCQUFTRSxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkgsTUFBbEIsRUFBMEJILFFBQTFCLENBQVQ7QUFDQUMsd0JBQVFNLGVBQVIsQ0FBd0JKLE1BQXhC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QixFQUFvRCxFQUFFLFNBQVNFLElBQUksRUFBZixFQUFwRCxFQUF5RSxDQUF6RSxDQUFWO0FBQ0FqQixvQkFBSWdCLElBQUosQ0FBU0wsT0FBVDtBQUNIO0FBQ0o7Ozs7RUE5NkI4QnVGLHdCOztrQkFtN0JwQm5HLG9CIiwiZmlsZSI6Ik1haW5EZXZpY2VDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VDb250cm9sbGVyIGZyb20gJy4uL2NvcmUvQmFzZUNvbnRyb2xsZXInO1xuaW1wb3J0IE1haW5EZXZpY2VTZXJ2aWNlIGZyb20gJy4uL3NlcnZpY2VzL01haW5EZXZpY2VTZXJ2aWNlJztcbmltcG9ydCBEZXZpY2VFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvRGV2aWNlRW50aXR5JztcbmltcG9ydCBEZXZpY2VDb250cm9sQ2FsZW5kYXJFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvRGV2aWNlQ29udHJvbENhbGVuZGFyRW50aXR5JztcbmltcG9ydCBQcm9qZWN0RW50aXR5IGZyb20gJy4uL2VudGl0aWVzL1Byb2plY3RFbnRpdHknO1xuaW1wb3J0IERldmljZUNvbnRyb2xDYWxlbmRhclZhbGlkYXRlIGZyb20gJy4uL3ZhbGlkYXRvci9EZXZpY2VDb250cm9sQ2FsZW5kYXJWYWxpZGF0ZSc7XG5pbXBvcnQgU3luYyBmcm9tICdzeW5jJztcbmltcG9ydCBGTEh0dHAgZnJvbSAnLi4vdXRpbHMvRkxIdHRwJztcblxuY2xhc3MgTWFpbkRldmljZUNvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0ge30gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0TGlzdEludmVydGVyKHJlcywgcG9zdERhdGEpIHtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgTWFpbkRldmljZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgRGV2aWNlRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0TGlzdEludmVydGVyKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBMaXN0IGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHt9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldExpc3QocmVzLCBwb3N0RGF0YSkge1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBNYWluRGV2aWNlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBEZXZpY2VFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXRMaXN0KGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldFNpemUoZW50aXR5LCBmdW5jdGlvbiAoZXJyMSwgcnMxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVycjEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIHJzMS50b3RhbFJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgTGlzdCBwYXJhbWV0ZXIgYnkgZGV2aWNlIGlkXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTQvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7fSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBnZXRMaXN0UGFyYW1ldGVyQnlEZXZpY2UocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgTWFpbkRldmljZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgRGV2aWNlRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0TGlzdFBhcmFtZXRlckJ5RGV2aWNlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKFwiTOG7l2k6IFwiICsgZSk7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgYWxlcnQgYnkgZGV2aWNlIGlkXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTAvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7fSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBnZXRMaXN0QWxlcnRCeURldmljZShyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBNYWluRGV2aWNlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBEZXZpY2VFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoZW50aXR5LmRhdGVfZnJvbSkpIHtcbiAgICAgICAgICAgICAgICBlbnRpdHkuZGF0ZV9mcm9tID0gTGlicy5jb252ZXJ0U3RyMkRhdGVWMDEoZW50aXR5LmRhdGVfZnJvbSwgXCJkZC9tbS95eXl5XCIsIFwiL1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFMaWJzLmlzQmxhbmsoZW50aXR5LmRhdGVfdG8pKSB7XG4gICAgICAgICAgICAgICAgZW50aXR5LmRhdGVfdG8gPSBMaWJzLmNvbnZlcnRTdHIyRGF0ZVYwMShlbnRpdHkuZGF0ZV90bywgXCJkZC9tbS95eXl5XCIsIFwiL1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VydmljZS5nZXRMaXN0QWxlcnRCeURldmljZShlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRMaXN0QWxlcnRCeURldmljZVNpemUoZW50aXR5LCBmdW5jdGlvbiAoZXJyMSwgcnMxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVycjEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIHJzMS50b3RhbFJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBhY3Rpb25cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxNC8wOS8yMDIxXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBhc3luYyBzYXZlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIERlbGV0ZSBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTQvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZGVsZXRlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcblxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBhY3Rpb25cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBhc3luYyB1cGRhdGVPbk9mZihyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBNYWluRGV2aWNlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBEZXZpY2VFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgZW50aXR5LnN0YXR1cyA9ICghZW50aXR5LnN0YXR1cyB8fCBlbnRpdHkuc3RhdHVzID09IC0xKSA/IDAgOiAxO1xuXG4gICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGVudGl0eS5pZCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIk5PVF9FWElTVFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZ2V0IFRlY2hlZGdlIGRldmljZVxuICAgICAgICAgICAgbGV0IGRldmljZVRlY2hFZGdlID0gYXdhaXQgc2VydmljZS5nZXREZXZpY2VUZWNoRWRnZShlbnRpdHkpO1xuICAgICAgICAgICAgaWYgKExpYnMuaXNPYmplY3RFbXB0eShkZXZpY2VUZWNoRWRnZSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgXCJkZXZpY2VJRFwiOiBkZXZpY2VUZWNoRWRnZS5pZF9kZXZpY2UsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJzY2hlZHVsZUNvbnRyb2xcIixcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtOiBcImNvbW1hbmRzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkZXZpY2VJRFwiOiBlbnRpdHkuaWRfZGV2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbW1hbmRcIjogZW50aXR5LnN0YXR1cyA9PSAxID8gXCJvblwiIDogXCJvZmZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiAoTGlicy5pc09iamVjdEVtcHR5KHBhcmFtcykpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgaHR0cCA9IG5ldyBGTEh0dHAoKTtcbiAgICAgICAgICAgIGh0dHAuc2V0SGVhZGVyKHtcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIlxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgaHR0cC5wb3N0KENvbnN0YW50cy5hcGlfY29udHJvbF91cmwgKyAnL2NvbnRyb2wvY21kJywgcGFyYW1zLCAoc3RhdHVzLCBycykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cywgcnMpO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gcnMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzICYmIHJzLnN0YXR1cyA9PSAyMDAgJiYgZGF0YSAmJiBkYXRhLnN0YXR1cyA9PSAnT0snKSB7XG4gICAgICAgICAgICAgICAgICAgIFN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS51cGRhdGVPbk9mZihlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5VUERBVEVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9TVUNDRVNTJyksIGVudGl0eSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlcnJvciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX0ZBSUwnKSwgeyBcImVycm9yXCI6ICdlcnJvcicgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuXG4gICAgLyoqXG4gICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBhY3Rpb25cbiAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICovXG4gICAgYXN5bmMgc2F2ZUNvbnRyb2xDYWxlbmRhcihyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBNYWluRGV2aWNlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBEZXZpY2VDb250cm9sQ2FsZW5kYXJFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgbGV0IHZhbGlkYXRlID0gbmV3IERldmljZUNvbnRyb2xDYWxlbmRhclZhbGlkYXRlKCk7XG5cbiAgICAgICAgICAgIGxldCBlcnJvcnMgPSBhd2FpdCB2YWxpZGF0ZS5GTFZhbGlkYXRpb25BbGwoZW50aXR5KTtcbiAgICAgICAgICAgIGlmIChlcnJvcnMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGVycm9ycy52YWxpZGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgXCJcIiwgZXJyb3JzLCAwKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZW50aXR5Lmhhc093blByb3BlcnR5KCdzY3JlZW5fbW9kZScpICYmIGVudGl0eS5zY3JlZW5fbW9kZSA9PSBDb25zdGFudHMuc2NyZWVuX21vZGUuaW5zZXJ0KSB7XG4gICAgICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2Uuc2F2ZUNvbnRyb2xDYWxlbmRhcihlbnRpdHksIGFzeW5jIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocnMgJiYgZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IFRlY2hlZGdlIGRldmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkZXZpY2VUZWNoRWRnZSA9IGF3YWl0IHNlcnZpY2UuZ2V0RGV2aWNlVGVjaEVkZ2UoZW50aXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoTGlicy5pc09iamVjdEVtcHR5KGRldmljZVRlY2hFZGdlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9GQUlMJyksIHsgXCJlcnJvclwiOiAnZXJyb3InIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0TGlzdEJ5U2l0ZUNvbnRyb2xDYWxlbmRhcihlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGV2aWNlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZV9pZDogcnNbaV0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZUlEOiByc1tpXS5pZF9kZXZpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGVGcm9tOiByc1tpXS5kYXRlX2Zyb20sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGVUbzogcnNbaV0uZGF0ZV90byxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogXCJvZmZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlSUQ6IGRldmljZVRlY2hFZGdlLmlkX2RldmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNjaGVkdWxlQ29udHJvbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheWxvYWQ6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW06IFwic2NoZWR1bGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBkZXZpY2VzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaHR0cCA9IG5ldyBGTEh0dHAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0dHAuc2V0SGVhZGVyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0dHAucG9zdChDb25zdGFudHMuYXBpX2NvbnRyb2xfdXJsICsgJy9jb250cm9sL2NtZCcsIHBhcmFtcywgKHN0YXR1cywgcnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHJzLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyAmJiBycy5zdGF0dXMgPT0gMjAwICYmIGRhdGEgJiYgZGF0YS5zdGF0dXMgPT0gJ09LJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9TVUNDRVNTJyksIGVudGl0eSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX0ZBSUwnKSwgeyBcImVycm9yXCI6ICdlcnJvcicgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cblxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgTGlzdCBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTQvMDkvMjAyMVxuICAgICAqIEBwYXJhbSB7fSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBnZXRMaXN0Q29udHJvbENhbGVuZGFyKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IE1haW5EZXZpY2VTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IERldmljZUNvbnRyb2xDYWxlbmRhckVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBzZXJ2aWNlLmdldExpc3RDb250cm9sQ2FsZW5kYXIoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIDApO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXyhcIkFDVElPTi5GQUlMXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihcIkzhu5dpOiBcIiArIGUpO1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBhY3Rpb25cbiAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICovXG4gICAgYXN5bmMgc2F2ZUFyckNvbnRyb2xDYWxlbmRhcihyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBNYWluRGV2aWNlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBEZXZpY2VDb250cm9sQ2FsZW5kYXJFbnRpdHkoKSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgbGV0IHZhbGlkYXRlID0gbmV3IERldmljZUNvbnRyb2xDYWxlbmRhclZhbGlkYXRlKCk7XG5cbiAgICAgICAgICAgIGxldCBlcnJvcnMgPSBhd2FpdCB2YWxpZGF0ZS5GTFZhbGlkYXRpb25BbGwoZW50aXR5KTtcbiAgICAgICAgICAgIGlmIChlcnJvcnMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGVycm9ycy52YWxpZGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgXCJcIiwgZXJyb3JzLCAwKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZW50aXR5Lmhhc093blByb3BlcnR5KCdzY3JlZW5fbW9kZScpICYmIGVudGl0eS5zY3JlZW5fbW9kZSA9PSBDb25zdGFudHMuc2NyZWVuX21vZGUuaW5zZXJ0KSB7XG4gICAgICAgICAgICAgICAgLy8gZ2V0IFRlY2hlZGdlIGRldmljZVxuICAgICAgICAgICAgICAgIGxldCBkZXZpY2VUZWNoRWRnZSA9IGF3YWl0IHNlcnZpY2UuZ2V0RGV2aWNlVGVjaEVkZ2UoZW50aXR5KTtcbiAgICAgICAgICAgICAgICBpZiAoTGlicy5pc09iamVjdEVtcHR5KGRldmljZVRlY2hFZGdlKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9GQUlMJyksIHsgXCJlcnJvclwiOiAnZXJyb3InIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBkYXRhRGV2aWNlcyA9IGVudGl0eS5kYXRhRGV2aWNlcztcbiAgICAgICAgICAgICAgICBpZiAoIUxpYnMuaXNBcnJheURhdGEoZGF0YURldmljZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX0ZBSUwnKSwgeyBcImVycm9yXCI6ICdlcnJvcicgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGRldmljZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFEZXZpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGRldmljZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VfaWQ6IGRhdGFEZXZpY2VzW2ldLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlSUQ6IGRhdGFEZXZpY2VzW2ldLmlkX2RldmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGVGcm9tOiBlbnRpdHkuZGF0ZV9mcm9tLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZVRvOiBlbnRpdHkuZGF0ZV90byxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6IFwib2ZmXCJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFMaWJzLmlzQXJyYXlEYXRhKGRldmljZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX0ZBSUwnKSwgeyBcImVycm9yXCI6ICdlcnJvcicgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgZGV2aWNlSUQ6IGRldmljZVRlY2hFZGdlLmlkX2RldmljZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzY2hlZHVsZUNvbnRyb2xcIixcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZDogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtOiBcInNjaGVkdWxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGRldmljZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBsZXQgaHR0cCA9IG5ldyBGTEh0dHAoKTtcbiAgICAgICAgICAgICAgICBodHRwLnNldEhlYWRlcih7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIlxuICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgICBodHRwLnBvc3QoQ29uc3RhbnRzLmFwaV9jb250cm9sX3VybCArICcvY29udHJvbC9jbWQnLCBwYXJhbXMsIChzdGF0dXMsIHJzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gcnMuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyAmJiBycy5zdGF0dXMgPT0gMjAwICYmIGRhdGEgJiYgZGF0YS5zdGF0dXMgPT0gJ09LJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5zYXZlQXJyQ29udHJvbENhbGVuZGFyKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJzICYmIGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfU1VDQ0VTUycpLCBlbnRpdHksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9GQUlMJyksIHsgXCJlcnJvclwiOiAnZXJyb3InIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0ge30gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0TGlzdEJ5U2l0ZUNvbnRyb2xDYWxlbmRhcihyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBNYWluRGV2aWNlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBEZXZpY2VDb250cm9sQ2FsZW5kYXJFbnRpdHkoKTtcbiAgICAgICAgICAgIGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwgcG9zdERhdGEpO1xuICAgICAgICAgICAgc2VydmljZS5nZXRMaXN0QnlTaXRlQ29udHJvbENhbGVuZGFyKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJM4buXaTogXCIgKyBlKTtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBEZWxldGUgbGlzdFxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDExLzA3LzIwMThcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGRlbGV0ZUxpc3RDYWxlbmRhckNvbnRyb2wocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgTWFpbkRldmljZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgRGV2aWNlQ29udHJvbENhbGVuZGFyRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIGlmIChMaWJzLmlzQmxhbmsoZW50aXR5Lmhhc2hfaWQpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJOT1RfRVhJU1RcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXJ2aWNlLmRlbGV0ZUxpc3RDYWxlbmRhckNvbnRyb2woZW50aXR5LCBmdW5jdGlvbiAoZXJyLCBycykge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfU1VDQ0VTUycpLCBlbnRpdHksIDEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLkRFTEVURV9GQUlMJyksIHt9LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfRkFJTCcpLCB7fSwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRGVsZXRlIGl0ZW1cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE4XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBkZWxldGVJdGVtQ2FsZW5kYXJDb250cm9sKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IE1haW5EZXZpY2VTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IERldmljZUNvbnRyb2xDYWxlbmRhckVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGVudGl0eS5pZCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIk5PVF9FWElTVFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlcnZpY2UuZGVsZXRlSXRlbUNhbGVuZGFyQ29udHJvbChlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLkRFTEVURV9TVUNDRVNTJyksIGVudGl0eSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uREVMRVRFX0ZBSUwnKSwge30sIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLkRFTEVURV9GQUlMJyksIHt9LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBhY3Rpb25cbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBhc3luYyB1cGRhdGVDb250cm9sTW9kZShyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBNYWluRGV2aWNlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBQcm9qZWN0RW50aXR5KCksIHBvc3REYXRhKTtcblxuICAgICAgICAgICAgaWYgKExpYnMuaXNCbGFuayhlbnRpdHkuaGFzaF9pZCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIk5PVF9FWElTVFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZ2V0IFRlY2hlZGdlIGRldmljZVxuICAgICAgICAgICAgbGV0IGRldmljZVRlY2hFZGdlID0gYXdhaXQgc2VydmljZS5nZXREZXZpY2VUZWNoRWRnZShlbnRpdHkpO1xuICAgICAgICAgICAgaWYgKExpYnMuaXNPYmplY3RFbXB0eShkZXZpY2VUZWNoRWRnZSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgcGFyYW1zID0ge307XG4gICAgICAgICAgICBpZiAoZW50aXR5LnR5cGUgPT0gJ3NjaGVkdWxlX2NvbnRyb2wnKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgICAgICBcImRldmljZUlEXCI6IGRldmljZVRlY2hFZGdlLmlkX2RldmljZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzY2hlZHVsZUNvbnRyb2xcIixcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZDogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtOiBcIm9wZXJhdGlvbk1vZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBlbnRpdHkuc2NoZWR1bGVfY29udHJvbF9tb2RlID09IDEgPyBcIm1hbnVhbFwiIDogXCJhdXRvXCJcbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbnRpdHkudHlwZSA9PSAnZXhwb3J0X2NvbnRyb2wnKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpbWVzdGFtcFwiOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgXCJkZXZpY2VJRFwiOiBkZXZpY2VUZWNoRWRnZS5pZF9kZXZpY2UsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImV4cG9ydExpbWl0YXRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgXCJwYXlsb2FkXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhcmFtXCI6IFwib3BlcmF0aW9uTW9kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBlbnRpdHkuZXhwb3J0X2xpbWl0YXRpb25fY29udHJvbF9tb2RlID09IDEgPyBcIm1hbnVhbFwiIDogXCJhdXRvXCJcbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoTGlicy5pc09iamVjdEVtcHR5KHBhcmFtcykpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgaHR0cCA9IG5ldyBGTEh0dHAoKTtcbiAgICAgICAgICAgIGh0dHAuc2V0SGVhZGVyKHtcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGh0dHAucG9zdChDb25zdGFudHMuYXBpX2NvbnRyb2xfdXJsICsgJy9jb250cm9sL2NtZCcsIHBhcmFtcywgKHN0YXR1cywgcnMpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHJzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyAmJiBycy5zdGF0dXMgPT0gMjAwICYmIGRhdGEgJiYgZGF0YS5zdGF0dXMgPT0gJ09LJykge1xuICAgICAgICAgICAgICAgICAgICBTeW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UudXBkYXRlQ29udHJvbE1vZGUoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCByc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcnN1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX0ZBSUwnKSwgeyBcImVycm9yXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5VUERBVEVfU1VDQ0VTUycpLCBlbnRpdHksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZXJyb3IgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9GQUlMJyksIHsgXCJlcnJvclwiOiAnZXJyb3InIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0IGRldGFpbCBpdGVtXG4gICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAgKiBAc2luY2UgMTEvMDcvMjAxOVxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxuICAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgICovXG4gICAgZ2V0UHJvamVjdERldGFpbChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc2VydmljZSA9IG5ldyBNYWluRGV2aWNlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGVudGl0eSA9IG5ldyBQcm9qZWN0RW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0UHJvamVjdERldGFpbChlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGFjdGlvblxuICAgICogQGF1dGhvciBMb25nLlBoYW1cbiAgICAqIEBzaW5jZSAxMS8wNy8yMDE5XG4gICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAqIEBwYXJhbSB7Kn0gcG9zdERhdGEgXG4gICAgKi9cbiAgICBhc3luYyB1cGRhdGVNb2RlUG93ZXJBbmRFbmVyZ3kocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgTWFpbkRldmljZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgUHJvamVjdEVudGl0eSgpLCBwb3N0RGF0YSk7XG5cbiAgICAgICAgICAgIGlmIChMaWJzLmlzQmxhbmsoZW50aXR5Lmhhc2hfaWQpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJOT1RfRVhJU1RcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGdldCBUZWNoZWRnZSBkZXZpY2VcbiAgICAgICAgICAgIGxldCBkZXZpY2VUZWNoRWRnZSA9IGF3YWl0IHNlcnZpY2UuZ2V0RGV2aWNlVGVjaEVkZ2UoZW50aXR5KTtcbiAgICAgICAgICAgIGlmIChMaWJzLmlzT2JqZWN0RW1wdHkoZGV2aWNlVGVjaEVkZ2UpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5VUERBVEVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHt9O1xuXG4gICAgICAgICAgICBpZiAoZW50aXR5LnR5cGUgPT0gJ3Bvd2VyJykge1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgXCJkZXZpY2VJRFwiOiBkZXZpY2VUZWNoRWRnZS5pZF9kZXZpY2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZXhwb3J0TGltaXRhdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW06IFwibGltaXRQb3dlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGVudGl0eS5saW1pdF9wb3dlcl9zdGF0dXMgPT0gMSA/IFwiZW5hYmxlXCIgOiBcImRpc2FibGVcIlxuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVudGl0eS50eXBlID09ICdlbmVyZ3knKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpbWVzdGFtcFwiOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgXCJkZXZpY2VJRFwiOiBkZXZpY2VUZWNoRWRnZS5pZF9kZXZpY2UsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImV4cG9ydExpbWl0YXRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgXCJwYXlsb2FkXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhcmFtXCI6IFwibGltaXRFbmVyZ3lcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogZW50aXR5LmxpbWl0X2VuZXJneV9zdGF0dXMgPT0gMSA/IFwiZW5hYmxlXCIgOiBcImRpc2FibGVcIlxuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVudGl0eS50eXBlID09ICdzYXZlJykge1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aW1lc3RhbXBcIjogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgICAgIFwiZGV2aWNlSURcIjogZGV2aWNlVGVjaEVkZ2UuaWRfZGV2aWNlLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJleHBvcnRMaW1pdGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGF5bG9hZFwiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwYXJhbVwiOiBcInJlZ2lzdGVyZWRQb3dlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcGFyc2VGbG9hdChlbnRpdHkubGltaXRfcG93ZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGFyYW1cIjogXCJyZWdpc3RlcmVkRW5lcmd5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwYXJzZUZsb2F0KGVudGl0eS5saW1pdF9lbmVyZ3kpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoTGlicy5pc09iamVjdEVtcHR5KHBhcmFtcykpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9GQUlMJyksIHsgXCJlcnJvclwiOiBlcnIgfSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgaHR0cCA9IG5ldyBGTEh0dHAoKTtcbiAgICAgICAgICAgIGh0dHAuc2V0SGVhZGVyKHtcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGh0dHAucG9zdChDb25zdGFudHMuYXBpX2NvbnRyb2xfdXJsICsgJy9jb250cm9sL2NtZCcsIHBhcmFtcywgKHN0YXR1cywgcnMpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHJzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyAmJiBkYXRhICYmIGRhdGEuc3RhdHVzID09ICdPSycpIHtcbiAgICAgICAgICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLnVwZGF0ZU1vZGVQb3dlckFuZEVuZXJneShlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5VUERBVEVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXygnQUNUSU9OLlVQREFURV9TVUNDRVNTJyksIGVudGl0eSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlcnJvciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX0ZBSUwnKSwgeyBcImVycm9yXCI6ICdlcnJvcicgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXQgY29udHJvbCBjbWRcbiAgICAgKiBAYXV0aG9yIExvbmcuUGhhbVxuICAgICAqIEBzaW5jZSAxMC8wMy8yMDIyXG4gICAgICogQHBhcmFtIHsqfSByZXMgXG4gICAgICogQHBhcmFtIHsqfSBwb3N0RGF0YSBcbiAgICAgKi9cbiAgICBjbWQocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgIGlmIChMaWJzLmlzT2JqZWN0RW1wdHkocG9zdERhdGEpKSB7XG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0eXBlID0gcG9zdERhdGEudHlwZTtcbiAgICAgICAgICAgIHZhciBkZXZpY2VJRCA9IHBvc3REYXRhLmRldmljZUlEO1xuICAgICAgICAgICAgdmFyIHBheWxvYWQgPSBwb3N0RGF0YS5wYXlsb2FkO1xuXG4gICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKHR5cGUpIHx8IExpYnMuaXNCbGFuayhkZXZpY2VJRCkgfHwgIUxpYnMuaXNBcnJheURhdGEocGF5bG9hZCkpIHtcbiAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlICsgXCJcIiB9LCAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHNlcnZpY2UgPSBuZXcgTWFpbkRldmljZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIFN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlcnZpY2Uuc2F2ZVN0YXR1c0NNRChwb3N0RGF0YSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJzICYmIGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBcIkRvbmVcIiwge30sIDApO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBcIkRvbmVcIiwge30sIDApO1xuICAgICAgICAgICAgLy8gcmVzLnNlbmQocmVzRGF0YSk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBkZXRhaWwgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDE0LzA5LzIwMjFcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldFBvd2VyTm93QnlEYXkocmVzLCBwb3N0RGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgTWFpbkRldmljZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgRGV2aWNlRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0UG93ZXJOb3dCeURheShlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbmV4cG9ydCBkZWZhdWx0IE1haW5EZXZpY2VDb250cm9sbGVyOyJdfQ==