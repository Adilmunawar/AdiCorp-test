
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Building, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { toast as sonnerToast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  phone: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  address: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

interface CompanySetupFormProps { isOpen?: boolean; onComplete?: () => void; }

export default function CompanySetupForm({ onComplete }: CompanySetupFormProps) {
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: { name: "", phone: "", website: "", address: "" } });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]; setLogoFile(file);
      const reader = new FileReader(); reader.onload = () => setLogoPreview(reader.result as string); reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (values: FormValues) => {
    try {
      if (!user) { toast({ title: "Authentication required", description: "Please log in.", variant: "destructive" }); return; }
      setIsLoading(true);
      let logoUrl = null;
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const filePath = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('logos').upload(filePath, logoFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(filePath);
        logoUrl = publicUrl;
      }
      const { data: companyData, error: companyError } = await supabase.from('companies').insert({ name: values.name, phone: values.phone || null, website: values.website || null, address: values.address || null, logo: logoUrl }).select('*').single();
      if (companyError) throw companyError;
      const { error: profileError } = await supabase.from('profiles').update({ company_id: companyData.id, is_admin: true }).eq('id', user.id);
      if (profileError) throw profileError;
      await refreshProfile();
      sonnerToast.success("Company setup complete", { description: "Your company has been successfully configured." });
      if (onComplete) onComplete();
    } catch (error: any) {
      console.error("Error setting up company:", error);
      toast({ title: "Failed to setup company", description: error.message || "Please try again.", variant: "destructive" });
    } finally { setIsLoading(false); }
  };
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center"><Building className="mr-2 h-5 w-5 text-primary" />Setup Your Company</CardTitle>
        <CardDescription>Enter your company details to get started with AdiCorp HR Management.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Company Name*</FormLabel><FormControl><Input {...field} placeholder="e.g. Acme Corporation" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} placeholder="e.g. +1 (555) 123-4567" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website</FormLabel><FormControl><Input {...field} placeholder="e.g. https://www.example.com" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} placeholder="e.g. 123 Main Street, City, Country" /></FormControl><FormMessage /></FormItem>)} />
            <div className="space-y-2">
              <Label>Company Logo</Label>
              <div className="flex items-center space-x-3">
                {logoPreview ? (
                  <div className="relative w-12 h-12 rounded bg-muted overflow-hidden">
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                    <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null); }} className="absolute top-0 right-0 bg-black/50 text-white p-1 rounded-bl">×</button>
                  </div>
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center rounded bg-muted border border-border"><Building className="h-6 w-6 text-muted-foreground" /></div>
                )}
                <div>
                  <label htmlFor="logo-upload" className="cursor-pointer px-4 py-2 rounded text-sm bg-muted hover:bg-accent border border-border flex items-center"><Upload className="mr-2 h-4 w-4" />Upload Logo</label>
                  <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  <p className="text-xs text-muted-foreground mt-1">Optional. PNG or JPG recommended</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !form.formState.isValid} className="w-full">
              {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Setting Up...</>) : "Complete Setup"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
