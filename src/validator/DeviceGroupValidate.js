
import BaseValidate from './BaseValidate';
class DeviceGroupValidate extends BaseValidate{
    constructor(){
        super();
    }
    setRule(){
        this.addRuleForField('name', 'trim', true);
        this.addRuleForField('name', 'required', true, i18n.__('required'));
        this.addRuleForField('name', 'maxLength', 200, i18n.__('maxLength_input'));

        this.addRuleForField('table_name', 'trim', true);
        this.addRuleForField('table_name', 'required', true, i18n.__('required'));
        this.addRuleForField('table_name', 'maxLength', 200, i18n.__('maxLength_input'));
    }
    setAlias(){
        this.v.setAlias({
            name: i18n.__('device_group.name'),
            table_name: i18n.__('device_group.table_name')
        });
    }
}
export default DeviceGroupValidate;