import { useForm } from 'react-hook-form';
import { useEffect, useState } from "react";
import { resetPasswordAsync, setErrorNull, selectPassReseted, selectError } from "../authSlice";
import { useSelector, useDispatch } from "react-redux";
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline'
import LoadingToast from '../../comman/LoadingToast';

export default function ResetPassword() {
    const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset } = useForm();
    const dispatch = useDispatch();
    const error = useSelector(selectError);
    const passReseted = useSelector(selectPassReseted);
    const [show, setShow] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)




    // Extracting the token from the query string send by server
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString)
    const token = params.get('token')
    const email = params.get('email')

    useEffect(() => {
        if (passReseted) {
            toast.dismiss('loading-toast')
            setShow(false)
            toast.success('Password Reset Successfully', {
                duration: 3000
            })

        }
        else if (passReseted === false && isSubmitted) {
            setShow(true)
        }
        else {
            toast.dismiss('loading-toast')
            setShow(false)
        }

    }, [passReseted, isSubmitted])

    useEffect(() => {
        dispatch(setErrorNull());
        reset();
    }, [dispatch, isSubmitSuccessful, reset]);

    const handleResetPassword = (data) => {
        setIsSubmitted(true)
        setShow(true)
        dispatch(resetPasswordAsync({ email, token, newPassword: data.password, }));
    };

    return (

        (email && token) ? (
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <Link to={ '/' } >
                    <ArrowLeftCircleIcon className='h-10 w-10'></ArrowLeftCircleIcon>
                </Link>
                { show && <LoadingToast message={ "Reseting Password...." } duration={ Infinity } /> }

                <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
                    <div className="flex-shrink w-fit font-kaushan sm:text-3xl text-2xl underline underline-offset-4">
                        TrendCart.com
                    </div>
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Reset Password
                    </h2>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={ handleSubmit((data) => handleResetPassword(data)) } noValidate>


                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    New Password
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
                                    Confirm New Password

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


                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Set New Password
                            </button>
                            { error && <p className="text-red-500 text-2xl">{ error }</p> }
                            { passReseted && <p className="text-green-500 text-2xl"> { passReseted } </p> }
                        </div>
                    </form>
                </div>
            </div>
        ) : (<div><p className='text-red-500 text-2xl text-center'>Either email or token was not send by the server ! Try again ! </p>
            <Link to={ '/reset-password-request' }>
                <p className='text-center text-blue-500 underline'>
                    Back to Reset Request Page
                </p>
            </Link>
        </div>)
    )
}
