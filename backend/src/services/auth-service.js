const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const {UserRepository} = require('../repositories');


const userRepository = new UserRepository();

const register = async (data) => {
   const existingUser = await userRepository.findByEmail(data.email).catch(() => null);
    if (existingUser) {
      throw new AppError('Email already registered', StatusCodes.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await userRepository.create({
        ...data,
        password: hashedPassword,
        role: 'USER'
    });
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
};

const login = async ({ email, password }) => {
  
    const user = await userRepository.findByEmail(email);

    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
    }

    const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return {
        token,
        role: user.role
    };
};

module.exports = { register, login };