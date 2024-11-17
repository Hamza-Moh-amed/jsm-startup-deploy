import React, { Suspense } from "react";
import Image from "next/image"; // Optimized image rendering in Next.js.
import Link from "next/link"; // Client-side navigation component.
import { notFound } from "next/navigation"; // Utility for rendering 404 pages.
import { formatDate } from "@/lib/utils"; // Utility to format dates.

import { client } from "@/sanity/lib/client"; // Sanity client for data fetching.
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries"; // Sanity queries for fetching startup and playlist data.

import markdownit from "markdown-it"; // Markdown parser to render rich text content.
import { Skeleton } from "@/components/ui/skeleton"; // Loader component for fallback UI.
import View from "@/components/View"; // Component for displaying and updating view counts.
import StartupCard, { StartupTypeCard } from "@/components/StartupCard"; // Startup card component to display editor picks.

const md = markdownit(); // Initialize the Markdown parser.

export const experimental_ppr = true; // Enable experimental Parallel Routes and Layouts in Next.js.

/**
 * Page Component
 *
 * This React server component displays the details of a specific startup.
 * It fetches the data for the startup and editor-selected posts in parallel for performance optimization.
 * The page includes sections for:
 * - Startup metadata (date, title, description, category, etc.)
 * - Author information
 * - Markdown-rendered pitch details
 * - Editor-selected startup recommendations
 * - View count tracking with lazy loading.
 *
 * @param {Object} props - Component props.
 * @param {Promise<{ id: string }>} props.params - URL parameters containing the `id` of the startup.
 *
 * @returns {JSX.Element} A React component for the startup page.
 */
const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  // Extract the `id` parameter from the URL.
  const id = (await params).id;

  /*
   * Fetch data in parallel:
   * - `post`: Startup data by `id`.
   * - `editorPosts`: Editor-selected posts fetched by slug.
   * Parallel fetching reduces total loading time compared to sequential fetching.
   */
  const [post, { select: editorPosts }] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-picks" }),
  ]);

  // If the startup is not found, render a 404 page.
  if (!post) return notFound();

  // Render the pitch content from Markdown.
  const parsedContent = md.render(post?.pitch || "");

  return (
    <>
      {/* Hero Section: Displays the startup's metadata */}
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post?.title}</h1>
        <p className="sub-heading !max-w-5xl">{post?.description}</p>
      </section>

      {/* Main Section: Displays the startup's details */}
      <section className="section_container">
        {/* Startup image */}
        <img
          src={post?.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />

        {/* Author information and category */}
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            {/* Author details */}
            <Link href={`/user/${post?.author?._id}`}>
              <Image
                src={post?.author?.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium">{post?.author?.name}</p>
                <p className="text-16-medium">@{post?.author?.username}</p>
              </div>
            </Link>
            {/* Startup category */}
            <p className="category-tag">{post?.category}</p>
          </div>

          {/* Pitch details rendered from Markdown */}
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        {/* Divider */}
        <hr className="divider" />

        {/* Editor Picks Section */}
        {editorPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Editor Picks</p>
            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: StartupTypeCard, i: number) => (
                <StartupCard key={i} post={post} />
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* View count tracking with lazy loading */}
      <Suspense fallback={<Skeleton className="view_skeleton" />}>
        <View id={id} />
      </Suspense>
    </>
  );
};

export default Page;
