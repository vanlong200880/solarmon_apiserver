'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseValidate2 = require('./BaseValidate');

var _BaseValidate3 = _interopRequireDefault(_BaseValidate2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeviceValidate = function (_BaseValidate) {
    _inherits(DeviceValidate, _BaseValidate);

    function DeviceValidate() {
        _classCallCheck(this, DeviceValidate);

        return _possibleConstructorReturn(this, (DeviceValidate.__proto__ || Object.getPrototypeOf(DeviceValidate)).call(this));
    }

    _createClass(DeviceValidate, [{
        key: 'setRule',
        value: function setRule() {

            this.addRuleForField('id_project', 'trim', true);
            this.addRuleForField('id_project', 'required', true, i18n.__('required'));
            this.addRuleForField('id_project', 'maxLength', 20, i18n.__('maxLength_input'));

            this.addRuleForField('id_device_type', 'trim', true);
            this.addRuleForField('id_device_type', 'required', true, i18n.__('required'));
            this.addRuleForField('id_device_type', 'maxLength', 20, i18n.__('maxLength_input'));

            this.addRuleForField('id_device_group', 'trim', true);
            this.addRuleForField('id_device_group', 'required', true, i18n.__('required'));
            this.addRuleForField('id_device_group', 'maxLength', 20, i18n.__('maxLength_input'));

            this.addRuleForField('name', 'trim', true);
            this.addRuleForField('name', 'required', true, i18n.__('required'));
            this.addRuleForField('name', 'maxLength', 200, i18n.__('maxLength_input'));

            this.addRuleForField('model', 'trim', true);
            this.addRuleForField('model', 'required', true, i18n.__('required'));
            this.addRuleForField('model', 'maxLength', 200, i18n.__('maxLength_input'));

            this.addRuleForField('serial_number', 'trim', true);
            this.addRuleForField('serial_number', 'required', true, i18n.__('required'));
            this.addRuleForField('serial_number', 'maxLength', 200, i18n.__('maxLength_input'));
        }
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({
                id_project: i18n.__('device.id_project'),
                id_device_type: i18n.__('device.id_device_type'),
                id_device_group: i18n.__('device.id_device_group'),
                name: i18n.__('device.name'),
                model: i18n.__('device.model'),
                serial_number: i18n.__('device.serial_number')
            });
        }
    }]);

    return DeviceValidate;
}(_BaseValidate3.default);

