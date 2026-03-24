
import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Clock, User, Building2, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const { data: recentLogs = [], isLoading } = useQuery({
    queryKey: ['recent-notifications', userProfile?.company_id],
    queryFn: async () => {
      if (!userProfile?.company_id) return [];
      const { data, error } = await supabase.from('activity_logs').select(`*, profiles (first_name, last_name)`).eq('company_id', userProfile.company_id).order('created_at', { ascending: false }).limit(15);
      if (error) throw error;
      return data?.map(log => ({ ...log, user_name: log.profiles ? `${log.profiles.first_name || ''} ${log.profiles.last_name || ''}`.trim() || 'Unknown User' : 'System' })) || [];
    },
    enabled: !!userProfile?.company_id, refetchInterval: 30000,
  });

  const unreadCount = Math.min(recentLogs.filter(log => !readNotifications.has(log.id)).length, 9);
  const markAsRead = useCallback((logId: string) => setReadNotifications(prev => new Set([...prev, logId])), []);
  const markAllAsRead = useCallback(() => setReadNotifications(new Set(recentLogs.map(log => log.id))), [recentLogs]);

  const getActionIcon = (actionType: string) => {
    if (actionType.startsWith('employee')) return <User className="h-4 w-4 text-blue-500" />;
    if (actionType.startsWith('attendance')) return <Clock className="h-4 w-4 text-green-500" />;
    if (actionType === 'password_change') return <Building2 className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  const getPriorityColor = (p: string) => {
    if (p === 'high') return 'text-red-600 bg-red-500/10'; if (p === 'medium') return 'text-yellow-600 bg-yellow-500/10'; if (p === 'low') return 'text-green-600 bg-green-500/10'; return 'text-muted-foreground bg-muted';
  };

  const formatActionType = (t: string) => t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const getPriority = (details: any): string => { if (!details) return 'medium'; if (typeof details === 'object' && details !== null) return details.priority || 'medium'; return 'medium'; };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button variant="outline" size="icon" className="rounded-full"><Bell size={18} /></Button>
          {unreadCount > 0 && <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">{unreadCount > 9 ? '9+' : unreadCount}</Badge>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div><h3 className="font-semibold text-sm">Recent Activity</h3><p className="text-xs text-muted-foreground">Latest changes in your company</p></div>
            {unreadCount > 0 && <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs"><BellOff className="h-3 w-3 mr-1" />Clear All</Button>}
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          : recentLogs.length === 0 ? <div className="p-4 text-center text-sm text-muted-foreground">No recent activity</div>
          : <div className="divide-y divide-border">{recentLogs.map((log) => {
              const isRead = readNotifications.has(log.id);
              const priority = getPriority(log.details);
              return (
                <div key={log.id} className={`p-3 hover:bg-muted/50 transition-colors cursor-pointer ${!isRead ? 'bg-primary/5' : ''}`} onClick={() => markAsRead(log.id)}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getActionIcon(log.action_type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground">{formatActionType(log.action_type)}</p>
                        <div className="flex items-center gap-1">
                          <Badge className={`text-xs px-1 py-0 ${getPriorityColor(priority)}`}>{priority.toUpperCase()}</Badge>
                          <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                      <p className={`text-sm mt-1 line-clamp-2 ${!isRead ? 'font-medium' : ''} text-foreground`}>{log.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">by {log.user_name}</p>
                    </div>
                  </div>
                </div>
              );
            })}</div>}
        </div>
        {recentLogs.length > 0 && <div className="p-3 border-t border-border"><Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => { setIsOpen(false); navigate('/timeline-logs'); }}>View All Activity</Button></div>}
      </PopoverContent>
    </Popover>
  );
}
