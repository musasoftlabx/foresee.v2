"use client";

import Error from "next/error";

export default function Page({ message }: { message: string }) {
  return <div>{message}</div>;
}
