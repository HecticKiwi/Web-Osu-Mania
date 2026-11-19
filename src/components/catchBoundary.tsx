import { Button } from "@/components/ui/button";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

const CatchBoundary = ({ error, reset }: ErrorComponentProps<any>) => {
  return (
    <>
      <div className="p-6 text-center">
        <h1 className="mt-12 text-2xl font-semibold tracking-tight">
          An Error Occurred
        </h1>

        <p className="text-muted-foreground mt-1 text-balance">
          {error instanceof Error ? error.message : String(error)}
        </p>

        <Button asChild className="mt-5">
          <Link to={"/"} reloadDocument>
            Go Home
          </Link>
        </Button>
      </div>
    </>
  );
};

export default CatchBoundary;
