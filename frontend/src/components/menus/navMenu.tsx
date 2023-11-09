import {ReactElement, Ref} from "react";
import logo from "../../../public/assets/images/logo.png";
import {GButton} from "@/components/buttons/GButton";
import {useRouter} from "next/router";
import {Profile} from "@/components/shared/Profile";


type NavMenuProps = {
    isAuthenticated: boolean
}
export const NavMenu = (props:NavMenuProps): ReactElement => {
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
                {
                    !props.isAuthenticated ? (
                        <GButton name="Login" type="secondary" withBorder={true} size="medium" bordered={true} onClick={handleLoginClick} />
                    ):<Profile name="GB" id={"1111"}/>
                }
                
            </div>
        </div>
    )
}
