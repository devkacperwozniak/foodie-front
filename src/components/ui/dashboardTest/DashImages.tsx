"use client"

import {Card, CardBody, CardHeader, Spinner} from "@material-tailwind/react";
import {XCircleIcon ,ClipboardDocumentListIcon} from "@heroicons/react/24/outline";
import React, {useState} from "react";
import Image from "next/image";
import AddImage from "@component/components/ui/modals/images/AddImage.modal";
import {Backend_URL} from "@component/lib/constant";
import {useSession} from "next-auth/react";
import useSWR from "swr";
import {toast} from "sonner";

export default function DashImages() {
    const [isModalOpen, setModalOpen] = useState(false);
    const { data: session} = useSession() as any;

    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
    }

    const copyToClipboard = (textToCopy: string) => {
            navigator.clipboard.writeText(textToCopy).then(() => {
                toast.success('Tekst skopiowany do schowka!', { position: "top-right" });
            }).catch(err => {
                toast.error('Błąd podczas kopiowania.');
            });
        };

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, path: string) => {
        e.preventDefault()
        await fetch(`${Backend_URL}/storage/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({ path: path.split("/").pop() }),
        })

        await mutate()
    }

    const fetchData = async () => {
        const res = await fetch(`${Backend_URL}/storage/files/meals`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
        })
        const json = await res.json();
        return json

    }

    const { data: files, isLoading, mutate } = useSWR<string[]>( 'images', fetchData, {
        revalidateOnMount: true,
        revalidateIfStale: true,
        revalidateOnFocus: false,
    })

    console.log(files)

    if (isLoading || !files) return <div  className="flex items-end gap-8">
        Pobieranie Zdjęć...
        <Spinner className="h-12 w-12" />
    </div>;

    return (
        <>
            {
                isModalOpen && <AddImage onClose={closeModal}/>
            }
        <div>
            <div className="sm:flex sm:items-center mb-10">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Zdjęcia</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Zarządzaj wszystkimi zdjęciami na Google Storage. Należy pamiętać, że jedynie linki do zdjęć wymienionych poniżej mogą być używane na stronie internetowej.
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                        W związku z powyższym, edycja posiłku przy użyciu linków innych niż te podane poniżej nie jest możliwa.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        onClick={openModal}
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Dodaj zdjęcie
                    </button>
                </div>
            </div>
            <ul role="list" className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3 lg:gap-x-6 xl:grid-cols-5 xl:gap-x-6">
                {files.map((file) => (
                    <li key={file}>
                        <Card className="mt-6 m-10 sm:m-0 sm:mt-6 xl:mt-8 static">
                            <CardHeader className="static -mb-4">
                                <Image src={file} width={80} height={80} style={{
                                    maxWidth: "100%",
                                    minHeight: "200px",
                                    maxHeight: "200px",
                                    objectFit: "cover"
                                }} layout="responsive"
                                       alt="card-image"
                                />
                            </CardHeader>
                            <CardBody>
                                <div className="-mt-px -mb-5 flex divide-x divide-gray-200">
                                    <div className="flex w-0 flex-1">
                                        <button
                                            className="-mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-xs hover:text-sm font-semibold text-gray-900"
                                            onClick={() => copyToClipboard(file)}
                                        >
                                            <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            Link
                                        </button>
                                    </div>
                                    <div className="-ml-px flex w-0 flex-1">
                                        <button
                                            onClick={(e) => handleClick(e, file)}
                                            className="inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-xs hover:text-sm font-semibold text-gray-900"
                                        >
                                            <XCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            Usuń
                                        </button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
}