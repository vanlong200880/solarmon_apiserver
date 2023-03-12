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

var EmployeeUpdateProfileValidate = function (_BaseValidate) {
    _inherits(EmployeeUpdateProfileValidate, _BaseValidate);

    function EmployeeUpdateProfileValidate() {
        _classCallCheck(this, EmployeeUpdateProfileValidate);

        return _possibleConstructorReturn(this, (EmployeeUpdateProfileValidate.__proto__ || Object.getPrototypeOf(EmployeeUpdateProfileValidate)).call(this));
    }

    _createClass(EmployeeUpdateProfileValidate, [{
        key: 'setRule',
        value: function setRule() {
            this.addRuleForField('first_name', 'trim', true);
            this.addRuleForField('first_name', 'required', true, i18n.__('required'));
            this.addRuleForField('first_name', 'maxLength', 100, i18n.__('maxLength_input'));

            this.addRuleForField('last_name', 'trim', true);
            this.addRuleForField('last_name', 'required', true, i18n.__('required'));
            this.addRuleForField('last_name', 'maxLength', 100, i18n.__('maxLength_input'));

            this.addRuleForField('id', 'trim', true);
            this.addRuleForField('id', 'required', true, i18n.__('required'));
            this.addRuleForField('id', 'maxLength', 50, i18n.__('maxLength_input'));
        }
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({
                id: i18n.__('employee.id'),
                first_name: i18n.__('employee.first_name'),
                last_name: i18n.__('employee.last_name')
            });
        }
    }]);

    return EmployeeUpdateProfileValidate;
}(_BaseValidate3.default);

exports.default = EmployeeUpdateProfileValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvRW1wbG95ZWVVcGRhdGVQcm9maWxlVmFsaWRhdGUuanMiXSwibmFtZXMiOlsiRW1wbG95ZWVVcGRhdGVQcm9maWxlVmFsaWRhdGUiLCJhZGRSdWxlRm9yRmllbGQiLCJpMThuIiwiX18iLCJ2Iiwic2V0QWxpYXMiLCJpZCIsImZpcnN0X25hbWUiLCJsYXN0X25hbWUiLCJCYXNlVmFsaWRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSw2Qjs7O0FBQ0YsNkNBQWE7QUFBQTs7QUFBQTtBQUVaOzs7O2tDQUNRO0FBQ0wsaUJBQUtDLGVBQUwsQ0FBcUIsWUFBckIsRUFBbUMsTUFBbkMsRUFBMkMsSUFBM0M7QUFDQSxpQkFBS0EsZUFBTCxDQUFxQixZQUFyQixFQUFtQyxVQUFuQyxFQUErQyxJQUEvQyxFQUFxREMsS0FBS0MsRUFBTCxDQUFRLFVBQVIsQ0FBckQ7QUFDQSxpQkFBS0YsZUFBTCxDQUFxQixZQUFyQixFQUFtQyxXQUFuQyxFQUFnRCxHQUFoRCxFQUFxREMsS0FBS0MsRUFBTCxDQUFRLGlCQUFSLENBQXJEOztBQUVBLGlCQUFLRixlQUFMLENBQXFCLFdBQXJCLEVBQWtDLE1BQWxDLEVBQTBDLElBQTFDO0FBQ0EsaUJBQUtBLGVBQUwsQ0FBcUIsV0FBckIsRUFBa0MsVUFBbEMsRUFBOEMsSUFBOUMsRUFBb0RDLEtBQUtDLEVBQUwsQ0FBUSxVQUFSLENBQXBEO0FBQ0EsaUJBQUtGLGVBQUwsQ0FBcUIsV0FBckIsRUFBa0MsV0FBbEMsRUFBK0MsR0FBL0MsRUFBb0RDLEtBQUtDLEVBQUwsQ0FBUSxpQkFBUixDQUFwRDs7QUFFQSxpQkFBS0YsZUFBTCxDQUFxQixJQUFyQixFQUEyQixNQUEzQixFQUFtQyxJQUFuQztBQUNBLGlCQUFLQSxlQUFMLENBQXFCLElBQXJCLEVBQTJCLFVBQTNCLEVBQXVDLElBQXZDLEVBQTZDQyxLQUFLQyxFQUFMLENBQVEsVUFBUixDQUE3QztBQUNBLGlCQUFLRixlQUFMLENBQXFCLElBQXJCLEVBQTJCLFdBQTNCLEVBQXdDLEVBQXhDLEVBQTRDQyxLQUFLQyxFQUFMLENBQVEsaUJBQVIsQ0FBNUM7QUFFSDs7O21DQUNTO0FBQ04saUJBQUtDLENBQUwsQ0FBT0MsUUFBUCxDQUFnQjtBQUNaQyxvQkFBSUosS0FBS0MsRUFBTCxDQUFRLGFBQVIsQ0FEUTtBQUVaSSw0QkFBWUwsS0FBS0MsRUFBTCxDQUFRLHFCQUFSLENBRkE7QUFHWkssMkJBQVdOLEtBQUtDLEVBQUwsQ0FBUSxvQkFBUjtBQUhDLGFBQWhCO0FBS0g7Ozs7RUF4QnVDTSxzQjs7a0JBMEI3QlQsNkIiLCJmaWxlIjoiRW1wbG95ZWVVcGRhdGVQcm9maWxlVmFsaWRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVZhbGlkYXRlIGZyb20gJy4vQmFzZVZhbGlkYXRlJztcbmNsYXNzIEVtcGxveWVlVXBkYXRlUHJvZmlsZVZhbGlkYXRlIGV4dGVuZHMgQmFzZVZhbGlkYXRle1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHNldFJ1bGUoKXtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2ZpcnN0X25hbWUnLCAndHJpbScsIHRydWUpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnZmlyc3RfbmFtZScsICdyZXF1aXJlZCcsIHRydWUsIGkxOG4uX18oJ3JlcXVpcmVkJykpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnZmlyc3RfbmFtZScsICdtYXhMZW5ndGgnLCAxMDAsIGkxOG4uX18oJ21heExlbmd0aF9pbnB1dCcpKTtcblxuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnbGFzdF9uYW1lJywgJ3RyaW0nLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2xhc3RfbmFtZScsICdyZXF1aXJlZCcsIHRydWUsIGkxOG4uX18oJ3JlcXVpcmVkJykpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnbGFzdF9uYW1lJywgJ21heExlbmd0aCcsIDEwMCwgaTE4bi5fXygnbWF4TGVuZ3RoX2lucHV0JykpO1xuXG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdpZCcsICd0cmltJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdpZCcsICdyZXF1aXJlZCcsIHRydWUsIGkxOG4uX18oJ3JlcXVpcmVkJykpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnaWQnLCAnbWF4TGVuZ3RoJywgNTAsIGkxOG4uX18oJ21heExlbmd0aF9pbnB1dCcpKTtcblxuICAgIH1cbiAgICBzZXRBbGlhcygpe1xuICAgICAgICB0aGlzLnYuc2V0QWxpYXMoe1xuICAgICAgICAgICAgaWQ6IGkxOG4uX18oJ2VtcGxveWVlLmlkJyksXG4gICAgICAgICAgICBmaXJzdF9uYW1lOiBpMThuLl9fKCdlbXBsb3llZS5maXJzdF9uYW1lJyksXG4gICAgICAgICAgICBsYXN0X25hbWU6IGkxOG4uX18oJ2VtcGxveWVlLmxhc3RfbmFtZScpXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEVtcGxveWVlVXBkYXRlUHJvZmlsZVZhbGlkYXRlOyJdfQ==