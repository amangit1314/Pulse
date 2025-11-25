import bcrypt from 'bcryptjs';
const SALT_ROUNDS = 12;
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
export const generateRandomCode = (length = 6) => {
    return Math.random()
        .toString(36)
        .substring(2, 2 + length)
        .toUpperCase();
};
