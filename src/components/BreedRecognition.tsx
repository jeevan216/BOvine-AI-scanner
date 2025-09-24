import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Eye, Brain, CheckCircle, AlertTriangle, Loader } from "lucide-react";
import CameraInterface from "@/components/CameraInterface";
import { Button } from "./ui/button";

interface BreedData {
  type: "Cattle" | "Buffalo";
  breed: string;
  confidence: number;
  characteristics: string[];
}

interface BreedRecognitionProps {
  imageData: string | null;
  breedData: BreedData | null;
  loading: boolean;
  error: string | null;
  onImageCapture: (imageData: string) => void;
  onClose: () => void;
}

const BreedRecognition = ({ imageData, breedData, loading, error, onImageCapture, onClose }: BreedRecognitionProps) => {

  const confidenceColor = breedData && breedData.confidence > 90 ? "success" : 
                          breedData && breedData.confidence > 70 ? "warning" : "destructive";

  if (!imageData) {
    return <CameraInterface onImageCapture={onImageCapture} onClose={onClose} />; 
  }

  return (
    <Card className="w-full shadow-card animate-slide-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>Breed Recognition Results</span>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-border">
          <img 
            src={imageData} 
            alt="Analyzed animal" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              <Eye className="h-3 w-3 mr-1" />
              AI Analyzed
            </Badge>
          </div>
        </div>

        {loading && (
            <div className="flex items-center justify-center space-x-2">
                <Loader className="h-5 w-5 animate-spin" />
                <span>Analyzing Image...</span>
            </div>
        )}

        {error && (
            <div className="flex items-center justify-center space-x-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span>{error}</span>
            </div>
        )}

        {breedData && (
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-primary" />
                <span className="font-medium">Animal Type:</span>
              </div>
              <Badge 
                variant={breedData.type === "Cattle" ? "default" : "secondary"}
                className="px-3 py-1"
              >
                {breedData.type}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Breed:</span>
                <span className="text-lg font-semibold text-primary">{breedData.breed}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Confidence Level:</span>
                  <span className={`font-medium ${ 
                    confidenceColor === 'success' ? 'text-success' :
                    confidenceColor === 'warning' ? 'text-warning' : 'text-destructive'
                  }`}> 
                    {breedData.confidence}%
                  </span>
                </div>
                <Progress 
                  value={breedData.confidence} 
                  className="h-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Identified Characteristics:</h4>
              <div className="grid gap-2">
                {breedData.characteristics.map((characteristic, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-2 p-2 bg-muted/50 rounded-md"
                  >
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    <span className="text-sm">{characteristic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BreedRecognition;