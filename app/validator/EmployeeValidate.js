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

var EmployeeValidate = function (_BaseValidate) {
    _inherits(EmployeeValidate, _BaseValidate);

    function EmployeeValidate(entity) {
        _classCallCheck(this, EmployeeValidate);

        var _this = _possibleConstructorReturn(this, (EmployeeValidate.__proto__ || Object.getPrototypeOf(EmployeeValidate)).call(this));

        _this.entity = entity;
        return _this;
    }

    _createClass(EmployeeValidate, [{
        key: 'setRule',
        value: function setRule() {
            this.addRuleForField('first_name', 'trim', true);
            this.addRuleForField('first_name', 'required', true, i18n.__('required'));
            this.addRuleForField('first_name', 'maxLength', 100, i18n.__('maxLength_input'));

            this.addRuleForField('last_name', 'trim', true);
            this.addRuleForField('last_name', 'required', true, i18n.__('required'));
            this.addRuleForField('last_name', 'maxLength', 100, i18n.__('maxLength_input'));

            this.addRuleForField('phone', 'trim', true);
            this.addRuleForField('phone', 'required', true, i18n.__('required'));
            this.addRuleForField('phone', 'maxLength', 40, i18n.__('maxLength_input'));

            this.addRuleForField('email', 'trim', true);
            this.addRuleForField('email', 'required', false, i18n.__('required'));
            this.addRuleForField('email', 'type', 'email', i18n.__('type_email'));
            this.addRuleForField('email', 'maxLength', 50, i18n.__('maxLength_input'));
            if (this.entity.screen_mode === 1 || this.entity.screen_mode === 2 && this.entity.password !== null) {
                this.v.addRule('password', 'trim', true);
                this.v.addRule('password', 'required', true);
                this.v.setMsg('password', 'required', i18n.__('required'));
                this.v.addRule('password', 'minLength', 8);
                this.v.setMsg('password', 'minLength', i18n.__('minLength_input'));
            }
        }
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({
                first_name: i18n.__('employee.first_name'),
                last_name: i18n.__('employee.last_name'),
                email: i18n.__('employee.email'),
                phone: i18n.__('employee.phone'),
                password: i18n.__('employee.password')
            });
        }
    }]);

    return EmployeeValidate;
}(_BaseValidate3.default);

