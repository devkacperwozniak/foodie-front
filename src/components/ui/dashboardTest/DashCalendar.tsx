'use client'

import React, { useState } from 'react'
import { Button, Card, CardBody, Typography, Dialog, DialogHeader, DialogBody, DialogFooter, Spinner, Checkbox, select, CardFooter } from '@material-tailwind/react'
import { Backend_URL } from '@component/lib/constant';
import { useSession } from 'next-auth/react';
import useSWR, { KeyedMutator } from 'swr';
import { DateTime, Interval } from 'luxon';

interface Meal {
    id: string,
    title: string,
    price: number
}

interface MealInDay {
    id: number,
    meal: {
        id: string,
        title: string,
        price: number
    }
    date: {
        date: string
    }
}

interface Data {
    meals: Meal[],
    intervals: any[],
    mealsInDays: MealInDay[]        
}

export default function DashCalendar() {
    const days = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek']

    const { data: session } = useSession() as any;

    const availableMeals = {
        query: `query {
            meals {
                id
                title
                price
          }
}`
    };

    const mealsInDaysInMonthQuery = () => {
        const startOfMonth = DateTime.now().startOf('month').toISODate();
        const endOfMonth = DateTime.now().endOf('month').toISODate();
        return {
            query: `query {
            mealsInDaysConstrained(userEmail: "${session?.user?.email}", dateFrom: "${startOfMonth}", dateTo: "${endOfMonth}") {
              id
              meal {
                id
                title
                price
              }
              date {
                  date
              }
            }
          }`
        }
    }

    const fetchData = async () => {
        const res = await fetch(`${Backend_URL}/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(availableMeals),
            cache: "no-store"
        });
        const meals = await res.json();
        const startOfMonth = DateTime.now().startOf('month').setLocale('pl');
        const endOfMonth = DateTime.now().endOf('month').setLocale('pl');

        const workingDays = ['pon.', 'wt.', 'śr.', 'czw.', 'pt.'];

        const intervals = Interval.fromDateTimes(
            startOfMonth,
            endOfMonth)
            .splitBy({ day: 1 }).map(d => d.start).filter(d => {
                if (!d) {
                    throw new Error('DateTime is undefined');
                }
                return workingDays.includes(d.weekdayShort);
            });

        const mealsInDaysInMonth = await fetch(`${Backend_URL}/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(mealsInDaysInMonthQuery()),
            cache: "no-store"
        });
        
        const mealsInDaysInMonthJson = await mealsInDaysInMonth.json();

        return { meals: meals.data.meals, intervals, mealsInDays: mealsInDaysInMonthJson.data.mealsInDaysConstrained };
    }

    const { data, isLoading, mutate } = useSWR<Data>('meals', fetchData, {
        revalidateOnMount: true,
        revalidateIfStale: true,
        revalidateOnFocus: false,
    });

    if (isLoading || !data) return <div className="flex items-end gap-8">
        Pobieranie Danych...
        <Spinner className="h-12 w-12" />
    </div>;

    return (
        <>
            <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">Kalendarz</h1>
                <p className="mt-2 text-sm text-gray-700">
                    Aby dokonać wybrać posiłki kliknij przycisk Dodaj w danym dniu.
                </p>
            </div>
            <div className='flex flex-wrap mt-10'>
                {days.map((day) => {
                    return (
                        <Card className="h-20 w-1/5 rounded-none shadow-none border-2" key={day}>
                            <CardBody>
                                <Typography variant="h6" color="blue-gray" className="mb-2">
                                    {[day]}
                                </Typography>
                            </CardBody>
                        </Card>
                    )
                })}
            </div>
            <div className='flex flex-wrap'>
                {data.intervals.map((date: DateTime) => (

                    <CardTemplate cardDate={date} data={data} key={date.toISODate()} mutate={mutate} />
                ))}
            </div >
        </>
    )
}

