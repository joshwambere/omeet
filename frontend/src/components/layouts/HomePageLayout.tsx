import {ReactElement} from "react";
import {LandingPage} from "@/components/pages/LandingPage";
import {Header} from "@/components/shared/header";
import HomeWrapper from "@/components/wrappers/HomeWrapper";

export const HomePageLayout = ():ReactElement => {

    return (
        <HomeWrapper>
            <div>
                <Header />
                <LandingPage />
            </div>
        </HomeWrapper>
    )
}
