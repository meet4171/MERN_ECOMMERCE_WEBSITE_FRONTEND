import { useForm } from 'react-hook-form';
import { useEffect, useState } from "react";
import { resetPasswordRequestAsync, selectError, selectMailSend, setErrorNull } from "../authSlice";
import { useSelector, useDispatch } from "react-redux";
import LoadingToast from '../../comman/LoadingToast';
import toast from 'react-hot-toast';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom';


export default function ForgetPassword() {
    const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset } = useForm();
    const dispatch = useDispatch();
    const error = useSelector(selectError);
    const [show, setShow] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const mailSend = useSelector(selectMailSend)

    useEffect(() => {
        dispatch(setErrorNull());
        reset();
    }, [dispatch, isSubmitSuccessful, reset]);

    const handleResetPassword = (data) => {
        setIsSubmitted(true)
        setShow(true)
        dispatch(resetPasswordRequestAsync({ email: data.email }));
    };
    useEffect(() => {
        if (mailSend === null && isSubmitted) {
            setShow(true)
        }
        else {
            toast.dismiss('loading-toast')
            setShow(false)
        }
        if (mailSend) {
            toast.dismiss('loading-toast')
            setShow(false)
            toast.success('Mail Send Successfully', { duration: 5000 })

        }
        if (error != null && isSubmitted) {
            setShow(false)
            toast.dismiss('loading-toast')

        }
    }, [mailSend, isSubmitted, error])


    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            { show && <LoadingToast message={ "Sending Mail...." } duration={ Infinity } /> }
            <Link to={'/'} >
                <ArrowLeftCircleIcon className='h-10 w-10'></ArrowLeftCircleIcon>
            </Link>

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
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Reset Password
                        </button>
                        { error && <p className="text-red-500 text-2xl">{ error }</p> }
                        { mailSend && <p className="text-green-500 text-2xl">{ mailSend } check your indox for the reset link</p> }
                    </div>
                </form>
            </div>
        </div>
    );
}
