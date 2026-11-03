import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, ArrowRight } from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">快速操作</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-6 flex items-center justify-between group hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
              onClick={action.onClick}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <action.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
