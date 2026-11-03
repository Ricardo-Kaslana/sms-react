import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from 'lucide-react';

interface Activity {
  type: string;
  message: string;
  time: string;
  icon: LucideIcon;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'student':
        return 'bg-blue-100 text-blue-700';
      case 'grade':
        return 'bg-green-100 text-green-700';
      case 'system':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'student':
        return '学生';
      case 'grade':
        return '成绩';
      case 'system':
        return '系统';
      default:
        return '其他';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">最近活动</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="p-2 bg-white rounded-full shadow-sm">
                <activity.icon className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className={getTypeColor(activity.type)}>
                    {getTypeLabel(activity.type)}
                  </Badge>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
                <p className="text-gray-800">{activity.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
