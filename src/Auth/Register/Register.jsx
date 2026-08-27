import { Alert, Button, Input, Label, ListBox, Select } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEyeSlash, FaRegEye, FaSpinner } from "react-icons/fa";
import z, { email } from "zod";
import ErrorMessage from "../../Components/ErrorMessage/ErrorMessage";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  //validation
  const schema = z
    .object({
      name: z
        .string()
        .min(3, "name must be at least 3 charcters")
        .max(15, "name must be at most 15 charcters"),
      username: z
        .string()
        .min(3, "username must be at least 3 charcter")
        .max(15, "username must be at most 15 charcter"),
      email: z.string().email("invalid mail"),
      dateOfBirth: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .refine((date) => {
          const userdate = new Date(date);
          const newDate = new Date();
          newDate.setHours(0, 0, 0, 0);

          return userdate < newDate;
        }, "can't enter future date"),
      gender: z.enum(["male", "female"], "gender must be select"),
      password: z.string(),
      rePassword: z.string(),
    })
    .refine((obj) => obj.password === obj.rePassword, {
      error: "password must be match with repassword",
      path: ["rePassword"],
    });

  //collect values
  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(schema),
    mode: "all",
  });


  let { register, handleSubmit, formState, watch } = form;

  const passwordValue = watch("password");

  async function handleRegister(obj) {

    try {
      setIsLoading(true);
      let { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signup",
        obj,
      );
      Swal.fire({
        title: "Successfully!",
        text: data.message,
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          setIsLoading(false);
          navigate("/login");
        }
      });
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "ok",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const feilds = [
    { name: "name", type: "text", placeholder: "Enter Your Name" },
    { name: "username", type: "text", placeholder: "Enter Your UserName" },
    { name: "email", type: "email", placeholder: "Enter Your Email" },
  ];

  return (
    <>
      <div className="bg-gray-200 p-6  ">
        <div className="bg-white p-3 text-center lg:w-1/2 m-auto rounded-2xl">
          <h2 className="text-2xl font-bold text-sky-200">Register</h2>

          <form onSubmit={handleSubmit(handleRegister)}>
            {feilds.map((input) => (
              <div key={input.name}>
                <Input
                  {...register(input.name)}
                  type={input.type}
                  className="w-full mt-4"
                  placeholder={input.placeholder}
                />
                <ErrorMessage errorMessage={formState.errors[input.name]} />
              </div>
            ))}
            <div className="flex gap-5">
              <Input
                {...register("dateOfBirth")}
                min={"1990-10-10"}
                max={"2026-08-03"}
                type="date"
                aria-label="date"
                className="w-1/2 mt-4"
                placeholder="Enter your Date Of Birth"
              />
              ;
              <ErrorMessage errorMessage={formState.errors.dataOfBirth} />
              <select
                {...register("gender")}
                defaultValue="Pick a color"
                className="select mt-4 w-full rounded-2xl text-black bg-white hover:bg-gray-50 transition-all"
              >
                <option disabled={true}>Pick a gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <ErrorMessage errorMessage={formState.errors.gender} />
            </div>
            <div className="relative">
              {passwordValue && (
                <span
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  className="absolute top-6 right-5 cursor-pointer "
                >
                  {showPassword ? (
                    <FaRegEye className="text-black" />
                  ) : (
                    <FaEyeSlash className="text-black" />
                  )}
                </span>
              )}
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                aria-label="password"
                className="w-full mt-4"
                placeholder="Enter your Password"
              />
              ;
              <ErrorMessage errorMessage={formState.errors.password} />
            </div>
            <Input
              {...register("rePassword")}
              type="password"
              aria-label="rePassword"
              className="w-full mt-4"
              placeholder="Enter your Re-Password"
            />
            ;
            <ErrorMessage errorMessage={formState.errors.rePassword} />
            <div>
              <Button
                type="submit"
                className="w-full mt-5"
                isDisabled={isLoading}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin " />
                ) : (
                  "Register"
                )}
              </Button>
              <span className="text-black">
                {""}
                have an account
                <Link to={"/login"} className="text-sky-500">
                  {"  "}
                  Sign In
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
