import Main from "@/components/main";
import SidebarContent from "@/components/sidebar";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://webosumania.com",
  },
};

export default async function Home() {
  return (
    <>
      <main className="flex min-w-fit justify-center">
        <div className="sticky top-[105.6px] hidden h-[calc(100dvh-105.6px)] w-[620px] shrink-0 p-8 pt-0 lg:block">
          <Suspense>
            <SidebarContent />
          </Suspense>
        </div>

        <div className="w-full max-w-screen-xl px-2 py-4 pt-0 sm:px-4 lg:px-8 lg:pb-8">
          <Suspense>
            <Main />
          </Suspense>
        </div>
      </main>
    </>
  );
}
