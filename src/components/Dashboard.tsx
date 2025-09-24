import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-livestock.jpg";
import { 
  Camera, 
  BarChart3, 
  Clock, 
  Database, 
  Wifi, 
  WifiOff,
  Users,
  TrendingUp,
  Award,
  Heart
} from "lucide-react";

interface DashboardProps {
  onStartScan: () => void;
}

const Dashboard = ({ onStartScan }: DashboardProps) => {
  const [isOnline, setIsOnline] = useState(true);

  const stats = [
    { label: "Total Scans", value: "1,247", icon: Camera, trend: "+12%" },
    { label: "This Month", value: "89", icon: BarChart3, trend: "+8%" },
    { label: "Accuracy Rate", value: "94.7%", icon: Award, trend: "+2.1%" },
    { label: "Active Farmers", value: "156", icon: Users, trend: "+15%" }
  ];

  const recentScans = [
    { id: 1, type: "Holstein Friesian", score: 92, time: "2 hours ago", status: "completed" },
    { id: 2, type: "Murrah Buffalo", score: 88, time: "4 hours ago", status: "completed" },
    { id: 3, type: "Gir Cattle", score: 85, time: "1 day ago", status: "completed" },
    { id: 4, type: "Sahiwal", score: 90, time: "2 days ago", status: "synced" }
  ];

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-success" />
            ) : (
              <WifiOff className="h-4 w-4 text-warning" />
            )}
            <span className="text-sm font-medium">
              {isOnline ? "Online" : "Offline Mode"}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isOnline ? "Synced" : "3 pending"}
            </span>
          </div>
        </div>

        <Badge variant="outline" className="px-3">
          BPA Connected
        </Badge>
      </div>

      {/* Quick Action Hero */}
      <Card className="relative overflow-hidden shadow-glow">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 backdrop-blur-[1px]"></div>
        </div>
        <CardContent className="relative p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="space-y-3 text-center lg:text-left mb-6 lg:mb-0">
              <h2 className="text-2xl lg:text-3xl font-bold text-primary-foreground">
                AI-Powered Livestock Classification
              </h2>
              <p className="text-primary-foreground/90 text-lg max-w-md">
                Capture and classify cattle & buffalo with precision using advanced computer vision
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                  94.7% Accuracy
                </Badge>
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                  BPA Integrated
                </Badge>
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                  Offline Ready
                </Badge>
              </div>
            </div>
            <Button 
              onClick={onStartScan}
              variant="capture" 
              size="xl"
              className="shadow-glow px-8 py-4 text-lg"
            >
              <Camera className="mr-3 h-6 w-6" />
              Start Classification
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-xs text-success font-medium">{stat.trend}</span>
                  </div>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Recent Scans</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentScans.map((scan) => (
              <div 
                key={scan.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg transition-smooth hover:bg-muted/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{scan.type}</p>
                    <p className="text-sm text-muted-foreground">{scan.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="font-semibold text-primary">{scan.score}</p>
                    <p className="text-xs text-muted-foreground">ATC Score</p>
                  </div>
                  <Badge 
                    variant={scan.status === "completed" ? "default" : "secondary"}
                    className="px-2 py-1"
                  >
                    {scan.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;