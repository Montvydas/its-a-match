import Highscore, { validate } from '../models/highscore.js';
import { Router } from 'express';
import _ from 'lodash';
import Joi from 'joi';
import config from 'config';

const router = Router();

router.get('/', async (req, res) => {
    const { error, value } = validateHighscoresRequest(req.body);

    if (error) return res.status(400).json(error.details[0].message);

    const highscores = await Highscore
        .find({ gameName: value.gameName })
        .sort({ reachedLevel: -1 })
        .limit(value.count)
        .select('-_id -__v');
    res.json(highscores);
});

router.post('/', async (req, res) => {
    if (!req.session.username) {
        return res.status(400).json({ message: 'User has not played yet!' });
    }
    // TODO: ensure limit applies to each game individually or smth
    const maxHighscores = config.get('max-highscores');
    // TODO: Add logic to maintain defined count of highscores rather than storing everything, maybe use aggregate with min property
    // TODO: Find out should we update existing entry into db through ref _id or should we just add new entry
    const { error, value } = validatePostHighscore(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    if (!config.get('supported-games').includes(value.gameName)) return res.status(400).json({ message: 'Such game does not exist.' });

    // const cards = await Card.aggregate([
    //     { $match: { $and: [{ difficulty: { $gte: min, $lte: max } }] } },
    //     { $sample: { size: count } },
    //     // { $project: { word: "$word.value", _id: 0, meanings: "$meanings.value", difficulty: "$difficulty" } }
    //     { $project: { __v: 0 } }
    // ]);

    const highscore = new Highscore({ gameName: value.gameName, ..._.pick(req.session, ['username', 'killerWord', 'reachedLevel']) });
    await highscore.save();

    // res.json(_.pick(highscore, ['username', 'killerWord', 'reachedLevel', 'date']));
    // TODO: implement ranking
    res.json({ ranke: 1 });
});

function validateHighscoresRequest(data) {
    const schema = Joi.object({
        gameName: Joi.string().min(1).max(20).required(),
        count: Joi.number().min(0).max(100).required()
    });

    return schema.validate(data);
}

function validatePostHighscore(data) {
    const schema = Joi.object({
        gameName: Joi.string().min(1).max(20).required()
    });

    return schema.validate(data);
}

export default router;