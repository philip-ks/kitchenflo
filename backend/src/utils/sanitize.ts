export const sanitizeUser = (
  user: any
) => {
  const {
    password,
    ...safeUser
  } = user;

  return safeUser;
};