import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Ruler, Target, TrendingUp, Download, Info, Star, Loader, Eye } from "lucide-react";

interface PhysicalParameter {
  name: string;
  value: number;
  unit: string;
  score: number;
  ideal: string;
}

interface ATCScoringProps {
  breedType?: string;
  parameters: PhysicalParameter[] | null;
  analysisComplete?: boolean;
  onShowAR: () => void;
}

const ATCScoring = ({ breedType, parameters, analysisComplete = false, onShowAR }: ATCScoringProps) => {

  if (!analysisComplete || !parameters) {
    return (
        <Card className="w-full shadow-card animate-slide-in">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>ATC Scoring Results</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center space-y-2">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-muted-foreground">Awaiting analysis...</span>
                </div>
            </CardContent>
        </Card>
    );
  }

  const overallScore = Math.round(parameters.reduce((sum, p) => sum + p.score, 0) / parameters.length);
  const gradeLevel = overallScore >= 90 ? "Excellent" : 
                    overallScore >= 80 ? "Good" : 
                    overallScore >= 70 ? "Fair" : "Needs Improvement";

  const gradeColor = overallScore >= 90 ? "bg-success" : 
                    overallScore >= 80 ? "bg-primary" : 
                    overallScore >= 70 ? "bg-warning" : "bg-destructive";

  return (
    <Card className="w-full shadow-card animate-slide-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>ATC Scoring Results</span>
          </div>
          <Badge variant="outline" className="px-3">
            {breedType}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center">
            <div className={`w-24 h-24 rounded-full ${gradeColor} flex items-center justify-center shadow-glow`}>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{overallScore}</div>
                <div className="text-xs text-white/90">ATC Score</div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">{gradeLevel}</h3>
            <p className="text-sm text-muted-foreground">Overall Classification Grade</p>
          </div>
        </div>

        {/* Parameter Breakdown */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <Ruler className="h-4 w-4 text-primary" />
            <span>Physical Parameters</span>
          </h4>
          
          <div className="grid gap-4">
            {parameters.map((param, index) => (
              <div key={index} className="space-y-2 p-3 bg-muted/30 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{param.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono">{param.value}{param.unit}</span>
                    <Badge 
                      variant={param.score >= 90 ? "default" : param.score >= 80 ? "secondary" : "outline"}
                      className="px-2 py-0 text-xs"
                    >
                      {param.score}
                    </Badge>
                  </div>
                </div>
                
                <Progress value={param.score} className="h-2" />
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Ideal: {param.ideal}</span>
                  <div className="flex items-center space-x-1">
                    <Info className="h-3 w-3" />
                    <span>Based on {breedType} standards</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>Breeding Recommendations</span>
          </h4>
          
          <div className="grid gap-2">
            <div className="flex items-start space-x-2 p-2 bg-success/10 border border-success/20 rounded-md">
              <Star className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <span className="font-medium">Excellent milk production potential</span>
                <p className="text-muted-foreground">Strong dairy characteristics with ideal body proportions</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 p-2 bg-warning/10 border border-warning/20 rounded-md">
              <Info className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <span className="font-medium">Monitor rump angle development</span>
                <p className="text-muted-foreground">Slightly below optimal - consider selective breeding</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={onShowAR} disabled={!analysisComplete}>
            <Eye className="mr-2 h-4 w-4" />
            AR Guidance
          </Button>
          <Button variant="nature" className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ATCScoring;