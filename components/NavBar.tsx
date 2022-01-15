import ThemeChanger from './ThemeChanger';

export default function NavBar() {
  return (
    <nav className="container mx-auto flex justify-between items-center py-5 ">
      <span className="font-black">Gazouilleur</span>
      <ThemeChanger />
    </nav>
  );
}
