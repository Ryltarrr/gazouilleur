import Button from "./Button";

type LoadMoreButtonProps = {
  hasNextPage?: boolean;
  fetchNextPage: () => any;
  isFetchingNextPage: boolean;
};

const LoadMoreButton = ({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: LoadMoreButtonProps) => {
  if (hasNextPage) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Button
          className="my-3"
          disabled={!hasNextPage}
          onClick={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
        >
          load more
        </Button>
      </div>
    );
  } else {
    return null;
  }
};

export default LoadMoreButton;
