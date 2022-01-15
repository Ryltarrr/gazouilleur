import Link from "next/link";
import ThemeChanger from "./ThemeChanger";

export default function NavBar() {
  return (
    <nav className="container mx-auto flex justify-between items-center py-5 ">
      <Link href="/">
        <a className="font-black">Gazouilleur</a>
      </Link>
      <ThemeChanger />
    </nav>
  );
}
