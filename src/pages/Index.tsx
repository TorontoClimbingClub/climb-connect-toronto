import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, ExternalLink, Mountain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Leaderboards } from "@/components/home/Leaderboards";
import { useResponsiveContainer } from "@/hooks/useResponsiveContainer";

export default function Index() {
  const navigate = useNavigate();
  const { containerClass, paddingClass } = useResponsiveContainer('wide');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className={`${containerClass} ${paddingClass}`}>
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="bg-white p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <img 
              src="/lovable-uploads/bc35c5e5-f3f5-4bf6-b13a-74f1b7990628.png" 
              alt="Toronto Climbing Club" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-[#E55A2B] mb-2">
            Toronto Climbing Club
          </h1>
          <p className="text-stone-600 text-lg">
            Connect with fellow climbers and explore Ontario's amazing crags
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/events')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-[#E55A2B]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Community & Events</CardTitle>
                    <CardDescription>Join adventures and meet climbers</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-stone-400" />
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/routes')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Mountain className="h-5 w-5 text-[#E55A2B]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Beta Boards</CardTitle>
                    <CardDescription>Explore outdoor climbs</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-stone-400" />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Leaderboards Section */}
        <Leaderboards />
        
        {/* Website Return Button */}
        <div className="mt-8">
          <Button 
            onClick={() => window.open('https://www.torontoclimbingclub.ca', '_blank')}
            variant="outline"
            className="w-full border-[#E55A2B] text-[#E55A2B] hover:bg-orange-50"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Return to Website
          </Button>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
