import { StarIcon } from '@heroicons/react/20/solid'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProductByIdAsync, selectedProductById } from '../productSlice'
import { addToCartAsync, selectItems } from '../../cart/cartSlice'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetail() {
  const selectedProduct = useSelector(selectedProductById)
  const cartItems = useSelector(selectItems)
  const dispatch = useDispatch()

  const params = useParams()

  function handleAddToCart() {
    if (selectedProduct && (cartItems.findIndex((cartItem) => cartItem.product.id === selectedProduct?.id)) < 0) {

      const newProduct = { product: selectedProduct.id,  quantity: 1 }
      dispatch(addToCartAsync({item:newProduct,toast}))
    }
    else {
      toast.error('Item Already in Cart')
    }
  }
  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductByIdAsync(params.id))
    }
  }, [dispatch, params.id])

  return selectedProduct ?
    (
      <div className="bg-white">
        <div className="pt-6 mx-12">
          <nav aria-label="Breadcrumb">
            <ol className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
              <li className="text-sm">
                <p aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                  { selectedProduct.title }
                </p>
              </li>
            </ol>
          </nav>

          {/* Image gallery */ }
          <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
            <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
              <img
                src={ selectedProduct.images[0] }
                alt={ 'productImage' }
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                <img
                  src={ selectedProduct.images[1] }
                  alt={ 'productImage' }
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                <img
                  src={ selectedProduct.images[2] }
                  alt={ 'productImage' }
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
              <img
                src={ selectedProduct.images[3] }
                alt={ 'productImage' }
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* Product info */ }
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              { selectedProduct.title }
            </div>

            {/* Options */ }
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">₹{ selectedProduct.price }</p>

              {/* Reviews */ }
              <div className="mt-6">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    { [0, 1, 2, 3, 4].map((index, rating) => (
                      <StarIcon
                        key={ index }
                        className={ classNames(
                          Math.round(selectedProduct.rating) > rating ? 'text-gray-900' : 'text-gray-200',
                          'h-5 w-5 flex-shrink-0'
                        ) }
                        aria-hidden="true"
                      />
                    )) }
                  </div>
                </div>
                <p >{ Math.round(selectedProduct.rating) } out of 5 stars</p>
              </div>

              <form className="mt-10" onSubmit={ (e) => e.preventDefault() }>

                { selectedProduct.stock < 1 ?
                  (< button
                    type="button"
                    disabled
                    className={ "mt-10 flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white bg-gray-400 cursor-pointer" }
                  >
                    Out of Stock

                  </button>)
                  : (< button
                    type="submit"
                    className={ "mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 " }
                    onClick={ handleAddToCart }
                  >
                    Add to Cart

                  </button>) }
                <Link
                  to='/'
                  className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Home
                </Link>
              </form>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              {/* Description and details */ }
              <div>
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6">
                  <p className="text-base text-gray-900">{ selectedProduct.description }</p>
                </div>
              </div>

              <div className="mt-10">
                {/* <h3 className="text-sm font-medium text-gray-900">Highlights</h3> */ }

                {/* <div className="mt-4">
                  <ul className="list-disc space-y-2 pl-4 text-sm">
                    { selectedProduct.highlights.map((highlight) => (
                      <li key={ highlight } className="text-gray-400">
                        <span className="text-gray-600">{ highlight }</span>
                      </li>
                    )) }
                  </ul>
                </div> */}
              </div>

              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">Details</h2>

                <div className="mt-4 space-y-6">
                  <p className="text-sm text-gray-600">{ selectedProduct.description }</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >) : null

}