import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../auth-layout/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
 
  const axiosSecure  = useAxiosSecure();

  const {
    data: roleData,
    isLoading: roleLoading,
    error: roleError,
    refetch: refetchRole,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !authLoading && !!user?.email,
    queryFn: async () => {
      if (!user?.email) return "guest";

      // ✅ Check cached role
      const cachedRole = localStorage.getItem(`role_${user.email}`);
      if (cachedRole) return cachedRole;

      // ✅ Admin email check
      const adminEmails = ["admin@gmail.com", "monsi41@gamil.com"];
      if (adminEmails.includes(user.email)) {
        localStorage.setItem(`role_${user.email}`, "admin");
        return "admin";
      }

      try {
        const token = await user.getIdToken(true); // 🔑 Firebase token
        const encodedEmail = encodeURIComponent(user.email);

        const response = await axiosSecure.get(`/users/${encodedEmail}/role`, {
          headers: { Authorization: `Bearer ${token}` }, // 🔑 attach token
          timeout: 10000,
        });

        // ✅ Ensure role is valid, fallback to "user"
        let role = response?.data?.role || "user";
        const validRoles = ["admin", "user", "moderator"];
        if (!validRoles.includes(role.toLowerCase())) role = "user";

        // ✅ Cache the role
        localStorage.setItem(`role_${user.email}`, role);
        return role;
      } catch (err) {
        console.error("❌ Failed to fetch role:", err);

        // ✅ Fallback role if API fails
        const fallbackRole = "guest";
        localStorage.setItem(`role_${user.email}`, fallbackRole);
        return fallbackRole;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 1,
    retryDelay: 1000,
  });

  // ✅ Clear cached roles on logout
  React.useEffect(() => {
    if (!user?.email) {
      Object.keys(localStorage)
        .filter((key) => key.startsWith("role_"))
        .forEach((key) => localStorage.removeItem(key));
    }
  }, [user]);

  const finalRole = React.useMemo(() => {
    if (authLoading || roleLoading) return "loading";
    if (!user?.email) return "guest";
    return roleData || "user";
  }, [roleData, authLoading, roleLoading, user]);

  return {
    role: finalRole,
    loading: authLoading || roleLoading,
    error: roleError,
    refetchRole,
  };
};

export default useUserRole;
