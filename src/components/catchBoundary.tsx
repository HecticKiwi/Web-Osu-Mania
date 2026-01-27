import { Button } from "@/components/ui/button";
import { ErrorComponentProps, Link } from "@tanstack/react-router";

const CatchBoundary = ({ error, reset }: ErrorComponentProps) => {
  return (
    <>
      <main className="p-6 text-center">
        <h1 className="mt-12 text-2xl font-semibold tracking-tight">
          An Error Occurred
        </h1>

        <p className="mt-1 text-balance text-muted-foreground">
          {error.message}
        </p>

        <Button asChild className="mt-5">
          <Link to={"/"} reloadDocument>
            Go Home
          </Link>
        </Button>
      </main>
    </>
  );
};

export default CatchBoundary;
