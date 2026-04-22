import axios from 'axios';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App';
import { setSuggestedUsers } from '../redux/userSlice';

export default function GetSuggestedUser() {
    const dispatch = useDispatch();
    const { userData, suggestedUsers } = useSelector(state => state.user);

    useEffect(() => {
        if (!userData || (suggestedUsers && suggestedUsers.length > 0)) {
            return;
        }

        const fetchSuggested = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/suggestedUsers`, { withCredentials: true });
                dispatch(setSuggestedUsers(result.data));
            }
            catch (error) {
                if (error.name !== 'CanceledError') {
                    console.log("Suggested Users Error:", error.message);
                }
            }
        }

        fetchSuggested();

    }, [userData, dispatch, suggestedUsers?.length])
}