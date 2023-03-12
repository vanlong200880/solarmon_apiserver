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

var ProjectGroupValidate = function (_BaseValidate) {
    _inherits(ProjectGroupValidate, _BaseValidate);

    function ProjectGroupValidate() {
        _classCallCheck(this, ProjectGroupValidate);

        return _possibleConstructorReturn(this, (ProjectGroupValidate.__proto__ || Object.getPrototypeOf(ProjectGroupValidate)).call(this));
    }

    _createClass(ProjectGroupValidate, [{
        key: 'setRule',
        value: function setRule() {}
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({});
        }
    }]);

    return ProjectGroupValidate;
}(_BaseValidate3.default);

exports.default = ProjectGroupValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvUHJvamVjdEdyb3VwVmFsaWRhdGUuanMiXSwibmFtZXMiOlsiUHJvamVjdEdyb3VwVmFsaWRhdGUiLCJ2Iiwic2V0QWxpYXMiLCJCYXNlVmFsaWRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUNNQSxvQjs7O0FBQ0Ysb0NBQWE7QUFBQTs7QUFBQTtBQUVaOzs7O2tDQUNRLENBQ1I7OzttQ0FDUztBQUNOLGlCQUFLQyxDQUFMLENBQU9DLFFBQVAsQ0FBZ0IsRUFBaEI7QUFHSDs7OztFQVY4QkMsc0I7O2tCQVlwQkgsb0IiLCJmaWxlIjoiUHJvamVjdEdyb3VwVmFsaWRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBCYXNlVmFsaWRhdGUgZnJvbSAnLi9CYXNlVmFsaWRhdGUnO1xuY2xhc3MgUHJvamVjdEdyb3VwVmFsaWRhdGUgZXh0ZW5kcyBCYXNlVmFsaWRhdGV7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgc2V0UnVsZSgpeyAgXG4gICAgfVxuICAgIHNldEFsaWFzKCl7XG4gICAgICAgIHRoaXMudi5zZXRBbGlhcyh7XG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgUHJvamVjdEdyb3VwVmFsaWRhdGU7Il19