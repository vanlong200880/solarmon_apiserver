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

var ProjectEntity = function (_BaseEntity) {
	_inherits(ProjectEntity, _BaseEntity);

	function ProjectEntity() {
		_classCallCheck(this, ProjectEntity);

		var _this = _possibleConstructorReturn(this, (ProjectEntity.__proto__ || Object.getPrototypeOf(ProjectEntity)).call(this));

		_this.id = null;
		_this.id_project_group = null;
		_this.hash_id = null;
		_this.thumbnail = null;
		_this.address = null;
		_this.lat = null;
		_this.lng = null;
		_this.installed_power = null;
		_this.installed_power_client = null;
		_this.commisioning_date = null;
		_this.installed_date = null;
		_this.last_updated = null;
		_this.status = 1;
		_this.created_date = null;
		_this.created_by = null;
		_this.updated_date = null;
		_this.updated_by = null;
		_this.total_year = 0;
		_this.year = null;
		_this.config_revenue = 0;
		_this.start_date = null;
		_this.end_date = null;
		_this.jan = null;
		_this.feb = null;
		_this.mar = null;
		_this.apr = null;
		_this.may = null;
		_this.jun = null;
		_this.jul = null;
		_this.aug = null;
		_this.sep = null;
		_this.oct = null;
		_this.nov = null;
		_this.dec = null;
		_this.yearly_egrade_default = null;
		_this.yearly_egrade_two = null;
		_this.config_yi = 0;
		_this.config_po = 0;
		_this.total_loss_factor = 1;
		_this.config_yi1 = 0;
		_this.config_po1 = 0;
		_this.total_loss_factor1 = 1;
		_this.menu_order = 1;
		return _this;
	}

	return ProjectEntity;
}(_BaseEntity3.default);

