import { useState } from "react";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import BreedRecognition from "@/components/BreedRecognition";
import ATCScoring from "@/components/ATCScoring";
import ARGuidance from "@/components/ARGuidance";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { genAI } from "@/lib/gemini";

type AppState = "dashboard" | "results";

interface BreedData {
  type: "Cattle" | "Buffalo";
  breed: string;
  confidence: number;
  characteristics: string[];
}

interface PhysicalParameter {
  name: string;
  value: number;
  unit: string;
  score: number;
  ideal: string;
}

// Function to convert base64 to a File object
function dataURLtoFile(dataurl: string, filename: string) {
    let arr = dataurl.split(',');
    let mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
        throw new Error("Invalid data URL");
    }
    let mime = mimeMatch[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("dashboard");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [breedData, setBreedData] = useState<BreedData | null>(null);
  const [atcScoringData, setAtcScoringData] = useState<PhysicalParameter[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showARGuidance, setShowARGuidance] = useState(false);

  const handleStartScan = () => {
    setCurrentState("results");
    setCapturedImage(null);
    setBreedData(null);
    setAtcScoringData(null);
    setError(null);
    toast.info("Camera interface activated");
  };

  const handleImageCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setLoading(true);
    setError(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Breed Recognition
      const breedPrompt = "Analyze the image of the animal and identify its breed. Return a JSON object with the following structure: { \"type\": \"Cattle\" | \"Buffalo\", \"breed\": \"string\", \"confidence\": number (0-100), \"characteristics\": [\"string\"] }.";
      const imageFile = dataURLtoFile(imageData, "capture.jpg");
      const imagePart = {
        inlineData: {
          data: await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
          }),
          mimeType: imageFile.type,
        },
      };

      let breedResult = await model.generateContent([breedPrompt, imagePart]);
      let breedResponse = await breedResult.response;
      let breedText = breedResponse.text();
      const breedJsonText = breedText.replace(/```json|```/g, '').trim();
      const parsedBreedData = JSON.parse(breedJsonText);
      setBreedData(parsedBreedData);
      toast.success("Breed recognized!");

      // ATC Scoring
      const atcPrompt = `Analyze the image of the ${parsedBreedData.breed} and provide ATC scoring. Return a JSON object with a 'parameters' key, which holds an array of physical parameters with the following structure: { "parameters": [ { \"name\": \"string\", \"value\": number, \"unit\": \"string\", \"score\": number (0-100), \"ideal\": \"string\" } ] }. The parameters should include Body Length, Height at Withers, Chest Width, and Rump Angle.`;
      let atcResult = await model.generateContent([atcPrompt, imagePart]);
      let atcResponse = await atcResult.response;
      let atcText = atcResponse.text();
      const atcJsonText = atcText.match(/\{[\s\S]*\}/)?.[0];

      if (atcJsonText) {
        try {
          const parsedAtcData = JSON.parse(atcJsonText).parameters;
          setAtcScoringData(parsedAtcData);
          toast.success("ATC scoring complete!");
        } catch (parseError) {
          console.error("JSON parsing error:", parseError);
          setError("Failed to interpret ATC scoring data. Please try again.");
          toast.error("Failed to interpret ATC scoring data.");
        }
      } else {
        console.error("No JSON object found in ATC response:", atcText);
        setError("No valid ATC data received. Please try again.");
        toast.error("No valid ATC data received.");
      }

    } catch (err) {
      console.error(err);
      setError("Failed to analyze the image. Please try again.");
      toast.error("Failed to analyze the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentState("dashboard");
    setCapturedImage(null);
    setBreedData(null);
    setAtcScoringData(null);
    setError(null);
  };

  const handleShowAR = () => setShowARGuidance(true);
  const handleCloseAR = () => setShowARGuidance(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {currentState !== "dashboard" && (
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBackToDashboard}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        )}

        {currentState === "dashboard" && (
          <Dashboard onStartScan={handleStartScan} />
        )}

        {currentState === "results" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <BreedRecognition 
                imageData={capturedImage}
                breedData={breedData}
                loading={loading}
                error={error}
                onImageCapture={handleImageCapture}
                onClose={handleBackToDashboard}
              />
              <ATCScoring 
                breedType={breedData?.breed}
                parameters={atcScoringData}
                analysisComplete={!!breedData && !!atcScoringData}
                onShowAR={handleShowAR}
              />
            </div>
          </div>
        )}

        {showARGuidance && capturedImage && atcScoringData && (
          <ARGuidance 
            imageData={capturedImage}
            atcScoringData={atcScoringData}
            onClose={handleCloseAR}
          />
        )}
      </main>

      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Animal Type Classification System - Powered by AI
            </p>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
              <span className="text-xs text-muted-foreground">
                Version 1.0 | Connected to BPA
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
