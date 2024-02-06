"use client"

import React from "react";
import {Backend_URL} from "@component/lib/constant";
import {useSession} from "next-auth/react";

export default function DeleteUserModal(props: { onClose: () => void, user: any, mutate: () => Promise<void> }) {
    const {onClose, user, mutate} = props

    const { data: session } = useSession() as any;

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        const graphqlQuerymutationDelete = {
            query: `mutation removeUser($id: ID!){  removeUser(id: $id){ id }}`
            ,
            variables: {
                "id": user.id
            }
        };
        const res = await fetch(`${Backend_URL}/graphQL`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(graphqlQuerymutationDelete),
        })
        const json = await res.json();
        await mutate()
        return json.data
    }

    return (
        <div style={{ zIndex: 1000 }}>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-60 overflow-y-auto h-full w-full flex justify-center items-center">
                <div className="bg-white shadow sm:rounded-lg w-full sm:w-3/4 lg:w-1/3 lg:ml-72">
                    <div className="px-6 py-6">
                        <div className="border-b px-4 py-2 flex justify-between items-center">
                            <div className="text-base font-semibold leading-4 text-gray-900">Usuń urzytkownika</div>
                            <button className="text-black close-modal" onClick={onClose}>&times;</button>
                        </div>
                        <div className="mt-2 mb-2.5 max-w-xl text-sm text-gray-500">
                            <p>Czy na pewno chesz usunąć użytkownika: <span className="font-bold">{user.email}</span>?</p>
                            <p>Ta operacja jest nieodwracalna! Trwale usuniesz użytkownika z bazy danych</p>
                        </div >
                            <button
                                className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
                                onClick={(e) => handleClick(e)}
                            >
                                Tak
                            </button>
                            <button
                                onClick={onClose}
                                className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
                            >
                                Nie
                            </button>
                    </div>
                </div>
            </div>
        </div>
    );
}