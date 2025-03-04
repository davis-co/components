# PageCard Component

The `PageCard` component is a reusable card-like element designed to represent pages in a grid or list layout. It displays an image, a title, and links to the specified page using React Router's `Link` component.

---

## Features

-   **Dynamic Routing:** Leverages `Link` from React Router for seamless navigation.
-   **Responsive Design:** Adapts layout and sizes for various screen sizes using Tailwind CSS.
-   **Lazy Loading Images:** Improves performance by loading images only when they are visible.
-   **Customizable Styles:** Supports additional `className` for easy styling overrides.
-   **Graceful Fallbacks:** Handles missing `title` or `image` with sensible defaults.

---

## Usage

### Basic Example

```jsx
import { PageCard } from "react-elements-davis"

const page = {
    link: "/home",
    title: "Home",
    image: "/images/home-icon.png",
}

function App() {
    return <PageCard page={page} />
}
```

---

## With Additional Props

```jsx
import { PageCard } from "react-elements-davis"

const page = {
    link: "/about",
    title: "About Us",
    image: "/images/about-icon.png",
}

function App() {
    return (
        <PageCard
            page={page}
            className="custom-class"
            onClick={() => console.log("Page clicked!")}
        />
    )
}
```

---

## Props

| Prop      | Type   | Default   | Description                                               |
| --------- | ------ | --------- | --------------------------------------------------------- |
| page      | object | required  | An object containing link, title, and image for the page. |
| className | string | ""        | Optional additional class names for custom styling.       |
| ...props  | any    | undefined | Any additional props are passed to the Link component.    |

---

## page Object Schema

| Key   | Type   | Default | Description                               |
| ----- | ------ | ------- | ----------------------------------------- |
| link  | string |         | The URL or route for the page.            |
| title | string |         | Page" The title displayed on the card.    |
| image | string |         | The image URL displayed as the card icon. |
