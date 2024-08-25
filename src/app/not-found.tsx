import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <>
      <main className="p-6 text-center">
        <h1 className="mt-12 text-2xl font-semibold tracking-tight">
          Page Not Found
        </h1>

        <Button asChild className="mt-5">
          <Link href={"/"}>Go Home</Link>
        </Button>
      </main>
    </>
  );
};

export default NotFound;
