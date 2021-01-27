import winston from 'winston';

export default (err, req, res, next) => {
    winston.error(err.message, err);
    // console.log(err.message);

    // error
    // warn
    // info
    // verbose
    // debug 
    // silly

    res.status(500).json({ message: 'Something failed.' });
}