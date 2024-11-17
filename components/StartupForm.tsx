"use client"; // Directive indicating that this code will run on the client side.

import React, { useState, useActionState } from "react"; // Importing React and hooks for state management and form handling.
import { Input } from "@/components/ui/input"; // Custom input component for consistent styling.
import { Textarea } from "@/components/ui/textarea"; // Custom textarea component for consistent styling.
import MDEditor from "@uiw/react-md-editor"; // Markdown editor component for pitch input.
import { Button } from "@/components/ui/button"; // Custom button component.
import { Send } from "lucide-react"; // Icon for the submit button.
import { formSchema } from "@/lib/validation"; // Zod schema for form validation.
import { z } from "zod"; // Zod library for runtime validation.
import { useToast } from "@/hooks/use-toast"; // Custom hook for displaying toast notifications.
import { useRouter } from "next/navigation"; // Next.js router for navigation.
import { createPitch } from "@/lib/action"; // Function to create a pitch and interact with the server.

/**
 * StartupForm Component
 *
 * This component renders a form for users to submit a startup pitch. It includes:
 * - Title, description, category, and image URL inputs.
 * - A markdown editor for the pitch content.
 * - Real-time validation using Zod schema.
 * - Server interaction to create a pitch and handle responses.
 *
 * @returns {JSX.Element} A form for submitting startup pitches.
 */
const StartupForm = () => {
  // State for tracking validation errors.
  const [errors, setErrors] = useState<Record<string, string>>({});
  // State for storing the pitch text entered in the markdown editor.
  const [pitch, setPitch] = useState("");
  // Hook for displaying toast notifications.
  const { toast } = useToast();
  // Hook for navigating between pages.
  const router = useRouter();

  /**
   * handleFormSubmit
   *
   * Handles form submission by:
   * - Parsing and validating form data.
   * - Sending data to the server to create a pitch.
   * - Displaying success or error notifications based on the result.
   *
   * @param {any} prevState - Previous state of the form (used for managing submission state).
   * @param {FormData} formData - Data collected from the form fields.
   *
   * @returns {Promise<Object>} The server response indicating success or failure.
   */
  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      // Extract and prepare form values for validation and submission.
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch, // Include the pitch from the markdown editor.
      };

      // Validate the form values using the Zod schema.
      await formSchema.parseAsync(formValues);

      // Send the validated data to the server.
      const result = await createPitch(prevState, formData, pitch);

      // Handle successful server response.
      if (result.status == "SUCCESS") {
        toast({
          title: "Success",
          description: "Your startup pitch has been created successfully",
        });

        // Redirect to the newly created pitch's page.
        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (error) {
      // Handle validation errors from Zod.
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;

        // Update the errors state with validation error messages.
        setErrors(fieldErrors as unknown as Record<string, string>);

        // Show a toast notification for validation failure.
        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      // Handle unexpected errors.
      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  // Hook to manage the form's state and submission handling.
  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>

      {/* Description Input */}
      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>

      {/* Category Input */}
      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category (Tech, Health, Education...)"
        />
        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>

      {/* Image URL Input */}
      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
        />
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>

      {/* Markdown Editor for Pitch */}
      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
