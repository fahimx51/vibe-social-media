import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';

export default function GetAllPost() {

    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user)
    const { postData } = useSelector(state => state.post)

    useEffect(() => {
        if (!userData || (postData && postData.length > 0)) return;
        const fetchPosts = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/posts/getAllPosts`, { withCredentials: true });
                dispatch(setPostData(result.data));

            }
            catch (error) {
                console.log(error.message);
            }
        }

        fetchPosts();

    }, [userData])
}
