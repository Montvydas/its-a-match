import Highscore, { validate } from '../models/highscore.js';
import { Router } from 'express';
import _ from 'lodash';
import Joi from 'joi';
import config from 'config';

const router = Router();

router.get('/:count', async (req, res) => {
    const { error, value } = validateHighscoresRequest(req.params);

    if (error) return res.status(400).json(error.details[0].message);

    const highscores = await Highscore
        .find()
        .sort({ reachedLevel: -1 })
        .limit(value.count)
        .select('-_id -__v');
    res.json(highscores);
});

router.post('/', async (req, res) => {
    const maxHighscores = config.get('max-highscores');
    // TODO: Add logic to maintain defined count of highscores rather than storing everything, maybe use aggregate with min property
    // TODO: Find out should we update existing entry into db through ref _id or should we just add new entry
    const { error, value } = validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // const cards = await Card.aggregate([
    //     { $match: { $and: [{ difficulty: { $gte: min, $lte: max } }] } },
    //     { $sample: { size: count } },
    //     // { $project: { word: "$word.value", _id: 0, meanings: "$meanings.value", difficulty: "$difficulty" } }
    //     { $project: { __v: 0 } }
    // ]);

    const highscore = new Highscore({ ..._.pick(value, ['username', 'killerWord', 'reachedLevel']) });
    await highscore.save();

    res.json(_.pick(highscore, ['username', 'killerWord', 'reachedLevel', 'date']));
});

function validateHighscoresRequest(data) {
    const schema = Joi.object({
        count: Joi.number().min(0).max(100).required()
    });

    return schema.validate(data);
}

export default router;