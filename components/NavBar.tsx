import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import ThemeChanger from "./ThemeChanger";
import Image from "next/image";

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <nav className="container mx-auto flex justify-between items-center py-5 ">
      <Link href="/">
        <a className="font-black">Gazouilleur</a>
      </Link>
      <div className="flex space-x-3 items-center">
        {session ? (
          <>
            {session?.user?.image && (
              <div className="relative h-10 w-10">
                <Image
                  layout="fill"
                  className="rounded-full "
                  alt="profile picture"
                  src={session?.user?.image}
                />
              </div>
            )}
            <div>{session?.user?.email}</div>
            <button onClick={() => signOut()}>Sign out</button>
          </>
        ) : (
          <>
            {status === "unauthenticated" ? (
              <button onClick={() => signIn()}>Sign in</button>
            ) : (
              <div>Loading...</div>
            )}
          </>
        )}
        <ThemeChanger />
      </div>
    </nav>
  );
}
