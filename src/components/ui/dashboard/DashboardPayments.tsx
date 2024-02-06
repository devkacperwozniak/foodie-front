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
    TabsBody,
    TabPanel,

} from "@material-tailwind/react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

const TABS = [
    {
        label: "Bieżące płatności",
        value: "all",
    },
    {
        label: "Historia wpłat",
        value: "monitored",
    },
];

const TABLE_HEAD = ["Data", "Posiłki", "Do zapłaty"];

const TABLE_ROWS = [
    {
        date: "2023-12-10",
        food: "Zestaw 1",
        price: "30",
    },
    {
        date: "2023-12-11",
        food: "Zestaw 2",
        price: "30",
    },
    {
        date: "2023-12-10",
        food: "Zestaw 1",
        price: "30",
    },
    {
        date: "2023-12-11",
        food: "Zestaw 2",
        price: "30",
    },
    {
        date: "2023-12-10",
        food: "Zestaw 1",
        price: "30",
    },
    {
        date: "2023-12-11",
        food: "Zestaw 2",
        price: "30",
    },
    {
        date: "2023-12-10",
        food: "Zestaw 1",
        price: "30",
    },
    {
        date: "2023-12-11",
        food: "Zestaw 2",
        price: "30",
    },
    {
        date: "2023-12-10",
        food: "Zestaw 1",
        price: "30",
    },
    {
        date: "2023-12-11",
        food: "Zestaw 2",
        price: "30",
    },
    {
        date: "2023-12-10",
        food: "Zestaw 1",
        price: "30",
    },
    {
        date: "2023-12-11",
        food: "Zestaw 2",
        price: "30",
    },
    {
        date: "2023-12-10",
        food: "Zestaw 1",
        price: "30",
    },
    {
        date: "2023-12-11",
        food: "Zestaw 2",
        price: "30",
    },
];



export default function DashboardPayments() {

    const [activeTab, setActiveTab] = useState('current');

    const handleTabChange = (tabId: any) => {
        setActiveTab(tabId);
    };


    const { data: session } = useSession()

    const handleClick = async () => {
        const checkoutUrl = 'http://localhost:3000/payments/checkout';

        const requestData = {
            email: session?.user?.email,
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

        console.log(data);
        window.open(data, '_blank');
    };

    return (
        <>

            <Card className="mt-1 w-1/5">

                <CardBody>
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                        Płatności
                    </Typography>
                    <Typography>
                        Do zapłaty: 100,00 PLN
                    </Typography>
                </CardBody>
                <CardFooter className="pt-0">
                    <Button onClick={() => handleClick()}>Opłać</Button>
                </CardFooter>
            </Card>

            <Card className="h-full w-full mt-5">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <Tabs value={activeTab} onChange={() => handleTabChange}>
                            <TabsHeader>
                                <Tab onClick={() => handleTabChange('current')} className="w-40" key={"value1"} value={"value1"}>
                                    &nbsp;&nbsp;{'Bieżące płatności'}&nbsp;&nbsp;
                                </Tab>
                                <Tab onClick={() => handleTabChange('old')} className="w-40" key={"value2"} value={"value2"}>
                                    &nbsp;&nbsp;{'Historia wpłat'}&nbsp;&nbsp;
                                </Tab>
                            </TabsHeader>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardBody className="overflow-y-auto px-0 max-h-[500px]">
                    {activeTab === 'current' ?
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
                                {TABLE_ROWS.map(
                                    ({ date, food, price }, index) => {
                                        const isLast = index === TABLE_ROWS.length - 1;
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
                                                        {food}
                                                    </Typography>
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
                        :
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
                                {TABLE_ROWS.map(
                                    ({ date, food, price }, index) => {
                                        const isLast = index === TABLE_ROWS.length - 1;
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
                                                        {food}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {'this is test'}
                                                    </Typography>
                                                </td>
                                            </tr>
                                        );
                                    },
                                )}
                            </tbody>
                        </table>
                    }

                </CardBody>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                        Page 1 of 10
                    </Typography>
                    <div className="flex gap-2">
                        <Button variant="outlined" size="sm">
                            Previous
                        </Button>
                        <Button variant="outlined" size="sm">
                            Next
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {/*         
      

            <Card className="mt-1">

                <CardBody>
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                        Bieżące należności
                    </Typography>

                    <br />

                    <Card className="w-full overflow-y-auto h-80">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th
                                            key={head}
                                            className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                        >
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                {head}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {TABLE_ROWS.map(({ date, food, price }, index) => {
                                    const isLast = index === TABLE_ROWS.length - 1;
                                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={date}>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {date}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {food}
                                                </Typography>
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
                                })}
                            </tbody>
                            <tfoot className="right-0">

                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="p-4 right-0 font-normal border-b border-blue-gray-50"
                                >
                                    100,00
                                </Typography>


                            </tfoot>
                        </table>
                    </Card>
                </CardBody>
            </Card>


            <Card className="mt-6">

                <CardBody>
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                        Historia wpłat
                    </Typography>

                    <br />

                    <Card className="w-full overflow-y-auto h-80">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th
                                            key={head}
                                            className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                        >
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                {head}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {TABLE_ROWS.map(({ date, food, price }, index) => {
                                    const isLast = index === TABLE_ROWS.length - 1;
                                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={date}>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {date}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {food}
                                                </Typography>
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
                                })}
                            </tbody>
                            <tfoot className="right-0">

                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="p-4 right-0 font-normal border-b border-blue-gray-50"
                                >
                                    100,00
                                </Typography>


                            </tfoot>
                        </table>
                    </Card>
                </CardBody>
            </Card>
 */}



        </>
    )
}