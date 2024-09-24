function LoadingUI() {
    return (
        <div>
        <div className="flex flex-col animate-pulse  lg:w-[700px] md:w-[600px] sm:w-[500px]  rounded-lg gap-y-3 mt-10 shadow-md border border-[#c0c0c0] p-4  h-[300px] md:p-7">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-5">
                    <div className="bg-gray-300 h-10 w-10 rounded-full"></div>
                    <div className="bg-gray-300 h-5 w-20 rounded"></div>
                </div>
                <div>
                    <div className="bg-gray-300 h-5 w-20 rounded"></div>
                </div>
            </div>
            <hr />
            <div>
                <div className="bg-gray-300 h-10 w-40 rounded"></div>
            </div>
            <div>
                <div className="bg-gray-300 h-10 w-60 rounded"></div>
            </div>
            <div className="flex mt-2 justify-between items-center">
                <div className="flex gap-x-2 md:gap-x-5 items-center">
                    <div className="bg-gray-300 h-10 w-20 rounded"></div>
                    <div className="bg-gray-300 h-10 w-20 rounded"></div>
                </div>
                <div className="bg-gray-300 h-10 w-20 rounded"></div>
            </div>
        </div>
        <div className="flex flex-col animate-pulse  lg:w-[700px] md:w-[600px] sm:w-[500px]  rounded-lg gap-y-3 mt-10 shadow-md border border-[#c0c0c0] p-4  h-[300px] md:p-7">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-5">
                <div className="bg-gray-300 h-10 w-10 rounded-full"></div>
                <div className="bg-gray-300 h-5 w-20 rounded"></div>
            </div>
            <div>
                <div className="bg-gray-300 h-5 w-20 rounded"></div>
            </div>
        </div>
        <hr />
        <div>
            <div className="bg-gray-300 h-10 w-40 rounded"></div>
        </div>
        <div>
            <div className="bg-gray-300 h-10 w-60 rounded"></div>
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

export default LoadingUI;