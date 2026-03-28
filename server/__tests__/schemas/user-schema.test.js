const { Validator } = require('jsonschema');
const userSchema = require('../../src/schemas/user-schema.json').definitions;

describe('User JSON Schema', () => {
    const v = new Validator();

    it('should pass a valid user registration', () => {
        const validData = {
            username: 'john_doe',
            password: 'SuperSecret1!',
            retypePassword: 'SuperSecret1!',
            email: 'john.doe@coventry.ac.uk'
        };

        const result = v.validate(validData, userSchema.userRegistration);

        expect(result.valid).toBe(true);
        expect(result.errors.length).toBe(0);
    });

    it('should fail if a field is missing', () => {
        const badData = {
            username: 'john_doe',
            password: 'SuperSecret1!',
            retypePassword: 'SuperSecret1!'
        };

        const result = v.validate(badData, userSchema.userRegistration);

        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('requires property "email"');
    });

    it('should fail if the username is too short', () => {
        const badData = {
            username: 'jo',
            password: 'SuperSecret1!',
            retypePassword: 'SuperSecret1!',
            email: 'john.doe@coventry.ac.uk'
        };

        const result = v.validate(badData, userSchema.userRegistration);

        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('does not meet minimum length of 3');
    });

    it('should fail if the email is not from coventry.ac.uk', () => {
        const badData = {
            username: 'john_doe',
            password: 'SuperSecret1!',
            retypePassword: 'SuperSecret1!',
            email: 'john.doe@gmail.com'
        };

        const result = v.validate(badData, userSchema.userRegistration);

        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('does not match pattern');
    });


    it('should fail if the email is not a valid email format', () => {
        const badData = {
            username: 'john_doe',
            password: 'SuperSecret1!',
            retypePassword: 'SuperSecret1!',
            email: 'not-an-email'
        };

        const result = v.validate(badData, userSchema.userRegistration);

        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('does not conform to the "email" format');
    });

    it('should fail if the password does not match the regex', () => {
        const badData = {
            username: 'john_doe',
            password: 'password',
            retypePassword: 'password',
            email: 'john.doe@coventry.ac.uk'
        };

        const result = v.validate(badData, userSchema.userRegistration);

        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('does not match pattern');
    });
});