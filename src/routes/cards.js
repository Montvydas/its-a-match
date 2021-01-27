import Card, { validate } from '../models/card.js';
import { Router } from 'express';
import _ from 'lodash';
const router = Router();

router.get('/', async (req, res) => {
    const cards = await Card.find().select('word.value meanings.value -_id');
    res.json(cards);
});

router.post('/', async (req, res) => {
    const { error, value } = validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const card = new Card({
        word: {
            value: value.word
        },
        meanings: {
            value: value.meanings
        },
        difficulty: value.difficulty
    });

    const storedCard = await card.save();
    res.json(_.pick(storedCard, ['word.value', 'meanings.value']));
});


router.get('/', (req, res) => {
    const { error, value } = validateCardRequest(req.body);

    if (error) return res.status(404).json(error.details[0].message);

    const level = getLevelByName(value.level);
    const separated = { words: [], meanings: [] };
    let randomPairs = getRandomElements(level.words, value.count);

    randomPairs.forEach((pair, id) => {
        separated.words.push({ word: pair.word, id: id });
        separated.meanings.push({ meaning: pair.meaning, id: id });
    });

    shuffle(separated.meanings);

    return res.json(separated);
});

function validateCardRequest(data) {
    const schema = Joi.object({
        level: Joi.number().min(0).max(100).required()
    });

    return schema.validate(data);
}

export default router;