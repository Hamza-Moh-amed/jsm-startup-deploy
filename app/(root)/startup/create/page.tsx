import { auth } from "@/auth";
import StartupForm from "@/components/StartupForm";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();

  if (!session) redirect("/");
  return (
    <>
      <section className="pink_container">
        <h1 className="heading">Submit Your Startup</h1>
      </section>
      <div className="items-center justify-center align-middle px-20 m-10">
        <StartupForm />
      </div>
    </>
  );
};

export default page;
