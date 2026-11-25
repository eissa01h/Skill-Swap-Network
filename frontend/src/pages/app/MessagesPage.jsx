import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { EmptyState } from '../../components/ui/Feedback/EmptyState';
import { Spinner } from '../../components/ui/Feedback/Spinner';
import { messageService } from '../../services/messageService';
import { searchService } from '../../services/searchService';

export function MessagesPage() {
  const [searchParams] = useSearchParams();
  const queryPartnerId = searchParams.get('partnerId');
  const queryPartnerName = searchParams.get('partnerName');
  const queryPartnerAvatar = searchParams.get('avatar');

  const [conversations, setConversations] = useState([]);
  const [activePartnerId, setActivePartnerId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [restrictedAlert, setRestrictedAlert] = useState({ show: false, name: '' });

  // New Chat modal state
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availablePartners, setAvailablePartners] = useState([]);
  const [partnerSearchQuery, setPartnerSearchQuery] = useState('');
  const [loadingPartners, setLoadingPartners] = useState(false);

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await messageService.getConversations();
        let convs = data || [];

        if (queryPartnerId) {
          const eligible = await messageService.canMessagePartner(queryPartnerId, queryPartnerName);
          if (!eligible) {
            setRestrictedAlert({
              show: true,
              name: queryPartnerName || 'this member',
            });
          } else {
            const existing = convs.find(c => c.partner?.id === queryPartnerId || c.id === queryPartnerId || (queryPartnerName && c.partner?.name?.toLowerCase() === queryPartnerName.toLowerCase()));
            if (existing) {
              setActivePartnerId(existing.partner?.id || existing.id);
            } else {
              const newThread = {
                id: `conv_${queryPartnerId}`,
                partner: {
                  id: queryPartnerId,
                  name: queryPartnerName || 'Community Partner',
                  avatar: queryPartnerAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
                  status: 'Online',
                },
                thread: [
                  {
                    id: `t_${Date.now()}_0`,
                    sender: queryPartnerName ? queryPartnerName.split(' ')[0] : 'Partner',
                    text: 'Hi! I accepted your swap proposal. Looking forward to practicing and exchanging skills together!',
                    time: 'Yesterday',
                    isSelf: false,
                  },
                ],
              };
              convs = [newThread, ...convs];
              setActivePartnerId(queryPartnerId);

              try {
                const storedConvs = JSON.parse(localStorage.getItem('ssn_messages') || '[]');
                if (!storedConvs.some(c => c.partner?.id === queryPartnerId || c.id === queryPartnerId)) {
                  localStorage.setItem('ssn_messages', JSON.stringify([newThread, ...(storedConvs.length > 0 ? storedConvs : (data || []))]));
                }
              } catch {
                // storage safeguard
              }
            }
          }
        } else if (convs.length > 0) {
          setActivePartnerId(convs[0].partner.id);
        }
        setConversations(convs);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [queryPartnerId, queryPartnerName, queryPartnerAvatar]);

  const activeConv = conversations.find(c => c.partner?.id === activePartnerId || c.id === activePartnerId) || conversations[0];

  const handleOpenNewChat = async () => {
    setShowNewChatModal(true);
    setLoadingPartners(true);
    try {
      const list = await messageService.getEligibleChatPartners();
      setAvailablePartners(list || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPartners(false);
    }
  };

  const handleSelectNewChatPartner = (partner) => {
    const existing = conversations.find(c => c.partner?.id === partner.id);
    if (!existing) {
      const newConv = {
        id: `conv_${partner.id}`,
        partner: {
          id: partner.id,
          name: partner.name,
          avatar: partner.avatar,
          status: 'Online',
        },
        thread: [],
      };
      setConversations([newConv, ...conversations]);
    }
    setActivePartnerId(partner.id);
    setShowNewChatModal(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartnerId) return;

    try {
      await messageService.sendMessage(activePartnerId, inputText, activeConv?.partner);
      const updated = await messageService.getConversations();
      setConversations(updated);
      setInputText('');
    } catch (err) {
      alert(err.message || 'Direct messaging is only permitted with accepted swap partners and friends.');
    }
  };

  const handleConfirmDeleteMessage = async () => {
    if (!activePartnerId || !messageToDelete) return;
    await messageService.deleteMessage(activePartnerId, messageToDelete.id);
    const updated = await messageService.getConversations();
    setConversations(updated);
    setMessageToDelete(null);
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
      {restrictedAlert.show && (
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#92400e', fontSize: 'var(--font-size-sm)' }}>
          <span>🔒 <strong>Direct Messaging Restricted:</strong> You can only message members who have accepted your swap proposal or are your friends ({restrictedAlert.name} has not yet accepted a swap or connected).</span>
          <button onClick={() => setRestrictedAlert({ show: false, name: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {conversations.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No Active Discussions"
          description="You don't have any open direct messages yet. Connect with a partner or start a new chat to begin learning together!"
          actionLabel="✏️ Start a Chat"
          onAction={handleOpenNewChat}
        />
      ) : (
        <div className="card-surface" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', height: '640px', overflow: 'hidden' }}>
          {/* Left Column: Conversation List */}
          <div style={{ borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700, fontSize: 'var(--font-size-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span>Conversations</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginLeft: '6px' }}>({conversations.length})</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenNewChat}
                style={{
                  padding: '4px 10px',
                  fontSize: 'var(--font-size-xs)',
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  border: 'none',
                  fontWeight: 600,
                }}
              >
                ✏️ New Chat
              </Button>
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
                          onClick={() => setMessageToDelete(msg)}
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

      {/* Delete Message Confirmation Modal */}
      <Modal
        isOpen={!!messageToDelete}
        onClose={() => setMessageToDelete(null)}
        title="Delete Message?"
      >
        {messageToDelete && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Are you sure you want to delete this message? This action cannot be undone.
            </p>

            {/* Message Preview Box */}
            <div
              style={{
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'var(--color-slate-50)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-primary)',
                fontStyle: 'italic',
                wordBreak: 'break-word',
                borderLeft: '3px solid var(--color-danger, #dc2626)',
              }}
            >
              "{messageToDelete.text}"
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMessageToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDeleteMessage}
              >
                Delete Message
              </Button>
            </div>
          </div>
        )}
      </Modal>

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

      {/* New Chat Modal */}
      <Modal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        title="Start a Chat with a Partner or Friend"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            Direct messaging is available with <strong>accepted swap partners</strong> and <strong>friends</strong>:
          </p>

          <input
            type="text"
            placeholder="Filter partners or friends by name..."
            value={partnerSearchQuery}
            onChange={(e) => setPartnerSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: 'var(--font-size-sm)',
            }}
          />

          <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {loadingPartners ? (
              <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                <Spinner size="sm" message="Loading your swap partners & friends..." />
              </div>
            ) : availablePartners.length === 0 ? (
              <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🤝</div>
                <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                  No accepted swap partners or friends yet
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>
                  Send a swap proposal or add friends in the directory to begin messaging!
                </p>
                <Link to="/app/find-partners" style={{ marginTop: 'var(--space-4)', display: 'inline-block' }}>
                  <Button variant="primary" size="sm">
                    Browse Partners & Friends →
                  </Button>
                </Link>
              </div>
            ) : (
              availablePartners
                .filter(p => !partnerSearchQuery.trim() || p.name.toLowerCase().includes(partnerSearchQuery.toLowerCase()))
                .map(partner => (
                  <div
                    key={partner.id}
                    onClick={() => handleSelectNewChatPartner(partner)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      border: '1px solid var(--border-subtle)',
                      transition: 'background var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-50)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <img
                      src={partner.avatar}
                      alt={partner.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{partner.name}</span>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: partner.relationship === 'Friend' ? '#fdf2f8' : '#eff6ff',
                          color: partner.relationship === 'Friend' ? '#db2777' : '#1d4ed8',
                          border: `1px solid ${partner.relationship === 'Friend' ? '#fbcfe8' : '#bfdbfe'}`,
                        }}>
                          {partner.relationship === 'Friend' ? '⭐ Friend' : '🤝 Swap Partner'}
                        </span>
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {partner.title || 'Connected'}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" style={{ pointerEvents: 'none' }}>
                      💬 Chat
                    </Button>
                  </div>
                ))
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <Button variant="outline" size="sm" onClick={() => setShowNewChatModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}

