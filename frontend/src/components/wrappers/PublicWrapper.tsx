import { useRouter } from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import { RootState } from '@/_shared/redux/store';
import { isValidToken } from '@/_shared/utils/validations/jwt.validation';
import {setCredentials, setUserInfo} from "@/_shared/redux/slices/auth.slice";

const WithPublicRoute = (Wrapped: any) => {
    return (props: any) => {
        const router = useRouter();
        const dispatch = useDispatch();
        const token = useSelector((state: RootState) => state.auth.token);
        if (typeof window !== 'undefined')
        {
            const localToken = localStorage.getItem('_falcon_tkn');

            if (!token && localToken) {
                dispatch(setCredentials({ token: localToken }));
            }

            if (
                (token && isValidToken(token)) ||
                (localToken && isValidToken(localToken))
            ) {
                return null;
            }

        }
        return <Wrapped {...props} />;
    };
};

export default WithPublicRoute;
