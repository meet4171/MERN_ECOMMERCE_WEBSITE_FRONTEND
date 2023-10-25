import { useSelector } from "react-redux";
import { selectLoggedInUserInfo } from "../../user/userSlice";
import { Navigate } from "react-router-dom";
export default function ProtectedAdmin({ children }) {
    const user = useSelector(selectLoggedInUserInfo)
    if (!user) {
        return <Navigate to='/login' replace={ true }></Navigate>
    }
    if (user && user.role !== 'admin') {
        return <Navigate to='/' replace={ true }></Navigate>
    }
    return children;
}