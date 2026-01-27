import { createRouter } from "@tanstack/react-router";
import CatchBoundary from "./components/catchBoundary";
import NotFound from "./components/notFound";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultErrorComponent: CatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  });

  return router;
}
