import { Empty } from "antd";

const FavoriteCars = () => {
    return (
        <div>
            <Empty description="Không có xe yêu thích" image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
        </div>
    );
};

export default FavoriteCars;