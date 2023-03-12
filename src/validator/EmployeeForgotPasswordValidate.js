import BaseValidate from './BaseValidate';
class EmployeeForgotPasswordValidate extends BaseValidate{
    constructor(){
        super();
    }
    setRule(){
        this.addRuleForField('email', 'trim', true);
        this.addRuleForField('email', 'required', false, i18n.__('required'));
        this.addRuleForField('email', 'type', 'email', i18n.__('type_email'));
        this.addRuleForField('email', 'maxLength', 50, i18n.__('maxLength_input'));
    }
    setAlias(){
        this.v.setAlias({
            email: i18n.__('employee.email'),
        });
    }
}
export default EmployeeForgotPasswordValidate;

