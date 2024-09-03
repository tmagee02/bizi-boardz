import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { decryptData } from "../backend/octokit/encrypt";
const AuthContext = createContext();

const AuthProvider = (props) => {
  const [pat, setPAT] = useState('');
  const [activeRepo, setActiveRepo] = useState('');
  const [userName, setUserName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // checks if user is authenticated on app boot up
  useEffect(() => {
    if (localStorage.getItem("pat") && localStorage.getItem("activeRepo") && localStorage.getItem("userName")) {

      const decryptedData = decryptData(localStorage.getItem("pat"))
    
      setPAT(decryptedData);
      setActiveRepo(localStorage.getItem("activeRepo"));
      setUserName(localStorage.getItem("userName"));
      setIsAuthenticated(true);
    }
  }, []);

return <AuthContext.Provider value={{ pat: pat, setPAT, activeRepo, setActiveRepo, userName, setUserName, isAuthenticated, setIsAuthenticated }}>
  {props.children}
</AuthContext.Provider>
}

const useAuthContext = () => {
  return useContext(AuthContext);
}

export { useAuthContext };
export default AuthProvider;