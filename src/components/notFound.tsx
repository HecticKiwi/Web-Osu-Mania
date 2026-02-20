import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const NotFound = () => {
  return (
    <>
      <div className="p-6 text-center">
        <h1 className="mt-12 text-2xl font-semibold tracking-tight">
          Page Not Found
        </h1>

        <Button asChild className="mt-5">
          <Link to={"/"}>Go Home</Link>
        </Button>
      </div>
    </>
  );
};

export default NotFound;
