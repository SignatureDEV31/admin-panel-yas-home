import { AuthRedirect } from '@/features/auth/auth-redirect/auth-redirect'
import React from 'react'

type Props = {
    children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
    return (
        <AuthRedirect>{children}    </AuthRedirect>
    )
}