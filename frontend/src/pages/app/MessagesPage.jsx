import React, { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button/Button';
import { MOCK_MESSAGES } from '../../utils/mockData';

export function MessagesPage() {
  const [conversations, setConversations] = useState(MOCK_MESSAGES);
  const [activePartnerId, setActivePartnerId] = useState(MOCK_MESSAGES[0].partner.id);
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find(c => c.partner.id === activePartnerId) || conversations[0];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `t_${Date.now()}`,
      sender: 'Sarah',
      text: inputText,
      time: 'Just now',
      isSelf: true,
    };

    setConversations(conversations.map(c => {
      if (c.partner.id === activePartnerId) {
        return {
          ...c,
          thread: [...c.thread, newMsg],
        };
      }
      return c;
    }));

    setInputText('');
  };

  return (
    <AppLayout
      title="Direct Messages"
      subtitle="Coordinate lesson agendas, share code repositories, and prepare for your skill swaps."
    >
      <div className="card-surface" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: '620px', overflow: 'hidden' }}>
        {/* Left: Chat List */}
        <div style={{ borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
            Active Discussions
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {conversations.map(conv => (
              <div
                key={conv.partner.id}
                onClick={() => setActivePartnerId(conv.partner.id)}
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  cursor: 'pointer',
                  backgroundColor: conv.partner.id === activePartnerId ? 'var(--color-primary-50)' : 'transparent',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <img
                  src={conv.partner.avatar}
                  alt={conv.partner.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: 'var(--font-size-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {conv.partner.name}
                    </strong>
                    <span style={{ fontSize: '0.65rem', color: conv.partner.status === 'Online' ? 'var(--color-accent-600)' : 'var(--text-muted)' }}>
                      {conv.partner.status}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                    {conv.thread[conv.thread.length - 1]?.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Message Thread */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Thread Header */}
          <div style={{ padding: 'var(--space-3) var(--space-6)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <img
              src={activeConv.partner.avatar}
              alt={activeConv.partner.name}
              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>{activeConv.partner.name}</h4>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-600)' }}>
                ● {activeConv.partner.status}
              </span>
            </div>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {activeConv.thread.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.isSelf ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                }}
              >
                <div
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 'var(--font-size-sm)',
                    lineHeight: 1.5,
                    backgroundColor: msg.isSelf ? 'var(--color-primary-600)' : 'var(--color-slate-100)',
                    color: msg.isSelf ? '#fff' : 'var(--text-primary)',
                    borderBottomRightRadius: msg.isSelf ? 2 : 'var(--radius-lg)',
                    borderBottomLeftRadius: msg.isSelf ? 'var(--radius-lg)' : 2,
                  }}
                >
                  {msg.text}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', textAlign: msg.isSelf ? 'right' : 'left' }}>
                  {msg.time}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 'var(--space-3)' }}>
            <input
              type="text"
              placeholder={`Message ${activeConv.partner.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                padding: 'var(--space-3)',
                fontSize: 'var(--font-size-sm)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            />
            <Button type="submit" variant="primary">Send</Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
