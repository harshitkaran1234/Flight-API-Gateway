const { UserService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');

async function signup(req, res) {
    try{
        const user = await UserService.create({
            email: req.body.email,
            password: req.body.password,
        });
        SuccessResponse.data = user;
        return res.status(200).json(SuccessResponse);
    } catch(error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    signup
}