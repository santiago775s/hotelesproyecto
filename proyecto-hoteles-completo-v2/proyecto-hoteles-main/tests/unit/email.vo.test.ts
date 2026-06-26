import {describe, expect, it, test} from '@jest/globals';
import { Email } from '../../src/dominio/value-objets/email.vo';
import { EmailValidationException } from '../../src/dominio/exceptions/email-validation.exception';


describe('Email value-object', () => {
	it('returns true for valid emails', () => {
		expect(Email.validate('admin@ucb.com')).toBe(true);
        expect(Email.validate('admin@ucb.gob.bo')).toBe(true);
        // test de error
        expect(Email.validate('admi{n@ucb.com')).toBe(false);
		expect(Email.validate('admi{n@b.com')).toBe(false);
		expect(Email.validate('email-asd.a)sd@asd-b.com')).toBe(false);
	});
});

describe('Email value-object', () => {
	it('throw EmailValidationException for invalid emails', () => {
		expect(() => new Email('email-asd.a)sd@asd-b.com')).toThrow(EmailValidationException)
		expect(() => Email.fromString('email-as}d.a)sd@asd-b.com')).toThrow(EmailValidationException)
	});
});

describe('Email value-object', () => {
	it('returns Emain instance for valid emails', () => {
		expect(new Email('emaild@asd-b.com')).toBeInstanceOf(Email)
		expect(Email.fromString('emaild-123@asd-b.com')).toBeInstanceOf(Email)
	});
});