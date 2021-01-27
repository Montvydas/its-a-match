import { readFile, writeFile } from 'fs';


export default readFile('../../top_1000_spanish.json', 'utf8', (err, data) => {
    if (err) throw err;

    let cards = [];
    JSON.parse(data).levels.forEach((level) => {
        cards = cards.concat(level.cards);
    });

    // console.log(cards);
    writeFile('../../top_1000_spanish_simple.json', JSON.stringify(cards), 'utf8', () => console.log('Done writing to file!'));
    // return cards;
});