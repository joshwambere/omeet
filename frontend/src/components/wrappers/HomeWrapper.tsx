import React, { FC } from 'react';

type HomePageWrapperType = {
    children: React.ReactNode;
};

const HomeWrapper: FC<HomePageWrapperType> = ({ children }) => {
    return <div className="flex items-center justify-end">{children}</div>;
};

export default HomeWrapper;
