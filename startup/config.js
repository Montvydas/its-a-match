import { json, urlencoded } from 'express';


export default (app) => {    
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.set('json spaces', 2);

    
};
