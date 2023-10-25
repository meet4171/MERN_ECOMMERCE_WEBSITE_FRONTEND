import AdminNavbar from '../comman/AdminNavbar'
import AdminOrders from '../admin/components/AdminOrders'
import Footer from '../comman/Footer'

export default function AdminOrdersPage() {
    return (
        <>
            <AdminNavbar>
                <AdminOrders></AdminOrders>
            </AdminNavbar>
            <Footer></Footer>
        </>

    )
} 