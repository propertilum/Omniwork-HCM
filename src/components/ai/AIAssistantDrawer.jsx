import React, { useState } from 'react';
import {
  X, Bot, Sparkles, Send, Calendar, Check, CornerDownRight, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHCM } from '../../context/HCMContext';
import { generateCopilotResponse } from '../../utils/geminiMock';

export default function AIAssistantDrawer({ isOpen, onClose, onSmartLeaveParsed }) {
  const { userProfile } = useAuth();
  const { settings } = useHCM();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: `Hello ${userProfile?.name?.split(' ')[0] || "there"}! I'm your OmniWork Gemini HR Copilot.\n\nAsk me about office policies, salary structures, or simply tell me when you need time off (e.g. *"I need 2 days sick leave starting tomorrow"*).`,
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { role: "user", text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateCopilotResponse(query, { userProfile, settings });
      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: response.text,
          smartLeave: response.smartLeave
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  const QUICK_PROMPTS = [
    "I need 2 days sick leave starting tomorrow",
    "What is the office late penalty and grace period?",
    "Calculate my expected take-home salary & allowances",
    "What are my annual leave entitlements?"
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end select-none animate-in fade-in">
      <div className="w-full max-w-md bg-[#0D121F] border-l border-slate-800 h-full flex flex-col shadow-2xl text-xs animate-in slide-in-from-right duration-300">
        {/* DRAWER HEADER */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#090D16]">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center space-x-1.5">
                <span>Gemini HR Copilot</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">OmniWork Neural Intelligence</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CHAT MESSAGES BODY */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-cyan-600 text-white font-medium"
                    : "bg-[#090D16] border border-slate-800 text-slate-200"
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {m.smartLeave && (
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => onSmartLeaveParsed(m.smartLeave)}
                      className="w-full py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-md"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Review & Submit {m.smartLeave.days}-Day Application</span>
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">
                {m.role === "user" ? "You" : "Gemini AI"}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
              <span className="font-mono text-[11px]">Gemini is analyzing query...</span>
            </div>
          )}
        </div>

        {/* QUICK SUGGESTIONS */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0A0E18] space-y-1.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Suggested Queries:</span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="text-[10px] px-2 py-1 bg-[#0D121F] hover:bg-slate-800 text-slate-300 border border-slate-800 rounded transition text-left cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT BOX */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="p-3 border-t border-slate-800 bg-[#090D16] flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask HR copilot or type leave instruction..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#0D121F] border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-cyan-500 font-sans"
          />
          <button
            type="submit"
            className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
