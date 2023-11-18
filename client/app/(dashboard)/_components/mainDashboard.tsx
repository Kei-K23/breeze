"use client";

import GetGoogleOAuthURL from "@/lib/getGoogleOAuthURL";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MainDashboard = () => {
  const router = useRouter();
  const [session, setSession] = useState<{
    createdAt: Date;
    email: string;
    name: string;
    updatedAt: Date;
    _id: string;
  }>();

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const { data, status } = await axios.get(
        "http://localhost:8090/api/users",
        {
          headers: {},
          withCredentials: true,
        }
      );

      if (status == 200 && data.success) {
        setSession(data.data);
      } else {
        return router.push("/");
      }
      return;
    } catch (e: any) {
      toast.error(e.response?.data.error);
      return router.push("/");
    }
  }

  return (
    <div>
      {session?.name}

      <GetGoogleOAuthURL />
    </div>
  );
};

export default MainDashboard;