exports.default = DeviceValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvRGV2aWNlVmFsaWRhdGUuanMiXSwibmFtZXMiOlsiRGV2aWNlVmFsaWRhdGUiLCJhZGRSdWxlRm9yRmllbGQiLCJpMThuIiwiX18iLCJ2Iiwic2V0QWxpYXMiLCJpZF9wcm9qZWN0IiwiaWRfZGV2aWNlX3R5cGUiLCJpZF9kZXZpY2VfZ3JvdXAiLCJuYW1lIiwibW9kZWwiLCJzZXJpYWxfbnVtYmVyIiwiQmFzZVZhbGlkYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFDTUEsYzs7O0FBQ0YsOEJBQWE7QUFBQTs7QUFBQTtBQUVaOzs7O2tDQUNROztBQUVMLGlCQUFLQyxlQUFMLENBQXFCLFlBQXJCLEVBQW1DLE1BQW5DLEVBQTJDLElBQTNDO0FBQ0EsaUJBQUtBLGVBQUwsQ0FBcUIsWUFBckIsRUFBbUMsVUFBbkMsRUFBK0MsSUFBL0MsRUFBcURDLEtBQUtDLEVBQUwsQ0FBUSxVQUFSLENBQXJEO0FBQ0EsaUJBQUtGLGVBQUwsQ0FBcUIsWUFBckIsRUFBbUMsV0FBbkMsRUFBZ0QsRUFBaEQsRUFBb0RDLEtBQUtDLEVBQUwsQ0FBUSxpQkFBUixDQUFwRDs7QUFFQSxpQkFBS0YsZUFBTCxDQUFxQixnQkFBckIsRUFBdUMsTUFBdkMsRUFBK0MsSUFBL0M7QUFDQSxpQkFBS0EsZUFBTCxDQUFxQixnQkFBckIsRUFBdUMsVUFBdkMsRUFBbUQsSUFBbkQsRUFBeURDLEtBQUtDLEVBQUwsQ0FBUSxVQUFSLENBQXpEO0FBQ0EsaUJBQUtGLGVBQUwsQ0FBcUIsZ0JBQXJCLEVBQXVDLFdBQXZDLEVBQW9ELEVBQXBELEVBQXdEQyxLQUFLQyxFQUFMLENBQVEsaUJBQVIsQ0FBeEQ7O0FBRUEsaUJBQUtGLGVBQUwsQ0FBcUIsaUJBQXJCLEVBQXdDLE1BQXhDLEVBQWdELElBQWhEO0FBQ0EsaUJBQUtBLGVBQUwsQ0FBcUIsaUJBQXJCLEVBQXdDLFVBQXhDLEVBQW9ELElBQXBELEVBQTBEQyxLQUFLQyxFQUFMLENBQVEsVUFBUixDQUExRDtBQUNBLGlCQUFLRixlQUFMLENBQXFCLGlCQUFyQixFQUF3QyxXQUF4QyxFQUFxRCxFQUFyRCxFQUF5REMsS0FBS0MsRUFBTCxDQUFRLGlCQUFSLENBQXpEOztBQUVBLGlCQUFLRixlQUFMLENBQXFCLE1BQXJCLEVBQTZCLE1BQTdCLEVBQXFDLElBQXJDO0FBQ0EsaUJBQUtBLGVBQUwsQ0FBcUIsTUFBckIsRUFBNkIsVUFBN0IsRUFBeUMsSUFBekMsRUFBK0NDLEtBQUtDLEVBQUwsQ0FBUSxVQUFSLENBQS9DO0FBQ0EsaUJBQUtGLGVBQUwsQ0FBcUIsTUFBckIsRUFBNkIsV0FBN0IsRUFBMEMsR0FBMUMsRUFBK0NDLEtBQUtDLEVBQUwsQ0FBUSxpQkFBUixDQUEvQzs7QUFFQSxpQkFBS0YsZUFBTCxDQUFxQixPQUFyQixFQUE4QixNQUE5QixFQUFzQyxJQUF0QztBQUNBLGlCQUFLQSxlQUFMLENBQXFCLE9BQXJCLEVBQThCLFVBQTlCLEVBQTBDLElBQTFDLEVBQWdEQyxLQUFLQyxFQUFMLENBQVEsVUFBUixDQUFoRDtBQUNBLGlCQUFLRixlQUFMLENBQXFCLE9BQXJCLEVBQThCLFdBQTlCLEVBQTJDLEdBQTNDLEVBQWdEQyxLQUFLQyxFQUFMLENBQVEsaUJBQVIsQ0FBaEQ7O0FBRUEsaUJBQUtGLGVBQUwsQ0FBcUIsZUFBckIsRUFBc0MsTUFBdEMsRUFBOEMsSUFBOUM7QUFDQSxpQkFBS0EsZUFBTCxDQUFxQixlQUFyQixFQUFzQyxVQUF0QyxFQUFrRCxJQUFsRCxFQUF3REMsS0FBS0MsRUFBTCxDQUFRLFVBQVIsQ0FBeEQ7QUFDQSxpQkFBS0YsZUFBTCxDQUFxQixlQUFyQixFQUFzQyxXQUF0QyxFQUFtRCxHQUFuRCxFQUF3REMsS0FBS0MsRUFBTCxDQUFRLGlCQUFSLENBQXhEO0FBR0g7OzttQ0FDUztBQUNOLGlCQUFLQyxDQUFMLENBQU9DLFFBQVAsQ0FBZ0I7QUFDWkMsNEJBQVlKLEtBQUtDLEVBQUwsQ0FBUSxtQkFBUixDQURBO0FBRVpJLGdDQUFnQkwsS0FBS0MsRUFBTCxDQUFRLHVCQUFSLENBRko7QUFHWkssaUNBQWlCTixLQUFLQyxFQUFMLENBQVEsd0JBQVIsQ0FITDtBQUlaTSxzQkFBTVAsS0FBS0MsRUFBTCxDQUFRLGFBQVIsQ0FKTTtBQUtaTyx1QkFBT1IsS0FBS0MsRUFBTCxDQUFRLGNBQVIsQ0FMSztBQU1aUSwrQkFBZVQsS0FBS0MsRUFBTCxDQUFRLHNCQUFSO0FBTkgsYUFBaEI7QUFRSDs7OztFQXpDd0JTLHNCOztrQkEyQ2RaLGMiLCJmaWxlIjoiRGV2aWNlVmFsaWRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVZhbGlkYXRlIGZyb20gJy4vQmFzZVZhbGlkYXRlJztcbmNsYXNzIERldmljZVZhbGlkYXRlIGV4dGVuZHMgQmFzZVZhbGlkYXRle1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHNldFJ1bGUoKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdpZF9wcm9qZWN0JywgJ3RyaW0nLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2lkX3Byb2plY3QnLCAncmVxdWlyZWQnLCB0cnVlLCBpMThuLl9fKCdyZXF1aXJlZCcpKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2lkX3Byb2plY3QnLCAnbWF4TGVuZ3RoJywgMjAsIGkxOG4uX18oJ21heExlbmd0aF9pbnB1dCcpKTtcblxuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnaWRfZGV2aWNlX3R5cGUnLCAndHJpbScsIHRydWUpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnaWRfZGV2aWNlX3R5cGUnLCAncmVxdWlyZWQnLCB0cnVlLCBpMThuLl9fKCdyZXF1aXJlZCcpKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2lkX2RldmljZV90eXBlJywgJ21heExlbmd0aCcsIDIwLCBpMThuLl9fKCdtYXhMZW5ndGhfaW5wdXQnKSk7XG5cbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2lkX2RldmljZV9ncm91cCcsICd0cmltJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdpZF9kZXZpY2VfZ3JvdXAnLCAncmVxdWlyZWQnLCB0cnVlLCBpMThuLl9fKCdyZXF1aXJlZCcpKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2lkX2RldmljZV9ncm91cCcsICdtYXhMZW5ndGgnLCAyMCwgaTE4bi5fXygnbWF4TGVuZ3RoX2lucHV0JykpO1xuXG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCduYW1lJywgJ3RyaW0nLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ25hbWUnLCAncmVxdWlyZWQnLCB0cnVlLCBpMThuLl9fKCdyZXF1aXJlZCcpKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ25hbWUnLCAnbWF4TGVuZ3RoJywgMjAwLCBpMThuLl9fKCdtYXhMZW5ndGhfaW5wdXQnKSk7XG5cbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ21vZGVsJywgJ3RyaW0nLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ21vZGVsJywgJ3JlcXVpcmVkJywgdHJ1ZSwgaTE4bi5fXygncmVxdWlyZWQnKSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdtb2RlbCcsICdtYXhMZW5ndGgnLCAyMDAsIGkxOG4uX18oJ21heExlbmd0aF9pbnB1dCcpKTtcblxuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnc2VyaWFsX251bWJlcicsICd0cmltJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdzZXJpYWxfbnVtYmVyJywgJ3JlcXVpcmVkJywgdHJ1ZSwgaTE4bi5fXygncmVxdWlyZWQnKSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdzZXJpYWxfbnVtYmVyJywgJ21heExlbmd0aCcsIDIwMCwgaTE4bi5fXygnbWF4TGVuZ3RoX2lucHV0JykpO1xuXG4gICAgICAgIFxuICAgIH1cbiAgICBzZXRBbGlhcygpe1xuICAgICAgICB0aGlzLnYuc2V0QWxpYXMoe1xuICAgICAgICAgICAgaWRfcHJvamVjdDogaTE4bi5fXygnZGV2aWNlLmlkX3Byb2plY3QnKSxcbiAgICAgICAgICAgIGlkX2RldmljZV90eXBlOiBpMThuLl9fKCdkZXZpY2UuaWRfZGV2aWNlX3R5cGUnKSxcbiAgICAgICAgICAgIGlkX2RldmljZV9ncm91cDogaTE4bi5fXygnZGV2aWNlLmlkX2RldmljZV9ncm91cCcpLFxuICAgICAgICAgICAgbmFtZTogaTE4bi5fXygnZGV2aWNlLm5hbWUnKSxcbiAgICAgICAgICAgIG1vZGVsOiBpMThuLl9fKCdkZXZpY2UubW9kZWwnKSxcbiAgICAgICAgICAgIHNlcmlhbF9udW1iZXI6IGkxOG4uX18oJ2RldmljZS5zZXJpYWxfbnVtYmVyJylcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgRGV2aWNlVmFsaWRhdGU7Il19