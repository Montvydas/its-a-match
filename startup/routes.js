
import words from '../routes/words.js';
import home from '../routes/home.js';
import error from '../middleware/error.js';
// import matchGame from '../routes/match-game';

export default (app) => {
    app.use('/', home);
    app.use('/api/words', words);
    // app.use('/api', api);

    // if something goes wring with the database, this has to be at the last stage
    app.use(error);
};