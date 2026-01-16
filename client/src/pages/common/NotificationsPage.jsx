import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import {
  getNotificationsApi,
  markNotificationReadApi,
} from "../../services/notificationApi";

const badge = (type) => {
  if (type === "application") return "bg-blue-50 border-blue-200 text-blue-700";
  if (type === "status") return "bg-green-50 border-green-200 text-green-700";
  if (type === "job") return "bg-purple-50 border-purple-200 text-purple-700";
  return "bg-slate-50 border-slate-200 text-slate-700";
};

export default function NotificationsPage() {
  const { accessToken } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getNotificationsApi(accessToken);
      setNotifications(res.data.notifications || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await markNotificationReadApi(accessToken, id);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to mark as read");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white border p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Notifications
        </h1>
        <p className="text-slate-600 mt-1">
          Keep track of updates and activity.
        </p>
      </div>

      <div className="rounded-3xl bg-white border p-6 sm:p-8">
        {loading && <p className="text-slate-600">Loading...</p>}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <p className="text-slate-600">No notifications yet.</p>
        )}

        {!loading && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                  n.isRead ? "bg-white" : "bg-slate-50"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-extrabold text-slate-900">{n.title}</p>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${badge(
                        n.type
                      )}`}
                    >
                      {n.type}
                    </span>
                    {!n.isRead && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full border bg-yellow-50 border-yellow-200 text-yellow-800">
                        NEW
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-700">{n.message}</p>

                  <p className="text-xs text-slate-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!n.isRead ? (
                    <button
                      onClick={() => markRead(n._id)}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                    >
                      Mark Read
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">
                      Read
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
