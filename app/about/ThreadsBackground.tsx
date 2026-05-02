"use client";

import dynamic from "next/dynamic";

const Threads = dynamic(() => import("../components/ui/Threads"), {
  ssr: false,
  loading: () => null,
});

export default function ThreadsBackground() {
  return (
    <Threads
      color={[0.722, 0.584, 0.392]}
      amplitude={1.8}
      distance={0.3}
      enableMouseInteraction
    />
  );
}
