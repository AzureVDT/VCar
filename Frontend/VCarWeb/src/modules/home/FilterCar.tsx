import { Button, DatePicker, Select, Typography } from "antd";
import LocationIcon from "../../components/icons/LocationIcon";
import provinces from "../../config/provincesMockup";
import { useTranslation } from "react-i18next";
import { CalendarOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const FilterCar = () => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const provinceOptions = provinces.map(province => ({
        value: province.id.toString(),
        label: currentLanguage === "en" ? province.enName : province.vnName,
    }));
    return (
        <div className="w-full max-w-[980px] h-full bg-lite shadow-sm p-5 mt-10 mx-auto rounded-lg">
            <div className="flex items-center justify-center">
                <div className="pr-4 border-r border-r-text4">
                    <div className="flex items-center justify-start gap-x-2">
                        <LocationIcon />
                        <Typography.Text className="text-lg">Location</Typography.Text>
                    </div>
                    {/* render select option with provinces */}
                    <Select
                        showSearch
                        placeholder="Select a province"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={provinceOptions}
                        className="w-full min-w-[300px] mt-2"
                        placement="bottomLeft"
                    />
                </div>
                <div className="flex items-center justify-between flex-1 pl-4">
                    <div>
                        <div className="flex items-center justify-start mb-2 gap-x-2">
                            <CalendarOutlined className="text-2xl" />
                            <Typography.Text className="text-lg">Rent time</Typography.Text>
                        </div>
                        <RangePicker showTime />
                    </div>
                    <Button type="primary">Find Car</Button>
                </div>
            </div>
        </div>
    );
};

export default FilterCar;