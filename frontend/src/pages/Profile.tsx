import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Shield,
  Lock,
  Edit,
  Save,
  Camera,
  Loader2,
  Upload,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast
import { resolveAssetUrl } from "@/lib/config";

import {
  getProfileApi,
  updateProfileApi,
  uploadAvatarApi,
} from "@/services/api";
import ChangePasswordDialog from "@/components/profile/ChangePasswordDialog";

// 定义User类型
interface UserProfile {
  id: number;
  username: string;
  fullName: string;
  role: string;
  avatar: string;
  createTime: string;
  updateTime: string;
}

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProfileApi();
      if (response.data.code === 200) {
        setUserProfile(response.data.data);
      } else {
        toast({
          title: "获取个人信息失败",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "获取个人信息失败",
        description: "获取个人信息失败，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    if (!userProfile?.fullName) {
      toast({
        description: "真实姓名不能为空",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await updateProfileApi({
        fullName: userProfile.fullName,
      });
      if (response.data.code === 200) {
        toast({
          title: "信息保存成功",
          description: "个人信息已成功保存",
        });
        setIsEditing(false);
        fetchProfile(); // 重新获取数据以同步
      } else {
        toast({
          title: "保存失败",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "保存失败",
        description: "保存失败，请稍后重试",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        description: "请选择图片文件。",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        description: "请选择小于5MB的图片文件。",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadAvatarApi(formData);
      if (response.data.code === 200) {
        toast({
          title: "头像上传成功",
          description: "头像已成功上传",
        });
        fetchProfile(); // 上传成功后刷新整个用户信息
      } else {
        toast({
          title: "上传失败",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "上传失败",
        description: "上传失败，请稍后重试",
        variant: "destructive",
      });
    }
  };

  const getRoleDisplayName = (role: string) => {
    if (role === "ROLE_ADMIN") return "管理员";
    if (role === "ROLE_TEACHER") return "教师";
    return "未知角色";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!userProfile) {
    return <div className="text-center mt-10">无法加载用户信息。</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">个人资料</h1>
          <p className="text-gray-600 mt-2">管理您的个人信息和安全设置</p>
        </div>
        <Button onClick={isEditing ? handleSave : () => setIsEditing(true)}>
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              保存
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              编辑
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">基本信息</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>个人信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={resolveAssetUrl(userProfile.avatar)}
                      alt="用户头像"
                    />
                    <AvatarFallback>
                      {userProfile.fullName?.charAt(0) ||
                        userProfile.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      aria-label="上传头像"
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {userProfile.fullName}
                  </h3>
                  <p className="text-gray-600">@{userProfile.username}</p>
                  <Badge variant="secondary" className="mt-2">
                    <Shield className="h-3 w-3 mr-1" />
                    {userProfile.role === "ROLE_ADMIN" ? "管理员" : "教师"}
                  </Badge>
                  <div className="mt-3">
                    <label
                      htmlFor="avatar-file"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      点击头像或此处上传新头像
                    </label>
                    <input
                      id="avatar-file"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">真实姓名</Label>
                  <Input
                    id="fullName"
                    value={userProfile.fullName || ""}
                    onChange={(e) =>
                      setUserProfile((prev) =>
                        prev ? { ...prev, fullName: e.target.value } : null
                      )
                    }
                    disabled={!isEditing}
                    className={
                      !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    value={userProfile.username}
                    disabled
                    className="bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">角色</Label>
                  <Input
                    id="role"
                    value={getRoleDisplayName(userProfile.role)}
                    disabled
                    className="bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="createTime">加入时间</Label>
                  <Input
                    id="createTime"
                    value={new Date(
                      userProfile.createTime
                    ).toLocaleDateString()}
                    disabled
                    className="bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>
              {/* 统计信息 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">入职时间</p>
                  <p className="font-semibold">
                    {new Date(userProfile.createTime).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-gray-600">权限级别</p>
                  <p className="font-semibold">
                    {userProfile.role === "ROLE_ADMIN" ? "管理员" : "教师"}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <User className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm text-gray-600">上次更新</p>
                  <p className="font-semibold">
                    {new Date(userProfile.updateTime).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>安全设置</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">修改密码</h3>
                  <p className="text-sm text-gray-600">
                    定期更新密码以保护账户安全
                  </p>
                </div>
                <ChangePasswordDialog>
                  <Button variant="outline">
                    <Lock className="mr-2 h-4 w-4" /> 修改密码
                  </Button>
                </ChangePasswordDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