const CardTemplate = (props: { cardDate: DateTime, data: Data, mutate: KeyedMutator<Data>}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    const getDefaultSelectedMeals = () => {
        const mealsInDaysConstrained = getMealsForParticularDate();
        const mealIdsForDay = mealsInDaysConstrained.map((mealInDay: MealInDay) => mealInDay.meal.id);
        return mealIdsForDay;
    }

    const getMealsForParticularDate = () => {
        return props.data.mealsInDays.filter((mealInDay: MealInDay) => DateTime.fromISO(mealInDay.date.date).toFormat('yyyy-MM-dd') === props.cardDate.toFormat('yyyy-MM-dd'));
    }

    const [selectedMeals, setSelectedMeals] = useState<string[]>(getDefaultSelectedMeals());

    const { data: session } = useSession() as any;


    const handleSelectedMeals = (mealId: string) => {
        if (selectedMeals.includes(mealId)) {
            return true;
        }
        return false;
    }

    const handleCheckboxChange = (mealId: string) => {
        const isSelected = selectedMeals.includes(mealId);

        if (isSelected) {
            setSelectedMeals(selectedMeals.filter((id: string) => id !== mealId));
        } else {
            setSelectedMeals([...selectedMeals, mealId]);
        }
    };

    const addMealsQuery = (date: string) => {
        return {
            query: `mutation {
            createDateMealUser(createDateMealUserInput: {meals: [${selectedMeals}], userEmail: "${session?.user?.email}", date: "${date}", occurence: 1}) {
                meal {
                    id
                }
                user {
                    id
                }
                date {
                    date
                }
                occurence
            }
        }`
        }
    };

    const handleOrder = async (date: string) => {
        const res = await fetch(`${Backend_URL}/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(addMealsQuery(date)),
            cache: "no-store"
        });
        await props.mutate();
        closeDialog();
    }

    return (
        <Card className="w-1/5 rounded-none shadow-none border-2 flex flex-col">
            <CardBody>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                    {props.cardDate.day + ' ' + props.cardDate.weekdayShort}
                </Typography>
                <div>
                    <div>
                        {props.data.mealsInDays.map((mealInDay: MealInDay) => {
                            const fromDT = DateTime.fromISO(mealInDay.date.date).toFormat('yyyy-MM-dd');
                            if (fromDT === props.cardDate.toFormat('yyyy-MM-dd')) {
                                return (
                                    <Typography key={mealInDay.meal.title} variant="paragraph" color="blue-gray" className="mb-2">
                                        {mealInDay.meal.title}
                                    </Typography>
                                );
                            }
                        })}
                    </div>


                </div>
                <Dialog open={isDialogOpen} handler={openDialog}>
                    <DialogHeader>Wybierz dania</DialogHeader>
                    <DialogBody>
                        {props.data.meals.map((meal: any) => (
                            <>
                                <div className="flex flex-row">
                                    <Checkbox crossOrigin="anonymous" checked={handleSelectedMeals(meal.id)} onChange={() => handleCheckboxChange(meal.id)} />
                                    <Typography
                                        key={meal.title}
                                        variant="small"
                                        color="blue-gray"
                                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                    >
                                        {meal.title}
                                    </Typography>
                                </div>
                            </>
                        ))}
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            variant="text"
                            color="red"
                            onClick={closeDialog}
                            className="mr-1"
                        >
                            <span>Anuluj</span>
                        </Button>
                        <Button variant="gradient" onClick={async () => await handleOrder(props.cardDate.toFormat('yyyy-MM-dd'))}>
                            <span>Zamów</span>
                        </Button>
                    </DialogFooter>
                </Dialog>
            </CardBody>
            <CardFooter className="mt-auto">
                <div className="flex items-center justify-center">
                    <Button className="" size="sm" onClick={openDialog} variant="gradient">Dodaj</Button>
                </div>
            </CardFooter>
        </Card>
    );
};