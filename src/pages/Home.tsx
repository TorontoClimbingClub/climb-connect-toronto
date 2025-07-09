
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Users, Mountain } from 'lucide-react';
import { useEffect, useState } from 'react';
import Dashboard from './Dashboard';

export default function Home() {
  const { user } = useAuth();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint - tablet and up
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <Mountain className="h-16 w-16 text-green-600 mr-4" />
              <h1 className="text-5xl font-bold text-green-800">
                Toronto Climbing Club
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with fellow climbers, join events, and build lasting friendships 
              in Toronto's vibrant climbing community.
            </p>
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link to="/auth">Join the Community</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Group Chats</CardTitle>
                <CardDescription>
                  Join gym-specific chats and connect with climbers from your favorite locations
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Climbing Events</CardTitle>
                <CardDescription>
                  Join organized climbing sessions and competitions
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Find Partners</CardTitle>
                <CardDescription>
                  Meet climbing partners for your next adventure
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Climbing?
            </h2>
            <p className="text-gray-600 mb-8">
              Join hundreds of climbers who are already part of our community.
            </p>
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Link to="/auth">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // For authenticated users on desktop, show the Dashboard
  if (isDesktop) {
    return <Dashboard />;
  }

  // For authenticated users on mobile, show the original mobile home view
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="max-w-6xl mx-auto px-4 flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
        {/* Centered Title Section */}
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <Mountain className="h-16 w-16 text-green-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-green-800">
                Toronto Climbing Club
              </h1>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href = '/groups'}>
            <CardHeader>
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Group Chats</CardTitle>
              <CardDescription>
                Join gym-specific chats and connect with climbers from your favorite locations
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href = '/events'}>
            <CardHeader>
              <Calendar className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Climbing Events</CardTitle>
              <CardDescription>
                Join organized climbing sessions and competitions
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href = '/club-talk'}>
            <CardHeader>
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Community Chat</CardTitle>
              <CardDescription>
                Connect with the wider climbing community
              </CardDescription>
            </CardHeader>
          </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
