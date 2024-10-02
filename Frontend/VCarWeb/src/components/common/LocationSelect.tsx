import { useTranslation } from "react-i18next";
import provinces from "../../config/provincesMockup";
import { Select } from "antd";

const LocationSelect = ({ className, setProvince }: {
    className?: string;
    setProvince?: (value: string) => void;
}) => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const provinceOptions = provinces.map(province => ({
        value: province.id.toString(),
        label: currentLanguage === "en" ? province.enName : province.vnName,
    }));

    const handleChange = (value: string) => {
        const selectedProvince = provinceOptions.find(option => option.value === value);
        if (setProvince && selectedProvince) {
            setProvince(selectedProvince.label);
        }
    };

    return (
        <Select
            showSearch
            placeholder="Select a province"
            filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={provinceOptions}
            className={className}
            placement="bottomLeft"
            onChange={handleChange}
        />
    );
};

export default LocationSelect;