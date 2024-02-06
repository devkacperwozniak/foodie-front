"use client";

import React, {useRef, useState} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Backend_URL } from "@component/lib/constant";
import { toast } from "sonner";


export default function UpdatePasswordForm() {
    const router = useRouter();
    const params = useSearchParams();
    const [error, setError] = useState<string | null>(null)
    const data = useRef({
        password: "",
        passwordConfirmation: "",
    });

    const token = params.get('token')

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if(data.current.password !== data.current.passwordConfirmation) {
            setError("Passwords do not match!")
            return
        }
        if(data.current.password.length < 8) {
            setError("Password must be at least 8 characters long!")
            return
        }
        const res = await fetch(Backend_URL + "/authentication/reset-password", {
            method: "POST",
            body: JSON.stringify({
                token,
                password: data.current.password,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (!res.ok) {
            setError('Something went wrong');
            return;
        }
        toast.success('Password has been changed', { position: "top-right" });
        router.push('/auth/signin');

    }

    return (
        <form className="space-y-6" method="POST" onSubmit={onSubmit}>
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" name="password" id="password"
                       className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       required
                       onChange={(e) => (data.current.password = e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                <input type="password" name="confirm-password" id="confirm-password"
                       className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       required
                       onChange={(e) => (data.current.passwordConfirmation = e.target.value)}
                />
            </div>
            {
                error && <div className="rounded-md bg-red-50 p-2">
                    <div className="flex">
                        <div className="flex-shrink-0"/>
                    <div className="ml-4">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                </div>
                </div>
            }
            <button className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onSubmit={onSubmit}
            >Update
            </button>
        </form>
    )
}