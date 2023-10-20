import { ReactElement} from "react";
import SignupPage from "@/components/forms/Signup";
import WithPublicRoute from "@/components/wrappers/PublicWrapper";

const Signup = (): ReactElement => {
    return (
        <div className="flex justify-center items-center h-screen">
            <SignupPage />
        </div>
    )
}

export default WithPublicRoute(Signup);
