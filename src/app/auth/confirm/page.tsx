'use client'

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Backend_URL} from "@component/lib/constant";
import {toast} from "sonner";

export default function ConfirmPage() {
    const params = useSearchParams()
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const token = params.get('token')

    useEffect( () => {
        const fetchData = async () => {
                toast.promise(async () => {
                        const res = await fetch(Backend_URL + '/email-confirmation/confirm', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ token })
                        })

                        if (res.ok) {
                            return
                        }

                        const errorData = await res.json();
                        throw new Error(errorData.message)
                }, {
                    loading: 'Confirming email...',
                    success: (data) => {
                        router.push('/auth/signin')
                        return `Email has been confirmed, you can now login`;
                    },
                    error: (error) => {
                        if (error instanceof Error) {
                            setError(error.message)
                            return error.message
                        } if (typeof error === 'string') {
                            setError(error)
                            return error
                        }
                        setError('Your email address has not been confirmed yet. Please try again later')
                        return 'Your email address has not been confirmed yet. Please try again later'
                    },
                    position: 'top-right',
                });
            };
        fetchData().catch(() => {throw new Error('Your email address has not been confirmed yet. Please try again later')})
    }, [router, token]);

    return (
        <div>
            {error ? <p>
                {error}
            </p> : <p>Checking your email...</p>}
        </div>
    )
}