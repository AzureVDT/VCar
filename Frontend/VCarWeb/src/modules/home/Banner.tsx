import { Image } from "antd";

const Banner = () => {
    return (
        <div className="flex items-center justify-center gap-x-[32px]">
            <Image
                src="/banner-1.jpg"
                alt="banner"
                preview={false}
                width={640}
                height={360}
            ></Image>
            <Image
                src="/banner-2.jpg"
                alt="banner"
                preview={false}
                width={640}
                height={360}
            ></Image>
        </div>
    );
};

export default Banner;