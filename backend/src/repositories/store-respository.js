const CrudRepository = require('./crud-repository');
const { PrismaConfig } = require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

class StoreRepository extends CrudRepository {
   constructor() {
      super('store');
    }

   async getAllWithFilters({ name, address, sortBy, order }) {
     const stores = await PrismaConfig.store.findMany({
            where: {
                name: name
                ? { contains: name, mode: 'insensitive' }
                : undefined,

                address: address
                ? { contains: address, mode: 'insensitive' }
                : undefined,
            },

            orderBy: sortBy
                ? { [sortBy]: order?.toLowerCase() || 'asc' }
                : { createdAt: 'desc' },

            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                ratings: {
                   select: { rating: true }
                }
            }
       });
       return stores;
    }

    async getStoreWithAvgRating(storeId) {
        const store = await PrismaConfig.store.findUnique({
          where: { id: storeId },
          select: {
                id: true,
                name: true,
                email: true,
                address: true,
                ratings: {
                select: { rating: true }
                }
            }
       });
       if (!store) {
         throw new AppError('Store not found', StatusCodes.NOT_FOUND);
       }
      return store;
    }

   async getStoreWithUserRating(storeId, userId) {
       const store = await PrismaConfig.store.findUnique({
            where: { id: storeId },
            select: {
                id: true,
                name: true,
                address: true,
                ratings: {
                  select: { rating: true }
                },
                userRating: {
                    where: { userId },
                    select: {
                        id: true,
                        rating: true
                    }
                }
            }
        });

        if (!store) {
          throw new AppError('Store not found', StatusCodes.NOT_FOUND);
        }
       return store;
    }
}

module.exports = StoreRepository;