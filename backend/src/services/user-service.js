const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const {UserRepository} = require('../repositories');

const userRepository = new UserRepository();

const createUser = async (data) => {
  
  const existingUser = await userRepository.findByEmail(data.email).catch(() => null);

  if (existingUser) {
    throw new AppError('Email already exists', StatusCodes.CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await userRepository.create({
    ...data,
    password: hashedPassword
  });

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const getAllUsers = async (filters) => {
  const users = await userRepository.getAllWithFilters(filters);
  return users;
};

const getUserById = async (id) => {
  const user = await userRepository.getUserWithStore(id);
   if (user.role === 'STORE_OWNER' && user.store) {
        const ratings = user.store.ratings;
        const avgRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;
    

        return {
            ...user,
            store: {
                ...user.store,
                averageRating: parseFloat(avgRating.toFixed(1)),
                ratings: undefined
            }
        };
    }
    return user;
};

const updatePassword = async (id, { currentPassword, newPassword }) => {
  const user = await userRepository.get(id);

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', StatusCodes.UNAUTHORIZED);
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  const updated = await userRepository.updatePassword(id, hashedNewPassword);
  return updated;

};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updatePassword
};