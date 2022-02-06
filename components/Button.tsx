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
      <RefreshIcon className="aspect-square h-5 animate-reverse-spin" />
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
        "disabled:bg-gray-300 disabled:bg-opacity-50",
        "dark:disabled:bg-gray-400 dark:disabled:bg-opacity-50",
        "disabled:cursor-not-allowed",
        "rounded-md px-3 py-2 transition",
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
        "bg-red-500 text-white hover:bg-red-400",
        "disabled:text-opacity-80 dark:disabled:text-opacity-50",
        "disabled:cursor-not-allowed disabled:bg-opacity-50",
        "disabled:bg-red-500",
        "rounded-md px-3 py-2 transition",
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
      "bg-orange-500 text-white hover:bg-orange-400",
      "disabled:text-opacity-80 dark:disabled:text-opacity-50",
      "disabled:cursor-not-allowed disabled:bg-opacity-50",
      "disabled:bg-orange-500",
      "rounded-md px-3 py-2 transition",
      className ? className : null
    )}
    disabled={isLoading || disabled}
    {...props}
  >
    <ButtonBody isLoading={isLoading}>{children}</ButtonBody>
  </button>
);

export default Button;
