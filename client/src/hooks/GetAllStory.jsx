import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App';
import { setStoryList } from '../redux/storySlice';

export default function GetAllStory() {

    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user)

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/story/getAllStory`, { withCredentials: true });
                dispatch(setStoryList(result.data));
                console.log(result.data);
            }
            catch (error) {
                console.log(error.message);
            }
        }

        fetchStories();

    }, [dispatch, userData])
}
