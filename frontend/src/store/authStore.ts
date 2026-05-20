import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthState = {
  token: string | null;

  user: User | null;

  setAuth: (
    token: string,
    user: User
  ) => void;

  logout: () => void;
};

export const useAuthStore =
  create<AuthState>((set) => ({
    token:
      localStorage.getItem(
        "kitchenflo_token"
      ),

    user: JSON.parse(
      localStorage.getItem(
        "kitchenflo_user"
      ) || "null"
    ),

    setAuth: (token, user) => {
      localStorage.setItem(
        "kitchenflo_token",
        token
      );

      localStorage.setItem(
        "kitchenflo_user",
        JSON.stringify(user)
      );

      set({
        token,
        user,
      });
    },

    logout: () => {
      localStorage.removeItem(
        "kitchenflo_token"
      );

      localStorage.removeItem(
        "kitchenflo_user"
      );

      localStorage.removeItem(
        "kitchenflo_restaurant_id"
      );

      set({
        token: null,
        user: null,
      });
    },
  }));