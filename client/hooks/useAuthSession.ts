import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearAuth } from "@/redux/auth/auth.slice";
import { RootState } from "@/redux/store";
import axios from "axios";
import toast from "react-hot-toast";

const useAuthSession = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const validateToken = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/get-user-by-id`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        dispatch(setUser({ username: response.data.data.email }));
        toast.success(response.data.message);
      } else {
        localStorage.removeItem("token");
        dispatch(clearAuth());
      }
    } catch (error) {
      localStorage.removeItem("token");
      dispatch(clearAuth());
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
    }
  }, []);
  return user;
};

export default useAuthSession;
