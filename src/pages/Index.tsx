
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mountain, Calendar, Users, Car, Package, MapPin, Clock } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Blue Mountain Outdoor Climbing",
      date: "2025-05-30",
      time: "08:00",
      location: "Blue Mountain, Collingwood",
      participants: 12,
      maxParticipants: 15,
      difficulty: "Intermediate",
      description: "Join us for a fantastic day of outdoor climbing at Blue Mountain's scenic crags.",
      organizer: "Sarah Johnson",
      carpoolsAvailable: 2
    },
    {
      id: 2,
      title: "Bouldering Session - The Gym",
      date: "2025-05-26",
      time: "19:00",
      location: "Basecamp Climbing Gym",
      participants: 8,
      maxParticipants: 12,
      difficulty: "All Levels",
      description: "Weekly indoor bouldering session perfect for all skill levels.",
      organizer: "Mike Chen",
      carpoolsAvailable: 0
    },
    {
      id: 3,
      title: "Rattlesnake Point Adventure",
      date: "2025-06-07",
      time: "07:30",
      location: "Rattlesnake Point, Milton",
      participants: 6,
      maxParticipants: 10,
      difficulty: "Advanced",
      description: "Technical climbing at one of Ontario's premier outdoor destinations.",
      organizer: "Alex Rivera",
      carpoolsAvailable: 1
    }
  ];

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-2 rounded-xl">
                <Mountain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-800">TCC</h1>
                <p className="text-xs text-stone-600">Toronto Climbing Club</p>
              </div>
            </div>
            {!isLoggedIn ? (
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Sign In
              </Button>
            ) : (
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-emerald-100 text-emerald-700">JD</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pb-20">
        {/* Welcome Section */}
        <div className="py-6">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">
            {isLoggedIn ? "Welcome back!" : "Discover Climbing Adventures"}
          </h2>
          <p className="text-stone-600">
            {isLoggedIn 
              ? "Ready for your next climbing adventure?" 
              : "Join Toronto's premier climbing community and explore amazing outdoor destinations together."
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="p-4">
              <Calendar className="h-5 w-5 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-stone-800">12</p>
              <p className="text-xs text-stone-600">Events This Month</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Users className="h-5 w-5 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-stone-800">284</p>
              <p className="text-xs text-stone-600">Active Members</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Mountain className="h-5 w-5 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-stone-800">47</p>
              <p className="text-xs text-stone-600">Locations Visited</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-800">Upcoming Events</h3>
            <Button variant="ghost" size="sm" className="text-emerald-600">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-1">{event.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-stone-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-stone-600 mb-3">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={event.difficulty === "Advanced" ? "bg-red-100 text-red-700" : 
                                event.difficulty === "Intermediate" ? "bg-amber-100 text-amber-700" : 
                                "bg-green-100 text-green-700"}
                    >
                      {event.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-4">
                    {event.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-emerald-600" />
                        <span>{event.participants}/{event.maxParticipants}</span>
                      </div>
                      {event.carpoolsAvailable > 0 && (
                        <div className="flex items-center space-x-1">
                          <Car className="h-4 w-4 text-blue-600" />
                          <span>{event.carpoolsAvailable} carpool{event.carpoolsAvailable > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-stone-500">Organized by {event.organizer}</p>
                    <Button 
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={!isLoggedIn}
                    >
                      {isLoggedIn ? "Join Event" : "Sign in to Join"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action for Non-logged Users */}
        {!isLoggedIn && (
          <Card className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
            <CardContent className="p-6 text-center">
              <Mountain className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-lg font-semibold mb-2">Ready to Start Climbing?</h3>
              <p className="text-emerald-100 mb-4 text-sm">
                Join our community and discover amazing climbing adventures across Ontario.
              </p>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-white text-emerald-700 hover:bg-stone-100"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Bottom Navigation */}
      {isLoggedIn && <Navigation />}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
