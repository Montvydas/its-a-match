import { readFile } from 'fs';
import { object, string, number } from 'joi';
import { Router } from 'express';
const router = Router();

const levels = [];
const levelNames = [];

readFile('top_1000_spanish.json', 'utf8', (err, data) => {
    if (err) throw err;
    JSON.parse(data).levels.forEach((level) => {
        levels.push(level);
        levelNames.push(level.name);
    });
});

router.get('/levels/', (req, res) => {
    return res.send(JSON.stringify(levelNames));
});

router.get('/levels/:name', (req, res) => {
    const schema = object({
        name: string().min(1).required(),
    });
    const { error, value } = schema.validate(req.params);
    if (error) return res.status(404).send(error.details[0].message);

    const level = getLevelByName(value.name);
    if (!level) return res.status(404).send('Such level does not exist.');

    return res.send(JSON.stringify(level.words));
});

router.get('/definition-game/cards', (req, res) => {
    const schema = object({
        level: string().min(1).required(),
        count: number().min(1).max(10).required()
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

router.get('/definition-game/compare-cards', (req, res) => {
    const schema = object({
        wordId: number().min(0).required(),
        meaningId: number().min(0).required()
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