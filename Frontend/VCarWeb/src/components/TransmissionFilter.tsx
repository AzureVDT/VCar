import React from "react";
import CustomCheckbox from "./common/CustomCheckbox";
import { useTranslation } from "react-i18next";

interface TransmissionFilterProps {
  transmission: string[];
  onTransmissionChange: (value: string) => void;
}

const TransmissionFilter: React.FC<TransmissionFilterProps> = ({
  transmission,
  onTransmissionChange,
}) => {
  const { t } = useTranslation();

  const handleTransmissionChange = (value: string) => {
    if (transmission.includes(value)) {
      onTransmissionChange(value);
    } else {
      onTransmissionChange(value);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{t("transmission")}</h3>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <CustomCheckbox
            checked={transmission.includes("AUTO")}
            onChange={() => handleTransmissionChange("AUTO")}
          />
          {t("automatic")}
        </label>
        <label className="flex items-center gap-2">
          <CustomCheckbox
            checked={transmission.includes("MANUAL")}
            onChange={() => handleTransmissionChange("MANUAL")}
          />
          {t("manual")}
        </label>
      </div>
    </div>
  );
};

export default TransmissionFilter;
