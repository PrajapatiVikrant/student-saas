"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-4 flex items-center gap-2 text-sm bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded hover:bg-slate-300 dark:hover:bg-slate-600"
    >
      ← Back
    </button>
  );
}