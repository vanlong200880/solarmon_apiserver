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

var EmployeeChangePassWordValidate = function (_BaseValidate) {
    _inherits(EmployeeChangePassWordValidate, _BaseValidate);

    function EmployeeChangePassWordValidate() {
        _classCallCheck(this, EmployeeChangePassWordValidate);

        return _possibleConstructorReturn(this, (EmployeeChangePassWordValidate.__proto__ || Object.getPrototypeOf(EmployeeChangePassWordValidate)).call(this));
    }

    _createClass(EmployeeChangePassWordValidate, [{
        key: 'setRule',
        value: function setRule() {
            this.addRuleForField('email', 'trim', true);
            this.addRuleForField('email', 'required', false, i18n.__('required'));
            this.addRuleForField('email', 'type', 'email', i18n.__('type_email'));
            this.addRuleForField('email', 'maxLength', 100, i18n.__('maxLength_input'));

            this.v.addRule('password', 'trim', true);
            this.v.addRule('password', 'required', true);
            this.v.setMsg('password', 'required', i18n.__('required'));
            this.v.addRule('password', 'minLength', 8);
            this.v.setMsg('password', 'minLength', i18n.__('minLength_input'));
        }
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({
                email: i18n.__('email'),
                password: i18n.__('password')
            });
        }
    }]);

    return EmployeeChangePassWordValidate;
}(_BaseValidate3.default);

exports.default = EmployeeChangePassWordValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvRW1wbG95ZWVDaGFuZ2VQYXNzV29yZFZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbIkVtcGxveWVlQ2hhbmdlUGFzc1dvcmRWYWxpZGF0ZSIsImFkZFJ1bGVGb3JGaWVsZCIsImkxOG4iLCJfXyIsInYiLCJhZGRSdWxlIiwic2V0TXNnIiwic2V0QWxpYXMiLCJlbWFpbCIsInBhc3N3b3JkIiwiQmFzZVZhbGlkYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFDTUEsOEI7OztBQUNGLDhDQUFhO0FBQUE7O0FBQUE7QUFFWjs7OztrQ0FDUTtBQUNMLGlCQUFLQyxlQUFMLENBQXFCLE9BQXJCLEVBQThCLE1BQTlCLEVBQXNDLElBQXRDO0FBQ0EsaUJBQUtBLGVBQUwsQ0FBcUIsT0FBckIsRUFBOEIsVUFBOUIsRUFBMEMsS0FBMUMsRUFBaURDLEtBQUtDLEVBQUwsQ0FBUSxVQUFSLENBQWpEO0FBQ0EsaUJBQUtGLGVBQUwsQ0FBcUIsT0FBckIsRUFBOEIsTUFBOUIsRUFBc0MsT0FBdEMsRUFBK0NDLEtBQUtDLEVBQUwsQ0FBUSxZQUFSLENBQS9DO0FBQ0EsaUJBQUtGLGVBQUwsQ0FBcUIsT0FBckIsRUFBOEIsV0FBOUIsRUFBMkMsR0FBM0MsRUFBZ0RDLEtBQUtDLEVBQUwsQ0FBUSxpQkFBUixDQUFoRDs7QUFFQSxpQkFBS0MsQ0FBTCxDQUFPQyxPQUFQLENBQWUsVUFBZixFQUEyQixNQUEzQixFQUFtQyxJQUFuQztBQUNBLGlCQUFLRCxDQUFMLENBQU9DLE9BQVAsQ0FBZSxVQUFmLEVBQTJCLFVBQTNCLEVBQXVDLElBQXZDO0FBQ0EsaUJBQUtELENBQUwsQ0FBT0UsTUFBUCxDQUFjLFVBQWQsRUFBMEIsVUFBMUIsRUFBc0NKLEtBQUtDLEVBQUwsQ0FBUSxVQUFSLENBQXRDO0FBQ0EsaUJBQUtDLENBQUwsQ0FBT0MsT0FBUCxDQUFlLFVBQWYsRUFBMkIsV0FBM0IsRUFBd0MsQ0FBeEM7QUFDQSxpQkFBS0QsQ0FBTCxDQUFPRSxNQUFQLENBQWMsVUFBZCxFQUEwQixXQUExQixFQUF1Q0osS0FBS0MsRUFBTCxDQUFRLGlCQUFSLENBQXZDO0FBQ0g7OzttQ0FDUztBQUNOLGlCQUFLQyxDQUFMLENBQU9HLFFBQVAsQ0FBZ0I7QUFDWkMsdUJBQU9OLEtBQUtDLEVBQUwsQ0FBUSxPQUFSLENBREs7QUFFWk0sMEJBQVVQLEtBQUtDLEVBQUwsQ0FBUSxVQUFSO0FBRkUsYUFBaEI7QUFJSDs7OztFQXJCd0NPLHNCOztrQkF1QjlCViw4QiIsImZpbGUiOiJFbXBsb3llZUNoYW5nZVBhc3NXb3JkVmFsaWRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVZhbGlkYXRlIGZyb20gJy4vQmFzZVZhbGlkYXRlJztcbmNsYXNzIEVtcGxveWVlQ2hhbmdlUGFzc1dvcmRWYWxpZGF0ZSBleHRlbmRzIEJhc2VWYWxpZGF0ZXtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBzZXRSdWxlKCl7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdlbWFpbCcsICd0cmltJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdlbWFpbCcsICdyZXF1aXJlZCcsIGZhbHNlLCBpMThuLl9fKCdyZXF1aXJlZCcpKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2VtYWlsJywgJ3R5cGUnLCAnZW1haWwnLCBpMThuLl9fKCd0eXBlX2VtYWlsJykpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnZW1haWwnLCAnbWF4TGVuZ3RoJywgMTAwLCBpMThuLl9fKCdtYXhMZW5ndGhfaW5wdXQnKSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnYuYWRkUnVsZSgncGFzc3dvcmQnLCAndHJpbScsIHRydWUpO1xuICAgICAgICB0aGlzLnYuYWRkUnVsZSgncGFzc3dvcmQnLCAncmVxdWlyZWQnLCB0cnVlKTtcbiAgICAgICAgdGhpcy52LnNldE1zZygncGFzc3dvcmQnLCAncmVxdWlyZWQnLCBpMThuLl9fKCdyZXF1aXJlZCcpKTtcbiAgICAgICAgdGhpcy52LmFkZFJ1bGUoJ3Bhc3N3b3JkJywgJ21pbkxlbmd0aCcsIDgpO1xuICAgICAgICB0aGlzLnYuc2V0TXNnKCdwYXNzd29yZCcsICdtaW5MZW5ndGgnLCBpMThuLl9fKCdtaW5MZW5ndGhfaW5wdXQnKSk7XG4gICAgfVxuICAgIHNldEFsaWFzKCl7XG4gICAgICAgIHRoaXMudi5zZXRBbGlhcyh7XG4gICAgICAgICAgICBlbWFpbDogaTE4bi5fXygnZW1haWwnKSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBpMThuLl9fKCdwYXNzd29yZCcpXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEVtcGxveWVlQ2hhbmdlUGFzc1dvcmRWYWxpZGF0ZTsiXX0=