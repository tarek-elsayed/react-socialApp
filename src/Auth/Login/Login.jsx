/*
{
    "name": "Tarek Elsayed",
    "username": "Ta2ta22",
    "email": "ta2ta22@gmail.com",
    "dateOfBirth": "2020-03-03",
    "gender": "male",
    "password": "T@2ta222",
    "rePassword": "T@2ta222"
}
*/

import { Alert, Button, Input, Label, ListBox, Select } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEyeSlash, FaRegEye, FaSpinner } from "react-icons/fa";
import z, { email } from "zod";
import ErrorMessage from "../../Components/ErrorMessage/ErrorMessage";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Register from "./../Register/Register";
import { UserContext } from "../../Context/UserContext";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  let { userToken, setUserToken } = useContext(UserContext);
  //validation
  const schema = z.object({
    email: z.string().email("invalid mail"),
    password: z.string(),
  });

  //collect values
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
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
        "https://route-posts.routemisr.com/users/signin",
        obj,
      );
      Swal.fire({
        title: "Successfully!",
        text: data.message,
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem("userToken", data.data.token);
          setUserToken(data.data.token);
          setIsLoading(false);
          navigate("/home");
        }
      });
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message,
        icon: "error",
        confirmButtonText: "ok",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const feilds = [
    { name: "email", type: "email", placeholder: "Enter Your Email" },
    { name: "password", type: "password", placeholder: "Enter Your Password" },
  ];

  return (
    <>
      <div className="bg-gray-200 p-6  ">
        <div className="bg-white p-3 text-center lg:w-1/2 m-auto rounded-2xl">
          <h2 className="text-2xl font-bold text-sky-200">Login</h2>

          <form onSubmit={handleSubmit(handleRegister)}>
            {feilds.map((input) => (
              <div key={input.name} className="relative">
                {passwordValue && input.name == "password" && (
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
                  {...register(input.name)}
                  type={
                    input.type === "password"
                      ? showPassword
                        ? "text"
                        : "password"
                      : input.type
                  }
                  className="w-full mt-4"
                  placeholder={input.placeholder}
                />
                <ErrorMessage errorMessage={formState.errors[input.name]} />
              </div>
            ))}
            <div className="">
              <Button
                type="submit"
                className="w-full mt-5"
                isDisabled={isLoading}
              >
                {isLoading ? <FaSpinner className="animate-spin " /> : "Login"}
              </Button>
              <span className="text-black">
                {""}
                don't have an account
                <Link to={" "} className="text-sky-500">
                  {"  "}
                  Sign Up
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
