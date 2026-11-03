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
import { updateGradeApi } from "@/services/api";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast
import { GradeVO } from "@/pages/Grades"; // 从父组件导入类型

interface Student {
  id: number;
  name: string;
  studentNo: string;
}
interface Subject {
  id: number;
  name: string;
}

interface EditGradeDialogProps {
  grade: GradeVO;
  onSuccess: () => void;
  students: Student[];
  subjects: Subject[];
}

const EditGradeDialog = ({
  grade,
  onSuccess,
  students,
  subjects,
}: EditGradeDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: grade.id,
    studentId: grade.studentId,
    subjectId: grade.subjectId,
    score: grade.score.toString(),
    term: grade.term,
  });

  // 当外部传入的 grade 变化时，同步更新表单数据
  useEffect(() => {
    setFormData({
      id: grade.id,
      studentId: grade.studentId,
      subjectId: grade.subjectId,
      score: grade.score.toString(),
      term: grade.term,
    });
  }, [grade]);

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
      const response = await updateGradeApi({ ...formData, score: scoreValue });
      if (response.data.code === 200) {
        toast({
          title: "成功",
          description: "成绩修改成功",
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
          <DialogTitle>编辑成绩</DialogTitle>
          <DialogDescription>修改学生的成绩记录。</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">学生</Label>
            {/* 编辑时通常不允许修改学生和科目，设为只读 */}
            <Input
              value={`${grade.studentName} (${grade.studentNo})`}
              className="col-span-3"
              readOnly
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">科目</Label>
            <Input
              value={grade.subjectName}
              className="col-span-3"
              readOnly
              disabled
            />
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
            {/* 学期通常也不允许修改 */}
            <Input
              id="term"
              value={formData.term}
              className="col-span-3"
              readOnly
              disabled
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

export default EditGradeDialog;
