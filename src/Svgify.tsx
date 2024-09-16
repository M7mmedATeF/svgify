import { useEffect, useState } from "react";
import axios from "axios";
import parse from "html-react-parser";
import { SvgifyProps } from "./types";

/**
 *
 * @param IconName The name of the SVG icon (filename without extension
 * @param FontWeight The font weight for the icon (default is "both") or ["both", "fill", "stroke]
 * @param Scale The scale factor of the icon width and height (default is 0.7)
 * @param className The custom CSS class to modify the svg icon
 * @param style // An inline styles for the component
 * @param LoadingElement // The text or element to be displayed while fetching the svg
 * @param NotFoundElement // The text or element to be displayed on fetch error
 * @author Mohammed Atef
 * @returns span that includes svg icon as SVG element
 */

const Svgify = ({
    IconName = "",
    className = "",
    Scale = 1,
    FontWeight = "fill",
    LoadingElement = "",
    NotFoundElement = "",
    style = {},
}: SvgifyProps) => {
    // State to store the SVG content and selected font style
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [fontStyle, setFontStyle] = useState(`svg_modifier_style_both`);

    // Fetches and processes the SVG when the component mounts or props change
    useEffect(() => {
        // Update the font style based on the FontWeight prop
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

        // Fetch and process the SVG file
        const fetchSvg = async () => {
            try {
                let svg = localStorage.getItem(`svgify_${IconName}`) || "";

                if (!svg) {
                    const path = `/assets/icons/${IconName}.svg`;
                    const response = await axios.get(path);
                    svg = response.data;

                    if (svg.match(/<html/g)) {
                        throw new Error("Invalid SVG format");
                    }

                    // Remove inline fill and stroke styles from the SVG
                    svg = svg.replace(/fill="[^"]*"/g, "");
                    svg = svg.replace(/stroke="[^"]*"/g, "");

                    localStorage.setItem(`svgify_${IconName}`, svg);
                }

                // Calculate the aspect ratio to maintain the icon's proportions
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
                    // Default to square dimensions if width or height is missing
                    if (!widthMatch)
                        svg = svg.replace("<svg", `<svg width="1em"`);
                    if (!heightMatch)
                        svg = svg.replace("<svg", `<svg height="1em"`);
                }

                // Adjust the SVG dimensions based on the Scale prop
                svg = svg.replace(
                    /height="[^"]*"/,
                    `height="${Scale * 1.5 * aspectRatio}em"`
                );
                svg = svg.replace(/width="[^"]*"/, `width="${Scale * 1.5}em"`);
                // Update the state with the processed SVG content
                setSvgContent(svg);
            } catch (error) {
                setSvgContent("SVGIFY_ERROR");
                console.error("Error fetching SVG:", error);
            }
        };

        fetchSvg();
    }, [IconName, Scale, FontWeight]);

    return (
        <span
            className={`svg-font-icon svg_modifier_style ${fontStyle} ${
                className || ""
            }`}
            style={style}>
            {svgContent
                ? svgContent === "SVGIFY_ERROR"
                    ? NotFoundElement
                    : parse(svgContent)
                : LoadingElement}
        </span>
    );
};

export default Svgify;
