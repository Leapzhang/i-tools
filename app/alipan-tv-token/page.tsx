"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Input, 
  Modal, 
  Button, 
  message, 
  Card, 
  Typography, 
  Space, 
  Row, 
  Col,
  Flex,
  Spin,
  Alert,
  App
} from "antd";
import {
  CopyOutlined,
  LoadingOutlined,
  LoginOutlined,
  ApiOutlined,
  SettingOutlined,
  BulbOutlined,
  BookOutlined
} from "@ant-design/icons";
import ClipboardJS from "clipboard";
import Head from "next/head";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

export default function AlipanTvToken() {
  const { message } = App.useApp();
  const [hasGenerated, setHasGenerated] = useState(false);
  const [authUrl, setAuthUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [hasRefreshToken, setHasRefreshToken] = useState(false);
  const [authorizing, setAuthorizing] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [currentSid, setCurrentSid] = useState("");

  const checkTimer = useRef<NodeJS.Timeout | null>(null);
  async function generateAuthUrl() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/alipan-tv-token/generate_qr", {
        method: "POST",
      });
      const data = await response.json();
      setCurrentSid(data.sid);
      setAuthUrl(`https://www.alipan.com/o/oauth/authorize?sid=${data.sid}`);
    } finally {
      setIsLoading(false);
    }
  }

  function closeNotice() {
    setIsNoticeOpen(false);
  }

  async function checkStatus(sid: string) {
    console.log("Checking status for SID:", sid);

    try {
      const response = await fetch(`/api/alipan-tv-token/check_status/${sid}`);
      const data = await response.json();
      if (data.status === "LoginSuccess") {
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
        const authSection = document.getElementById("authSection");
        if (authSection) {
          authSection.style.visibility = "hidden";
        }
        setHasAccessToken(!!data.access_token);
        setHasRefreshToken(!!data.refresh_token);
        setAuthorizing(false);
        message.success("登录成功");
        initializeClipboard();
      } else if (data.status === "ScanSuccess") {
        checkTimer.current = setTimeout(() => checkStatus(sid), 2000);
      } else if (data.status === "LoginFailed") {
        setAuthorizing(false);
        message.error("登录失败，请刷新页面重试");
      } else if (data.status === "QRCodeExpired") {
        setAuthorizing(false);
        message.error("链接过期，请刷新页面重试");
      } else {
        checkTimer.current = setTimeout(() => checkStatus(sid), 2000);
      }
    } catch (error) {
      console.error("检查状态时出错：", error);
      message.error("发生错误，请稍后重试");
    }
  }

  function initializeClipboard() {
    const accessTokenClipboard = new ClipboardJS(
      '[data-clipboard-target="#accessToken"]'
    );
    accessTokenClipboard.on("success", () => {
      message.success("已复制访问令牌");
    });
    accessTokenClipboard.on("error", () => {
      message.error("复制失败");
    });

    const refreshTokenClipboard = new ClipboardJS(
      '[data-clipboard-target="#refreshToken"]'
    );
    refreshTokenClipboard.on("success", () => {
      message.success("已复制刷新令牌");
    });
    refreshTokenClipboard.on("error", () => {
      message.error("复制失败");
    });
  }
  const handleAuth = (url: string) => {
    setAuthorizing(true);
    window.open(url, "_blank");

    // 重新启动状态检查
    if (currentSid) {
      // 清除之前的定时器
      if (checkTimer.current) {
        clearTimeout(checkTimer.current);
      }
      // 延迟一秒后开始检查状态，给用户一些时间进行授权
      checkTimer.current = setTimeout(() => checkStatus(currentSid), 1000);
    }
  };

  useEffect(() => {
    setIsNoticeOpen(true);
    if (!hasGenerated) {
      generateAuthUrl();
      setHasGenerated(true);
    }

    return () => {
      if (checkTimer.current) {
        clearTimeout(checkTimer.current);
      }
    };
  }, [hasGenerated]);  return (
    <>
      <Head>
        <title>阿里云盘TV授权 - Leap工具箱</title>
      </Head>
      
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* 页面标题 */}
        <Card>
          <Flex vertical align="center" gap="small">
            <Typography.Title level={1} className="gradient-text" style={{ margin: 0 }}>
              🎬 阿里云盘TV授权
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 16, textAlign: "center" }}>
              获取阿里云盘TV端的授权令牌，解锁高速下载
            </Typography.Text>
          </Flex>
        </Card>

        {/* 主功能区域 */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* 访问令牌 */}
              <Card 
                title={
                  <Space>
                    <CopyOutlined />
                    <span>访问令牌</span>
                  </Space>
                } 
                size="small"
                extra={
                  <Button
                    data-clipboard-target="#accessToken"
                    type="text"
                    icon={<CopyOutlined />}
                    disabled={!hasAccessToken}
                    size="small"
                  />
                }
              >
                <Input.TextArea
                  id="accessToken"
                  value={accessToken}
                  readOnly
                  rows={4}
                  placeholder="授权成功后，访问令牌将显示在这里..."
                />
              </Card>

              {/* 刷新令牌 */}
              <Card 
                title={
                  <Space>
                    <span>🔄</span>
                    <span>刷新令牌</span>
                  </Space>
                } 
                size="small"
                extra={
                  <Button
                    data-clipboard-target="#refreshToken"
                    type="text"
                    icon={<CopyOutlined />}
                    disabled={!hasRefreshToken}
                    size="small"
                  />
                }
              >
                <Input.TextArea
                  id="refreshToken"
                  value={refreshToken}
                  readOnly
                  rows={3}
                  placeholder="刷新令牌将显示在这里..."
                />
              </Card>
            </Space>
          </Col>

          <Col xs={24} lg={12}>
            {/* 授权操作 */}
            <Card 
              title={
                <Space>
                  <LoginOutlined />
                  <span>授权操作</span>
                </Space>
              }
            >
              <div id="authSection">
                {isLoading ? (
                  <Flex vertical align="center" gap="middle">
                    <Spin size="large" />
                    <Typography.Text type="secondary">
                      正在获取授权链接...
                    </Typography.Text>
                  </Flex>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={() => handleAuth(authUrl)}
                    disabled={authorizing}
                    icon={authorizing ? <LoadingOutlined /> : <LoginOutlined />}
                  >
                    {authorizing ? "授权中..." : "开始授权登录"}
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* 使用说明 */}
        <Card 
          title={
            <Space>
              <BookOutlined />
              <span>使用说明</span>
            </Space>
          }
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card 
                  title={
                    <Space>
                      <ApiOutlined />
                      <span>API路由</span>
                    </Space>
                  } 
                  size="small"
                >
                  <Typography.Paragraph>
                    <Typography.Text code>/api/oauth/alipan/token</Typography.Text>
                    <br />
                    刷新令牌接口
                  </Typography.Paragraph>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card 
                  title={
                    <Space>
                      <SettingOutlined />
                      <span>Alist 配置</span>
                    </Space>
                  } 
                  size="small"
                >
                  <Space direction="vertical" size="small" style={{ width: "100%" }}>
                    <Typography.Paragraph>
                      <Typography.Text strong>Oauth令牌链接：</Typography.Text>
                      <br />
                      <Typography.Text code>
                        http://alipan-tv-token:3000/api/oauth/alipan/token
                      </Typography.Text>
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                      <Typography.Text strong>获取令牌访问：</Typography.Text>
                      <br />
                      <Typography.Text code>
                        http://你的IP:3000/alipan-tv-token
                      </Typography.Text>
                    </Typography.Paragraph>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card 
                  title={
                    <Space>
                      <BulbOutlined />
                      <span>温馨提示</span>
                    </Space>
                  } 
                  size="small"
                >
                  <Alert
                    message="TV接口能绕过三方应用权益包的速率限制，但需要SVIP会员才能享受高速下载。"
                    type="warning"
                    showIcon
                  />
                </Card>
              </Col>
            </Row>
          </Space>
        </Card>
      </Space>

      <Modal
        open={isNoticeOpen}
        title="使用说明"
        onOk={closeNotice}
        maskClosable={false}
        closable={false}
        keyboard={false}
        footer={[
          <Button
            key="member"
            type="primary"
            danger
            href="https://www.alipan.com/cpx/member?userCode=MjAyNTk2"
            target="_blank"
          >
            开通会员
          </Button>,
          <Button key="ok" type="primary" onClick={closeNotice}>
            我知道了
          </Button>,
        ]}
      >
        <Typography.Paragraph>
          本工具能帮助你一键获取「阿里云盘TV版」的刷新令牌，完全免费。TV接口能绕过三方应用权益包的速率限制，但前提你得是SVIP。
        </Typography.Paragraph>
      </Modal>
    </>
  );
}
