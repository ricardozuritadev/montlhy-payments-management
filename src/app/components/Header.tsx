'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function navLinkClass(isActive: boolean) {
    return [
        'text-lg font-medium',
        isActive && 'underline underline-offset-4 decoration-2',
    ]
        .filter(Boolean)
        .join(' ')
}

export function Header() {
    const pathname = usePathname()

    return (
        <header className="p-4 border-b border-b-gray-400 shadow-sm">
            <nav className="flex justify-evenly items-center">
                <Link href="/" className={navLinkClass(pathname === '/')}>
                    Deudas
                </Link>
                <Link
                    href="/checklist"
                    className={navLinkClass(pathname === '/checklist')}
                >
                    Checklist
                </Link>
            </nav>
        </header>
    )
}
