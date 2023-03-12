import BaseValidate from './BaseValidate';
class EmployeeValidate extends BaseValidate{
    constructor(entity){
        super();
        this.entity = entity;
    }
    setRule(){
        this.addRuleForField('first_name', 'trim', true);
        this.addRuleForField('first_name', 'required', true, i18n.__('required'));
        this.addRuleForField('first_name', 'maxLength', 100, i18n.__('maxLength_input'));

        this.addRuleForField('last_name', 'trim', true);
        this.addRuleForField('last_name', 'required', true, i18n.__('required'));
        this.addRuleForField('last_name', 'maxLength', 100, i18n.__('maxLength_input'));

        this.addRuleForField('phone', 'trim', true);
        this.addRuleForField('phone', 'required', true, i18n.__('required'));
        this.addRuleForField('phone', 'maxLength', 40, i18n.__('maxLength_input'));

        this.addRuleForField('email', 'trim', true);
        this.addRuleForField('email', 'required', false, i18n.__('required'));
        this.addRuleForField('email', 'type', 'email', i18n.__('type_email'));
        this.addRuleForField('email', 'maxLength', 50, i18n.__('maxLength_input'));
        if(this.entity.screen_mode === 1 || (this.entity.screen_mode === 2 && this.entity.password !== null)){
            this.v.addRule('password', 'trim', true);
            this.v.addRule('password', 'required', true);
            this.v.setMsg('password', 'required', i18n.__('required'));
            this.v.addRule('password', 'minLength', 8);
            this.v.setMsg('password', 'minLength', i18n.__('minLength_input'));
        }
    
    }
    setAlias(){
        this.v.setAlias({
            first_name: i18n.__('employee.first_name'),
            last_name: i18n.__('employee.last_name'),
            email: i18n.__('employee.email'),
            phone: i18n.__('employee.phone'),
            password: i18n.__('employee.password')
        });
    }
}
export default EmployeeValidate;