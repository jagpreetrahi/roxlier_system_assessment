const CrudRepository = require("./crud-repository")
const { PrismaConfig } = require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

class UserRepository extends CrudRepository {
    constructor() {
      super('user');
    }

  async findByEmail(email) {
    
    const user = await PrismaConfig.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AppError('No user found with this email', StatusCodes.NOT_FOUND);
    }

    return user;
  }

    async updatePassword(id, hashedPassword) {
      const user = await PrismaConfig.user.update({
            where: { id },
            data: { password: hashedPassword },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
            }
       });

      return user;
    }

  async getAllWithFilters({ name, email, address, role, sortBy, order }) {
        const user = await PrismaConfig.user.findMany({
         where: {
                name: name
                ? { contains: name, mode: 'insensitive' }
                : undefined,

                email: email
                ? { contains: email, mode: 'insensitive' }
                : undefined,

                address: address
                ? { contains: address, mode: 'insensitive' }
                : undefined,

                role: role ? role : undefined,
            },

            orderBy: sortBy
                ? { [sortBy]: order?.toLowerCase() || 'asc' }
                : { createdAt: 'desc' },
       

            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                createdAt: true,
            }
        });
        return user;
    }

    async getUserWithStore(id) {
       const user = await PrismaConfig.user.findUnique({
           where: { id },
           select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                store: {
                    select: {
                        id: true,
                        name: true,
                        ratings: {
                            select: {
                                rating: true
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
        throw new AppError('User not found', StatusCodes.NOT_FOUND);
        }

        return user;
    }
}

module.exports = UserRepository;