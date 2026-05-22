import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../../services/api";

export default function GitHubCallbackPage() {
  const navigate = useNavigate();

  const [message, setMessage] = useState(
    "Completing GitHub login..."
  );

  useEffect(() => {
    const completeGitHubLogin = async () => {
      try {
        const params = new URLSearchParams(
          window.location.search
        );

        const code = params.get("code");

        if (!code) {
          setMessage(
            "GitHub login failed. Code missing."
          );
          return;
        }

        const response = await api.post(
          "/auth/github",
          {
            code,
          }
        );

        const token = response.data.data.token;
        const user = response.data.data.user;

        localStorage.setItem(
          "kitchenflo_token",
          token
        );

        localStorage.setItem(
          "kitchenflo_user",
          JSON.stringify(user)
        );

        localStorage.setItem(
          "kitchenflo_restaurant_id",
          user.restaurantId
        );

        navigate("/dashboard");
      } catch (error: any) {
        console.error(
          "GitHub login error:",
          error
        );

        setMessage(
          error?.response?.data?.message ||
            "GitHub login failed."
        );
      }
    };

    completeGitHubLogin();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="rounded-3xl bg-white p-8 shadow-xl border text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white text-2xl font-bold">
          GH
        </div>

        <h1 className="text-2xl font-bold text-slate-900">
          GitHub Login
        </h1>

        <p className="mt-3 text-slate-500">
          {message}
        </p>
      </div>
    </div>
  );
}