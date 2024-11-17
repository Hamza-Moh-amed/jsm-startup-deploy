import SearchForm from "@/components/SearchForm"; // Search form component for filtering startups.
import StartupCard, { StartupTypeCard } from "@/components/StartupCard"; // Component to display individual startup details.
import { sanityFetch, SanityLive } from "@/sanity/lib/live"; // Utility functions for live fetching data from Sanity CMS.
import { STARTUPS_QUERY } from "@/sanity/lib/queries"; // Query to fetch startups from Sanity CMS.
import React from "react"; // React library for building UI components.

/**
 * Home Component
 *
 * This is the main page component for the home screen. It displays a hero section,
 * a search form for filtering startups, and a list of startup cards. It supports live data
 * updates from Sanity CMS via `SanityLive`.
 *
 * @param {Object} props - The component props.
 * @param {Promise<{ query?: string }>} props.searchParams - URL search parameters for filtering startups.
 *
 * @returns {JSX.Element} A React component rendering the home page.
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  // Extract the `query` parameter from the searchParams object.
  // This modifies the displayed startups based on the search query.
  const query = (await searchParams).query;
  const params = { search: query || null };

  /**
   * Fetch posts from Sanity CMS.
   *
   * - Old Fetch (cached content):
   *   const posts = await client.fetch(STARTUPS_QUERY);
   *
   * - New Fetch (live content):
   *   Uses `sanityFetch` to fetch live data with the provided query and params.
   */
  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

  return (
    <>
      {/* Hero Section */}
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup <br /> Connect with Entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and get noticed in Virtual
          Competitions.
        </p>

        {/* Search Form for filtering startups based on a query */}
        <SearchForm query={query} />
      </section>

      {/* Startups Section */}
      <section className="section_container">
        {/* Dynamic heading based on search query */}
        <p className="text-30-semibold">
          {query ? `Search Results for ${query}` : "All Startups"}
        </p>

        {/* Grid of startup cards */}
        <ul className="card_grid mt-7">
          {posts?.length > 0 ? (
            // Map over the fetched posts and render a `StartupCard` for each.
            posts.map((post: StartupTypeCard, index: number) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            // Display a message if no results are found.
            <p className="no-results">No Results Found</p>
          )}
        </ul>
      </section>

      {/* Enable live updates from Sanity CMS */}
      <SanityLive />
    </>
  );
}
