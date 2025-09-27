import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PhysicalParameter {
  name: string;
  value: number;
  unit: string;
  score: number;
  ideal: string;
}

interface ARGuidanceProps {
  imageData: string;
  atcScoringData: PhysicalParameter[];
  onClose: () => void;
}

const ARGuidance = ({ imageData, atcScoringData, onClose }: ARGuidanceProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade-in">
      <Card className="w-full max-w-4xl h-[90vh] flex flex-col">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>AR Guidance</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
            <img src={imageData} alt="Livestock" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-4 overflow-y-auto">
            <h3 className="text-lg font-semibold">ATC Scoring Details</h3>
            {atcScoringData.map((param, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{param.name}</span>
                  <span className="text-sm font-mono">{param.value}{param.unit}</span>
                </div>
                <div className="text-xs text-muted-foreground">Ideal: {param.ideal}</div>
                <div className="text-xs text-muted-foreground">Score: {param.score}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ARGuidance;