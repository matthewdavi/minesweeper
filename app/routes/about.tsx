import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutComponent,
});

function AboutComponent() {
  return (
    <>
      <head>
        <title>Router Demo - About Us</title>
        <meta property="og:title" content="Router Demo - About Us" />
        <meta
          property="og:description"
          content="Exploring the power of React Router"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/about" />
      </head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <h1 className="text-4xl font-bold text-white mb-6 background-animate">
              Router Demo
            </h1>
            <div className="space-y-4 text-white/90">
              <p className="text-lg">
                Welcome to our router demonstration! This showcase highlights
                the powerful capabilities of modern React routing with beautiful
                UI components.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                  <h3 className="text-xl font-semibold mb-2">
                    Dynamic Routing
                  </h3>
                  <p>Experience seamless navigation with type-safe routes.</p>
                </div>
                <div className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                  <h3 className="text-xl font-semibold mb-2">Modern Design</h3>
                  <p>Beautiful gradients and glass-morphism effects.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
