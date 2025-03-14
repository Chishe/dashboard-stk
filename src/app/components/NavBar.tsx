import Link from 'next/link';
import { HomeIcon } from '@heroicons/react/24/outline'; 

export default function NavBar() {
  return (
    <nav className="bg-indigo-950 text-white p-4 flex justify-between items-center z-100 relative">
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-bold text-red-500 italic">Denso</h1>
        <span className="text-red-500 italic">crafting the core</span>
      </div>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-4 text-white hover:text-red-500 transition-colors duration-300 ease-in-out flex items-center gap-2"
        >
          <HomeIcon className="h-5 w-5" /> Home
        </Link>
      </div>
    </nav>
  );
}
