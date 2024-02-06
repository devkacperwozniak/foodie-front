import React, {useRef, useState} from "react";
import {Backend_URL} from "@component/lib/constant";
import {toast} from "sonner";

export default function ContactForm(){

    const [error, setError] = useState<string | null>(null)
    const data = useRef({
        email: "",
        name: "",
        phoneNumber: "",
        message: "",
    });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if(!data.current.phoneNumber.includes("+")) {
            setError("Numer telefonu powinien zawierać kod kierunkowy, np. +48")
            return
        }

        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

        if(!regex.test(data.current.email)) {
            setError("Email jest nieprawidłowy!")
            return
        }

        toast.promise(async ()=> {
            const res = await fetch(Backend_URL + "/mailing/contact", {
                method: "POST",
                body: JSON.stringify({
                    name: data.current.name,
                    email: data.current.email,
                    phoneNumber: data.current.phoneNumber,
                    message: data.current.message,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (!res.ok) {
                const errorResponse = await res.json()
                throw new Error(errorResponse);
            }
        },             {
            loading: 'Wysyłanie...',
            success: 'Email został wysłany!',
            error: (err) => {
                return 'Wystąpił błąd'
            },
            position: "top-right",
        })
    }

    return (
        <form method="POST" className="grid grid-cols-1 gap-y-6" onSubmit={onSubmit}>
            <div>
                <label htmlFor="full-name" className="sr-only">
                    Full name
                </label>
                <input
                    type="text"
                    name="full-name"
                    id="full-name"
                    autoComplete="name"
                    className="block w-full rounded-md border-gray-300 px-4 py-3 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Imię"
                    required
                    onChange={(e) => (data.current.name = e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="email" className="sr-only">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-gray-300 px-4 py-3 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Email"
                    required
                    onChange={(e) => (data.current.email = e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="phone" className="sr-only">
                    Phone
                </label>
                <input
                    type="text"
                    name="phone"
                    id="phone"
                    autoComplete="tel"
                    className="block w-full rounded-md border-gray-300 px-4 py-3 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Nr. telefonu"
                    required
                    onChange={(e) => (data.current.phoneNumber = e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="message" className="sr-only">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 px-4 py-3 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Wiadomość"
                    defaultValue={''}
                    required
                    onChange={(e) => (data.current.message = e.target.value)}
                />
            </div>
            {error && <div className="rounded-md bg-red-50 p-2">
                <div className="flex">
                    <div className="flex-shrink-0">
                    </div>
                    <div className="ml-4">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                </div>
            </div>}
            <div>
                <button
                    className="text-sm inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Wyślij!
                </button>
            </div>
        </form>
    )
}