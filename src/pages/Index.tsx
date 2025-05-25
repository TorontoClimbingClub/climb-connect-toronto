
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Mountain, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-orange-600 to-red-700 p-4 rounded-2xl w-20 h-20 mx-auto mb-6">
            <Mountain className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#E55A2B] mb-2">
            Toronto Climbing Club
          </h1>
          <p className="text-stone-600 text-lg">
            Connect with fellow climbers and explore Ontario's amazing crags
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/events')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-[#E55A2B]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Upcoming Events</CardTitle>
                    <CardDescription>Join outdoor climbing adventures</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-stone-400" />
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/community')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-[#E55A2B]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Community</CardTitle>
                    <CardDescription>Meet fellow climbers</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-stone-400" />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Featured Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">About TCC</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-stone-600 mb-4">
              We're a community of outdoor climbing enthusiasts exploring Ontario's incredible rock formations. From the Escarpment to Muskoka, we organize regular trips for climbers of all levels.
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-[#E55A2B]">50+</div>
                <div className="text-sm text-stone-600">Active Members</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-[#E55A2B]">12</div>
                <div className="text-sm text-stone-600">Events This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Ready to climb?</h3>
            <p className="text-stone-600 mb-4">
              Check out our upcoming events and join the adventure!
            </p>
            <Button 
              onClick={() => navigate('/events')}
              className="w-full bg-[#E55A2B] hover:bg-orange-700"
            >
              View Events
            </Button>
          </CardContent>
        </Card>
      </div>
      <Navigation />
    </div>
  );
}
