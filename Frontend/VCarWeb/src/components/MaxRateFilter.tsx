import React from "react";
import { useTranslation } from "react-i18next";

interface MaxRateFilterProps {
  maxRate: number;
  onRateChange: (value: number) => void;
  onInputChange: (value: number) => void;
}

const MaxRateFilter: React.FC<MaxRateFilterProps> = ({
  maxRate,
  onRateChange,
  onInputChange,
}) => {
  const { t } = useTranslation();

  const handleRateChange = (value: number) => {
    if (value > 10000000) {
      onRateChange(10000000);
    } else {
      onRateChange(value);
    }
  };

  const handleInputChange = (value: number) => {
    if (value > 10000000) {
      onInputChange(10000000);
    } else {
      onInputChange(value);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{t("maxRatePerDay")}</h3>
      <div className="flex flex-col items-start">
        <input
          type="range"
          min="10000"
          max="10000000"
          step="10000"
          value={maxRate}
          onChange={(e) => handleRateChange(Number(e.target.value))}
          className="w-full mb-2"
        />
        <div className="flex flex-col items-start">
          <input
            type="number"
            value={maxRate}
            onChange={(e) => handleInputChange(Number(e.target.value))}
            className="w-32 border border-gray-300 rounded px-2 py-1 mb-2"
            step={10000}
            max="10000000"
          />
          <span className="text-lg font-semibold">
            {maxRate >= 10000000 ? "10,000,000+" : maxRate.toLocaleString()}{" "}
            {t("currency")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MaxRateFilter;
