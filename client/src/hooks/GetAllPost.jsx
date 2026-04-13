import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';

export default function GetAllPost() {

    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/posts/getAllPosts`, { withCredentials: true });
                dispatch(setPostData(result.data));
                console.log(result.data);
            }
            catch (error) {
                console.log(error.message);
            }
        }

        fetchPosts();

    }, [dispatch, userData])
}
