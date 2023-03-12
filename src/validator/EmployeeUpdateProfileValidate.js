import BaseValidate from './BaseValidate';
class EmployeeUpdateProfileValidate extends BaseValidate{
    constructor(){
        super();
    }
    setRule(){
        this.addRuleForField('first_name', 'trim', true);
        this.addRuleForField('first_name', 'required', true, i18n.__('required'));
        this.addRuleForField('first_name', 'maxLength', 100, i18n.__('maxLength_input'));

        this.addRuleForField('last_name', 'trim', true);
        this.addRuleForField('last_name', 'required', true, i18n.__('required'));
        this.addRuleForField('last_name', 'maxLength', 100, i18n.__('maxLength_input'));

        this.addRuleForField('id', 'trim', true);
        this.addRuleForField('id', 'required', true, i18n.__('required'));
        this.addRuleForField('id', 'maxLength', 50, i18n.__('maxLength_input'));

    }
    setAlias(){
        this.v.setAlias({
            id: i18n.__('employee.id'),
            first_name: i18n.__('employee.first_name'),
            last_name: i18n.__('employee.last_name')
        });
    }
}
export default EmployeeUpdateProfileValidate;