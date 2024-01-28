const { UserRepository } = require('../repositories');
const AppError =  require('../utils/errors/app-error');
const { Auth } = require('../utils/common')


const userRepo = new UserRepository();

async function create(data) {
    try{
        const user = await userRepo.create(data);
        return user;
    } catch(error) {
        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            })
            throw new AppError(explanation, 400);
        }
        throw new AppError('Cannot create a new user object', 500);
    }
}

async function signin(data) {
    try{
        const user = await userRepo.getUserByEmail(data.email);
        if(!user) {
            throw new AppError('No user found for the given email', 400);
        }
        const passwordMatch = await Auth.checkPassword(data.password, user.password);
        if(!passwordMatch) {
            throw new AppError('Invalid password', 400);
        }
        const jwt = Auth.createToken({id: user.id, email: user.email});
        return jwt;
    } catch(error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', 500);
    }
}

async function isAuthenticated(token) {
    try {
        if(!token) throw new AppError('Missing JWT Token', 400);
        const response = Auth.verifyToken(token);
        const user = await userRepo.get(response.id);
        if(!user) throw new AppError('No user found', 400);
        return user.id;
    } catch(error) {
        if(error instanceof AppError) throw error;
        if(error.name === 'JsonWebTokenError') {
            throw new AppError('Invalid JWT token', 400);
        }
        throw new AppError('Something went wrong', 500);
    }
}

module.exports = {
    create,
    signin,
    isAuthenticated,
}