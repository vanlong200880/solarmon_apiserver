
import BaseValidate from './BaseValidate';
class EmplyeeResetPasswordValidate extends BaseValidate{
    constructor(){
        super();
    }
    setRule(){
        this.addRuleForField('password', 'trim', true);
        this.addRuleForField('password', 'required', true, i18n.__('required'));
        this.addRuleForField('password', 'minLength', 10, i18n.__('minLength_input'));
    }
    setAlias(){
        this.v.setAlias({
            password: i18n.__('employee.password')
        });
    }
}
export default EmplyeeResetPasswordValidate;