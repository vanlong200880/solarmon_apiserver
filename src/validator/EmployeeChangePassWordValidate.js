import BaseValidate from './BaseValidate';
class EmployeeChangePassWordValidate extends BaseValidate{
    constructor(){
        super();
    }
    setRule(){
        this.addRuleForField('email', 'trim', true);
        this.addRuleForField('email', 'required', false, i18n.__('required'));
        this.addRuleForField('email', 'type', 'email', i18n.__('type_email'));
        this.addRuleForField('email', 'maxLength', 100, i18n.__('maxLength_input'));
        
        this.v.addRule('password', 'trim', true);
        this.v.addRule('password', 'required', true);
        this.v.setMsg('password', 'required', i18n.__('required'));
        this.v.addRule('password', 'minLength', 8);
        this.v.setMsg('password', 'minLength', i18n.__('minLength_input'));
    }
    setAlias(){
        this.v.setAlias({
            email: i18n.__('email'),
            password: i18n.__('password')
        });
    }
}
export default EmployeeChangePassWordValidate;