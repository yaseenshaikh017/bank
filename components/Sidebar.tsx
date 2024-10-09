'use client'

import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Footer from './Footer'
import PlaidLink from './PlaidLink'

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname();

  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 cursor-pointer flex items-center gap-2">
          <Image 
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Zenora logo"
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">Zenora</h1>
        </Link>

        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)

          return (
            <Link href={item.route} key={item.label}
              className={cn('sidebar-link', { 'bg-bank-gradient': isActive })}
            >
              <div className="relative size-6">
                <Image 
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  className={cn({
                    'brightness-[3] invert-0': isActive
                  })}
                />
              </div>
              <p className={cn("sidebar-label", { "!text-white": isActive })}>
                {item.label}
              </p>
            </Link>
          )
        })}

        {/* Add the Smart Savings Goals link below */}
        <Link href="/smart-savings" className={cn('sidebar-link', { 'bg-bank-gradient': pathname === '/smart-savings' })}>
          <div className="relative size-6">
            <Image 
              src="icons/smart-savings-goals.svg"  // Add an appropriate icon for Smart Savings Goals in your public/icons folder
              alt="Smart Savings"
              fill
              className={cn({
                'brightness-[3] invert-0': pathname === '/smart-savings'
              })}
            />
          </div>
          <p className={cn("sidebar-label", { "!text-white": pathname === '/smart-savings' })}>
            Smart Savings Goals
          </p>
        </Link>

        <PlaidLink user={user} />
      </nav>

      <Footer user={user} />
    </section>
  )
}

export default Sidebar
