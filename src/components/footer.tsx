import Link from 'next/link'
import { Gamepad2, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border/50 glass">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                GameZone
              </span>
            </div>
            <p className="text-sm text-foreground/70">
              Your ultimate destination for digital games, gaming consoles, and competitive tournaments.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-foreground/70 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-foreground/70 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-foreground/70 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-foreground/70 hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/games"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Games
                </Link>
              </li>
              <li>
                <Link
                  href="/consoles"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Consoles
                </Link>
              </li>
              <li>
                <Link
                  href="/tournaments"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Tournaments
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Stay Updated</h3>
            <p className="text-sm text-foreground/70 mb-4">
              Subscribe to get the latest game releases and tournament updates.
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-background/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button className="w-full gradient-button text-white px-4 py-2 rounded-lg text-sm font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-foreground/70">
          <p>&copy; {currentYear} GameZone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
