// src/lib/utils.ts
import classNames from 'classnames';

// Utility function to conditionally join class names
export function cn(...classes: (string | undefined | false)[]): string {
  return classNames(...classes);
}
