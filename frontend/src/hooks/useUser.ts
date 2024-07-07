import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  posts: string;
  createdAt: string;
  updatedAt: string;
  comments: string;
}

const useGetUser = ({
  userId,
}: {
  userId: string;
}): { loading: boolean; user: User | undefined } => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios
          .get(`${BACKEND_URL}/api/v1/user/${userId}`, {
            headers: {
              Authorization: token,
            },
          })
          .then((res) => {
            setUser(res.data.user);
            setLoading(false);
          });
      } catch (error) {
        console.error("Error getting user:", error);
        setLoading(false);
      }
    };
    getUser();
  }, [userId]);

  return { loading, user };
};

interface UserInput {
  userId: string;
  name: string;
  email: string;
  password: string;
}

const useUpdateUser = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async ({
    userId,
    name,
    email,
    password,
  }: UserInput): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/user/${userId}`,
        { name, email, password },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);
      console.log("User is Updated ");
      return response.data.id;
    } catch (error) {
      setLoading(false);
      setError("Couldn't update the User");
      throw error;
    }
  };

  return { loading, updateUser, error };
};
export { useGetUser, useUpdateUser };
