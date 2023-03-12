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

var EmployeeForgotPasswordValidate = function (_BaseValidate) {
    _inherits(EmployeeForgotPasswordValidate, _BaseValidate);

    function EmployeeForgotPasswordValidate() {
        _classCallCheck(this, EmployeeForgotPasswordValidate);

        return _possibleConstructorReturn(this, (EmployeeForgotPasswordValidate.__proto__ || Object.getPrototypeOf(EmployeeForgotPasswordValidate)).call(this));
    }

    _createClass(EmployeeForgotPasswordValidate, [{
        key: 'setRule',
        value: function setRule() {
            this.addRuleForField('email', 'trim', true);
            this.addRuleForField('email', 'required', false, i18n.__('required'));
            this.addRuleForField('email', 'type', 'email', i18n.__('type_email'));
            this.addRuleForField('email', 'maxLength', 50, i18n.__('maxLength_input'));
        }
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({
                email: i18n.__('employee.email')
            });
        }
    }]);

    return EmployeeForgotPasswordValidate;
}(_BaseValidate3.default);

exports.default = EmployeeForgotPasswordValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvRW1wbG95ZWVGb3Jnb3RQYXNzd29yZFZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbIkVtcGxveWVlRm9yZ290UGFzc3dvcmRWYWxpZGF0ZSIsImFkZFJ1bGVGb3JGaWVsZCIsImkxOG4iLCJfXyIsInYiLCJzZXRBbGlhcyIsImVtYWlsIiwiQmFzZVZhbGlkYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFDTUEsOEI7OztBQUNGLDhDQUFhO0FBQUE7O0FBQUE7QUFFWjs7OztrQ0FDUTtBQUNMLGlCQUFLQyxlQUFMLENBQXFCLE9BQXJCLEVBQThCLE1BQTlCLEVBQXNDLElBQXRDO0FBQ0EsaUJBQUtBLGVBQUwsQ0FBcUIsT0FBckIsRUFBOEIsVUFBOUIsRUFBMEMsS0FBMUMsRUFBaURDLEtBQUtDLEVBQUwsQ0FBUSxVQUFSLENBQWpEO0FBQ0EsaUJBQUtGLGVBQUwsQ0FBcUIsT0FBckIsRUFBOEIsTUFBOUIsRUFBc0MsT0FBdEMsRUFBK0NDLEtBQUtDLEVBQUwsQ0FBUSxZQUFSLENBQS9DO0FBQ0EsaUJBQUtGLGVBQUwsQ0FBcUIsT0FBckIsRUFBOEIsV0FBOUIsRUFBMkMsRUFBM0MsRUFBK0NDLEtBQUtDLEVBQUwsQ0FBUSxpQkFBUixDQUEvQztBQUNIOzs7bUNBQ1M7QUFDTixpQkFBS0MsQ0FBTCxDQUFPQyxRQUFQLENBQWdCO0FBQ1pDLHVCQUFPSixLQUFLQyxFQUFMLENBQVEsZ0JBQVI7QUFESyxhQUFoQjtBQUdIOzs7O0VBZHdDSSxzQjs7a0JBZ0I5QlAsOEIiLCJmaWxlIjoiRW1wbG95ZWVGb3Jnb3RQYXNzd29yZFZhbGlkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VWYWxpZGF0ZSBmcm9tICcuL0Jhc2VWYWxpZGF0ZSc7XG5jbGFzcyBFbXBsb3llZUZvcmdvdFBhc3N3b3JkVmFsaWRhdGUgZXh0ZW5kcyBCYXNlVmFsaWRhdGV7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgc2V0UnVsZSgpe1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnZW1haWwnLCAndHJpbScsIHRydWUpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnZW1haWwnLCAncmVxdWlyZWQnLCBmYWxzZSwgaTE4bi5fXygncmVxdWlyZWQnKSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdlbWFpbCcsICd0eXBlJywgJ2VtYWlsJywgaTE4bi5fXygndHlwZV9lbWFpbCcpKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2VtYWlsJywgJ21heExlbmd0aCcsIDUwLCBpMThuLl9fKCdtYXhMZW5ndGhfaW5wdXQnKSk7XG4gICAgfVxuICAgIHNldEFsaWFzKCl7XG4gICAgICAgIHRoaXMudi5zZXRBbGlhcyh7XG4gICAgICAgICAgICBlbWFpbDogaTE4bi5fXygnZW1wbG95ZWUuZW1haWwnKSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgRW1wbG95ZWVGb3Jnb3RQYXNzd29yZFZhbGlkYXRlO1xuXG4iXX0=