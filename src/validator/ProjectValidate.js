import BaseValidate from './BaseValidate';
class ProjectValidate extends BaseValidate {
    constructor() {
        super();
    }
    setRule() {

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
    setAlias() {
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
}
export default ProjectValidate;