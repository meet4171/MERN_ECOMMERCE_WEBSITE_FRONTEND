import Footer from "../comman/Footer";
import Navbar from "../comman/Navbar";
import UserProfile from "../user/components/UserProfile";
export default function UserProfilePage() {
    return (
        <>
            <Navbar>
                <UserProfile></UserProfile>
            </Navbar>
            <Footer></Footer>
        </>
    )
}