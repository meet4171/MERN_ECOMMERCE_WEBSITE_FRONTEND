import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUserAsync, logoutAsync, selectError, selectLoggedInUserToken, selectLoginStatus } from "../authSlice";
import { selectLoggedInUserInfo } from "../../user/userSlice";
import toast from "react-hot-toast";
import LoadingToast from "../../comman/LoadingToast";

function Signup() {
    const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset } = useForm();
    const dispatch = useDispatch()
    const user = useSelector(selectLoggedInUserInfo)
    const userToken = useSelector(selectLoggedInUserToken)
    const signUpStatus = useSelector(selectLoginStatus)
    const error = useSelector(selectError)
    const [show, setShow] = useState(false)

    useEffect(() => {
        dispatch(logoutAsync())
    }, [dispatch])

    useEffect(() => {
        reset()
    }, [isSubmitSuccessful, reset])

    useEffect(() => {
        if (signUpStatus === 'loading' && error === null) {
            setShow(true)
        } else {
            setShow(false)
            toast.dismiss('loading-toast')
        }
    }, [signUpStatus, error])


    if (userToken && user && signUpStatus === 'idle') {
        if (user.role === 'user') {
            return <Navigate to='/' replace={ true } />;
        }
        if (user.role === 'admin') {
            return <Navigate to='/admin' replace={ true } />;
        }

    }

    return (
        < div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8" >
            {
                show && <LoadingToast message={ "Signing In..." } duration={ Infinity } />
            }
            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
                <div className="flex-shrink w-fit font-kaushan sm:text-3xl text-2xl underline underline-offset-4">
                    TrendCart.com
                </div>
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Create a New Account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={ handleSubmit((data) => { dispatch(createUserAsync({ username: data.userName, email: data.email, password: data.password })) }) } noValidate >

                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium leading-6 text-gray-900">
                            UserName
                        </label>
                        <div className="mt-2">
                            <input
                                id="userName"
                                { ...register("userName", {
                                    required: 'user name is required', maxLength: {
                                        value: 20,
                                        message: 'max length should be 20'
                                    }
                                }) }
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        { errors.userName && (<p className="text-red-500">*{ errors.userName.message }</p>) }
                    </div>

                    <div>
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
                        { errors.email && (<p className="text-red-500">*{ errors.email.message }</p>) }
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                { ...register("password", {
                                    required: 'Password is required',
                                    pattern: {
                                        value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                                        message: `- at least 8 characters\n- must contain at 1 letter, 1 lowercase letter, and 1 number\n- Can contain special characters`
                                    }
                                }) }
                                type="password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        { errors.password && (<p className="text-red-500">{ errors.password.message.split('\n', 3).map((error, index) => (<span key={ index } >{ error }<br /></span>)) }</p>) }

                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                Confirm Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="confirmPassword"
                                { ...register("confirmPassword", {
                                    required: 'confirm-password is required',
                                    validate: (value, formValues) => value === formValues.password || 'password does not match'

                                }) }
                                type="password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        { errors.confirmPassword && (<p className="text-red-500">*{ errors.confirmPassword.message }</p>) }

                    </div>

                    <div className="grid grid-cols-2">
                        <button
                            type="submit"
                            className="flex flex-1 w-1/2  place-self-start justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Signup

                        </button>
                        <button
                            type="reset"
                            className="flex flex-1 w-1/2  justify-center place-self-end rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Reset

                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already a User ?{ ' ' }
                    <Link to='/login' className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Login Now
                    </Link>
                </p>
            </div>
        </div >
    )
}
export default Signup;