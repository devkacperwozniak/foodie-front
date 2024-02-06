import React, {useState} from "react";
import {Backend_URL} from "@component/lib/constant";
import {toast} from "sonner";

export default function EmailModalForgotPass({ onClose }: { onClose: () => void;}) {
    const [email, setEmail] = useState<string>('')
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        onClose()

        toast.promise(async ()=> {
            const res = await fetch(Backend_URL + "/mailing/reset-password", {
                method: "POST",
                body: JSON.stringify({
                    email,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!res.ok) {
                const errorResponse = await res.json()
                if (errorResponse.message === "User does not exist") {
                    throw new Error(errorResponse.message);
                }
                throw new Error(res.statusText);
            }
        },
            {
                loading: 'Sending...',
                success: 'Email has been sent!',
                error: (err) => {
                    if (err instanceof Error) {
                        if (err.message === "User does not exist!") {
                            return err.message
                        }
                    }
                    return 'Something went wrong'
                },
                position: "top-right",
            }
        )
    }
    return (
        <div style={{ zIndex: 1000 }}>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-60 overflow-y-auto h-full w-full flex justify-center items-center">
                <div className="bg-white shadow sm:rounded-lg w-full sm:w-3/4 lg:w-1/3">
                    <div className="px-6 py-6">
                        <div className="border-b px-4 py-2 flex justify-between items-center">
                            <div className="text-base font-semibold leading-4 text-gray-900">Forgot password?</div>
                            <button className="text-black close-modal" onClick={onClose}>&times;</button>
                        </div>
                        <div className="mt-3 max-w-xl text-sm text-gray-500">
                            <p>No worries!</p>
                            <p> We&apos;ve got you covered!</p>
                            <br></br>
                            <p>Provide your email and we&apos;ll send you a link to reset your password.</p>
                        </div>
                        <form onSubmit={onSubmit} className="mt-5 sm:flex sm:items-center">
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="block w-full pl-1.5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button
                                className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
                            >
                                Send!
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}