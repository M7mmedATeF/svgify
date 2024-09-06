import React, { useEffect, useState } from "react";
import axios from "axios";
import parse from "html-react-parser";
import style_file from "./Svgify.module.css";
import { SvgifyProps } from "./types";

/**
 *
 * @param IconName The name of the SVG icon (filename without extension
 * @param FontWeight The font weight for the icon (default is "both") or ["both", "fill", "stroke]
 * @param Scale The scale factor of the icon width and height (default is 0.7)
 * @param className The custom CSS class to modify the svg icon
 * @param style // An inline styles for the component
 * @author Mohammed Atef
 * @returns span that includes svg icon as SVG element
 */

const Svgify = ({
    IconName = "",
    className = "",
    Scale = 1,
    FontWeight = "both",
    style = {},
}: SvgifyProps) => {
    // State to store the SVG content and selected font style
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [fontStyle, setFontStyle] = useState(
        style_file.svg_modifier_style_both
    );

    // Fetches and processes the SVG when the component mounts or props change
    useEffect(() => {
        // Update the font style based on the FontWeight prop
        switch (FontWeight) {
            case "fill":
                setFontStyle(style_file.svg_modifier_style_fill);
                break;
            case "stroke":
                setFontStyle(style_file.svg_modifier_style_stroke);
                break;
            default:
                setFontStyle(style_file.svg_modifier_style_both);
                break;
        }

        // Fetch and process the SVG file
        const fetchSvg = async () => {
            try {
                const path = `/assets/icons/${IconName}.svg`;
                const response = await axios.get(path);
                let svg = response.data;

                // Remove inline fill and stroke styles from the SVG
                svg = svg.replaceAll(/fill="[^"]*"/g, "");
                svg = svg.replaceAll(/stroke="[^"]*"/g, "");

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
                console.error("Error fetching SVG:", error);
            }
        };

        fetchSvg();
    }, [IconName, Scale, FontWeight]);

    return (
        <span
            className={`svg-font-icon ${style_file.svg_modifier_style} ${fontStyle} ${className}`}
            style={style_file}>
            {svgContent ? parse(svgContent) : "Loading..."}
        </span>
    );
};

export default Svgify;
