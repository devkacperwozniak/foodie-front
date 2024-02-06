import Image from "next/image";
import backgroundImage from "../../../../images/b2.png";
import Link from "next/link";
import logoImage from "../../../../images/logo2.png";
import UpdatePasswordForm from "@component/components/ui/forms/UpdatePasswordForm";
import React from "react";

export default function RecoveryPage(){
    return (
        <section>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Image
                    src={backgroundImage}
                    priority={true}
                    alt="backgroundImage"
                    fill
                    sizes="100vw"
                    style={{ zIndex: -1 }}
                />
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div className="flex items-center justify-between">
                            <div className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Update your password
                            </div>
                            <Link href="/">
                                <Image
                                    src={logoImage}
                                    alt="Your Company"
                                    width={80}
                                    height={80}
                                    style={{
                                        maxWidth: "100%",
                                        height: "auto"
                                    }} />
                            </Link>
                        </div>
                        <UpdatePasswordForm/>
                        <p className="text-xs font-light text-gray-500 dark:text-gray-400">
                            <Link href="/" className=" text-primary-600 hover:underline">Back to home page</Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}