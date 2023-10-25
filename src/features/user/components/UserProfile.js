import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import Avatar from 'react-avatar';
import { useForm } from 'react-hook-form'
import { selectLoggedInUserInfo, selectUserInfoLoaded, updateUserAsync } from "../userSlice";
import { React, useState, useEffect, Fragment } from 'react'
import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline'
import { toast } from "react-hot-toast";
import Modal from "../../comman/Modal"

function UserProfile() {
    const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset } = useForm();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [isOpen, setIsOpen] = useState(false)
    const [selectedDeleteItem, setSelectedDeleteItem] = useState(-1)
    const [modalData, setModalData] = useState({
        isOpen: false,
        addOrEdit: null,
    });

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

    const [data, setData] = useState({})

    const dispatch = useDispatch()
    const userInfoLoaded = useSelector(selectUserInfoLoaded)
    const userInfo = useSelector(selectLoggedInUserInfo)

    function handleConfirmDelete() {

        const newAddresses = userInfo.addresses.filter((_, i) => i !== selectedDeleteItem);
        const updatedUser = { ...userInfo, addresses: newAddresses };
        dispatch(updateUserAsync({ updatedUser, toast, type: "REMOVE" }));

        setIsOpen(false)

        setSelectedDeleteItem(-1)

    }
    function handleCancleDelete() {

        setIsOpen(false)
        setSelectedDeleteItem(-1)
    }

    function handleAddAddress(data) {
        const updatedUser = {
            ...userInfo, addresses: [...userInfo.addresses, data]
        }
        dispatch(updateUserAsync({ updatedUser, toast, type: "ADD" }))
    }
    function handleEditForm(index) {
        setEditIndex(index)
        setData({ ...userInfo.addresses[index] })
        setModalData({
            addOrEdit: 'edit',
            isOpen: true,
        });

    }
    function handleEdit(editedAddress) {
        const updatedAddresses = [...userInfo.addresses];
        updatedAddresses.splice(editIndex, 1, editedAddress);

        const updatedUser = { ...userInfo, addresses: updatedAddresses };
        dispatch(updateUserAsync({updatedUser,toast,type:"EDITED"}));

        setEditIndex(null);
        setModalData({ ...modalData, isOpen: false });
        toast.success('Edited Successfully')
    }

    function handleRemoveAddress(index) {
        if (userInfo.addresses.length > 1) {

            setSelectedDeleteItem(index)
            setIsOpen(true)
        }
        else {

            toast.error('Atleast one Shipping Address is needed')

        }
    }

    return userInfo ? (



        <div className="bg-gray-100 min-h-screen flex justify-center">

            {/* Add / Edit Address modal */ }

            <div className="flex justify-center items-center min-h-screen bg-gray-100">

                <Transition show={ modalData.isOpen } as={ Fragment } >
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen">
                            {/* Background overlay */ }
                            <Transition.Child
                                as={ Fragment }
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
                            </Transition.Child>

                            {/* Modal content */ }
                            <Transition.Child
                                as={ Fragment }
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div className="bg-white rounded-lg shadow-2xl w-full sm:max-w-2xl md:p-8 lg:max-w-4xl">
                                    <button
                                        type="button"
                                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-6 sm:right-6 lg:top-8 lg:right-8"
                                        onClick={ () => { setModalData({ ...modalData, isOpen: false }) } }
                                    >
                                        <XMarkIcon className="sm:w-8 sm:h-8 w-5 h-5">
                                            <span className="sr-only">Close</span>
                                        </XMarkIcon>
                                    </button>

                                    <div className="sm:col-span-8 lg:col-span-10 p-5">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4 underline underline-offset-8 decoration-gray-500">
                                            { modalData.addOrEdit === 'add' ? 'Add New Address' : `Edit Address ${editIndex + 1}` }
                                        </h2>

                                        <section>
                                            <form
                                                noValidate
                                                onSubmit={ handleSubmit((data) => {
                                                    if (modalData.addOrEdit === 'add') {

                                                        handleAddAddress(data);
                                                    }
                                                    else {
                                                        handleEdit(data)
                                                    }

                                                }) }
                                            >
                                                <div className="border-b border-gray-900/10 pb-12">
                                                    <h2 className="text-base font-semibold leading-7 text-gray-900">Contact Information</h2>
                                                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">

                                                        <div className="sm:col-span-full">
                                                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Email address
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    placeholder={ modalData.addOrEdit === 'edit' ? data.email : '' }
                                                                    { ...register("email", { required: 'email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'enter a valid email address' } }) }
                                                                    type="email"
                                                                    className="block 
                                                                    w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                                                    placeholder={ modalData.addOrEdit === 'edit' ? data.phone : '' }
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
                                                                    placeholder={ modalData.addOrEdit === 'edit' ? data.firstName : '' }
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
                                                                    placeholder={ modalData.addOrEdit === 'edit' ? data.lastName : '' }
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
                                                                    placeholder={ modalData.addOrEdit === 'edit' ? data.address : '' }
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
                                                                    placeholder={ modalData.addOrEdit === 'edit' ? data.appartment : '' }
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
                                                                    placeholder={ modalData.addOrEdit === 'edit' ? data.country : '' }
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
                                                                    placeholder={ modalData.addOrEdit === 'edit' ? data.city : '' }
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
                                                                    placeholder={ modalData.addOrEdit === 'edit' ? data.state : '' }
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
                                                                    placeholder={ modalData.addOrEdit === 'edit' ? data.zip : '' }
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

                                                </div>

                                                <div className="flex justify-end mt-8">
                                                    { modalData.addOrEdit === 'add' && (<button
                                                        type="reset"
                                                        className="mx-2 px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                                                    >
                                                        Reset
                                                    </button>) }
                                                    { modalData.addOrEdit === 'edit' && (<button
                                                        className="mx-2 px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                                                        onClick={ () => { setModalData({ ...modalData, isOpen: false }) } }
                                                    >
                                                        Cancle
                                                    </button>) }
                                                    <button
                                                        type="submit"
                                                        className="mx-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                                    >
                                                        { modalData.addOrEdit === 'add' ? 'Add' : 'Edit' }
                                                    </button>
                                                </div>
                                            </form>
                                        </section>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </div>
                </Transition>
            </div>


            {/* Display User Information  */ }

            < div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full flex flex-col items-center" >

                <Avatar
                    name={ userInfo.username }
                    size="100"
                    round={ true }
                    className="cursor-pointer mx-auto mb-4"
                    style={ { fontSize: '48px' } }
                />
                <h1 className="text-2xl font-semibold mb-2">{ userInfo.username }</h1>
                <p className="text-gray-600 mb-4">{ userInfo.email } </p>
                <div className="border-t border-gray-300 pt-4 flex flex-col justify-center w-full">

                    <h1 className="text-2xl my-5 font-semibold">Shipping addresses</h1>
                    { userInfo.addresses.map((address, index) => (
                        <div key={ index } className="my-5">
                            <h1 className="font-bold">Shipping address { index + 1 }</h1>
                            { Object.entries(address).map(([key, value], index) => (
                                <p className="text-gray-600" key={ index }>
                                    { key } : { value }
                                </p>
                            )) }
                            {
                                selectedDeleteItem === index &&
                                <Modal
                                    message={ `Are you Sure you want to delete ` }
                                    title={ `Delete Shipping Address ${index + 1}` }
                                    isOpen={ isOpen }
                                    buttonOne='Delete'
                                    buttonTwo='Cancle'
                                    buttonOneHandler={ handleConfirmDelete }
                                    buttonTwoHandler={ handleCancleDelete }

                                />
                            }
                            <button
                                onClick={ (e) => { handleRemoveAddress(index) } }
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Remove
                            </button>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button
                                onClick={ (e) => { handleEditForm(index) } }
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Edit
                            </button>
                        </div>

                    )) }
                </div>
                <button
                    className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={ () => { setModalData({ ...modalData, isOpen: true, addOrEdit: 'add' }) } }
                >
                    Add New Address
                </button>
                { userInfo.addresses < 1 && (<>
                    <p className='text-gray-500 text-center mt-10'>

                        No Addresses Add Now
                    </p>
                    <button
                        onClick={ () => { setModalData({ ...modalData, isOpen: true, addOrEdit: 'add' }) } }

                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 } stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>

                    </button>
                </>
                ) }


            </div >
        </div >) : (userInfoLoaded && <Navigate to='/login'></Navigate >)
}


export default UserProfile