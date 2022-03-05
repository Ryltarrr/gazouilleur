import Button from "./Button";

type LoadMoreButtonProps = {
  isLoading: boolean;
  hasNextPage?: boolean;
  fetchNextPage: () => any;
  isFetchingNextPage: boolean;
};

const LoadMoreButton = ({
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: LoadMoreButtonProps) => {
  const gotNextPage = !!hasNextPage;
  if (isLoading === false) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Button
          className="my-3"
          disabled={!gotNextPage}
          onClick={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
        >
          {gotNextPage ? "load more" : "no more post"}
        </Button>
      </div>
    );
  }
  return null;
};

export default LoadMoreButton;
