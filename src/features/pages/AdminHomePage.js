import { useEffect, useState } from "react"
import AdminProductList from "../admin/components/AdminProductList"
import AdminNavbar from "../comman/AdminNavbar"
import Footer from "../comman/Footer"
import { clearSelectedProduct } from "../product/productSlice"
import { useDispatch } from "react-redux"
export default function AdminHomePage() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedDeleteItem, setSelectedDeleteItem] = useState(-1)
    const dispatch = useDispatch()

    useEffect(() => {
        setIsOpen(false)
        setSelectedDeleteItem(-1)
        dispatch(clearSelectedProduct());
    }, [dispatch])
    
    return (
        <>
            <AdminNavbar>
                <AdminProductList></AdminProductList>
            </AdminNavbar>
            <Footer></Footer>
        </>
    )
}