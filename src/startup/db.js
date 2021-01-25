import winston from 'winston';
import config from 'config';
import mongoose from 'mongoose';


export default () => {
    const db = config.get('mongodb');
    mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
        .then(() => winston.info(`Connected to ${db}`));
};