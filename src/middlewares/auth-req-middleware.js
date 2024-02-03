const { UserService } = require('../services');
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

async function checkAuth(req, res, next) {
    try {
        const response =await  UserService.isAuthenticated(req.headers['x-access-token']);
        if(response) {
            req.user = response;
            next();
        }
    } catch(error) {
        return res.status(error.statusCode).json(error);
    }
}

async function isAdmin(req, res, next) {
    const response = await UserService.isAdmin(req.user);
    if(!response) {
        return res
                .status(401)
                .json({message: 'User not authorised for this action'});
    }
    next();
}

module.exports = {
    validateAuthRequest,
    checkAuth,
    isAdmin,
}