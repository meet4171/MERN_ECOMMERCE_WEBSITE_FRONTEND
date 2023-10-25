import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersByUserAsync, selectOrdersByUser, selectLoggedInUserInfo, selectUserOrdersLoaded } from "../userSlice";
import { Navigate } from "react-router-dom";
import { selectStatusColor } from "../../../app/constants";


function UserOrders() {

    const dispatch = useDispatch()
    const userInfo = useSelector(selectLoggedInUserInfo)
    const orders = useSelector(selectOrdersByUser)
    const userOrderLoaded = useSelector(selectUserOrdersLoaded)

    useEffect(() => {
        dispatch(fetchOrdersByUserAsync())

    }, [dispatch, userInfo])





    return (
        orders?.length > 0 ? orders.map((order) => (
            < div className='bg-white px-8 shadow-2xl sm:px-6  sm:pt-5 md:p-6 lg:p-8 mx-2 my-8 py-6' key={ order.id }>

                <h1 className='text-sm sm:text-xl md:text-2xl font-bold tracking-tight text-gray-900 my-4'>Order # { order.id }</h1>
                { order.createdAt && <h3 className="text-sm sm:text-md md:text-xl">Order Placed On: { new Date(order.createdAt).toLocaleString() }</h3> }
                { order.updatedAt && order.updatedAt !== order.createdAt && <h3 className="text-sm sm:text-sm md:text-xl" > Last Updated On: { new Date(order.updatedAt).toLocaleString() }</h3> }
                <div>
                    <div className="flex my-3 space-x-2">
                        <span className="text-sm sm:text-lg font-semibold">Order Status:</span>
                        <h1 className={ `text-sm sm:text-md font-semibold xs:px-1 xs:py-1 ${selectStatusColor(order.status)}` }>{ order.status }</h1>
                    </div>

                    <div className="flow-root">
                        <ul className="-my-6 divide-y divide-gray-200">
                            { order.cartItems.map((cartItem) => (
                                <li key={ cartItem.id } className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        < img
                                            src={ cartItem.product.images[0] }
                                            alt={ 'productImage' }
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div>
                                            <div className="xs:flex space-y-3 xs:space-y-0 justify-between text-base font-medium text-gray-900">
                                                <h3 className="text-sm sm:text-lg">
                                                    <p>{ cartItem.product.title }</p>
                                                </h3>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">₹{ cartItem.product.discountedPrice }</p>
                                                    <p className="text-sm font-medium text-gray-500 line-through">₹{ cartItem.product.price }</p>
                                                    <p className="text-gray-500 text-sm sm:text-md md:text-lg">Qty :{ cartItem.quantity }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </li>
                            )) }
                        </ul>
                    </div>
                </div>

                <div className="border-y border-gray-200 py-6">
                    <div className="flex text-base font-medium text-gray-900 justify-between items-baseline">
                        <p className="text-sm sm:text-lg">Total Quantity</p>
                        <p className="text-sm font-medium">{ order.totalQunatity > 1 ? `${order.totalQunatity} items` : `${order.totalQunatity} item` }</p>
                    </div>
                    <div className="flex text-base font-medium text-gray-900 justify-between items-baseline">
                        <p className="text-sm sm:text-lg">Subtotal</p>
                        <div className="flex space-x-3">
                            <p className="text-sm font-medium bg-yellow-200">₹{ order.subTotalWithDiscount }</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-lg sm:text-2xl text-bold text-gray-900 mt-2">Shipment Details</h1>
                    <div className="xs:flex justify-between outline outline-1 outline-gray-300 rounded-lg xs:space-x-3 p-3 overflow-hidden">
                        <div className="flex flex-col text-xs sm:text-md md:text-lg">

                            <h4 className="text-xs my-5 xs:my-0 font-bold sm:text-md md:text-lg">{ order.selectedAddress.lastName + order.selectedAddress.firstName }</h4>
                            <p>{ order.selectedAddress.address }</p>
                            <p>{ order.selectedAddress.appartment }</p>
                            <p>{ `${order.selectedAddress.city} , ${order.selectedAddress.state}` }</p>
                            <p>{ order.selectedAddress.country }</p>
                            <p className="font-bold">{ order.selectedAddress.zip }</p>
                        </div>
                        <div className="flex flex-col my-5 xs:my-0 xs:items-start xs:gap-y-2 text-xs sm:text-md md:text-lg">
                            <p className="text-gray-700">{ order.selectedAddress.phone }</p>
                            <p className="text-gray-700 break-words xs:break-keep">{ order.selectedAddress.email }</p>
                            <p className="text-gray-700">{ order.selectedPaymentMethod }</p>
                            <p className="text-gray-700">{ order.status }</p>

                            {/* <button
                                onClick={ (index) => { handleRemoveAddress(index) } }
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Remove
                            </button> */}
                        </div>
                    </div>
                </div>
            </div >
        )) : (userOrderLoaded && <Navigate to='/' replace={ true } />)
    )

}
export default UserOrders;