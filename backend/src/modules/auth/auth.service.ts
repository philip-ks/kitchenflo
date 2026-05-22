import prisma from "../../lib/prisma";

import {
  hashPassword,
  comparePassword,
} from "../../services/password.service";

import { generateToken } from "../../services/jwt.service";

import { sanitizeUser } from "../../utils/sanitize";

import { OAuth2Client } from "google-auth-library";

import jwt from "jsonwebtoken";

import jwksClient from "jwks-rsa";

import axios from "axios";

const registerUser = async (data: any) => {
  const existingUser =
    await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword =
    await hashPassword(data.password);

  const restaurant =
    await prisma.restaurant.create({
      data: {
        name: `${data.name}'s Restaurant`,
        email: data.email,
      },
    });

  const user =
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        restaurantId: restaurant.id,
      },
    });

  return {
    success: true,
    user: sanitizeUser(user),
    restaurant,
    token: generateToken({
      id: user.id,
      role: user.role,
      restaurantId: restaurant.id,
    }),
  };
};

const loginUser = async (
  email: string,
  password: string
) => {
  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

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
    success: true,
    user: sanitizeUser(user),
    token: generateToken({
      id: user.id,
      role: user.role,
      restaurantId: user.restaurantId,
    }),
  };
};

const findOrCreateOAuthUser = async (
  email: string,
  name: string
) => {
  let user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  let restaurant = null;

  if (!user) {
    const randomPassword =
      await hashPassword(
        `oauth_${Date.now()}_${email}`
      );

    restaurant =
      await prisma.restaurant.create({
        data: {
          name: `${name}'s Restaurant`,
          email,
        },
      });

    user =
      await prisma.user.create({
        data: {
          name,
          email,
          password: randomPassword,
          role: "OWNER",
          restaurantId: restaurant.id,
        },
      });
  }

  return {
    user,
    restaurant,
  };
};

const loginWithGoogle = async (
  credential: string
) => {
  const googleClientId =
    process.env.GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    throw new Error(
      "Google Client ID is not configured"
    );
  }

  const googleClient =
    new OAuth2Client(googleClientId);

  const ticket =
    await googleClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new Error(
      "Google account email not found"
    );
  }

  const email =
    payload.email.toLowerCase();

  const name =
    payload.name ||
    email.split("@")[0];

  const {
    user,
    restaurant,
  } = await findOrCreateOAuthUser(
    email,
    name
  );

  return {
    success: true,
    user: sanitizeUser(user),
    restaurant,
    token: generateToken({
      id: user.id,
      role: user.role,
      restaurantId: user.restaurantId,
    }),
  };
};

const verifyMicrosoftToken = async (
  idToken: string
): Promise<any> => {
  const microsoftClientId =
    process.env.MICROSOFT_CLIENT_ID;

  const microsoftTenantId =
    process.env.MICROSOFT_TENANT_ID || "common";

  if (!microsoftClientId) {
    throw new Error(
      "Microsoft Client ID is not configured"
    );
  }

  const decodedHeader: any =
    jwt.decode(idToken, {
      complete: true,
    });

  if (!decodedHeader?.header?.kid) {
    throw new Error(
      "Invalid Microsoft token header"
    );
  }

  const client =
    jwksClient({
      jwksUri: `https://login.microsoftonline.com/${microsoftTenantId}/discovery/v2.0/keys`,
    });

  const key =
    await client.getSigningKey(
      decodedHeader.header.kid
    );

  const signingKey =
    key.getPublicKey();

  return jwt.verify(
    idToken,
    signingKey,
    {
      algorithms: ["RS256"],
      audience: microsoftClientId,
    }
  );
};

const loginWithMicrosoft = async (
  credential: string
) => {
  const payload =
    await verifyMicrosoftToken(
      credential
    );

  const email =
    (
      payload.preferred_username ||
      payload.email ||
      payload.upn
    )?.toLowerCase();

  if (!email) {
    throw new Error(
      "Microsoft account email not found"
    );
  }

  const name =
    payload.name ||
    email.split("@")[0];

  const {
    user,
    restaurant,
  } = await findOrCreateOAuthUser(
    email,
    name
  );

  return {
    success: true,
    user: sanitizeUser(user),
    restaurant,
    token: generateToken({
      id: user.id,
      role: user.role,
      restaurantId: user.restaurantId,
    }),
  };
};

const loginWithGitHub = async (
  code: string
) => {
  const githubClientId =
    process.env.GITHUB_CLIENT_ID;

  const githubClientSecret =
    process.env.GITHUB_CLIENT_SECRET;

  const githubRedirectUri =
    process.env.GITHUB_REDIRECT_URI;

  if (
    !githubClientId ||
    !githubClientSecret ||
    !githubRedirectUri
  ) {
    throw new Error(
      "GitHub OAuth is not configured"
    );
  }

  const tokenResponse =
    await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: githubClientId,
        client_secret: githubClientSecret,
        code,
        redirect_uri: githubRedirectUri,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

  const accessToken =
    tokenResponse.data.access_token;

  if (!accessToken) {
    throw new Error(
      tokenResponse.data.error_description ||
        "GitHub access token not received"
    );
  }

  const userResponse =
    await axios.get(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

  const emailsResponse =
    await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

  const emails =
    Array.isArray(emailsResponse.data)
      ? emailsResponse.data
      : [];

  const primaryEmail =
    emails.find(
      (email: any) =>
        email.primary && email.verified
    ) ||
    emails.find(
      (email: any) =>
        email.verified
    );

  const email =
    primaryEmail?.email?.toLowerCase();

  if (!email) {
    throw new Error(
      "Verified GitHub email not found"
    );
  }

  const name =
    userResponse.data.name ||
    userResponse.data.login ||
    email.split("@")[0];

  const {
    user,
    restaurant,
  } = await findOrCreateOAuthUser(
    email,
    name
  );

  return {
    success: true,
    user: sanitizeUser(user),
    restaurant,
    token: generateToken({
      id: user.id,
      role: user.role,
      restaurantId: user.restaurantId,
    }),
  };
};

export {
  registerUser,
  loginUser,
  loginWithGoogle,
  loginWithMicrosoft,
  loginWithGitHub,
};