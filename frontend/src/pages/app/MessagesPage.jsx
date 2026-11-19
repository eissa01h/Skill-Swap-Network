import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button/Button';
import { Spinner } from '../../components/ui/Feedback/Spinner';
import { messageService } from '../../services/messageService';

export function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [activePartnerId, setActivePartnerId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await messageService.getConversations();
        setConversations(data);
        if (data.length > 0) {
          setActivePartnerId(data[0].partner.id);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeConv = conversations.find(c => c.partner.id === activePartnerId) || conversations[0];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartnerId) return;

    await messageService.sendMessage(activePartnerId, inputText);
    const updated = await messageService.getConversations();
    setConversations(updated);
    setInputText('');
  };

  if (loading) {
    return (
      <AppLayout title="Direct Messages">
        <Spinner size="lg" message="Loading discussions..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Peer Discussions"
      subtitle="Coordinate lesson plans, share code snippets and learning materials with your swap partners."
    >
      <div className="card-surface" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', height: '640px', overflow: 'hidden' }}>
        {/* Left Column: Conversation List */}
        <div style={{ borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700, fontSize: 'var(--font-size-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Active Conversations</span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{conversations.length} partners</span>
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {conversations.map(conv => {
              const lastMsg = conv.thread[conv.thread.length - 1];
              const isSelected = conv.partner.id === activePartnerId;

              return (
                <div
                  key={conv.partner.id}
                  onClick={() => setActivePartnerId(conv.partner.id)}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--color-primary-50)' : 'transparent',
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background var(--transition-fast)',
                  }}
                >
                  <img
                    src={conv.partner.avatar}
                    alt={conv.partner.name}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <strong style={{ fontSize: 'var(--font-size-sm)', color: isSelected ? 'var(--color-primary-800)' : 'var(--text-primary)' }}>
                        {conv.partner.name}
                      </strong>
                      <span style={{ fontSize: '0.65rem', color: conv.partner.status === 'Online' ? 'var(--color-accent-600)' : 'var(--text-muted)' }}>
                        {conv.partner.status}
                      </span>
                    </div>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                      {lastMsg ? lastMsg.text : 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Thread */}
        {activeConv ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Thread Header */}
            <div style={{ padding: 'var(--space-3) var(--space-6)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-slate-50)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <img
                  src={activeConv.partner.avatar}
                  alt={activeConv.partner.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>{activeConv.partner.name}</h4>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-600)', fontWeight: 500 }}>
                    ● {activeConv.partner.status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <a href="/app/schedule">
                  <Button variant="outline" size="sm">📅 View Schedule</Button>
                </a>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', backgroundColor: '#fff' }}>
              {activeConv.thread.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: msg.isSelf ? 'flex-end' : 'flex-start',
                    maxWidth: '68%',
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

            {/* Message Input Bar */}
            <form onSubmit={handleSend} style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 'var(--space-3)', backgroundColor: 'var(--bg-surface)' }}>
              <input
                type="text"
                placeholder={`Type a message to ${activeConv.partner.name}... (Press Enter to send)`}
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
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
            Select a conversation on the left to start chatting.
          </div>
        )}
      </div>
    </AppLayout>
  );
}
