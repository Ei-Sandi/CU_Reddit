const { Validator, ValidationError } = require('jsonschema');
const userSchema = require('../schemas/user.json').definitions;
const postSchema = require('../schemas/post.json').definitions;
const commentSchema = require('../schemas/comment.json').definitions;

const makeKoaValidator = (schema, resource) => {
    const v = new Validator();
    const validationOptions = {
        throwError: true,
        propertyName: resource
    };

    return async (ctx, next) => {
        const body = ctx.request.body;
        try {
            v.validate(body, schema, validationOptions);
            await next();
        } catch (error) {
            if (error instanceof ValidationError) {
                console.error(error);
                ctx.status = 400;
                ctx.body = error;
            } else {
                throw error;
            }
        }
    }
}

exports.validateUserRegistration = makeKoaValidator(userSchema.userRegistration, 'userRegistration');
exports.validateUserLogin = makeKoaValidator(userSchema.userLogin, 'userLogin');
exports.validateUsernameUpdate = makeKoaValidator(userSchema.usernameUpdate, 'usernameUpdate');
exports.validatePostContent = makeKoaValidator(postSchema.postContent, 'postContent');
exports.validateCommentContent = makeKoaValidator(commentSchema.commentContent, 'commentContent');
