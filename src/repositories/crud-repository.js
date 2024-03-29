const AppError = require('../utils/errors/app-error');
const  { logger } = require('../config');

class CrudRepository{
    constructor(model){
        this.model = model;
    }

    async create(data) {
        console.log(JSON.stringify(data), 'sdkjfksdf');
        const response = await this.model.create(data);
        return response;
    }

    async destroy(data) {
        const response = await this.model.destroy({
            where: {
                id: data
            }
        });
        if(!response) {
            throw new AppError('Cannot delete resource as not found', 404);
        }
        return response;
    }

    async get(data) {
        const response = await this.model.findByPk(data);
        if(!response) {
            throw new AppError('Cannot find resource', 404);
        }
        return response;
    }

    async getAll() {
        const response = await this.model.findAll();
        return response;
    }

    async update(id, data) {
        const response = await this.model.update(data, {
            where: {
                id: id
            }
        });
        return response;
    }
}

module.exports = CrudRepository;
