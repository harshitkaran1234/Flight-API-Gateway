const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');

function validateAuthRequest(req, res, next) {
    if(!req.body.email) {
        ErrorResponse.message = 'Something went wrong while authenticating user';
        ErrorResponse.error = new AppError(['email not found in the incoming req'], 400);
        return res
                .status(400)
                .json(ErrorResponse);
    }

    if(!req.body.password) {
        ErrorResponse.message = 'Something went wrong while authenticating user';
        ErrorResponse.error = new AppError(['password not found in the incoming req'], 400);
        return res
                .status(400)
                .json(ErrorResponse);
    }
    next();
}

module.exports = {
    validateAuthRequest
}