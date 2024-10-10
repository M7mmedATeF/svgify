import axios, { AxiosResponse } from "axios";
import React, { createContext, useContext, ReactNode } from "react";

interface SvgifyContextType {
    version: number;
    clearForOldVersion: boolean;
    base_path?: string;
    FetchIcon?: (
        IconName: string,
        timed?: boolean | undefined
    ) => Promise<AxiosResponse<unknown, unknown>>;
}

// Default context values
const SvgifyContext = createContext<SvgifyContextType>({
    version: 1,
    clearForOldVersion: true,
    base_path: "/assets/icons/",
});

// Make certain properties optional using addNotRequired type
type SvgifyProviderProps = Optional<SvgifyContextType> & {
    children: ReactNode;
    base_path?: string;
};

// Helper type to make properties optional
type Optional<TYPE> = {
    [props in keyof TYPE]+?: TYPE[props];
};

// Track promises for fetching icons
const FetchingList: Record<
    string,
    Promise<AxiosResponse<unknown, unknown>>
> = {};

const requestIDX: Record<string, number> = {};

// Svgifier component to provide context
const Svgifier: React.FC<SvgifyProviderProps> = ({
    children,
    base_path = "/assets/icons",
    version = 1,
    clearForOldVersion = true,
    FetchIcon,
}) => {
    let newPath = !base_path.startsWith("/") ? `/${base_path}` : base_path;
    newPath = newPath.endsWith("/")
        ? `${newPath.slice(0, newPath.length - 1)}`
        : newPath;

    const FetchIconData = async (
        IconName: string,
        timed: boolean | undefined = false
    ): Promise<AxiosResponse<unknown, unknown>> => {
        let returnValue: Promise<AxiosResponse<unknown, unknown>>;

        try {
            if (Object.keys(FetchingList).includes(IconName)) {
                returnValue = FetchingList[IconName];
            } else if (!timed) {
                const idx = requestIDX[IconName] + 1 || 0;
                if (idx === 0) {
                    requestIDX[IconName] = idx;
                }
                // Delay and retry logic
                returnValue = new Promise((resolve) => {
                    setTimeout(
                        async () => {
                            const result = await FetchIconData(IconName, true);
                            resolve(result);
                        },
                        idx === 0 ? 0 : 5
                    );
                });
            } else {
                const iconPath = `${newPath}/${IconName}.svg`;

                const request = FetchIcon
                    ? FetchIcon(iconPath)
                    : axios.get(iconPath);
                FetchingList[IconName] = request;
                returnValue = request;
            }
        } catch (error) {
            console.error(`Error fetching icon ${IconName}`);
            throw error;
        }

        return returnValue;
    };

    return (
        <SvgifyContext.Provider
            value={{ version, clearForOldVersion, FetchIcon: FetchIconData }}>
            {children}
        </SvgifyContext.Provider>
    );
};

// Hook to use the Svgify context
const useSvgifyContext = (): SvgifyContextType => {
    const context = useContext(SvgifyContext);
    if (!context) {
        throw new Error("Svgifier must be used within an SvgifyProvider.");
    }
    return context;
};

// Exporting components and hook
export { Svgifier, useSvgifyContext };
