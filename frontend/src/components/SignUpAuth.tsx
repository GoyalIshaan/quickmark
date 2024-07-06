import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import LabelledInput from "./LabelledInput";
import { SignUpInput } from "@ishaan_goyal/quickmark-common";
import axios from "axios";
import { BACKEND_URL } from "../config";

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignUpInput> = async (data) => {
    console.log("Signing up:", data);
    // Handle sign-up logic here
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/signup`,
        data
      );
      const { jwt } = response.data;
      localStorage.setItem("token", jwt);
      navigate("/blogs");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <div className="mb-4">
        <div className="text-3xl font-extrabold text-center">
          Create An Account
        </div>
        <div className="text-slate-400 text-center">
          Already have an account?{" "}
          <Link to="/signin" className="text-slate-600 underline">
            Login
          </Link>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4"
      >
        <LabelledInput
          label="Username"
          placeholder="Enter your username"
          register={register("name", { required: "Username is required" })}
        />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}

        <LabelledInput
          label="Email"
          placeholder="Enter your email"
          type="email"
          register={register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}

        <LabelledInput
          label="Password"
          placeholder="Enter your password"
          type="password"
          register={register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="bg-slate-950 w-full text-white font-bold py-2 px-4 rounded-md hover:bg-slate-800"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
