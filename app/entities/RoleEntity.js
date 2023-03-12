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

var RoleEntity = function (_BaseEntity) {
	_inherits(RoleEntity, _BaseEntity);

	function RoleEntity() {
		_classCallCheck(this, RoleEntity);

		var _this = _possibleConstructorReturn(this, (RoleEntity.__proto__ || Object.getPrototypeOf(RoleEntity)).call(this));

		_this.id = null;
		_this.id_company = null;
		_this.name = null;
		_this.description = null;
		_this.created_date = null;
		_this.created_by = null;
		_this.status = 1;
		_this.updated_date = null;
		_this.updated_by = null;

		return _this;
	}

	return RoleEntity;
}(_BaseEntity3.default);

exports.default = RoleEntity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9Sb2xlRW50aXR5LmpzIl0sIm5hbWVzIjpbIlJvbGVFbnRpdHkiLCJpZCIsImlkX2NvbXBhbnkiLCJuYW1lIiwiZGVzY3JpcHRpb24iLCJjcmVhdGVkX2RhdGUiLCJjcmVhdGVkX2J5Iiwic3RhdHVzIiwidXBkYXRlZF9kYXRlIiwidXBkYXRlZF9ieSIsIkJhc2VFbnRpdHkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFFTUEsVTs7O0FBQ0wsdUJBQWM7QUFBQTs7QUFBQTs7QUFFYixRQUFLQyxFQUFMLEdBQVUsSUFBVjtBQUNBLFFBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxRQUFLQyxJQUFMLEdBQVksSUFBWjtBQUNBLFFBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLE1BQUwsR0FBYyxDQUFkO0FBQ0EsUUFBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFFBQUtDLFVBQUwsR0FBa0IsSUFBbEI7O0FBVmE7QUFZYjs7O0VBYnVCQyxvQjs7a0JBZVZWLFUiLCJmaWxlIjoiUm9sZUVudGl0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRW50aXR5IGZyb20gJy4vQmFzZUVudGl0eSc7XG5cbmNsYXNzIFJvbGVFbnRpdHkgZXh0ZW5kcyBCYXNlRW50aXR5IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLmlkID0gbnVsbDtcblx0XHR0aGlzLmlkX2NvbXBhbnkgPSBudWxsO1xuXHRcdHRoaXMubmFtZSA9IG51bGw7XG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IG51bGw7XG5cdFx0dGhpcy5jcmVhdGVkX2RhdGUgPSBudWxsO1xuXHRcdHRoaXMuY3JlYXRlZF9ieSA9IG51bGw7XG5cdFx0dGhpcy5zdGF0dXMgPSAxO1xuXHRcdHRoaXMudXBkYXRlZF9kYXRlID0gbnVsbDtcblx0XHR0aGlzLnVwZGF0ZWRfYnkgPSBudWxsO1xuXHRcdFxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBSb2xlRW50aXR5OyJdfQ==