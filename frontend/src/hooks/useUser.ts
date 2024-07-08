import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface User {
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

// Define the type for a follower or following entry
export type Following = {
  followingId: string;
};

export type Follower = {
  followerId: string;
};

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

const useGetNumberOfFollowersForUser = (userId: string) => {
  const [numberOfFollowers, setNumberOfFollowers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNumberOfFollowers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/v1/user/followers/${userId}`
      );
      setNumberOfFollowers(res.data.followers);
    } catch (error) {
      console.error("Error fetching number of followers:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch the number of followers on initial load
  useEffect(() => {
    fetchNumberOfFollowers();
  }, [fetchNumberOfFollowers]);

  return { numberOfFollowers, fetchNumberOfFollowers, loading };
};

const useFollowUser = (idToFollow: string, refetchFollowers: () => void) => {
  const followUser = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/user/follow/${idToFollow}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log("User Followed");
      refetchFollowers();
    } catch (error) {
      console.error("Error following user:", error);
      throw error;
    }
  };

  return { followUser };
};

const useUnfollowUser = (
  idToUnfollow: string,
  refetchFollowers: () => void
) => {
  const unfollowUser = async () => {
    try {
      await axios.delete(
        `${BACKEND_URL}/api/v1/user/unfollow/${idToUnfollow}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log("User Unfollowed");
      refetchFollowers();
    } catch (error) {
      console.error("Error unfollowing user:", error);
      throw error;
    }
  };

  return { unfollowUser };
};

const useCheckIfUserIsFollowing = (idToCheck: string) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    const checkIfFollowing = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/v1/user/follow/${idToCheck}/`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setIsFollowing(res.data.following);
      } catch (error) {
        console.error("Error checking if user is following:", error);
      }
    };

    checkIfFollowing();
  }, [idToCheck]);

  return { isFollowing, setIsFollowing };
};

const useGetAllFollowers = () => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchFollowers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/user/followers/`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setFollowers(res.data.followers as Follower[]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };
  useEffect(() => {
    fetchFollowers();
  }, []);

  return { followers, fetchFollowers, loading };
};

const useGetAllFollowing = () => {
  const [following, setFollowing] = useState<Following[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const fetchFollowing = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/user/following/`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setFollowing(res.data.following as Following[]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  };
  useEffect(() => {
    fetchFollowing();
  }, []);

  return { following, fetchFollowing, loading };
};

export {
  useGetUser,
  useUpdateUser,
  useGetNumberOfFollowersForUser,
  useFollowUser,
  useUnfollowUser,
  useCheckIfUserIsFollowing,
  useGetAllFollowers,
  useGetAllFollowing,
};
