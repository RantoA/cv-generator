import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { NotFoundPage } from "./NotFoundPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { EditorPage } from "@/features/cv-editor/EditorPage";
import { PreviewPage } from "@/features/cv-preview/PreviewPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [{ path: "/", element: <DashboardPage /> }],
  },
  { path: "/cv/:id/edit", element: <EditorPage /> },
  { path: "/cv/:id/preview", element: <PreviewPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
