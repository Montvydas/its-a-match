import Card, { validate } from '../models/card.js';
import { Router } from 'express';
import _ from 'lodash';
import Joi from 'joi';

const router = Router();

router.get('/:difficulty', async (req, res) => {
    const { error, value } = validateDifficultyRequest(req.params);

    if (error) return res.status(400).json(error.details[0].message);

    const cards = await Card.find({ difficulty: value.difficulty }).select('word.value meanings.value -_id');
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

function validateDifficultyRequest(data) {
    const schema = Joi.object({
        difficulty: Joi.number().min(0).max(19).required()
    });

    return schema.validate(data);
}

export default router;