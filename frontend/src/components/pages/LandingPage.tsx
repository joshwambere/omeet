import {ReactElement} from "react";
import img1 from "../../../public/assets/images/1.jpg";
import img2 from "../../../public/assets/images/2.jpg";
import img3 from "../../../public/assets/images/3.jpg";
import {GButton} from "@/components/buttons/GButton";
export const LandingPage = ():ReactElement => {
    return (
        <div className="">
            <div className="lobby lg:grid lg:grid-cols-2 flex flex-col gap-2">
                <div className="flex flex-col justify-center items-center ">
                    <h1 className="text-white font-bold text-6xl w-2/3 leading-snug">
                        Amazingly <span className="text-[#3791f3]"> fast </span>  Conference Application
                    </h1>
                    <span className="text-white w-2/3 py-4 mt-8 opacity-80 font-light">
                Use Falcon meet to get new experience of video conferencing, with fast and secure connection.
            </span>
                    <div className="w-2/3 pt-8">
                        <GButton name="New meeting" size="medium" type="secondary" withBorder={true} bordered={true}/>
                    </div>
                </div>

                <div className="banner grid grid-cols-3 gap-2 lg:h-1/2 sm:h-1/3 w-11/12">
                    <div className="user-1 h-full">
                        <div className="window flex flex-col w-full h-1/2 relative">
                            <div className="top-menu border-b-1">
                                <div className="buttons">
                                    <div className="close bg-[#3791f3]"></div>
                                    <div className="minimize"></div>
                                    <div className="maximize"></div>
                                </div>
                            </div>
                            <img className=" flex-1 h-1/2  w-full p-1 object-cover" src={img1.src} alt="Join" />
                        </div>

                    </div>

                    <div className="user-2 border-x px-3 relative flex items-end h-full">
                        <div className="window flex flex-col w-full h-1/2 relative">
                            <div className="top-menu border-b-1">
                                <div className="buttons">
                                    <div className="close bg-[#3791f3]"></div>
                                    <div className="minimize"></div>
                                    <div className="maximize"></div>
                                </div>
                            </div>
                            <img className=" flex-1 h-1/2  w-full p-1 object-cover" src={img2.src} alt="Join" />
                        </div>

                    </div>

                    <div className="user-3 flex h-full items-center justify-center">
                        <div className="window flex flex-col w-full h-1/2 relative">
                            <div className="top-menu border-b-1">
                                <div className="buttons">
                                    <div className="close bg-[#3791f3]"></div>
                                    <div className="minimize"></div>
                                    <div className="maximize"></div>
                                </div>
                            </div>
                            <img className=" flex-1 h-1/2  w-full p-1 object-cover" src={img3.src} alt="Join" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
