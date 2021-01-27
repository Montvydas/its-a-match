
import cards from '../routes/cards.js';
import error from '../middleware/error.js';
import matchGame from '../routes/match-game.js';

export default (app) => {
    app.use('/api/cards', cards);
    app.use('/api/match-game', matchGame);

    // if something goes wring with the database, this has to be at the last stage
    app.use(error);
};