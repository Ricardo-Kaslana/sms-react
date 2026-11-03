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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { addUserApi } from "@/services/api";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast

interface AddUserDialogProps {
  onSuccess: () => void;
}

const AddUserDialog = ({ onSuccess }: AddUserDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    role: "",
  });

  const handleSubmit = async () => {
    if (
      !formData.username ||
      !formData.password ||
      !formData.fullName ||
      !formData.role
    ) {
      toast({
        description: "请填写所有必填项",
        variant: "destructive",
      });
    }

    try {
      const response = await addUserApi(formData);
      if (response.data.code === 200) {
        toast({
          title: "新增用户成功",
          description: "新增用户成功",
        });
        setIsOpen(false);
        onSuccess();
      } else {
        toast({
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "新增失败",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> 新增用户
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增用户</DialogTitle>
          <DialogDescription>创建新的系统用户账号。</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              用户名
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="col-span-3"
            />
          </div>
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
            <Label htmlFor="password" className="text-right">
              初始密码
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
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
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="选择角色" />
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
          <Button onClick={handleSubmit}>创建</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
