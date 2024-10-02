import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { IRentalData, IRentalRequestParams } from "../../store/rental/types";
import { useMemo, useState } from "react";
import { Table, Typography, Tag, Modal } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { GET_LESSOR_REQUESTS } from "../../store/rental/action";
import LesseeDetailDialog from "../../components/modals/LesseeDetailDialog";

const MyLessee = () => {
    const { lessorListRequest, loading } = useSelector((state: RootState) => state.rental);
    const dispatch = useDispatch();
    const [modalRecord, setModalRecord] = useState<IRentalData>({} as IRentalData);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [params, setParams] = useState<IRentalRequestParams>({
        sortDescending: "",
        page: "0",
        size: "10",
        status: "",
    });

    useMemo(() => {
        dispatch({ type: GET_LESSOR_REQUESTS, payload: params });
    }, [dispatch, params]);

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<IRentalData> | SorterResult<IRentalData>[]
    ) => {
        setParams({
            ...params,
            page: String((pagination.current ?? 1) - 1),
            size: String(pagination.pageSize ?? 10),
            status: filters.status ? String(filters.status[0]) : "",
            sortDescending: Array.isArray(sorter)
                ? sorter[0]?.order === 'descend' ? "true" : "false"
                : sorter.order === 'descend' ? "true" : "false",
        });
    };

    const columns: ColumnsType<IRentalData> = [
        {
            title: 'ID',
            key: 'id',
            render: (_text, _record, index) => index + 1,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'APPROVED', value: 'APPROVED' },
                { text: 'PENDING', value: 'PENDING' },
                { text: 'REJECTED', value: 'REJECTED' },
            ],
            render: (status: string) => {
                let color = '';
                switch (status) {
                    case 'APPROVED':
                        color = 'green';
                        break;
                    case 'PENDING':
                        color = 'orange';
                        break;
                    case 'REJECTED':
                        color = 'red';
                        break;
                    default:
                        color = 'blue';
                }
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text: number) => new Date(text).toLocaleString(),
        },
        {
            title: 'Ngày bắt đầu thuê',
            dataIndex: 'rental_start_date',
            key: 'rental_start_date',
            render: (text: number) => new Date(text).toLocaleString(),
        },
        {
            title: 'Ngày kết thúc thuê',
            dataIndex: 'rental_end_date',
            key: 'rental_end_date',
            render: (text: number) => new Date(text).toLocaleString(),
        },
        {
            title: 'Địa điểm lấy xe',
            dataIndex: 'vehicle_hand_over_location',
            key: 'vehicle_hand_over_location',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: IRentalData) => (
                <Typography.Link onClick={() => handleViewDetail(record)}>View detail</Typography.Link>
            ),
        },
    ];

    const handleViewDetail = (record: IRentalData) => {
        setModalRecord(record);
        showModal();
    };
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="p-4">
            <Typography.Title level={3}>Danh sách chuyến</Typography.Title>
            <Table
                className="w-full"
                columns={columns}
                dataSource={lessorListRequest?.data}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: Number(params.page) + 1,
                    pageSize: Number(params.size),
                    total: lessorListRequest?.meta.item_count,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                }}
                onChange={handleTableChange}
            />
            <Modal title="Chi tiết yêu cầu" open={isModalOpen} onOk={handleOk} width={860} onCancel={handleCancel} loading>
                <LesseeDetailDialog record={modalRecord} setIsModalOpen={setIsModalOpen} setParams={setParams} params={params}></LesseeDetailDialog>
            </Modal>
        </div>
    );
};

export default MyLessee;