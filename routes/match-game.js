import { Router } from 'express';
import _ from 'lodash';
import Joi from 'joi';
import config from 'config';
const router = Router();

router.get('/init', (req, res) => {
    // TODO: make username unique.
    const userConfig = {
        username: req.session.username || defaultUsername(req.sessionID),
        isHealthy: isHealthy(req.session.health)
    };

    res.json(userConfig);
})

function defaultUsername(sessionId) {
    return `Spaniard_${sessionId.slice(-5)}`;
}

function isHealthy(health) {
    return health > 0;
}

// TODO: Potentially divice code into two different routes?
router.post('/restart', (req, res) => {

})

router.post('/restart', (req, res) => {

})

router.post('/suicide', (req, res) => {
    req.session.health = 0;
    res.json({ message: 'Good-bye my dear friend!' });
})

router.post('/start', (req, res) => {
    // TODO: also have to validate that user is unique, have to find info how..
    const { error, value } = validateGameStart(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const forceRestart = value.restart || !isHealthy(req.session.health);
    if (forceRestart) {
        console.log('You are not healthy or want to restart the game!');
        // return res.json({ message: 'You are not healthy! Restarting session for ya :)' });
        gameInit(req.session, value.username);
    }

    res.json(_.pick(req.session, ['username', 'health', 'level', 'cards']));
})

function validateGameStart(data) {
    const schema = Joi.object({
        username: Joi.string().min(1).max(20).required(),
        restart: Joi.boolean().required()
    });
    return schema.validate(data);
}

function gameInit(memory, username) {
    memory.username = username;
    memory.health = config.get('default-health');
    memory.level = 0;
    memory.cards = ['wordId0', 'wordId1', 'wordId2', 'wordId3', 'wordId4'];
}

router.post('/try-match', (req, res) => {
    const { error, value } = validateCardMatch(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const gameStatus = {
        gameOver: !isHealthy(req.session.health),
        levelComplete: isLevelComplete(req.session.cards)
    };

    if (gameStatus.gameOver || gameStatus.levelComplete) return res.status(400).json({ message: 'Nothing to match, not playing!' });

    if (matches(value.wordId, value.meaningId)) {
        req.session.cards = filterMatched(req.session.cards, value.wordId);
        gameStatus.levelComplete = isLevelComplete(req.session.cards);

        if (gameStatus.levelComplete) {
            req.session.cards = getNewCards(++req.session.level);
        }
    } else {
        gameStatus.gameOver = !isHealthy(--req.session.health);
    }

    res.json({
        ...gameStatus,
        ..._.pick(req.session, ['username', 'health', 'level', 'cards'])
    });
});

function validateCardMatch(data) {
    const schema = Joi.object({
        wordId: Joi.string().length(10).required(),
        meaningId: Joi.string().length(10).required()
    });

    return schema.validate(data);
}

function matches(wordId, meaningId) {
    // TODO: change the logic to compare actual Ids
    return wordId === meaningId;
}

function filterMatched(cards, cardId) {
    console.log(`Removing card with id: ${cardId}`);
    return cards.filter((id, index) => index !== 0);
}

function isLevelComplete(cards) {
    return !cards || cards.length === 0;
}

function getNewCards(level) {
    return ['newWordId0', 'newWordId1', 'NewWordId2', 'newWordId3', 'newWordId4']
}

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

router.get('/cards', (req, res) => {
    const schema = Joi.object({
        level: Joi.number().min(0).max(100).required(),
        count: Joi.number().min(1).max(10).required()
    });

    const { error, value } = schema.validate(req.query);

    if (error) return res.status(404).json(error.details[0].message);

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

export default router;