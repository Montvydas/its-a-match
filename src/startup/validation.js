import joiObjectId from 'joi-objectid';
import Joi from 'joi';

export default () => {
    Joi.objectId = joiObjectId(Joi); // in index.js, now use anywhere else
};