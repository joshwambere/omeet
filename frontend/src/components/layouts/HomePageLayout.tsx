import {ReactElement} from "react";
import {LandingPage} from "@/components/pages/LandingPage";
import {Header} from "@/components/shared/header";

export const HomePageLayout = ():ReactElement => {

    return (
        <div className="">
            <Header />
            <LandingPage />
        </div>
    )
}
