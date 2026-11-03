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
import { Plus } from "lucide-react";
import { addSubjectApi } from "@/services/api";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast

interface AddSubjectDialogProps {
  onSuccess: () => void;
}

const AddSubjectDialog = ({ onSuccess }: AddSubjectDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    credits: "" as number | "",
  });

  const handleSubmit = async () => {
    if (!formData.name || formData.credits === "") {
      toast({
        description: "请填写所有必填项",
        variant: "destructive",
      });
      return;
    }

    const creditsValue = Number(formData.credits);
    if (creditsValue < 0.1 || creditsValue > 10) {
      toast({
        description: "学分必须在0.1到10之间",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await addSubjectApi({
        ...formData,
        credits: creditsValue,
      });
      if (response.data.code === 200) {
        toast({
          title: "新增科目成功",
          description: "新增科目成功",
        });
        setIsOpen(false);
        onSuccess();
      } else {
        toast({
          title: "新增科目失败",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "新增科目失败",
        description: "新增失败",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> 新增科目
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增科目</DialogTitle>
          <DialogDescription>填写新的科目信息。</DialogDescription>
        </DialogHeader>
        {/* 【修改4】: 简化表单内容 */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              科目名称
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="credits" className="text-right">
              学分
            </Label>
            <Input
              id="credits"
              type="number"
              value={formData.credits}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  credits: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
              min="0.1"
              max="10"
              step="0.1"
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>确定</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectDialog;
