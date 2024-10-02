import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useMemo, useState } from "react";
import { IContractData, IContractParams } from "../../store/rental/types";
import { GET_LESSOR_CONTRACTS } from "../../store/rental/action";
import { Modal, Table, TablePaginationConfig, Tag, Typography } from "antd";
import { formatPrice } from "../../utils";
import LessorContractModal from "../../components/modals/LessorContractModal";

const LessorContract = () => {
    const dispatch = useDispatch();
    const { lessorListContract, loading } = useSelector((state: RootState) => state.rental);
    const [modalRecord, setModalRecord] = useState<IContractData>({} as IContractData);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [params, setParams] = useState<IContractParams>({
        sortDescending: "",
        page: "0",
        size: "10",
    });

    useMemo(() => {
        dispatch({ type: GET_LESSOR_CONTRACTS, payload: params });
    }, [dispatch, params]);
    const handleTableChange = (
        pagination: TablePaginationConfig,
    ) => {
        setParams({
            ...params,
            page: String((pagination.current ?? 1) - 1),
            size: String(pagination.pageSize ?? 10),
        });
    };

    const columns = [
        {
            title: 'ID',
            key: 'id',
            render: (_text: string, _record: IContractData, index: number) => index + 1,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'rental_status',
            key: 'rental_status',
            render: (status: string) => {
                let color = '';
                switch (status) {
                    case 'SIGNED':
                        color = 'green';
                        break;
                    case 'PENDING':
                        color = 'orange';
                        break;
                    case 'CANCELED':
                        color = 'red';
                        break;
                    default:
                        color = 'blue';
                        break;
                }
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Ngày tạo hợp đồng',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text: number) => new Date(text).toLocaleString(),
        },
        {
            title: 'Biển số xe',
            dataIndex: 'vehicle_license_plate',
            key: 'vehicle_license_plate',
        },
        {
            title: 'Tổng tiền thuê',
            dataIndex: 'total_rental_value',
            key: 'total_rental_value',
            render: (value: number) => formatPrice(value) + ' VND',
        },
        {
            title: 'Địa điểm nhận xe',
            dataIndex: 'vehicle_hand_over_location',
            key: 'vehicle_hand_over_location',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_text: string, record: IContractData) => (
                <Typography.Link onClick={() => handleViewDetail(record)}>View detail</Typography.Link>
            ),
        },
    ];

    const handleViewDetail = (record: IContractData) => {
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
            <Typography.Title level={3}>Danh sách hợp đồng</Typography.Title>
            <Table
                className="w-full"
                columns={columns}
                dataSource={lessorListContract?.data}
                loading={loading}
                rowKey="id"
                pagination={{
                    pageSize: Number(params.size),
                    current: Number(params.page) + 1,
                    total: lessorListContract?.meta.item_count,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                }}
                onChange={handleTableChange}
            />
            <Modal title="Chi tiết hợp đồng" open={isModalOpen} onOk={handleOk} width={860} onCancel={handleCancel}>
                <LessorContractModal record={modalRecord}></LessorContractModal>
            </Modal>
        </div>
    );
};

export default LessorContract;