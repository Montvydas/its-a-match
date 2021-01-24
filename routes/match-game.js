import { Router } from 'express';
import Joi from 'joi';
const router = Router();

router.get('/match-game/cards', (req, res) => {
    const schema = Joi.object({
        level: Joi.string().min(1).required(),
        count: Joi.number().min(1).max(10).required()
    });

    const { error, value } = schema.validate(req.query);

    if (error) return res.status(404).send(error.details[0].message);

    const level = getLevelByName(value.level);
    const separated = { words: [], meanings: [] };
    let randomPairs = getRandomElements(level.words, value.count);

    randomPairs.forEach((pair, id) => {
        separated.words.push({ word: pair.word, id: id });
        separated.meanings.push({ meaning: pair.meaning, id: id });
    });

    shuffle(separated.meanings);

    return res.send(JSON.stringify(separated));
});

router.get('/match-game/compare-cards', (req, res) => {
    const schema = Joi.object({
        wordId: Joi.number().min(0).required(),
        meaningId: Joi.number().min(0).required()
    });
    const { error, value } = schema.validate(req.query);
    if (error) return res.status(404).send(error.details[0].message);

    return res.send(value.wordId === value.meaningId);
});

function getLevelByName(name) {
    return levels.find(lvl => lvl.name === name);
}

function getRandomElements(arr, count) {
    const _arr = [...arr];
    shuffle(_arr);
    const selected = _arr.slice(0, count);
    return selected;
}

function shuffle(arr) {
    arr.sort(() => 0.5 - Math.random());
}


export default router;