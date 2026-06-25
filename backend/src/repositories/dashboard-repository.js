const { PrismaConfig } = require('../config');

class DashboardRepository {

  async getAdminStats() {
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            PrismaConfig.user.count(),
            PrismaConfig.store.count(),
            PrismaConfig.rating.count(),
        ]);

        return {
            totalUsers,
            totalStores,
            totalRatings
        };
    }
}

module.exports = DashboardRepository;