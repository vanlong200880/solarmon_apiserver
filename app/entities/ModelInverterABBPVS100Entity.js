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

var ModelInverterABBPVS100Entity = function (_BaseEntity) {
	_inherits(ModelInverterABBPVS100Entity, _BaseEntity);

	function ModelInverterABBPVS100Entity() {
		_classCallCheck(this, ModelInverterABBPVS100Entity);

		var _this = _possibleConstructorReturn(this, (ModelInverterABBPVS100Entity.__proto__ || Object.getPrototypeOf(ModelInverterABBPVS100Entity)).call(this));

		_this.time = null;
		_this.id_device = null;
		_this.acCurrent = null;
		_this.currentPhaseA = null;
		_this.currentPhaseB = null;
		_this.currentPhaseC = null;
		_this.voltagePhaseA = null;
		_this.voltagePhaseB = null;
		_this.voltagePhaseC = null;
		_this.activePower = null;
		_this.powerFrequency = null;
		_this.apparentPower = null;
		_this.reactivePower = null;
		_this.powerFactor = null;
		_this.activeEnergy = null;
		_this.dcCurrent = null;
		_this.dcVoltage = null;
		_this.dcPower = null;
		_this.internalTemperature = null;
		_this.heatSinkTemperature = null;
		_this.mppt1Current = null;
		_this.mppt1Voltage = null;
		_this.mppt1Power = null;
		_this.mppt2Current = null;
		_this.mppt2Voltage = null;
		_this.mppt2Power = null;
		_this.mppt3Current = null;
		_this.mppt3Voltage = null;
		_this.mppt3Power = null;
		_this.mppt4Current = null;
		_this.mppt4Voltage = null;
		_this.mppt4Power = null;
		_this.mppt5Current = null;
		_this.mppt5Voltage = null;
		_this.mppt5Power = null;
		_this.mppt6Current = null;
		_this.mppt6Voltage = null;
		_this.mppt6Power = null;
		return _this;
	}

	return ModelInverterABBPVS100Entity;
}(_BaseEntity3.default);

