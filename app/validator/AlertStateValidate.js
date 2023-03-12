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

var AlertStateValidate = function (_BaseValidate) {
    _inherits(AlertStateValidate, _BaseValidate);

    function AlertStateValidate() {
        _classCallCheck(this, AlertStateValidate);

        return _possibleConstructorReturn(this, (AlertStateValidate.__proto__ || Object.getPrototypeOf(AlertStateValidate)).call(this));
    }

    _createClass(AlertStateValidate, [{
        key: 'setRule',
        value: function setRule() {}
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({});
        }
    }]);

    return AlertStateValidate;
}(_BaseValidate3.default);

exports.default = AlertStateValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvQWxlcnRTdGF0ZVZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbIkFsZXJ0U3RhdGVWYWxpZGF0ZSIsInYiLCJzZXRBbGlhcyIsIkJhc2VWYWxpZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBQ01BLGtCOzs7QUFDRixrQ0FBYztBQUFBOztBQUFBO0FBRWI7Ozs7a0NBQ1MsQ0FDVDs7O21DQUNVO0FBQ1AsaUJBQUtDLENBQUwsQ0FBT0MsUUFBUCxDQUFnQixFQUFoQjtBQUdIOzs7O0VBVjRCQyxzQjs7a0JBWWxCSCxrQiIsImZpbGUiOiJBbGVydFN0YXRlVmFsaWRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVZhbGlkYXRlIGZyb20gJy4vQmFzZVZhbGlkYXRlJztcbmNsYXNzIEFsZXJ0U3RhdGVWYWxpZGF0ZSBleHRlbmRzIEJhc2VWYWxpZGF0ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHNldFJ1bGUoKSB7XG4gICAgfVxuICAgIHNldEFsaWFzKCkge1xuICAgICAgICB0aGlzLnYuc2V0QWxpYXMoe1xuICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEFsZXJ0U3RhdGVWYWxpZGF0ZTsiXX0=