import { EmailValidationException } from "../exceptions/email-validation.exception";

export class Email {
    constructor(private email: string) {
        const emailValido = Email.validate(this.email);
        if(!emailValido)
            throw new EmailValidationException(email)
    }

    public static fromString(str: string) {
        return new Email(str);
    }

    public static validate(email: string):boolean {
        const result = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$').test(email);
        return result;
    }
}
