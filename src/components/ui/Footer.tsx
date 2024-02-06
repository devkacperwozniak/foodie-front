const navigation = {
    social: [
        {
            name: 'Facebook',
            href: '#',
            icon: (props: any) => (
                <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                    <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
    ],
}

export default function Example() {
    return (
        <footer className="bg-white" aria-labelledby="footer-heading">
            <div className="mx-auto max-w-7xl px-6 pb-8 pt-20 sm:pt-24 lg:px-8 lg:pt-32">
                <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-16 md:flex md:items-center md:justify-between lg:mt-24">
                    <div className="flex space-x-6 md:order-2">
                        {navigation.social.map((item) => (
                            <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">{item.name}</span>
                                <item.icon className="h-6 w-6" aria-hidden="true" />
                            </a>
                        ))}
                    </div>
                    <p className="mt-8 text-xs leading-5 text-gray-500 md:order-1 md:mt-0">
                        &copy; 2023 Foodie Company, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
