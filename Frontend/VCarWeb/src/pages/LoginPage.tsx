import { useTranslation } from "react-i18next";
import { Button, Form, FormProps, Input, Typography } from "antd";
import LayoutAuthentication from "../layouts/LayoutAuthentication";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAccessToken, saveUserInfoToCookie } from "../utils";
import { login } from "../store/auth/handlers";
import { AxiosResponse } from "axios";
import { IUser } from "../store/auth/types";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { axiosPrivate } from "../apis/axios";
import { useAuth } from "../contexts/auth-context";
import { ENDPOINTS } from "../store/profile/models";
type FieldType = {
  email: string;
  password: string;
};


interface IMeResponse {
  code: number;
  message: string;
  data: IUser;
}

const LoginPage = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);
  const { setIsLogged } = useAuth();
  const accessToken = getAccessToken();

  const onFinish = async (values: FieldType) => {
    const res = await login(values.email, values.password);
    if (res?.success) {
      const meResponse: AxiosResponse<IMeResponse> =
        await axiosPrivate.get(ENDPOINTS.GET_ME);
      if (meResponse.data.code === 200) {
        saveUserInfoToCookie(meResponse.data.data, res?.token ?? "");
      }
      toast.success(t("loginSuccess"));
      setIsLogged(true);
      navigate("/");
    } else {
      toast.error(t("loginFailed"));
    }
  };

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate])

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <LayoutAuthentication>
      <Form
        form={form}
        name="login-form"
        layout="vertical"
        labelCol={{ span: 16 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="bg-lite w-full max-w-[400px] p-4 rounded-lg shadow-md mx-auto"
      >
        <Typography.Title
          level={3}
          style={{
            textAlign: "center",
          }}
        >
          {t("login")}
        </Typography.Title>
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: t("require"),
            },
            {
              type: "email",
              message: t("emailInvalid"),
            },
          ]}
        >
          <Input placeholder={t("emailPlaceholder")} />
        </Form.Item>
        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: t("require"),
            },
            {
              min: 8,
              message: t("passwordInvalid"),
            },
          ]}
        >
          <Input.Password placeholder={t("passwordPlaceholder")} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            iconPosition={"end"}
          >
            {t("login")}
          </Button>
        </Form.Item>
        <Typography.Paragraph
          style={{
            textAlign: "center",
          }}
        >
          {t("dontHaveAccount")}{" "}
          <Button type="link" href="/signup">
            {t("signUp")}
          </Button>
        </Typography.Paragraph>
      </Form>
    </LayoutAuthentication>
  );
};

export default LoginPage;
