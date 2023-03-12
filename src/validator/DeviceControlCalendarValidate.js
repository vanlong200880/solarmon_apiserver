import BaseValidate from './BaseValidate';
class DeviceControlCalendarValidate extends BaseValidate{
    constructor(){
        super();
    }
    setRule(){
        this.v.addRule('date_from', 'trim', true);
        this.v.addRule('date_from', 'required', true);
        this.v.setMsg('date_from', 'required', i18n.__('required'));
        this.addRuleForField('date_from', 'maxLength', 20, i18n.__('maxLength_input'));

        this.v.addRule('date_to', 'trim', true);
        this.v.addRule('date_to', 'required', true);
        this.v.setMsg('date_to', 'required', i18n.__('required'));
        this.addRuleForField('date_to', 'maxLength', 20, i18n.__('maxLength_input'));
    }
    setAlias(){
        this.v.setAlias({
            date_from: i18n.__('date_from'),
            date_to: i18n.__('date_to'),
        });
    }
}
export default DeviceControlCalendarValidate;