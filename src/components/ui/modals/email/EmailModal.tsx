import React, {useState} from "react";
import {Backend_URL} from "@component/lib/constant";
import {toast} from "sonner";

export default function EmailModal({ onClose }: { onClose: () => void;}) {
    const [email, setEmail] = useState('')
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            onClose()
            toast.promise(async () => await fetch(Backend_URL + "/email-confirmation/resend-confirmation-link", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            }), {
                loading: 'Sending confirmation email...',
                success: () => {
                    return `Email has been resent to your email address`;
                },
                position: 'top-right',
            });
        }
        catch (err: any) {
            toast.error('Smth went wrong. Please try again.', { position: 'top-right' })
            console.log(err)
        }
    }

    return (
        <div style={{ zIndex: 1000 }}>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-60 overflow-y-auto h-full w-full flex justify-center items-center">
                <div className="bg-white shadow sm:rounded-lg w-full sm:w-3/4 lg:w-1/3">
                    <div className="px-6 py-6">
                        <div className="border-b px-4 py-2 flex justify-between items-center">
                            <div className="text-base font-semibold leading-4 text-gray-900">Resend your verification email</div>
                            <button className="text-black close-modal" onClick={onClose}>&times;</button>
                        </div>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                            <p>The last email did not arrive, or the link has expired - resend the verification email</p>
                        </div>
                        <form className="mt-5 sm:flex sm:items-center" onSubmit={onSubmit}>
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
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}