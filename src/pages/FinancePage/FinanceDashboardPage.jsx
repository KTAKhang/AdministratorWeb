import { useEffect } from 'react'
import { AiOutlineAppstore } from "react-icons/ai";
import { Link } from 'react-router-dom';

function FinanceDashboardPage() {
    useEffect(() => {
        document.title = "Dashboad";
    }, []);
    return (

        <div >
            <div className="text-[#707EAE] m-3">Dashboad</div>
            <div className="p-4 bg-[#FFFFFF] h-[630px] flex flex-col w-full">
                <div className='flex w-full'>
                    <div className="p-4 m-4 bg-[#0E69AF] rounded-tl-[10px] rounded-br-[10px] w-[352px] h-[189px] text-[#FFFFFF] flex flex-1  flex-col justify-between shrink-0 ">
                        <div className="text-white text-center text-[30px] font-black tracking-[-0.18px]">
                            Total Claims
                        </div>
                        <div className="flex items-center justify-between">
                            <AiOutlineAppstore className="w-[70px] h-[70px]" />
                            <div className="text-white text-[40px] w-[200px] h-[70px] font-black tracking-[-0.18px]">
                                10000
                            </div>

                        </div>
                    </div>


                    <Link to={"/finance/approved"} className="p-4 m-4 bg-[#F27226] rounded-tl-[10px] rounded-br-[10px] w-[352px] h-[189px] text-[#FFFFFF] flex flex-1  flex-col justify-between">
                        <div className="text-white text-center text-[30px] font-black tracking-[-0.18px]">
                            Approved Claims
                        </div>
                        <div className="flex items-center justify-between">
                            <AiOutlineAppstore className="w-[70px] h-[70px]" />
                            <div className="text-white text-[40px] w-[200px] h-[70px] font-black tracking-[-0.18px]">
                                5000
                            </div>

                        </div>
                    </Link>




                    <Link to={"/finance/paid"} className="p-4 m-4 bg-[#0DB04B] rounded-tl-[10px] rounded-br-[10px] w-[352px] h-[189px] text-[#FFFFFF] flex flex-1  flex-col justify-between">
                        <div className="text-white text-center text-[30px] font-black tracking-[-0.18px]">
                            Paid Claims
                        </div>
                        <div className="flex items-center justify-between">
                            <AiOutlineAppstore className="w-[70px] h-[70px]" />
                            <div className="text-white text-[40px] w-[200px] h-[70px] font-black tracking-[-0.18px]">
                                5000
                            </div>

                        </div>
                    </Link>
                </div>
                <div className='flex flex-1 justify-center  w-full'>
                    <img className='bg-[#FFFFFF] opacity-50' src="/logo.svg" alt="" />
                </div>

            </div>


            <div className='text-[#707EAE] m-3'>© FSA. FSOFT ACADEMY</div>
        </div>

    )
}

export default FinanceDashboardPage
