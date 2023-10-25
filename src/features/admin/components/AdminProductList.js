import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { StarIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import { selectAllProducts, selectTotalItems, selectCategory, selectBrand, fetchProductByFilterAsync, fetchCategoriesAsync, fetchBrandsAsync, fetchProductByIdAsync, selectedProductById, updateProductAsync, clearSelectedProduct, selectProductSliceStatus } from '../../product/productSlice'
import { useSelector, useDispatch } from 'react-redux';
import { ITEMS_PER_PAGE } from '../../../app/constants'
import { v4 as uuidv4 } from 'uuid';
import AdminProductListSkeleton from '../../comman/SkeletonLoading/AdminProductListSkeleton'
import { toast } from 'react-hot-toast'
import Modal from '../../comman/Modal'
import noProductImage from '../../../assets/images/noProduct.jpg'
import Pagination from '../../comman/Pagination'
const sortOptions = [
  { name: 'Best Rating', sort: 'rating', order: 'desc', current: false },
  { name: 'Price: Low to High', sort: 'price', order: 'asc', current: false },
  { name: 'Price: High to Low', sort: 'price', order: 'desc', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function AdminProductList() {

  const products = useSelector(selectAllProducts);
  const totalItems = useSelector(selectTotalItems)
  const category = useSelector(selectCategory)
  const brand = useSelector(selectBrand)
  const dispatch = useDispatch()
  const selectedProduct = useSelector(selectedProductById)
  const status = useSelector(selectProductSliceStatus)
  const filters = [
    {
      id: 'brand',
      name: 'Brands',
      options: brand,
    },
    {
      id: 'category',
      name: 'Category',
      options: category,
    },
  ]
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(-1)
  // filter object
  const [sort, setSort] = useState({});
  const [page, setPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleFilter = (e, section, option) => {
    const newSelectedFilters = { ...selectedFilters };
    if (e.target.checked) {
      if (newSelectedFilters[section.id]) {
        newSelectedFilters[section.id].push(option.value);
      } else {
        newSelectedFilters[section.id] = [option.value];
      }
    } else {
      const index = newSelectedFilters[section.id].findIndex(
        (el) => el === option.value
      );
      newSelectedFilters[section.id].splice(index, 1);
    }

    setSelectedFilters(newSelectedFilters);
  };


  const handleSort = (e, option) => {
    const sort = { _sort: option.sort, _order: option.order };
    setSort(sort);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(fetchProductByFilterAsync({ filter: selectedFilters, sort, pagination }));
  }, [dispatch, selectedFilters, sort, page]);


  useEffect(() => {
    setPage(1);
  }, [totalItems, sort]);

  useEffect(() => {
    dispatch(fetchBrandsAsync());
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  useEffect(() => {
    setIsOpen(false)
    setSelectedDeleteItem(-1)
    dispatch(clearSelectedProduct());
  }, [dispatch])



  function handleDeleteProduct(productId) {
    dispatch(clearSelectedProduct());
    dispatch(fetchProductByIdAsync(productId));

  }
  function handleConfirmDelete() {
    const selectedProductName = selectedProduct.title
    const update = { ...selectedProduct, deleted: true };
    dispatch(updateProductAsync({ update, selectedProductName,toast, type: 'DELETE' }));
    dispatch(clearSelectedProduct());
    setSelectedDeleteItem(-1)

  }
  function handleCancleDelete() {
    setIsOpen(false)
    setSelectedDeleteItem(-1)
  }

  useEffect(() => {
    if (selectedProduct && !selectedProduct.deleted) {
      setIsOpen(true)
      setSelectedDeleteItem(selectedProduct.id)

    }
    else {
      if (selectedProduct) {
        toast.error(`${selectedProduct.title} already deleted`);
      }

    }
  }, [dispatch, selectedProduct])



  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */ }
        <Transition.Root show={ mobileFiltersOpen } as={ Fragment }>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={ setMobileFiltersOpen }>
            <Transition.Child
              as={ Fragment }
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={ Fragment }
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={ () => setMobileFiltersOpen(false) }
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */ }
                  <form className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>

                    { filters.map((section) => (
                      <Disclosure as="div" key={ section.id } className="border-t border-gray-200 px-4 py-6">
                        { ({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">{ section.name }</span>
                                <span className="ml-6 flex items-center">
                                  { open ? (
                                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                  ) : (
                                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                  ) }
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6" >
                              <div className="space-y-6">
                                { section.options.map((option, optionIdx) => (
                                  <div key={ uuidv4() } className="flex items-center">
                                    <input
                                      id={ `filter-mobile-${section.id}-${optionIdx}` }
                                      name={ `${section.id}[]` }
                                      defaultValue={ option.value }
                                      checked={ selectedFilters[section.id]?.includes(option.value) }
                                      onChange={ (e) => handleFilter(e, section, option) }
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={ `filter-mobile-${section.id}-${optionIdx}` }
                                      className="ml-3 min-w-0 flex-1 text-gray-500"
                                    >
                                      { option.label }
                                    </label>
                                  </div>
                                )) }
                              </div>
                            </Disclosure.Panel>
                          </>
                        ) }
                      </Disclosure>
                    )) }
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center gap-y-5 items-center xs:flex-row xs:items-baseline xs:justify-between border-b border-gray-200 pb-6 pt-14">
            <Link to='/admin/product-form/add' replace={ true }>
              <button
                type="submit"
                className="rounded-md bg-green-500 px-1 py-1 sm:px-3 sm:py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add New Product

              </button>
            </Link>
            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={ Fragment }
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">

                    <div className="py-1">
                      { sortOptions.map((option) => (
                        <Menu.Item key={ uuidv4() }>
                          { ({ active }) => (
                            <p
                              onClick={ (e) => handleSort(e, option) }
                              className={ classNames(
                                option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm'
                              ) }
                            >
                              { option.name }
                            </p>
                          ) }
                        </Menu.Item>
                      )) }
                    </div>

                  </Menu.Items>
                </Transition>
              </Menu>

              <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={ () => setMobileFiltersOpen(true) }
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */ }

              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>


                { filters.map((section) => (
                  <Disclosure as="div" key={ section.id } className="border-b border-gray-200 py-6">
                    { ({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">{ section.name }</span>
                            <span className="ml-6 flex items-center">
                              { open ? (
                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                              ) : (
                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                              ) }
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            { section.options.map((option, optionIdx) => (
                              <div key={ uuidv4() } className="flex items-center">
                                <input
                                  id={ `filter-${section.id}-${optionIdx}` }
                                  name={ `${section.id}[]` }
                                  type="checkbox"
                                  onChange={ (e) => handleFilter(e, section, option) }
                                  defaultValue={ option.value }
                                  checked={ selectedFilters[section.id]?.includes(option.value) }
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={ `filter-${section.id}-${optionIdx}` }
                                  className="ml-3 text-sm text-gray-600"
                                >
                                  { option.label }
                                </label>
                              </div>
                            )) }
                          </div>
                        </Disclosure.Panel>
                      </>
                    ) }
                  </Disclosure>
                )) }


              </form>

              {/* Product grid */ }
              <div className="lg:col-span-3">

                {/* // List of Products */ }
                <div className="bg-white">
                  {
                    products && products.length === 0 && <img src={ noProductImage } alt='noProductImage' />
                  }

                  <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">

                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
                      { status === 'loading' && Array.from({ length: 9 }).map(() => (

                        <AdminProductListSkeleton key={ uuidv4() }></AdminProductListSkeleton>
                      )) }
                      { products && products.length > 0 && products.map((product) => (
                        <div key={ product.id }>
                          { selectedDeleteItem === product.id &&
                            <Modal
                              message={ `${product.title}` }
                              title={ "Delete" }
                              isOpen={ isOpen }
                              buttonOne='Delete'
                              buttonTwo='Cancle'
                              buttonOneHandler={ handleConfirmDelete }
                              buttonTwoHandler={ handleCancleDelete }

                            />
                          }
                          <div className="relative shadow-sm p-2 shadow-black">
                            <div>


                              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 hover:opacity-75 lg:h-80">
                                <img
                                  src={ product.thumbnail }
                                  alt={ product.category }
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                              <div className="mt-4 flex justify-between">
                                <div>
                                  <h3 className="text-sm text-gray-700">
                                    <p>
                                      <span aria-hidden="true" className="absolute inset-0" />
                                      { product.title }
                                    </p>
                                  </h3>
                                  <div>

                                    <StarIcon className='w-4 h-4 text-gray-500 inline '></StarIcon>
                                    <p className="mt-1 text-sm text-gray-500 inline align-bottom">

                                      { product.rating }
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">${ product.discountedPrice }
                                  </p>
                                  <p className="text-sm font-medium text-gray-500 line-through">${ product.price }</p>
                                </div>
                              </div>

                              {
                                product.deleted && (<p className='text-red-500 text-center text-sm font-bold'>**deleted**</p>
                                )
                              }
                              {
                                product.stock < 1 && (<p className='text-red-500 text-center text-sm font-bold'>**out of stock**</p>
                                )
                              }
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between">
                            <Link to={ `/admin/product-form/edit/${product.id}` }>
                              <button
                                type="submit"
                                className="flex w-full flex-initial justify-center rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              >
                                Edit
                              </button>
                            </Link>
                            <button
                              onClick={ () => { handleDeleteProduct(product.id) } }
                              className="flex w-1/3 flex-initial justify-center rounded-md px-2 py-1 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:bg-red-700 bg-red-500">

                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-5 h-5">
                                <path
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>

                        </div>
                      )) }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Pagination
            page={ page }
            totalItems={ totalItems }
            handlePage={ handlePage }
          ></Pagination>
        </main>
      </div>

    </div >


  );
}
