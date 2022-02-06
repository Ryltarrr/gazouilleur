import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import ThemeChanger from "./ThemeChanger";
import Image from "next/image";
import { LoginIcon, LogoutIcon } from "@heroicons/react/solid";

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <nav className="m-0 flex items-center justify-between p-4">
      <Link href="/">
        <a className="text-xl font-black">Gazouilleur</a>
      </Link>
      <div className="flex items-center space-x-3">
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
              <span className="mr-2 hidden sm:inline">Sign out</span>
              <LogoutIcon className="inline h-5 w-5" />
            </button>
          </>
        ) : (
          <>
            {status === "unauthenticated" ? (
              <>
                <button onClick={() => signIn()}>
                  <span className="mr-2 hidden sm:inline">Sign in</span>
                  <LoginIcon className="inline h-5 w-5" />
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
