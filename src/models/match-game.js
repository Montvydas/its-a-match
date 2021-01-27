import Joi from 'joi';

function validateCardMatch(data) {
    const schema = Joi.object({
        wordId: Joi.string().length(24).required(),
        meaningId: Joi.string().length(24).required()
    });

    return schema.validate(data);
}

function validateGameStart(data) {
    const schema = Joi.object({
        username: Joi.string().min(1).max(20).required(),
        restart: Joi.boolean().required()
    });
    return schema.validate(data);
}

export { validateGameStart, validateCardMatch };
