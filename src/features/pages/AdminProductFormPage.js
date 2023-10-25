import AdminProductForm from "../admin/components/AdminProductForm";
import AdminNavbar from "../comman/AdminNavbar";
import Footer from "../comman/Footer";
export default function AdminProductFormPage() {
    return (
        <>
            <AdminNavbar>
                <AdminProductForm></AdminProductForm>
            </AdminNavbar>
            <Footer></Footer>
        </>
    )
}