import Joi from 'joi';
import mongoose from 'mongoose';
const { model, Schema } = mongoose

const meaningsStructure = new Schema({
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
    },
    id: {
        type: String,
        required: true
    }
});

const wordStructure = {
    value: {
        type: String,
        required: true,
        unique: true,
        minLength: 1,
        maxLength: 255,
        lowercase: true,
        trim: true
    },
    id: {
        type: String,
        required: true
    }
};

const wordSchema = new Schema({
    word: wordStructure,
    meanings: meaningsStructure,
    index: { type: Number, index: true, required: true, unique: true, min: 0 }
});

function validateArrayLength(arr) {
    return arr && 0 < arr.length && arr.length < 10;
}

const Word = model('Word', wordSchema);

// wordSchema.pre('save', function (next) {
//     if (err) {
//         console.log(err);
//         res.status(400).send(err);
//     }
// });

function validateWord(word) {
    // const schema = Joi.object({
    //     word: Joi.string().allow('').required(),
    //     meanings: Joi.array().items(Joi.number().allow('')).required(),
    // });

    const schema = Joi.object({
        word: Joi.string().min(1).max(255).required(),
        meanings: Joi.array().items(Joi.string().min(1).max(255)).min(1).max(10).required(),
    });
    return schema.validate(word);
}

export default Word;
export { validateWord as validate };