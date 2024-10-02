import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import DashboardHeader from "../modules/dashboard/DashboardHeader";
import { Content } from "antd/es/layout/layout";
const LayoutMain = () => {
    return (
        <Layout>
            <DashboardHeader />
            <Content className="w-full max-w-[1280px] mx-auto mt-16 pt-8 pb-16">
                <Outlet></Outlet>
            </Content>
        </Layout>
    );
};

export default LayoutMain;