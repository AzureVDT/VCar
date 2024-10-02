import React from "react";
import CustomCheckbox from "./common/CustomCheckbox";
import { useTranslation } from "react-i18next";

interface SeatsFilterProps {
  seats: number[];
  onSeatsChange: (value: number) => void;
}

const SeatsFilter: React.FC<SeatsFilterProps> = ({ seats, onSeatsChange }) => {
  const { t } = useTranslation();

  const handleSeatsChange = (value: number | string) => {
    if (value === "10+") {
      onSeatsChange(10); // Set value to 10 if "10+" is selected
    } else {
      if (seats.includes(value as number)) {
        onSeatsChange(value as number); // Uncheck the value if it's already selected
      } else {
        onSeatsChange(value as number); // Check the value if it's not selected
      }
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{t("seats")}</h3>
      <div className="flex flex-col gap-2">
        {[2, 5, 7, 9, "10+"].map((num) => (
          <label key={num} className="flex items-center gap-2">
            <CustomCheckbox
              checked={
                num === "10+"
                  ? seats.includes(10)
                  : seats.includes(num as number)
              }
              onChange={() => handleSeatsChange(num)}
            />
            {num} {t("person")}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SeatsFilter;
