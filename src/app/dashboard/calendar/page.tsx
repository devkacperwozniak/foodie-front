import DashboardLayout from "@component/components/ui/dashboardTest/Dash";
import DashboardCalendar from "@component/components/ui/dashboard/DashboardCalendar";
import DashCalendar from "@component/components/ui/dashboardTest/DashCalendar";


export default function Calendar(){
    return (
        <DashboardLayout nav="Kalendarz"><DashCalendar/></DashboardLayout>
    )
}