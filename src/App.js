
import { React, useEffect, useState } from 'react';
import HomePage from './features/pages/HomePage'
import LoginPage from './features/pages/LoginPage';
import SignupPage from './features/pages/SignupPage';
import CartPage from './features/pages/CartPage.js'
import CheckoutPage from './features/pages/CheckoutPage';
import ProductDetailPage from './features/pages/ProductDetailPage';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import UserOrderPage from './features/pages/UserOrderPage';
import UserProfilePage from './features/pages/userProfilePage';
import NotFound404 from './features/pages/NotFound404';
import { checkAuthAsync, selectLoggedInUserToken, selectUserChecked } from './features/auth/authSlice';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItemsAsync } from './features/cart/cartSlice';
import OrderSuccessPage from './features/pages/OrderSuccessPage';
import { fetchLoggedInUserInfoAsync, fetchOrdersByUserAsync } from './features/user/userSlice';
import Logout from './features/auth/components/Logout';
import { Toaster } from 'react-hot-toast';
import Preloading from './features/comman/Preloading'
import ForgetPassword from './features/auth/components/ForgetPassword';

// Admin routes and pages 

import ProtectedAdmin from './features/auth/components/ProtectedAdmin';
import AdminHomePage from './features/pages/AdminHomePage';
import AdminProductFormPage from './features/pages/AdminProductFormPage';
import AdminOrdersPage from './features/pages/AdminOrdersPage';
import PaymentError from './features/pages/PaymentErrorPage';
import ResetPassword from './features/auth/components/ResetPassword';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage></HomePage>
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (<LoginPage></LoginPage>),
  },
  {
    path: "/signup",
    element: (<SignupPage></SignupPage>),
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <CartPage></CartPage>
      </ProtectedRoute>
    ),
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute>
        <CheckoutPage></CheckoutPage>
      </ProtectedRoute>
    ),
  },
  {
    path: "/product-detail/:id",

    element: (
      <ProtectedRoute>
        <ProductDetailPage></ProductDetailPage>
      </ProtectedRoute>
    ),
  },
  {
    path: "/order-success/:id",
    element: (
      <ProtectedRoute>
        <OrderSuccessPage></OrderSuccessPage>
      </ProtectedRoute>
    ),
  },
  {
    path: "/user-orders",
    element: (
      <ProtectedRoute>
        <UserOrderPage></UserOrderPage>
      </ProtectedRoute>
    ),
  },
  {
    path: "/user-profile",
    element: (
      <ProtectedRoute>
        <UserProfilePage></UserProfilePage>
      </ProtectedRoute>
    ),
  },
  {
    path: "/order-cancalled",
    element: (
      <ProtectedRoute>
        <PaymentError></PaymentError>
      </ProtectedRoute>

    ),
  },
  {
    path: "/logout",
    element: (
      <Logout></Logout>
    ),
  },
  {
    path: "/reset-password-request",
    element: (
      <ForgetPassword></ForgetPassword>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <ResetPassword></ResetPassword>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedAdmin>
        <AdminHomePage></AdminHomePage>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/product-form/add",
    element: (
      <ProtectedAdmin>
        <AdminProductFormPage></AdminProductFormPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/product-form/edit/:id",
    element: (
      <ProtectedAdmin>
        <AdminProductFormPage></AdminProductFormPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <ProtectedAdmin>
        <AdminOrdersPage></AdminOrdersPage>
      </ProtectedAdmin>
    ),
  },

  {
    path: "*",
    element: (
      <NotFound404></NotFound404>
    ),
  },
]);




function App() {
  const dispatch = useDispatch()
  const user = useSelector(selectLoggedInUserToken)
  const userChecked = useSelector(selectUserChecked)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(checkAuthAsync())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      dispatch(fetchCartItemsAsync())
      dispatch(fetchLoggedInUserInfoAsync())
      dispatch(fetchOrdersByUserAsync())
    }
  }, [dispatch, user])

  useEffect(() => {
    if (userChecked) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [userChecked]);


  return (
    <div>
      <Toaster
        position='top-center'
        reverseOrder={ true }
        toastOptions={ {
          className: '',
          duration: 5000,
          style: {
            background: 'white',
            color: 'black',
          },

          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 3000,
            theme: {
              primary: 'red',
              secondary: 'black',
            },

          },
          loading: {
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        } }
      />
      { isLoading ? <Preloading />

        : userChecked && <RouterProvider router={ router } />
      }

    </div>
  )


}

export default App;
