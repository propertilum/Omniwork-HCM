import React, { useState } from 'react';
import {
  MessageSquare, Plus, Bell, Calendar, Tag, AlertCircle,
  FileText, Check, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHCM } from '../../context/HCMContext';
import Badge from '../common/Badge';

export default function CommsView() {
  const { userProfile } = useAuth();
  const { announcements, postAnnouncement } = useHCM();

  const isHRorAdmin = userProfile?.role === "Admin" || userProfile?.role === "HR";

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Corporate");
  const [priority, setPriority] = useState("Medium");

  const handlePost = async (e) => {
    e.preventDefault();
    const newAnn = {
      id: `ANN-${Date.now()}`,
      title,
      content,
      category,
      priority,
      date: "Just now",
      author: `${userProfile?.name || "Corporate Executive"} (${userProfile?.role || "Admin"})`
    };

    await postAnnouncement(newAnn);
    setTitle("");
    setContent("");
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* HEADER */}
      <div className="bg-[#0D121F] border border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Communications & Broadcast Network</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Corporate Announcements</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time executive news, policy updates, and organization notices.
          </p>
        </div>

        {isHRorAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Announcement</span>
          </button>
        )}
      </div>

      {/* CREATE ANNOUNCEMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D121F] border border-slate-800 p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm">Draft Corporate Broadcast</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handlePost} className="space-y-3">
              <div>
                <label className="block mb-1 text-slate-400">Subject / Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Annual Company Offsite 2026 Announcement"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-400">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Corporate">Corporate</option>
                    <option value="HR Notice">HR Notice</option>
                    <option value="IT & Security">IT & Security</option>
                    <option value="Town Hall">Town Hall</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">Priority Level</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Urgent Alert)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-400">Message Content *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Compose corporate broadcast details..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500 resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT FEED */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="bg-[#0D121F] border border-slate-800 hover:border-slate-700/80 p-5 rounded-xl space-y-3 shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-sm">{ann.title}</span>
                <Badge variant={ann.priority === "High" ? "rose" : "default"} size="xs">
                  {ann.priority}
                </Badge>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
                <span>{ann.date}</span>
                <span>•</span>
                <span className="text-cyan-400 font-semibold">{ann.author}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {ann.content}
            </p>

            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Category: {ann.category}
              </span>
              <span>OmniWork Broadcast Core</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
