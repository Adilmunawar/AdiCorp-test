import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Loader2, Shield, Fingerprint, ScanFace, Smartphone, Monitor, 
  CheckCircle, AlertCircle, Lock, Unlock, Trash2, ShieldCheck,
  Eye, EyeOff, KeyRound, Cpu, Laptop, TabletSmartphone
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useBiometric, DeviceCapabilities } from "@/hooks/useBiometric";
import { useActivityLogger } from "@/hooks/useActivityLogger";

function DeviceCapabilityCard({ capabilities }: { capabilities: DeviceCapabilities }) {
  const DeviceIcon = capabilities.deviceType === 'mobile' ? Smartphone : 
                     capabilities.deviceType === 'tablet' ? TabletSmartphone : Laptop;
  
  const biometricLabels: Record<string, { label: string; icon: typeof Fingerprint }> = {
    'face': { label: 'Face Recognition', icon: ScanFace },
    'fingerprint': { label: 'Fingerprint', icon: Fingerprint },
    'windows-hello': { label: 'Windows Hello', icon: Monitor },
    'iris': { label: 'Iris Scanner', icon: Eye },
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" />
          Device Capabilities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <DeviceIcon className="h-8 w-8 text-primary" />
          <div>
            <p className="font-medium text-sm text-foreground">{capabilities.os} — {capabilities.deviceType}</p>
            <p className="text-xs text-muted-foreground">
              {capabilities.isSecureContext ? 'Secure context ✓' : 'Not secure context ✗'}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">WebAuthn Support</span>
            <Badge variant={capabilities.webauthn ? "default" : "secondary"} className="text-xs">
              {capabilities.webauthn ? 'Supported' : 'Not Available'}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Platform Authenticator</span>
            <Badge variant={capabilities.platformAuthenticator ? "default" : "secondary"} className="text-xs">
              {capabilities.platformAuthenticator ? 'Available' : 'Not Available'}
            </Badge>
          </div>
        </div>

        {capabilities.biometricType.length > 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Available Biometric Methods:</p>
            <div className="flex flex-wrap gap-2">
              {capabilities.biometricType.map((type) => {
                const info = biometricLabels[type] || { label: type, icon: Shield };
                const Icon = info.icon;
                return (
                  <div key={type} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
                    <Icon className="h-3.5 w-3.5" />
                    {info.label}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!capabilities.platformAuthenticator && (
          <Alert className="border-amber-500/20 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700 text-xs">
              No biometric hardware detected. Biometric features require a device with Face ID, Touch ID, fingerprint sensor, or Windows Hello.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function TOTPSetup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isUnenrolling, setIsUnenrolling] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [existingFactorId, setExistingFactorId] = useState<string | null>(null);

  useEffect(() => {
    checkExistingFactors();
  }, []);

  const checkExistingFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      const totpFactor = data?.totp?.find(f => f.status === 'verified');
      if (totpFactor) {
        setIsEnabled(true);
        setExistingFactorId(totpFactor.id);
      }
    } catch (error) {
      console.error('Error checking MFA factors:', error);
    }
  };

  const handleEnroll = async () => {
    try {
      setIsEnrolling(true);
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'AdiCorp Authenticator',
      });
      if (error) throw error;
      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
    } catch (error: any) {
      toast({ title: "2FA Setup Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleVerify = async () => {
    if (!factorId || verifyCode.length !== 6) return;
    try {
      setIsVerifying(true);
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: verifyCode,
      });
      if (verifyError) throw verifyError;

      setIsEnabled(true);
      setExistingFactorId(factorId);
      setQrCode(null);
      setSecret(null);
      setFactorId(null);
      setVerifyCode("");
      await logActivity({
        actionType: '2fa_enabled',
        description: 'User enabled two-factor authentication',
        details: { method: 'totp' },
      });
      toast({ title: "2FA Enabled!", description: "Two-factor authentication is now active." });
    } catch (error: any) {
      toast({ title: "Verification Failed", description: error.message || "Invalid code. Please try again.", variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUnenroll = async () => {
    if (!existingFactorId) return;
    try {
      setIsUnenrolling(true);
      const { error } = await supabase.auth.mfa.unenroll({ factorId: existingFactorId });
      if (error) throw error;
      setIsEnabled(false);
      setExistingFactorId(null);
      await logActivity({
        actionType: '2fa_disabled',
        description: 'User disabled two-factor authentication',
        details: { method: 'totp' },
      });
      toast({ title: "2FA Disabled", description: "Two-factor authentication has been removed." });
    } catch (error: any) {
      toast({ title: "Failed to disable 2FA", description: error.message, variant: "destructive" });
    } finally {
      setIsUnenrolling(false);
    }
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" />
          Two-Factor Authentication (2FA)
        </CardTitle>
        <CardDescription>Add an extra layer of security with a time-based one-time password</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEnabled ? (
          <div className="space-y-4">
            <Alert className="border-green-500/20 bg-green-500/10">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-700">2FA is Active</AlertTitle>
              <AlertDescription className="text-green-600 text-sm">
                Your account is protected with two-factor authentication.
              </AlertDescription>
            </Alert>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleUnenroll} 
              disabled={isUnenrolling}
            >
              {isUnenrolling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Disable 2FA
            </Button>
          </div>
        ) : qrCode ? (
          <div className="space-y-4">
            <Alert className="border-blue-500/20 bg-blue-500/10">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700 text-sm">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-center p-4 bg-background rounded-lg border border-border">
              <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
            </div>

            {secret && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Manual Entry Key:</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={showSecret ? secret : '•'.repeat(secret.length)} 
                    readOnly 
                    className="font-mono text-xs"
                  />
                  <Button variant="ghost" size="icon" onClick={() => setShowSecret(!showSecret)}>
                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="totp-code">Enter 6-digit verification code</Label>
              <div className="flex gap-2">
                <Input
                  id="totp-code"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="font-mono text-center text-lg tracking-widest"
                />
                <Button onClick={handleVerify} disabled={verifyCode.length !== 6 || isVerifying}>
                  {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button onClick={handleEnroll} disabled={isEnrolling} className="w-full">
            {isEnrolling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
            Set Up 2FA
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function BiometricSetup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  const { 
    capabilities, isRegistered, isLockEnabled, loading,
    registerBiometric, enableLock, disableLock, removeBiometric 
  } = useBiometric();

  const [isRegistering, setIsRegistering] = useState(false);

  if (loading || !capabilities) {
    return (
      <Card className="glass-card border-border/50">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Detecting device capabilities...</span>
        </CardContent>
      </Card>
    );
  }

  const handleRegister = async () => {
    if (!user?.id) return;
    setIsRegistering(true);
    const success = await registerBiometric(user.id);
    setIsRegistering(false);
    if (success) {
      await logActivity({
        actionType: 'biometric_registered',
        description: 'User registered biometric authentication',
        details: { os: capabilities.os, deviceType: capabilities.deviceType },
      });
      toast({ title: "Biometric Registered!", description: "You can now use biometric authentication to lock/unlock the app." });
    } else {
      toast({ title: "Registration Failed", description: "Could not register biometric. Try again or check device settings.", variant: "destructive" });
    }
  };

  const handleRemove = async () => {
    removeBiometric();
    await logActivity({
      actionType: 'biometric_removed',
      description: 'User removed biometric authentication',
      details: {},
    });
    toast({ title: "Biometric Removed", description: "Biometric authentication has been removed from this device." });
  };

  const handleToggleLock = (enabled: boolean) => {
    if (enabled) {
      enableLock();
      toast({ title: "App Lock Enabled", description: "The app will require biometric verification when reopened." });
    } else {
      disableLock();
      toast({ title: "App Lock Disabled", description: "Biometric lock has been turned off." });
    }
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Fingerprint className="h-4 w-4 text-primary" />
          Biometric Authentication
        </CardTitle>
        <CardDescription>
          Use your device's biometric features (Face ID, fingerprint, Windows Hello) to lock and unlock the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DeviceCapabilityCard capabilities={capabilities} />

        {capabilities.platformAuthenticator ? (
          <div className="space-y-4">
            {isRegistered ? (
              <>
                <Alert className="border-green-500/20 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-700">Biometric Registered</AlertTitle>
                  <AlertDescription className="text-green-600 text-sm">
                    Your biometric credential is set up on this device.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center gap-3">
                    {isLockEnabled ? <Lock className="h-5 w-5 text-primary" /> : <Unlock className="h-5 w-5 text-muted-foreground" />}
                    <div>
                      <p className="text-sm font-medium text-foreground">App Lock</p>
                      <p className="text-xs text-muted-foreground">Require biometric to unlock app on each visit</p>
                    </div>
                  </div>
                  <Switch checked={isLockEnabled} onCheckedChange={handleToggleLock} />
                </div>

                <Button variant="outline" size="sm" onClick={handleRemove} className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Biometric
                </Button>
              </>
            ) : (
              <Button onClick={handleRegister} disabled={isRegistering} className="w-full">
                {isRegistering ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Fingerprint className="mr-2 h-4 w-4" />
                )}
                Register Biometric
              </Button>
            )}
          </div>
        ) : (
          <Alert className="border-muted bg-muted/30">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <AlertDescription className="text-muted-foreground text-sm">
              Biometric authentication is not available on this device. You can still use 2FA for additional security.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export default function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TOTPSetup />
        <BiometricSetup />
      </div>
    </div>
  );
}
