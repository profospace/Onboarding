import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    HomeOutlined,
    SettingOutlined,
    LogoutOutlined,
    TeamOutlined,
    ShopOutlined,
    PlusOutlined,
    AppstoreOutlined,
    DashboardOutlined,
    BankOutlined,
    BellOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import {
    Layout,
    Menu,
    theme,
    Button,
    Avatar,
    Dropdown,
    Space,
    Divider,
    Badge,
    Typography,
    Input,
    Drawer,
    ConfigProvider
} from 'antd';
import { logout } from '../../../redux/features/auth/authSlice';
import { SiGoogleadsense } from "react-icons/si";
const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;
const { Search } = Input;

const AppLayout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    // console.log("user", user)

    const [collapsed, setCollapsed] = useState(false);
    const [mobileView, setMobileView] = useState(window.innerWidth < 768);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [themeMode, setThemeMode] = useState('light');

    // Check if the user is an admin
    const isAdmin = user?.userType === 'admin' || user?.role === 'admin';

    const {
        token: { colorBgContainer, borderRadiusLG, colorPrimary },
    } = theme.useToken();

    // Handle window resize for responsive design
    useEffect(() => {
        const handleResize = () => {
            setMobileView(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setMobileDrawerOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle logout
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Get current selected menu item based on path
    const getSelectedKeys = () => {
        const path = location.pathname;
        if (path === '/dashboard') return ['dashboard'];
        if (path === '/property-management') return ['properties'];
        if (path === '/onboarding') return ['add-property'];
        if (path === '/salesman-management') return ['salesmen'];
        if (path === '/settings') return ['settings'];
        if (path === '/sales-leads') return ['sales-leads'];
        if (path === '/sales-commercial-leads') return ['sales-commercial-leads'];
        if (path === '/leads') return ['leads'];
        if (path === '/location-dashboard') return ['location-dashboard'];
        if (path === `/leads-map-new/${user?._id}`) return ['leads-map-new'];
        return ['dashboard'];
    };

    // Admin menu items
    const adminMenuItems = [
        // {
        //     key: 'dashboard',
        //     icon: <DashboardOutlined />,
        //     label: <Link to="/dashboard">Dashboard</Link>,
        // },
        {
            key: 'salesmen',
            icon: <TeamOutlined />,
            label: <Link to="/salesman-management">Salesmen Management</Link>,
        },
        {
            key: 'properties',
            icon: <BankOutlined />,
            label: <Link to="/property-management">Properties Manage</Link>,
        },
        {
            key: 'leads',
            icon: <SiGoogleadsense />,
            label: <Link to="/leads">All Leads</Link>,
        },
        {
            key: 'sales-leads',
            icon: <SiGoogleadsense />,
            label: <Link to="/sales-leads">Create Leads</Link>,
        },
        {
            key: 'commercial-leads',
            icon: <SiGoogleadsense color='crimson' />,
            label: <Link to="/commercial-leads">All Commercial Leads</Link>,
        },
        {
            key: 'sales-commercial-leads',
            icon: <SiGoogleadsense color='crimson' />,
            label: <Link to="/sales-commercial-leads">Create Commercial Leads</Link>,
        },
        {
            key: 'web-leads',
            icon: <SiGoogleadsense color='blue' />,
            label: <Link to="/web-leads">Web Leads</Link>,
        },
        {
            key: 'add-property',
            icon: <PlusOutlined />,
            label: <Link to="/onboarding">Add Property</Link>,
        },
        {
            key: 'draft',
            icon: <BankOutlined />,
            label: <Link to="/draft">Your Drafts</Link>,
        },
        {
            key: 'users',
            icon: <BankOutlined />,
            label: <Link to="/users-management">Users Management</Link>,
        },
        {
            key: 'location-dashboard',
            icon: <BankOutlined />,
            label: <Link to="/location-dashboard">Location Tracking</Link>,
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: <Link to="/settings">Settings</Link>,
        },

    ];

    // Salesman menu items
    const salesmanMenuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/dashboard">Dashboard</Link>,
        },
        // {
        //     key: 'properties',
        //     icon: <BankOutlined />,
        //     label: <Link to="/property-management">My Properties</Link>,
        // },
        {
            key: 'add-property',
            icon: <PlusOutlined />,
            label: <Link to="/onboarding">Add Property</Link>,
        },
        {
            key: 'leads',
            icon: <SiGoogleadsense />,
            label: <Link to="/leads">All Leads</Link>,
        },
        {
            key: 'sales-leads',
            icon: <SiGoogleadsense />,
            label: <Link to="/sales-leads">Create Leads</Link>,
        },
        {
            key: 'commercial-leads',
            icon: <SiGoogleadsense color='crimson'/>,
            label: <Link to="/commercial-leads">All Commercial Leads</Link>,
        },
        {
            key: 'sales-commercial-leads',
            icon: <SiGoogleadsense color='crimson'/>,
            label: <Link to="/sales-commercial-leads">Create Commercial Leads</Link>,
        },
        {
            key: 'web-leads',
            icon: <SiGoogleadsense color='blue' />,
            label: <Link to="/web-leads">Web Leads</Link>,
        },
        {
            key: 'leads-map-new',
            icon: <SiGoogleadsense />,
            label: <Link to={`/leads-map-new/${user?._id}`}>My Leads Map</Link>,
        },

        {
            key: 'draft',
            icon: <BankOutlined />,
            label: <Link to="/draft">Your Drafts</Link>,
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: <Link to="/settings">Account Settings</Link>,
        },
    ];

    // Profile dropdown items
    const profileMenuItems = [
        {
            key: 'profile',
            label: 'View Profile',
            icon: <UserOutlined />,
            onClick: () => navigate('/settings'),
        },
        {
            key: 'divider',
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
            danger: true,
        },
    ];

    // Toggle theme
    const toggleTheme = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#1677FF',
                },
            }}
        >
            <Layout style={{ minHeight: '100vh' }} >
                {/* Desktop Sidebar */}
                {!mobileView && (
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={collapsed}
                        width={220}
                        theme={themeMode}
                        style={{
                            overflow: 'auto',
                            height: '100vh',
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            zIndex: 10,
                        }}
                    >
                        <div className="logo" style={{
                            height: '64px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            padding: collapsed ? '0' : '0 16px',
                            color: '#000',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            overflow: 'hidden',
                        }}>
                            {collapsed ?
                                <img src='/assets/logo.png' className='w-12 h-12'/> :
                                <>
                                    <h1 className='text-5xl text-[crimson] font-bold' >PROFO</h1>
                                </>
                            }
                        </div>
                        <Menu
                            theme={themeMode}
                            mode="inline"
                            selectedKeys={getSelectedKeys()}
                            items={isAdmin ? adminMenuItems : salesmanMenuItems}
                        />
                        {!collapsed && (
                            <div style={{
                                padding: '16px',
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                background: themeMode === 'dark' ? '#001529' : '#fff',
                            }}>
                                <Button
                                    type="text"
                                    icon={themeMode === 'dark' ? <span role="img" aria-label="light mode">🌞</span> : <span role="img" aria-label="dark mode">🌙</span>}
                                    onClick={toggleTheme}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        color: themeMode === 'dark' ? '#fff' : '#000',
                                    }}
                                >
                                    {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                </Button>
                            </div>
                        )}
                    </Sider>
                )}

                {/* Mobile Drawer */}
                <Drawer
                    title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <HomeOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
                            <span>RealEstate App</span>
                        </div>
                    }
                    placement="left"
                    onClose={() => setMobileDrawerOpen(false)}
                    open={mobileDrawerOpen}
                    width={256}
                    bodyStyle={{ padding: 0 }}
                >
                    <Menu
                        theme={themeMode}
                        mode="inline"
                        selectedKeys={getSelectedKeys()}
                        items={isAdmin ? adminMenuItems : salesmanMenuItems}
                        onClick={() => setMobileDrawerOpen(false)}
                    />
                    <div style={{
                        padding: '16px',
                        borderTop: '1px solid #f0f0f0',
                    }}>
                        <Button
                            type="text"
                            icon={themeMode === 'dark' ? <span role="img" aria-label="light mode">🌞</span> : <span role="img" aria-label="dark mode">🌙</span>}
                            onClick={toggleTheme}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                            }}
                        >
                            {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </Button>
                    </div>
                </Drawer>

                <Layout style={{
                    marginLeft: mobileView ? 0 : collapsed ? 80 : 219,
                    transition: 'all 0.2s',
                }}>
                    <Header
                        style={{
                            padding: 0,
                            background: colorBgContainer,
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {mobileView ? (
                                <Button
                                    type="text"
                                    icon={<MenuUnfoldOutlined />}
                                    onClick={() => setMobileDrawerOpen(true)}
                                    style={{ fontSize: '16px', width: 64, height: 64 }}
                                />
                            ) : (
                                <Button
                                    type="text"
                                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                    onClick={() => setCollapsed(!collapsed)}
                                    style={{ fontSize: '16px', width: 64, height: 64 }}
                                />
                            )}

                            {/* <div className="search-container" style={{ marginLeft: 16, display: mobileView ? 'none' : 'block' }}>
                                <Search
                                    placeholder="Search..."
                                    allowClear
                                    size="middle"
                                    style={{ width: 250 }}
                                    prefix={<SearchOutlined />}
                                />
                            </div> */}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 16 }}>
                            <Badge count={5} style={{ marginRight: 24 }}>
                                <Button
                                    type="text"
                                    icon={<BellOutlined style={{ fontSize: 18 }} />}
                                    style={{ width: 40, height: 40 }}
                                />
                            </Badge>

                            <Dropdown
                                menu={{ items: profileMenuItems }}
                                trigger={['click']}
                                placement="bottomRight"
                            >
                                <Space>
                                    <Avatar
                                        style={{
                                            backgroundColor: isAdmin ? '#722ed1' : '#1677ff',
                                            cursor: 'pointer'
                                        }}
                                        icon={<UserOutlined />}
                                    />
                                    {!mobileView && (
                                        <div style={{ maxWidth: 120, overflow: 'hidden' , alignItems:"center" }}>
                                            <Text strong style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {user?.name || 'User'}
                                            </Text>
                                            {/* <Text type="secondary" style={{ fontSize: 12 }}>
                                                {isAdmin ? 'Administrator' : 'Salesman'}
                                            </Text> */}
                                        </div>
                                    )}
                                </Space>
                            </Dropdown>
                        </div>
                    </Header>

                    <Content
                        style={{
                            // margin: '24px 16px',
                            // padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            // borderRadius: borderRadiusLG,
                            overflow: 'auto',
                        }}
                    >
                        {children}
                    </Content>

                    {/* <Footer style={{ textAlign: 'center', padding: '12px 50px' }}>
                        Real Estate Property Management ©{new Date().getFullYear()} Created by Your Company
                    </Footer> */}
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default AppLayout;