import db from '../startup/db.js';
import Card from '../models/card.js';
import { readFile } from 'fs';
import util from 'util';
const readFilePromised = util.promisify(readFile);

db();

const data = await readFilePromised('top_1000_spanish.json', 'utf8');

JSON.parse(data).levels.forEach((level) => {
    level.cards.forEach(async (card) => {
        const mongoCard = new Card({
            word: {
                value: card.word
            },
            meanings: {
                value: card.meanings
            },
            difficulty: level.difficulty
        });

        await mongoCard.save();
    });
    console.log(`Wrote difficulty: ${level.difficulty}`);
});

console.log('Finished!');