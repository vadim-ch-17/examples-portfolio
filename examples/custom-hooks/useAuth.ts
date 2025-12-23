import { googleLogout } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { userService } from "@/services/userService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getUser, isAuthenticated, isLoading } from "@/store/selectors";
import { resetDashboard } from "@/store/slices/dashboardSlice";
import {
  logout as logoutAction,
  setAuthReady,
  setLoading,
  setUser,
} from "@/store/slices/userSlice";
import { UserInterface } from "@/types";

import api, { getCsrfToken } from "../services/api";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAppSelector(getUser);
  const isUserAuthenticated = useAppSelector(isAuthenticated);
  const loading = useAppSelector(isLoading);

  const isAdmin =
    !!user && (user.role === "admin" || user.role === "super_admin");
  const isSuperAdmin = !!user && user.role === "super_admin";

  const checkAuth = async () => {
    dispatch(setLoading(true));

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        dispatch(setUser(null));
        dispatch(setAuthReady(true));
        return;
      }

      await getCsrfToken();
      const response = await api.get("/user", { withCredentials: true });

      dispatch(setUser(response.data));
      dispatch(setAuthReady(true));
    } catch (error: any) {
      console.error("Error checking authentication:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("intendedPath");
        dispatch(setUser(null));
      }

      dispatch(setAuthReady(true));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const login = async (email: string, password: string) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    dispatch(setLoading(true));

    try {
      await queryClient.cancelQueries();
      queryClient.clear();
      // dispatch(resetNewNotes());
      dispatch(resetDashboard());

      await getCsrfToken();

      const response = await api.post("/login", { email, password, timezone });
      const { user, access_token, message } = response.data;

      if (access_token) {
        localStorage.setItem("token", access_token);

        dispatch(setUser(user));
        dispatch(setAuthReady(true));

        const { processPendingShare } = await import("@/utils/shareInvite");
        await processPendingShare();

        const intendedPath =
          localStorage.getItem("intendedPath") || "/journals";
        localStorage.removeItem("intendedPath");

        navigate(intendedPath, { replace: true });
      } else {
        // Email verification required
        localStorage.removeItem("token");
        dispatch(setUser(null));
        toast.error(message || "Please confirm your email first");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      localStorage.removeItem("token");
      dispatch(setUser(null));
      throw error.response?.data || new Error("Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };
  const register = async (
    name: string,
    email: string,
    password: string,
    notificationPreferencesEmail?: boolean,
    notificationPreferencesNewsletter?: boolean
  ) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    dispatch(setLoading(true));
    try {
      await queryClient.cancelQueries();
      queryClient.clear();
      await getCsrfToken();
      const response = await api.post("/register", {
        timezone,
        name,
        email,
        password,
        notification_preferences_email: notificationPreferencesEmail ?? true,
        newsletter: notificationPreferencesNewsletter ?? false,
      });
      const { user, access_token, message } = response.data;

      if (access_token) {
        localStorage.setItem("token", access_token);
        dispatch(setUser(user));
        dispatch(setAuthReady(true));
        const { processPendingShare } = await import("@/utils/shareInvite");
        await processPendingShare();
        navigate("/journals", { replace: true });
      } else {
        toast.info(message || "Please verify your email address to log in");
        navigate("/login", { replace: true });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error.response?.data || new Error("Registration failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    dispatch(setLoading(true));

    try {
      if (user?.social_provider === "google") {
        googleLogout();
      }
      await queryClient.cancelQueries();
      queryClient.clear();

      localStorage.removeItem("token");
      localStorage.removeItem("intendedPath");

      dispatch(setUser(null));
      dispatch(logoutAction());
      dispatch(resetDashboard());
      dispatch(setAuthReady(false));
      console.log("User logged out successfully.");
      try {
        userService
          .logoutWeb()
          .then(() => {
            console.log("API logout successful.");
            navigate("/login", { replace: true });
          })
          .catch((apiError) => {
            console.warn("API logout failed (non-critical):", apiError);
          });
      } catch (apiError) {
        console.warn("API logout failed (non-critical):", apiError);
      }
    } catch (error) {
      console.error("Error during logout:", error);

      navigate("/login", { replace: true });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateUser = async (data: Partial<UserInterface>) => {
    dispatch(setLoading(true));
    try {
      const response = await api.put("/user", data);
      dispatch(setUser(response.data));
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    user,
    loading,
    isUserAuthenticated,
    isAdmin,
    isSuperAdmin,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
    setUser: (userData: UserInterface | null) => dispatch(setUser(userData)),
  };
};
