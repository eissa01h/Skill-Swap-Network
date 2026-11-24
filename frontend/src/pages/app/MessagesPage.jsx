import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { EmptyState } from '../../components/ui/Feedback/EmptyState';
import { Spinner } from '../../components/ui/Feedback/Spinner';
import { messageService } from '../../services/messageService';

export function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [activePartnerId, setActivePartnerId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await messageService.getConversations();
        setConversations(data || []);
        if (data && data.length > 0) {
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

  const handleDeleteMessage = async (messageId) => {
    if (!activePartnerId) return;
    await messageService.deleteMessage(activePartnerId, messageId);
    const updated = await messageService.getConversations();
    setConversations(updated);
  };

  const handleClearCurrentChat = async () => {
    const target = conversationToDelete || activeConv;
    if (!target) return;
    await messageService.clearConversation(target.partner.id);
    const updated = await messageService.getConversations();
    setConversations(updated);
    setShowDeleteModal(false);
    setConversationToDelete(null);
  };

  const handleDeleteEntireDM = async () => {
    const target = conversationToDelete || activeConv;
    if (!target) return;
    const targetId = target.partner.id;
    await messageService.deleteConversation(targetId);
    const updated = await messageService.getConversations();
    setConversations(updated);
    if (activePartnerId === targetId) {
      setActivePartnerId(updated.length > 0 ? updated[0].partner.id : null);
    }
    setShowDeleteModal(false);
    setConversationToDelete(null);
  };

  if (loading) {
    return (
      <AppLayout title="Direct Messages">
        <Spinner size="lg" message="Loading discussions..." />
      </AppLayout>
    );
  }

  const targetConvForModal = conversationToDelete || activeConv;

  return (
    <AppLayout
      title="Peer Discussions"
      subtitle="Coordinate lesson plans, share code snippets and learning materials with your swap partners."
    >
      {conversations.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No Active Discussions"
          description="You don't have any open direct messages yet. Connect with a partner to start learning together!"
          actionLabel="Find Partners"
          onAction={() => window.location.href = '/app/find-partners'}
        />
      ) : (
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
                      position: 'relative',
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
                        {lastMsg ? lastMsg.text : 'No messages'}
                      </p>
                    </div>

                    {/* Quick remove DM button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConversationToDelete(conv);
                      }}
                      title="Delete conversation"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: '4px 6px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        opacity: 0.5,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#dc2626'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      ✕
                    </button>
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
                  <Link to="/app/schedule">
                    <Button variant="outline" size="sm">📅 View Schedule</Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setConversationToDelete(null);
                      setShowDeleteModal(true);
                    }}
                    style={{ color: '#dc2626', borderColor: '#fca5a5', backgroundColor: '#fff' }}
                  >
                    🗑️ Delete DM
                  </Button>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', backgroundColor: '#fff' }}>
                {activeConv.thread.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>💬</div>
                    <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>No messages yet</p>
                    <p style={{ fontSize: 'var(--font-size-xs)' }}>Say hello to {activeConv.partner.name} to kick off your skill exchange!</p>
                  </div>
                ) : (
                  activeConv.thread.map(msg => (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: msg.isSelf ? 'flex-end' : 'flex-start',
                        maxWidth: '72%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.isSelf ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)',
                          flexDirection: msg.isSelf ? 'row-reverse' : 'row',
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
                            wordBreak: 'break-word',
                          }}
                        >
                          {msg.text}
                        </div>

                        {/* Delete Single Message Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(msg.id)}
                          title="Delete message"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            fontSize: '0.8rem',
                            padding: '4px',
                            borderRadius: 'var(--radius-sm)',
                            opacity: 0.6,
                            transition: 'opacity 0.15s, color 0.15s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#dc2626'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                        >
                          🗑️
                        </button>
                      </div>

                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', textAlign: msg.isSelf ? 'right' : 'left' }}>
                        {msg.time}
                      </div>
                    </div>
                  ))
                )}
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
      )}

      {/* Delete DM Modal */}
      <Modal
        isOpen={!!conversationToDelete || showDeleteModal}
        onClose={() => { setConversationToDelete(null); setShowDeleteModal(false); }}
        title="Manage Conversation"
      >
        {targetConvForModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Manage your direct message thread with <strong>{targetConvForModal.partner?.name}</strong>:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ padding: 'var(--space-3)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-slate-50)' }}>
                <strong>Clear Messages Only</strong>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Deletes all chat messages in this thread, keeping {targetConvForModal.partner?.name} in your partners list.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCurrentChat}
                  style={{ marginTop: 'var(--space-2)' }}
                >
                  🧹 Clear All Messages
                </Button>
              </div>

              <div style={{ padding: 'var(--space-3)', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', backgroundColor: '#fef2f2' }}>
                <strong style={{ color: '#b91c1c' }}>Delete Entire DM</strong>
                <p style={{ fontSize: 'var(--font-size-xs)', color: '#7f1d1d', marginTop: '2px' }}>
                  Permanently removes this conversation and history from your messages list.
                </p>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteEntireDM}
                  style={{ marginTop: 'var(--space-2)' }}
                >
                  🗑️ Delete Conversation
                </Button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setConversationToDelete(null); setShowDeleteModal(false); }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}

