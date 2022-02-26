import { useContext } from 'react';

import AuthContext from '../context/index.jsx';

const useAuth = () => useContext(AuthContext);

export default useAuth;
