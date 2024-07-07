import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type LabelledInputProps = {
  label: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  type?: string;
  disabled?: boolean; // Add this line
};

const LabelledInput: React.FC<LabelledInputProps> = ({
  label,
  placeholder,
  register,
  type = "text",
  disabled = false, // Add this line
}) => {
  return (
    <div className="mb-4 w-full">
      <label className="block mb-1 text-sm font-medium text-slate-950 sm:text-base">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register}
        disabled={disabled} // Add this line
        className={`bg-slate-50 border border-slate-950 text-slate-950 text-sm sm:text-base rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 sm:p-2.5 transition-all duration-300 ease-in-out ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
};

export default LabelledInput;
