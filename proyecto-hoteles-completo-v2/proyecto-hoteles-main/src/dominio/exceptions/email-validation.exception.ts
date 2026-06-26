export class EmailValidationException extends Error {
    constructor(public email: string, public msg = 'El email proporcionado con tiene una estructura valida.') {
        super(msg)
    }
}