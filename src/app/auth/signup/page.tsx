import RegisterForm from "@component/components/ui/forms/RegisterForm";
import React from "react";
import Image from "next/image";
import logoImage from "../../../../images/logo2.png";
import backgroundImage from "../../../../images/logo2.png";
import Link from "next/link";


export default function RegisterPage () {
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
                                Create your account
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
                        <RegisterForm/>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Already have an account? <Link href="/auth/signin" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
                        </p>
                        <div className="relative mt-10">
                            <div className="relative flex justify-center text-sm font-medium leading-6">
                                <span className="bg-white dark:bg-gray-800 px-6 text-black dark:text-white">OR</span>
                            </div>
                        </div>
                        <Link href="#" className="flex items-center justify-center mt-4 rounded-lg shadow-md hover:bg-gray-100 bg-white">
                            <div className="px-4 py-3 hover:text-gray-900">
                                <svg className="h-6 w-6" viewBox="0 0 40 40">
                                    <path
                                        d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                                        fill="#FFC107" />
                                    <path
                                        d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                                        fill="#FF3D00" />
                                    <path
                                        d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                                        fill="#4CAF50" />
                                    <path
                                        d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                                        fill="#1976D2" />
                                </svg>
                            </div>
                            <h1 className="text-gray-900">Sign in with Google</h1>
                        </Link>
                        <p className="text-xs font-light text-gray-500 dark:text-gray-400">
                            <Link href="/" className=" text-primary-600 hover:underline">Back to home page</Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}