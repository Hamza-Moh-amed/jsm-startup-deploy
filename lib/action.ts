"use server"; // Directive indicating this file contains server-side code.

import { auth } from "@/auth"; // Authentication utility to verify user sessions.
import { parseServerActionResponse } from "@/lib/utils"; // Utility to standardize server action responses.
import slugify from "slugify"; // Library to generate URL-friendly slugs.
import { writeClient } from "@/sanity/lib/write-client"; // Sanity client configured for writing data.

/**
 * createPitch Function
 *
 * This asynchronous function creates a new startup pitch and saves it to the Sanity CMS. It handles:
 * - User authentication
 * - Data validation and transformation
 * - Saving the pitch to the CMS
 * - Error handling and response formatting
 *
 * @param {any} state - Application state (currently unused, reserved for future use).
 * @param {FormData} form - Form data containing details of the pitch.
 * @param {string} pitch - The main pitch content (not included in the form directly).
 *
 * @returns {Promise<Object>} A structured response indicating success or error.
 */
export const createPitch = async (
  state: any, // Reserved for future use (currently unused).
  form: FormData, // Form data submitted by the user.
  pitch: string // The main pitch text (separate from form data).
) => {
  // Authenticate the user session.
  const session = await auth();

  // If the user is not authenticated, return an error response.
  if (!session)
    return parseServerActionResponse({
      error: "Not signed in", // Error message for unauthenticated access.
      status: "ERROR", // Status indicating an error occurred.
    });

  // Extract fields from the form, excluding the "pitch" field.
  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch")
  );

  // Generate a slug from the title for the startup URL.
  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    // Construct the startup object to be saved in Sanity.
    const startup = {
      title, // Startup title.
      description, // Brief description of the startup.
      category, // Category under which the startup falls.
      image: link, // Link to an image representing the startup.
      slug: {
        _type: slug, // Sanity-specific slug type.
        current: slug, // The slug string.
      },
      author: {
        _type: "reference", // Reference type to link to the author.
        _ref: session?.id, // ID of the authenticated user.
      },
      pitch, // The main pitch content.
    };

    // Save the startup object to Sanity CMS.
    const result = await writeClient.create({ _type: "startup", ...startup });

    // Return a success response with the created startup data.
    return parseServerActionResponse({
      ...result, // Include the result data in the response.
      error: "", // No error.
      status: "SUCCESS", // Status indicating the operation was successful.
    });
  } catch (error) {
    // Log the error to the console for debugging purposes.
    console.log(error);

    // Return an error response with details of the error.
    return parseServerActionResponse({
      error: JSON.stringify(error), // Serialize the error for easier debugging.
      status: "ERROR", // Status indicating an error occurred.
    });
  }
};
