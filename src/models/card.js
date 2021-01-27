import Joi from 'joi';
import mongoose from 'mongoose';
const { model, Schema } = mongoose;

const meaningsScheme = new Schema({
    value: {
        type: [{
            type: String,
            required: true,
            minLength: 1,
            maxLength: 255,
            lowercase: true,
            trim: true
        }],
        validate: {
            validator: validateArrayLength,
            message: 'There should be at least one meaning, but no more than 10.'
        }
    }
});

const wordScheme = new Schema({
    value: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
        lowercase: true,
        trim: true,
        unique: true
    }
});

const cardSchema = new Schema({
    word: wordScheme,
    meanings: meaningsScheme,
    difficulty: { type: Number, required: true, min: 0, max: 19 }
});

function validateArrayLength(arr) {
    return arr && 0 < arr.length && arr.length < 10;
}

const Card = model('Card', cardSchema);

// cardSchema.pre('save', function (next) {
//     if (err) {
//         console.log(err);
//         res.status(400).send(err);
//     }
// });

function validateCard(data) {
    // const schema = Joi.object({
    //     word: Joi.string().allow('').required(),
    //     meanings: Joi.array().items(Joi.string().allow('')).required(),
    // });

    const schema = Joi.object({
        word: Joi.string().min(1).max(255).required(),
        meanings: Joi.array().items(Joi.string().min(1).max(255)).min(1).max(10).required(),
        difficulty: Joi.number().min(0).max(19).required()
    });
    return schema.validate(data);
}

export default Card;
export { validateCard as validate };