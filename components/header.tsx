'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, Search, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/components/ui/navigation-menu'
import ThemeModeButton from '@/components/theme-mode-button'
import NavUser from '@/components/nav-user'
import { Logo } from '@/components/logo'

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Simplified search function
  const handleSearch = () => {
    router.push('/search')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur transition-all duration-300">
      <div className="max-w-[1920px] w-full mx-auto flex h-14 items-center px-4 lg:px-6">
        <div className="flex w-full items-center justify-between">
          {/* Left side with logo and navigation */}
          <div className="flex items-center gap-4">
            {/* Logo and brand name */}
            <Logo />

            {/* Desktop navigation menu - left aligned */}
            <div className="hidden md:flex">
              <NavigationMenu>
                <NavigationMenuList>
                  {/* Models */}
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/models"
                      className="flex items-center h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground group"
                    >
                      <div className="flex items-center">Models</div>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {/* Competitions */}
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/competitions"
                      className="flex items-center h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground group"
                    >
                      <div className="flex items-center">Competitions</div>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {/* Maker Space */}
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/maker-space"
                      className="flex items-center h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground group"
                    >
                      <div className="flex items-center">Maker Space</div>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {/* Forum */}
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="https://forum.makera.com/"
                      target="_blank"
                      className="flex items-center h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground group"
                    >
                      <div className="flex items-center">Forum</div>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Search button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Theme toggle button */}
            <ThemeModeButton />

            {/* User actions */}
            <div className="hidden sm:flex items-center space-x-2">
              <NavUser />
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation menu */}
      <div
        className={cn(
          'container px-4 sm:px-6 lg:px-8 md:hidden overflow-hidden transition-all duration-300',
          mobileMenuOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="flex flex-col space-y-3 py-4">
          {/* Mobile user actions row */}
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="outline"
              className="flex items-center justify-start flex-1 px-3 py-2 text-sm"
              onClick={() => {
                handleSearch()
                setMobileMenuOpen(false)
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>

            <div className="flex items-center ml-2 space-x-2">
              <NavUser />
            </div>
          </div>

          <div className="h-px w-full bg-border my-1"></div>

          {/* Models */}
          <Link
            href="/models"
            className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Models
          </Link>

          {/* Competitions */}
          <Link
            href="/competitions"
            className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Competitions
          </Link>

          {/* Maker Space */}
          <Link
            href="/maker-space"
            className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Maker Space
          </Link>

          {/* Forum */}
          <Link
            href="https://forum.makera.com/"
            target="_blank"
            className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Forum
          </Link>
        </div>
      </div>
    </header>
  )
}

// Navigation menu item component
const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