exports.default = EmployeeValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvRW1wbG95ZWVWYWxpZGF0ZS5qcyJdLCJuYW1lcyI6WyJFbXBsb3llZVZhbGlkYXRlIiwiZW50aXR5IiwiYWRkUnVsZUZvckZpZWxkIiwiaTE4biIsIl9fIiwic2NyZWVuX21vZGUiLCJwYXNzd29yZCIsInYiLCJhZGRSdWxlIiwic2V0TXNnIiwic2V0QWxpYXMiLCJmaXJzdF9uYW1lIiwibGFzdF9uYW1lIiwiZW1haWwiLCJwaG9uZSIsIkJhc2VWYWxpZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBQ01BLGdCOzs7QUFDRiw4QkFBWUMsTUFBWixFQUFtQjtBQUFBOztBQUFBOztBQUVmLGNBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUZlO0FBR2xCOzs7O2tDQUNRO0FBQ0wsaUJBQUtDLGVBQUwsQ0FBcUIsWUFBckIsRUFBbUMsTUFBbkMsRUFBMkMsSUFBM0M7QUFDQSxpQkFBS0EsZUFBTCxDQUFxQixZQUFyQixFQUFtQyxVQUFuQyxFQUErQyxJQUEvQyxFQUFxREMsS0FBS0MsRUFBTCxDQUFRLFVBQVIsQ0FBckQ7QUFDQSxpQkFBS0YsZUFBTCxDQUFxQixZQUFyQixFQUFtQyxXQUFuQyxFQUFnRCxHQUFoRCxFQUFxREMsS0FBS0MsRUFBTCxDQUFRLGlCQUFSLENBQXJEOztBQUVBLGlCQUFLRixlQUFMLENBQXFCLFdBQXJCLEVBQWtDLE1BQWxDLEVBQTBDLElBQTFDO0FBQ0EsaUJBQUtBLGVBQUwsQ0FBcUIsV0FBckIsRUFBa0MsVUFBbEMsRUFBOEMsSUFBOUMsRUFBb0RDLEtBQUtDLEVBQUwsQ0FBUSxVQUFSLENBQXBEO0FBQ0EsaUJBQUtGLGVBQUwsQ0FBcUIsV0FBckIsRUFBa0MsV0FBbEMsRUFBK0MsR0FBL0MsRUFBb0RDLEtBQUtDLEVBQUwsQ0FBUSxpQkFBUixDQUFwRDs7QUFFQSxpQkFBS0YsZUFBTCxDQUFxQixPQUFyQixFQUE4QixNQUE5QixFQUFzQyxJQUF0QztBQUNBLGlCQUFLQSxlQUFMLENBQXFCLE9BQXJCLEVBQThCLFVBQTlCLEVBQTBDLElBQTFDLEVBQWdEQyxLQUFLQyxFQUFMLENBQVEsVUFBUixDQUFoRDtBQUNBLGlCQUFLRixlQUFMLENBQXFCLE9BQXJCLEVBQThCLFdBQTlCLEVBQTJDLEVBQTNDLEVBQStDQyxLQUFLQyxFQUFMLENBQVEsaUJBQVIsQ0FBL0M7O0FBRUEsaUJBQUtGLGVBQUwsQ0FBcUIsT0FBckIsRUFBOEIsTUFBOUIsRUFBc0MsSUFBdEM7QUFDQSxpQkFBS0EsZUFBTCxDQUFxQixPQUFyQixFQUE4QixVQUE5QixFQUEwQyxLQUExQyxFQUFpREMsS0FBS0MsRUFBTCxDQUFRLFVBQVIsQ0FBakQ7QUFDQSxpQkFBS0YsZUFBTCxDQUFxQixPQUFyQixFQUE4QixNQUE5QixFQUFzQyxPQUF0QyxFQUErQ0MsS0FBS0MsRUFBTCxDQUFRLFlBQVIsQ0FBL0M7QUFDQSxpQkFBS0YsZUFBTCxDQUFxQixPQUFyQixFQUE4QixXQUE5QixFQUEyQyxFQUEzQyxFQUErQ0MsS0FBS0MsRUFBTCxDQUFRLGlCQUFSLENBQS9DO0FBQ0EsZ0JBQUcsS0FBS0gsTUFBTCxDQUFZSSxXQUFaLEtBQTRCLENBQTVCLElBQWtDLEtBQUtKLE1BQUwsQ0FBWUksV0FBWixLQUE0QixDQUE1QixJQUFpQyxLQUFLSixNQUFMLENBQVlLLFFBQVosS0FBeUIsSUFBL0YsRUFBcUc7QUFDakcscUJBQUtDLENBQUwsQ0FBT0MsT0FBUCxDQUFlLFVBQWYsRUFBMkIsTUFBM0IsRUFBbUMsSUFBbkM7QUFDQSxxQkFBS0QsQ0FBTCxDQUFPQyxPQUFQLENBQWUsVUFBZixFQUEyQixVQUEzQixFQUF1QyxJQUF2QztBQUNBLHFCQUFLRCxDQUFMLENBQU9FLE1BQVAsQ0FBYyxVQUFkLEVBQTBCLFVBQTFCLEVBQXNDTixLQUFLQyxFQUFMLENBQVEsVUFBUixDQUF0QztBQUNBLHFCQUFLRyxDQUFMLENBQU9DLE9BQVAsQ0FBZSxVQUFmLEVBQTJCLFdBQTNCLEVBQXdDLENBQXhDO0FBQ0EscUJBQUtELENBQUwsQ0FBT0UsTUFBUCxDQUFjLFVBQWQsRUFBMEIsV0FBMUIsRUFBdUNOLEtBQUtDLEVBQUwsQ0FBUSxpQkFBUixDQUF2QztBQUNIO0FBRUo7OzttQ0FDUztBQUNOLGlCQUFLRyxDQUFMLENBQU9HLFFBQVAsQ0FBZ0I7QUFDWkMsNEJBQVlSLEtBQUtDLEVBQUwsQ0FBUSxxQkFBUixDQURBO0FBRVpRLDJCQUFXVCxLQUFLQyxFQUFMLENBQVEsb0JBQVIsQ0FGQztBQUdaUyx1QkFBT1YsS0FBS0MsRUFBTCxDQUFRLGdCQUFSLENBSEs7QUFJWlUsdUJBQU9YLEtBQUtDLEVBQUwsQ0FBUSxnQkFBUixDQUpLO0FBS1pFLDBCQUFVSCxLQUFLQyxFQUFMLENBQVEsbUJBQVI7QUFMRSxhQUFoQjtBQU9IOzs7O0VBdkMwQlcsc0I7O2tCQXlDaEJmLGdCIiwiZmlsZSI6IkVtcGxveWVlVmFsaWRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVZhbGlkYXRlIGZyb20gJy4vQmFzZVZhbGlkYXRlJztcbmNsYXNzIEVtcGxveWVlVmFsaWRhdGUgZXh0ZW5kcyBCYXNlVmFsaWRhdGV7XG4gICAgY29uc3RydWN0b3IoZW50aXR5KXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgfVxuICAgIHNldFJ1bGUoKXtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2ZpcnN0X25hbWUnLCAndHJpbScsIHRydWUpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnZmlyc3RfbmFtZScsICdyZXF1aXJlZCcsIHRydWUsIGkxOG4uX18oJ3JlcXVpcmVkJykpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnZmlyc3RfbmFtZScsICdtYXhMZW5ndGgnLCAxMDAsIGkxOG4uX18oJ21heExlbmd0aF9pbnB1dCcpKTtcblxuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnbGFzdF9uYW1lJywgJ3RyaW0nLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2xhc3RfbmFtZScsICdyZXF1aXJlZCcsIHRydWUsIGkxOG4uX18oJ3JlcXVpcmVkJykpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnbGFzdF9uYW1lJywgJ21heExlbmd0aCcsIDEwMCwgaTE4bi5fXygnbWF4TGVuZ3RoX2lucHV0JykpO1xuXG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdwaG9uZScsICd0cmltJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdwaG9uZScsICdyZXF1aXJlZCcsIHRydWUsIGkxOG4uX18oJ3JlcXVpcmVkJykpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgncGhvbmUnLCAnbWF4TGVuZ3RoJywgNDAsIGkxOG4uX18oJ21heExlbmd0aF9pbnB1dCcpKTtcblxuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnZW1haWwnLCAndHJpbScsIHRydWUpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnZW1haWwnLCAncmVxdWlyZWQnLCBmYWxzZSwgaTE4bi5fXygncmVxdWlyZWQnKSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdlbWFpbCcsICd0eXBlJywgJ2VtYWlsJywgaTE4bi5fXygndHlwZV9lbWFpbCcpKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2VtYWlsJywgJ21heExlbmd0aCcsIDUwLCBpMThuLl9fKCdtYXhMZW5ndGhfaW5wdXQnKSk7XG4gICAgICAgIGlmKHRoaXMuZW50aXR5LnNjcmVlbl9tb2RlID09PSAxIHx8ICh0aGlzLmVudGl0eS5zY3JlZW5fbW9kZSA9PT0gMiAmJiB0aGlzLmVudGl0eS5wYXNzd29yZCAhPT0gbnVsbCkpe1xuICAgICAgICAgICAgdGhpcy52LmFkZFJ1bGUoJ3Bhc3N3b3JkJywgJ3RyaW0nLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMudi5hZGRSdWxlKCdwYXNzd29yZCcsICdyZXF1aXJlZCcsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy52LnNldE1zZygncGFzc3dvcmQnLCAncmVxdWlyZWQnLCBpMThuLl9fKCdyZXF1aXJlZCcpKTtcbiAgICAgICAgICAgIHRoaXMudi5hZGRSdWxlKCdwYXNzd29yZCcsICdtaW5MZW5ndGgnLCA4KTtcbiAgICAgICAgICAgIHRoaXMudi5zZXRNc2coJ3Bhc3N3b3JkJywgJ21pbkxlbmd0aCcsIGkxOG4uX18oJ21pbkxlbmd0aF9pbnB1dCcpKTtcbiAgICAgICAgfVxuICAgIFxuICAgIH1cbiAgICBzZXRBbGlhcygpe1xuICAgICAgICB0aGlzLnYuc2V0QWxpYXMoe1xuICAgICAgICAgICAgZmlyc3RfbmFtZTogaTE4bi5fXygnZW1wbG95ZWUuZmlyc3RfbmFtZScpLFxuICAgICAgICAgICAgbGFzdF9uYW1lOiBpMThuLl9fKCdlbXBsb3llZS5sYXN0X25hbWUnKSxcbiAgICAgICAgICAgIGVtYWlsOiBpMThuLl9fKCdlbXBsb3llZS5lbWFpbCcpLFxuICAgICAgICAgICAgcGhvbmU6IGkxOG4uX18oJ2VtcGxveWVlLnBob25lJyksXG4gICAgICAgICAgICBwYXNzd29yZDogaTE4bi5fXygnZW1wbG95ZWUucGFzc3dvcmQnKVxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBFbXBsb3llZVZhbGlkYXRlOyJdfQ==