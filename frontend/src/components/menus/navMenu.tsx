import {ReactElement} from "react";
import logo from "../../../public/assets/images/logo.png";
import {GButton} from "@/components/buttons/GButton";
import {useRouter} from "next/router";

export const NavMenu = (): ReactElement => {
    const router = useRouter();
    const handleLoginClick = () => {
        router.replace('/auth/login');
    }
    return(
        <div className="nav-menu flex justify-between px-14 pt-3">
            <div className="w-44">
                <img src={logo.src} alt="logo" />
            </div>
            <div className="nav-menu__links flex items-center gap-8">
                <GButton name="Login" type="secondary" withBorder={true} size="medium" bordered={true} onClick={handleLoginClick} />
            </div>
        </div>
    )
}
