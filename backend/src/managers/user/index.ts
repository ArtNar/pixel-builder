import jwt from "jsonwebtoken";
import { UserType } from "../../db/models";
import { DbConnectionType } from "../../db/dbClient";
import { createSingleton } from "../../helpers/createSingleton";

const jwtSecret = process.env.JWT_SECRET || "";

// TODO: use redis for that
const authUsers: any = new Map();

export class UserManager {
  async register(user: UserType & { password: string }, db: DbConnectionType) {
    // TODO: validate the user

    const createdUser = await db.user.addUser(user);
    const token = jwt.sign(createdUser, jwtSecret);
    authUsers.set(token, createdUser);

    return {
      user: createdUser,
      token,
    };
  }

  async login(
    { email, password }: { email: UserType["email"]; password: string },
    db: DbConnectionType
  ) {
    const user = await db.user.getUserByEmail(email);

    // user hash === password hash ?

    if (!user) {
      return null;
    }

    const token = jwt.sign(user, jwtSecret);
    authUsers.set(token, user);

    return {
      user,
      token,
    };
  }

  isValidToken(token: string) {
    const user = authUsers.get(token);

    return user;
  }

  async getUsers(db: DbConnectionType) {
    return db.user.getUsers();
  }

  async getUser(userId: UserType["id"], db: DbConnectionType) {
    return db.user.getUserById(userId);
  }

  async getUserFromToken(token?: string) {
    const user = (token ? jwt.decode(token) : null) as UserType;

    return user;
  }
}

const USER_MANAGER_KEY = "USER_MANAGER";
export default () =>
  createSingleton(global, USER_MANAGER_KEY, () => new UserManager());
