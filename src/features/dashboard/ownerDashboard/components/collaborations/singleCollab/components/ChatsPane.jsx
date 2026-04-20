import { Circle, Paperclip, Search, SendHorizontal } from 'lucide-react';

const CONVERSATIONS = [
  {
    id: '1',
    name: 'Ava Morgan',
    campaign: 'Spring Launch UGC',
    preview: 'Looks good, I can deliver the first cut by Friday.',
    time: '2m',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Liam Carter',
    campaign: 'Tech Accessory Promo',
    preview: 'Can we align on the final posting window?',
    time: '21m',
    unread: 0,
    online: true,
  },
  {
    id: '3',
    name: 'Nora Bennett',
    campaign: 'Holiday Outfit Reel',
    preview: 'Contract signed. Waiting for your asset brief.',
    time: '1h',
    unread: 0,
    online: false,
  },
  {
    id: '4',
    name: 'Noah Davis',
    campaign: 'Product Demo Campaign',
    preview: 'I uploaded the draft video for review.',
    time: '3h',
    unread: 1,
    online: false,
  },
];

const MESSAGES = [
  {
    id: 'm1',
    sender: 'Ava Morgan',
    mine: false,
    text: 'Hi Maria, I finalized the script and shot list. Can I send the first draft by Friday afternoon?',
    time: '10:12',
  },
  {
    id: 'm2',
    sender: 'You',
    mine: true,
    text: 'Perfect. Friday works. Keep the intro under 8 seconds and include the CTA in the final frame.',
    time: '10:15',
  },
  {
    id: 'm3',
    sender: 'Ava Morgan',
    mine: false,
    text: 'Got it. I will upload a draft plus caption options in one thread.',
    time: '10:18',
  },
  {
    id: 'm4',
    sender: 'You',
    mine: true,
    text: 'Great. Once uploaded, I will review and sign off quickly so we keep the timeline green.',
    time: '10:21',
  },
];

export default function ChatsPane() {
  const activeConversation = CONVERSATIONS[0];

  return (
    <section className="rounded-xl border border-[#745CB4]/25 bg-linear-to-b from-[#241A3A]/70 to-[#1A112C]/70 backdrop-blur-md shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] min-h-[620px]">
        <aside className="border-b lg:border-b-0 lg:border-r border-[#745CB4]/25 bg-[#1A112C]/55 backdrop-blur-sm p-3.5">
          <div className="mb-3.5">
            <h3 className="text-lg font-semibold text-white">Conversations</h3>
            <p className="text-xs text-[#9CA3AF] mt-1">Mock preview with professional chat layout</p>
          </div>

          <label className="relative block mb-3.5">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value=""
              readOnly
              placeholder="Search chats"
              className="w-full rounded-lg border border-[#745CB4]/25 bg-[#241A3A]/55 text-sm text-white placeholder:text-[#9CA3AF] pl-9 pr-3 py-2.5"
            />
          </label>

          <div className="space-y-2.5">
            {CONVERSATIONS.map((conversation, index) => (
              <button
                key={conversation.id}
                type="button"
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  index === 0
                    ? 'border-[#C1B6FD]/40 bg-[#241A3A]/75'
                    : 'border-[#745CB4]/20 bg-[#1A112C]/40 hover:bg-[#241A3A]/55'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white truncate">{conversation.name}</span>
                      <Circle
                        className={`w-2.5 h-2.5 ${conversation.online ? 'fill-green-400 text-green-400' : 'fill-[#9CA3AF] text-[#9CA3AF]'}`}
                      />
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] truncate mt-0.5">{conversation.campaign}</p>
                  </div>
                  <span className="text-[11px] text-[#9CA3AF] shrink-0">{conversation.time}</span>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-xs text-[#C1B6FD] truncate">{conversation.preview}</p>
                  {conversation.unread > 0 ? (
                    <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-[#745CB4]/70 text-white text-[11px] font-semibold">
                      {conversation.unread}
                    </span>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex flex-col bg-[#1A112C]/40 backdrop-blur-sm">
          <header className="p-4 border-b border-[#745CB4]/25 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-base font-semibold text-white truncate">{activeConversation.name}</h4>
              <p className="text-xs text-[#9CA3AF] truncate">{activeConversation.campaign}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-green-500/30 bg-green-500/15 text-green-300 text-xs">
              <Circle className="w-2.5 h-2.5 fill-green-300 text-green-300" />
              Live chat
            </span>
          </header>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {MESSAGES.map((message) => (
              <div key={message.id} className={`flex ${message.mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 border ${
                    message.mine
                      ? 'bg-[#745CB4]/65 border-[#C1B6FD]/30 text-white'
                      : 'bg-[#241A3A]/60 border-[#745CB4]/25 text-[#E5E7EB]'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-[11px] mt-1.5 ${message.mine ? 'text-[#E5D9FF]' : 'text-[#9CA3AF]'}`}>{message.time}</p>
                </div>
              </div>
            ))}
          </div>

          <footer className="p-4 border-t border-[#745CB4]/25 bg-[#1A112C]/45">
            <div className="rounded-xl border border-[#745CB4]/25 bg-[#241A3A]/50 flex items-center gap-2 pl-2.5 pr-2 py-2">
              <button type="button" className="p-2 rounded-lg text-[#C1B6FD] hover:bg-[#745CB4]/20 transition-colors" aria-label="Attach file">
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value=""
                readOnly
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-[#9CA3AF] focus:outline-none"
              />
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#C1B6FD]/35 bg-[#745CB4]/65 text-white text-sm font-medium"
              >
                <SendHorizontal className="w-4 h-4" />
                Send
              </button>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}
