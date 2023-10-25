export default function Footer() {
    return (
        <>
            {/* component */ }
            {/* This is an example component */ }
            <div className=" bg-gray-800">
                <div className="max-w-2xl mx-auto text-white py-10">
                    <div className="text-center">
                        <h3 className="text-xl sm:text-3xl mb-3"> Download Trend Cart App</h3>
                        <p> Any Product at discounted Price ! </p>
                        <div className="w-full pt-5 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={ 1000 }
                                height={ 100 }
                                viewBox="0 0 1000 90"
                            >
                                <text
                                    x={ 20 }
                                    y={ 50 }
                                    fontSize={ 100 }
                                    fontWeight="bold"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth={ 2 }
                                    className="draw-text space-x-5 font-mono"
                                >
                                    <tspan dy={ 0 }>w</tspan>
                                    <tspan dy={ 0 }>w</tspan>
                                    <tspan dy={ 0 }>w</tspan>
                                    <tspan dy={ 0 }>.</tspan>
                                    <tspan dy={ 0 }>t</tspan>
                                    <tspan dy={ 0 }>r</tspan>
                                    <tspan dy={ 0 }>e</tspan>
                                    <tspan dy={ 0 }>n</tspan>
                                    <tspan dy={ 0 }>d</tspan>
                                    <tspan dy={ 0 }>c</tspan>
                                    <tspan dy={ 0 }>a</tspan>
                                    <tspan dy={ 0 }>r</tspan>
                                    <tspan dy={ 0 }>t</tspan>
                                    <tspan dy={ 0 }>.</tspan>
                                    <tspan dy={ 0 }>c</tspan>
                                    <tspan dy={ 0 }>o</tspan>
                                    <tspan dy={ 0 }>m</tspan>
                                </text>
                            </svg>
                        </div>
                        <div className="flex justify-center flex-col items-center my-5 gap-y-3 xs:flex-row xs:gap-y-0">
                            <div className="flex items-center border w-fit rounded-lg px-4 py-2 mx-2 order-2">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/888/888857.png"
                                    className="w-7 md:w-8"
                                    alt="icon"
                                />
                                <div className="text-left ml-3">
                                    <p className="text-xs sm:text-md text-gray-200">Download on </p>
                                    <p className="text-xs sm:text-md md:text-base"> Google Play Store </p>
                                </div>
                            </div>
                            <div className="flex items-center border w-fit rounded-lg px-4 py-2 mx-2 order-1">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/888/888841.png"
                                    className="w-7 md:w-8"
                                    alt="icon"
                                />
                                <div className="text-left ml-3">
                                    <p className="text-xs sm:text-md text-gray-200">Download on </p>
                                    <p className="text-xs sm:text-md md:text-base"> Apple Store </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-14 flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-400">
                        <p className="order-2 md:order-1 mt-8 md:mt-0">
                            { " " }
                            © Trend Cart, 2023.{ " " }
                        </p>
                        <div className="order-1 md:order-2 flex gap-x-2 mx-3 flex-col xs:flex-row space-y-3 xs:space-y-0 text-center">
                            <span className="border-b xs:border-b-0 whitespace-nowrap px-2">About us</span>
                            <span className="xs:border-l border-b xs:border-b-0 whitespace-nowrap px-2">Contact us</span>
                            <span className="xs:border-l xs:border-b-0 border-b whitespace-nowrap px-2">Privacy Policy</span>
                        </div>
                    </div>



                </div>
            </div>
        </>

    )
}