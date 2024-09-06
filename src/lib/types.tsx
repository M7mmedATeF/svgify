// TypeScript type for the component's props
export interface SvgifyProps {
    IconName: string; // The name of the SVG icon (filename without extension)
    Scale?: number; // Scaling factor for the icon size (default is 1)
    className?: string; // Additional CSS classes for styling
    style?: React.CSSProperties; // An inline styles for the component
    FontWeight?: "both" | "fill" | "stroke"; // Style preference for the icon: fill, stroke, or both (default is both)
}
