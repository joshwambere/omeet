import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { routes } from '@/config/router.config';
import { RootState } from '@/_shared/redux/store';
import { isValidToken } from '@/_shared/utils/validations/jwt.validation';

const WithPublicRoute = (Wrapped: any) => {
    return (props: any) => {
        const router = useRouter();
        const token = useSelector((state: RootState) => state.auth.token);
        if (typeof window !== 'undefined')
        {
            const localToken = localStorage.getItem('_falcon_tkn');

            if (
                (token && isValidToken(token)) ||
                (localToken && isValidToken(localToken))
            ) {
                router.replace(routes.chat.url);
                return null;
            }
        }
        return <Wrapped {...props} />;
    };
};

export default WithPublicRoute;
