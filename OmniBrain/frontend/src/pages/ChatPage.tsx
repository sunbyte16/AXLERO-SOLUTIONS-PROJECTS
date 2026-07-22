import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Send, Loader2, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { chatApi, type Chat, type Message } from "../services/api";

function CitationCard({ citations }: { citations: Message["citations"] }) {
  if (!citations?.length) return null;
  return (
    <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Sources</p>
      {citations.map((c, i) => (
        <div key={i} className="bg-surface/50 rounded-input p-3 text-xs">
          <div className="flex justify-between mb-1">
            <span className="font-medium text-primary">{c.document_name}</span>
            <span className="text-slate-400">Confidence: {c.confidence}</span>
          </div>
          {c.page_number && <span className="text-slate-500">Page {c.page_number}</span>}
          <p className="text-slate-400 mt-1 line-clamp-2">{c.excerpt}</p>
        </div>
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? "bg-primary" : "bg-secondary"}`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className={`max-w-[70%] ${isUser ? "text-right" : ""}`}>
        <div className={`rounded-card px-4 py-3 ${isUser ? "bg-primary text-white" : "bg-card border border-border"}`}>
          {isUser ? (
            <p className="text-sm">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
          {!isUser && <CitationCard citations={message.citations} />}
        </div>
        {!isUser && message.agent_used && (
          <p className="text-xs text-slate-500 mt-1">
            Agent: {message.agent_used}
            {message.confidence_score && ` · Confidence: ${message.confidence_score}`}
          </p>
        )}
      </div>
    </div>
  );
}

export function ChatPage() {
  const queryClient = useQueryClient();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chats = [] } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => (await chatApi.list()).data,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", activeChatId],
    queryFn: async () => (await chatApi.messages(activeChatId!)).data,
    enabled: !!activeChatId,
  });

  const createChatMutation = useMutation({
    mutationFn: () => chatApi.create(),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      setActiveChatId(data.id);
    },
  });

  const sendMutation = useMutation({
    mutationFn: ({ chatId, content }: { chatId: string; content: string }) =>
      chatApi.send(chatId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", activeChatId] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chats.length > 0 && !activeChatId) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId]);

  const handleSend = () => {
    if (!input.trim() || !activeChatId) return;
    const content = input.trim();
    setInput("");
    sendMutation.mutate({ chatId: activeChatId, content });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-8">
      <div className="w-64 bg-surface border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <button
            onClick={() => createChatMutation.mutate()}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.map((chat: Chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`w-full text-left px-3 py-2 rounded-btn text-sm truncate transition-colors ${
                activeChatId === chat.id
                  ? "bg-primary/20 text-primary"
                  : "text-slate-300 hover:bg-card"
              }`}
            >
              {chat.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {!activeChatId ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <Bot className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="text-lg">Start a new conversation</p>
              <p className="text-sm mt-1">Upload documents first, then ask questions</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messagesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <p>Ask a question about your uploaded documents</p>
                </div>
              ) : (
                messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
              )}
              {sendMutation.isPending && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-card border border-border rounded-card px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex gap-3 max-w-4xl mx-auto">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Ask about your documents..."
                  className="input-field flex-1"
                  disabled={sendMutation.isPending}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sendMutation.isPending}
                  className="btn-primary px-4"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
