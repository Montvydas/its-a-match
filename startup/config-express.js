import cors from 'cors';
import { json, urlencoded } from 'express';

export default (app) => {
    app.use(cors());
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.set('json spaces', 2);
};