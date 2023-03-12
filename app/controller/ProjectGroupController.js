'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractManagerController = require('../core/AbstractManagerController');

var _AbstractManagerController2 = _interopRequireDefault(_AbstractManagerController);

var _ProjectGroupEntity = require('../entities/ProjectGroupEntity');

var _ProjectGroupEntity2 = _interopRequireDefault(_ProjectGroupEntity);

var _ProjectGroupService = require('../services/ProjectGroupService');

var _ProjectGroupService2 = _interopRequireDefault(_ProjectGroupService);

var _ProjectGroupValidate = require('../validator/ProjectGroupValidate');

var _ProjectGroupValidate2 = _interopRequireDefault(_ProjectGroupValidate);

var _sync = require('sync');

var _sync2 = _interopRequireDefault(_sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProjectGroupController = function (_AbstractManagerContr) {
    _inherits(ProjectGroupController, _AbstractManagerContr);

    function ProjectGroupController() {
        _classCallCheck(this, ProjectGroupController);

        return _possibleConstructorReturn(this, (ProjectGroupController.__proto__ || Object.getPrototypeOf(ProjectGroupController)).apply(this, arguments));
    }

    _createClass(ProjectGroupController, [{
        key: 'getList',


        /**
        * @description Get List item
        * @author Long.Pham
        * @since 10/07/2019
        * @param {} res 
        * @param {*} postData 
        */
        value: function getList(res, postData) {
            try {
                var service = new _ProjectGroupService2.default();
                var entity = new _ProjectGroupEntity2.default();
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
         * @description Get detail item
         * @author Long.Pham
         * @since 11/07/2018
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'getDetail',
        value: function getDetail(res, postData) {
            try {
                var service = new _ProjectGroupService2.default();
                var entity = new _ProjectGroupEntity2.default();
                entity = Object.assign({}, entity, postData);
                service.getDetail(entity, function (err, rs) {
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
         * @description Delete item
         * @author Long.Pham
         * @since 11/07/2018
         * @param {*} res 
         * @param {*} postData 
         */

    }, {
        key: 'deleteAction',
        value: function deleteAction(res, postData) {
            try {
                var service = new _ProjectGroupService2.default();
                var entity = new _ProjectGroupEntity2.default();
                entity = Object.assign({}, entity, postData);
                if (Libs.isBlank(entity.id)) {
                    var resData = {};
                    resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                    res.send(resData);
                    return;
                }
                service.delete(entity, function (err, rs) {
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
        key: 'saveAction',
        value: async function saveAction(res, postData) {
            try {
                var service = new _ProjectGroupService2.default();
                var entity = Object.assign({}, new _ProjectGroupEntity2.default(), postData);
                entity.status = !entity.status || entity.status == -1 ? 0 : 1;
                var validate = new _ProjectGroupValidate2.default();
                validate.FLValidationAll(entity, async function (err, key) {
                    try {
                        if (err) {
                            var resData = Libs.returnJsonResult(false, err.message, {}, 0);
                            res.send(resData);
                            return;
                        }
                        if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.insert) {
                            (0, _sync2.default)(function () {
                                service.insert(entity, function (err, rs) {
                                    if (rs) {
                                        entity.id = rs.insertId;
                                        var _resData = Libs.returnJsonResult(true, i18n.__('ACTION.SAVE_SUCCESS'), entity, rs);
                                        res.send(_resData);
                                    } else {
                                        var _resData2 = Libs.returnJsonResult(false, i18n.__('ACTION.SAVE_FAIL'), { "error": err }, 0);
                                        res.send(_resData2);
                                    }
                                });
                            });
                        } else if (entity.hasOwnProperty('screen_mode') && entity.screen_mode == Constants.screen_mode.update) {
                            (0, _sync2.default)(function () {
                                service.update(entity, function (err, rsupdate) {
                                    try {
                                        if (!rsupdate) {
                                            var _resData4 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                            res.send(_resData4);
                                            return;
                                        }
                                        var _resData3 = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, rsupdate);
                                        res.send(_resData3);
                                    } catch (error) {
                                        var _resData5 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                                        res.send(_resData5);
                                    }
                                });
                            });
                        } else {
                            var _resData6 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), {}, 0);
                            res.send(_resData6);
                        }
                    } catch (e) {
                        var _resData7 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                        res.send(_resData7);
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
        key: 'updateStatus',
        value: function updateStatus(res, postData) {
            try {
                var service = new _ProjectGroupService2.default();
                var entity = Object.assign({}, new _ProjectGroupEntity2.default(), postData);
                entity.status = !entity.status || entity.status == -1 ? 0 : 1;

                if (Libs.isBlank(entity.id)) {
                    var resData = {};
                    resData = Libs.returnJsonResult(true, i18n.__("NOT_EXIST"), {}, 0);
                    res.send(resData);
                    return;
                }

                (0, _sync2.default)(function () {
                    service.updateStatus(entity, function (err, rsupdate) {
                        try {
                            if (!rsupdate) {
                                var _resData9 = Libs.returnJsonResult(false, i18n.__('ACTION.UPDATE_FAIL'), { "error": err }, 0);
                                res.send(_resData9);
                                return;
                            }
                            var _resData8 = Libs.returnJsonResult(true, i18n.__('ACTION.UPDATE_SUCCESS'), entity, 0);
                            res.send(_resData8);
                        } catch (error) {
                            var _resData10 = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": error }, 0);
                            res.send(_resData10);
                        }
                    });
                });
            } catch (e) {
                var resData = Libs.returnJsonResult(false, i18n.__('ERR_SYSTEM'), { "error": e + "" }, 0);
                res.send(resData);
            }
        }

        /**
        * @description Get all
        * @author Long.Pham
        * @since 10/07/2019
        * @param {} res 
        * @param {*} postData 
        */

    }, {
        key: 'getDropDownList',
        value: function getDropDownList(res, postData) {
            try {
                var service = new _ProjectGroupService2.default();
                var entity = new _ProjectGroupEntity2.default();
                entity = Object.assign({}, entity, postData);
                service.getDropDownList(entity, function (err, rs) {
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
    }]);

    return ProjectGroupController;
}(_AbstractManagerController2.default);

exports.default = ProjectGroupController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL1Byb2plY3RHcm91cENvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiUHJvamVjdEdyb3VwQ29udHJvbGxlciIsInJlcyIsInBvc3REYXRhIiwic2VydmljZSIsIlByb2plY3RHcm91cFNlcnZpY2UiLCJlbnRpdHkiLCJQcm9qZWN0R3JvdXBFbnRpdHkiLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRMaXN0IiwiZXJyIiwicnMiLCJnZXRTaXplIiwiZXJyMSIsInJzMSIsInJlc0RhdGEiLCJMaWJzIiwicmV0dXJuSnNvblJlc3VsdCIsImkxOG4iLCJfXyIsInRvdGFsUm93Iiwic2VuZCIsImUiLCJsb2dnZXIiLCJlcnJvciIsImdldERldGFpbCIsImlzQmxhbmsiLCJpZCIsImRlbGV0ZSIsInN0YXR1cyIsInZhbGlkYXRlIiwiUHJvamVjdEdyb3VwVmFsaWRhdGUiLCJGTFZhbGlkYXRpb25BbGwiLCJrZXkiLCJtZXNzYWdlIiwiaGFzT3duUHJvcGVydHkiLCJzY3JlZW5fbW9kZSIsIkNvbnN0YW50cyIsImluc2VydCIsImluc2VydElkIiwidXBkYXRlIiwicnN1cGRhdGUiLCJ1cGRhdGVTdGF0dXMiLCJnZXREcm9wRG93bkxpc3QiLCJBYnN0cmFjdE1hbmFnZXJDb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSxzQjs7Ozs7Ozs7Ozs7OztBQUdGOzs7Ozs7O2dDQU9RQyxHLEVBQUtDLFEsRUFBVTtBQUNuQixnQkFBSTtBQUNBLG9CQUFJQyxVQUFVLElBQUlDLDZCQUFKLEVBQWQ7QUFDQSxvQkFBSUMsU0FBUyxJQUFJQyw0QkFBSixFQUFiO0FBQ0FELHlCQUFTRSxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkgsTUFBbEIsRUFBMEJILFFBQTFCLENBQVQ7QUFDQUMsd0JBQVFNLE9BQVIsQ0FBZ0JKLE1BQWhCLEVBQXdCLFVB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S0FBS0MsZ0JBQUwsQ0FBc0IsS0FBdEIsRUFBNkJDLEtBQUtDLEVBQUwsQ0FBUSxZQUFSLENBQTdCLEVBQW9ELEVBQUUsU0FBU0csSUFBSSxFQUFmLEVBQXBELEVBQXlFLENBQXpFLENBQVY7QUFDQXJCLG9CQUFJb0IsSUFBSixDQUFTTixPQUFUO0FBQ0g7QUFDSjs7OztFQXBQZ0M2QixtQzs7a0JBdVB0QjVDLHNCIiwiZmlsZSI6IlByb2plY3RHcm91cENvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciBmcm9tICcuLi9jb3JlL0Fic3RyYWN0TWFuYWdlckNvbnRyb2xsZXInO1xuaW1wb3J0IFByb2plY3RHcm91cEVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Qcm9qZWN0R3JvdXBFbnRpdHknO1xuaW1wb3J0IFByb2plY3RHcm91cFNlcnZpY2UgZnJvbSAnLi4vc2VydmljZXMvUHJvamVjdEdyb3VwU2VydmljZSc7XG5pbXBvcnQgUHJvamVjdEdyb3VwVmFsaWRhdGUgZnJvbSAnLi4vdmFsaWRhdG9yL1Byb2plY3RHcm91cFZhbGlkYXRlJztcbmltcG9ydCBTeW5jIGZyb20gJ3N5bmMnO1xuXG5jbGFzcyBQcm9qZWN0R3JvdXBDb250cm9sbGVyIGV4dGVuZHMgQWJzdHJhY3RNYW5hZ2VyQ29udHJvbGxlciB7XG5cbiAgIFxuICAgIC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IExpc3QgaXRlbVxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxuXHQgKiBAc2luY2UgMTAvMDcvMjAxOVxuXHQgKiBAcGFyYW0ge30gcmVzIFxuXHQgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuXHQgKi9cbiAgICBnZXRMaXN0KHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IFByb2plY3RHcm91cFNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgUHJvamVjdEdyb3VwRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0TGlzdChlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRTaXplKGVudGl0eSwgZnVuY3Rpb24gKGVycjEsIHJzMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlcnIxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiQUNUSU9OLlNVQ0NFU1NcIiksIHJzLCByczEudG90YWxSb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKFwiTOG7l2k6IFwiICsgZSk7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldCBkZXRhaWwgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDExLzA3LzIwMThcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGdldERldGFpbChyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc2VydmljZSA9IG5ldyBQcm9qZWN0R3JvdXBTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IFByb2plY3RHcm91cEVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBzZXJ2aWNlLmdldERldGFpbChlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oXCJBQ1RJT04uRkFJTFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBEZWxldGUgaXRlbVxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDExLzA3LzIwMThcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIGRlbGV0ZUFjdGlvbihyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBQcm9qZWN0R3JvdXBTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gbmV3IFByb2plY3RHcm91cEVudGl0eSgpO1xuICAgICAgICAgICAgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBpZiAoTGlicy5pc0JsYW5rKGVudGl0eS5pZCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQodHJ1ZSwgaTE4bi5fXyhcIk5PVF9FWElTVFwiKSwge30sIDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlcnZpY2UuZGVsZXRlKGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uREVMRVRFX1NVQ0NFU1MnKSwgZW50aXR5LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5ERUxFVEVfRkFJTCcpLCB7fSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uREVMRVRFX0ZBSUwnKSwge30sIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGFjdGlvblxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDExLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgICBhc3luYyBzYXZlQWN0aW9uKHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IFByb2plY3RHcm91cFNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgUHJvamVjdEdyb3VwRW50aXR5KCksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIGVudGl0eS5zdGF0dXMgPSAoIWVudGl0eS5zdGF0dXMgfHwgZW50aXR5LnN0YXR1cyA9PSAtMSkgPyAwIDogMTtcbiAgICAgICAgICAgIGxldCB2YWxpZGF0ZSA9IG5ldyBQcm9qZWN0R3JvdXBWYWxpZGF0ZSgpO1xuICAgICAgICAgICAgdmFsaWRhdGUuRkxWYWxpZGF0aW9uQWxsKGVudGl0eSwgYXN5bmMgZnVuY3Rpb24gKGVyciwga2V5KSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGVyci5tZXNzYWdlLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZW50aXR5Lmhhc093blByb3BlcnR5KCdzY3JlZW5fbW9kZScpICYmIGVudGl0eS5zY3JlZW5fbW9kZSA9PSBDb25zdGFudHMuc2NyZWVuX21vZGUuaW5zZXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTeW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmluc2VydChlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50aXR5LmlkID0gcnMuaW5zZXJ0SWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uU0FWRV9TVUNDRVNTJyksIGVudGl0eSwgcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnQUNUSU9OLlNBVkVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVudGl0eS5oYXNPd25Qcm9wZXJ0eSgnc2NyZWVuX21vZGUnKSAmJiBlbnRpdHkuc2NyZWVuX21vZGUgPT0gQ29uc3RhbnRzLnNjcmVlbl9tb2RlLnVwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgU3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS51cGRhdGUoZW50aXR5LCBmdW5jdGlvbiAoZXJyLCByc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyc3VwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX0ZBSUwnKSwgeyBcImVycm9yXCI6IGVyciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKCdBQ1RJT04uVVBEQVRFX1NVQ0NFU1MnKSwgZW50aXR5LCByc3VwZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHsgXCJlcnJvclwiOiBlcnJvciB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKCdFUlJfU1lTVEVNJyksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTYXZlIGFjdGlvblxuICAgICAqIEBhdXRob3IgTG9uZy5QaGFtXG4gICAgICogQHNpbmNlIDExLzA3LzIwMTlcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcbiAgICAgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuICAgICAqL1xuICAgIHVwZGF0ZVN0YXR1cyhyZXMsIHBvc3REYXRhKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VydmljZSA9IG5ldyBQcm9qZWN0R3JvdXBTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgZW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IFByb2plY3RHcm91cEVudGl0eSgpLCBwb3N0RGF0YSk7XG4gICAgICAgICAgICBlbnRpdHkuc3RhdHVzID0gKCFlbnRpdHkuc3RhdHVzIHx8IGVudGl0eS5zdGF0dXMgPT0gLTEpID8gMCA6IDE7XG5cbiAgICAgICAgICAgIGlmIChMaWJzLmlzQmxhbmsoZW50aXR5LmlkKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNEYXRhID0ge307XG4gICAgICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdCh0cnVlLCBpMThuLl9fKFwiTk9UX0VYSVNUXCIpLCB7fSwgMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBTeW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLnVwZGF0ZVN0YXR1cyhlbnRpdHksIGZ1bmN0aW9uIChlcnIsIHJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJzdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0FDVElPTi5VUERBVEVfRkFJTCcpLCB7IFwiZXJyb3JcIjogZXJyIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oJ0FDVElPTi5VUERBVEVfU1VDQ0VTUycpLCBlbnRpdHksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZXJyb3IgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHJlc0RhdGEgPSBMaWJzLnJldHVybkpzb25SZXN1bHQoZmFsc2UsIGkxOG4uX18oJ0VSUl9TWVNURU0nKSwgeyBcImVycm9yXCI6IGUgKyBcIlwiIH0sIDApO1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gR2V0IGFsbFxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxuXHQgKiBAc2luY2UgMTAvMDcvMjAxOVxuXHQgKiBAcGFyYW0ge30gcmVzIFxuXHQgKiBAcGFyYW0geyp9IHBvc3REYXRhIFxuXHQgKi9cbiAgICAgZ2V0RHJvcERvd25MaXN0KHJlcywgcG9zdERhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlID0gbmV3IFByb2plY3RHcm91cFNlcnZpY2UoKTtcbiAgICAgICAgICAgIGxldCBlbnRpdHkgPSBuZXcgUHJvamVjdEdyb3VwRW50aXR5KCk7XG4gICAgICAgICAgICBlbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHBvc3REYXRhKTtcbiAgICAgICAgICAgIHNlcnZpY2UuZ2V0RHJvcERvd25MaXN0KGVudGl0eSwgZnVuY3Rpb24gKGVyciwgcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KHRydWUsIGkxOG4uX18oXCJBQ1RJT04uU1VDQ0VTU1wiKSwgcnMsIDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNEYXRhID0gTGlicy5yZXR1cm5Kc29uUmVzdWx0KGZhbHNlLCBpMThuLl9fKFwiQUNUSU9OLkZBSUxcIiksIHt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQocmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKFwiTOG7l2k6IFwiICsgZSk7XG4gICAgICAgICAgICB2YXIgcmVzRGF0YSA9IHt9O1xuICAgICAgICAgICAgcmVzRGF0YSA9IExpYnMucmV0dXJuSnNvblJlc3VsdChmYWxzZSwgaTE4bi5fXygnRVJSX1NZU1RFTScpLCB7IFwiZXJyb3JcIjogZSArIFwiXCIgfSwgMCk7XG4gICAgICAgICAgICByZXMuc2VuZChyZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbn1cbmV4cG9ydCBkZWZhdWx0IFByb2plY3RHcm91cENvbnRyb2xsZXI7Il19