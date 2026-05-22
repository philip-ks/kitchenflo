import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useMsal } from "@azure/msal-react";

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  ChefHat,
  BarChart3,
  Package,
  Utensils,
  LogIn,
} from "lucide-react";

import { api } from "../../services/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const { instance } = useMsal();

  const [email, setEmail] = useState("philip2@test.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const saveSession = (token: string, user: any) => {
    localStorage.setItem("kitchenflo_token", token);
    localStorage.setItem("kitchenflo_user", JSON.stringify(user));
    localStorage.setItem("kitchenflo_restaurant_id", user.restaurantId);

    navigate("/dashboard");
  };

  useEffect(() => {
    const completeMicrosoftLogin = async () => {
      try {
        const result = await instance.handleRedirectPromise();

        if (!result?.idToken) {
          return;
        }

        setLoading(true);
        setError("");

        const response = await api.post("/auth/microsoft", {
          credential: result.idToken,
        });

        const token = response.data.data.token;
        const user = response.data.data.user;

        saveSession(token, user);
      } catch (err: any) {
        console.error("Microsoft redirect login error:", err);

        setError(
          err?.response?.data?.message ||
            err?.errorMessage ||
            err?.message ||
            "Microsoft login failed."
        );
      } finally {
        setLoading(false);
      }
    };

    completeMicrosoftLogin();
  }, [instance]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!email.trim()) {
        setError("Email is required.");
        return;
      }

      if (!password.trim()) {
        setError("Password is required.");
        return;
      }

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const token = response.data.data.token;
      const user = response.data.data.user;

      saveSession(token, user);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credential?: string) => {
    try {
      setLoading(true);
      setError("");

      if (!credential) {
        setError("Google login failed. No credential received.");
        return;
      }

      const response = await api.post("/auth/google", {
        credential,
      });

      const token = response.data.data.token;
      const user = response.data.data.user;

      saveSession(token, user);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Google login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      setError("");

      await instance.loginRedirect({
        scopes: ["openid", "profile", "email"],
        prompt: "select_account",
      });
    } catch (err: any) {
      console.error("Microsoft login error:", err);

      setError(
        err?.errorMessage ||
          err?.message ||
          "Microsoft login failed."
      );
    }
  };

  const useDemoLogin = () => {
    setEmail("philip2@test.com");
    setPassword("123456");
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="relative hidden overflow-hidden lg:flex flex-col justify-between p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute bottom-16 right-10 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950">
                <ChefHat size={26} />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  KitchenFlo
                </h1>

                <p className="text-sm text-slate-400">
                  Restaurant Operations Platform
                </p>
              </div>
            </div>

            <div className="mt-20 max-w-xl">
              <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                POS • KDS • Inventory • Recipes • Analytics
              </p>

              <h2 className="text-5xl font-bold leading-tight">
                Run your restaurant from order to insight.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                KitchenFlo connects billing, kitchen operations, inventory
                deduction, recipe costing, procurement intelligence, and
                analytics into one restaurant OS.
              </p>
            </div>

            <div className="mt-12 grid max-w-xl grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <Utensils className="mb-4 text-emerald-300" />

                <h3 className="font-semibold">
                  Fast POS
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  QSR, takeaway, dine-in, and delivery-ready order flow.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <Package className="mb-4 text-emerald-300" />

                <h3 className="font-semibold">
                  Inventory Intelligence
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Recipe-based stock deduction and low-stock visibility.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <BarChart3 className="mb-4 text-emerald-300" />

                <h3 className="font-semibold">
                  Profit Analytics
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Food cost, margin, consumption, and procurement insights.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <ShieldCheck className="mb-4 text-emerald-300" />

                <h3 className="font-semibold">
                  Secure Access
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  JWT authentication with restaurant-specific data access.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-sm text-slate-500">
            © {new Date().getFullYear()} KitchenFlo. Built for modern
            restaurants.
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-100 px-5 py-10 text-slate-900">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <ChefHat size={28} />
              </div>

              <h1 className="text-3xl font-bold">
                KitchenFlo
              </h1>

              <p className="mt-2 text-slate-500">
                Restaurant Operations Platform
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="mb-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Welcome back
                </p>

                <h2 className="text-3xl font-bold text-slate-900">
                  Sign in to KitchenFlo
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Access your restaurant dashboard, POS, kitchen, inventory,
                  and analytics.
                </p>
              </div>

              <div className="mb-5">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    handleGoogleLogin(credentialResponse.credential);
                  }}
                  onError={() => {
                    setError("Google login failed.");
                  }}
                  width="100%"
                  text="continue_with"
                  shape="rectangular"
                />

                <button
                  type="button"
                  onClick={handleMicrosoftLogin}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <LogIn size={18} />
                  Continue with Microsoft
                </button>
              </div>

              <div className="mb-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-semibold text-slate-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      className="w-full rounded-xl border border-slate-300 px-11 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="owner@restaurant.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      className="w-full rounded-xl border border-slate-300 px-11 py-3 pr-12 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  disabled={loading}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Demo Credentials
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Use this for local testing and development.
                    </p>

                    <p className="mt-3 text-xs text-slate-600">
                      Email:{" "}
                      <span className="font-semibold">
                        philip2@test.com
                      </span>
                    </p>

                    <p className="text-xs text-slate-600">
                      Password:{" "}
                      <span className="font-semibold">
                        123456
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={useDemoLogin}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold hover:bg-white"
                  >
                    Use
                  </button>
                </div>
              </div>

              <p className="mt-6 text-center text-xs text-slate-400">
                Secure restaurant access powered by KitchenFlo.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}