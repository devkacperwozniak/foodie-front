import DashboardLayout from "@component/components/ui/dashboardTest/Dash";
import DashMeals from "@component/components/ui/dashboardTest/DashMeals";

export default function Meals(){
    return (
            <DashboardLayout nav="Posiłki"><DashMeals/></DashboardLayout>
    )
}