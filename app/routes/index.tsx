import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import "../main.css";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <>
      <head>
        <title>Router Demo - Home</title>
        <meta property="og:title" content="Router Demo - Modern React Router" />
        <meta
          property="og:description"
          content="Experience modern React routing"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/" />
      </head>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <h1 className="text-4xl font-bold text-white mb-6 background-animate">
              Welcome to Router Demo
            </h1>
            <div className="space-y-4 text-white/90">
              <p className="text-lg">
                Discover the elegance of modern React routing with our
                interactive demo. Navigate through different routes and
                experience seamless transitions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                  <h3 className="text-xl font-semibold mb-2">Type Safe</h3>
                  <p>Built with TypeScript for reliability</p>
                </div>
                <div className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                  <h3 className="text-xl font-semibold mb-2">Fast & Light</h3>
                  <p>Optimized for performance</p>
                </div>
                <div className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                  <h3 className="text-xl font-semibold mb-2">Modern UI</h3>
                  <p>Beautiful, responsive design</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
