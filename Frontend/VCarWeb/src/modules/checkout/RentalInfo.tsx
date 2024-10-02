import { Col, DatePicker, Row, Typography } from "antd";
import LocationSelect from "../../components/common/LocationSelect";
import { Dayjs } from "dayjs"; // Import dayjs

const { RangePicker } = DatePicker;

const RentalInfo = ({
    onChange,
    setProvince
}: {
    onChange: (dates: [Dayjs | null, Dayjs | null] | null) => void
    setProvince: (value: string) => void
}) => {
    return (
        <div className="p-6 rounded-lg shadow-md bg-lite">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Typography.Title className="m-0" level={5}>
                        Thông tin thuê xe
                    </Typography.Title>
                    <Typography.Text className="text-sm text-custom-blue">Vui lòng chọn ngày thuê xe của bạn</Typography.Text>
                </div>
                <Typography.Text className="text-sm text-custom-blue">Bước 2 của 4</Typography.Text>
            </div>
            <Row gutter={[32, 24]}>
                <Col span={12}>
                    <Typography.Text className="font-medium">Địa điểm</Typography.Text>
                    <LocationSelect className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" setProvince={setProvince}></LocationSelect>
                </Col>
                <Col span={12}>
                    <Typography.Text className="font-medium">Thời gian thuê</Typography.Text>
                    <RangePicker showTime className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" onChange={onChange}></RangePicker>
                </Col>
            </Row>
        </div>
    );
};

export default RentalInfo;