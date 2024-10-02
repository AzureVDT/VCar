import { Avatar, Badge, Button, GetProps, Input, Popover, Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import { useAuth } from "../../contexts/auth-context";
import LanguageSelector from "../../components/LanguageSelector";
import { BellOutlined } from "@ant-design/icons";
import { DEFAULT_AVATAR } from "../../config/apiConfig";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import NotificationContent from "../../components/common/NotificationContent";
type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const DashboardHeader = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);
    const { isLogged } = useAuth();
    console.log("DashboardHeader ~ isLogged:", isLogged)
    return (
        <Header className="fixed left-0 right-0 z-50 flex items-center justify-between shadow-md bg-lite">
            <div className="flex items-center justify-center gap-x-5">
                <Link to={"/"} className="flex items-center justify-center">
                    <Typography.Text className="text-4xl font-bold text-center cursor-pointer text-primary-default">
                        VCAR
                    </Typography.Text>
                </Link>
                <Search
                    placeholder="Search car..."
                    onSearch={onSearch}
                    className="flex-1 w-full min-w-[300px]"
                />
            </div>
            <div className="flex items-center justify-center gap-x-2">
                <LanguageSelector></LanguageSelector>
                {isLogged ? <div className="flex items-center justify-center gap-x-5">

                    <Popover title={<Typography.Title level={4}>Thông báo</Typography.Title>} content={<NotificationContent />} trigger="click" placement="bottomRight">
                        <Badge showZero count={0} size="default" className="cursor-pointer">
                            <BellOutlined className="text-xl" />
                        </Badge>
                    </Popover>
                    <Avatar
                        size={"large"}
                        src={DEFAULT_AVATAR}
                        className="cursor-pointer"
                        onClick={() => navigate("/account")}
                    ></Avatar>
                </div> : <div>
                    <Button type="link" href="/signin">{t("login")}</Button>
                    <Button type="primary" href="/signup">{t("signUp")}</Button>
                </div>}
            </div>
        </Header >
    );
};

export default DashboardHeader;
