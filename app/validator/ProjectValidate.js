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

var ProjectValidate = function (_BaseValidate) {
    _inherits(ProjectValidate, _BaseValidate);

    function ProjectValidate() {
        _classCallCheck(this, ProjectValidate);

        return _possibleConstructorReturn(this, (ProjectValidate.__proto__ || Object.getPrototypeOf(ProjectValidate)).call(this));
    }

    _createClass(ProjectValidate, [{
        key: 'setRule',
        value: function setRule() {

            this.addRuleForField('id_project_group', 'trim', true);
            this.addRuleForField('id_project_group', 'required', true, i18n.__('required'));
            this.addRuleForField('id_project_group', 'maxLength', 20, i18n.__('maxLength_input'));

            this.addRuleForField('address', 'trim', true);
            this.addRuleForField('address', 'required', true, i18n.__('required'));
            this.addRuleForField('address', 'maxLength', 400, i18n.__('maxLength_input'));

            this.addRuleForField('lat', 'trim', true);
            this.addRuleForField('lat', 'required', true, i18n.__('required'));
            this.addRuleForField('lat', 'maxLength', 20, i18n.__('maxLength_input'));

            this.addRuleForField('lng', 'trim', true);
            this.addRuleForField('lng', 'required', true, i18n.__('required'));
            this.addRuleForField('lng', 'maxLength', 20, i18n.__('maxLength_input'));

            this.addRuleForField('installed_power', 'trim', true);
            this.addRuleForField('installed_power', 'required', true, i18n.__('required'));
            this.addRuleForField('installed_power', 'maxLength', 20, i18n.__('maxLength_input'));

            this.addRuleForField('installed_power_client', 'trim', true);
            this.addRuleForField('installed_power_client', 'required', true, i18n.__('required'));
            this.addRuleForField('installed_power_client', 'maxLength', 20, i18n.__('maxLength_input'));

            this.addRuleForField('commisioning_date', 'trim', true);
            this.addRuleForField('commisioning_date', 'required', true, i18n.__('required'));
            this.addRuleForField('commisioning_date', 'maxLength', 20, i18n.__('maxLength_input'));

            this.addRuleForField('installed_date', 'trim', true);
            this.addRuleForField('installed_date', 'required', true, i18n.__('required'));
            this.addRuleForField('installed_date', 'maxLength', 20, i18n.__('maxLength_input'));
        }
    }, {
        key: 'setAlias',
        value: function setAlias() {
            this.v.setAlias({
                id_project_group: i18n.__('project.id_project_group'),
                address: i18n.__('project.address'),
                lat: i18n.__('project.lat'),
                lng: i18n.__('project.lng'),
                installed_power: i18n.__('project.installed_power'),
                installed_power_client: i18n.__('project.installed_power_client'),
                commisioning_date: i18n.__('project.commisioning_date'),
                installed_date: i18n.__('project.installed_date')
            });
        }
    }]);

    return ProjectValidate;
}(_BaseValidate3.default);

