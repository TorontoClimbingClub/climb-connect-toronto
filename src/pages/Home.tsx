
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { MessageCircle, Calendar, Users, Mountain } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

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
                <MessageCircle className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Community Chat</CardTitle>
                <CardDescription>
                  Connect with climbers, share tips, and plan impromptu sessions
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

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          Welcome back to the club!
        </h1>
        <p className="text-xl text-gray-600">
          Ready for your next climbing adventure?
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <MessageCircle className="h-8 w-8 text-green-600 mb-2" />
            <CardTitle>Join the Chat</CardTitle>
            <CardDescription>
              Connect with the community and share your climbing experiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/chat">Open Chat</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Calendar className="h-8 w-8 text-orange-600 mb-2" />
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Discover and join climbing events in Toronto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/events">View Events</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Update your profile and view your climbing stats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/profile">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
