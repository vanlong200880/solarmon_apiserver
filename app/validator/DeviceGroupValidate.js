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

var DeviceGroupValidate = function (_BaseValidate) {
    _inherits(DeviceGroupValidate, _BaseValidate);

    function DeviceGroupValidate() {
        _classCallCheck(this, DeviceGroupValidate);

        return _possibleConstructorReturn(this, (DeviceGroupValidate.__proto__ || Object.getPrototypeOf(DeviceGroupValidate)).call(this));
    }

    _createClass(DeviceGroupValidate, [{
        key: 'setRule',
        value: function setRule() {
            this.addRuleForField('name', 'trim', true);
            this.addRuleForField('name', 'required', true, i18n.__('required'));
            this.addRuleForField('name', 'maxLength', 200, i18n.__('maxLength_input'));

            this.addRuleForField('table_name', 'trim', true);
            this.addRuleForField('table_name', 'required', true, i18n.__('required'));
            this.addRuleForField('table_name', 'maxLength', 200, i18n.__('maxLength_input'));
        }
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({
                name: i18n.__('device_group.name'),
                table_name: i18n.__('device_group.table_name')
            });
        }
    }]);

    return DeviceGroupValidate;
}(_BaseValidate3.default);

exports.default = DeviceGroupValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvRGV2aWNlR3JvdXBWYWxpZGF0ZS5qcyJdLCJuYW1lcyI6WyJEZXZpY2VHcm91cFZhbGlkYXRlIiwiYWRkUnVsZUZvckZpZWxkIiwiaTE4biIsIl9fIiwidiIsInNldEFsaWFzIiwibmFtZSIsInRhYmxlX25hbWUiLCJCYXNlVmFsaWRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUNNQSxtQjs7O0FBQ0YsbUNBQWE7QUFBQTs7QUFBQTtBQUVaOzs7O2tDQUNRO0FBQ0wsaUJBQUtDLGVBQUwsQ0FBcUIsTUFBckIsRUFBNkIsTUFBN0IsRUFBcUMsSUFBckM7QUFDQSxpQkFBS0EsZUFBTCxDQUFxQixNQUFyQixFQUE2QixVQUE3QixFQUF5QyxJQUF6QyxFQUErQ0MsS0FBS0MsRUFBTCxDQUFRLFVBQVIsQ0FBL0M7QUFDQSxpQkFBS0YsZUFBTCxDQUFxQixNQUFyQixFQUE2QixXQUE3QixFQUEwQyxHQUExQyxFQUErQ0MsS0FBS0MsRUFBTCxDQUFRLGlCQUFSLENBQS9DOztBQUVBLGlCQUFLRixlQUFMLENBQXFCLFlBQXJCLEVBQW1DLE1BQW5DLEVBQTJDLElBQTNDO0FBQ0EsaUJBQUtBLGVBQUwsQ0FBcUIsWUFBckIsRUFBbUMsVUFBbkMsRUFBK0MsSUFBL0MsRUFBcURDLEtBQUtDLEVBQUwsQ0FBUSxVQUFSLENBQXJEO0FBQ0EsaUJBQUtGLGVBQUwsQ0FBcUIsWUFBckIsRUFBbUMsV0FBbkMsRUFBZ0QsR0FBaEQsRUFBcURDLEtBQUtDLEVBQUwsQ0FBUSxpQkFBUixDQUFyRDtBQUNIOzs7bUNBQ1M7QUFDTixpQkFBS0MsQ0FBTCxDQUFPQyxRQUFQLENBQWdCO0FBQ1pDLHNCQUFNSixLQUFLQyxFQUFMLENBQVEsbUJBQVIsQ0FETTtBQUVaSSw0QkFBWUwsS0FBS0MsRUFBTCxDQUFRLHlCQUFSO0FBRkEsYUFBaEI7QUFJSDs7OztFQWxCNkJLLHNCOztrQkFvQm5CUixtQiIsImZpbGUiOiJEZXZpY2VHcm91cFZhbGlkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgQmFzZVZhbGlkYXRlIGZyb20gJy4vQmFzZVZhbGlkYXRlJztcbmNsYXNzIERldmljZUdyb3VwVmFsaWRhdGUgZXh0ZW5kcyBCYXNlVmFsaWRhdGV7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgc2V0UnVsZSgpe1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnbmFtZScsICd0cmltJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCduYW1lJywgJ3JlcXVpcmVkJywgdHJ1ZSwgaTE4bi5fXygncmVxdWlyZWQnKSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCduYW1lJywgJ21heExlbmd0aCcsIDIwMCwgaTE4bi5fXygnbWF4TGVuZ3RoX2lucHV0JykpO1xuXG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCd0YWJsZV9uYW1lJywgJ3RyaW0nLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ3RhYmxlX25hbWUnLCAncmVxdWlyZWQnLCB0cnVlLCBpMThuLl9fKCdyZXF1aXJlZCcpKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ3RhYmxlX25hbWUnLCAnbWF4TGVuZ3RoJywgMjAwLCBpMThuLl9fKCdtYXhMZW5ndGhfaW5wdXQnKSk7XG4gICAgfVxuICAgIHNldEFsaWFzKCl7XG4gICAgICAgIHRoaXMudi5zZXRBbGlhcyh7XG4gICAgICAgICAgICBuYW1lOiBpMThuLl9fKCdkZXZpY2VfZ3JvdXAubmFtZScpLFxuICAgICAgICAgICAgdGFibGVfbmFtZTogaTE4bi5fXygnZGV2aWNlX2dyb3VwLnRhYmxlX25hbWUnKVxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBEZXZpY2VHcm91cFZhbGlkYXRlOyJdfQ==