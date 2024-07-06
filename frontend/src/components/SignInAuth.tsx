import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import LabelledInput from "./LabelledInput";
import { SignInInput } from "@ishaan_goyal/quickmark-common";
import { BACKEND_URL } from "../config";
import axios from "axios";

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignInInput> = async (data) => {
    console.log("Signing in:", data);
    // Handle sign-up logic here
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/signin`,
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
          Don't have an account?{" "}
          <Link to="/signup" className="text-slate-600 underline">
            Register
          </Link>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4"
      >
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
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignUp;
