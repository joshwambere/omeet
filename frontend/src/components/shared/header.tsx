import { ReactElement, useEffect, useState } from "react";
import { NavMenu } from "@/components/menus/navMenu";

export const Header = (): ReactElement => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 0;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`sticky top-0 bg-transparent z-10 transition-transform duration-300 ${scrolled ? 'shadow-md transform -translate-y-0' : ''}`}>
            <NavMenu />
        </div>
    );
};
