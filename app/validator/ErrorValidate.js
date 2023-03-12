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

var ErrorValidate = function (_BaseValidate) {
    _inherits(ErrorValidate, _BaseValidate);

    function ErrorValidate() {
        _classCallCheck(this, ErrorValidate);

        return _possibleConstructorReturn(this, (ErrorValidate.__proto__ || Object.getPrototypeOf(ErrorValidate)).call(this));
    }

    _createClass(ErrorValidate, [{
        key: 'setRule',
        value: function setRule() {}
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({});
        }
    }]);

    return ErrorValidate;
}(_BaseValidate3.default);

exports.default = ErrorValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvRXJyb3JWYWxpZGF0ZS5qcyJdLCJuYW1lcyI6WyJFcnJvclZhbGlkYXRlIiwidiIsInNldEFsaWFzIiwiQmFzZVZhbGlkYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFDTUEsYTs7O0FBQ0YsNkJBQWM7QUFBQTs7QUFBQTtBQUViOzs7O2tDQUNTLENBQ1Q7OzttQ0FDVTtBQUNQLGlCQUFLQyxDQUFMLENBQU9DLFFBQVAsQ0FBZ0IsRUFBaEI7QUFHSDs7OztFQVZ1QkMsc0I7O2tCQVliSCxhIiwiZmlsZSI6IkVycm9yVmFsaWRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVZhbGlkYXRlIGZyb20gJy4vQmFzZVZhbGlkYXRlJztcbmNsYXNzIEVycm9yVmFsaWRhdGUgZXh0ZW5kcyBCYXNlVmFsaWRhdGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBzZXRSdWxlKCkge1xuICAgIH1cbiAgICBzZXRBbGlhcygpIHtcbiAgICAgICAgdGhpcy52LnNldEFsaWFzKHtcbiAgICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBFcnJvclZhbGlkYXRlOyJdfQ==