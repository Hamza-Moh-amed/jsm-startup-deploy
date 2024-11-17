import React from "react";
import Ping from "./Ping"; // Import a Ping component, likely used for some form of visual notification or effect.
import { client } from "@/sanity/lib/client"; // Import the Sanity client for reading data.
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries"; // Import a predefined query for fetching startup views.
import { writeClient } from "@/sanity/lib/write-client"; // Import the Sanity client configured for writing data.
import { unstable_after as after } from "next/server"; // Import the `unstable_after` function for executing operations after a server-side action.

/**
 * View Component
 *
 * This is a React server component that displays the total number of views
 * for a specific item (identified by `id`) and increments the view count in the database.
 *
 */
const View = async ({ id }: { id: string }) => {
  // Fetch the current view count for the specified `id` from the Sanity CMS.
  const { views: totalViews } = await client
    .withConfig({ useCdn: false }) // Use live, uncached data for accuracy.
    .fetch(STARTUP_VIEWS_QUERY, { id });

  // Increment the view count after the server-side rendering is completed.
  after(
    async () =>
      await writeClient
        .patch(id) // Identify the document to update using the `id`.
        .set({ views: totalViews + 1 }) // Update the `views` field with the incremented value.
        .commit() // Commit the changes to the Sanity CMS.
  );

  return (
    <div className="view-container">
      {/* A visual indicator, likely used to draw attention to the view count */}
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      {/* Display the current number of views with appropriate pluralization */}
      <p className="view-text">
        <span className="font-black">
          {totalViews < 1 ? (
            <span>No views</span>
          ) : (
            <span>
              {totalViews} {totalViews === 1 ? "view" : "views"}
            </span>
          )}
        </span>
      </p>
    </div>
  );
};

export default View;
