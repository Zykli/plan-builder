import React, { ComponentProps, FC, ReactNode, SVGAttributes } from "react";

const Icon: FC<SVGAttributes<SVGSVGElement>> = ({
    children,
    ...props
}) => {
    return (
        <svg width={24} height={24} focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="FullscreenIcon" tabIndex={-1} {...props}>
            {children}
        </svg>
    );
};

const createIcon = (node: ReactNode): FC<ComponentProps<typeof Icon>> => {
    return (props) => {
        return (
            <Icon {...props}>
                {node}
            </Icon>
        );
    };
};

export const FullScreen = createIcon(<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path>);
export const FullScreenExit = createIcon(<path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"></path>);
export const AspectRatio = createIcon(<path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z"></path>);
export const FitScreen = createIcon(<path d="M6 16h12V8H6v8zm2-6h8v4H8v-4zm-4 5H2v3c0 1.1.9 2 2 2h3v-2H4v-3zm0-9h3V4H4c-1.1 0-2 .9-2 2v3h2V6zm16-2h-3v2h3v3h2V6c0-1.1-.9-2-2-2zm0 14h-3v2h3c1.1 0 2-.9 2-2v-3h-2v3z"></path>);
export const Crop = createIcon(<path d="M17 15h2V7c0-1.1-.9-2-2-2H9v2h8v8zM7 17V1H5v4H1v2h4v10c0 1.1.9 2 2 2h10v4h2v-4h4v-2H7z"></path>);
export const Rotate = createIcon(<path d="M21 11V3h-8l3.29 3.29-10 10L3 13v8h8l-3.29-3.29 10-10z"></path>);