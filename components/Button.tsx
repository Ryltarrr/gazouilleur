import clsx from 'clsx';
import { ComponentPropsWithoutRef } from 'react';

type ButtonProps = { isLoading?: boolean } & ComponentPropsWithoutRef<'button'>;

const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={clsx(
        'bg-gray-300 dark:bg-gray-500',
        'bg-gray-300 dark:bg-gray-500',
        'hover:bg-gray-200 dark:hover:bg-gray-400',
        'disabled:text-gray-500 dark:disabled:text-gray-400',
        'disabled:text-opacity-75 dark:disabled:text-opacity-75',
        'disabled:bg-opacity-50 disabled:bg-gray-300',
        'dark:disabled:bg-opacity-50 dark:disabled:bg-gray-400',
        'disabled:cursor-not-allowed',
        'px-3 py-2 rounded-md transition',
        className ? className : null
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const DeleteButton = ({
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'bg-red-500 hover:bg-red-400 text-white',
        'disabled:text-opacity-80 dark:disabled:text-opacity-50',
        'disabled:bg-opacity-50 disabled:cursor-not-allowed',
        'disabled:bg-red-500',
        'px-3 py-2 rounded-md transition',
        className ? className : null
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const PrimaryButton = ({
  children,
  className,
  ...props
}: ButtonProps) => (
  <button
    className={clsx(
      'bg-orange-500 hover:bg-orange-400 text-white',
      'disabled:text-opacity-80 dark:disabled:text-opacity-50',
      'disabled:bg-opacity-50 disabled:cursor-not-allowed',
      'disabled:bg-orange-500',
      'px-3 py-2 rounded-md transition',
      className ? className : null
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;
