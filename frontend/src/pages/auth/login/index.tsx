import {JSX, ReactElement} from "react";
import LoginPage from "@/components/forms/Login";
import WithPublicRoute from "@/components/wrappers/PublicWrapper";

const Login = (): ReactElement => {
    return (
        <div className="flex justify-center items-center h-screen">
            <LoginPage />
        </div>
    )
}

export default WithPublicRoute(Login);
