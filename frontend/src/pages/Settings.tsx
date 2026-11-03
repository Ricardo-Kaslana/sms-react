import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Settings as SettingsIcon,
  Database,
  Shield,
  Palette,
  Globe,
  Server,
  Bell,
  Users,
  BookOpen,
  Clock,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [systemSettings, setSystemSettings] = useState({
    schoolName: '山东理工大学',
    academicYear: '2024-2025',
    semester: '第二学期',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN',
    dateFormat: 'YYYY-MM-DD',
    autoBackup: true,
    maintenanceMode: false,
    registrationOpen: true,
    maxStudentsPerClass: 45,
    gradingSystem: 'percentage'
  });

  const [selectedTheme, setSelectedTheme] = useState('blue');

  const themeColors = [
    { name: 'blue', color: 'bg-blue-600', hsl: '217 91% 60%' },
    { name: 'green', color: 'bg-green-600', hsl: '142 76% 36%' },
    { name: 'purple', color: 'bg-purple-600', hsl: '262 83% 58%' },
    { name: 'red', color: 'bg-red-600', hsl: '0 84% 60%' }
  ];

  const handleThemeChange = (themeName: string, themeHsl: string) => {
    setSelectedTheme(themeName);

    // 更新 CSS 变量
    const root = document.documentElement;
    root.style.setProperty('--primary', themeHsl);
    root.style.setProperty('--accent', themeHsl);

    toast({
      title: "主题已更改",
      description: `已切换到${themeName === 'blue' ? '蓝色' : themeName === 'green' ? '绿色' : themeName === 'purple' ? '紫色' : '红色'}主题。`,
    });
  };

  const handleSave = () => {
    toast({
      title: "设置已保存",
      description: "系统配置已成功更新。",
    });
  };

  const handleBackup = () => {
    toast({
      title: "备份已开始",
      description: "系统正在创建数据备份，请稍候...",
    });
  };

  const handleRestore = () => {
    toast({
      title: "还原已开始",
      description: "系统正在还原数据，请稍候...",
    });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">系统设置</h1>
          <p className="text-gray-600 mt-2">管理系统配置和偏好设置</p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          保存设置
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">基本设置</TabsTrigger>
          <TabsTrigger value="academic">学术设置</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
          <TabsTrigger value="backup">备份管理</TabsTrigger>
          <TabsTrigger value="appearance">外观设置</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">学校名称</Label>
                  <Input
                    id="schoolName"
                    value={systemSettings.schoolName}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, schoolName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">时区</Label>
                  <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Shanghai">Asia/Shanghai</SelectItem>
                      <SelectItem value="Asia/Beijing">Asia/Beijing</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">系统语言</Label>
                  <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh-CN">简体中文</SelectItem>
                      <SelectItem value="en-US">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">日期格式</Label>
                  <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, dateFormat: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  系统状态
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">维护模式</h3>
                    <p className="text-sm text-gray-600">启用时用户无法访问系统</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">注册开放</h3>
                    <p className="text-sm text-gray-600">允许新用户注册</p>
                  </div>
                  <Switch
                    checked={systemSettings.registrationOpen}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, registrationOpen: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">自动备份</h3>
                    <p className="text-sm text-gray-600">每日自动备份数据</p>
                  </div>
                  <Switch
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoBackup: checked }))}
                  />
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">系统版本</span>
                    <Badge variant="secondary">v2.1.0</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">数据库版本</span>
                    <Badge variant="secondary">MySQL 8.0</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">上次更新</span>
                    <span className="text-sm text-gray-600">2025-7-07</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                学术配置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="academicYear">学年</Label>
                  <Input
                    id="academicYear"
                    value={systemSettings.academicYear}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, academicYear: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">学期</Label>
                  <Select value={systemSettings.semester} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, semester: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="第一学期">第一学期</SelectItem>
                      <SelectItem value="第二学期">第二学期</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStudents">班级最大人数</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={systemSettings.maxStudentsPerClass}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, maxStudentsPerClass: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradingSystem">评分系统</Label>
                  <Select value={systemSettings.gradingSystem} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, gradingSystem: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">百分制</SelectItem>
                      <SelectItem value="letter">字母等级</SelectItem>
                      <SelectItem value="gpa">GPA制</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                安全配置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">密码策略</h3>
                  <div className="space-y-2">
                    <Label htmlFor="minPassword">最小密码长度</Label>
                    <Input id="minPassword" type="number" defaultValue="8" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireSpecial">要求特殊字符</Label>
                    <Switch id="requireSpecial" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireNumber">要求数字</Label>
                    <Switch id="requireNumber" defaultChecked />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">会话管理</h3>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">会话超时时间（分钟）</Label>
                    <Input id="sessionTimeout" type="number" defaultValue="30" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="forceTwoFA">强制双因素认证</Label>
                    <Switch id="forceTwoFA" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="loginAttempts">登录失败锁定</Label>
                    <Switch id="loginAttempts" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                备份管理
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">数据备份</h3>
                  <div className="space-y-3">
                    <Button onClick={handleBackup} className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      创建备份
                    </Button>
                    <Button onClick={handleRestore} className="w-full" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      还原备份
                    </Button>
                    <Button className="w-full" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      验证备份完整性
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">备份历史</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">2024-12-01 02:00</p>
                        <p className="text-sm text-gray-600">自动备份</p>
                      </div>
                      <Badge variant="secondary">125MB</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">2024-11-30 02:00</p>
                        <p className="text-sm text-gray-600">自动备份</p>
                      </div>
                      <Badge variant="secondary">123MB</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">2024-11-29 02:00</p>
                        <p className="text-sm text-gray-600">自动备份</p>
                      </div>
                      <Badge variant="secondary">121MB</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                外观设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">主题设置</h3>
                  <div className="space-y-2">
                    <Label>主题颜色</Label>
                    <div className="flex gap-2">
                      {themeColors.map((theme) => (
                        <button
                          key={theme.name}
                          onClick={() => handleThemeChange(theme.name, theme.hsl)}
                          className={`w-8 h-8 rounded-full ${theme.color} transition-all hover:scale-110 ${
                            selectedTheme === theme.name
                              ? 'ring-2 ring-gray-800 ring-offset-2'
                              : 'border border-gray-300'
                          }`}
                          title={`切换到${theme.name === 'blue' ? '蓝色' : theme.name === 'green' ? '绿色' : theme.name === 'purple' ? '紫色' : '红色'}主题`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="darkMode">深色模式</Label>
                    <Switch id="darkMode" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compactMode">紧凑模式</Label>
                    <Switch id="compactMode" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">布局设置</h3>
                  <div className="space-y-2">
                    <Label>侧边栏位置</Label>
                    <Select defaultValue="left">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">左侧</SelectItem>
                        <SelectItem value="right">右侧</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sidebarCollapsed">默认收起侧边栏</Label>
                    <Switch id="sidebarCollapsed" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
