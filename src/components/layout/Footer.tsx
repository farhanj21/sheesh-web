'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="bg-black text-neutral-400 pt-8 md:pt-16 pb-4 md:pb-6 border-t border-zinc-800">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {/* Brand */}
          <div className="space-y-4 hidden md:block">
            <Link href="/" className="block">
              <img src="/Logo NO BG.png" alt="Logo" className="h-16 w-auto" />
            </Link>
            <p className="text-xs text-neutral-500 italic text-left">by Aliha Naeem</p>
            <p className="text-sm text-white md:whitespace-nowrap" data-text="Premium mosaic handmade mirrorworks that transform any space.">
              Premium mosaic handmade mirrorworks that transform any space.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 hidden md:block">
            {/* <h4 className="text-white font-semibold text-lg" data-text="Quick Links">Quick Links</h4> */}
            <div className="grid grid-cols-2 gap-x-6 text-sm">
              {/* Column 1 */}
              <ul className="flex flex-col space-y-2">
                <li>
                  <Link href="/" className="text-neutral-400 hover:text-silver-300 transition-colors" data-text="Home">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-neutral-400 hover:text-silver-300 transition-colors" data-text="Products">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="text-neutral-400 hover:text-silver-300 transition-colors" data-text="Events">
                    Events
                  </Link>
                </li>
              </ul>
              {/* Column 2 */}
              <ul className="flex flex-col space-y-2">
                <li>
                  <Link href="/contact" className="text-neutral-400 hover:text-silver-300 transition-colors" data-text="Contact Us">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-neutral-400 hover:text-silver-300 transition-colors" data-text="About Us">
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="/privacy" className="text-neutral-400 hover:text-silver-300 transition-colors" data-text="Privacy Policy">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social & Newsletter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between md:flex-col md:items-start md:gap-4 md:justify-start">
              <h4 className="text-white font-semibold text-lg" data-text="Follow Us">Follow Us</h4>
              <div className="flex gap-4 md:gap-4">
              <a
                href="https://www.instagram.com/sheeshupyourlife/"
                className="hover:text-silver-300 transition-all hover:scale-110"
                target="_blank"
                aria-label="Instagram"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-silver-300 transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
                <a
                  href="https://wa.me/XXXXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-silver-300 transition-all hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.52 3.48A11.77 11.77 0 0 0 12.02 0C5.39 0 0 5.39 0 12.02c0 2.12.55 4.18 1.6 6.01L0 24l6.15-1.61a11.96 11.96 0 0 0 5.87 1.5h.01c6.63 0 12.02-5.39 12.02-12.02 0-3.21-1.25-6.23-3.53-8.39ZM12.02 21.82h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.65.96.97-3.56-.23-.37A9.9 9.9 0 1 1 12.02 21.82Zm5.43-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.46-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.19-.24-.58-.49-.5-.66-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.52 0 1.5 1.08 2.95 1.23 3.15.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35Z"/>
                  </svg>
                </a>

              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-silver-700/30 text-sm text-center hidden md:block">
          <p
            className="text-white"
            data-text={`© ${currentYear} Sheesh. All Rights Reserved – Developed by Syed Farhan Jafri`}
          >
            &copy; {currentYear} Sheesh. All Rights Reserved – Developed by Syed Farhan Jafri
          </p>
        </div>

      </div>
    </footer>
  )
}
