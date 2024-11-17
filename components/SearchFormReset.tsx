"use client"; // Directive indicating that this file contains client-side code.

import { X } from "lucide-react"; // Importing the close (X) icon from the Lucide icon library.
import Link from "next/link"; // Importing the Link component for client-side navigation in Next.js.

/**
 * reset Function
 *
 * This function resets the search form. It locates the form element using the
 * class name `.search-form` and calls the `reset()` method to clear its inputs.
 */
const reset = () => {
  // Locate the search form using the CSS class selector.
  const form = document.querySelector(".search-form") as HTMLFormElement;

  // If the form is found, reset its contents.
  if (form) form.reset();
};

/**
 * SearchFormReset Component
 *
 * This component renders a button for resetting the search form. When clicked,
 * it calls the `reset` function and provides a link to navigate back to the homepage.
 *
 * @returns {JSX.Element} A React component rendering a reset button for the search form.
 */
const SearchFormReset = () => {
  return (
    // Render a button element with `type="reset"` to signal its purpose.
    <button type="reset" onClick={reset}>
      {/* Link that navigates to the homepage and visually wraps the button */}
      <Link href="/" className="search-btn text-white">
        {/* Icon representing the reset action */}
        <X className="size-5" />
      </Link>
    </button>
  );
};

export default SearchFormReset;
