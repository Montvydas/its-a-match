import Word, { validate } from '../models/word.js';
import { Router } from 'express';
import handleValidationError from '../tools/helpers.js';
import _ from 'lodash';
const router = Router();

router.get('/', async (req, res) => {
    const words = await Word.find().select('word.value meanings.value -_id');
    res.json(words);
});

router.post('/', async (req, res) => {
    const { error, value } = validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const word = new Word({
        word: {
            value: value.word,
            id: '123453'
        },
        meanings: {
            value: value.meanings,
            id: '123453'
        },
        index: 4
    });

    try {
        const storedWord = await word.save();
        res.json(_.pick(storedWord, ['word.value', 'meanings.value']));
    } catch (ex) {
        if (ex.name === 'ValidationError') return handleValidationError(ex, res);
        return res.status(500).json({ message: ex.message });
    }
});

export default router;