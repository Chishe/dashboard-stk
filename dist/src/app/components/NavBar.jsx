import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/solid";
export default function NavBar() {
    return (<nav className="bg-gradient-to-b from-indigo-950 to-indigo-900 text-white p-4 flex justify-between items-center z-100 relative">
      <div className="flex flex-col items-center">
        <Image src="/logos.png" alt="Denso Logo" width={120} height={40}/>
      </div>
      <div className="flex gap-4">
        <Link href="/" className="px-4 text-white hover:text-red-500 transition-colors duration-300 ease-in-out flex items-center gap-2">
          <HomeIcon className="h-5 w-5"/> Home
        </Link>
      </div>
    </nav>);
}
