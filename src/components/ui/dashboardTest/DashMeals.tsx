'use client'

import Image from "next/image";
import {PencilIcon, PlusIcon, XCircleIcon} from '@heroicons/react/24/outline'
import React, {useState} from "react";
import AddMeals from "@component/components/ui/modals/meals/AddMeal.modal";

import {Card, CardBody, CardFooter, CardHeader, Typography, Spinner} from "@material-tailwind/react";
import {Backend_URL} from "@component/lib/constant";
import {useSession} from "next-auth/react";
import useSWR from 'swr'
import EditMeal from "@component/components/ui/modals/meals/EditMeal.modal";


export default function DashMeals(){
    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalOpenEdit, setModalOpenEdit] = useState(false);
    const { data: session} = useSession() as any;

    const graphqlQuery = {
        query: `query {    meals {        imageSource        price        type        description   id    }}`
    };


    const fetchData = async () => {
        const res = await fetch(`${Backend_URL}/graphQL`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(graphqlQuery),
            cache: "no-store"
        })
        const json = await res.json();
        return json.data.meals

    }

    const { data: products, isLoading, mutate } = useSWR<{
        imageSource: string;
        price: number;
        type: string ;
        description: string;
        id: string
    }[]>( 'meals', fetchData, {
        revalidateOnMount: true,
        revalidateIfStale: true,
        revalidateOnFocus: false,
    })

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        e.preventDefault()

        const graphqlQuerymutationDelete = {
            query: `mutation removeMeal($id: ID!){  removeMeal(id: $id){ id }}`
            ,
            variables: {
                "id": id
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
        return json.data.meals
    }


    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
    }

    const openModalEdit = () => setModalOpenEdit(true);
    const closeModalEdit = () => {
        setModalOpenEdit(false);
    }

    const m = async () => {
       await mutate();
    }
    if (isLoading || !products) return <div  className="flex items-end gap-8">
        Pobieranie Produktów...
        <Spinner className="h-12 w-12" />
    </div>;

    return (
        <>
            {
                isModalOpen && <AddMeals onClose={closeModal} mutation={m}/>
            }
            {
                isModalOpenEdit && <EditMeal onClose={closeModalEdit} mutation={m}/>
            }

            <div className="sm:flex sm:items-center mb-10 px-2 sm:px-6">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Posiłki</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Zarządzaj wszystkimi posiłkami w aplikacji. <span className="font-bold">Dodawaj - Edytuj - Usuwaj</span>
                    </p>

                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        onClick={openModal}
                        className="inline-flex rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Dodaj posiłek<PlusIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            </div>
            <div>
                <ul role="list" className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3 lg:gap-x-6 xl:grid-cols-5 xl:gap-x-6">
                    {products.map((product: any) => (
                        <li key={product.imageSource}>
                            <Card className="mt-6 m-10 mb-0 sm:m-0 sm:mt-6 xl:mt-8 static">
                                <CardHeader className="static -mb-4">
                                    <Image src={product.imageSource} width={80} height={80} style={{
                                        maxWidth: "100%",
                                        minHeight: "200px",
                                        maxHeight: "200px",
                                        objectFit: "cover"
                                    }} layout="responsive"
                                           alt="card-image"
                                    />
                                </CardHeader>
                                <CardBody>
                                    <Typography variant="h6" color="blue-gray" className="mb-1">
                                        {product.title}
                                    </Typography>
                                    <Typography variant="small">
                                        <span className="font-bold">Opis: </span> {product.description}
                                    </Typography>
                                    <Typography variant="small">
                                        <span className="font-bold">typ: </span>{product.type}
                                    </Typography>
                                    <Typography variant="small">
                                        <span className="font-bold">Cena: </span>{product.price}
                                    </Typography>
                                </CardBody>
                                <CardFooter className="pt-0 pb-2 -mt-4">
                                    <div className="-mt-px flex divide-x divide-gray-200">
                                        <div className="flex w-0 flex-1">
                                            <button
                                                className="-mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-xs hover:text-sm font-semibold text-gray-900"
                                                onClick={openModalEdit}
                                            >
                                                <PencilIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                Edytuj
                                            </button>
                                        </div>
                                        <div className="-ml-px flex w-0 flex-1">
                                            <button
                                                onClick={(e) => handleClick(e, product.id)}
                                                className="inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-xs hover:text-sm font-semibold text-gray-900"
                                            >
                                                <XCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                Usuń
                                            </button>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </li> ))}
                </ul>
            </div>
        </>
    )
}