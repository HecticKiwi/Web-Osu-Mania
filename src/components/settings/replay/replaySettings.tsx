import ReplayUpload from "@/components/replayUpload";
import FilterableList from "../filterableList";

const ReplaySettings = ({
  className,
  searchQuery,
}: {
  className?: string;
  searchQuery?: string;
}) => {
  return (
    <FilterableList
      className={className}
      title="Replays"
      items={[
        {
          label: "Upload Replay",
          render: ({ label }) => (
            <>
              <div className="grid grid-cols-2 items-center">
                <div className="text-muted-foreground text-sm font-semibold">
                  {label}
                </div>

                <ReplayUpload />
              </div>

              <p className="text-muted-foreground mt-4 text-sm">
                If you have replay files (.womr format) downloaded, you can
                watch them here. Click the dashed box or drag a replay file into
                it.
              </p>
            </>
          ),
        },
      ]}
      searchQuery={searchQuery}
    />
  );
};

export default ReplaySettings;
