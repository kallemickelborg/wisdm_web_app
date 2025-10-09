"use client";

import dynamic from "next/dynamic";

const ExploreView = dynamic(() => import("./ExploreView"), {
  ssr: false,
  loading: () => null,
});

export default function ExplorePage() {
  return <ExploreView />;
}
