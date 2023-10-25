import { useDispatch, useSelector } from "react-redux"
import { logoutAsync, selectLoggedInUserToken } from "../authSlice"
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function Logout() {
    const dispatch = useDispatch()
    const user = useSelector(selectLoggedInUserToken);


    useEffect(() => {
        if (user) {
            dispatch(logoutAsync())
        }
    }, [dispatch, user])
    return ( !user && <Navigate to='/' replace={ true }></Navigate>)
}