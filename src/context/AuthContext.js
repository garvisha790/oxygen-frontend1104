import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from 'jwt-decode';
 // You'll need to install this package
 
export const AuthContext = createContext();
 
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
 
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        // Verify and decode token
        const decodedToken = jwtDecode(storedToken);
        // Check if token has expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Token expired, log out
          handleLogout();
        } else {
          // Valid token
          setToken(storedToken);
          setIsAuthenticated(true);
          setUser({
            email: decodedToken.email || decodedToken.sub,
            id: decodedToken.id || decodedToken.userId,
          });
        }
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    }
  }, []);
 
  const login = (authToken) => {
    try {
      // Decode the JWT token to extract user information
      const decodedToken = jwtDecode(authToken);
      // Store token in localStorage
      localStorage.setItem("token", authToken);
      // Update state
      setToken(authToken);
      setIsAuthenticated(true);
      setUser({
        email: decodedToken.email || decodedToken.sub,
        id: decodedToken.id || decodedToken.userId,
      });
    } catch (error) {
      console.error("Error processing token:", error);
    }
  };
 
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    // Reset state
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };
 
  return (
<AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        token,
        login, 
        logout: handleLogout 
      }}
>
      {children}
</AuthContext.Provider>
  );
};
 
export const useAuth = () => useContext(AuthContext);