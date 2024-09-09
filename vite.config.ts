import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "index",
            // Generates different file names based on the format
            fileName: (format) => {
                if (format === "es") return "index.es.js";
                if (format === "cjs") return "index.cjs";
                if (format === "umd") return "index.umd.js";
                return "index.js"; // Default fallback to .js for iife or other formats
            },
            formats: ["es", "cjs", "umd", "iife"], // Multiple formats
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
        sourcemap: true,
        cssMinify: true,
        minify: true,
        emptyOutDir: true,
    },
    plugins: [
        react(),
        dts({
            outDir: "dist/types", // Specifies the output directory for the .d.ts files
            entryRoot: "src", // Makes sure src/ is not reflected in the output structure
        }),
    ],
});