exports.default = ModelInverterABBPVS100Entity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdGllcy9Nb2RlbEludmVydGVyQUJCUFZTMTAwRW50aXR5LmpzIl0sIm5hbWVzIjpbIk1vZGVsSW52ZXJ0ZXJBQkJQVlMxMDBFbnRpdHkiLCJ0aW1lIiwiaWRfZGV2aWNlIiwiYWNDdXJyZW50IiwiY3VycmVudFBoYXNlQSIsImN1cnJlbnRQaGFzZUIiLCJjdXJyZW50UGhhc2VDIiwidm9sdGFnZVBoYXNlQSIsInZvbHRhZ2VQaGFzZUIiLCJ2b2x0YWdlUGhhc2VDIiwiYWN0aXZlUG93ZXIiLCJwb3dlckZyZXF1ZW5jeSIsImFwcGFyZW50UG93ZXIiLCJyZWFjdGl2ZVBvd2VyIiwicG93ZXJGYWN0b3IiLCJhY3RpdmVFbmVyZ3kiLCJkY0N1cnJlbnQiLCJkY1ZvbHRhZ2UiLCJkY1Bvd2VyIiwiaW50ZXJuYWxUZW1wZXJhdHVyZSIsImhlYXRTaW5rVGVtcGVyYXR1cmUiLCJtcHB0MUN1cnJlbnQiLCJtcHB0MVZvbHRhZ2UiLCJtcHB0MVBvd2VyIiwibXBwdDJDdXJyZW50IiwibXBwdDJWb2x0YWdlIiwibXBwdDJQb3dlciIsIm1wcHQzQ3VycmVudCIsIm1wcHQzVm9sdGFnZSIsIm1wcHQzUG93ZXIiLCJtcHB0NEN1cnJlbnQiLCJtcHB0NFZvbHRhZ2UiLCJtcHB0NFBvd2VyIiwibXBwdDVDdXJyZW50IiwibXBwdDVWb2x0YWdlIiwibXBwdDVQb3dlciIsIm1wcHQ2Q3VycmVudCIsIm1wcHQ2Vm9sdGFnZSIsIm1wcHQ2UG93ZXIiLCJCYXNlRW50aXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBRU1BLDRCOzs7QUFDTCx5Q0FBYztBQUFBOztBQUFBOztBQUViLFFBQUtDLElBQUwsR0FBWSxJQUFaO0FBQ0EsUUFBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBLFFBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxRQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsUUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFFBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxRQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsUUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFFBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxRQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsUUFBS0MsY0FBTCxHQUFzQixJQUF0QjtBQUNBLFFBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxRQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsUUFBS0MsV0FBTCxHQUFtQixJQUFuQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsUUFBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBLFFBQUtDLE9BQUwsR0FBZSxJQUFmO0FBQ0EsUUFBS0MsbUJBQUwsR0FBMkIsSUFBM0I7QUFDQSxRQUFLQyxtQkFBTCxHQUEyQixJQUEzQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsUUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQXZDYTtBQXdDYjs7O0VBekN5Q0Msb0I7O2tCQTJDNUJ2Qyw0QiIsImZpbGUiOiJNb2RlbEludmVydGVyQUJCUFZTMTAwRW50aXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VFbnRpdHkgZnJvbSAnLi9CYXNlRW50aXR5JztcblxuY2xhc3MgTW9kZWxJbnZlcnRlckFCQlBWUzEwMEVudGl0eSBleHRlbmRzIEJhc2VFbnRpdHkge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMudGltZSA9IG51bGw7XG5cdFx0dGhpcy5pZF9kZXZpY2UgPSBudWxsO1xuXHRcdHRoaXMuYWNDdXJyZW50ID0gbnVsbDtcblx0XHR0aGlzLmN1cnJlbnRQaGFzZUEgPSBudWxsO1xuXHRcdHRoaXMuY3VycmVudFBoYXNlQiA9IG51bGw7XG5cdFx0dGhpcy5jdXJyZW50UGhhc2VDID0gbnVsbDtcblx0XHR0aGlzLnZvbHRhZ2VQaGFzZUEgPSBudWxsO1xuXHRcdHRoaXMudm9sdGFnZVBoYXNlQiA9IG51bGw7XG5cdFx0dGhpcy52b2x0YWdlUGhhc2VDID0gbnVsbDtcblx0XHR0aGlzLmFjdGl2ZVBvd2VyID0gbnVsbDtcblx0XHR0aGlzLnBvd2VyRnJlcXVlbmN5ID0gbnVsbDtcblx0XHR0aGlzLmFwcGFyZW50UG93ZXIgPSBudWxsO1xuXHRcdHRoaXMucmVhY3RpdmVQb3dlciA9IG51bGw7XG5cdFx0dGhpcy5wb3dlckZhY3RvciA9IG51bGw7XG5cdFx0dGhpcy5hY3RpdmVFbmVyZ3kgPSBudWxsO1xuXHRcdHRoaXMuZGNDdXJyZW50ID0gbnVsbDtcblx0XHR0aGlzLmRjVm9sdGFnZSA9IG51bGw7XG5cdFx0dGhpcy5kY1Bvd2VyID0gbnVsbDtcblx0XHR0aGlzLmludGVybmFsVGVtcGVyYXR1cmUgPSBudWxsO1xuXHRcdHRoaXMuaGVhdFNpbmtUZW1wZXJhdHVyZSA9IG51bGw7XG5cdFx0dGhpcy5tcHB0MUN1cnJlbnQgPSBudWxsO1xuXHRcdHRoaXMubXBwdDFWb2x0YWdlID0gbnVsbDtcblx0XHR0aGlzLm1wcHQxUG93ZXIgPSBudWxsO1xuXHRcdHRoaXMubXBwdDJDdXJyZW50ID0gbnVsbDtcblx0XHR0aGlzLm1wcHQyVm9sdGFnZSA9IG51bGw7XG5cdFx0dGhpcy5tcHB0MlBvd2VyID0gbnVsbDtcblx0XHR0aGlzLm1wcHQzQ3VycmVudCA9IG51bGw7XG5cdFx0dGhpcy5tcHB0M1ZvbHRhZ2UgPSBudWxsO1xuXHRcdHRoaXMubXBwdDNQb3dlciA9IG51bGw7XG5cdFx0dGhpcy5tcHB0NEN1cnJlbnQgPSBudWxsO1xuXHRcdHRoaXMubXBwdDRWb2x0YWdlID0gbnVsbDtcblx0XHR0aGlzLm1wcHQ0UG93ZXIgPSBudWxsO1xuXHRcdHRoaXMubXBwdDVDdXJyZW50ID0gbnVsbDtcblx0XHR0aGlzLm1wcHQ1Vm9sdGFnZSA9IG51bGw7XG5cdFx0dGhpcy5tcHB0NVBvd2VyID0gbnVsbDtcblx0XHR0aGlzLm1wcHQ2Q3VycmVudCA9IG51bGw7XG5cdFx0dGhpcy5tcHB0NlZvbHRhZ2UgPSBudWxsO1xuXHRcdHRoaXMubXBwdDZQb3dlciA9IG51bGw7XG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IE1vZGVsSW52ZXJ0ZXJBQkJQVlMxMDBFbnRpdHk7Il19