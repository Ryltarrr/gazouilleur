import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import ThemeChanger from "./ThemeChanger";
import Image from "next/image";
import { LoginIcon, LogoutIcon } from "@heroicons/react/solid";

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex justify-between items-center m-0 p-4">
      <Link href="/">
        <a className="text-xl font-black">Gazouilleur</a>
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
            <div className="hidden sm:inline">{session?.user?.email}</div>
            <button onClick={() => signOut()}>
              <span className="hidden sm:inline mr-2">Sign out</span>
              <LogoutIcon className="h-5 w-5 inline" />
            </button>
          </>
        ) : (
          <>
            {status === "unauthenticated" ? (
              <>
                <button onClick={() => signIn()}>
                  <span className="hidden sm:inline mr-2">Sign in</span>
                  <LoginIcon className="h-5 w-5 inline" />
                </button>
              </>
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
