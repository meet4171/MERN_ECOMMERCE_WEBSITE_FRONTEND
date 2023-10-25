import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import img1 from '../../assets/images/img1.jpg'
import img2 from '../../assets/images/img2.jpg'
import img3 from '../../assets/images/img3.jpg'
import img4 from '../../assets/images/img4.jpg'
import img5 from '../../assets/images/img5.jpg'
import img6 from '../../assets/images/img6.jpg'
export default function FeatureCarousel() {
    return (
        <Carousel
            autoPlay={ true }
            infiniteLoop={ true }
            showArrows={ false }
            showIndicators={ false }
            showThumbs={ false }
            interval={ 5000 }
            transitionTime={ 500 }
            showStatus={ false }
            className="min-h-fit ease-in-out"
        >

            <img src={ img1 } alt="image1" className="h-80" loading="lazy" />
            <img src={ img2 } alt="image2" className="h-80" loading="lazy" />
            <img src={ img3 } alt="image3" className="h-80" loading="lazy" />
            <img src={ img4 } alt="image4" className="h-80" loading="lazy" />
            <img src={ img5 } alt="image5" className="h-80" loading="lazy" />
            <img src={ img6 } alt="image6" className="h-80" loading="lazy" />
        </Carousel>
    )
}