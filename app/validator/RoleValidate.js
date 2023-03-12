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

var RoleValidate = function (_BaseValidate) {
    _inherits(RoleValidate, _BaseValidate);

    function RoleValidate() {
        _classCallCheck(this, RoleValidate);

        return _possibleConstructorReturn(this, (RoleValidate.__proto__ || Object.getPrototypeOf(RoleValidate)).call(this));
    }

    _createClass(RoleValidate, [{
        key: 'setRule',
        value: function setRule() {}
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({});
        }
    }]);

    return RoleValidate;
}(_BaseValidate3.default);

exports.default = RoleValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvUm9sZVZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbIlJvbGVWYWxpZGF0ZSIsInYiLCJzZXRBbGlhcyIsIkJhc2VWYWxpZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBQ01BLFk7OztBQUNGLDRCQUFhO0FBQUE7O0FBQUE7QUFFWjs7OztrQ0FDUSxDQUVSOzs7bUNBQ1M7QUFDTixpQkFBS0MsQ0FBTCxDQUFPQyxRQUFQLENBQWdCLEVBQWhCO0FBRUg7Ozs7RUFWc0JDLHNCOztrQkFZWkgsWSIsImZpbGUiOiJSb2xlVmFsaWRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVZhbGlkYXRlIGZyb20gJy4vQmFzZVZhbGlkYXRlJztcbmNsYXNzIFJvbGVWYWxpZGF0ZSBleHRlbmRzIEJhc2VWYWxpZGF0ZXtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBzZXRSdWxlKCl7XG5cbiAgICB9XG4gICAgc2V0QWxpYXMoKXtcbiAgICAgICAgdGhpcy52LnNldEFsaWFzKHtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgUm9sZVZhbGlkYXRlOyJdfQ==