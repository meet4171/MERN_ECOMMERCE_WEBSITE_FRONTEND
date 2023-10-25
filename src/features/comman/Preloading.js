export default function Preloading() {
    return (
        <div className="animate-preloader -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 flex justify-center items-center bg-gray-800">
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
        </div>

    )

}