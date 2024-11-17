import Form from "next/form"; // Importing the Form component from Next.js for handling forms.
import SearchFormReset from "./SearchFormReset"; // Importing a custom component to reset the search form.
import { Search } from "lucide-react"; // Importing a search icon from the Lucide icon library.

/**
 * SearchForm Component
 *
 * This is a form component for searching startups. It includes an input field
 * for entering a query, a reset button (conditionally rendered), and a submit button with an icon.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.query] - Optional search query to pre-fill the form.
 *
 * @returns {JSX.Element} A React component rendering a search form.
 */
const SearchForm = ({ query }: { query?: string }) => {
  // `query` is a prop passed from the (root)/page.tsx to pre-fill the input field or enable reset functionality.

  return (
    <Form action="/" scroll={false} className="search-form">
      {/* Input field for search queries */}
      <input
        name="query"
        defaultValue=""
        placeholder="Search Startup"
        className="search-input"
      />

      {/* Container for the reset button and submit button */}
      <div className="flex gap-2">
        {/* Conditionally render the reset button only if `query` is defined.
            This allows users to clear the current search query. */}
        {query && <SearchFormReset />}

        {/* Submit button for the search form */}
        <button type="submit" className="search-btn text-white">
          {/* Search icon inside the button for better UI */}
          <Search className="size-5" />
        </button>
      </div>
    </Form>
  );
};

export default SearchForm;
