import {
  hashPassword,
  comparePassword,
} from "../../services/password.service";

import { generateToken } from "../../services/jwt.service";

const mockUsers: any[] = [];

const registerUser = async (
  data: any
) => {
  const hashedPassword =
    await hashPassword(data.password);

  const user = {
    id: Date.now().toString(),

    name: data.name,

    email: data.email,

    password: hashedPassword,

    role: data.role,
  };

  mockUsers.push(user);

  return {
    user,

    token: generateToken({
      id: user.id,
      role: user.role,
    }),
  };
};

const loginUser = async (
  email: string,
  password: string
) => {
  const user = mockUsers.find(
    (u) => u.email === email
  );

  if (!user) {
    throw new Error("User not found");
  }

  const validPassword =
    await comparePassword(
      password,
      user.password
    );

  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  return {
    user,

    token: generateToken({
      id: user.id,
      role: user.role,
    }),
  };
};

export {
  registerUser,
  loginUser,
};