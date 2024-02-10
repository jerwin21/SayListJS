"use client";
import Image from "next/image";
import Authentication from "@/components/Authentication";
import Saylist from "@/components/Saylist";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import useRefreshToken from "@/hooks/useRefreshToken";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  useEffect(() => {
    // Perform the URL replacement after component mounts
    if (code) {
      router.replace("/", undefined, { shallow: true });
    }
  }, [code, router]);

  const { isAuthenticated, isLoading } = useRefreshToken(code);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading Profile info...
      </div>
    );
  }
  return (
    <main className="flex flex-col items-center justify-center min-h-screen border border-purple-500">
      <div className="flex flex-col items-center w-full max-w-screen-md border border-green-500 p-10">
        <h3 className="text-5xl font-mono border border-red-500">Saylist</h3>
        <div className="flex flex-col w-full items-center m-10 shadow-md rounded-lg border border-yellow-400">
          {isAuthenticated ? <Saylist /> : <Authentication />}
        </div>
      </div>
    </main>
  );
}
