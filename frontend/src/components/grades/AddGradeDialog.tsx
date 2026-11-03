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
import { addGradeApi } from "@/services/api";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast

// 定义Props中接收的数据类型
interface Student {
  id: number;
  name: string;
  studentNo: string;
}
interface Subject {
  id: number;
  name: string;
}

interface AddGradeDialogProps {
  onSuccess: () => void;
  students: Student[];
  subjects: Subject[];
}

const AddGradeDialog = ({
  onSuccess,
  students,
  subjects,
}: AddGradeDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: undefined as number | undefined,
    subjectId: undefined as number | undefined,
    score: "",
    term: "",
  });

  const handleSubmit = async () => {
    if (
      !formData.studentId ||
      !formData.subjectId ||
      formData.score === "" ||
      !formData.term
    ) {
      toast({
        description: "请填写所有必填项",
        variant: "destructive",
      });
      return;
    }
    const scoreValue = Number(formData.score);
    if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
      toast({
        description: "请输入0-100之间的有效分数",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await addGradeApi({ ...formData, score: scoreValue });
      if (response.data.code === 200) {
        toast({
          title: "成功",
          description: "成绩录入成功",
        });
        setIsOpen(false);
        onSuccess();
      } else {
        toast({
          title: "失败",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "失败",
        description: "录入失败",
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // 每次打开时重置表单
      setFormData({
        studentId: undefined,
        subjectId: undefined,
        score: "",
        term: "",
      });
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> 录入成绩
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>录入新成绩</DialogTitle>
          <DialogDescription>为学生选择科目并录入成绩。</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="student" className="text-right">
              学生
            </Label>
            <Select
              value={formData.studentId?.toString()}
              onValueChange={(val) =>
                setFormData((p) => ({ ...p, studentId: Number(val) }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="选择学生" />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name} ({s.studentNo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              科目
            </Label>
            <Select
              value={formData.subjectId?.toString()}
              onValueChange={(val) =>
                setFormData((p) => ({ ...p, subjectId: Number(val) }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="选择科目" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="score" className="text-right">
              分数
            </Label>
            <Input
              id="score"
              type="number"
              value={formData.score}
              onChange={(e) =>
                setFormData((p) => ({ ...p, score: e.target.value }))
              }
              className="col-span-3"
              placeholder="请输入0-100的分数"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="term" className="text-right">
              学期
            </Label>
            <Input
              id="term"
              value={formData.term}
              onChange={(e) =>
                setFormData((p) => ({ ...p, term: e.target.value }))
              }
              className="col-span-3"
              placeholder="例如: 2023-2024第一学期"
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

export default AddGradeDialog;
