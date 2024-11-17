import { formatDate } from "@/lib/utils"; // Utility function to format dates.
import { EyeIcon } from "lucide-react"; // Importing an eye icon to display view count.
import Image from "next/image"; // Optimized image rendering from Next.js.
import Link from "next/link"; // Client-side navigation in Next.js.
import React from "react"; // React library for building UI components.
import { Button } from "./ui/button"; // Custom button component for consistent styling.
import { Author, Startup } from "@/sanity/types"; // Type definitions for Sanity CMS data.

/**
 * Type definition for StartupCard props.
 * Combines the Startup type with an optional Author field.
 */
export type StartupTypeCard = Omit<Startup, "author"> & { author?: Author };

/**
 * StartupCard Component
 *
 * This component represents a card displaying information about a startup, including:
 * - Creation date
 * - Number of views
 * - Author details
 * - Title
 * - Description
 * - Category
 * - Links to the startup and author profiles
 *
 * @param {Object} props - The component props.
 * @param {StartupTypeCard} props.post - The startup data to display in the card.
 *
 * @returns {JSX.Element} A React component rendering a startup card.
 */
const StartupCard = ({ post }: { post: StartupTypeCard }) => {
  // Destructure relevant fields from the `post` prop.
  const {
    _createdAt, // The creation date of the startup.
    views, // The number of views the startup has received.
    author, // Information about the author of the startup.
    _id, // Unique ID for the startup.
    description, // A brief description of the startup.
    image, // URL for the startup's image.
    category, // The category under which the startup is listed.
    title, // The title of the startup.
  } = post;

  return (
    <li className="startup-card">
      {/* Display the startup creation date */}
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
      </div>

      {/* Display the number of views with an eye icon */}
      <div className="flex gap-1.5">
        <EyeIcon className="size-6 text-primary" />
        <span className="text-16-medium">{views}</span>
      </div>

      {/* Display author and title */}
      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          {/* Link to the author's profile */}
          <Link href={`/user/${author?._id}`}>
            <p className="text-16-medium line-clamp-1">{author?.username}</p>
          </Link>

          {/* Link to the startup's details */}
          <Link href={`/startup/${_id}`}>
            <h3 className="text-26-semibold">{title}</h3>
          </Link>
        </div>

        {/* Author's profile image */}
        <div className="border-gray-100 border-[2px] rounded-full hover:border-gray-300 hover:animate-bounce">
          <Link href={`/user/${author?._id}`}>
            <Image
              src={author?.image as string} // author image.
              alt={author?.username as string}
              width={48}
              height={48}
              className="rounded-full "
            />
          </Link>
        </div>
      </div>

      {/* Link to the startup details with description and image */}
      <Link href={`/startup/${_id}`}>
        <p className="startup-card_desc">{description}</p>
        <img src={image} alt="placeholder" className="startup-card_img" />
      </Link>

      {/* Display category and "Details" button */}
      <div className="flex-between gap-3 mt-5">
        {/* Link to filter startups by category */}
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>

        {/* Button linking to the startup's details page */}
        <Button className="startup-card_btn" asChild>
          <Link href={`/startup/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export default StartupCard;
