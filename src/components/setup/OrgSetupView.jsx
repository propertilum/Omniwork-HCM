import React, { useState } from 'react';
import {
  Building, MapPin, Clock, ShieldCheck, Check, AlertTriangle, Save
} from 'lucide-react';
import { useHCM } from '../../context/HCMContext';

export default function OrgSetupView() {
  const { settings, saveSettings } = useHCM();
  const [formData, setFormData] = useState({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveSettings({
      ...formData,
      graceMinutes: Number(formData.graceMinutes) || 15,
      halfDayHours: Number(formData.halfDayHours) || 5,
      radiusMeters: Number(formData.radiusMeters) || 150,
      lat: Number(formData.lat) || 24.8607,
      lng: Number(formData.lng) || 67.0011,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleWeekend = (day) => {
    const current = formData.weekendDays || [];
    if (current.includes(day)) {
      setFormData({ ...formData, weekendDays: current.filter(d => d !== day) });
    } else {
      setFormData({ ...formData, weekendDays: [...current, day] });
    }
  };

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-xs select-none">
      <div className="bg-[#0D121F] border border-slate-800 p-5 rounded-xl flex items-center justify-between shadow-xl">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5" />
            <span>Module 2 • Global Enterprise Infrastructure</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Organization Setup & Geofence Rules</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure global shift timing, grace windows, GPS geofence radius, and attendance rules.
          </p>
        </div>

        {saveSuccess && (
          <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-semibold flex items-center space-x-1">
            <Check className="w-3.5 h-3.5" />
            <span>Saved Globally</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ORGANIZATION IDENTITY */}
        <div className="bg-[#0D121F] border border-slate-800 p-5 rounded-xl space-y-4 shadow-md">
          <div className="font-bold text-white border-b border-slate-800 pb-2">
            1. Enterprise Corporate Identity
          </div>

          <div>
            <label className="block mb-1 text-slate-400 font-medium">Official Legal Entity Name *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500 font-sans"
            />
          </div>
        </div>

        {/* SHIFT & TIMING PARAMETERS */}
        <div className="bg-[#0D121F] border border-slate-800 p-5 rounded-xl space-y-4 shadow-md">
          <div className="font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>2. Shift Schedule & Penalty Policies</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-slate-400">Official Shift Start Time</label>
              <input
                type="time"
                value={formData.officeStart || '09:00'}
                onChange={e => setFormData({ ...formData, officeStart: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white font-mono outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-400">Grace Period (Minutes)</label>
              <input
                type="number"
                value={formData.graceMinutes || 15}
                onChange={e => setFormData({ ...formData, graceMinutes: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white font-mono outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-400">Half-Day Threshold (Hours)</label>
              <input
                type="number"
                value={formData.halfDayHours || 5}
                onChange={e => setFormData({ ...formData, halfDayHours: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white font-mono outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-slate-400">Late Penalty Deductions Rule Formula</label>
            <input
              type="text"
              value={formData.latePenaltyRule || ''}
              onChange={e => setFormData({ ...formData, latePenaltyRule: e.target.value })}
              className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block mb-2 text-slate-400">Designated Corporate Weekend Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => {
                const isSelected = (formData.weekendDays || []).includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleWeekend(day)}
                    className={`px-3 py-1.5 rounded-lg border font-mono transition cursor-pointer ${
                      isSelected
                        ? "bg-cyan-950 text-cyan-300 border-cyan-700/80 font-bold"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* GPS GEOFENCE COORDINATES */}
        <div className="bg-[#0D121F] border border-slate-800 p-5 rounded-xl space-y-4 shadow-md">
          <div className="font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>3. Office Coordinates & Geofence Perimeter</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-slate-400">Office Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.lat}
                onChange={e => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white font-mono outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-400">Office Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.lng}
                onChange={e => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white font-mono outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-400">Geofence Radius (Meters)</label>
              <input
                type="number"
                value={formData.radiusMeters}
                onChange={e => setFormData({ ...formData, radiusMeters: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white font-mono outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer text-sm"
        >
          <Save className="w-4 h-4" />
          <span>Save Organization Rules to Cloud</span>
        </button>
      </form>
    </div>
  );
}
