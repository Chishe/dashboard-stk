import Link from 'next/link';

export default function SideBar() {
  return (
    <aside className="bg-gray-800 text-white w-64 h-screen p-4">
      <ul>
        <li className="py-2"><Link href="/dashboard">Dashboard</Link></li>
        <li className="py-2"><Link href="/settings">Settings</Link></li>
      </ul>
    </aside>
  );
}
