import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ITEMS_PER_PAGE } from "../../app/constants";

export default function Pagination({ page, totalItems, handlePage }) {
    const totalPage = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">

            <div className="flex flex-col items-center sm:items-center justify-center mx-auto">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing{ " " }
                        <span className="font-medium">
                            { (page - 1) * ITEMS_PER_PAGE + 1 }
                        </span>{ " " }
                        to{ " " }
                        <span className="font-medium">
                            { page * ITEMS_PER_PAGE > totalItems
                                ? totalItems
                                : page * ITEMS_PER_PAGE }
                        </span>{ " " }
                        of{ " " }
                        <span className="font-medium">{ totalItems }</span> results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <div
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
                            onClick={ () => { handlePage(page > 1 ? page - 1 : page) } }
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </div>

                        { Array.from({ length: totalPage }).map((elem, index) => (
                            <div
                                key={ index }
                                aria-current="page"
                                onClick={ (e) => { handlePage(index + 1) } }
                                className={ `relative z-10 inline-flex items-center ${index + 1 === page ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 ring-1 ring-inset ring-gray-300'} px-4 py-2 text-sm font-semibold  focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer hidden md:block` }
                            >
                                { index + 1 }
                            </div>
                        )) }
                        <div
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
                            onClick={ () => { handlePage(page < totalPage ? page + 1 : page) } }
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
}
