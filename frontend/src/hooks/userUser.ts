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
        await axios.get(`${BACKEND_URL}/api/v1/user/${userId}`).then((res) => {
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

export { useGetUser };
