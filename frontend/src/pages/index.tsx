import Image from 'next/image'
import { Inter } from 'next/font/google'
import {HomePageLayout} from "@/components/layouts/HomePageLayout";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className="bg-[#080402]"
    >
      <HomePageLayout />
    </main>
  )
}
