'use client'

import React, { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from "next/link";
import Image from "next/image";
import background from "../../images/backgroundleniwiec.png";
import Logo from "../../images/logo2.png";
import FAQ from "@component/components/ui/FAQ";
import Footer from "@component/components/ui/Footer";
import Contact from "@component/components/ui/Contact";
import Team from "@component/components/ui/Team";
import {signOut, useSession} from "next-auth/react";

const navigation = [
    { name: 'Panel klienta', href: '/dashboard' },
    { name: 'Zespół', href: '#team' },
    { name: 'Kontakt', href: '#contact' },
    { name: 'FAQ', href: '#faq' },
]

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { data: session } = useSession()

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        await signOut({ callbackUrl: '/' })
    }

    return (
        <>
        <div id="home">
            <Image
                src={background}
                priority={true}
                alt="backgroundImage"
                fill
                style={{ zIndex: -1, maxWidth: "100%", minHeight: "750px", maxHeight: "800px" }}
                className="hidden lg:block"
            />
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="mx-auto -mt-2 flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <div className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <Link href="/">
                                <Image
                                    className="mx-auto"
                                    src={Logo}
                                    alt="Your Company"
                                    width={120}
                                    height={120}
                                    style={{
                                        maxWidth: "100%",
                                        height: "auto"
                                    }} />
                            </Link>
                        </div>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-semibold leading-6 text-gray-900">
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    {
                        session ?
                            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                                <button
                                    onClick={(e)=> handleLogout(e)}
                                    className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-1 text-sm text-white shadow-sm hover:bg-indigo-700"
                                >
                                    Wyloguj
                                </button>
                            </div>
                            :
                            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                                <Link href="/auth/signin" className="text-sm font-semibold text-gray-900 items-center justify-center whitespace-nowrap rounded-md px-4 py-2">
                                    Zaloguj <span aria-hidden="true">&rarr;</span>
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-1 text-sm text-white shadow-sm hover:bg-indigo-700"
                                >
                                    Zarejestruj
                                </Link>
                            </div>
                    }
                </nav>
                <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                    <div className="fixed inset-0 z-50" />
                    <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <a href="#" className="-m-1.5 p-1.5">
                                <span className="sr-only">Your Company</span>
                                <Link href="/">
                                    <Image
                                        className="mx-auto"
                                        src={Logo}
                                        alt="Your Company"
                                        width={80}
                                        height={80}
                                        style={{
                                            maxWidth: "100%",
                                            height: "auto"
                                        }} />
                                </Link>
                            </a>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                                {
                                    session ?
                                        <div className="py-6">
                                            <button
                                                onClick={(e)=> handleLogout(e)}
                                                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                            >
                                                Wyloguj
                                            </button>
                                        </div>
                                        :
                                        <div className="py-6">
                                            <Link
                                                href="auth/signin"
                                                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                            >
                                                Zaloguj
                                            </Link>
                                            <Link
                                                href="auth/signup"
                                                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                            >
                                                Zarejestruj
                                            </Link>
                                        </div>
                                }
                            </div>
                        </div>
                    </Dialog.Panel>
                </Dialog>
            </header>
            <div>
                {/*<div*/}
                {/*    className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"*/}
                {/*    aria-hidden="true"*/}
                {/*/>*/}
                <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-0 lg:ml-20">
                    <div className="mx-auto mt-8 max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
                        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
                            Twoja Kuchnia.
                        </h1>
                        <div className="mt-6 max-w-xl lg:mt-0">
                            <p className="text-lg leading-8 text-black-900">
                                Witamy w sercu naszej kuchni, gdzie codziennie serwujemy świeże, zdrowe i pyszne posiłki, które pobudzają umysł i ciało do nauki. 🚀
                                <br></br>
                                <br></br>
                                Pragniemy zaoferować <span className="font-bold">Wam</span> wygodę zarządzania posiłkami bez wychodzenia z domu.
                                Nasz system online umożliwia nie tylko łatwe płatności i wybór różnych wariantów posiłków,
                                ale także pozwala na elastyczne planowanie dat, w których uczeń będzie korzystał z naszej oferty, dostosowując ją do indywidualnych potrzeb.
                            </p>
                            <div className="mt-10 flex items-center gap-x-6">
                                <a
                                    href="#"
                                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Zaczynajmy
                                </a>
                                <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                                    Dowiedz się więcej <span aria-hidden="true">→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
            </div>
        </div>
            <FAQ></FAQ>
            <Team></Team>
            <Contact></Contact>
            <Footer></Footer>
        </>
    )
}

