import { RefreshIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonProps = { isLoading?: boolean } & ComponentPropsWithoutRef<"button">;

const ButtonBody = ({
  isLoading,
  children,
}: {
  isLoading?: boolean;
  children: ReactNode;
}) => (
  <>
    {isLoading ? (
      <RefreshIcon className="h-5 aspect-square animate-reverse-spin" />
    ) : (
      <>{children}</>
    )}
  </>
);

const Button = ({ children, className, isLoading, ...props }: ButtonProps) => {
  return (
    <button
      className={clsx(
        "bg-gray-300 dark:bg-gray-500",
        "bg-gray-300 dark:bg-gray-500",
        "hover:bg-gray-200 dark:hover:bg-gray-400",
        "disabled:text-gray-500 dark:disabled:text-gray-400",
        "disabled:text-opacity-75 dark:disabled:text-opacity-75",
        "disabled:bg-opacity-50 disabled:bg-gray-300",
        "dark:disabled:bg-opacity-50 dark:disabled:bg-gray-400",
        "disabled:cursor-not-allowed",
        "px-3 py-2 rounded-md transition",
        className ? className : null
      )}
      disabled={isLoading}
      {...props}
    >
      <ButtonBody isLoading={isLoading}>{children}</ButtonBody>
    </button>
  );
};

export const DeleteButton = ({
  children,
  isLoading,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        "bg-red-500 hover:bg-red-400 text-white",
        "disabled:text-opacity-80 dark:disabled:text-opacity-50",
        "disabled:bg-opacity-50 disabled:cursor-not-allowed",
        "disabled:bg-red-500",
        "px-3 py-2 rounded-md transition",
        className ? className : null
      )}
      disabled={isLoading}
      {...props}
    >
      <ButtonBody isLoading={isLoading}>{children}</ButtonBody>
    </button>
  );
};

export const PrimaryButton = ({
  children,
  isLoading,
  className,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    className={clsx(
      "bg-orange-500 hover:bg-orange-400 text-white",
      "disabled:text-opacity-80 dark:disabled:text-opacity-50",
      "disabled:bg-opacity-50 disabled:cursor-not-allowed",
      "disabled:bg-orange-500",
      "px-3 py-2 rounded-md transition",
      className ? className : null
    )}
    disabled={isLoading || disabled}
    {...props}
  >
    <ButtonBody isLoading={isLoading}>{children}</ButtonBody>
  </button>
);

export default Button;
