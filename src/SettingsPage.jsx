import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Card,
    Avatar,
    Tabs,
    Form,
    Input,
    Button,
    Upload,
    message,
    Select,
    Divider,
    Switch,
    Space,
    Row,
    Col
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    LockOutlined,
    UploadOutlined,
    BellOutlined,
    SafetyOutlined,
    GlobalOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;

const SettingsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.userType === 'admin' || user?.role === 'admin';
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Pre-fill form with user data
        if (user) {
            profileForm.setFieldsValue({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                state: user.state || '',
            });
        }
    }, [user, profileForm]);

    const handleProfileUpdate = (values) => {
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            message.success('Profile updated successfully');
        }, 1000);
    };

    const handlePasswordUpdate = (values) => {
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            message.success('Password updated successfully');
            passwordForm.resetFields();
        }, 1000);
    };

    return (
        <div className="settings-page">
            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    <Card>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Avatar
                                size={100}
                                icon={<UserOutlined />}
                                src={user?.avatar}
                                style={{ backgroundColor: isAdmin ? '#722ed1' : '#1677ff' }}
                            />
                            <h2 style={{ marginTop: 16, marginBottom: 4 }}>{user?.name || 'User'}</h2>
                            <p style={{ color: '#666' }}>{isAdmin ? 'Administrator' : 'Salesman'}</p>

                            <Upload>
                                <Button icon={<UploadOutlined />}>Change Avatar</Button>
                            </Upload>
                        </div>

                        <Divider />

                        <div>
                            <p><UserOutlined /> {user?.username || 'username'}</p>
                            <p><MailOutlined /> {user?.email || 'email@example.com'}</p>
                            <p><PhoneOutlined /> {user?.phone || 'Not provided'}</p>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={16}>
                    <Card>
                        <Tabs defaultActiveKey="profile">
                            <TabPane tab="Profile Information" key="profile">
                                <Form
                                    form={profileForm}
                                    layout="vertical"
                                    onFinish={handleProfileUpdate}
                                >
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="name"
                                                label="Full Name"
                                                rules={[{ required: true, message: 'Please enter your name' }]}
                                            >
                                                <Input prefix={<UserOutlined />} placeholder="Full Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="email"
                                                label="Email"
                                                rules={[
                                                    { required: true, message: 'Please enter your email' },
                                                    { type: 'email', message: 'Please enter a valid email' }
                                                ]}
                                            >
                                                <Input prefix={<MailOutlined />} placeholder="Email" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="phone"
                                                label="Phone Number"
                                            >
                                                <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="address"
                                                label="Address"
                                            >
                                                <Input placeholder="Address" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="city"
                                                label="City"
                                            >
                                                <Input placeholder="City" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="state"
                                                label="State"
                                            >
                                                <Select placeholder="Select state">
                                                    <Option value="delhi">Delhi</Option>
                                                    <Option value="mumbai">Mumbai</Option>
                                                    <Option value="bangalore">Bangalore</Option>
                                                    <Option value="chennai">Chennai</Option>
                                                    <Option value="hyderabad">Hyderabad</Option>
                                                    <Option value="kolkata">Kolkata</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                        >
                                            Update Profile
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>

                            <TabPane tab="Change Password" key="password">
                                <Form
                                    form={passwordForm}
                                    layout="vertical"
                                    onFinish={handlePasswordUpdate}
                                >
                                    <Form.Item
                                        name="currentPassword"
                                        label="Current Password"
                                        rules={[{ required: true, message: 'Please enter your current password' }]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder="Current Password" />
                                    </Form.Item>

                                    <Form.Item
                                        name="newPassword"
                                        label="New Password"
                                        rules={[
                                            { required: true, message: 'Please enter your new password' },
                                            { min: 8, message: 'Password must be at least 8 characters' }
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
                                    </Form.Item>

                                    <Form.Item
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        dependencies={['newPassword']}
                                        rules={[
                                            { required: true, message: 'Please confirm your password' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('newPassword') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('The passwords do not match'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                        >
                                            Update Password
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>

                            <TabPane tab="Notifications" key="notifications">
                                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                    <div>
                                        <Space style={{ marginBottom: 8 }}>
                                            <BellOutlined />
                                            <span style={{ fontWeight: 'bold' }}>Email Notifications</span>
                                        </Space>
                                        <div style={{ marginLeft: 24 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                                <span>Property Updates</span>
                                                <Switch defaultChecked />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                                <span>New Inquiries</span>
                                                <Switch defaultChecked />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                                <span>Administrative Announcements</span>
                                                <Switch defaultChecked />
                                            </div>
                                        </div>
                                    </div>

                                    <Divider />

                                    <div>
                                        <Space style={{ marginBottom: 8 }}>
                                            <BellOutlined />
                                            <span style={{ fontWeight: 'bold' }}>SMS Notifications</span>
                                        </Space>
                                        <div style={{ marginLeft: 24 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                                <span>Property Updates</span>
                                                <Switch />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                                <span>New Inquiries</span>
                                                <Switch defaultChecked />
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="primary" style={{ marginTop: 16 }}>
                                        Save Notification Settings
                                    </Button>
                                </Space>
                            </TabPane>

                            {isAdmin && (
                                <TabPane tab="Security" key="security">
                                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                        <div>
                                            <Space style={{ marginBottom: 8 }}>
                                                <SafetyOutlined />
                                                <span style={{ fontWeight: 'bold' }}>Two-Factor Authentication</span>
                                            </Space>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, padding: '8px 16px', background: '#f5f5f5', borderRadius: 4 }}>
                                                <span>Enable Two-Factor Authentication</span>
                                                <Switch />
                                            </div>
                                        </div>

                                        <Divider />

                                        <div>
                                            <Space style={{ marginBottom: 8 }}>
                                                <GlobalOutlined />
                                                <span style={{ fontWeight: 'bold' }}>Login Sessions</span>
                                            </Space>
                                            <div style={{ padding: '8px 16px', background: '#f5f5f5', borderRadius: 4, marginBottom: 16 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 'bold' }}>Current Session</div>
                                                        <div style={{ fontSize: 12, color: '#666' }}>Web Browser • New Delhi, India</div>
                                                    </div>
                                                    <div style={{ color: 'green' }}>Active</div>
                                                </div>
                                            </div>

                                            <Button danger>Sign Out All Other Sessions</Button>
                                        </div>
                                    </Space>
                                </TabPane>
                            )}
                        </Tabs>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SettingsPage;