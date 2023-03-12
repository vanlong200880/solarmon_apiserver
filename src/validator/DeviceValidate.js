import BaseValidate from './BaseValidate';
class DeviceValidate extends BaseValidate{
    constructor(){
        super();
    }
    setRule(){
        
        this.addRuleForField('id_project', 'trim', true);
        this.addRuleForField('id_project', 'required', true, i18n.__('required'));
        this.addRuleForField('id_project', 'maxLength', 20, i18n.__('maxLength_input'));

        this.addRuleForField('id_device_type', 'trim', true);
        this.addRuleForField('id_device_type', 'required', true, i18n.__('required'));
        this.addRuleForField('id_device_type', 'maxLength', 20, i18n.__('maxLength_input'));

        this.addRuleForField('id_device_group', 'trim', true);
        this.addRuleForField('id_device_group', 'required', true, i18n.__('required'));
        this.addRuleForField('id_device_group', 'maxLength', 20, i18n.__('maxLength_input'));

        this.addRuleForField('name', 'trim', true);
        this.addRuleForField('name', 'required', true, i18n.__('required'));
        this.addRuleForField('name', 'maxLength', 200, i18n.__('maxLength_input'));

        this.addRuleForField('model', 'trim', true);
        this.addRuleForField('model', 'required', true, i18n.__('required'));
        this.addRuleForField('model', 'maxLength', 200, i18n.__('maxLength_input'));

        this.addRuleForField('serial_number', 'trim', true);
        this.addRuleForField('serial_number', 'required', true, i18n.__('required'));
        this.addRuleForField('serial_number', 'maxLength', 200, i18n.__('maxLength_input'));

        
    }
    setAlias(){
        this.v.setAlias({
            id_project: i18n.__('device.id_project'),
            id_device_type: i18n.__('device.id_device_type'),
            id_device_group: i18n.__('device.id_device_group'),
            name: i18n.__('device.name'),
            model: i18n.__('device.model'),
            serial_number: i18n.__('device.serial_number')
        });
    }
}
export default DeviceValidate;