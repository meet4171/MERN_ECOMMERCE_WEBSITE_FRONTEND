import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { resetCurrentOrder } from '../orders/orderSlice';
import { selectLoggedInUserToken } from '../auth/authSlice';
import { resetCartAsync } from '../cart/cartSlice';

const OrderSuccessPage = () => {
  const dispatch = useDispatch();
  const param = useParams()
  const user = useSelector(selectLoggedInUserToken);
  useEffect(() => {
    dispatch(resetCartAsync())
    dispatch(resetCurrentOrder())
  }, [dispatch, user]);

  return (
    <>
      { param.id && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-semibold mb-4">Order Successfully Placed</h1>
            <p className="text-gray-700 mb-4">
              Your order has been successfully placed. Thank you for shopping with us!
            </p>
            <h4>Order id: { param.id }</h4>


            <div className="mx-auto mt-8 w-fit">
              <Link to="/" replace={ true }>
                <button
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Home
                </button>
              </Link>
            </div>
          </div>
        </div>

      ) }
    </>
  );
};

export default OrderSuccessPage;
