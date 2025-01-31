// app/routes/__root.tsx
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import type { ReactNode } from "react";
import cssUrl from "../main.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Progressive Enhanced Minesweeper",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => <div>404</div>,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <Meta />
        <link rel="stylesheet" href={cssUrl} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
