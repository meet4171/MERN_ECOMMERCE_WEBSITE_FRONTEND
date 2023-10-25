import { v4 as uuidv4 } from 'uuid'
import Marquee from "react-fast-marquee";
import React from 'react';
import img1 from '../../assets/banner-logos/adidas-9.svg';
import img2 from '../../assets/banner-logos/apple.svg';
import img3 from '../../assets/banner-logos/coca-cola-2021.svg';
import img4 from '../../assets/banner-logos/dell-2.svg';
import img5 from '../../assets/banner-logos/oneplus.svg';
import img6 from '../../assets/banner-logos/boss.svg';
import img7 from '../../assets/banner-logos/hp-5.svg';
import img8 from '../../assets/banner-logos/huawei.svg';
import img9 from '../../assets/banner-logos/benq.svg';
import img10 from '../../assets/banner-logos/sellfy.svg';
import img11 from '../../assets/banner-logos/louis-vuitton-1.svg';
import img12 from '../../assets/banner-logos/microsoft.svg';
import img13 from '../../assets/banner-logos/nestle-4.svg';
import img14 from '../../assets/banner-logos/nike-11.svg';
import img15 from '../../assets/banner-logos/pepsi.svg';
import img16 from '../../assets/banner-logos/prada.svg';
import img17 from '../../assets/banner-logos/samsung.svg';
import img18 from '../../assets/banner-logos/sony-2.svg';
import img19 from '../../assets/banner-logos/vivo-2.svg';
import img20 from '../../assets/banner-logos/atlas-snow-shoe.svg'
import img21 from '../../assets/banner-logos/brainware-europe-947.svg'
import img22 from '../../assets/banner-logos/cellex-power-products.svg'
import img23 from '../../assets/banner-logos/delta-5.svg'
import img24 from '../../assets/banner-logos/hero-motocorp-logo.svg'
import img25 from '../../assets/banner-logos/krupp-logo.svg'
import img26 from '../../assets/banner-logos/logo-lg.svg'
import img27 from '../../assets/banner-logos/motul-logo-1.svg'
import img28 from '../../assets/banner-logos/notion-logo-1.svg'
import img29 from '../../assets/banner-logos/pantech-logo.svg'
import img30 from '../../assets/banner-logos/puma-logo.svg'

const slide1Img = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10]

const slide2Img = [img11, img12, img13, img14, img15, img16, img17, img18, img19, img20]

const slide3Img = [img21, img22, img23, img24, img25, img26, img27, img28, img29, img30]

export default function Banner() {
    return (
        <div className='bg-white py-10'>
            <Marquee
                pauseOnHover={ true }
                className='cursor-pointer  overflow-hidden'
                direction='right'
                speed={ 100 } gradient={ true }
                gradientWidth={ 100 }
                autoFill={ true } >
                <div className='flex items-center justify-between'>
                    { slide1Img.map(image => (
                        <img src={ image } alt={ image } key={ uuidv4() } className='xs:w-16 mx-8 w-10 hover:scale-125 duration-1000 ease-in-out xs:py-5 py-3' />
                    )) }
                </div>
            </Marquee>
            <Marquee
                pauseOnHover={ true }
                className='cursor-pointer py-4  overflow-hidden'
                direction='right' speed={ 100 }
                gradient={ true }
                gradientWidth={ 100 }
                autoFill={ true } >
                <div className='flex items-center justify-between'>
                    { slide2Img.map(image => (
                        <img src={ image } alt={ image } key={ uuidv4() } className='w-16 mx-8 hover:scale-125 duration-1000 ease-in-out py-5' />
                    )) }
                </div>
            </Marquee>
            <Marquee
                pauseOnHover={ true }
                className='cursor-pointer  overflow-hidden'
                direction='right'
                speed={ 100 }
                gradient={ true }
                gradientWidth={ 100 }
                autoFill={ true }>
                <div className='flex items-center justify-between'>
                    { slide3Img.map(image => (
                        <img src={ image } alt={ image } key={ uuidv4() } className='w-16 mx-8 hover:scale-125 duration-1000 ease-in-out py-5' />
                    )) }
                </div>
            </Marquee>
        </div >
    );
}
