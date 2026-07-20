import User from "../model/user.js";
import { Op } from "sequelize";

const userService = {
  /**
   * Create a new user in SQL Database
   * @param {Object} userData 
   * @returns {Promise<User>}
   */
  async createUserForMysql(userData) {
    try {
      return await User.create(userData);
    } catch (error) {
      throw new Error("Error creating user: " + error.message);
    }
  },

  /**
   * Find a user by email or username
   * @param {String} loginIdentifier 
   * @returns {Promise<User|null>}
   */
  async findUserForMysql(loginIdentifier) {
    try {
      return await User.findOne({
        where: {
          [Op.or]: [
            { email: loginIdentifier },
            { username: loginIdentifier },
          ],
        },
      });
    } catch (error) {
      throw new Error("Error finding user: " + error.message);
    }
  },

  /**
   * Check if users with the same email or username already exist
   * @param {String} email 
   * @param {String} username 
   * @returns {Promise<User[]>}
   */
  async findUsersByEmailOrUsername(email, username) {
    try {
      const orConditions = [{ email }];
      if (username) {
        orConditions.push({ username });
      }
      return await User.findAll({
        where: {
          [Op.or]: orConditions,
        },
      });
    } catch (error) {
      throw new Error("Error checking duplicate users: " + error.message);
    }
  },
};

export default userService;
