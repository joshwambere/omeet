import {ReactElement} from "react";


type ProfileProps = {
    name: string,
    id: string,
    profilePicture?: string
}
export const Profile = (props:ProfileProps):ReactElement => {
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

    return (
        <div className="flex justify-center items-center bg-[#63A7FFFF] opacity-80 w-10 h-10 rounded-full hover:cursor-pointer">
            {
                !props.profilePicture ? (<span style={{color: generateProfileColor(props.name, props.id)}}
                                              className="font-medium text-lg uppercase tracking-wider">{props.name}</span>)
                    :(<img src={props.profilePicture} alt="profile" className="w-10 h-10 rounded-full" />)
            }
        </div>
    )
}
