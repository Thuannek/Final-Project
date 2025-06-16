import { Review, Toilet } from "@/models/toilet";
import {
  saveToilet as dbSaveToilet,
  deleteComment,
  fetchSavedToilets,
  initializeDatabase,
  postComment,
  removeSavedToilet,
  updateComment,
} from "@/utils/db";
import React, { createContext, useContext, useEffect, useReducer } from "react";

// State interface
interface AppState {
  savedToilets: Toilet[];
  currentUser: User | null;
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
type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_SAVED_TOILETS"; payload: Toilet[] }
  | { type: "ADD_SAVED_TOILET"; payload: Toilet }
  | { type: "REMOVE_SAVED_TOILET"; payload: number }
  | { type: "ADD_COMMENT"; payload: { toiletId: number; comment: Review } }
  | {
      type: "UPDATE_COMMENT";
      payload: {
        toiletId: number;
        commentId: number;
        rating: number;
        comment: string;
      };
    }
  | { type: "DELETE_COMMENT"; payload: { toiletId: number; commentId: number } }
  | { type: "RESET_STATE" };

// Initial state
const initialState: AppState = {
  savedToilets: [],
  currentUser: null,
  isLoading: false,
  error: null,
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_USER":
      return { ...state, currentUser: action.payload };

    case "SET_SAVED_TOILETS":
      return { ...state, savedToilets: action.payload };

    case "ADD_SAVED_TOILET":
      return {
        ...state,
        savedToilets: [action.payload, ...state.savedToilets],
      };

    case "REMOVE_SAVED_TOILET":
      return {
        ...state,
        savedToilets: state.savedToilets.filter(
          (toilet) => toilet.id !== action.payload
        ),
      };

    case "ADD_COMMENT":
      return {
        ...state,
        savedToilets: state.savedToilets.map((toilet) =>
          toilet.id === action.payload.toiletId
            ? {
                ...toilet,
                reviews: [action.payload.comment, ...toilet.reviews],
                reviewCount: toilet.reviewCount + 1,
              }
            : toilet
        ),
      };

    case "UPDATE_COMMENT":
      return {
        ...state,
        savedToilets: state.savedToilets.map((toilet) =>
          toilet.id === action.payload.toiletId
            ? {
                ...toilet,
                reviews: toilet.reviews.map((review) =>
                  review.id === action.payload.commentId
                    ? {
                        ...review,
                        rating: action.payload.rating,
                        comment: action.payload.comment,
                        timestamp: new Date().toISOString(),
                      }
                    : review
                ),
              }
            : toilet
        ),
      };

    case "DELETE_COMMENT":
      return {
        ...state,
        savedToilets: state.savedToilets.map((toilet) =>
          toilet.id === action.payload.toiletId
            ? {
                ...toilet,
                reviews: toilet.reviews.filter(
                  (review) => review.id !== action.payload.commentId
                ),
                reviewCount: Math.max(0, toilet.reviewCount - 1),
              }
            : toilet
        ),
      };

    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
};

// Context type
interface AppContextType {
  state: AppState;
  // Toilet actions
  saveToilet: (toilet: Toilet) => Promise<boolean>;
  unsaveToilet: (toiletId: number) => Promise<boolean>;
  loadSavedToilets: () => Promise<void>;
  // Comment actions
  addComment: (
    toiletId: number,
    userName: string,
    rating: number,
    comment: string,
    userId?: string
  ) => Promise<boolean>;
  updateComment: (
    toiletId: number,
    commentId: number,
    rating: number,
    comment: string
  ) => Promise<boolean>;
  deleteComment: (toiletId: number, commentId: number) => Promise<boolean>;
  // Utility actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize database on app start
  useEffect(() => {
    initializeDatabase();
  }, []);

  // Toilet CRUD actions
  const saveToilet = async (toilet: Toilet): Promise<boolean> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const success = dbSaveToilet(toilet);
      if (success) {
        dispatch({ type: "ADD_SAVED_TOILET", payload: toilet });
        return true;
      }
      return false;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to save toilet" });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const unsaveToilet = async (toiletId: number): Promise<boolean> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const success = removeSavedToilet(toiletId);
      if (success) {
        dispatch({ type: "REMOVE_SAVED_TOILET", payload: toiletId });
        return true;
      }
      return false;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to remove toilet" });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const loadSavedToilets = async (): Promise<void> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const toilets = fetchSavedToilets();
      dispatch({ type: "SET_SAVED_TOILETS", payload: toilets });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load saved toilets" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // User actions
  const setUser = (user: User | null) => {
    dispatch({ type: "SET_USER", payload: user });
  };

  // Utility actions
  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const resetState = () => {
    dispatch({ type: "RESET_STATE" });
  };

  const addComment = async (
    toiletId: number,
    userName: string,
    rating: number,
    comment: string,
    userId?: string
  ): Promise<boolean> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const success = postComment({
        toiletId,
        userName,
        rating,
        comment,
        userId,
      });
      if (success) {
        const newComment: Review = {
          id: Date.now(), // Temporary ID
          userName,
          rating,
          comment,
          timestamp: new Date().toISOString(),
          userId,
        };
        dispatch({
          type: "ADD_COMMENT",
          payload: { toiletId, comment: newComment },
        });
        return true;
      }
      return false;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to add comment" });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateCommentAction = async (
    toiletId: number,
    commentId: number,
    rating: number,
    comment: string
  ): Promise<boolean> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const success = updateComment(commentId, rating, comment);
      if (success) {
        dispatch({
          type: "UPDATE_COMMENT",
          payload: { toiletId, commentId, rating, comment },
        });
        return true;
      }
      return false;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update comment" });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const deleteCommentAction = async (
    toiletId: number,
    commentId: number
  ): Promise<boolean> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const success = deleteComment(commentId);
      if (success) {
        dispatch({
          type: "DELETE_COMMENT",
          payload: { toiletId, commentId },
        });
        return true;
      }
      return false;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to delete comment" });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const contextValue: AppContextType = {
    state,
    saveToilet,
    unsaveToilet,
    loadSavedToilets,
    addComment,
    updateComment: updateCommentAction,
    deleteComment: deleteCommentAction,
    setUser,
    setLoading,
    setError,
    resetState,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
