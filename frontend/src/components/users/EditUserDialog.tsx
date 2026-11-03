import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit } from "lucide-react";
import { updateUserApi } from "@/services/api";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast
import { User } from "@/pages/Users"; // 从父组件导入类型

interface EditUserDialogProps {
  user: User;
  onSuccess: () => void;
}

const EditUserDialog = ({ user, onSuccess }: EditUserDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: user.id,
    fullName: user.fullName,
    role: user.role,
  });

  useEffect(() => {
    setFormData({
      id: user.id,
      fullName: user.fullName,
      role: user.role,
    });
  }, [user]);

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.role) {
      toast({
        title: "修改用户失败",
        description: "请填写所有必填项",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await updateUserApi(formData);
      if (response.data.code === 200) {
        toast({
          title: "修改用户成功",
          description: "修改用户成功",
        });
        setIsOpen(false);
        onSuccess();
      } else {
        toast({
          title: "修改用户失败",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "修改用户失败",
        description: "修改失败",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑用户</DialogTitle>
          <DialogDescription>
            修改用户 `{user.username}` 的信息。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">
              真实姓名
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              角色
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value as User["role"] })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ROLE_ADMIN">管理员</SelectItem>
                <SelectItem value="ROLE_TEACHER">教师</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>保存</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
