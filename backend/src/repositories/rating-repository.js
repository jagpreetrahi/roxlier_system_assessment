const CrudRepository = require('./crud-repository');
const { PrismaConfig } = require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

class RatingRepository extends CrudRepository {
  constructor() {
    super('rating');
  }

  async findByUserAndStore(userId, storeId) {
        const rating = await PrismaConfig.rating.findUnique({
            where: {
                userId_storeId: { userId, storeId }
            }
        });

       return rating; 
    }

   async updateByUserAndStore(userId, storeId, rating) {
        const updated = await PrismaConfig.rating.update({
            where: {
                userId_storeId: { userId, storeId }
            },
            data: { rating }
        });

       return updated;
    }

    async getStoreRatingsWithUsers(storeId) {
        const ratings = await PrismaConfig.rating.findMany({
            where: { storeId },
            select: {
                id: true,
                rating: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
           },
           orderBy: { createdAt: 'desc' }
        
        });
        return ratings;
    }

    async getAverageRating(storeId) {
        const result = await PrismaConfig.rating.aggregate({
        where: { storeId },
        _avg: { rating: true },
        _count: { rating: true }
        
        });

        return {
        average: result._avg.rating || 0,
        totalRatings: result._count.rating
        };
    }
}

module.exports = RatingRepository;