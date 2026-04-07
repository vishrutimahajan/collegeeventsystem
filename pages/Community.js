import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Community.css";

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const ROLE_CONFIG = {
  head:        { label: "Head",        icon: "👑", cls: "role-badge--head" },
  coordinator: { label: "Coordinator", icon: "⚡", cls: "role-badge--coordinator" },
  member:      { label: "Member",      icon: "👤", cls: "role-badge--member" },
};

// ─── Shared Small Components ─────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.member;
  return (
    <span className={`role-badge ${cfg.cls}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const Avatar = ({ name, pic, size = 40, color = "#6366f1" }) => {
  const initials = (name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  if (pic) {
    return <img src={pic} alt={name} className="avatar" style={{ width: size, height: size }} />;
  }
  return (
    <div className="avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
};

// ─── Post Card ───────────────────────────────────────────────────────────────
const PostCard = ({ post, communityColor, onReact, onDelete, currentUser, canModerate }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const EMOJIS = ["👍", "❤️", "🔥", "🎉", "😮", "🤔"];

  return (
    <div className={`post-card${post.pinned ? " post-card--pinned" : ""}`}
      style={post.pinned ? { borderColor: communityColor } : {}}>

      {post.pinned && (
        <div className="post-tag post-tag--pinned" style={{ background: communityColor }}>
          📌 Pinned Post
        </div>
      )}
      {post.post_type === "announcement" && !post.pinned && (
        <div className="post-tag post-tag--announcement">📣 Announcement</div>
      )}

      <div className="post-body">
        <div className="post-header">
          <div className="post-author">
            <Avatar name={post.author_name} pic={post.author_pic} size={40} color={communityColor} />
            <div>
              <p className="post-author-name">{post.author_name}</p>
              <div className="post-author-meta">
                <RoleBadge role={post.author_role} />
                <span className="post-time">{timeAgo(post.created_at)}</span>
              </div>
            </div>
          </div>
          {(canModerate || post.author_id === currentUser.id) && (
            <button className="btn-delete" onClick={() => onDelete(post.id)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </button>
          )}
        </div>

        <p className="post-content">{post.content}</p>

        <div className="post-footer">
          <div className="emoji-picker-wrap">
            <button
              className={`btn-react${post.my_reaction ? " btn-react--active" : ""}`}
              onClick={() => setShowEmojiPicker(v => !v)}
            >
              <span>{post.my_reaction || "👍"}</span>
              <span>{post.reaction_count}</span>
            </button>
            {showEmojiPicker && (
              <div className="emoji-picker">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => { onReact(post.id, e); setShowEmojiPicker(false); }}>
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="btn-comment-toggle" onClick={() => setShowComments(v => !v)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{post.comment_count}</span>
          </button>
        </div>

        {showComments && (
          <div className="comment-section">
            <div className="comment-input-row">
              <Avatar name={currentUser.name} size={32} color={communityColor} />
              <input
                className="comment-input"
                placeholder="Write a comment…"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && commentText.trim()) setCommentText(""); }}
              />
              <button
                className="btn-send"
                style={{ background: communityColor }}
                onClick={() => setCommentText("")}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Event Card ──────────────────────────────────────────────────────────────
const EventCard = ({ ev, communityColor, canModerate, onRegister }) => {
  const now = new Date();
  const start = new Date(ev.time);
  const end = new Date(ev.end_time);
  const isPast = end < now;
  const isOngoing = start <= now && end >= now;
  const isMultiDay = start.toDateString() !== end.toDateString();

  const monthStr = start.toLocaleString("en-IN", { month: "short" }).toUpperCase();
  const timeRange = `${start.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} – ${
    isMultiDay
      ? `${end.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ${end.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
      : end.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  }`;

  return (
    <div
      className={`event-card${isPast ? " event-card--past" : ""}`}
      style={isOngoing ? { borderColor: `${ev.color}60`, boxShadow: `0 0 0 1px ${ev.color}30` } : {}}
    >
      {isOngoing && (
        <div className="event-ongoing-bar" style={{ background: ev.color }}>
          <span className="pulse-dot" /> Happening Now
        </div>
      )}

      <div className="event-card-body">
        <div className="event-date-block">
          <div className="event-date-month" style={{ background: ev.color }}>{monthStr}</div>
          <div className="event-date-day">{start.getDate()}</div>
        </div>

        <div className="event-info">
          <div className="event-title-row">
            <h4 className="event-title">{ev.title}</h4>
            <span className="event-category-badge" style={{ background: `${ev.color}cc` }}>{ev.category}</span>
          </div>
          {ev.description && <p className="event-desc">{ev.description}</p>}
          <div className="event-meta">
            <span>🕐 {timeRange}</span>
            <span>📍 {ev.location}</span>
          </div>
          <div className="event-actions">
            {isPast ? (
              <button className="btn-register btn-register--ended" disabled>Event Ended</button>
            ) : ev.registered ? (
              <button className="btn-register btn-register--registered" disabled>✓ Registered</button>
            ) : (
              <button
                className="btn-register"
                style={{ background: communityColor }}
                onClick={() => onRegister(ev.id)}
              >
                Register
              </button>
            )}
            {canModerate && !isPast && (
              <button className="btn-attendees">Attendees</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Community Feed ──────────────────────────────────────────────────────────
const CommunityFeed = ({ community, currentUser, onCommunityUpdate, onArchive }) => {
const [posts, setPosts] = useState([]);
const [members, setMembers] = useState([]);
const [events, setEvents] = useState([]);

useEffect(() => {
  if (!community) return;

  fetch(`http://localhost:5000/api/communities/${community.id}/posts?user_id=${currentUser.id}`)
    .then(res => res.json())
    .then(data => setPosts(Array.isArray(data) ? data : []));

  fetch(`http://localhost:5000/api/communities/${community.id}/members`)
    .then(res => res.json())
    .then(setMembers);

  fetch(`http://localhost:5000/api/communities/${community.id}/events`)
    .then(res => res.json())
    .then(setEvents);
}, [community]);

  const [activeTab, setActiveTab] = useState("feed");
  const [newPost, setNewPost] = useState("");
  const [postType, setPostType] = useState("post");
  const [manageColor, setManageColor] = useState(community.color);

  const canModerate = ["head", "coordinator"].includes(community.my_role);
  const isHead = community.my_role === "head";

  const tabs = [
    { id: "feed",          label: "Feed",                          icon: "📰" },
    { id: "announcements", label: "Updates",                       icon: "📣" },
    { id: "events",        label: "Events",                        icon: "📅" },
    { id: "members",       label: `Members (${members.length})`,   icon: "👥" },
    ...(isHead ? [{ id: "manage", label: "Manage", icon: "⚙️" }] : []),
  ];

  const handlePost = async () => {
    if (!newPost.trim()) return;
    // Optimistic UI
    const optimistic = {
      id: Date.now(), content: newPost, post_type: postType, pinned: false,
      created_at: new Date().toISOString(), author_id: currentUser.id,
      author_name: currentUser.name, author_pic: null,
      author_role: community.my_role || "member",
      reaction_count: 0, comment_count: 0, my_reaction: null,
    };
    setPosts(prev => [optimistic, ...prev]);
    setNewPost("");
    try {
      await fetch(`http://localhost:5000/api/communities/${community.id}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author_id: currentUser.id, content: optimistic.content, post_type: postType }),
      });
      // Refresh to get real server id
      const fresh = await fetch(`http://localhost:5000/api/communities/${community.id}/posts?user_id=${currentUser.id}`).then(r => r.json());
      setPosts(Array.isArray(fresh) ? fresh : []);
    } catch (err) { console.error("Post failed:", err); }
  };

  const handleReact = async (postId, emoji) => {
    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const same = p.my_reaction === emoji;
      return { ...p, my_reaction: same ? null : emoji, reaction_count: same ? p.reaction_count - 1 : p.reaction_count + 1 };
    }));
    try {
      await fetch(`http://localhost:5000/api/posts/${postId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser.id, emoji }),
      });
    } catch (err) { console.error("React failed:", err); }
  };

  const handleDelete = async (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));  // optimistic
    try {
      await fetch(`http://localhost:5000/api/posts/${postId}?requester_id=${currentUser.id}`, { method: "DELETE" });
    } catch (err) { console.error("Delete failed:", err); }
  };
  const handleRegister = async (eventId) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registered: true } : e));  // optimistic
    try {
      await fetch("http://localhost:5000/api/event/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser.id, event_id: eventId }),
      });
    } catch (err) { console.error("Register failed:", err); }
  };
  const handleRoleChange = async (memberId, newRole) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));  // optimistic
    try {
      await fetch(`http://localhost:5000/api/communities/${community.id}/members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole, requester_id: currentUser.id }),
      });
    } catch (err) { console.error("Role change failed:", err); }
  };

  const filteredPosts = activeTab === "announcements"
    ? posts.filter(p => p.post_type === "announcement")
    : posts;

  const COLORS = ["#6366f1", "#f43f5e", "#f59e0b", "#10b981", "#8b5cf6", "#0ea5e9", "#ec4899"];
  const ROLE_GROUPS = [
    { role: "head",        label: "Heads",        icon: "👑" },
    { role: "coordinator", label: "Coordinators", icon: "⚡" },
    { role: "member",      label: "Members",      icon: "👤" },
  ];

  return (
    <div className="community-feed">
      {/* Banner */}
      <div className="comm-banner" style={{ background: `linear-gradient(135deg, ${community.color}ee, ${community.color}99)` }}>
        <div className="comm-banner-dots" />
        <div className="comm-banner-inner">
          <div className="comm-banner-left">
            <span className="comm-banner-emoji">{community.icon}</span>
            <div>
              <h2 className="comm-banner-name">{community.name}</h2>
              <p className="comm-banner-desc">{community.description}</p>
              <div className="comm-banner-meta">
                <span>👥 {community.member_count} members</span>
                {community.my_role && <RoleBadge role={community.my_role} />}
              </div>
            </div>
          </div>
          {!community.my_role && (
              <button className="btn-join" onClick={async () => {
                try {
                  await fetch(`http://localhost:5000/api/communities/${community.id}/join`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: currentUser.id }),
                  });
                  // Refresh community list to update my_role
                  const refreshed = await fetch(`http://localhost:5000/api/communities?user_id=${currentUser.id}`).then(r => r.json());
                  if (Array.isArray(refreshed)) {
                    const updated = refreshed.find(c => c.id === community.id);
                    if (updated) { onCommunityUpdate(updated); }
                  }
                } catch (err) { console.error("Join failed:", err); }
              }}>+ Join</button>
            )}
        </div>
      </div>

      {/* Tabs */}
      <div className="comm-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab-btn${activeTab === t.id ? " tab-btn--active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">

        {/* Feed / Announcements */}
        {(activeTab === "feed" || activeTab === "announcements") && (
          <>
            {community.my_role && (
              <div className="post-composer">
                <div className="composer-row">
                  <Avatar name={currentUser.name} size={40} color={community.color} />
                  <div className="composer-right">
                    <textarea
                      className="composer-textarea"
                      rows={3}
                      placeholder={postType === "announcement" ? "Write an announcement…" : "Share something with the community…"}
                      value={newPost}
                      onChange={e => setNewPost(e.target.value)}
                    />
                    <div className="composer-actions">
                      {canModerate && (
                        <div className="post-type-btns">
                          <button
                            className={`btn-post-type${postType === "post" ? " btn-post-type--post" : ""}`}
                            onClick={() => setPostType("post")}
                          >
                            📝 Post
                          </button>
                          <button
                            className={`btn-post-type${postType === "announcement" ? " btn-post-type--ann" : ""}`}
                            onClick={() => setPostType("announcement")}
                          >
                            📣 Announcement
                          </button>
                        </div>
                      )}
                      <button
                        className="btn-submit"
                        style={{ background: community.color }}
                        onClick={handlePost}
                        disabled={!newPost.trim()}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {filteredPosts.length === 0 ? (
              <div className="empty-posts">
                <div className="empty-posts-icon">📭</div>
                <p>No posts yet</p>
              </div>
            ) : filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                communityColor={community.color}
                onReact={handleReact}
                onDelete={handleDelete}
                currentUser={currentUser}
                canModerate={canModerate}
              />
            ))}
          </>
        )}

        {/* Events — filtered to this community's events only */}
        {activeTab === "events" && (
          <div className="events-tab">
            <div className="events-header">
              <div>
                <p className="events-header-label">{community.name} Events</p>
                <p className="events-header-sub">
                  {events.length} event{events.length !== 1 ? "s" : ""} managed by this club
                </p>
              </div>
              {canModerate && (
                <button className="btn-add-event" style={{ background: community.color }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Event
                </button>
              )}
            </div>

            {events.length === 0 ? (
              <div className="events-empty">
                <div className="events-empty-icon">📅</div>
                <p>{canModerate ? "Add the first event for this community." : "No events yet — check back later."}</p>
              </div>
            ) : events.map(ev => (
              <EventCard
                key={ev.id}
                ev={ev}
                communityColor={community.color}
                canModerate={canModerate}
                onRegister={handleRegister}
              />
            ))}
          </div>
        )}

        {/* Members */}
        {activeTab === "members" && (
          <div className="members-tab">
            {ROLE_GROUPS.map(g => {
              const group = members.filter(m => m.role === g.role);
              if (!group.length) return null;
              return (
                <div key={g.role}>
                  <div className="members-group-label">
                    {g.icon} {g.label}
                    <span className="members-count">{group.length}</span>
                  </div>
                  {group.map(m => (
                    <div key={m.id} className="member-card">
                      <Avatar name={m.name} pic={m.profile_pic} size={40} color={community.color} />
                      <div className="member-info">
                        <p className="member-name">
                          {m.name}
                          {m.id === currentUser.id && <span className="member-you">(you)</span>}
                        </p>
                        <p className="member-email">{m.email}</p>
                      </div>
                      {isHead && m.id !== currentUser.id && (
                        <select
                          className="role-select"
                          value={m.role}
                          onChange={e => handleRoleChange(m.id, e.target.value)}
                        >
                          <option value="member">👤 Member</option>
                          <option value="coordinator">⚡ Coordinator</option>
                          <option value="head">👑 Head</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
            {canModerate && <button className="btn-add-member">+ Add Member</button>}
          </div>
        )}

        {/* Manage (Head only) */}
        {activeTab === "manage" && isHead && (
          <div className="manage-tab">
            <div className="manage-card">
              <h3>Community Settings</h3>
              <div className="form-field">
                <label className="form-label">Community Name</label>
                <input className="form-input" defaultValue={community.name} />
              </div>
              <div className="form-field">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows={3} defaultValue={community.description} />
              </div>
              <div className="form-field">
                <label className="form-label">Theme Color</label>
                <div className="color-swatches">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      className={`color-swatch${manageColor === c ? " color-swatch--selected" : ""}`}
                      style={{ background: c }}
                      onClick={() => setManageColor(c)}
                    />
                  ))}
                </div>
              </div>
              <button className="btn-save" style={{ background: manageColor }} onClick={async (e) => {
                const nameEl = e.currentTarget.closest('.manage-card').querySelector('input');
                const descEl = e.currentTarget.closest('.manage-card').querySelector('textarea');
                try {
                  await fetch(`http://localhost:5000/api/communities/${community.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: nameEl?.value || community.name,
                      description: descEl?.value || community.description,
                      icon: community.icon,
                      color: manageColor,
                      requester_id: currentUser.id,
                    }),
                  });
                  alert("Settings saved!");
                } catch (err) { console.error("Save failed:", err); }
              }}>Save Changes</button>
            </div>
            <div className="manage-card">
              <h3>Danger Zone</h3>
              <p className="manage-danger-hint">Irreversible actions. Be careful.</p>
              <button className="btn-danger" onClick={async () => {
                if (!window.confirm("Archive this community? This cannot be undone.")) return;
                try {
                  await fetch(`http://localhost:5000/api/communities/${community.id}/archive`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ requester_id: currentUser.id }),
                  });
                  alert("Community archived.");
                  onArchive();
                } catch (err) { console.error("Archive failed:", err); }
              }}>Archive Community</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ─── Main Community Page ─────────────────────────────────────────────────────
const ICONS = ["🏛️", "⌨️", "🎭", "🏆", "🤖", "📷", "🎵", "🌱", "🎨", "📚", "💡", "🔬"];
const THEME_COLORS = ["#6366f1", "#f43f5e", "#f59e0b", "#10b981", "#8b5cf6", "#0ea5e9", "#ec4899"];

export default function CommunityApp({ onNavigateHome }) {
const navigate = useNavigate();
const handleNavigateHome = onNavigateHome || (() => navigate("/home"));
const [communities, setCommunities] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch(`http://localhost:5000/api/communities?user_id=${currentUser.id}`)
    .then(res => res.json())
    .then(data => setCommunities(Array.isArray(data) ? data : []))
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
}, []);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newComm, setNewComm] = useState({ name: "", description: "", icon: "🏛️", color: "#6366f1" });
// ── Real current user from localStorage ──────────────────────────────────
let currentUser = { id: 1, name: 'User', role: 'student' };
try {
  const _stored = localStorage.getItem('user');
  if (_stored && _stored !== 'undefined') currentUser = JSON.parse(_stored);
} catch { /* ignore */ }
 const filtered = communities.filter(c =>
  (c?.name || "").toLowerCase().includes((searchQuery || "").toLowerCase()) ||
  (c?.description || "").toLowerCase().includes((searchQuery || "").toLowerCase())
);
  const myComms  = filtered.filter(c => c.my_role);
  const discover = filtered.filter(c => !c.my_role);

  const handleCreate = async () => {
  if (!newComm.name.trim()) return;
  try {
    const res  = await fetch("http://localhost:5000/api/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newComm, created_by: currentUser.id }),  // ← pass created_by
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Create failed'); }
    const data = await res.json();  // server returns full community object
    // Append directly — no second fetch needed
    setCommunities(prev => [...prev, data]);
    setSelected(data);
    setShowCreate(false);
    setNewComm({ name: "", description: "", icon: "🏛️", color: "#6366f1" });
  } catch (err) {
    console.error(err);
    alert("Failed to create community: " + err.message);
  }
};

  const SidebarList = () => (
    <>
      <div className="sidebar-header">
        <button className="btn-home" onClick={handleNavigateHome}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" />
          </svg>
          Home
        </button>
        <div className="sidebar-title-row">
          <h1 className="sidebar-title">Communities</h1>
          <button className="btn-new-comm" onClick={() => setShowCreate(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
        <div className="search-wrap">
          <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="search-input"
            placeholder="Search communities…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-list">
        {myComms.length > 0 && (
          <>
            <p className="sidebar-group-label">My Communities</p>
            {myComms.map(c => (
              <button
                key={c.id}
                className={`comm-item${selected?.id === c.id ? " comm-item--active" : ""}`}
                style={selected?.id === c.id ? { background: `${c.color}12`, borderColor: `${c.color}30` } : {}}
                onClick={() => setSelected(c)}
              >
                <div className="comm-item-icon" style={{ background: selected?.id === c.id ? `${c.color}20` : "#f1f5f9" }}>
                  {c.icon}
                </div>
                <div className="comm-item-info">
                  <p className="comm-item-name">{c.name}</p>
                  <p className="comm-item-sub">
                    {c.my_role === "head" ? "👑 Head" : c.my_role === "coordinator" ? "⚡ Coordinator" : "👤 Member"} · {c.member_count}
                  </p>
                </div>
                {selected?.id === c.id && <div className="comm-item-bar" style={{ background: c.color }} />}
              </button>
            ))}
          </>
        )}

        {discover.length > 0 && (
          <>
            <p className="sidebar-group-label">Discover</p>
            {discover.map(c => (
              <button
                key={c.id}
                className={`comm-item comm-item--muted${selected?.id === c.id ? " comm-item--active" : ""}`}
                onClick={() => setSelected(c)}
              >
                <div className="comm-item-icon comm-item-icon--muted">{c.icon}</div>
                <div className="comm-item-info">
                  <p className="comm-item-name comm-item-name--muted">{c.name}</p>
                  <p className="comm-item-sub">{c.member_count} members</p>
                </div>
              </button>
            ))}
          </>
        )}
      </div>
    </>
  );

  return (
    <div className="community-root">
      {/* Desktop Sidebar */}
      <aside className="comm-sidebar">
        <SidebarList />
      </aside>

      {/* Main Panel */}
      <main className="comm-main">
        {selected ? (
          <div className="comm-feed-wrap">
            <button className="btn-back" onClick={() => setSelected(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M5 12l7 7M5 12l7-7" />
              </svg>
              Back
            </button>
            <CommunityFeed
              community={selected}
              currentUser={currentUser}
              onCommunityUpdate={(updated) => {
                setSelected(updated);
                setCommunities(prev => prev.map(c => c.id === updated.id ? updated : c));
              }}
              onArchive={() => {
                setSelected(null);
                setCommunities(prev => prev.filter(c => c.id !== selected.id));
              }}
            />
          </div>
        ) : (
          <>
            <div className="mobile-sidebar"><SidebarList /></div>
            <div className="desktop-empty">
              <div className="desktop-empty-icon">🏛️</div>
              <h2>Pick a Community</h2>
              <p>Select a community from the sidebar to view posts, events, and members.</p>
            </div>
          </>
        )}
      </main>

      {/* Create Community Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowCreate(false); }}>
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">Create Community</h3>
              <button className="btn-close-modal" onClick={() => setShowCreate(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="form-field">
              <label className="form-label">Icon</label>
              <div className="icon-picker">
                {ICONS.map(ic => (
                  <button
                    key={ic}
                    className={`icon-btn${newComm.icon === ic ? " icon-btn--selected" : ""}`}
                    onClick={() => setNewComm({ ...newComm, icon: ic })}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                placeholder="e.g. Photography Club"
                value={newComm.name}
                onChange={e => setNewComm({ ...newComm, name: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="What's this community about?"
                value={newComm.description}
                onChange={e => setNewComm({ ...newComm, description: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Color</label>
              <div className="color-swatches">
                {THEME_COLORS.map(c => (
                  <button
                    key={c}
                    className={`color-swatch${newComm.color === c ? " color-swatch--selected" : ""}`}
                    style={{ background: c }}
                    onClick={() => setNewComm({ ...newComm, color: c })}
                  />
                ))}
              </div>
            </div>

            <button className="btn-create-final" style={{ background: newComm.color }} onClick={handleCreate}>
              Create {newComm.icon} {newComm.name || "Community"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}