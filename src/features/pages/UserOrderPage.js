import UserOrders from "../user/components/UserOrders";
import Navbar from "../comman/Navbar";
import Footer from "../comman/Footer";
export default function UserOrderPage() {
    return (
        <>
            <Navbar>
                <UserOrders></UserOrders>
            </Navbar>
            <Footer></Footer>
        </>
    )

}