import express from 'express';
import config from 'config';
import winston from 'winston';

import logging from './startup/logging.js';
import db from './startup/db.js';
import prod from './startup/prod.js';
import cors from './startup/cors.js';
import routes from './startup/routes.js';
import validation from './startup/validation.js';


const app = express();

logging(app);
db();
if (app.get('env') === 'production') {
    prod(app);
}
cors(app);
routes(app);
validation();


const port = process.env.PORT || config.get('port');
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

export default server;