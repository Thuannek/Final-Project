import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useReducer } from "react";

// Auth state interface
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// User interface
interface User {
  id: string;
  name: string;
  email: string;
}

// Action types
type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGOUT" }
  | { type: "REGISTER_SUCCESS"; payload: User };

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };

    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      };

    default:
      return state;
  }
};

// Context type
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await AsyncStorage.getItem("user_data");
      if (userData) {
        const user = JSON.parse(userData);
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      // Simulate API call - replace with actual authentication
      if (email && password) {
        const user: User = {
          id: Date.now().toString(),
          name: email.split("@")[0],
          email,
        };

        await AsyncStorage.setItem("auth_token", "demo_token");
        await AsyncStorage.setItem("user_data", JSON.stringify(user));

        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return true;
      }

      dispatch({ type: "SET_ERROR", payload: "Invalid credentials" });
      return false;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Login failed" });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      // Simulate API call - replace with actual registration
      if (email && password && name) {
        const user: User = {
          id: Date.now().toString(),
          name,
          email,
        };

        await AsyncStorage.setItem("auth_token", "demo_token");
        await AsyncStorage.setItem("user_data", JSON.stringify(user));

        dispatch({ type: "REGISTER_SUCCESS", payload: user });
        return true;
      }

      dispatch({ type: "SET_ERROR", payload: "Registration failed" });
      return false;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Registration failed" });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("user_data");
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const contextValue: AuthContextType = {
    state,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Backwards compatibility
export const useAuthLegacy = () => {
  const { state, login, register, logout } = useAuth();
  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    isLoading: state.isLoading,
    login,
    register,
    logout,
  };
};
