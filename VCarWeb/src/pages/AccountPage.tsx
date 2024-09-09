import { CarOutlined, DeleteOutlined, DragOutlined, HeartOutlined, LockOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Row, Typography } from "antd";
import { Link, useLocation, Outlet } from "react-router-dom";
import LocationIcon from "../components/icons/LocationIcon";
import { saveAccessToken, saveRefreshToken, saveUser } from "../utils";
import { useAuth } from "../contexts/auth-context";

const tabs = [
    {
        key: "account",
        path: "/account",
        title: "Tài khoản của tôi",
        icon: <UserOutlined className="text-xl" />,
    },
    {
        key: "favorite",
        path: "/account/favorite",
        title: "Xe yêu thích",
        icon: <HeartOutlined className="text-xl" />,
    },
    {
        key: "my-cars",
        path: "/account/my-cars",
        title: "Xe của tôi",
        icon: <CarOutlined className="text-xl" />,
    },
    {
        key: "my-trips",
        path: "/account/my-trips",
        title: "Chuyến của tôi",
        icon: <DragOutlined className="text-xl" />,
    },
    {
        key: "my-address",
        path: "/account/my-address",
        title: "Địa chỉ của tôi",
        icon: <LocationIcon className="text-xl" />,
    },
    {
        key: "change-password",
        path: "/account/change-password",
        title: "Đổi mật khẩu",
        icon: <LockOutlined className="text-xl" />,
    },
];

const AccountPage = () => {
    const path = useLocation().pathname;
    const { setIsLogged } = useAuth();
    const handleLogout = () => {
        saveAccessToken("");
        saveRefreshToken("");
        saveUser("");
        setIsLogged(false);
    }
    return (
        <div>
            <Row gutter={[24, 0]}>
                <Col span={6}>
                    <Row>
                        <Col span={24}>
                            <Typography.Title level={2}>Xin chào bạn!</Typography.Title>
                        </Col>
                        <Divider className="m-0"></Divider>
                        {tabs.map((tab) => (
                            <Col span={24} key={tab.key} className={path === tab.path ? "border-r-[3px] border-r-primary-default" : ""}>
                                <Link to={tab.path}>
                                    <Button
                                        type="text"
                                        className={`justify-start h-[56px] w-full font-medium text-[16px] ${path === tab.path ? "text-primary-default" : ""
                                            }`}
                                        icon={tab.icon}
                                    >
                                        {tab.title}
                                    </Button>
                                </Link>
                            </Col>
                        ))}
                        <Divider className="m-0"></Divider>
                        <Col span={24}>
                            <Button type="text" danger className="justify-start h-[56px] w-full font-medium text-[16px]" icon={<DeleteOutlined className="text-xl" />}>Xóa tài khoản</Button>
                        </Col>
                        <Col span={24}>
                            <Button onClick={handleLogout} type="text" className="justify-start h-[56px] w-full font-medium text-[16px]" icon={<LogoutOutlined className="text-xl" />}>Đăng xuất</Button>
                        </Col>
                    </Row>
                </Col>
                <Col span={18}>
                    <Outlet />
                </Col>
            </Row>
        </div>
    );
};

export default AccountPage;