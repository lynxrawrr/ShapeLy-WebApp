import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Shapes from "../pages/Shapes/Shapes";
import ShapeViewerRoute from "../pages/ShapeViewer/ShapeViewerRoute";

import NotFound from "../pages/NotFound/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      /* Pages */
      { index: true, element: <Home /> },
      { path: "shapes", element: <Shapes /> },
      { path: "about", element: <About /> },

      /* Viewer */
      { path: "shape/:key", element: <ShapeViewerRoute /> },

      /* 404 */
      { path: "*", element: <NotFound /> },
    ],
  },
]);
