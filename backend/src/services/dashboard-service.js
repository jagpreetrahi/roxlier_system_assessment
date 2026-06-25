
const { RatingRepository } = require('../repositories');
const { DashBoardRepostiory } = require('../repositories');

const dashboardRepository = new DashBoardRepostiory();
const ratingRepository = new RatingRepository();

const getAdminStats = async () => {
  const stats = await dashboardRepository.getAdminStats();
  return stats;
};

const getStoreOwnerStats = async (userId) => {
   const { PrismaConfig } = require('../config');

    const store = await PrismaConfig.store.findUnique({
      where: { ownerId: userId }
    });

    if (!store) {
        throw new AppError('No store found for this owner', StatusCodes.NOT_FOUND);
    }

  
    const [avgData, raters] = await Promise.all([
        ratingRepository.getAverageRating(store.id),
        ratingRepository.getStoreRatingsWithUsers(store.id)
    
    ]);

    return {
        storeId: store.id,
        storeName: store.name,
        averageRating: avgData.average,
        totalRatings: avgData.totalRatings,
        raters
    };
};

module.exports = { getAdminStats, getStoreOwnerStats };