const { Validator } = require('jsonschema');
const postSchema = require('../../src/schemas/post-schema.json').definitions;

describe('Post JSON Schema', () => {
    const v = new Validator();

    it('should pass a valid post with just content', () => {
        const validData = { content: 'This is a post' };
        const result = v.validate(validData, postSchema.postContent);
        expect(result.valid).toBe(true);
    });

    it('should pass a valid post with content and an imageURL', () => {
        const validData = { content: 'This is a post', imageURL: 'http://example.com/image.png' };
        const result = v.validate(validData, postSchema.postContent);
        expect(result.valid).toBe(true);
    });

    it('should pass a valid post with content and a null imageURL', () => {
        const validData = { content: 'This is a post', imageURL: null };
        const result = v.validate(validData, postSchema.postContent);
        expect(result.valid).toBe(true);
    });

    it('should fail if content is missing', () => {
        const invalidData = { imageURL: 'http://example.com/image.png' };
        const result = v.validate(invalidData, postSchema.postContent);
        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('requires property "content"');
    });

    it('should fail with additional properties', () => {
        const invalidData = { content: 'This is a post', extra: 'some value' };
        const result = v.validate(invalidData, postSchema.postContent);
        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('is not allowed to have the additional property');
    });
});
