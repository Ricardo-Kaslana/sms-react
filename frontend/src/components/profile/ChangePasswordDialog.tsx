import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePasswordApi } from "@/services/api";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast

const ChangePasswordDialog = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleSubmit = async () => {
    if (!formData.oldPassword || !formData.newPassword) {
      toast({
        description: "旧密码和新密码都不能为空",
        variant: "destructive",
      });
      return;
    }
    if (formData.newPassword.length < 6) {
      toast({
        description: "新密码长度不能少于6位",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await updatePasswordApi(formData);
      if (response.data.code === 200) {
        toast({
          title: "密码修改成功",
          description: "密码修改成功，建议您重新登录。",
        });
        setIsOpen(false);
      } else {
        toast({
          title: "密码修改失败",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const message = (
        error as { response?: { data?: { message?: string } } }
      ).response?.data?.message;
      if (message) {
        toast({
          title: "密码修改失败",
          description: message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "密码修改失败",
          description: "密码修改失败",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>修改密码</DialogTitle>
          <DialogDescription>
            定期更新您的密码以保护账户安全。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="oldPassword" className="text-right">
              旧密码
            </Label>
            <Input
              id="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={(e) =>
                setFormData({ ...formData, oldPassword: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newPassword" className="text-right">
              新密码
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>确认修改</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
