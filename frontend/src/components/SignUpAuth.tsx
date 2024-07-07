import { useState } from "react";
import { motion } from "framer-motion";
import { FaLock, FaLockOpen, FaSave } from "react-icons/fa";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import LabelledInput from "./LabelledInput";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const ProfilePage = () => {
  const [isLocked, setIsLocked] = useState(true);
  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "********",
    },
  });

  const watchedFields = watch();

  const handleToggleLock = () => {
    setIsLocked(!isLocked);
  };

  const onSubmit = (data: FormData) => {
    setIsLocked(true);
    console.log("Saving profile:", data);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        {/* Left side - Input fields */}
        <motion.form
          className="w-full md:w-1/2 space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          <LabelledInput
            label="Name"
            placeholder="Enter your name"
            register={register("name") as UseFormRegisterReturn}
            type="text"
          />
          <LabelledInput
            label="Email"
            placeholder="Enter your email"
            register={register("email") as UseFormRegisterReturn}
            type="email"
          />
          <LabelledInput
            label="Password"
            placeholder="Enter your password"
            register={register("password") as UseFormRegisterReturn}
            type="password"
          />
          <div className="flex gap-4">
            <motion.button
              type="button"
              onClick={handleToggleLock}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              {isLocked ? <FaLock /> : <FaLockOpen />}
              {isLocked ? "Unlock" : "Lock"}
            </motion.button>
            {!isLocked && (
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FaSave />
                Save
              </motion.button>
            )}
          </div>
        </motion.form>

        {/* Right side - ID Card */}
        <motion.div
          className="w-full md:w-1/2 flex items-start justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">ID Card</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400">Name</label>
                <p className="text-lg">{watchedFields.name}</p>
              </div>
              <div>
                <label className="block text-gray-400">Email</label>
                <p className="text-lg">{watchedFields.email}</p>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
