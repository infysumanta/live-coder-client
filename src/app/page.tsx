"use client";

import toast from "react-hot-toast";

export default function Home() {
  return (
    <>
      <button
        onClick={() => {
          toast.success("Hello World");
        }}
      >
        Join
      </button>
    </>
  );
}
