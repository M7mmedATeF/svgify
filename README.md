# Svgify

<div style="text-align:center">
<img src="https://res.cloudinary.com/dclbtusww/image/upload/v1725670993/Sumcode/Svgify/spkctkwkydsmnvki85di.png" alt="Svgify Logo" />
</div>
<br/>
`Svgify` is a lightweight React component designed to dynamically render and style SVG icons. It fetches SVG files from the `public/assets/icons` directory, allowing you to easily integrate scalable vector graphics into your React application with customizable properties.

## Features

-   **Dynamic SVG Rendering:** Fetches and displays SVG icons based on the provided `IconName`.
-   **Customizable Styling:** Supports inline styles, CSS classes, and different font weights (fill, stroke, or both).
-   **Scalable Icons:** Adjust the size of your icons with the `Scale` factor that will be multiplied by css `font-size` property.

## Version

![Beta Version](https://img.shields.io/badge/Beta_Version-1.0.0-red.svg)

The project is still in its beta version so some errors may occur or some icons may not accept the changes .. so please be helpful and report us for any problems you face.

## Installation

Install the package via npm:

```
npm install svgify
```

Initiate folder structure:

-   Add StyleSheet to your _`App.jsx`_ file.

```js
import "@sumcode/svgify/styles";
```

-   Make folder _`public/assets/icons`_.
-   Download your _`icon.svg`_ in the folder.

## Example

```js
import "./App.css";
import Svgify from "@sumcode/svgify";

function App() {
    return (
        <>
            <Svgify IconName="YOUR_ICON_NAME" />
        </>
    );
}

export default App;
```

## Parameters

| Parameter    | Type                   | value  | Usage                                                           |
| :----------- | :--------------------- | :----- | :-------------------------------------------------------------- |
| `IconName`   | `string`\*             | `""`   | The name of the icon in the mentiond path without its extention |
| `FontWeight` | `string`?              | `both` | Speifies the type of the icon `"stroke"` , `"fill"` , `"both"`  |
| `Scale`      | `float`?               | `0.7`  | The factor to be multiplied by the styled `font-size`           |
| `className`  | `string`?              | `""`   | Custom classname to be passed to the `span` element             |
| `style`      | `React.CSSProperties`? | `{}`   | An inline styles for the component                              |

## Author

-   [@Mohammed Atef](https://github.com/M7mmedATeF)
