import { useSelector, useDispatch } from "react-redux"
import { selectCategory, selectBrand, createNewProductAsync, fetchProductByIdAsync, selectedProductById, updateProductAsync, clearSelectedProduct } from "../../product/productSlice"
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
export default function AdminProductForm() {

    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset, setValue } = useForm();
    const params = useParams()
    const selectedProduct = useSelector(selectedProductById)
    const category = useSelector(selectCategory)
    const brands = useSelector(selectBrand)
    const [rating, setRating] = useState(0)

    useEffect(() => {
        reset()
    }, [isSubmitSuccessful, reset])

    useEffect(() => {
        if (params.id) {
            dispatch(fetchProductByIdAsync(params.id))
        }
        else {
            dispatch(clearSelectedProduct())
        }

    }, [dispatch, params.id])

    useEffect(() => {
        if (selectedProduct && params.id) {
            setValue('title', selectedProduct.title)
            setValue('description', selectedProduct.description)
            setValue('price', selectedProduct.price)
            setValue('discountPercentage', selectedProduct.discountPercentage)
            setValue('stock', selectedProduct.stock)
            setValue('brand', selectedProduct.brand)
            setValue('category', selectedProduct.category)
            setValue('thumbnail', selectedProduct.thumbnail)
            setValue('image1', selectedProduct.images[0])
            setValue('image2', selectedProduct.images[1])
            setValue('image3', selectedProduct.images[2])
            setValue('image4', selectedProduct.images[3])
            setRating(selectedProduct.rating)
            dispatch(clearSelectedProduct())

        }
    }, [dispatch, selectedProduct, params.id, setValue])


    return (
        <form onSubmit={ handleSubmit(data => {

            const newProduct = { ...data, images: [data.image1, data.image2, data.image3, data.image4, data.thumbnail], rating: 0 }
            delete newProduct["image1"]
            delete newProduct["image2"]
            delete newProduct["image3"]
            delete newProduct["image4"]
            newProduct.price = +newProduct.price
            newProduct.stock = +newProduct.stock
            newProduct.discountPercentage = Math.round(+newProduct.discountPercentage)
            if (params.id) {
                newProduct.id = params.id
                newProduct.rating = rating || 0
                dispatch(updateProductAsync({ update: newProduct, toast, type: 'UPDATE' }))

            }
            else {

                dispatch(createNewProductAsync({ product: newProduct, toast }))
            }

        }
        ) }>
            <div className="space-y-12 isolate bg-white px-6 py-5 sm:py-10 lg:px-8">

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                    <div className="col-span-full">
                        <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                            Name of Product
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                { ...register("title", { required: 'product name is required', maxLength: { value: 30, message: 'length of the name of product should lbe l not more than 25' } }) }
                                id="title"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        { errors.title && (<p className="text-red-500">*{ errors.title.message }</p>) }
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="brand" className="block text-sm font-medium leading-6 text-gray-900">
                            Select Brand
                        </label>
                        <div className="mt-2">
                            <select
                                type="text"
                                { ...register("brand", { required: 'brand' }) }
                                id="brand"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                                <option value=''>---ChooseBrand---</option>
                                { brands.map((brand) => (

                                    <option value={ brand.value } key={ uuidv4() }>{ brand.label }</option>
                                )) }

                            </select>
                        </div>
                        { errors.brand && (<p className="text-red-500">*{ errors.brand.message }</p>) }
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                            Select category
                        </label>
                        <div className="mt-2">
                            <select
                                type="text"
                                { ...register("category", { required: 'category is required' }) }
                                id="category"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                                <option value=''>---ChooseCategory---</option>
                                { category.map((category) => (

                                    <option value={ category.value } key={ uuidv4() }>{ category.label }</option>
                                )) }

                            </select>
                        </div>
                        { errors.category && (<p className="text-red-500">*{ errors.category.message }</p>) }
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                            Description of Product
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="description"
                                { ...register("description", { required: 'description is required', minLength: { value: 15, message: 'length of description should be minimum 15 characters' }, maxLength: { value: 200, message: 'maximum length of description should be 50' } }) }
                                rows={ 3 }
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={ '' }
                            />
                        </div>
                        { errors.description && (<p className="text-red-500">*{ errors.description.message }</p>) }
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                            Price
                        </label>
                        <div className="mt-2">
                            <input
                                type="number min=0"
                                { ...register("price", { required: 'price is required', max: { value: 1000000, message: 'maximum price should be 1000000' } }) } id="price"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        { errors.price && (<p className="text-red-500">*{ errors.price.message }</p>) }
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="discountPercentage" className="block text-sm font-medium leading-6 text-gray-900">
                            Discount %
                        </label>
                        <div className="mt-2">
                            <input
                                type="number min=0"
                                { ...register("discountPercentage", { required: 'Discount Percentage is required', max: { value: 100, message: 'maximum discount should be 100%' } }) }
                                id="discountPercentage"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        { errors.discountPercentage && (<p className="text-red-500">*{ errors.discountPercentage.message }</p>) }
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="stock" className="block text-sm font-medium leading-6 text-gray-900">
                            Stock
                        </label>
                        <div className="mt-2">
                            <input
                                type="number"
                                { ...register("stock", { required: 'Stock of Product Percentage is required', max: { value: 100000, message: 'maximum stock should be 100000' } }) } id="stock"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        { errors.stock && (<p className="text-red-500">*{ errors.stock.message }</p>) }
                    </div>


                    <div className="sm:col-span-full">
                        <label htmlFor="thumbnail" className="block text-sm font-medium leading-6 text-gray-900">
                            Product Thumbnail
                        </label>
                        <div className="mt-2">
                            <input
                                type="url"
                                { ...register("thumbnail", { required: 'thumbnail  is required' }) }
                                id="thumbnail"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        { errors.thumbnail && (<p className="text-red-500">*{ errors.thumbnail.message }</p>) }
                    </div>

                    <div className="sm:col-span-full">
                        <label htmlFor="image1" className="block text-sm font-medium leading-6 text-gray-900">
                            Product Image 1
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                { ...register("image1", { required: 'image is required' }) }
                                id="image1"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        { errors.image1 && (<p className="text-red-500">*{ errors.image1.message }</p>) }
                    </div>

                    <div className="sm:col-span-full">
                        <label htmlFor="image2" className="block text-sm font-medium leading-6 text-gray-900">
                            Product Image 2
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                { ...register("image2", { required: 'image is required' }) }
                                id="image2"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        { errors.image2 && (<p className="text-red-500">*{ errors.image2.message }</p>) }
                    </div>

                    <div className="sm:col-span-full">
                        <label htmlFor="image3" className="block text-sm font-medium leading-6 text-gray-900">
                            Product Image 3
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                { ...register("image3", { required: 'image is required' }) }
                                id="image3"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        { errors.image3 && (<p className="text-red-500">*{ errors.image3.message }</p>) }
                    </div>

                    <div className="sm:col-span-full">
                        <label htmlFor="image4" className="block text-sm font-medium leading-6 text-gray-900">
                            Product Image 4
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                { ...register("image4", { required: 'image is required' }) }
                                id="image4"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        { errors.image4 && (<p className="text-red-500">*{ errors.image4.message }</p>) }
                    </div>

                </div>
                <hr />
                <div className="flex items-center justify-end gap-x-6">
                    <button type="reset" className="text-sm font-semibold leading-6 text-gray-900">
                        Reset
                    </button>
                    { !params.id && <button
                        type="submit"
                        className="rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Add
                    </button> }
                    { params.id && <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >

                        Edit
                    </button> }
                </div>
            </div>

        </form >
    )
}
