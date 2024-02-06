"use client"

import React from "react";
import {Backend_URL} from "@component/lib/constant";
import {toast} from "sonner";
import {useSession} from "next-auth/react";

export default function AddImageModal(props: { onClose: () => void }) {
    const {onClose} = props

    const { data: session } = useSession() as any;
    const token = session.accessToken

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            onClose()
            const formData = new FormData();
            const target = e.target as typeof e.target & {
                file: { files: FileList };
            };
            formData.append('file', target.file.files[0]);
            toast.promise(async () => {
                console.log(token)
                const res = await fetch(`${Backend_URL}/storage/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                })
                console.log(res)
                const a = await res.json()
                console.log(a)
            }, {
                loading: 'Dodawanie zdjęcia',
                success: (a) => {
                    console.log(a)
                    return `Zdjecie dodane`;
                },
                position: 'top-right',
            });
        }
        catch (err: any) {
            toast.error('Coś poszło nie tak.', { position: 'top-right' })
            console.log(err)
        }
    }

    return (
        <div style={{ zIndex: 1000 }}>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-60 overflow-y-auto h-full w-full flex justify-center items-center">
                <div className="bg-white shadow sm:rounded-lg w-full sm:w-3/4 lg:w-1/3 lg:ml-72">
                    <div className="px-6 py-6">
                        <div className="border-b px-4 py-2 flex justify-between items-center">
                            <div className="text-base font-semibold leading-4 text-gray-900">Dodaj zdjęcie</div>
                            <button className="text-black close-modal" onClick={onClose}>&times;</button>
                        </div>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                            <p>Zdjecie zostanie dodane na Google Storage</p>
                        </div>
                        <form className="mt-5 sm:flex sm:items-center" onSubmit={onSubmit}>
                            <div>
                                <input type="file" name="file" required />
                            </div>
                            <button
                                className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
                            >
                                Dodaj
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}