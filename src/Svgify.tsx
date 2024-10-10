import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { SvgifyProps } from "./types";
import { useSvgifyContext } from "./SvgifyContext";

/**
 * Svgify component: Fetches and displays an SVG icon with various customization options.
 *
 * @param IconName The name of the SVG icon (filename without extension).
 * @param FontWeight Font weight for the icon (default is "fill").
 * @param Scale Scale factor for the icon size (default is 1).
 * @param className Custom CSS class for the SVG icon.
 * @param style Inline styles for the component.
 * @param LoadingElement Element to show while the SVG is loading.
 * @param NotFoundElement Element to show if the SVG is not found.
 * @returns A span that includes the SVG icon.
 */
const Svgify: React.FC<SvgifyProps> = ({
    IconName = "",
    className = "",
    Scale = 1,
    FontWeight = "fill",
    LoadingElement = "",
    NotFoundElement = "",
    ...props
}) => {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [fontStyle, setFontStyle] = useState(`svg_modifier_style_both`);
    const { version, clearForOldVersion, FetchIcon } = useSvgifyContext();
    const [fetched, setFetched] = useState<boolean>(false);

    useEffect(() => {
        if (!fetched) {
            const cachedVersion =
                Number(localStorage.getItem("svgify_cached_version")) || -1;

            if (cachedVersion != version) {
                localStorage.setItem(
                    "svgify_cached_version",
                    JSON.stringify(version)
                );

                for (const key of Object.keys(localStorage)) {
                    if (
                        key.startsWith(`svgify_`) &&
                        !key.includes(`${version}`) &&
                        key !== "svgify_cached_version"
                    )
                        localStorage.removeItem(key);
                }
                if (clearForOldVersion)
                    localStorage.removeItem(`svgify_${IconName}`);
            }

            // Update font style based on FontWeight prop
            switch (FontWeight) {
                case "fill":
                    setFontStyle(`svg_modifier_style_fill`);
                    break;
                case "stroke":
                    setFontStyle(`svg_modifier_style_stroke`);
                    break;
                default:
                    setFontStyle(`svg_modifier_style_both`);
                    break;
            }

            const fetchSvg = async () => {
                try {
                    let svg =
                        localStorage.getItem(`svgify_${version}_${IconName}`) ||
                        "";

                    if (!svg && FetchIcon) {
                        const response = await FetchIcon(IconName);

                        if (response?.data) {
                            svg = "" + response.data;

                            if (svg.match(/<html/g)) {
                                throw new Error("Invalid SVG format");
                            }

                            // Remove inline fill and stroke styles
                            svg = svg
                                .replace(/fill="[^"]*"/g, "")
                                .replace(/stroke="[^"]*"/g, "");

                            // Try to store the SVG in localStorage and handle storage quota
                            try {
                                localStorage.setItem(
                                    `svgify_${version}_${IconName}`,
                                    JSON.stringify(svg)
                                );
                            } catch (e) {
                                if (
                                    e instanceof DOMException &&
                                    e.code === 22
                                ) {
                                    console.warn(
                                        "Storage quota exceeded, clearing storage..."
                                    );
                                    localStorage.clear(); // Optional: refine this to remove specific items
                                } else {
                                    throw e; // If it's not a quota error, rethrow it
                                }
                            }
                        }
                    } else {
                        svg = JSON.parse(svg);
                    }

                    // Calculate aspect ratio
                    const widthMatch = svg.match(
                        /width="(\d+(\.\d+)?(px|em|rem|%)?)"/
                    );
                    const heightMatch = svg.match(
                        /height="(\d+(\.\d+)?(px|em|rem|%)?)"/
                    );
                    let aspectRatio = 1;

                    if (widthMatch && heightMatch) {
                        const originalWidth = parseFloat(widthMatch[1]);
                        const originalHeight = parseFloat(heightMatch[1]);
                        aspectRatio = originalHeight / originalWidth;
                    } else {
                        // Add default width and height if missing
                        if (!widthMatch)
                            svg = svg.replace("<svg", `<svg width="1em"`);
                        if (!heightMatch)
                            svg = svg.replace("<svg", `<svg height="1em"`);
                    }

                    // Adjust dimensions based on Scale prop
                    svg = svg.replace(
                        /height="[^"]*"/,
                        `height="${Scale * 1.5 * aspectRatio}em"`
                    );
                    svg = svg.replace(
                        /width="[^"]*"/,
                        `width="${Scale * 1.5}em"`
                    );

                    setFetched(true);
                    setSvgContent(svg);
                } catch (error) {
                    setSvgContent("SVGIFY_ERROR");
                    console.error("Error fetching SVG:", error);
                }
            };

            fetchSvg();
        }
    }, [IconName, Scale, FontWeight, version, clearForOldVersion]);

    return (
        <span
            className={`svg-font-icon svg_modifier_style ${fontStyle} ${
                className || ""
            }`}
            {...props}>
            {svgContent
                ? svgContent === "SVGIFY_ERROR"
                    ? NotFoundElement
                    : parse(svgContent)
                : LoadingElement}
        </span>
    );
};

export default Svgify;
