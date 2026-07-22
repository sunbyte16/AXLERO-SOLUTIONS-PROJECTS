import { useQuery } from "@tanstack/react-query";
import { FileText, MessageSquare, Activity, Database } from "lucide-react";
import { authApi, chatApi, documentsApi, healthApi } from "../services/api";
import { useAuthStore } from "../store/authStore";

function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle?: string;
}) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 bg-primary/10 rounded-btn">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const setUser = useAuthStore((s) => s.setUser);

  useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await authApi.me();
      setUser(data);
      return data;
    },
  });

  const { data: documents = [] } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => (await documentsApi.list()).data,
  });

  const { data: chats = [] } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => (await chatApi.list()).data,
  });

  const { data: health } = useQuery({
    queryKey: ["health"],
    queryFn: async () => (await healthApi.check()).data,
    refetchInterval: 30000,
  });

  const indexed = documents.filter((d) => d.status === "indexed").length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-slate-400 mb-8">Overview of your OmniBrain workspace</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Documents" value={documents.length} icon={FileText} subtitle={`${indexed} indexed`} />
        <StatCard title="Conversations" value={chats.length} icon={MessageSquare} />
        <StatCard
          title="System Status"
          value={health?.status === "healthy" ? "Healthy" : "Degraded"}
          icon={Activity}
        />
        <StatCard title="Vector DB" value={health?.services?.qdrant ?? "—"} icon={Database} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent Documents</h2>
          {documents.length === 0 ? (
            <p className="text-slate-400 text-sm">No documents uploaded yet.</p>
          ) : (
            <ul className="space-y-3">
              {documents.slice(0, 5).map((doc) => (
                <li key={doc.id} className="flex justify-between items-center text-sm">
                  <span className="truncate">{doc.original_filename}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      doc.status === "indexed"
                        ? "bg-success/20 text-success"
                        : doc.status === "failed"
                          ? "bg-error/20 text-error"
                          : "bg-warning/20 text-warning"
                    }`}
                  >
                    {doc.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent Chats</h2>
          {chats.length === 0 ? (
            <p className="text-slate-400 text-sm">No conversations yet.</p>
          ) : (
            <ul className="space-y-3">
              {chats.slice(0, 5).map((chat) => (
                <li key={chat.id} className="text-sm truncate">
                  {chat.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
