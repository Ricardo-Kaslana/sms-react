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
import { Edit } from "lucide-react";
import { updateSubjectApi } from "@/services/api";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast

// 定义Props类型
interface Subject {
  id: number;
  name: string;
  credits: number;
}

interface EditSubjectDialogProps {
  subject: Subject;
  onSuccess: () => void;
}

const EditSubjectDialog = ({ subject, onSuccess }: EditSubjectDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: subject.id,
    name: subject.name,
    credits: subject.credits as number | "",
  });

  // 当外部传入的 subject 变化时，同步更新表单数据
  useEffect(() => {
    setFormData({
      id: subject.id,
      name: subject.name,
      credits: subject.credits,
    });
  }, [subject]);

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
      const response = await updateSubjectApi({
        ...formData,
        credits: creditsValue,
      });
      if (response.data.code === 200) {
        toast({
          title: "修改科目成功",
          description: "修改科目成功",
        });
        setIsOpen(false);
        onSuccess();
      } else {
        toast({
          title: "修改科目失败",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "修改科目失败",
        description: "修改失败",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-3 w-3 mr-1" /> 编辑
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑科目</DialogTitle>
          <DialogDescription>修改科目信息。</DialogDescription>
        </DialogHeader>
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
          <Button onClick={handleSubmit}>保存</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubjectDialog;
