"use client";

import dynamic from "next/dynamic";

const HomeView = dynamic(() => import("./HomeView"), {
  ssr: false,
  loading: () => null,
});

export default function HomePage() {
  return <HomeView />;
}
