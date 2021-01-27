import { Router } from 'express';
import _ from 'lodash';
import { validateGameStart, validateCardMatch } from '../models/matchGame.js';
import { getNewCards, popMatching, publicData } from '../control/cards.js';
import { gameInit, getGameStatus, isLevelComplete, getPlayerStatus } from '../control/gameplay.js';
const router = Router();

router.get('/init', (req, res) => {
    // TODO: make username unique.
    res.json(getPlayerStatus(req.session));
})

router.post('/suicide', (req, res) => {
    req.session.health = 0;
    res.json({ message: 'Good-bye my dear friend!' });
})

router.post('/start', async (req, res) => {
    // TODO: also have to validate that user is unique, have to find info how..
    const { error, value } = validateGameStart(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const forceRestart = value.restart || !getPlayerStatus(req.session).isHealthy;
    if (forceRestart) {
        await gameInit(req.session, value.username);
    }

    res.json(startGameResponse(req.session));
})

function startGameResponse(sessionData) {
    const cards = publicData(sessionData.cards);
    return { ..._.pick(sessionData, ['username', 'health', 'level']), cards };
}

router.post('/try-match', async (req, res) => {
    const { error, value } = validateCardMatch(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    let gameStatus = getGameStatus(req.session);
    if (gameStatus.gameOver || gameStatus.levelComplete) return res.status(400).json({ message: 'Nothing to match, not playing!' });

    if (!popMatching(value.wordId, value.meaningId, req.session.cards)) {
        req.session.health--;
        return res.json(minimalTryMatchResponse(req.session, false));
    }

    if (isLevelComplete(req.session.cards)) {
        req.session.cards = await getNewCards(++req.session.level);
        return res.json(fullTryMatchResponse(req.session, true));
    }

    return res.json(minimalTryMatchResponse(req.session, true));
});

function minimalTryMatchResponse(sessionData, matches) {
    return {
        matches,
        gameStatus: getGameStatus(sessionData),
        ..._.pick(sessionData, ['level', 'health'])
    };
}

function fullTryMatchResponse(sessionData, matches) {
    const cards = publicData(sessionData.cards);
    return {
        ...minimalTryMatchResponse(sessionData, matches),
        cards
    };
}

export default router;