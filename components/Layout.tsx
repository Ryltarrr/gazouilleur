import React from "react";
import NavBar from "./NavBar";

type LayoutProps = { children: React.ReactNode };

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <NavBar />
      <main className="container mx-auto mb-5">{children}</main>
    </>
  );
}
