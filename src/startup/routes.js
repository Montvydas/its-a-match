
import cards from '../routes/cards.js';
import highscores from '../routes/highscores.js';
import error from '../middleware/error.js';
import matchGame from '../routes/match-game.js';

export default (app) => {
    app.use('/api/cards', cards);
    app.use('/api/match-game', matchGame);
    app.use('/api/highscores', highscores);

    // if something goes wring with the database, this has to be at the last stage
    app.use(error);
};