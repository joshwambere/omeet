import React, { FC } from 'react';

type AuthPageWrapperType = {
    children: React.ReactNode;
};

const AuthWrapper: FC<AuthPageWrapperType> = ({ children }) => {
    return <div className="auth-wrapper bg-[#3791f3]  h-screen w-full flex items-center justify-end">{children}</div>;
};

export default AuthWrapper;
