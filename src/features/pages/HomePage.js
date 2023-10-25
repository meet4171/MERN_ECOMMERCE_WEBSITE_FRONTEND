import ProductList from "../product/components/ProductList";
import Navbar from "../comman/Navbar";
import Footer from "../comman/Footer";
import Banner from "../comman/Banner";
function HomePage() {

    return (
        < div >
            <Navbar>
                <ProductList />
            </Navbar>
            <Banner></Banner>
            <Footer></Footer>
        </div >
    )
}
export default HomePage;