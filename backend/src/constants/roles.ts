export const ROLES = {
  OWNER: "OWNER",
  MANAGER: "MANAGER",
  CASHIER: "CASHIER",
  CHEF: "CHEF",
  WAITER: "WAITER",
} as const;

export type Role = keyof typeof ROLES;