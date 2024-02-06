'use client'

import { Backend_URL } from "@component/lib/constant";
import {
    ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Spinner,

} from "@material-tailwind/react";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import useSWR from "swr";

interface Payments {
    toPay: ToPay[];
    paid: Paid[]
}

interface ToPay {
    date: { id: number, date: string };
    meals: { id: number, title: string, price: number }[];
    price: number;
}

interface Paid {
    date: string;
    price: number;
}

export default function DashboardPayments() {

    const [activeTab, setActiveTab] = useState('current');

    const handleTabChange = (tabId: any) => {
        setActiveTab(tabId);
    };

    const { data: session } = useSession() as any;



    const BUTTONS = [{
        label: 'Bieżące płatności',
        value: 'current'
    },
    {
        label: 'Historia wpłat',
        value: 'paid'
    }];

    const toPayQuery = {
        query: `query {
            mealsInDays(userEmail: "${session?.user?.email}") {
              id
              meal {
                title
                price
              }
              date {
                id
                date
              }
            }
          }`
    };

    const paidQuery = {
        query: `query {    
        payments {        
            created_at        
            price 
    }}`
    };


    const fetchData = async () => {
        const res = await fetch(`${Backend_URL}/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(toPayQuery),
            cache: "no-store"
        });
        const json = await res.json();
        const mealsInDays = json.data.mealsInDays;

        const reducedMealsInDaysForUser = mealsInDays.reduce(
            (accumulator: any, currentItem: any) => {
                const existingItem = accumulator.find((item: any) => {
                    if (!item.date || !item.date.id) {
                        return false;
                    }
                    return item.date.id === currentItem.date.id;
                });

                if (existingItem) {
                    existingItem.meals.push(currentItem.meal);
                } else {
                    accumulator.push({
                        date: currentItem.date,
                        meals: [currentItem.meal],
                    });
                }

                return accumulator;
            },
            [],
        );

        const resForPaid = await fetch(`${Backend_URL}/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(paidQuery),
            cache: "no-store"
        });
        const jsonForPaid = await resForPaid.json();
        const payments = jsonForPaid.data.payments;
        const paid = payments.map((el: any) => {
            const date = DateTime.fromISO(el.created_at).toFormat('yyyy-MM-dd');
            return { date, price: el.price }
        })
        return { paid, toPay: reducedMealsInDaysForUser };
    }

    const getMealNames = (meals: { id: number, title: string, price: number }[]) => {
        return meals.map((element) => element.title);
    }

    const getTotalPriceForDay = (meals: { id: number, title: string, price: number }[]) => {
        const totalPrice = meals.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.price;
        }, 0);
        return totalPrice
    }

    const { data: payments, isLoading: toPayIsLoading } = useSWR<Payments>('payments', fetchData);



    if (toPayIsLoading || !payments) return <div className="flex items-end gap-8">
        Pobieranie Danych...
        <Spinner className="h-12 w-12" />
    </div>;

    const handleCheckout = async () => {
        const checkoutUrl = `http://${Backend_URL}/payments/checkout`;

        const requestData = {
            email: session?.user?.email,
            value: getValueToPay(payments.toPay)
        };

        const response = await fetch(checkoutUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.text();

        window.open(data, '_blank');
    };

    const CurrentPaymentsTab = () => {

        const TABLE_HEAD = ["Data", "Posiłki", "Do zapłaty"];
        return (
            <table className="mt-4 w-full min-w-max table-auto text-left">
                <thead>
                    <tr>
                        {TABLE_HEAD.map((head, index) => (
                            <th
                                key={head}
                                className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                >
                                    {head}{" "}
                                    {index !== TABLE_HEAD.length - 1 && (
                                        <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                    )}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {payments.toPay.map(
                        ({ date, meals }, index) => {
                            const isLast = index === payments.toPay.length - 1;
                            const classes = isLast
                                ? "p-4"
                                : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={date.date}>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {DateTime.fromISO(date.date).toFormat('yyyy-MM-dd')}
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>

                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {getMealNames(meals).join(', ')}
                                        </Typography>
                                    </td>

                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {getTotalPriceForDay(meals)}
                                        </Typography>
                                    </td>
                                </tr>
                            );
                        },
                    )}
                </tbody>
            </table>
        );
    };

    const PaidPaymentsTab = () => {

        const TABLE_HEAD_PAID = ["Data", "Wpłacono"];
        return (
            <table className="mt-4 w-full min-w-max table-auto text-left">
                <thead>
                    <tr>
                        {TABLE_HEAD_PAID.map((head, index) => (
                            <th
                                key={head}
                                className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                >
                                    {head}{" "}
                                    {index !== TABLE_HEAD_PAID.length - 1 && (
                                        <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                    )}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {payments.paid.map(
                        ({ date, price }, index) => {
                            const isLast = index === payments.paid.length - 1;
                            const classes = isLast
                                ? "p-4"
                                : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={date}>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {date}
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>

                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {price}
                                        </Typography>
                                    </td>
                                </tr>
                            );
                        },
                    )}
                </tbody>
            </table>
        );
    };

    const getValueToPay = (toPay: {
        date: { id: number, date: string };
        meals: { id: number, title: string, price: number }[];
    }[]) => {
        const totalMealsPrice = toPay.reduce((accumulator, currentValue) => {
            const mealsPrice = currentValue.meals.reduce((mealAccumulator, meal) => mealAccumulator + meal.price, 0);
            return accumulator + mealsPrice;
        }, 0);
        return totalMealsPrice;
    }

    const tableToShow = () => {
        if (activeTab === 'current') {
            return <CurrentPaymentsTab />;
        }
        if (activeTab === 'paid') {
            return <PaidPaymentsTab />;
        }
    }

    return (
        <>
            <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">Płatności</h1>
                <p className="mt-2 text-sm text-gray-700">
                    Sprawdź bieżące płatności, saldo oraz historię dokonanych wpłat. Dokonuj płatności za pośrednictwem karty, szybkich przelewów i BLIK.
                </p>
            </div>
            <Card className="mt-4 w-1/5">
                <CardBody>
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                        Saldo
                    </Typography>
                    <Typography>
                        Do zapłaty: {getValueToPay(payments.toPay)} PLN
                    </Typography>
                </CardBody>
                <CardFooter className="pt-0">
                    <Button onClick={() => handleCheckout()}>Opłać</Button>
                </CardFooter>
            </Card>

            <Card className="h-full w-full mt-5">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <Tabs value={activeTab}>
                            <TabsHeader>
                                {BUTTONS.map(({ label, value }) => (
                                    <Tab key={value} value={value} onClick={() => handleTabChange(value)} className="w-40">
                                        &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                    </Tab>
                                ))}
                            </TabsHeader>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardBody className="overflow-y-auto px-0 max-h-[500px]">

                    {tableToShow()}

                </CardBody>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    <div className="flex gap-2">

                    </div>
                </CardFooter>
            </Card>
        </>
    )
}