// app/routes/__root.tsx
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import type { ReactNode } from "react";
import cssInline from "../main.css?inline";

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
        title: "Progressively Enhanced Minesweeper",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => <div>404</div>,
  errorComponent: () => <div>error</div>,
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
        <style dangerouslySetInnerHTML={{ __html: cssInline }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
