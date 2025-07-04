
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Chat() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center text-muted-foreground py-8">
          Please log in to access the chat.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[calc(100vh-12rem)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold text-primary">
            Club Chat
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Connect with fellow climbers and share your adventures
          </p>
        </CardHeader>
        <CardContent className="flex flex-col h-full p-6">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <h3 className="text-lg font-medium mb-2">Chat Coming Soon!</h3>
              <p>Real-time chat features will be available here.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
