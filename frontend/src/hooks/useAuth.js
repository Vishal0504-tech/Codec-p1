import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

// Custom hook to consume the AuthContext values directly without importing useContext and AuthContext separately in every file.
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
