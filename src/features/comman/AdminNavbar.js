import { Fragment, useEffect, useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, NavLink, useLocation, Navigate } from 'react-router-dom'
import Modal from '../comman/Modal'




export default function AdminNavbar({ children }) {

    const location = useLocation()
    const [currentPage, setCurrentPage] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [logoutYesOrNo, setLogoutYesOrNo] = useState(false)

    function yesLogout() {
        setLogoutYesOrNo(true)
        setIsOpen(false)
    }
    function noLogout() {
        setIsOpen(false)
    }


    useEffect(() => {

        setCurrentPage(location.pathname)
    }, [location])

    return (
        <>
            { logoutYesOrNo && <Navigate to='/logout' replace={ true }></Navigate> }

            <div className="min-h-full">
                <Disclosure as="nav" className="bg-gray-800">
                    { ({ open }) => (
                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 pt-3 xs:pb-0 xs:pt-0">
                                <div className="flex h-16 items-center justify-between flex-col xs:flex-row">
                                    <div className="flex items-center">
                                        <Link to='/admin'>
                                            <div className="flex-shrink w-fit text-white font-kaushan text-2xl">
                                                TrendCart.com
                                            </div>
                                        </Link>

                                        <div className="hidden xmd:block">
                                            <div className="ml-10 flex items-baseline space-x-4">
                                                <NavLink
                                                    to="/admin"
                                                    end
                                                    className={ ({ isActive }) =>
                                                        isActive ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                                    }
                                                >
                                                    Products
                                                </NavLink>
                                                <NavLink
                                                    to="/admin/orders"
                                                    className={ ({ isActive }) =>
                                                        isActive ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                                    }
                                                >
                                                    Orders
                                                </NavLink>

                                                {
                                                    isOpen && <Modal
                                                        message={ '' }
                                                        title={ 'Are you Sure you want to sign out' }
                                                        isOpen={ isOpen }
                                                        buttonOne="Yes"
                                                        buttonTwo="No"
                                                        buttonOneHandler={ yesLogout }
                                                        buttonTwoHandler={ noLogout }
                                                    />
                                                }

                                                <button
                                                    onClick={ () => { setIsOpen(true) } }
                                                    className="hover:bg-gray-700 text-gray-300 hover:text-white rounded-md px-3 text-sm font-medium py-2 break-keep">Sign Out</button>


                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className='text-xs sm:text-lg text-white text-center'>Website Administrator</h1>
                                    </div>


                                    <div className="-mr-2 flex xmd:hidden mt-3 xs:mt-0">
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

                            <Disclosure.Panel className="md:hidden text-center xs:text-left">
                                <div className="space-y-1 px-2 pb-5 pt-2 sm:px-3">
                                    <NavLink

                                        to="/admin"
                                        className={ ({ isActive }) =>
                                            isActive ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                        }
                                    >
                                        Products
                                    </NavLink>

                                </div>
                                <div className="space-y-1 px-2 pb-5 pt-2 sm:px-3">
                                    <NavLink

                                        to="/admin/orders"
                                        className={ ({ isActive }) =>
                                            isActive ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                        }
                                    >
                                        Orders
                                    </NavLink>

                                </div>
                                <div className="space-y-1 px-2 pb-5 pt-2 sm:px-3">
                                    <button
                                        onClick={ () => { setIsOpen(true) } }
                                        className="hover:bg-gray-700 text-gray-300 hover:text-white rounded-md px-3 text-sm font-medium py-2 break-keep">Sign Out</button>

                                </div>

                            </Disclosure.Panel>
                        </>
                    ) }
                </Disclosure>

                <header className="bg-white shadow">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 py-3 mx-auto w-fit">

                        { currentPage === '/admin' ? 'All Products' : currentPage === '/admin/product-form/add' ? 'Add New Product' : currentPage === '/admin/orders' ? 'All Orders' : 'Edit Product' }
                    </h1>

                </header>
                <main>
                    <div>{ children }</div>
                </main>
            </div >
        </>
    )
}
