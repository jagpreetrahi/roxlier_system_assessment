const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { PrismaConfig } = require('../config');  

class CrudRepository {
  constructor(modelName) {
    this.model = PrismaConfig[modelName];  // PrismaConfig = prisma Instance
  }

  async create(data) {
    const response = await this.model.create({ data });
    return response;
  }

  async destroy(id) {
    const response = await this.model.delete({
      where: { id }
    });
    if (!response) {
      throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async get(id) {
    const response = await this.model.findUnique({
      where: { id }
    });
    if (!response) {
      throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async getAll() {
    const response = await this.model.findMany();
    return response;
  }

  async update(id, data) {
    const response = await this.model.update({
      where: { id },
      data
    });
    return response;
  }
}

module.exports = CrudRepository;