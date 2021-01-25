import express from 'express';
import config from 'config';
import winston from 'winston';

import configExpress from './startup/config-express.js';
import logging from './startup/logging.js';
import db from './startup/db.js';
import session from './startup/session.js';
import prod from './startup/prod.js';
import validation from './startup/validation.js';
import routes from './startup/routes.js';

const app = express();

configExpress(app);
logging(app);
db();
session(app);
if (app.get('env') === 'production') {
    prod(app);
}
validation();
routes(app);


const port = process.env.PORT || config.get('port');
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

export default server;