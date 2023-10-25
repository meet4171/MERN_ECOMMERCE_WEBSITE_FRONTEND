import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, NavLink, Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectItems } from '../cart/cartSlice'
import Avatar from 'react-avatar'
import Modal from '../comman/Modal'
import { selectLoggedInUserInfo } from '../user/userSlice'
import Marquee from 'react-fast-marquee'
import Skeleton from 'react-loading-skeleton'

const userNavigation = [
    { name: 'My Profile', link: '/user-profile' },
    { name: 'My Orders', link: '/user-orders' },
    { name: 'Sign out', link: '/logout' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Navbar({ children }) {
    const cartItems = useSelector(selectItems)
    const userInfo = useSelector(selectLoggedInUserInfo)
    const location = useLocation()
    const [currentPage, setCurrentPage] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [modalForLinkIndex, setModalForLinkIndex] = useState(-1)
    const [logoutYesOrNo, setLogoutYesOrNo] = useState(false)

    useEffect(() => {

        setCurrentPage(location.pathname)
    }, [location])
    function handleLogout(index) {
        setModalForLinkIndex(-1)
        setModalForLinkIndex(index)
        setIsOpen(true)
    }
    function yesLogout() {
        setLogoutYesOrNo(true)
        setIsOpen(false)
        setModalForLinkIndex(-1)
    }
    function noLogout() {
        setIsOpen(false)
        setModalForLinkIndex(-1)

    }

    return (
        <>
            { logoutYesOrNo && <Navigate to='/logout' replace={ true }></Navigate> }
            <div className="min-h-full">
                <Disclosure as="nav" className="bg-gray-800">
                    { ({ open }) => (
                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex h-16 items-center justify-between">
                                    <div className="flex items-center">
                                        <Link to='/'>
                                            <div className="flex-shrink w-fit text-white font-kaushan sm:text-2xl text-lg hover:animate-vibrate">
                                                TrendCart.com
                                            </div>
                                        </Link>
                                        <div className="hidden md:block">
                                            <div className="ml-10 flex items-baseline space-x-4">
                                                <NavLink
                                                    to="/"
                                                    className={ ({ isActive }) =>
                                                        isActive ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                                    }
                                                >
                                                    Home
                                                </NavLink>
                                                <NavLink

                                                    to="/user-profile"
                                                    className={ ({ isActive }) =>
                                                        isActive ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                                    }
                                                >
                                                    Profile
                                                </NavLink>
                                                <NavLink

                                                    to="/user-orders"
                                                    className={ ({ isActive }) =>
                                                        isActive ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                                    }
                                                >
                                                    Orders
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">
                                            <Link to='/cart'>
                                                <button
                                                    id='cartIcon'
                                                    type="button"
                                                    className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                                >
                                                    <span className="sr-only">Shpping Cart</span>
                                                    <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                                                </button>
                                            </Link>
                                            <label htmlFor="cartIcon">
                                                { cartItems.length > 0 && (<span className="inline-flex items-center rounded-md bg-gray-50 px-1 py-1/2 mb-4 -ml-3 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 cursor-pointer">
                                                    { cartItems.length }
                                                </span>
                                                ) }
                                            </label>
                                            {/* Profile dropdown */ }
                                            <Menu as="div" className="relative ml-3">
                                                <div>
                                                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                        <span className="sr-only">Open user menu</span>
                                                        { userInfo ?
                                                            <Avatar
                                                                key={ 1 }
                                                                name={ userInfo.username }
                                                                size="40"
                                                                round={ true }
                                                                className="cursor-pointer mx-auto"
                                                            />

                                                            : <Skeleton
                                                                height={ 45 }
                                                                width={ 45 }
                                                                circle={ true }
                                                                baseColor={ "#8c7e7e" }
                                                            />
                                                        }


                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={ Fragment }
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        {
                                                            userNavigation.map((item, index) => (
                                                                <Menu.Item key={ item.name }>
                                                                    { ({ active }) => (
                                                                        <>

                                                                            { modalForLinkIndex === index && (
                                                                                <Modal
                                                                                    message={ '' }
                                                                                    title={ 'Are you Sure you want to Logout' }
                                                                                    isOpen={ isOpen }
                                                                                    buttonOne="Yes"
                                                                                    buttonTwo="No"
                                                                                    buttonOneHandler={ yesLogout }
                                                                                    buttonTwoHandler={ noLogout }
                                                                                />
                                                                            ) }
                                                                            { item.link !== '/logout' ? (
                                                                                <Link
                                                                                    to={ item.link }
                                                                                    className={ classNames(
                                                                                        active ? 'bg-gray-100' : '',
                                                                                        'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-700 hover:text-white'
                                                                                    ) }
                                                                                >
                                                                                    { item.name }
                                                                                </Link>
                                                                            ) : (
                                                                                <button
                                                                                    onClick={ () => {

                                                                                        setModalForLinkIndex(index);
                                                                                        handleLogout(index);
                                                                                    } }
                                                                                    className={ classNames(
                                                                                        active ? 'bg-gray-100' : '',
                                                                                        'block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-700 hover:text-white'
                                                                                    ) }
                                                                                >
                                                                                    { item.name }
                                                                                </button>
                                                                            ) }
                                                                        </>
                                                                    ) }
                                                                </Menu.Item>
                                                            ))
                                                        }



                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>
                                    </div>
                                    <div className="-mr-2 flex md:hidden">
                                        {/* Mobile menu button */ }
                                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">Open main menu</span>
                                            { open ? (
                                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                            ) }
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </div>

                            <Disclosure.Panel className="md:hidden">
                                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                                    <NavLink

                                        to="/"
                                        className={ ({ isActive }) =>
                                            isActive ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                        }
                                    >
                                        Home
                                    </NavLink>
                                    <NavLink

                                        to="/user-profile"
                                        className={ ({ isActive }) =>
                                            isActive ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                        }
                                    >
                                        Profile
                                    </NavLink>
                                    <NavLink

                                        to="/user-orders"
                                        className={ ({ isActive }) =>
                                            isActive ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                        }
                                    >
                                        Orders
                                    </NavLink>
                                    {
                                        isOpen && <Modal
                                            message={ '' }
                                            title={ 'Are you Sure you want to Logout' }
                                            isOpen={ isOpen }
                                            buttonOne="Yes"
                                            buttonTwo="No"
                                            buttonOneHandler={ yesLogout }
                                            buttonTwoHandler={ noLogout }
                                        />
                                    }

                                    <button
                                        onClick={ () => { setIsOpen(true) } }
                                        className="hover:bg-gray-700 text-gray-300 hover:text-white rounded-md px-3 text-sm font-medium py-2">Sign Out</button>
                                </div>
                                <div className="border-t border-gray-700 pb-3 pt-4">
                                    <div className="flex items-center justify-between px-5">
                                        { userInfo ?
                                            <div className="flex-shrink-0 flex gap-x-3">

                                                <Avatar
                                                    key={ 2 }
                                                    name={ userInfo.username }
                                                    size="40"
                                                    round={ true }
                                                    className="cursor-pointer"
                                                />
                                                <div className='self-end space-y-2'>
                                                    <p className="text-base font-medium leading-none text-white">{ userInfo.username }</p>
                                                    <p className="text-sm font-medium leading-none text-gray-400">{ userInfo.email }</p>

                                                </div>
                                            </div>
                                            :

                                            <Skeleton
                                                height={ 45 }
                                                width={ 45 }
                                                circle={ true }
                                                baseColor={ "#8c7e7e" }
                                            />
                                        }

                                        <div>
                                            <Link to='/cart'>
                                                <button
                                                    type="button"
                                                    className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer"
                                                    id='cartIconMobile'

                                                >
                                                    <span className="sr-only">View notifications</span>
                                                    <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                                                </button>
                                            </Link>
                                            <label htmlFor="cartIconMobile">
                                                { cartItems.length > 0 && (


                                                    <span className="inline-flex items-center rounded-md bg-gray-50 px-1 py-1/2 mb-4 -ml-3 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 cursor-pointer">
                                                        { cartItems.length }
                                                    </span>

                                                ) }
                                            </label>
                                        </div>

                                    </div>

                                </div>
                            </Disclosure.Panel>
                        </>
                    ) }
                </Disclosure>

                <header className="bg-white shadow">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 py-3 mx-auto w-fit">

                        { currentPage === '/' ?
                            (

                                <Marquee
                                    pauseOnHover={ true }
                                    className='cursor-pointer overflow-hidden text-gray-500 tracking-wide font-extrabold font-Comfortaa mb-2 shadow-lg py-3 text-xs sm:text-lg'
                                    direction='right'
                                    speed={ 50 }
                                    autoFill={ true }
                                >
                                    Smartphones | Laptops | Tablets | Cameras | Headphones | Clothing | Dresses | Shirts | Pants | Shoes | Accessories | Furniture | Home Decor, Kitchen Appliances | Bedding | Cosmetics | Skincare Products | Vitamins Supplements | Fitness Equipment | Books | E-Books | Music | Movies | Video Games | Toys | Board Games |  Car Parts | Automotive tools
                                    | Stationary | Pet Food | Grooming Products | DIY tools | Rare Collectibles and Antiques | Handcrafted art | Jewelry | Unique handmade products |
                                </Marquee>
                            )
                            : currentPage === '/user-orders' ? 'Orders' : currentPage === '/cart' ? 'Shopping Cart' : currentPage === '/user-profile' ? 'Profile' : currentPage === '/checkout' ? 'Checkout' : currentPage === '/order-cancalled/' ? 'Payment Error !' : 'Product Detail' }
                    </h1>

                </header>

                <main>
                    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{ children }</div>
                </main>
            </div >
        </>
    )
}
export default Navbar;