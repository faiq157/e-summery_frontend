import { createContext, useReducer } from "react";
import axios from "axios";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null,
};

const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case "USER_LOADED":
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case "REGISTER_SUCCESS":
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case "REGISTER_FAIL":
    case "AUTH_ERROR":
    case "LOGIN_FAIL":
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = async () => {
    if (localStorage.token) {
      axios.defaults.headers.common["x-auth-token"] = localStorage.token;
    }
    try {
      const res = await axios.get("/api/auth");
      dispatch({ type: "USER_LOADED", payload: res.data });
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      dispatch({ type: "AUTH_ERROR" });
    }
  };

  const register = async (formData) => {
    try {
      const res = await axios.post("/api/auth/register", formData);
      dispatch({ type: "REGISTER_SUCCESS", payload: res.data });
      loadUser();
    } catch (err) {
      dispatch({ type: "REGISTER_FAIL", payload: err.response.data.msg });
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post("/api/auth/login", formData);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      loadUser();
    } catch (err) {
      dispatch({ type: "LOGIN_FAIL", payload: err.response.data.msg });
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{ ...state, loadUser, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
