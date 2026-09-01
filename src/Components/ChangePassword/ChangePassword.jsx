import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });

  function handleChangePassword(values) {
    const passwordData = {
      password: values.password,
      newPassword: values.newPassword,
    };

    // سيتم إرسال هذا الـ object إلى API function

    reset();
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <section className="mx-auto max-w-lg rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FaLock className="text-2xl" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your current password and choose a new one.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Current password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter current password"
                className={`text-black w-full rounded-lg border px-4 py-3 pr-11 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                {...register("password", {
                  required: "Current password is required",
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label="Toggle current password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              New password
            </label>

            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                className={`text-black w-full rounded-lg border px-4 py-3 pr-11 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  validate: (value) =>
                    value !== "" || "New password is required",
                })}
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((previous) => !previous)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label="Toggle new password visibility"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Changing..." : "Change password"}
          </button>
        </form>
      </section>
    </main>
  );
}
