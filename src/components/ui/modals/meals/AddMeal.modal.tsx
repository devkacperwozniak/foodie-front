"use client"

import React, {useState} from "react";
import {Backend_URL} from "@component/lib/constant";
import {toast} from "sonner";
import {useSession} from "next-auth/react";

export default function AddMeal(props: { onClose: () => void; mutation: () => Promise<void>; }) {
    const {onClose, mutation} = props
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('')
    const [price, setPrice] = useState('')

    const { data: session } = useSession() as any;
    const token = session.accessToken

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isNaN(Number(price))) {
            toast.error('Nieprawidłowa wartość cena!', {position: "top-right"})
            return
        }
            onClose()
            const formData = new FormData();
            const target = e.target as typeof e.target & {
                file: { files: FileList };
            };
            formData.append('file', target.file.files[0]);
            toast.promise(async () => {
                const res = await fetch(`${Backend_URL}/storage/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                })
                const a = await res.json()
                const fileUrl = a.url

                const graphqlQuery = {
                    query: `       mutation createMeal($createMealInput: CreateMealInput!){    createMeal(createMealInput: $createMealInput){        id    }}    `
                    ,
                    variables: {
                        "createMealInput": {
                            "price": Number(price),
                            "type": type,
                            "title": title,
                            "description": description,
                            "imageSource": fileUrl
                        }
                    }
                };

                const resGraphQl = await fetch(`${Backend_URL}/graphql`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(graphqlQuery)
                })
                const graph = await resGraphQl.json()
                if(graph.errors?.length > 0){
                    throw new Error(graph.errors[0].message)
                }
                await mutation()
            }, {
                loading: 'Dodawanie posiłku',
                success: (a) => {
                    return `Posiłek został dodany`;
                },
                error: (a) => {
                    return `Wystąpił błąd podczas dodawania posiłku`;
                },
                position: 'top-right',
            });
    }

    return (
        <div style={{ zIndex: 1000 }}>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-60 overflow-y-auto h-full w-full flex justify-center items-center">
                <div className="bg-white shadow sm:rounded-lg w-full sm:w-3/4 lg:w-1/3 lg:ml-72">
                    <div className="px-6 py-6">
                        <div className="border-b px-4 py-2 flex justify-between items-center">
                            <div className="text-base font-semibold leading-4 text-gray-900">Dodaj posiłek</div>
                            <button className="text-black close-modal" onClick={onClose}>&times;</button>
                        </div>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                            <p>Odpowiednio wypełnij wszystkie pola by dodać posiłek</p>
                        </div>
                        <form className="mt-5 sm:flex sm:items-center" onSubmit={onSubmit}>
                            <div>
                                <input type="file" name="file" required />
                                <input
                                    type="title"
                                    name="title"
                                    id="title"
                                    className="block w-full pl-1.5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                    placeholder="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <input
                                    type="description"
                                    name="description"
                                    id="description"
                                    className="block w-full pl-1.5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                    placeholder="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <input
                                    type="type"
                                    name="type"
                                    id="type"
                                    className="block w-full pl-1.5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                    placeholder="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                />
                                <input
                                    type="price"
                                    name="price"
                                    id="price"
                                    className="block w-full pl-1.5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                    placeholder="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
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