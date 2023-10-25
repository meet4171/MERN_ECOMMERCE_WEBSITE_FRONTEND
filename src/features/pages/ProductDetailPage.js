import ProductDetail from "../product/components/ProductDetail";
import Navbar from "../comman/Navbar";
import Footer from "../comman/Footer";

function ProductDetailPage() {
    return (
        <>
            <Navbar>
                <ProductDetail></ProductDetail>
            </Navbar>
            <Footer></Footer>
        </>
    )
}
export default ProductDetailPage;