"use client";

import dynamic from "next/dynamic";

const ProfileView = dynamic(() => import("./ProfileView"), {
  ssr: false,
  loading: () => null,
});

export default function ProfilePage() {
  return <ProfileView />;
}
