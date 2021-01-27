import { getNewCards } from './cards.js';
import config from 'config';

async function gameInit(sessionData, username) {
    sessionData.username = username;
    sessionData.health = config.get('default-health');
    sessionData.level = 0;
    sessionData.cards = await getNewCards(sessionData.level);
}

function getPlayerStatus(sessionData) {
    return {
        username: sessionData.username || defaultUsername(sessionData.id),
        isHealthy: isHealthy(sessionData.health)
    };
}

function getGameStatus(sessionData) {
    return {
        gameOver: !isHealthy(sessionData.health),
        levelComplete: isLevelComplete(sessionData.cards),
    };
}

function isHealthy(health) {
    return health > 0;
}

function isLevelComplete(cards) {
    return !cards || cards.length === 0;
}

function defaultUsername(sessionId) {
    return `Spaniard_${sessionId.slice(-5)}`;
}

export { gameInit, getGameStatus, isLevelComplete, isHealthy, getPlayerStatus };