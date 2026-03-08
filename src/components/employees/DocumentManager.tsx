import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type DocumentType = Database["public"]["Enums"]["document_type"];

interface DocumentManagerProps {
  employeeId: string;
  companyId: string;
}

export default function DocumentManager({ employeeId, companyId }: DocumentManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState<DocumentType>("other");
  const [file, setFile] = useState<File | null>(null);

  const { data: documents, isLoading } = useQuery({
    queryKey: ["employee-documents", employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employee_documents")
        .select("*")
        .eq("employee_id", employeeId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!employeeId,
  });

  const handleUpload = async () => {
    if (!file || !docName) { toast({ title: "Please fill all fields", variant: "destructive" }); return; }
    setUploading(true);
    try {
      const filePath = `${companyId}/${employeeId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("employee-documents").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("employee_documents").insert({
        employee_id: employeeId,
        company_id: companyId,
        document_name: docName,
        document_type: docType,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: user?.id,
      });
      if (dbError) throw dbError;

      toast({ title: "Document uploaded successfully" });
      queryClient.invalidateQueries({ queryKey: ["employee-documents", employeeId] });
      setShowUpload(false);
      setDocName(""); setFile(null); setDocType("other");
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage.from("employee-documents").download(filePath);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url; a.download = fileName; a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({ title: "Download failed", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    try {
      await supabase.storage.from("employee-documents").remove([filePath]);
      const { error } = await supabase.from("employee_documents").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Document deleted" });
      queryClient.invalidateQueries({ queryKey: ["employee-documents", employeeId] });
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const typeColors: Record<string, string> = {
    contract: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    id_copy: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    certificate: "bg-green-500/10 text-green-700 border-green-500/20",
    resume: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    other: "bg-muted text-muted-foreground border-border",
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Documents</CardTitle>
          <Button size="sm" onClick={() => setShowUpload(true)} className="gap-2"><Plus className="h-4 w-4" />Upload</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents?.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{doc.document_name}</p>
                    <p className="text-xs text-muted-foreground">{doc.file_name} • {formatFileSize(doc.file_size)} • {format(new Date(doc.created_at), "MMM dd, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={typeColors[doc.document_type] || typeColors.other} variant="outline">{doc.document_type}</Badge>
                  <Button size="icon" variant="ghost" onClick={() => handleDownload(doc.file_path, doc.file_name)}><Download className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(doc.id, doc.file_path)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
            {(!documents || documents.length === 0) && <p className="text-center text-muted-foreground py-8">No documents uploaded yet</p>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Document Name</Label><Input value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="e.g., Employment Contract" /></div>
            <div>
              <Label>Document Type</Label>
              <Select value={docType} onValueChange={(v) => setDocType(v as DocumentType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="id_copy">ID Copy</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="resume">Resume</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>File</Label>
              <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
            <Button onClick={handleUpload} disabled={uploading} className="gap-2"><Upload className="h-4 w-4" />{uploading ? "Uploading..." : "Upload"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
