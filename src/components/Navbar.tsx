import Link from 'next/link';
import { Icon } from '@iconify/react';
import Image from 'next/image';

export default function Navbar() {

  return (
    <header className="w-full bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo_tiny.png" alt="Malaura logo" className="h-8 w-auto" priority width={50} height={50} />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1 rounded-md hover:shadow-sm">
            <Icon icon="mdi:shopping" className="text-lg text-gray-700" />
            <span className="text-sm text-gray-700">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
