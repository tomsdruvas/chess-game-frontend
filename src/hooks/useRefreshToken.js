import axios from '../api/axios';
import useAuth from './useAuth';
import {useNavigate} from "react-router-dom";

const useRefreshToken = () => {
    const {setAuth} = useAuth();
    const navigate = useNavigate();

    return async () => {
        try {
            const response = await axios.get('/refresh-token', {
                withCredentials: true
            });
            setAuth(prevState => {
                return {
                    ...prevState,
                    username: response.data.username,
                    accessToken: response.data.accessToken,
                    roles: response.data.roles
                }
            });

            return response.data.accessToken;
        } catch (err) {
            navigate("/login");
        }
    };
};

export default useRefreshToken;