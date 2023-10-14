import React, { ReactElement } from "react";

interface GButtonProps {
    name: string;
    type: "primary" | "secondary";
    withBorder: boolean;
    size: "small" | "medium" | "large";
    bordered?: boolean;
    onClick?: () => void;
}

export const GButton = ({ name, type, withBorder, size, bordered,onClick }: GButtonProps): ReactElement => {
    const primaryStyles = {
        backgroundColor: "#3791f3",
        color: "#ffffff",
        border: withBorder ? "none" : "1px solid #3791f3",
        borderRadius: bordered?"1.5rem" : ".25rem",
    };

    const secondaryStyles = {
        backgroundColor: "transparent",
        color: "#3791f3",
        border: withBorder ? "1px solid #3791f3" : "none",
        borderRadius: bordered?"1.5rem" : ".25rem",
    };

    const buttonStyles = type === "primary" ? primaryStyles : secondaryStyles;

    const sizeStyles = {
        small: { fontSize: "14px", height: "32px", padding: "0 1rem" },
        medium: { fontSize: "18px", height: "40px", padding: "0 2rem" },
        large: { fontSize: "24px", height: "52px", padding: "0 3rem" },
    };

    return (
        <button
            className="g-button__button"
            style={{ ...buttonStyles, ...sizeStyles[size] }}
            onClick={() => onClick ? onClick() :null}
        >
            {name}
        </button>
    );
};
