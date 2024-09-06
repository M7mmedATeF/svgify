import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "Svgify",
            fileName: (format) => `svgify.${format}.js`,
        },
        rollupOptions: {
            external: ["react", "react-dom"], // Mark these as external dependencies
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
    },
});
