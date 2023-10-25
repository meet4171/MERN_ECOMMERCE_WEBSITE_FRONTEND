import { useSelector } from "react-redux";
import { selectLoggedInUserToken } from "../authSlice";
import { Navigate } from "react-router-dom";
export default function ProtectedRoute({ children }) {
    const user = useSelector(selectLoggedInUserToken)
    if (!user) {
        return <Navigate to='/login' replace={ true }></Navigate>
    }
    return children;
}