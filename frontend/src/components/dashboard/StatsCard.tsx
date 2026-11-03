import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, changeType, icon: Icon, color }) => {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';

  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                isPositive
                  ? 'bg-green-100 text-green-700'
                  : isNegative
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {change}
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
