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

var DeviceParameterValidate = function (_BaseValidate) {
    _inherits(DeviceParameterValidate, _BaseValidate);

    function DeviceParameterValidate() {
        _classCallCheck(this, DeviceParameterValidate);

        return _possibleConstructorReturn(this, (DeviceParameterValidate.__proto__ || Object.getPrototypeOf(DeviceParameterValidate)).call(this));
    }

    _createClass(DeviceParameterValidate, [{
        key: 'setRule',
        value: function setRule() {}
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({});
        }
    }]);

    return DeviceParameterValidate;
}(_BaseValidate3.default);

exports.default = DeviceParameterValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvRGV2aWNlUGFyYW1ldGVyVmFsaWRhdGUuanMiXSwibmFtZXMiOlsiRGV2aWNlUGFyYW1ldGVyVmFsaWRhdGUiLCJ2Iiwic2V0QWxpYXMiLCJCYXNlVmFsaWRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSx1Qjs7O0FBQ0YsdUNBQWM7QUFBQTs7QUFBQTtBQUViOzs7O2tDQUNTLENBQ1Q7OzttQ0FDVTtBQUNQLGlCQUFLQyxDQUFMLENBQU9DLFFBQVAsQ0FBZ0IsRUFBaEI7QUFHSDs7OztFQVZpQ0Msc0I7O2tCQVl2QkgsdUIiLCJmaWxlIjoiRGV2aWNlUGFyYW1ldGVyVmFsaWRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVZhbGlkYXRlIGZyb20gJy4vQmFzZVZhbGlkYXRlJztcbmNsYXNzIERldmljZVBhcmFtZXRlclZhbGlkYXRlIGV4dGVuZHMgQmFzZVZhbGlkYXRlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgc2V0UnVsZSgpIHtcbiAgICB9XG4gICAgc2V0QWxpYXMoKSB7XG4gICAgICAgIHRoaXMudi5zZXRBbGlhcyh7XG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgRGV2aWNlUGFyYW1ldGVyVmFsaWRhdGU7Il19