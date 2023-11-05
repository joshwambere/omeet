import { Inter } from 'next/font/google'
import {HomePageLayout} from "@/components/layouts/HomePageLayout";
import WithPublicRoute from "@/components/wrappers/PublicWrapper";
import {ReactElement} from "react";
import dynamic from 'next/dynamic'

const inter = Inter({ subsets: ['latin'] })

const  Home = (): ReactElement=> {
  return (
    <div
      className="bg-[#080402]"
    >
      <HomePageLayout />
    </div>
  )
}



const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Home), {
  ssr: false
})
export default WithPublicRoute(DynamicComponentWithNoSSR)
