'use client'

import {Backend_URL} from "@component/lib/constant";
import useSWR from "swr";
import {useSession} from "next-auth/react";
import {Spinner} from "@material-tailwind/react";
import React, {useState} from "react";
import DeleteUserModal from "@component/components/ui/modals/users/DeleteUser.modal";
import EditUser from "@component/components/ui/modals/users/EditUser.modal";


export default function DashUsers() {
    const {data: session} = useSession() as any

    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalOpenEdit, setModalOpenEdit] = useState(false);
    const [userClicked, setUserClicked] = useState('');

    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
    }

    const openModalEdit = () => setModalOpenEdit(true);
    const closeModalEdit = () => {
        setModalOpenEdit(false);
    }

    const graphqlQuery = {
        query: `query {    users {        id        email        username        isEmailConfirmed    role}}`
    };

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, user: any) => {
        e.preventDefault()
        setUserClicked(user)
        openModal()
    }

    const fetchData = async () => {
        const res = await fetch(`${Backend_URL}/graphQL`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(graphqlQuery),
        })
        const json = await res.json();
        return json.data.users

    }

    const { data: users2, isLoading, mutate } = useSWR<{
        email: string;
        id: string;
        isEmailConfirmed: boolean;
        username: string;
        role: string;
    }[]>( 'users', fetchData, {revalidateOnFocus: false})

    const mutation = async () => {
        await mutate();
    }

    if (isLoading || !users2) return <div  className="flex items-end gap-8">
        Pobieranie urzytkowników..
        <Spinner className="h-12 w-12" />
    </div>;
    return (
        <>
            {
                isModalOpen && <DeleteUserModal onClose={closeModal} user={userClicked} mutate={mutation}/>
            }
            {
                isModalOpenEdit && <EditUser onClose={closeModalEdit} mutation={mutation}/>
            }
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Użytkownicy</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Zarządzaj wszystkimi uzytkownikami w systemie
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Dodaj użytkownika
                    </button>
                </div>
            </div>
            <div className="-mx-4 mt-8 sm:-mx-0">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                            Name
                        </th>
                        <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                        >
                            Title
                        </th>
                        <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                        >
                            Email
                        </th>
                        <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                            Email potwierdzony
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Role
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {users2.map((person) => (
                        <tr key={person.email}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                {person.username}
                            </td>
                            <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
                                {person.username}
                            </td>
                            <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
                                {person.email}
                            </td>
                            <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
                                {person.isEmailConfirmed?.toString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.role}</td>
                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                <button
                                    className="text-indigo-600 hover:text-indigo-900"
                                    onClick={openModalEdit}
                                >
                                    Edytuj
                                </button>
                                <span>
                                     {' '}<span className="sr-only"></span>
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => handleClick(e, person)}
                                    className="text-red-700 hover:text-red-900"
                                >
                                    Usuń
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    )
}