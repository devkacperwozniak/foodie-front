"use client"

import React, {useState} from "react";
import {Backend_URL} from "@component/lib/constant";
import {toast} from "sonner";
import {useSession} from "next-auth/react";

export default function EditUser(props: { onClose: () => void; mutation: () => Promise<void>; }) {
    const {onClose, mutation} = props
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')

    const { data: session } = useSession() as any;

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onClose()
    }

    return (
        <div style={{ zIndex: 1000 }}>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-60 overflow-y-auto h-full w-full flex justify-center items-center">
                <div className="bg-white shadow sm:rounded-lg w-full sm:w-3/4 lg:w-1/3 lg:ml-72">
                    <div className="px-6 py-6">
                        <div className="border-b px-4 py-2 flex justify-between items-center">
                            <div className="text-base font-semibold leading-4 text-gray-900">Edytuj użytkownika</div>
                            <button className="text-black close-modal" onClick={onClose}>&times;</button>
                        </div>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                            <p>Odpowiednio wypełnij wszystkie pola by Edytować użytkownika</p>
                        </div>
                        <form className="mt-5 sm:flex sm:items-center" onSubmit={onSubmit}>
                            <div>
                                <input
                                    type="username"
                                    name="username"
                                    id="username"
                                    className="block w-full pl-1.5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                    placeholder="nazwa użytkownika"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="block w-full pl-1.5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                    placeholder="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <input
                                    type="role"
                                    name="role"
                                    id="role"
                                    className="block w-full pl-1.5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                    placeholder="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </div>
                            <button
                                className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
                            >
                                Zapisz
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}