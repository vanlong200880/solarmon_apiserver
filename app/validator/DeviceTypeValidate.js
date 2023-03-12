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

var DeviceTypeValidate = function (_BaseValidate) {
    _inherits(DeviceTypeValidate, _BaseValidate);

    function DeviceTypeValidate() {
        _classCallCheck(this, DeviceTypeValidate);

        return _possibleConstructorReturn(this, (DeviceTypeValidate.__proto__ || Object.getPrototypeOf(DeviceTypeValidate)).call(this));
    }

    _createClass(DeviceTypeValidate, [{
        key: 'setRule',
        value: function setRule() {}
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({});
        }
    }]);

    return DeviceTypeValidate;
}(_BaseValidate3.default);

exports.default = DeviceTypeValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvRGV2aWNlVHlwZVZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbIkRldmljZVR5cGVWYWxpZGF0ZSIsInYiLCJzZXRBbGlhcyIsIkJhc2VWYWxpZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ01BLGtCOzs7QUFDRixrQ0FBYTtBQUFBOztBQUFBO0FBRVo7Ozs7a0NBQ1EsQ0FFUjs7O21DQUNTO0FBQ04saUJBQUtDLENBQUwsQ0FBT0MsUUFBUCxDQUFnQixFQUFoQjtBQUVIOzs7O0VBVjRCQyxzQjs7a0JBWWxCSCxrQiIsImZpbGUiOiJEZXZpY2VUeXBlVmFsaWRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBCYXNlVmFsaWRhdGUgZnJvbSAnLi9CYXNlVmFsaWRhdGUnO1xuY2xhc3MgRGV2aWNlVHlwZVZhbGlkYXRlIGV4dGVuZHMgQmFzZVZhbGlkYXRle1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHNldFJ1bGUoKXtcbiAgICAgICAgXG4gICAgfVxuICAgIHNldEFsaWFzKCl7XG4gICAgICAgIHRoaXMudi5zZXRBbGlhcyh7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IERldmljZVR5cGVWYWxpZGF0ZTsiXX0=