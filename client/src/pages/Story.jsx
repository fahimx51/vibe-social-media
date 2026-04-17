import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setStoryData } from '../redux/storySlice';
import StoryCard from '../components/StoryCard';

export default function Story() {

    const { userName } = useParams();
    const dispatch = useDispatch();
    const { storyData } = useSelector(state => state.story);

    useEffect(() => {
        dispatch(setStoryData(null));
        const getStoryByUserName = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/story/getByUserName/${userName}`, { withCredentials: true });
                dispatch(setStoryData(result.data));
                console.log(result.data);
            }
            catch (error) {
                console.log(error);
            }
        }

        getStoryByUserName();
    }, [userName])
    return (
        <div className='w-full h-screen bg-gray-900 flex justify-center items-center'>
            <StoryCard storyData={storyData} />
        </div>
    )
}
