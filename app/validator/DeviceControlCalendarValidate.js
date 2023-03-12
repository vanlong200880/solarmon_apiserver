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

var DeviceControlCalendarValidate = function (_BaseValidate) {
    _inherits(DeviceControlCalendarValidate, _BaseValidate);

    function DeviceControlCalendarValidate() {
        _classCallCheck(this, DeviceControlCalendarValidate);

        return _possibleConstructorReturn(this, (DeviceControlCalendarValidate.__proto__ || Object.getPrototypeOf(DeviceControlCalendarValidate)).call(this));
    }

    _createClass(DeviceControlCalendarValidate, [{
        key: 'setRule',
        value: function setRule() {
            this.v.addRule('date_from', 'trim', true);
            this.v.addRule('date_from', 'required', true);
            this.v.setMsg('date_from', 'required', i18n.__('required'));
            this.addRuleForField('date_from', 'maxLength', 20, i18n.__('maxLength_input'));

            this.v.addRule('date_to', 'trim', true);
            this.v.addRule('date_to', 'required', true);
            this.v.setMsg('date_to', 'required', i18n.__('required'));
            this.addRuleForField('date_to', 'maxLength', 20, i18n.__('maxLength_input'));
        }
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({
                date_from: i18n.__('date_from'),
                date_to: i18n.__('date_to')
            });
        }
    }]);

    return DeviceControlCalendarValidate;
}(_BaseValidate3.default);

exports.default = DeviceControlCalendarValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvRGV2aWNlQ29udHJvbENhbGVuZGFyVmFsaWRhdGUuanMiXSwibmFtZXMiOlsiRGV2aWNlQ29udHJvbENhbGVuZGFyVmFsaWRhdGUiLCJ2IiwiYWRkUnVsZSIsInNldE1zZyIsImkxOG4iLCJfXyIsImFkZFJ1bGVGb3JGaWVsZCIsInNldEFsaWFzIiwiZGF0ZV9mcm9tIiwiZGF0ZV90byIsIkJhc2VWYWxpZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBQ01BLDZCOzs7QUFDRiw2Q0FBYTtBQUFBOztBQUFBO0FBRVo7Ozs7a0NBQ1E7QUFDTCxpQkFBS0MsQ0FBTCxDQUFPQyxPQUFQLENBQWUsV0FBZixFQUE0QixNQUE1QixFQUFvQyxJQUFwQztBQUNBLGlCQUFLRCxDQUFMLENBQU9DLE9BQVAsQ0FBZSxXQUFmLEVBQTRCLFVBQTVCLEVBQXdDLElBQXhDO0FBQ0EsaUJBQUtELENBQUwsQ0FBT0UsTUFBUCxDQUFjLFdBQWQsRUFBMkIsVUFBM0IsRUFBdUNDLEtBQUtDLEVBQUwsQ0FBUSxVQUFSLENBQXZDO0FBQ0EsaUJBQUtDLGVBQUwsQ0FBcUIsV0FBckIsRUFBa0MsV0FBbEMsRUFBK0MsRUFBL0MsRUFBbURGLEtBQUtDLEVBQUwsQ0FBUSxpQkFBUixDQUFuRDs7QUFFQSxpQkFBS0osQ0FBTCxDQUFPQyxPQUFQLENBQWUsU0FBZixFQUEwQixNQUExQixFQUFrQyxJQUFsQztBQUNBLGlCQUFLRCxDQUFMLENBQU9DLE9BQVAsQ0FBZSxTQUFmLEVBQTBCLFVBQTFCLEVBQXNDLElBQXRDO0FBQ0EsaUJBQUtELENBQUwsQ0FBT0UsTUFBUCxDQUFjLFNBQWQsRUFBeUIsVUFBekIsRUFBcUNDLEtBQUtDLEVBQUwsQ0FBUSxVQUFSLENBQXJDO0FBQ0EsaUJBQUtDLGVBQUwsQ0FBcUIsU0FBckIsRUFBZ0MsV0FBaEMsRUFBNkMsRUFBN0MsRUFBaURGLEtBQUtDLEVBQUwsQ0FBUSxpQkFBUixDQUFqRDtBQUNIOzs7bUNBQ1M7QUFDTixpQkFBS0osQ0FBTCxDQUFPTSxRQUFQLENBQWdCO0FBQ1pDLDJCQUFXSixLQUFLQyxFQUFMLENBQVEsV0FBUixDQURDO0FBRVpJLHlCQUFTTCxLQUFLQyxFQUFMLENBQVEsU0FBUjtBQUZHLGFBQWhCO0FBSUg7Ozs7RUFwQnVDSyxzQjs7a0JBc0I3QlYsNkIiLCJmaWxlIjoiRGV2aWNlQ29udHJvbENhbGVuZGFyVmFsaWRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVZhbGlkYXRlIGZyb20gJy4vQmFzZVZhbGlkYXRlJztcbmNsYXNzIERldmljZUNvbnRyb2xDYWxlbmRhclZhbGlkYXRlIGV4dGVuZHMgQmFzZVZhbGlkYXRle1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHNldFJ1bGUoKXtcbiAgICAgICAgdGhpcy52LmFkZFJ1bGUoJ2RhdGVfZnJvbScsICd0cmltJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMudi5hZGRSdWxlKCdkYXRlX2Zyb20nLCAncmVxdWlyZWQnLCB0cnVlKTtcbiAgICAgICAgdGhpcy52LnNldE1zZygnZGF0ZV9mcm9tJywgJ3JlcXVpcmVkJywgaTE4bi5fXygncmVxdWlyZWQnKSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdkYXRlX2Zyb20nLCAnbWF4TGVuZ3RoJywgMjAsIGkxOG4uX18oJ21heExlbmd0aF9pbnB1dCcpKTtcblxuICAgICAgICB0aGlzLnYuYWRkUnVsZSgnZGF0ZV90bycsICd0cmltJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMudi5hZGRSdWxlKCdkYXRlX3RvJywgJ3JlcXVpcmVkJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMudi5zZXRNc2coJ2RhdGVfdG8nLCAncmVxdWlyZWQnLCBpMThuLl9fKCdyZXF1aXJlZCcpKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2RhdGVfdG8nLCAnbWF4TGVuZ3RoJywgMjAsIGkxOG4uX18oJ21heExlbmd0aF9pbnB1dCcpKTtcbiAgICB9XG4gICAgc2V0QWxpYXMoKXtcbiAgICAgICAgdGhpcy52LnNldEFsaWFzKHtcbiAgICAgICAgICAgIGRhdGVfZnJvbTogaTE4bi5fXygnZGF0ZV9mcm9tJyksXG4gICAgICAgICAgICBkYXRlX3RvOiBpMThuLl9fKCdkYXRlX3RvJyksXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IERldmljZUNvbnRyb2xDYWxlbmRhclZhbGlkYXRlOyJdfQ==