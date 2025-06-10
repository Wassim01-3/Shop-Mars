import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    userData: Omit<User, "id" | "createdAt" | "isAdmin">,
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data - in a real app, this would be handled by a backend
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@marsshop.com",
    phone: "+1234567890",
    address: "123 Admin Street, Mars City",
    createdAt: new Date().toISOString(),
    isAdmin: true,
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1987654321",
    address: "456 Customer Ave, Earth City",
    createdAt: new Date().toISOString(),
    isAdmin: false,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("mars-shop-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("mars-shop-user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const foundUser = mockUsers.find((u) => u.email === email);
    if (
      foundUser &&
      (password === "password" || (foundUser.isAdmin && password === "admin"))
    ) {
      setUser(foundUser);
      localStorage.setItem("mars-shop-user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (
    userData: Omit<User, "id" | "createdAt" | "isAdmin">,
  ): Promise<boolean> => {
    // Simulate API call
    const existingUser = mockUsers.find((u) => u.email === userData.email);
    if (existingUser) {
      return false; // User already exists
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isAdmin: false,
    };

    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem("mars-shop-user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mars-shop-user");
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("mars-shop-user", JSON.stringify(updatedUser));

      // Update in mock users array
      const userIndex = mockUsers.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
