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

var EmplyeeResetPasswordValidate = function (_BaseValidate) {
    _inherits(EmplyeeResetPasswordValidate, _BaseValidate);

    function EmplyeeResetPasswordValidate() {
        _classCallCheck(this, EmplyeeResetPasswordValidate);

        return _possibleConstructorReturn(this, (EmplyeeResetPasswordValidate.__proto__ || Object.getPrototypeOf(EmplyeeResetPasswordValidate)).call(this));
    }

    _createClass(EmplyeeResetPasswordValidate, [{
        key: 'setRule',
        value: function setRule() {
            this.addRuleForField('password', 'trim', true);
            this.addRuleForField('password', 'required', true, i18n.__('required'));
            this.addRuleForField('password', 'minLength', 10, i18n.__('minLength_input'));
        }
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({
                password: i18n.__('employee.password')
            });
        }
    }]);

    return EmplyeeResetPasswordValidate;
}(_BaseValidate3.default);

exports.default = EmplyeeResetPasswordValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvRW1wbHllZVJlc2V0UGFzc3dvcmRWYWxpZGF0ZS5qcyJdLCJuYW1lcyI6WyJFbXBseWVlUmVzZXRQYXNzd29yZFZhbGlkYXRlIiwiYWRkUnVsZUZvckZpZWxkIiwiaTE4biIsIl9fIiwidiIsInNldEFsaWFzIiwicGFzc3dvcmQiLCJCYXNlVmFsaWRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUNNQSw0Qjs7O0FBQ0YsNENBQWE7QUFBQTs7QUFBQTtBQUVaOzs7O2tDQUNRO0FBQ0wsaUJBQUtDLGVBQUwsQ0FBcUIsVUFBckIsRUFBaUMsTUFBakMsRUFBeUMsSUFBekM7QUFDQSxpQkFBS0EsZUFBTCxDQUFxQixVQUFyQixFQUFpQyxVQUFqQyxFQUE2QyxJQUE3QyxFQUFtREMsS0FBS0MsRUFBTCxDQUFRLFVBQVIsQ0FBbkQ7QUFDQSxpQkFBS0YsZUFBTCxDQUFxQixVQUFyQixFQUFpQyxXQUFqQyxFQUE4QyxFQUE5QyxFQUFrREMsS0FBS0MsRUFBTCxDQUFRLGlCQUFSLENBQWxEO0FBQ0g7OzttQ0FDUztBQUNOLGlCQUFLQyxDQUFMLENBQU9DLFFBQVAsQ0FBZ0I7QUFDWkMsMEJBQVVKLEtBQUtDLEVBQUwsQ0FBUSxtQkFBUjtBQURFLGFBQWhCO0FBR0g7Ozs7RUFic0NJLHNCOztrQkFlNUJQLDRCIiwiZmlsZSI6IkVtcGx5ZWVSZXNldFBhc3N3b3JkVmFsaWRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBCYXNlVmFsaWRhdGUgZnJvbSAnLi9CYXNlVmFsaWRhdGUnO1xuY2xhc3MgRW1wbHllZVJlc2V0UGFzc3dvcmRWYWxpZGF0ZSBleHRlbmRzIEJhc2VWYWxpZGF0ZXtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBzZXRSdWxlKCl7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdwYXNzd29yZCcsICd0cmltJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdwYXNzd29yZCcsICdyZXF1aXJlZCcsIHRydWUsIGkxOG4uX18oJ3JlcXVpcmVkJykpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgncGFzc3dvcmQnLCAnbWluTGVuZ3RoJywgMTAsIGkxOG4uX18oJ21pbkxlbmd0aF9pbnB1dCcpKTtcbiAgICB9XG4gICAgc2V0QWxpYXMoKXtcbiAgICAgICAgdGhpcy52LnNldEFsaWFzKHtcbiAgICAgICAgICAgIHBhc3N3b3JkOiBpMThuLl9fKCdlbXBsb3llZS5wYXNzd29yZCcpXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEVtcGx5ZWVSZXNldFBhc3N3b3JkVmFsaWRhdGU7Il19