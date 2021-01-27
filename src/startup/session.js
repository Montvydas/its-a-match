import session from 'express-session';
import connectMongo from 'connect-mongo';
import config from 'config';
import mongoose from 'mongoose';

const MongoStore = connectMongo(session);

export default (app) => {

    const week = 1000 * 60 * 60 * 24 * 7; // ms * s * min * h * days
    var sess = {
        secret: config.get('session-secret'),
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
        cookie: { maxAge: week, httpOnly: true }, // do not allows js on client to touch cookies
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    };

    if (app.get('env') === 'production') {
        app.set('trust proxy', 1) // trust first proxy
        sess.cookie.secure = true // serve secure cookies
    }

    app.use(session(sess));
};