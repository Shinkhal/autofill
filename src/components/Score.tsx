import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const LinearGauge = ({ score }: { score: number }) => {
  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-muted-foreground">Score</span>
        <span className="text-sm font-medium">{score}%</span>
      </div>
      <Progress value={score} />
      <div className="text-center">
        <Badge variant="secondary">{getScoreLabel(score)}</Badge>
      </div>
    </div>
  );
};
