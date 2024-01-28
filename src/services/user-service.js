const { UserRepository } = require('../repositories');
const AppError =  require('../utils/errors/app-error');

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

module.exports = {
    create,
}