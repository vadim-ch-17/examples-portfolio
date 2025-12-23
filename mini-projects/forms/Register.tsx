import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import zod from "zod";

import {
  Button,
  DefaultLoader,
  ErrorMessage,
  PasswordInput,
  PrivacyCheckbox,
  SocialLogin,
  TextInput,
  ThemedCheckBox,
} from "@/components";
import { TOAST_MESSAGES } from "@/constants";
import { getErrorsResponse } from "@/helpers";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services";
import { useAppDispatch } from "@/store/hooks";
import { hideLoader, showLoader } from "@/store/slices/loaderSlice";
import { PayloadUserRegister } from "@/types";

const schema = zod.object({
  name: zod
    .string()
    .min(2, { message: "Name must contain at least two letters" })
    .max(100)
    .nonempty(),
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
  privacy: zod.boolean().refine((val) => val === true, {
    message: "You must agree to the Privacy Policy",
  }),
  notificationPreferencesEmail: zod.boolean().optional(),
  notificationPreferencesNewsletter: zod.boolean().optional(),
});

export const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { register: registerUser, isUserAuthenticated, loading } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const isAuthenticated = isUserAuthenticated;
  const queryClient = useQueryClient();

  const { mutate: updateNotifications } = useMutation({
    mutationFn: (data: any) => userService.updateNotifications(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
    },
  });

  const { mutate: registerMutation } = useMutation({
    mutationFn: (data: PayloadUserRegister) =>
      registerUser(
        data.name,
        data.email,
        data.password,
        data.notificationPreferencesEmail,
        data.notificationPreferencesNewsletter
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
      updateNotifications({
        notification_preferences: {
          email: variables.notificationPreferencesEmail ?? true,
          push: false,
          activity: true,
          time: "09:00",
          newsletter: variables.notificationPreferencesNewsletter ?? false,
        },
      });
      toast.success(TOAST_MESSAGES.registerSuccess.text);
      navigate("/journals");
    },
    onError: (error: any) => {
      const errorMessage =
        (error as Error)?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
      const errorsArray = getErrorsResponse(error);
      setErrorMessage(
        errorsArray.length > 0 ? errorsArray.join(", ") : errorMessage
      );
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    clearErrors,

    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      privacy: false,
      notificationPreferencesEmail: true,
      notificationPreferencesNewsletter: true,
      name: "",
      email: "",
    },
    resolver: zodResolver(schema),
  });
  const privacy = watch("privacy");

  if (isAuthenticated) {
    return <Navigate to="/journals" replace />;
  }
  const onSubmit = async (data: any) => {
    if (!data.privacy) {
      toast.error(TOAST_MESSAGES.privacyPolicyError.text);
      setError("privacy", {
        type: "manual",
        message: "You must agree to the Privacy Policy",
      });
      return;
    } else {
      clearErrors("privacy");
    }
    try {
      dispatch(showLoader());
      await registerMutation({
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password,
        notificationPreferencesEmail: data.notificationPreferencesEmail,
        notificationPreferencesNewsletter:
          data.notificationPreferencesNewsletter,
      });
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        (error as Error)?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
      const errorsArray = getErrorsResponse(error);
      setErrorMessage(
        errorsArray.length > 0 ? errorsArray.join(", ") : errorMessage
      );
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center pb-12 pt-4 md:pt-12 sm:px-6 lg:px-8">
      <div className="container">
        <div
          className={classNames(
            "dialog relative  mx-auto max-w-[770px] w-full px-6 py-[56px]",
            {
              "bg-white shadow-2xl rounded-[30px]": !loading,
            }
          )}>
          <DefaultLoader loading={loading} />
          <div
            className={classNames("login-modal-content", {
              "opacity-50 blur-2xl": loading,
            })}>
            <h2 className="text-30-100 text-brand-secondary-900 mb-3 text-center">
              Start your journal today!
            </h2>
            <SocialLogin buttonText="register with" />
            <p className="mb-[22px] text-center text-16-100 text-brand-secondary-900">
              or
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // e.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
              className="flex flex-col  max-w-[505px] mx-auto mb-5">
              <TextInput
                label="Name*"
                registration={register("name", { required: true })}
                placeholder="Your Name"
                error={errors.name?.message}
              />

              <TextInput
                label="Email*"
                registration={register("email", {
                  required: true,
                })}
                placeholder="Your Email"
                error={errors.email?.message}
              />

              <PasswordInput
                label="Password*"
                registration={register("password", { required: true })}
                placeholder="Your Password"
                error={errors.password?.message}
              />

              {/*<PasswordInput*/}
              {/*  label="Confirm Password*"*/}
              {/*  registration={register('password_confirmation', { required: true })}*/}
              {/*  placeholder="Confirm Password"*/}
              {/*  error={errors.password_confirmation?.message}*/}
              {/*/>*/}

              <div className={classNames("flex flex-col items-start mb-2")}>
                <div className="flex flex-row items-center">
                  <ThemedCheckBox
                    checked={watch("notificationPreferencesEmail") ?? true}
                    onChange={(
                      checkedOrEvent:
                        | boolean
                        | React.ChangeEvent<HTMLInputElement>
                    ) => {
                      const checked =
                        typeof checkedOrEvent === "boolean"
                          ? checkedOrEvent
                          : checkedOrEvent.target.checked;
                      setValue("notificationPreferencesEmail", checked);
                    }}
                  />
                  <label className="pl-2 text-brand-secondary-900 text-16-20 font-[300] cursor-pointer">
                    I agree to receive daily reminder emails from Hodu.
                  </label>
                </div>
              </div>
              <div className={classNames("flex flex-col items-start mb-2")}>
                <div className="flex flex-row items-center">
                  <ThemedCheckBox
                    checked={watch("notificationPreferencesNewsletter") ?? true}
                    onChange={(
                      checkedOrEvent:
                        | boolean
                        | React.ChangeEvent<HTMLInputElement>
                    ) => {
                      const checked =
                        typeof checkedOrEvent === "boolean"
                          ? checkedOrEvent
                          : checkedOrEvent.target.checked;
                      setValue("notificationPreferencesNewsletter", checked);
                    }}
                  />
                  <label className="pl-2 text-brand-secondary-900 text-16-20 font-[300] cursor-pointer">
                    Subscribe to our newsletter for tips, updates, and exclusive
                    content.
                  </label>
                </div>
              </div>
              <PrivacyCheckbox
                checked={privacy}
                className=""
                onChange={(checkedOrEvent) => {
                  const checked =
                    typeof checkedOrEvent === "boolean"
                      ? checkedOrEvent
                      : (checkedOrEvent.target as HTMLInputElement).checked;
                  setValue("privacy", checked);
                  if (checked) clearErrors("privacy");
                  else
                    setError("privacy", {
                      type: "manual",
                      message: "You must agree to the Privacy Policy",
                    });
                }}
                error={errors.privacy?.message}
              />

              <Button
                type="submit"
                variant="gold"
                className=" w-full text-brand-secondary-900 text-18-100">
                Sign up
              </Button>
            </form>
            <p className="text-center max-w-[323px] mx-auto text-16-100 text-secondary-5 mb-5 text-brand-secondary-900">
              You already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className=" close text-brand-primary-500 hover:text-brand-primary-600 transition-all duration-300 cursor-pointer ">
                Log in
              </button>
            </p>
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
