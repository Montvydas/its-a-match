import Joi from 'joi';
import mongoose from 'mongoose';
const { model, Schema } = mongoose;

const highscoreSchema = new Schema({
    username: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 20,
        trim: true
    },
    killerWord: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
        lowercase: true,
        trim: true
    },
    reachedLevel: {
        type: Number,
        required: true,
        min: 0
    },
    date: { type: Date, default: Date.now }
});
// TODO: Potentially enable date, which would automatically add timestamps of when the entry was updated.
//  e.g. the same user updates his highscore, do we keep his current score or do we add new one?
// const exampleSchema = new Schema({...}, { timestamps: true });

const Highscore = model('Highscore', highscoreSchema);

function validateHighscore(data) {
    const schema = Joi.object({
        username: Joi.string().min(1).max(20).required(),
        killerWord: Joi.string().min(1).max(255).required(),
        reachedLevel: Joi.number().min(0).required()
    });
    return schema.validate(data);
}

export default Highscore;
export { validateHighscore as validate };