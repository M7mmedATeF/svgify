# Svgify

<div style="display:flex; justify-content:center; width: 100%;">
<img src="https://res.cloudinary.com/dclbtusww/image/upload/v1725670993/Sumcode/Svgify/spkctkwkydsmnvki85di.png" alt="Svgify Logo" />
</div>
<br/>
`Svgify` is a lightweight React component designed to dynamically render and style SVG icons. It fetches SVG files from the `public/assets/icons` directory, allowing you to easily integrate scalable vector graphics into your React application with customizable properties.

## Features

-   **Dynamic SVG Rendering:** Fetches and displays SVG icons based on the provided `IconName`.
-   **Customizable Styling:** Supports inline styles, CSS classes, and different font weights (fill, stroke, or both).
-   **Scalable Icons:** Adjust the size of your icons with the `Scale` factor that will be multiplied by css `font-size` property.

## Version

![Beta Version](https://img.shields.io/badge/Beta_Version-1.0.1-blue.svg)

The project is still in its beta version so some errors may occur or some icons may not accept the changes .. so please be helpful and report us for any problems you face.

## Installation

Install the package via npm:

```
npm install svgify
```

Add StyleSheet to your _`App.jsx`_ file.

```js
import "@sumcode/svgify/styles";
```

Initiate folder structure:

-   Make folder _`public/assets/icons`_.
-   Download your _`YOUR_ICON_NAME.svg`_ in the folder.

```
.
└── my-project
    ├── node_modules
    ├── public
    │   └── assets
    │       └── icons (Add your svg icons here)
    │           └── YOUR_ICON_NAME.svg
    └── src
        └── app.jsx (Add stylesheet here)
```

## Example

```js
import "./App.css";
import Svgify from "@sumcode/svgify";

function App() {
    return (
        <>
            <Svgify IconName="YOUR_ICON_NAME" Scale={1.2} FontWeight="stroke" />
        </>
    );
}

export default App;
```

## Parameters

| Parameter         | Type                     | Initial value | Usage                                                            |
| :---------------- | :----------------------- | :------------ | :--------------------------------------------------------------- |
| `IconName`        | `string`\*               | `""`          | The name of the icon in the mentioned path without its extension |
| `FontWeight`      | `string`?                | `fill`        | Specifies the type of the icon `"stroke"` , `"fill"` , `"both"`  |
| `Scale`           | `float`?                 | `1`           | The factor to be multiplied by the styled `font-size`            |
| `className`       | `string`?                | `""`          | Custom ClassName to be passed to the `span` element              |
| `style`           | `React.CSSProperties`?   | `{}`          | An inline styles for the component                               |
| `LoadingElement`  | `"" \| React.ReactNode`? | `""`          | The text or element to be displayed while fetching the svg       |
| `NotFoundElement` | `"" \| React.ReactNode`? | `""`          | The text or element to be displayed on fetch error               |

## Author

-   Mohammed Atef
    -   [LinkedIn](https://www.linkedin.com/in/m7mmed3atef/)
    -   [Github](https://github.com/M7mmedATeF)
