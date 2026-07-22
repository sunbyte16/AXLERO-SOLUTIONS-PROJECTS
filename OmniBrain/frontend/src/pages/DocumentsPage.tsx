import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, Trash2, FileText, Loader2 } from "lucide-react";
import { documentsApi, type Document } from "../services/api";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    indexed: "bg-success/20 text-success",
    processing: "bg-warning/20 text-warning",
    pending: "bg-slate-500/20 text-slate-300",
    failed: "bg-error/20 text-error",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] ?? colors.pending}`}>
      {status}
    </span>
  );
}

export function DocumentsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => (await documentsApi.list()).data,
    refetchInterval: 5000,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => documentsApi.upload(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  });

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Array.from(files).forEach((file) => uploadMutation.mutate(file));
    },
    [uploadMutation]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Documents</h1>
      <p className="text-slate-400 mb-8">Upload and manage your knowledge base</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`card border-2 border-dashed cursor-pointer transition-colors mb-8 text-center py-12 ${
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
      >
        <Upload className="w-10 h-10 text-primary mx-auto mb-4" />
        <p className="font-medium">Drag & drop files here, or click to browse</p>
        <p className="text-sm text-slate-400 mt-1">PDF, DOCX, TXT, CSV, XLSX, PNG, JPG</p>
        {uploadMutation.isPending && (
          <div className="flex items-center justify-center gap-2 mt-4 text-primary">
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.csv,.xlsx,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Your Documents</h2>
        {isLoading ? (
          <p className="text-slate-400">Loading...</p>
        ) : documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No documents uploaded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-slate-400 text-left">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Size</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc: Document) => (
                  <tr key={doc.id} className="border-b border-border/50">
                    <td className="py-3 pr-4 truncate max-w-xs">{doc.original_filename}</td>
                    <td className="py-3 uppercase text-slate-400">{doc.file_type}</td>
                    <td className="py-3 text-slate-400">{formatSize(doc.file_size)}</td>
                    <td className="py-3"><StatusBadge status={doc.status} /></td>
                    <td className="py-3">
                      <button
                        onClick={() => deleteMutation.mutate(doc.id)}
                        className="text-slate-400 hover:text-error transition-colors"
                        aria-label="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
