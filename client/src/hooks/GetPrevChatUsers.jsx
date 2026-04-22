import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { serverUrl } from '../App';
import { setPrevChatsUsers } from '../redux/messageSlice';


export default function GetPrevChatUsers() {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/message/prevChats`, { withCredentials: true });
                dispatch(setPrevChatsUsers(result.data));
            }
            catch (error) {
                console.log(error.message);
            }
        }

        fetchChats();

    }, [])
}
