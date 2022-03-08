import { uuid } from "uuidv4";
import { UserType } from "./models";
import { Role } from "../constants";

export default class User {
  private userDb: any;

  constructor(userDb: any) {
    this.userDb = userDb;
  }

  async addUser(user: UserType & { password: string }): Promise<UserType> {
    const createdAt = new Date().toISOString();
    const userId = uuid();

    const existingUser = (Array.from(this.userDb.values()) as UserType[]).find(
      (value) => value.email === user.email
    );

    if (existingUser) {
      throw new Error("user already exist");
    }

    const { password, ...userWithoutPassword } = user;

    this.userDb.set(userId, {
      ...userWithoutPassword,
      passwordHash: "hash", // TODO:
      id: userId,
      createdAt,
      role: Role.User,
    });

    const { passwordHash, ...userProps } = this.userDb.get(userId) || {};
    return userProps;
  }

  async updateUser(userId: UserType["id"], user: UserType): Promise<UserType> {
    this.userDb.set(userId, { ...user });

    const { passwordHash, ...userProps } = this.userDb.get(userId) || {};
    return userProps;
  }

  async deleteUser(userId: UserType["id"]) {
    this.userDb.delete(userId);

    return null;
  }

  async getUsers(): Promise<UserType[]> {
    return Array.from(this.userDb, ([id, value]) => value).map(
      ({ passwordHash, ...userProps }) => userProps
    );
  }

  async getUserById(userId: UserType["id"]): Promise<UserType> {
    const { passwordHash, ...userProps } = this.userDb.get(userId) || {};
    return userProps;
  }

  async getUserByEmail(email: UserType["email"]): Promise<UserType> {
    const { passwordHash, ...userProps } =
      (Array.from(this.userDb.values()) as UserType[]).find(
        (value) => value.email === email
      ) || ({} as UserType);

    return userProps;
  }
}
