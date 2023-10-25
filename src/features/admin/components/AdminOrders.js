import { useState, useEffect } from "react"
import { ITEMS_PER_PAGE, selectStatusColor } from "../../../app/constants"
import { fetchAllOrdersAsync, selectAllOrders, selectOrdersLoaded, selectTotalOrders, updateOrderByIdAsync } from "../../orders/orderSlice"
import { useDispatch, useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import Pagination from "../../comman/Pagination"


export default function AdminOrders() {
    const dispatch = useDispatch()
    const orders = useSelector(selectAllOrders)
    const totalOrders = useSelector(selectTotalOrders)
    const orderStatus = useSelector(selectOrdersLoaded)
    const allOrdersLoaded = useSelector(selectOrdersLoaded)
    const [page, setPage] = useState(1)
    const [editOrderId, setEditOrderId] = useState(-1)

    useEffect(() => {
        const pagination = { _page: page, _limit: ITEMS_PER_PAGE }
        dispatch(fetchAllOrdersAsync(pagination))
    }, [dispatch, page])

    function handlePage(page) {
        setPage(page)
    }
    function handleEditOrderId(orderId) {
        setEditOrderId(orderId)
    }
    function handleUpdateOrderStatus(e, order) {
        const update = { id: order.id, status: e.target.value }
        dispatch(updateOrderByIdAsync(update))
        setEditOrderId(-1)
    }

    return (
        <>
            {
                orderStatus === 'idle' && orders.length < 1 && (allOrdersLoaded && <Navigate to='/' replace={ true } />)
            }
            { orders && orders.map(order => (


                < div className='bg-white px-8 shadow-2xl sm:px-6  sm:pt-5 md:p-6 lg:p-8 mx-2 my-8 py-6' key={ order.id }>
                    { order.createdAt && <h3 className="text-sm sm:text-md md:text-xl">Order Placed On: { new Date(order.createdAt).toLocaleString() }</h3> }
                    { order.updatedAt && order.updatedAt !== order.createdAt && <h3 className="text-sm sm:text-md md:text-xl"> Last Updated On: { new Date(order.updatedAt).toLocaleString() }</h3> }


                    <div className="flex justify-between">
                        <h1 className='text-sm sm:text-xl md:text-2xl font-bold tracking-tight text-gray-900 my-4'>Order # { order.id }</h1>
                        <h1 className='hidden xs:block text-2xl font-bold tracking-tight text-gray-900 my-4'>{ order.userId.username }</h1>
                    </div>
                    <div>
                        <div className="flex items-center mb-3 space-x-2">
                            <span className="text-sm sm:text-lg font-semibold">Order Status:</span>
                            <h1 className={ `text-sm sm:text-md font-semibold xs:px-1 xs:py-1 ${selectStatusColor(order.status)}` }>{ order.status }</h1>
                            { editOrderId === order.id ? (


                                <select onChange={ (e) => { handleUpdateOrderStatus(e, order) } } className="rounded-md mx-2 px-2 border-none">
                                    <option>--select--</option>
                                    <option value="Pending">pending</option>
                                    <option value="Dispached">dispatched</option>
                                    <option value="Out for Delivery">out for delivery</option>
                                    <option value="Delivered">delivered</option>
                                    <option value="Cancelled">cancelled</option>
                                </select>
                            ) : (
                                <button
                                    onClick={ () => { handleEditOrderId(order.id) } }
                                    type="button"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    edit
                                </button>
                            )
                            }
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
                                                    <h3>
                                                        <p>{ cartItem.product.title }</p>
                                                    </h3>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{ cartItem.product.discountedPrice }</p>
                                                        <p className="text-sm font-medium text-gray-500 line-through">${ cartItem.product.price }</p>
                                                        <p className="text-gray-500">Qty :{ cartItem.quantity }
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
                            <p>Total Quantity</p>
                            <p className="text-sm font-medium">{ order.totalQunatity > 1 ? `${order.totalQunatity} items` : `${order.totalQunatity} item` }</p>
                        </div>
                        <div className="flex text-base font-medium text-gray-900 justify-between items-baseline">
                            <p>Subtotal</p>
                            <div className="flex space-x-3">
                                <p className="text-sm font-medium bg-yellow-200">${ order.subTotalWithDiscount }</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl text-bold text-gray-900 mt-2">Shipment Details</h1>
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


                            </div>
                        </div>
                    </div>


                </div >

            ))
            }
            <Pagination page={ page }
                totalItems={ totalOrders }
                handlePage={ handlePage }></Pagination>
        </>
    )

}


