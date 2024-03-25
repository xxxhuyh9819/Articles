import { useDispatch, useSelector } from "react-redux";
import { Layout, Menu, Popconfirm } from "antd";
import {
    HomeOutlined,
    EditOutlined,
    LogoutOutlined,
    UserOutlined
} from "@ant-design/icons";
import "../styles/AppLayout.css";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {clearLoginCredentials} from "../store/modules/user";

const { Header, Sider } = Layout;

const items = [
    {
        label: "Home",
        key: "/",
        icon: <HomeOutlined />,
    },
    {
        label: "New Article",
        key: "/publish",
        icon: <EditOutlined />,
    },
];

const AppLayout = () => {
    const navigate = useNavigate();
    const {userInfo} = useSelector(state => state.user)

    const location = useLocation();
    const selectedKey = location.pathname;

    const dispatch = useDispatch();

    function onLogout() {
        dispatch(clearLoginCredentials());
        alert("Logged out successfully!");
        navigate("/login");
    }

    function onMenuClick(route) {
        navigate(route.key);
    }

    return (
        <Layout>
            <Header className="header">
                <div className="logo" onClick={() => navigate("/")}>
                    ARTICLES
                </div>
                <div className="user-info">
                    <span className="user-name" onClick={() => navigate(`/profile/${userInfo.user_name}`)}>
                        <UserOutlined />
                        {userInfo.user_name}
                    </span>
                    <span className="user-logout">
                        <Popconfirm
                            title="Are you sure to exit?"
                            okText="Exit"
                            cancelText="Cancel"
                            onConfirm={onLogout}
                        >
                          <LogoutOutlined/> Exit
                        </Popconfirm>
                    </span>
                </div>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        theme="dark"
                        selectedKeys={selectedKey}
                        items={items}
                        onClick={onMenuClick}
                        style={{ height: "100%", borderRight: 0 }}
                    ></Menu>
                </Sider>
                <Layout className="layout-content" style={{ padding: 20 }}>
                    {/** 2nd route outlet */}
                    <Outlet />
                </Layout>
            </Layout>
        </Layout>
    );
};
export default AppLayout;
