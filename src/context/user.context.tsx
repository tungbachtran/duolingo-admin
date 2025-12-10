import { userApi } from "@/api/user.api";
import type { User } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
    user: User | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    
    const { data } = useQuery({
        queryKey: ["user"],
        queryFn: userApi.getUserProfile,
        retry: 1, // Giảm retry để tránh reload liên tục
    });
    const user = data
    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
    const ctx =  useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
    return ctx;
}