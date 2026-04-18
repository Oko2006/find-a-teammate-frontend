import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { Notification } from '../../types';
import { Bell, MessageSquare, UserPlus, Info, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { formatDate } from '../../lib/utils';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const { data } = await apiService.notifications.list();
        const results = data.results ? data.results : data;
        setNotifications(results);
      } catch (error) {
        console.error(error);
      }
    };
    loadNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await apiService.notifications.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="section-container py-12 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-display text-3xl text-slate-900 mb-2">Notifications</h1>
          <p className="text-slate-500">Stay updated on your team applications and messages.</p>
        </div>
        <Button variant="ghost" size="sm" className="text-slate-400 font-bold uppercase tracking-wider text-[10px]" onClick={markAllRead}>
          Mark all as read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notif, i) => {
          const Icon = notif.notification_type === 'application' ? UserPlus : notif.notification_type.includes('message') ? MessageSquare : Info;
          const iconColor = notif.notification_type === 'application' ? 'text-primary' : notif.notification_type.includes('message') ? 'text-amber-500' : 'text-slate-400';
          const bgColor = notif.notification_type === 'application' ? 'bg-primary/10' : notif.notification_type.includes('message') ? 'bg-amber-100' : 'bg-slate-100';

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-[32px] border ${notif.is_read ? 'bg-white border-slate-100' : 'bg-indigo-50/50 border-indigo-100'} transition-all hover:shadow-soft group`}
            >
              <div className="flex gap-6">
                <div className={`${bgColor} ${iconColor} w-12 h-12 rounded-2xl flex items-center justify-center shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-slate-950 text-lg leading-snug">{notif.notification_type}</h3>
                      <p className="text-slate-500 mt-1">{notif.message}</p>
                    </div>
                    {!notif.is_read && (
                      <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pb-2">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {formatDate(notif.created_at)}
                    </span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400">All caught up!</h3>
            <p className="text-slate-400">No new notifications for now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
