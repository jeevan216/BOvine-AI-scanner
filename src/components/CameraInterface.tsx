
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, Zap, Volume2, VolumeX, X } from "lucide-react";
import { toast } from "sonner";
import Webcam from "react-webcam";

interface CameraInterfaceProps {
  onImageCapture: (imageData: string) => void;
  onClose: () => void;
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "environment"
};

const CameraInterface = ({ onImageCapture, onClose }: CameraInterfaceProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [guidanceText, setGuidanceText] = useState("Position animal in center");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        onImageCapture(imageData);
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanStart = () => {
    setShowCamera(true);
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onImageCapture(imageSrc);
        toast.success("Image captured!");
        setShowCamera(false);
      } else {
        toast.error("Could not capture image.");
      }
    }
  }, [webcamRef, onImageCapture]);

  const toggleVoiceGuidance = () => {
    setVoiceEnabled(!voiceEnabled);
    toast.info(voiceEnabled ? "Voice guidance disabled" : "Voice guidance enabled");
  };

  if (showCamera) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
        <Webcam
          audio={false}
          height={720}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-5 flex flex-col items-center space-y-4">
            <Button onClick={capture} variant="capture" size="xl" className="rounded-full h-20 w-20">
                <Camera className="h-8 w-8" />
            </Button>
            <Button onClick={() => setShowCamera(false)} variant="destructive" size="lg">
                <X className="mr-2 h-4 w-4" /> Close Camera
            </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full shadow-card">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Camera Viewfinder */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20">
              {/* Silhouette Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-40 border-2 border-dashed border-accent opacity-60 rounded-lg">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-accent-foreground font-medium">Animal Position Guide</p>
                  </div>
                </div>
              </div>

              {/* Scanning Animation */}
              {isScanning && (
                <div className="absolute inset-0">
                  <div className="w-full h-0.5 bg-accent shadow-glow animate-scan-line"></div>
                </div>
              )}
            </div>

            {/* Guidance Text */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
                <p className="text-sm font-medium text-center animate-pulse-guidance">
                  {guidanceText}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col space-y-4">
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleScanStart}
                disabled={isScanning}
                variant="capture"
                size="xl"
                className="flex-1 max-w-xs"
              >
                <Camera className="mr-2 h-5 w-5" />
                {isScanning ? "Scanning..." : "Start Live Scan"}
              </Button>
            </div>

            <div className="flex justify-center space-x-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="lg"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              
              <Button
                onClick={toggleVoiceGuidance}
                variant={voiceEnabled ? "scan" : "outline"}
                size="lg"
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              
              <Button variant="outline" size="lg" onClick={onClose}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraInterface;
