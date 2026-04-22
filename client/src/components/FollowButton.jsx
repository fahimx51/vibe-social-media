import axios from 'axios';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App';
import { setProfileData, setUserData } from '../redux/userSlice';

export default function FollowButton({ targetUserId, tailwind }) {

    const { userData } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const handleFollow = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/follow/${targetUserId}`, {}, { withCredentials: true });
            dispatch(setUserData(result.data.user));
            dispatch(setProfileData(result.data.target));
        }
        catch (error) {
            console.log("Error get when click follow / unfollow", error);
        }
    }

    return (
        <button onClick={handleFollow} className={tailwind}>
            {
                userData?.following?.some(user => (user._id || user) === targetUserId)
                    ? "Unfollow"
                    : "Follow"
            }
        </button>
    )
}
