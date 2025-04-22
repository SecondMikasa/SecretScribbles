import { useState } from "react";
import { Message } from "@/types/interfaces";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MessageCardProps {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Early return if message is undefined to prevent the error
  if (!message) {
    return (
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Message</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div>Message data is missing</div>
        </CardContent>
      </Card>
    );
  }

  const handleDeleteMessage = async () => {
    if (!message._id) return;
    
    setIsDeleting(true);
    try {
      await axios.delete(`/api/delete-message/${message._id}`);
      onMessageDelete(message._id as string);
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Format the date - handling both string and Date objects
  const formattedDate = message.createdAt 
    ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true }) 
    : "Unknown date";

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Message</CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="whitespace-pre-wrap">{message.content}</div>
      </CardContent>
      <CardFooter className="flex justify-end pt-2 border-t">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteMessage}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          <span className="ml-1">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MessageCard