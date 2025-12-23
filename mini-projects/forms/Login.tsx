import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import zod from "zod";

import {
  Button,
  ErrorMessage,
  PasswordInput,
  SocialLogin,
  TextInput,
} from "@/components";
import { getErrorsResponse } from "@/helpers";
import { useDialog } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { hideLoader, showLoader } from "@/store/slices/loaderSlice";

const schema = zod.object({
  email: zod
    .string()
    .email({ message: "No a valid email address. Should be your@email.com" }),
  password: zod
    .string()
    .min(6, {
      message: "Password must be at least 6 characters long",
    })
    .max(100)
    .nonempty(),
});

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { login, isUserAuthenticated } = useAuth();
  const { openDialog } = useDialog();
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  if (isUserAuthenticated) {
    return <Navigate to="/journals" replace />;
  }
  const onSubmit = async (data: any) => {
    try {
      dispatch(showLoader());
      await login(data.email.toLowerCase(), data.password);
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        (error as Error)?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      setErrorMessage(
        getErrorsResponse(error).length > 0
          ? getErrorsResponse(error).join(", ")
          : errorMessage
      );
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center pb-12 pt-4 md:pt-12 sm:px-6 lg:px-8">
      <div className="container">
        <div className=" relative mx-auto bg-white rounded-[30px] shadow-2xl  md:max-w-[770px] w-full px-6 py-[56px]">
          <div className="login-modal-content">
            <h2 className="text-30-100 text-brand-secondary-900 mb-3 text-center">
              Welcome back!
            </h2>
            <SocialLogin buttonText="log in with" />
            <p className="mb-[22px] text-center text-16-100 text-brand-secondary-900">
              or
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
              className="flex flex-col max-w-[505px] mx-auto mb-5">
              <TextInput
                label="Email*"
                error={errors.email?.message}
                registration={register("email")}
                id="email"
                placeholder="Your Email"
              />
              <PasswordInput
                label="Password*"
                error={errors.password?.message}
                registration={register("password")}
                id="password"
                placeholder="Your Password"
              />
              <Button
                type="submit"
                variant="gold"
                className="w-full cursor-pointer text-brand-secondary-900 text-18-100">
                Log in
              </Button>
            </form>
            <p className="text-center max-w-[323px] mx-auto text-16-100 text-brand-secondary-900 mb-5">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="register close text-brand-primary-500 hover:text-brand-primary-600 cursor-pointer transition-all duration-300">
                Create an account
              </button>
            </p>
            <button
              onClick={() => {
                openDialog({
                  component: () =>
                    import("@/components/modals/ResetPasswordModal"),
                  props: {},
                });
              }}
              className="flex cursor-pointer max-w-[323px] mx-auto justify-center text-brand-primary-500 hover:text-brand-primary-600 transition-all duration-300">
              Reset your password
            </button>
          </div>
          {errorMessage && (
            <ErrorMessage
              error={errorMessage}
              className="text-center justify-center"
            />
          )}
        </div>
      </div>
    </div>
  );
};
