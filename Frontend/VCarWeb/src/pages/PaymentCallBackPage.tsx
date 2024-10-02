import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../apis/axios';
import { message } from 'antd';

const PaymentCallBackPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const url = window.location.href;
        const [, queryString] = url.split('?');

        async function confirmPayment() {
            try {
                message.success('Thanh toán thành công');
                await axiosPrivate.post(`/rental-contracts/payment-callback?${queryString}`);
            } catch (error) {
                message.error('Thanh toán thất bại');
                console.log(error);
            }
        }
        if (queryString) {
            confirmPayment();
        }

        navigate('/');
    }, [navigate]);

    return null;
};

export default PaymentCallBackPage;