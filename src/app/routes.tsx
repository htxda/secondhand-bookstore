import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { BookListPage } from "./pages/BookListPage";
import { BookDetailPage } from "./pages/BookDetailPage";
import { PublishPage } from "./pages/PublishPage";
import { ProfilePage } from "./pages/ProfilePage";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "books", Component: BookListPage },
      { path: "books/:id", Component: BookDetailPage },
      { path: "publish", Component: PublishPage },
      { path: "profile", Component: ProfilePage },
    ],
  },
]);
