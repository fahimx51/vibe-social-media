import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl } from '../App';
import { setUserData, setAuthChecked } from '../redux/userSlice';

export default function GetCurrentUser() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
       
        if (userData) return;

        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
                dispatch(setUserData(result.data));
            }
            catch (error) {
            
                dispatch(setUserData(null));
                console.log("Not logged in", error);
            } finally {
                // Ensure the "Loading Vibe..." screen disappears
                dispatch(setAuthChecked());
            }
        };

        fetchUser();

    }, [dispatch]);
}