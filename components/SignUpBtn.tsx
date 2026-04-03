"use client";

import { useClerk } from "@clerk/nextjs";

export const SignUpBtn = () => {
  const { openSignUp } = useClerk();

  return (
    // Clicking this button signs out a user
    // and redirects them to the home page "/".
    <button
      onClick={() => openSignUp()}
      className="bg-[#000] cursor-pointer text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
    >
      Sign Up
    </button>
  );
};
