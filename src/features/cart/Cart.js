import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCartItemsAsync, selectItems, removeFromCartAsync, updateCartAsync, selectCartLoaded } from "./cartSlice";
import { selectLoggedInUserToken } from "../auth/authSlice";
import backgroundCartImage from '../../assets/images/backgroundCartIcon.jpg'
import Modal from "../comman/Modal";
import { toast } from "react-hot-toast";

function Cart() {

  const dispatch = useDispatch()
  const cartItems = useSelector(selectItems)
  const cartLoaded = useSelector(selectCartLoaded)
  const user = useSelector(selectLoggedInUserToken)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(-1)

  const subTotal = cartItems.reduce((amount, item) => (item.quantity * item.product.price) + amount, 0)
  const subTotalWithDiscount = cartItems.reduce((amount, item) => (item.quantity * item.product.discountedPrice) + amount, 0)
  const totalQunatity = cartItems.reduce((quantity, product) => product.quantity + quantity, 0)

  useEffect(() => {
    if (user) {
      dispatch(fetchCartItemsAsync())
    }
  }, [dispatch, user])

  function handleRemoveFromCart(productId) {
    setSelectedDeleteItem(productId)
    setIsOpen(true)

  }
  function handleConfirmDelete() {
    dispatch(removeFromCartAsync({ itemId: selectedDeleteItem, toast }))
    setIsOpen(false)
    setSelectedDeleteItem(-1)


  }
  function handleCancleDelete() {
    setIsOpen(false)
    setSelectedDeleteItem(-1)
  }
  function handleUpdateCart(e, item) {
    dispatch(updateCartAsync({ id: item.id, quantity: e.target.value }))
  }
  return cartLoaded && cartItems && cartItems.length > 0 ? (

    <div className='bg-white px-4 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 mt-3 py-6'>
      <div>
        <div className="flow-root">
          <ul className="-my-6 divide-y divide-gray-200">
            { cartItems.map((item) => (
              <div key={ item.product.id }>
                { item.createdAt && <h3>Item Added ON: { new Date(item.createdAt).toUTCString() }</h3> }
                <li className="flex py-6 flex-col xs:flex-row">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={ item.product.images[0] }
                      alt={ 'productImage' }
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <p>{ item.product.title }</p>
                        </h3>
                        <div>
                          <p className="text-sm font-medium text-gray-900">₹{ item.product.discountedPrice }</p>
                          <p className="text-sm font-medium text-gray-500 line-through">₹{ item.product.price }</p>
                        </div>
                      </div>
                      {/* <p className="mt-1 text-sm text-gray-500">{ product.color }</p> */ }
                    </div>
                    <div className="flex flex-1 xs:items-end xs:flex-row justify-between text-sm flex-col items-start">
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
                        selectedDeleteItem === item.id &&
                        <Modal
                          message={ `Are you Sure you want to delete ?` }
                          title={ `Delete ${item.product.title}` }
                          isOpen={ isOpen }
                          buttonOne='Delete'
                          buttonTwo='Cancle'
                          buttonOneHandler={ handleConfirmDelete }
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
              </div>
            )) }
          </ul>
        </div>
      </div >

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
        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
        <div className="mt-6">
          <Link
            to="/checkout"
            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Checkout
          </Link>
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
  ) : (
    <div
      style={ { backgroundImage: `url(${backgroundCartImage})` } }
      className='bg-white shadow-2xl bg-contain bg-no-repeat h-screen w-screen flex flex-col items-center justify-center'
    >
      <div className='backdrop-filter flex justify-center items-center flex-col backdrop-blur-sm p-8 rounded-md bg-white bg-opacity-30'>
        <h1 className='text-md sm:text-2xl tracking-tight text-slate-800 my-4 text-center'>
          Shopping Cart is Empty !
        </h1>
        <Link to='/'>
          <button className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
            Shop Now
          </button>
        </Link>
      </div>
    </div>
  )
}
export default Cart;