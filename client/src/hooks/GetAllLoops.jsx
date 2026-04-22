import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App';
import { setLoopData } from '../redux/loopSlice';

export default function GetAllLoops() {

    const dispatch = useDispatch();

    const { userData } = useSelector(state => state.user)

    useEffect(() => {
        const fetchLoops = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/loops/getAllLoops`, { withCredentials: true });
                dispatch(setLoopData(result.data));
            }
            catch (error) {
                console.log(error.message);
            }
        }

        fetchLoops();

    }, [dispatch, userData])
}
