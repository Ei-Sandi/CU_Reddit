const { Validator } = require('jsonschema');
const commentSchema = require('../../src/schemas/comment-schema.json').definitions;

describe('Comment JSON Schema', () => {
    const v = new Validator();

    it('should pass a valid comment', () => {
        const validData = { content: 'This is a comment' };
        const result = v.validate(validData, commentSchema.commentContent);
        expect(result.valid).toBe(true);
    });

    it('should fail if content is missing', () => {
        const invalidData = {};
        const result = v.validate(invalidData, commentSchema.commentContent);
        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('requires property "content"');
    });

    it('should fail with additional properties', () => {
        const invalidData = { content: 'This is a comment', extra: 'some value' };
        const result = v.validate(invalidData, commentSchema.commentContent);
        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('is not allowed to have the additional property');
    });
});
