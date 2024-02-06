import Link from "next/link";

const faqs = [
    {
        id: 1,
        question: "Jak szybko po dokonaniu opłaty mogę zacząć korzystać z zamówionych posiłków?",
        answer:
            "Możesz zacząć korzystać z posiłków 48 godzin po zaksięgowaniu Twojej opłaty.",
    },
    {
        id: 2,
        question: "Ile czasu przed planowaną datą posiłku mogę dokonać jego odwołania, aby otrzymać zwrot kosztów?",
        answer:
            "Możesz odwołać opłacony posiłek z co najmniej 24-godzinnym wyprzedzeniem, aby otrzymać pełny zwrot kosztów",
    },
    // More questions...
]

export default function FAQ() {
    return (
        <div className="bg-white" id="faq">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Często zadawane pytania</h2>
                    <p className="mt-6 text-base leading-7 text-gray-600">
                        Masz inne pytanie i nie możesz znaleźć odpowiedzi, której szukasz? Skontaktuj się z nami {' '}
                        <Link href="#contact" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            wysyłając do nas e-mail.
                        </Link>{' '}
                        Odpowiemy tak szybko, jak to możliwe.
                    </p>
                </div>
                <div className="mt-20">
                    <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:gap-x-10">
                        {faqs.map((faq) => (
                            <div key={faq.id}>
                                <dt className="text-base font-semibold leading-7 text-gray-900">{faq.question}</dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">{faq.answer}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
}
