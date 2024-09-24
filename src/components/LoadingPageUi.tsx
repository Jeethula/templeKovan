function LoadingPageUi() {
    return (
        <div>
            <div className="flex flex-col animate-pulse gap-y-5 rounded-lg  lg:w-[55%] lg:mx-40 p-4 mt-10 ">
                <div>
                  <div className="bg-gray-300 h-5 w-20 rounded"></div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-5">
                        <div className="bg-gray-300 h-10 w-10 rounded-full"></div>
                        <div className="bg-gray-300 h-5 w-20 rounded"></div>
                    </div>
                    <div>
                        <div className="bg-gray-300 h-5 w-20 rounded"></div>
                    </div>
                </div>
                <div>
                    <div className="bg-gray-300 h-10 w-40 rounded"></div>
                </div>
                <div>
                    <div className="bg-gray-300 h-52 lg:w-[55%] w-40rounded"></div>
                </div>
                <div className="flex mt-2 justify-between items-center">
                    <div className="flex gap-x-2 md:gap-x-5 items-center">
                        <div className="bg-gray-300 h-10 w-20 rounded"></div>
                        <div className="bg-gray-300 h-10 w-20 rounded"></div>
                    </div>
                    <div className="bg-gray-300 h-10 w-20 rounded"></div>
                </div>
            </div>
        </div>
    );
}

export default LoadingPageUi;