exports.default = ProjectValidate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0b3IvUHJvamVjdFZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbIlByb2plY3RWYWxpZGF0ZSIsImFkZFJ1bGVGb3JGaWVsZCIsImkxOG4iLCJfXyIsInYiLCJzZXRBbGlhcyIsImlkX3Byb2plY3RfZ3JvdXAiLCJhZGRyZXNzIiwibGF0IiwibG5nIiwiaW5zdGFsbGVkX3Bvd2VyIiwiaW5zdGFsbGVkX3Bvd2VyX2NsaWVudCIsImNvbW1pc2lvbmluZ19kYXRlIiwiaW5zdGFsbGVkX2RhdGUiLCJCYXNlVmFsaWRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUNNQSxlOzs7QUFDRiwrQkFBYztBQUFBOztBQUFBO0FBRWI7Ozs7a0NBQ1M7O0FBRU4saUJBQUtDLGVBQUwsQ0FBcUIsa0JBQXJCLEVBQXlDLE1BQXpDLEVBQWlELElBQWpEO0FBQ0EsaUJBQUtBLGVBQUwsQ0FBcUIsa0JBQXJCLEVBQXlDLFVBQXpDLEVBQXFELElBQXJELEVBQTJEQyxLQUFLQyxFQUFMLENBQVEsVUFBUixDQUEzRDtBQUNBLGlCQUFLRixlQUFMLENBQXFCLGtCQUFyQixFQUF5QyxXQUF6QyxFQUFzRCxFQUF0RCxFQUEwREMsS0FBS0MsRUFBTCxDQUFRLGlCQUFSLENBQTFEOztBQUVBLGlCQUFLRixlQUFMLENBQXFCLFNBQXJCLEVBQWdDLE1BQWhDLEVBQXdDLElBQXhDO0FBQ0EsaUJBQUtBLGVBQUwsQ0FBcUIsU0FBckIsRUFBZ0MsVUFBaEMsRUFBNEMsSUFBNUMsRUFBa0RDLEtBQUtDLEVBQUwsQ0FBUSxVQUFSLENBQWxEO0FBQ0EsaUJBQUtGLGVBQUwsQ0FBcUIsU0FBckIsRUFBZ0MsV0FBaEMsRUFBNkMsR0FBN0MsRUFBa0RDLEtBQUtDLEVBQUwsQ0FBUSxpQkFBUixDQUFsRDs7QUFFQSxpQkFBS0YsZUFBTCxDQUFxQixLQUFyQixFQUE0QixNQUE1QixFQUFvQyxJQUFwQztBQUNBLGlCQUFLQSxlQUFMLENBQXFCLEtBQXJCLEVBQTRCLFVBQTVCLEVBQXdDLElBQXhDLEVBQThDQyxLQUFLQyxFQUFMLENBQVEsVUFBUixDQUE5QztBQUNBLGlCQUFLRixlQUFMLENBQXFCLEtBQXJCLEVBQTRCLFdBQTVCLEVBQXlDLEVBQXpDLEVBQTZDQyxLQUFLQyxFQUFMLENBQVEsaUJBQVIsQ0FBN0M7O0FBRUEsaUJBQUtGLGVBQUwsQ0FBcUIsS0FBckIsRUFBNEIsTUFBNUIsRUFBb0MsSUFBcEM7QUFDQSxpQkFBS0EsZUFBTCxDQUFxQixLQUFyQixFQUE0QixVQUE1QixFQUF3QyxJQUF4QyxFQUE4Q0MsS0FBS0MsRUFBTCxDQUFRLFVBQVIsQ0FBOUM7QUFDQSxpQkFBS0YsZUFBTCxDQUFxQixLQUFyQixFQUE0QixXQUE1QixFQUF5QyxFQUF6QyxFQUE2Q0MsS0FBS0MsRUFBTCxDQUFRLGlCQUFSLENBQTdDOztBQUVBLGlCQUFLRixlQUFMLENBQXFCLGlCQUFyQixFQUF3QyxNQUF4QyxFQUFnRCxJQUFoRDtBQUNBLGlCQUFLQSxlQUFMLENBQXFCLGlCQUFyQixFQUF3QyxVQUF4QyxFQUFvRCxJQUFwRCxFQUEwREMsS0FBS0MsRUFBTCxDQUFRLFVBQVIsQ0FBMUQ7QUFDQSxpQkFBS0YsZUFBTCxDQUFxQixpQkFBckIsRUFBd0MsV0FBeEMsRUFBcUQsRUFBckQsRUFBeURDLEtBQUtDLEVBQUwsQ0FBUSxpQkFBUixDQUF6RDs7QUFHQSxpQkFBS0YsZUFBTCxDQUFxQix3QkFBckIsRUFBK0MsTUFBL0MsRUFBdUQsSUFBdkQ7QUFDQSxpQkFBS0EsZUFBTCxDQUFxQix3QkFBckIsRUFBK0MsVUFBL0MsRUFBMkQsSUFBM0QsRUFBaUVDLEtBQUtDLEVBQUwsQ0FBUSxVQUFSLENBQWpFO0FBQ0EsaUJBQUtGLGVBQUwsQ0FBcUIsd0JBQXJCLEVBQStDLFdBQS9DLEVBQTRELEVBQTVELEVBQWdFQyxLQUFLQyxFQUFMLENBQVEsaUJBQVIsQ0FBaEU7O0FBR0EsaUJBQUtGLGVBQUwsQ0FBcUIsbUJBQXJCLEVBQTBDLE1BQTFDLEVBQWtELElBQWxEO0FBQ0EsaUJBQUtBLGVBQUwsQ0FBcUIsbUJBQXJCLEVBQTBDLFVBQTFDLEVBQXNELElBQXRELEVBQTREQyxLQUFLQyxFQUFMLENBQVEsVUFBUixDQUE1RDtBQUNBLGlCQUFLRixlQUFMLENBQXFCLG1CQUFyQixFQUEwQyxXQUExQyxFQUF1RCxFQUF2RCxFQUEyREMsS0FBS0MsRUFBTCxDQUFRLGlCQUFSLENBQTNEOztBQUVBLGlCQUFLRixlQUFMLENBQXFCLGdCQUFyQixFQUF1QyxNQUF2QyxFQUErQyxJQUEvQztBQUNBLGlCQUFLQSxlQUFMLENBQXFCLGdCQUFyQixFQUF1QyxVQUF2QyxFQUFtRCxJQUFuRCxFQUF5REMsS0FBS0MsRUFBTCxDQUFRLFVBQVIsQ0FBekQ7QUFDQSxpQkFBS0YsZUFBTCxDQUFxQixnQkFBckIsRUFBdUMsV0FBdkMsRUFBb0QsRUFBcEQsRUFBd0RDLEtBQUtDLEVBQUwsQ0FBUSxpQkFBUixDQUF4RDtBQUVIOzs7bUNBQ1U7QUFDUCxpQkFBS0MsQ0FBTCxDQUFPQyxRQUFQLENBQWdCO0FBQ1pDLGtDQUFrQkosS0FBS0MsRUFBTCxDQUFRLDBCQUFSLENBRE47QUFFWkkseUJBQVNMLEtBQUtDLEVBQUwsQ0FBUSxpQkFBUixDQUZHO0FBR1pLLHFCQUFLTixLQUFLQyxFQUFMLENBQVEsYUFBUixDQUhPO0FBSVpNLHFCQUFLUCxLQUFLQyxFQUFMLENBQVEsYUFBUixDQUpPO0FBS1pPLGlDQUFpQlIsS0FBS0MsRUFBTCxDQUFRLHlCQUFSLENBTEw7QUFNWlEsd0NBQXdCVCxLQUFLQyxFQUFMLENBQVEsZ0NBQVIsQ0FOWjtBQU9aUyxtQ0FBbUJWLEtBQUtDLEVBQUwsQ0FBUSwyQkFBUixDQVBQO0FBUVpVLGdDQUFnQlgsS0FBS0MsRUFBTCxDQUFRLHdCQUFSO0FBUkosYUFBaEI7QUFVSDs7OztFQXBEeUJXLHNCOztrQkFzRGZkLGUiLCJmaWxlIjoiUHJvamVjdFZhbGlkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VWYWxpZGF0ZSBmcm9tICcuL0Jhc2VWYWxpZGF0ZSc7XG5jbGFzcyBQcm9qZWN0VmFsaWRhdGUgZXh0ZW5kcyBCYXNlVmFsaWRhdGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBzZXRSdWxlKCkge1xuXG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdpZF9wcm9qZWN0X2dyb3VwJywgJ3RyaW0nLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2lkX3Byb2plY3RfZ3JvdXAnLCAncmVxdWlyZWQnLCB0cnVlLCBpMThuLl9fKCdyZXF1aXJlZCcpKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2lkX3Byb2plY3RfZ3JvdXAnLCAnbWF4TGVuZ3RoJywgMjAsIGkxOG4uX18oJ21heExlbmd0aF9pbnB1dCcpKTtcblxuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnYWRkcmVzcycsICd0cmltJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdhZGRyZXNzJywgJ3JlcXVpcmVkJywgdHJ1ZSwgaTE4bi5fXygncmVxdWlyZWQnKSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdhZGRyZXNzJywgJ21heExlbmd0aCcsIDQwMCwgaTE4bi5fXygnbWF4TGVuZ3RoX2lucHV0JykpO1xuXG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdsYXQnLCAndHJpbScsIHRydWUpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnbGF0JywgJ3JlcXVpcmVkJywgdHJ1ZSwgaTE4bi5fXygncmVxdWlyZWQnKSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdsYXQnLCAnbWF4TGVuZ3RoJywgMjAsIGkxOG4uX18oJ21heExlbmd0aF9pbnB1dCcpKTtcblxuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnbG5nJywgJ3RyaW0nLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2xuZycsICdyZXF1aXJlZCcsIHRydWUsIGkxOG4uX18oJ3JlcXVpcmVkJykpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnbG5nJywgJ21heExlbmd0aCcsIDIwLCBpMThuLl9fKCdtYXhMZW5ndGhfaW5wdXQnKSk7XG5cbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2luc3RhbGxlZF9wb3dlcicsICd0cmltJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdpbnN0YWxsZWRfcG93ZXInLCAncmVxdWlyZWQnLCB0cnVlLCBpMThuLl9fKCdyZXF1aXJlZCcpKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2luc3RhbGxlZF9wb3dlcicsICdtYXhMZW5ndGgnLCAyMCwgaTE4bi5fXygnbWF4TGVuZ3RoX2lucHV0JykpO1xuXG4gICAgICAgIFxuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnaW5zdGFsbGVkX3Bvd2VyX2NsaWVudCcsICd0cmltJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdpbnN0YWxsZWRfcG93ZXJfY2xpZW50JywgJ3JlcXVpcmVkJywgdHJ1ZSwgaTE4bi5fXygncmVxdWlyZWQnKSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdpbnN0YWxsZWRfcG93ZXJfY2xpZW50JywgJ21heExlbmd0aCcsIDIwLCBpMThuLl9fKCdtYXhMZW5ndGhfaW5wdXQnKSk7XG5cblxuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnY29tbWlzaW9uaW5nX2RhdGUnLCAndHJpbScsIHRydWUpO1xuICAgICAgICB0aGlzLmFkZFJ1bGVGb3JGaWVsZCgnY29tbWlzaW9uaW5nX2RhdGUnLCAncmVxdWlyZWQnLCB0cnVlLCBpMThuLl9fKCdyZXF1aXJlZCcpKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2NvbW1pc2lvbmluZ19kYXRlJywgJ21heExlbmd0aCcsIDIwLCBpMThuLl9fKCdtYXhMZW5ndGhfaW5wdXQnKSk7XG5cbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2luc3RhbGxlZF9kYXRlJywgJ3RyaW0nLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hZGRSdWxlRm9yRmllbGQoJ2luc3RhbGxlZF9kYXRlJywgJ3JlcXVpcmVkJywgdHJ1ZSwgaTE4bi5fXygncmVxdWlyZWQnKSk7XG4gICAgICAgIHRoaXMuYWRkUnVsZUZvckZpZWxkKCdpbnN0YWxsZWRfZGF0ZScsICdtYXhMZW5ndGgnLCAyMCwgaTE4bi5fXygnbWF4TGVuZ3RoX2lucHV0JykpO1xuXG4gICAgfVxuICAgIHNldEFsaWFzKCkge1xuICAgICAgICB0aGlzLnYuc2V0QWxpYXMoe1xuICAgICAgICAgICAgaWRfcHJvamVjdF9ncm91cDogaTE4bi5fXygncHJvamVjdC5pZF9wcm9qZWN0X2dyb3VwJyksXG4gICAgICAgICAgICBhZGRyZXNzOiBpMThuLl9fKCdwcm9qZWN0LmFkZHJlc3MnKSxcbiAgICAgICAgICAgIGxhdDogaTE4bi5fXygncHJvamVjdC5sYXQnKSxcbiAgICAgICAgICAgIGxuZzogaTE4bi5fXygncHJvamVjdC5sbmcnKSxcbiAgICAgICAgICAgIGluc3RhbGxlZF9wb3dlcjogaTE4bi5fXygncHJvamVjdC5pbnN0YWxsZWRfcG93ZXInKSxcbiAgICAgICAgICAgIGluc3RhbGxlZF9wb3dlcl9jbGllbnQ6IGkxOG4uX18oJ3Byb2plY3QuaW5zdGFsbGVkX3Bvd2VyX2NsaWVudCcpLFxuICAgICAgICAgICAgY29tbWlzaW9uaW5nX2RhdGU6IGkxOG4uX18oJ3Byb2plY3QuY29tbWlzaW9uaW5nX2RhdGUnKSxcbiAgICAgICAgICAgIGluc3RhbGxlZF9kYXRlOiBpMThuLl9fKCdwcm9qZWN0Lmluc3RhbGxlZF9kYXRlJylcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgUHJvamVjdFZhbGlkYXRlOyJdfQ==