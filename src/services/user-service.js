const { UserRepository, RoleRepository } = require('../repositories');
const AppError =  require('../utils/errors/app-error');
const { Auth, Enums } = require('../utils/common')


const userRepo = new UserRepository();
const roleRepo = new RoleRepository();

async function create(data) {
    try{
        const user = await userRepo.create(data);
        const role = await roleRepo.getRoleByName(Enums.USER_ROLES_ENUMS.CUSTOMER);
        user.addRole(role);
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
        if(error.name === 'TokenExpiredError') {
            throw new AppError('JWT token expired', 400);
        }
        throw new AppError('Something went wrong', 500);
    }
}

async function addRoleToUser(data) {
    try {
        const user = await userRepo.get(data.id);
        if(!user) throw new AppError('No user found for given name', 400);
        const role = await roleRepo.getRoleByName(data.role);
        if(!role) throw new AppError('No role found for given name', 400);
        user.addRole(role);
        return user;
    } catch(error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', 500);
    }
}

async function isAdmin(id) {
    try {
        const user = await userRepo.get(id);
        if(!user) throw new AppError('No user found for given name', 400);
        const adminRole = await roleRepo.getRoleByName(Enums.USER_ROLES_ENUMS.ADMIN);
        if(!adminRole) throw new AppError('No role found for given name', 400);
        return user.hasRole(adminRole);
    } catch(error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', 500);
    }
}

module.exports = {
    create,
    signin,
    isAuthenticated,
    addRoleToUser,
    isAdmin
}