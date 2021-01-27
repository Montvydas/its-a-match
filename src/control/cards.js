import Card from '../models/card.js';
import _ from 'lodash';

// await getNewCards(req.params.level)
async function getNewCards(level) {
    const { min, max, count } = _getDifficulty(level);

    const cards = await Card.aggregate([
        { $match: { $and: [{ difficulty: { $gte: min, $lte: max } }] } },
        { $sample: { size: count } },
        // { $project: { word: "$word.value", _id: 0, meanings: "$meanings.value", difficulty: "$difficulty" } }
        { $project: { __v: 0 } }
    ]);

    // It is unlikely but possible to get duplicates when using $sample!
    return _.uniqBy(cards, '_id');
}

function _getDifficulty(level, maxDifficulty = 19, maxDifficultyDiff = 4, minCount = 5, countStep = 4) {
    // With default values we repeat levels 0-15 mostly 3 times and increment default card count every 4 levels
    // 0: { min: 0, max: 0, count: 5 }
    // 1: { min: 0, max: 1, count: 5 }
    // 2: { min: 1, max: 1, count: 5 }
    // 3: { min: 1, max: 2, count: 5 }
    // 4: { min: 2, max: 2, count: 6 }
    // ...
    // 20: { min: 10, max: 10, count: 10 }
    // 100: { min: 15, max: 19, count: 30 }
    const min = Math.floor(level / 2);
    const max = min + level % 2;
    const count = minCount + Math.floor(level / countStep);
    return { min: Math.min(min, maxDifficulty - maxDifficultyDiff), max: Math.min(max, maxDifficulty), count };
}

function popMatching(wordId, meaningsId, cards) {
    return _.remove(cards, card => card.word._id == wordId && card.meanings._id == meaningsId)[0];  // method returns array containing values or empty array
}

function publicData(cards) {
    return cards.map(card => _.omit(card, '_id'));
}

export { getNewCards, popMatching, publicData };
