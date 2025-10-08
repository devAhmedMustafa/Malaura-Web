'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t mt-12">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">© {new Date().getFullYear()} Malaura. All rights reserved.</div>
        <div className="flex gap-4">
          <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary">Privacy</Link>
          <Link href="/terms" className="text-sm text-gray-600 hover:text-primary">Terms</Link>
          <Link href="/contact" className="text-sm text-gray-600 hover:text-primary">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
