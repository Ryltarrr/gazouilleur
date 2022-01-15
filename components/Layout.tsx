import React from "react";
import NavBar from "./NavBar";

type LayoutProps = { children: React.ReactNode };

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <NavBar />
      <div className="container mx-auto">{children}</div>
    </>
  );
}
