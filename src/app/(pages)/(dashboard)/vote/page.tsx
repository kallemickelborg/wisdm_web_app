"use client";

import dynamic from "next/dynamic";

const VoteView = dynamic(() => import("./VoteView"), {
  ssr: false,
  loading: () => null,
});

export default function VotePage() {
  return <VoteView />;
}
