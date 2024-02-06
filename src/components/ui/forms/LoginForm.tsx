"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import {useSearchParams, useRouter} from "next/navigation";
import EmailModal from "@component/components/ui/modals/email/EmailModal";
import EmailModalForgotPass from "@component/components/ui/modals/email/EmailModalForgotPass";


export default function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || '/dashboard'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalPassOpen, setModalPassOpen] = useState(false);

    const emailForbiddenErr = 'Email address not confirmed. Please verify your email.'
    const invalidCredentialsErr = 'Invalid credentials!'

    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
    }

    const openPassModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setModalPassOpen(true);
    }
    const closePassModal = () => {
        setModalPassOpen(false);
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            })

            if (!res?.error) {
                router.push(callbackUrl)
                router.refresh()
            }
            if (res?.error === "Forbidden"){
                setError(emailForbiddenErr)
            }
            if (res?.error === "Unauthorized") {
                setError(invalidCredentialsErr)
            }
        }
     catch (err: any) {
         setError('Exception occurred while signing in. Please try again later')
     }
}

    return (
        <>
            {
                isModalOpen && <EmailModal onClose={closeModal} />
            }
            {
                isModalPassOpen && <EmailModalForgotPass onClose={closePassModal} />
            }
        <form className="space-y-6" method="POST" onSubmit={onSubmit}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                </label>
                <div className="mt-2">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                </label>
                <div className="mt-2">
                    <input
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            {
                error &&
                <div>
                    <div className="rounded-md bg-red-50 p-2">
                        <div className="flex">
                            <div className="flex-shrink-0"/>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                            </div>
                        </div>
                    </div>
                    {
                        error.includes(emailForbiddenErr) &&
                        <>
                            <button
                                onClick={openModal}
                                className='text-xs text-gray-700 text-center block mx-auto hover:underline hover:text-gray-950 mt-2'>
                                Resend verification email
                            </button>
                        </>
                    }
                    </div>
            }
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-900">
                        Remember me
                    </label>
                </div>
                <div className="text-sm leading-6">
                    <button
                        onClick={openPassModal}
                        className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                    </button>
                </div>
            </div>
            <div>
                <button
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Sign in
                </button>
            </div>
        </form>
        </>
    )
}