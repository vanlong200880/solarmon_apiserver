'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _BaseEntity2 = require('./BaseEntity');

var _BaseEntity3 = _interopRequireDefault(_BaseEntity2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProjectGroupEntity = function (_BaseEntity) {
	_inherits(ProjectGroupEntity, _BaseEntity);

	function ProjectGroupEntity() {
		_classCallCheck(this, ProjectGroupEntity);

		var _this = _possibleConstructorReturn(this, (ProjectGroupEntity.__proto__ || Object.getPrototypeOf(ProjectGroupEntity)).call(this));

		_this.id = null;
		_this.name = null;
		_this.description = null;
		_this.created_date = null;
		_this.created_by = null;
		_this.status = 1;
		_this.updated_date = null;
		_this.updated_by = null;
		return _this;
	}

	return ProjectGroupEntity;
}(_BaseEntity3.default);

exports.default = ProjectGroupEntity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9Qcm9qZWN0R3JvdXBFbnRpdHkuanMiXSwibmFtZXMiOlsiUHJvamVjdEdyb3VwRW50aXR5IiwiaWQiLCJuYW1lIiwiZGVzY3JpcHRpb24iLCJjcmVhdGVkX2RhdGUiLCJjcmVhdGVkX2J5Iiwic3RhdHVzIiwidXBkYXRlZF9kYXRlIiwidXBkYXRlZF9ieSIsIkJhc2VFbnRpdHkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFFTUEsa0I7OztBQUNMLCtCQUFjO0FBQUE7O0FBQUE7O0FBRWIsUUFBS0MsRUFBTCxHQUFVLElBQVY7QUFDQSxRQUFLQyxJQUFMLEdBQVksSUFBWjtBQUNBLFFBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLE1BQUwsR0FBYyxDQUFkO0FBQ0EsUUFBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFFBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFUYTtBQVViOzs7RUFYK0JDLG9COztrQkFhbEJULGtCIiwiZmlsZSI6IlByb2plY3RHcm91cEVudGl0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRW50aXR5IGZyb20gJy4vQmFzZUVudGl0eSc7XG5cbmNsYXNzIFByb2plY3RHcm91cEVudGl0eSBleHRlbmRzIEJhc2VFbnRpdHkge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuaWQgPSBudWxsO1xuXHRcdHRoaXMubmFtZSA9IG51bGw7XG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IG51bGw7XG5cdFx0dGhpcy5jcmVhdGVkX2RhdGUgPSBudWxsO1xuXHRcdHRoaXMuY3JlYXRlZF9ieSA9IG51bGw7XG5cdFx0dGhpcy5zdGF0dXMgPSAxO1xuXHRcdHRoaXMudXBkYXRlZF9kYXRlID0gbnVsbDtcblx0XHR0aGlzLnVwZGF0ZWRfYnkgPSBudWxsO1xuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBQcm9qZWN0R3JvdXBFbnRpdHk7Il19