exports.default = ProjectEntity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9Qcm9qZWN0RW50aXR5LmpzIl0sIm5hbWVzIjpbIlByb2plY3RFbnRpdHkiLCJpZCIsImlkX3Byb2plY3RfZ3JvdXAiLCJoYXNoX2lkIiwidGh1bWJuYWlsIiwiYWRkcmVzcyIsImxhdCIsImxuZyIsImluc3RhbGxlZF9wb3dlciIsImluc3RhbGxlZF9wb3dlcl9jbGllbnQiLCJjb21taXNpb25pbmdfZGF0ZSIsImluc3RhbGxlZF9kYXRlIiwibGFzdF91cGRhdGVkIiwic3RhdHVzIiwiY3JlYXRlZF9kYXRlIiwiY3JlYXRlZF9ieSIsInVwZGF0ZWRfZGF0ZSIsInVwZGF0ZWRfYnkiLCJ0b3RhbF95ZWFyIiwieWVhciIsImNvbmZpZ19yZXZlbnVlIiwic3RhcnRfZGF0ZSIsImVuZF9kYXRlIiwiamFuIiwiZmViIiwibWFyIiwiYXByIiwibWF5IiwianVuIiwianVsIiwiYXVnIiwic2VwIiwib2N0Iiwibm92IiwiZGVjIiwieWVhcmx5X2VncmFkZV9kZWZhdWx0IiwieWVhcmx5X2VncmFkZV90d28iLCJjb25maWdfeWkiLCJjb25maWdfcG8iLCJ0b3RhbF9sb3NzX2ZhY3RvciIsImNvbmZpZ195aTEiLCJjb25maWdfcG8xIiwidG90YWxfbG9zc19mYWN0b3IxIiwibWVudV9vcmRlciIsIkJhc2VFbnRpdHkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFFTUEsYTs7O0FBQ0wsMEJBQWM7QUFBQTs7QUFBQTs7QUFFYixRQUFLQyxFQUFMLEdBQVUsSUFBVjtBQUNBLFFBQUtDLGdCQUFMLEdBQXdCLElBQXhCO0FBQ0EsUUFBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxRQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsUUFBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxRQUFLQyxHQUFMLEdBQVcsSUFBWDtBQUNBLFFBQUtDLEdBQUwsR0FBVyxJQUFYO0FBQ0EsUUFBS0MsZUFBTCxHQUF1QixJQUF2QjtBQUNBLFFBQUtDLHNCQUFMLEdBQThCLElBQTlCO0FBQ0EsUUFBS0MsaUJBQUwsR0FBeUIsSUFBekI7QUFDQSxRQUFLQyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsUUFBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFFBQUtDLE1BQUwsR0FBYyxDQUFkO0FBQ0EsUUFBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFFBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLFVBQUwsR0FBa0IsQ0FBbEI7QUFDQSxRQUFLQyxJQUFMLEdBQVksSUFBWjtBQUNBLFFBQUtDLGNBQUwsR0FBc0IsQ0FBdEI7QUFDQSxRQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsUUFBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUNBLFFBQUtDLEdBQUwsR0FBVyxJQUFYO0FBQ0EsUUFBS0MsR0FBTCxHQUFXLElBQVg7QUFDQSxRQUFLQyxHQUFMLEdBQVcsSUFBWDtBQUNBLFFBQUtDLEdBQUwsR0FBVyxJQUFYO0FBQ0EsUUFBS0MsR0FBTCxHQUFXLElBQVg7QUFDQSxRQUFLQyxHQUFMLEdBQVcsSUFBWDtBQUNBLFFBQUtDLEdBQUwsR0FBVyxJQUFYO0FBQ0EsUUFBS0MsR0FBTCxHQUFXLElBQVg7QUFDQSxRQUFLQyxHQUFMLEdBQVcsSUFBWDtBQUNBLFFBQUtDLEdBQUwsR0FBVyxJQUFYO0FBQ0EsUUFBS0MsR0FBTCxHQUFXLElBQVg7QUFDQSxRQUFLQyxHQUFMLEdBQVcsSUFBWDtBQUNBLFFBQUtDLHFCQUFMLEdBQTZCLElBQTdCO0FBQ0EsUUFBS0MsaUJBQUwsR0FBeUIsSUFBekI7QUFDQSxRQUFLQyxTQUFMLEdBQWlCLENBQWpCO0FBQ0EsUUFBS0MsU0FBTCxHQUFpQixDQUFqQjtBQUNBLFFBQUtDLGlCQUFMLEdBQXlCLENBQXpCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixDQUFsQjtBQUNBLFFBQUtDLFVBQUwsR0FBa0IsQ0FBbEI7QUFDQSxRQUFLQyxrQkFBTCxHQUEwQixDQUExQjtBQUNBLFFBQUtDLFVBQUwsR0FBa0IsQ0FBbEI7QUE1Q2E7QUE2Q2I7OztFQTlDMEJDLG9COztrQkFnRGI1QyxhIiwiZmlsZSI6IlByb2plY3RFbnRpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUVudGl0eSBmcm9tICcuL0Jhc2VFbnRpdHknO1xuXG5jbGFzcyBQcm9qZWN0RW50aXR5IGV4dGVuZHMgQmFzZUVudGl0eSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5pZCA9IG51bGw7XG5cdFx0dGhpcy5pZF9wcm9qZWN0X2dyb3VwID0gbnVsbDtcblx0XHR0aGlzLmhhc2hfaWQgPSBudWxsO1xuXHRcdHRoaXMudGh1bWJuYWlsID0gbnVsbDtcblx0XHR0aGlzLmFkZHJlc3MgPSBudWxsO1xuXHRcdHRoaXMubGF0ID0gbnVsbDtcblx0XHR0aGlzLmxuZyA9IG51bGw7XG5cdFx0dGhpcy5pbnN0YWxsZWRfcG93ZXIgPSBudWxsO1xuXHRcdHRoaXMuaW5zdGFsbGVkX3Bvd2VyX2NsaWVudCA9IG51bGw7XG5cdFx0dGhpcy5jb21taXNpb25pbmdfZGF0ZSA9IG51bGw7XG5cdFx0dGhpcy5pbnN0YWxsZWRfZGF0ZSA9IG51bGw7XG5cdFx0dGhpcy5sYXN0X3VwZGF0ZWQgPSBudWxsO1xuXHRcdHRoaXMuc3RhdHVzID0gMTtcblx0XHR0aGlzLmNyZWF0ZWRfZGF0ZSA9IG51bGw7XG5cdFx0dGhpcy5jcmVhdGVkX2J5ID0gbnVsbDtcblx0XHR0aGlzLnVwZGF0ZWRfZGF0ZSA9IG51bGw7XG5cdFx0dGhpcy51cGRhdGVkX2J5ID0gbnVsbDtcblx0XHR0aGlzLnRvdGFsX3llYXIgPSAwO1xuXHRcdHRoaXMueWVhciA9IG51bGw7XG5cdFx0dGhpcy5jb25maWdfcmV2ZW51ZSA9IDA7XG5cdFx0dGhpcy5zdGFydF9kYXRlID0gbnVsbDtcblx0XHR0aGlzLmVuZF9kYXRlID0gbnVsbDtcblx0XHR0aGlzLmphbiA9IG51bGw7XG5cdFx0dGhpcy5mZWIgPSBudWxsO1xuXHRcdHRoaXMubWFyID0gbnVsbDtcblx0XHR0aGlzLmFwciA9IG51bGw7XG5cdFx0dGhpcy5tYXkgPSBudWxsO1xuXHRcdHRoaXMuanVuID0gbnVsbDtcblx0XHR0aGlzLmp1bCA9IG51bGw7XG5cdFx0dGhpcy5hdWcgPSBudWxsO1xuXHRcdHRoaXMuc2VwID0gbnVsbDtcblx0XHR0aGlzLm9jdCA9IG51bGw7XG5cdFx0dGhpcy5ub3YgPSBudWxsO1xuXHRcdHRoaXMuZGVjID0gbnVsbDtcblx0XHR0aGlzLnllYXJseV9lZ3JhZGVfZGVmYXVsdCA9IG51bGw7XG5cdFx0dGhpcy55ZWFybHlfZWdyYWRlX3R3byA9IG51bGw7XG5cdFx0dGhpcy5jb25maWdfeWkgPSAwO1xuXHRcdHRoaXMuY29uZmlnX3BvID0gMDtcblx0XHR0aGlzLnRvdGFsX2xvc3NfZmFjdG9yID0gMTtcblx0XHR0aGlzLmNvbmZpZ195aTEgPSAwO1xuXHRcdHRoaXMuY29uZmlnX3BvMSA9IDA7XG5cdFx0dGhpcy50b3RhbF9sb3NzX2ZhY3RvcjEgPSAxO1xuXHRcdHRoaXMubWVudV9vcmRlciA9IDE7XG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IFByb2plY3RFbnRpdHk7Il19