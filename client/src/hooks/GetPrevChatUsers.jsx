import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl } from '../App';
import { setPrevChatsUsers } from '../redux/messageSlice';

export default function GetPrevChatUsers() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);
    const { prevChatUsers } = useSelector(state => state.message);

    useEffect(() => {
        if (!userData || (prevChatUsers && prevChatUsers.length > 0)) {
            return;
        }

        const fetchChats = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/message/prevChats`, { withCredentials: true });
                dispatch(setPrevChatsUsers(result.data));
            }
            catch (error) {
                if (error.name !== 'CanceledError') {
                    console.log("Prev Chats Fetch Error:", error.message);
                }
            }
        };

        fetchChats();

    }, [userData, dispatch, prevChatUsers?.length]); // Added dependencies for stability
}