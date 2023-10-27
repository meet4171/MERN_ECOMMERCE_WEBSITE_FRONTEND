import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectItems, removeFromCartAsync, updateCartAsync, fetchCartItemsAsync, selectCartLoaded } from "../cart/cartSlice";
import { selectLoggedInUserToken } from "../auth/authSlice";
import { Link, Navigate } from "react-router-dom";
import { updateUserAsync, selectLoggedInUserInfo } from "../user/userSlice";
import { useForm } from 'react-hook-form'
import { addOrderAsync, selectCurrentOrder } from "../orders/orderSlice";
import Footer from "../comman/Footer";
import Navbar from "../comman/Navbar";
import Modal from "../comman/Modal";
import { loadStripe } from '@stripe/stripe-js';
import toast from "react-hot-toast";
import LoadingToast from "../comman/LoadingToast";
export default function CheckoutPage() {


    const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset } = useForm();

    const dispatch = useDispatch()
    const cartItems = useSelector(selectItems)
    const user = useSelector(selectLoggedInUserToken)
    const userInfo = useSelector(selectLoggedInUserInfo)
    const cartLoaded = useSelector(selectCartLoaded)
    const currentOrder = useSelector(selectCurrentOrder)
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod')
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isOpen, setIsOpen] = useState(false)
    const [selectedDeleteCartItem, setSelectedDeleteCartItem] = useState(-1)
    const [selectedDeleteShippingAddress, setSelectedDeleteShippingAddress] = useState(-1)
    const [redirectingToPay, setRedirectingToPay] = useState(false)


    function handleFirstName(e) {
        const value = e.target.value;
        setFirstName((value.charAt(0).toUpperCase() + value.slice(1)))
    }

    function handleLastName(e) {
        const value = e.target.value;
        setLastName((value.charAt(0).toUpperCase() + value.slice(1)))
    }

    useEffect(() => {

        reset()
        setFirstName('')
        setLastName('')
    }, [isSubmitSuccessful, reset])

    const subTotal = cartItems.reduce((amount, item) => (item.quantity * item.product.price) + amount, 0)
    const subTotalWithDiscount = cartItems.reduce((amount, item) => (item.quantity * item.product.discountedPrice) + amount, 0)
    const totalQunatity = cartItems.reduce((quantity, product) => product.quantity + quantity, 0)


    useEffect(() => {
        if (user) {
            dispatch(fetchCartItemsAsync())
        }
    }, [dispatch, user])

    useEffect(() => {
        if (currentOrder && currentOrder.selectedPaymentMethod === 'card') {
            setRedirectingToPay(true)
            makePayment();
        }
    }, [currentOrder]);

    function handleRemoveFromCart(itemId) {
        setSelectedDeleteCartItem(itemId)
        setIsOpen(true)

    }
    function handleConfirmDeleteCartItem() {
        dispatch(removeFromCartAsync({ itemId:selectedDeleteCartItem, toast }))
        setIsOpen(false)
        setSelectedDeleteCartItem(-1)

    }
    function handleConfirmDeleteShippingAddress() {
        const newAddresses = userInfo.addresses.filter((_, i) => i !== selectedDeleteShippingAddress);
        const updatedUser = { ...userInfo, addresses: newAddresses };
        dispatch(updateUserAsync({ update:updatedUser, toast, type: "REMOVE" }));
        setIsOpen(false)
        setSelectedDeleteShippingAddress(-1)

    }
    function handleCancleDelete() {
        setIsOpen(false)
        setSelectedDeleteShippingAddress(-1)
        setSelectedDeleteCartItem(-1)
    }
    function handleUpdateCart(e, item) {
        dispatch(updateCartAsync({ id: item.id, quantity: e.target.value }))
    }
    function handleAddAddress(data) {
        const updatedUser = { ...userInfo, addresses: [...userInfo.addresses, data] }
        dispatch(updateUserAsync({update:updatedUser, toast, type: "ADD"}))
    }
    function handleRemoveAddress(index) {

        if (userInfo.addresses.length > 1) {
            setSelectedDeleteShippingAddress(index)
            setIsOpen(true)
        } else {
            toast.error('Atleast 1 Shipping Address is Required !')

        }
    }

    function handleOrder() {
        const selectedAddress = userInfo.addresses[selectedAddressIndex]

        if (selectedPaymentMethod && selectedAddress) {
            const userId = userInfo.id
            const order = { userId, cartItems, totalQunatity, subTotal, subTotalWithDiscount, selectedAddress, selectedPaymentMethod, status: 'Pending' }
            dispatch(addOrderAsync(order))
        }
        else {
            toast.error('Shipping Address is required !')
        }
    }

    async function makePayment() {

        await loadStripe('pk_test_51NvJwwSBLTNKtMk3SqVAUARDUNVJrpGNswpGR31aSGuRoqZLRXcXEnCvKiKsVUF73Wj3fOOIyQSJVIE2ur0Gexwl00iZmgDlAR');

        const orderDetails = currentOrder
        const response = await fetch("/create-checkout-session", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderDetails)

        })
        if (response.ok) {
            const session = await response.json();

            if (session.url) {
                window.location.href = session.url
                setRedirectingToPay(false)
            } else {
                console.error("Missing session URL in response.");
            }
        } else {
            console.error("Failed to create a checkout session.");
        }
    }
    // Redirecting Loading toast
    useEffect(() => {
        if (redirectingToPay) {
            toast.custom(<LoadingToast message={ "Redirecting..." } duration={ Infinity } />);
        } else {
            toast.dismiss('loading-toast');
        }
        return () => {
            toast.dismiss('loading-toast')
        }
    }, [redirectingToPay]);


    return (
        <>
            <Navbar>


                { currentOrder && currentOrder.selectedPaymentMethod === 'cod' && (<Navigate to={ `/order-success/${currentOrder.id}` } replace={ true }></Navigate>) }
                { cartLoaded && !cartItems.length && (<Navigate to='/' replace={ true }></Navigate>) }
                <div className='mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-3 lg:px-14 lg:pb-24 lg:pt-1 bg-gray-100'>
                    {/* Shippment Information */ }

                    <div className="bg-white lg:border-r lg:border-gray-200 p-5 mt-5">
                        <form onSubmit={ handleSubmit((data) => { handleAddAddress(data) }) }>

                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Contact Information</h2>
                                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">

                                    <div className="sm:col-span-full">
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Email address
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="email"
                                                { ...register("email", { required: 'email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'enter a valid email address' } }) }
                                                type="email"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        { errors.email && (<p className='text-red-800'>*{ errors.email.message }</p>) }
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                            Phone
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                { ...register('phone', { required: 'phone number is required', pattern: { value: /(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})/g, message: 'enter a valid phone number' } }) }
                                                id="phone"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        { errors.phone && (<p className='text-red-800'>*{ errors.phone.message }</p>) }

                                    </div>
                                </div>
                            </div>


                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="mt-6 text-base font-semibold leading-7 text-gray-900">Shipping Information</h2>
                                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">

                                    <div className="sm:col-span-3">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                            First name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                { ...register("firstName", { required: 'first name is required', maxLength: { value: 10, message: 'max lenght should be 10' } }) }
                                                id="first-name"
                                                value={ firstName }
                                                onChange={ (e) => { handleFirstName(e) } }
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        { errors.firstName && (<p className='text-red-800'>*{ errors.firstName.message }</p>) }
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                            Last name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                { ...register("lastName", { required: 'first name is required', maxLength: 10 }) }
                                                value={ lastName }
                                                onChange={ (e) => handleLastName(e) }
                                                id="last-name"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        { errors.lastName && (<p className='text-red-800'>*{ errors.lastName.message }</p>) }

                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                                            Address
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                { ...register('address', { required: 'address is required' }) }
                                                id="address"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        { errors.address && (<p className='text-red-800'>*{ errors.address.message }</p>) }

                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="appartment-address" className="block text-sm font-medium leading-6 text-gray-900">
                                            Apartment, suite, etc.
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                { ...register('appartment', { required: 'appartment/suite is required' }) }
                                                id="appartment-address"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        { errors.appartment && (<p className='text-red-800'>*{ errors.appartment.message }</p>) }

                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                                            Country
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="country"
                                                { ...register('country', { required: 'Country is required' }) }
                                                name="country"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            >
                                                <option>India</option>
                                                <option>United States</option>
                                                <option>Canada</option>
                                                <option>Mexico</option>
                                            </select>
                                        </div>
                                        { errors.country && (<p className='text-red-800'>*{ errors.country.message }</p>) }

                                    </div>


                                    <div className="sm:col-span-3">
                                        <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                            City
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                { ...register('city', { required: 'city is required', maxLength: 13 }) }
                                                id="city"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        { errors.city && (<p className='text-red-800'>*{ errors.city.message }</p>) }

                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                                            State / Province
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                { ...register('state', { required: 'city is required', maxLength: 13 }) }
                                                id="state"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        { errors.state && (<p className='text-red-800'>*{ errors.state.message }</p>) }

                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="zip" className="block text-sm font-medium leading-6 text-gray-900">
                                            ZIP / Postal code
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="number"
                                                inputMode="numeric"
                                                { ...register('zip', { required: 'ZIP is required', }) }
                                                id="zip"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        { errors.zip && (<p className='text-red-800'>*{ errors.zip.message }</p>) }

                                    </div>
                                </div>
                                <div className="flex justify-end mt-8">
                                    <button type="reset" className="mx-8">Reset</button>
                                    <button type="submit" className="rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                    >Add</button>
                                </div>
                            </div>
                        </form>


                        <div className="border-b border-gray-900/10 pb-12 space-y-5">
                            <h2 className="mt-6 text-base font-semibold leading-7 text-gray-900">Addresses</h2>
                            {
                                userInfo && userInfo.addresses >= 1 &&
                                < p className="text-gray-500 text-sm">Choose an Address from the given Address</p>
                            }
                            { userInfo && userInfo.addresses < 1 && <p className="text-gray-500 text-sm">Add Address Now...</p>
                            }
                            { userInfo && userInfo.addresses.length > 0 && (
                                userInfo.addresses.map((address, index) => (
                                    <label htmlFor={ `address_info_${index}` } className="block text-sm font-medium leading-6 text-gray-900 group-hover:cursor-pointer">

                                        <fieldset className="outline outline-1 outline-gray-300 rounded-lg space-x-3 p-3 group cursor-pointer" key={ index }>
                                            <input
                                                id={ `address_info_${index}` }
                                                type="radio"
                                                defaultChecked={ index === 0 ? true : false }
                                                name="addressInfo"
                                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                onChange={ (e) => { setSelectedAddressIndex(index) } }
                                            />
                                            <h1 className="text-xl font-bold break-words">Shipping Address { index + 1 }</h1>

                                            <div className="flex flex-col justify-between sm:flex-row">
                                                <div className="flex flex-col">
                                                    <h4 className="text-md font-semibold">{ address.lastName + address.firstName }</h4>
                                                    <p>{ address.address }</p>
                                                    <p>{ address.appartment }</p>
                                                    <p>{ `${address.city} , ${address.state}` }</p>
                                                    <p>{ address.country }</p>
                                                    <p className="font-bold">{ address.zip }</p>
                                                </div>
                                                {
                                                    selectedDeleteShippingAddress === index &&
                                                    <Modal
                                                        message={ `Are you Sure you want to delete ?` }
                                                        title={ `Delete Shipping Address ${index + 1}` }
                                                        isOpen={ isOpen }
                                                        buttonOne='Delete'
                                                        buttonTwo='Cancle'
                                                        buttonOneHandler={ handleConfirmDeleteShippingAddress }
                                                        buttonTwoHandler={ handleCancleDelete }

                                                    />
                                                }

                                                <div className="flex flex-wrap flex-col items-start gap-y-2">
                                                    <p className="text-gray-700">{ address.phone }</p>
                                                    <p className="text-gray-700 break-all">{ address.email }</p>

                                                    <button
                                                        onClick={ () => { handleRemoveAddress(index) } }
                                                        type="button"
                                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </label>

                                ))
                            ) }

                        </div>



                        {/* Payment Method */ }


                        <div className="sm:col-span-full">
                            <div className="my-5 text-base font-semibold leading-7 text-gray-900">Payments</div>
                            <div className="grid sm:grid-cols-2 grid-cols-1">
                                <div>
                                    <input type='radio' id="cod" name="payment" onChange={ (e) => { setSelectedPaymentMethod(e.target.value) } } value={ 'cod' }
                                        defaultChecked={ true }
                                    />
                                    <label htmlFor="cod" className="text-sm font-medium leading-6 text-gray-900 ml-2 mr-5 break-keep">
                                        Cash on Delivery

                                    </label>
                                </div>


                                <div>
                                    <input type='radio' id="card" name="payment" onChange={ (e) => { setSelectedPaymentMethod(e.target.value) } } value={ 'card' }
                                    />

                                    <label htmlFor="card" className="text-sm font-medium leading-6 text-gray-900 ml-2 mr-5">
                                        Card
                                    </label>
                                </div>

                            </div>
                        </div>

                    </div >

                    {/* Shopping Cart */ }

                    < div className='bg-white lg:border-r lg:border-gray-200 p-5 mt-5' >
                        <h1 className='text-lg font-semibold leading-7 mb-6'>Shopping Cart</h1>
                        <div>
                            <div className="flow-root">
                                <ul className="-my-6 divide-y divide-gray-200">
                                    { cartItems.map((item) => (
                                        <li key={ item.product.id } className="flex py-6 flex-col sm:flex-row">
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                <img
                                                    src={ item.product.images[0] }
                                                    alt={ 'itemImage' }
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div className="flex flex-col xs:flex-row justify-between text-base font-medium text-gray-900">
                                                    <div>
                                                        <h4>{ item.product.title }</h4>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">₹{ item.product.discountedPrice }</p>
                                                        <p className="text-sm font-medium text-gray-500 line-through">₹{ item.product.price }</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col  xs:flex-row flex-1 items-start xs:items-end justify-between text-sm">
                                                    <p className="text-gray-500">Qty
                                                        <select className='mx-3 my-3' onChange={ (e) => handleUpdateCart(e, item) } value={ item.quantity }>
                                                            { item.product.stock >= 1 && <option value={ 1 }>1</option>
                                                            }
                                                            { item.product.stock >= 2 && <option value={ 2 }>2</option>
                                                            }
                                                            { item.product.stock >= 3 && <option value={ 3 }>3</option>
                                                            }
                                                            { item.product.stock >= 4 && <option value={ 5 }>4</option>
                                                            }
                                                            { item.product.stock >= 5 && <option value={ 5 }>5</option>
                                                            }
                                                        </select>
                                                    </p>
                                                    {
                                                        selectedDeleteCartItem === item.id &&
                                                        <Modal
                                                            message={ `Are you Sure you want to delete ?` }
                                                            title={ `Delete ${item.product.title}` }
                                                            isOpen={ isOpen }
                                                            buttonOne='Delete'
                                                            buttonTwo='Cancle'
                                                            buttonOneHandler={ handleConfirmDeleteCartItem }
                                                            buttonTwoHandler={ handleCancleDelete }

                                                        />
                                                    }
                                                    <div className="flex">
                                                        <button
                                                            type="button"
                                                            onClick={ () => { handleRemoveFromCart(item.id) } }

                                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )) }
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                            <div className="flex text-base font-medium text-gray-900 justify-between items-baseline">
                                <p>Total Quantity</p>
                                <p className="text-sm font-medium">{ totalQunatity > 1 ? `${totalQunatity} items` : `${totalQunatity} item` }</p>
                            </div>
                            <div className="flex text-base font-medium text-gray-900 justify-between items-baseline">
                                <p>Subtotal</p>
                                <div className="flex space-x-3">
                                    <p className="text-sm font-medium bg-yellow-200">₹{ subTotalWithDiscount }</p>
                                </div>
                            </div>
                            <div className="flex text-base font-medium text-gray-900 justify-between items-baseline">
                                <p>You Saved</p>
                                <p className="text-sm font-medium text-gray-500">₹{ subTotal - subTotalWithDiscount }</p>
                            </div>
                            <div className="mt-6">
                                <button
                                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-1 xs:px-6 xs:py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                    onClick={ handleOrder }
                                >
                                    Order Now
                                </button>
                            </div>
                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                <p>
                                    <Link to='/'>
                                        <button
                                            type="button"
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            or Continue Shopping
                                            <span aria-hidden="true"> &rarr;</span>
                                        </button>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div >
                </div >

            </Navbar>
            <Footer></Footer>
        </>
    )
};

