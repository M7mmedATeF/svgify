import React, { createContext, useContext, ReactNode } from "react";

interface SvgifyContextType {
    version: number;
    clearForOldVersion: boolean;
}

const SvgifyContext = createContext<SvgifyContextType>({
    version: 1,
    clearForOldVersion: true,
});

type SvgifyProviderProps = addNotRequired<SvgifyContextType> & {
    children: ReactNode;
};

type addNotRequired<TYPE> = {
    [props in keyof TYPE]+?: TYPE[props];
};

const Svgifier: React.FC<SvgifyProviderProps> = ({
    children,
    version = 0,
    clearForOldVersion = false,
}) => {
    return (
        <SvgifyContext.Provider value={{ version, clearForOldVersion }}>
            {children}
        </SvgifyContext.Provider>
    );
};

const useSvgifyContext = (): SvgifyContextType => {
    const context = useContext(SvgifyContext);
    if (!context) {
        throw new Error("Svgifier Should be activated before using svgify");
    }
    return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { Svgifier, useSvgifyContext };
