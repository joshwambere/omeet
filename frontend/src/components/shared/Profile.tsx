import {ReactElement} from "react";
import {Dropdown, MenuProps} from "antd";
import {FiUser} from "react-icons/fi";
import {BiLogOut} from "react-icons/bi";
import {useUserLogoutMutation} from "@/services/endpoints/auth.endpoint";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/_shared/redux/store";
import {removeCredentials} from "@/_shared/redux/slices/auth.slice";
import {ErrorMessage} from "@/components/shared/messages/Error.message";
import {useRouter} from "next/router";


type ProfileProps = {
    name: string,
    id: string,
    profilePicture?: string
}
export const Profile = (props:ProfileProps):ReactElement => {

    const dispatch = useDispatch();
    const router = useRouter();

    const token = useSelector((state: RootState) => state.auth.token);
    const localToken = localStorage.getItem('_falcon_tkn');
    const generateProfileColor = (name:string,secretKey:string) => {
        const initials = getInitials(name);

        const combinedText = initials + secretKey;

        let hash = 0;
        for (let i = 0; i < combinedText.length; i++) {
            hash = combinedText.charCodeAt(i) + ((hash << 5) - hash);
        }

        const hue = Math.abs(hash) % 360;

        return `hsl(${hue}, 100%, 100%)`;
    }
    const getInitials = (name:string) => {
        return name.split(" ").map((n) => n[0]).toString();
    }


    const handleClick: MenuProps['onClick'] = (e) => {
        e.key === '1' && handleLogout();
    };

    const handleLogout = () => {
        try {
            localToken && localStorage.removeItem('_falcon_tkn');
            token && dispatch(removeCredentials());
        }catch (e) {
            ErrorMessage('something went wrong');
        }
    }
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Logout',
            icon: <BiLogOut />,
        },
        {
            label: 'Profile',
            key: '2',
            icon: <FiUser />,
        },
    ]

    const menuProps = {
        items,
        onClick: handleClick,
    };



    return (
        <div className="flex justify-center items-center bg-[#63A7FFFF] opacity-80 w-10 h-10 rounded-full hover:cursor-pointer">
            <Dropdown menu={menuProps} placement="bottomCenter" arrow={{ pointAtCenter: true }} overlayClassName="profile-dropdown">
                {
                    !props.profilePicture ? (<span style={{color: generateProfileColor(props.name, props.id)}}
                                                   className="font-medium text-lg uppercase tracking-wider">{props.name}</span>)
                        :(<img src={props.profilePicture} alt="profile" className="w-10 h-10 rounded-full" />)
                }
            </Dropdown>

        </div>
    )
}
