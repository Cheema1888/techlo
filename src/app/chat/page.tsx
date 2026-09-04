"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { ChotuAvatar } from "@/components/common/ChotuAvatar";
import { formatPKR } from "@/lib/utils";
import {
  Send,
  MessageCircle,
  Cpu,
  ArrowLeft,
  Search,
  ExternalLink,
  ShieldCheck,
  User,
  Clock,
  ChevronDown,
} from "lucide-react";

function ChatContent() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const targetProductId = searchParams.get("productId");
  const targetSellerId = searchParams.get("sellerId");

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const prevMessagesLengthRef = useRef(0);
  const [showScrollBottomButton, setShowScrollBottomButton] = useState(false);
  const [hasNewIncoming, setHasNewIncoming] = useState(false);

  const isNearBottom = (el: HTMLDivElement, threshold = 120) => {
    return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const el = messagesContainerRef.current;
    if (!el) return;
    // Only scroll if there is scrollable content ("reaches a certain level where we need to scroll")
    if (el.scrollHeight > el.clientHeight) {
      if (behavior === "smooth") {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      } else {
        el.scrollTop = el.scrollHeight;
      }
    }
    isAtBottomRef.current = true;
    setShowScrollBottomButton(false);
    setHasNewIncoming(false);
  };

  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const near = isNearBottom(el, 100);
    isAtBottomRef.current = near;

    const hasOverflow = el.scrollHeight > el.clientHeight + 20;
    if (hasOverflow && !near) {
      setShowScrollBottomButton(true);
    } else {
      setShowScrollBottomButton(false);
      setHasNewIncoming(false);
    }
  };

  // 1. Fetch or initialize conversations
  const loadConversations = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/chat/conversations?userId=${user.id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setConversations(json.data);
        return json.data;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  // Initialize conversations on mount or when user changes
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    const init = async () => {
      setLoading(true);
      const convos = await loadConversations();

      // If targetSellerId was passed in query, open or create conversation
      if (targetSellerId && targetSellerId !== user.id) {
        try {
          const createRes = await fetch("/api/chat/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              buyerId: user.id,
              sellerId: targetSellerId,
              productId: targetProductId || undefined,
            }),
          });
          const createJson = await createRes.json();
          if (createJson.success && createJson.data) {
            setActiveConversation(createJson.data);
            await loadConversations();
          }
        } catch (err) {
          console.error(err);
        }
      } else if (convos.length > 0 && !activeConversation) {
        setActiveConversation(convos[0]);
      }

      setLoading(false);
    };

    init();
  }, [user?.id, isAuthenticated, targetSellerId, targetProductId]);

  // 2. Fetch messages when active conversation changes
  const loadMessages = async (convoId: string) => {
    if (!convoId) return;
    try {
      const res = await fetch(`/api/chat/messages?conversationId=${convoId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setMessages(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Reset scroll & message tracking when active conversation changes
  useEffect(() => {
    if (activeConversation?.id) {
      setMessages([]);
      prevMessagesLengthRef.current = 0;
      isAtBottomRef.current = true;
      setShowScrollBottomButton(false);
      setHasNewIncoming(false);

      loadMessages(activeConversation.id);
      const interval = setInterval(() => {
        loadMessages(activeConversation.id);
      }, 4000); // 4-second polling for active real-time updates
      return () => clearInterval(interval);
    }
  }, [activeConversation?.id]);

  // Smart Auto-Scroll Effect: triggers whenever messages update
  useEffect(() => {
    const currentCount = messages.length;
    const prevCount = prevMessagesLengthRef.current;
    const isNewMessageAdded = currentCount > prevCount;
    prevMessagesLengthRef.current = currentCount;

    if (currentCount === 0) return;

    // A. Initial load for this conversation: scroll to bottom so latest messages are visible
    if (prevCount === 0) {
      requestAnimationFrame(() => {
        scrollToBottom("auto");
        setTimeout(() => scrollToBottom("auto"), 50);
        setTimeout(() => scrollToBottom("auto"), 180);
      });
      return;
    }

    // B. New message was added
    if (isNewMessageAdded) {
      const lastMsg = messages[messages.length - 1];
      const isMe = lastMsg?.senderId === user?.id;

      if (isMe) {
        // I sent a message: scroll to bottom immediately so I can see it
        requestAnimationFrame(() => {
          scrollToBottom("smooth");
          setTimeout(() => scrollToBottom("smooth"), 60);
        });
      } else {
        // Incoming message from chat partner:
        if (isAtBottomRef.current) {
          // User was already at/near bottom following the chat: advance to latest message!
          requestAnimationFrame(() => {
            scrollToBottom("smooth");
            setTimeout(() => scrollToBottom("smooth"), 60);
          });
        } else {
          // User was scrolled up reading history: show "New message" indicator
          setHasNewIncoming(true);
          setShowScrollBottomButton(true);
        }
      }
    }
  }, [messages, user?.id]);

  // 3. Send message handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation?.id || !user?.id || isSending) return;

    const textToSend = inputText.trim();
    setSendError("");
    setInputText("");
    setIsSending(true);

    // Optimistic UI update
    const tempMsg = {
      id: `temp_${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: user.id,
      content: textToSend,
      createdAt: new Date().toISOString(),
      sender: {
        id: user.id,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        avatarColor: user.avatarColor || "cyan",
      },
    };
    setMessages((prev) => [...prev, tempMsg]);

    // Scroll to bottom immediately for optimistic message
    requestAnimationFrame(() => {
      scrollToBottom("smooth");
    });

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          senderId: user.id,
          content: textToSend,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "Message could not be saved");
      }

      setMessages((prev) =>
        prev.map((message) => (message.id === tempMsg.id ? json.data : message))
      );
      await loadConversations();
    } catch (e: any) {
      console.error(e);
      setMessages((prev) => prev.filter((message) => message.id !== tempMsg.id));
      setInputText(textToSend);
      setSendError(e?.message || "Message was not sent. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 text-black dark:text-white flex items-center justify-center mx-auto shadow-xs">
          <MessageCircle className="w-6 h-6 text-neutral-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Sign In to Access Web Chat
          </h1>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Communicate safely with student hardware sellers and buyers directly inside the TECHLO webapp.
          </p>
        </div>
        <button
          onClick={() => openAuthModal("login")}
          className="px-6 py-2.5 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-xs rounded-full shadow-xs cursor-pointer"
        >
          Sign In with University Account
        </button>
      </div>
    );
  }

  const filteredConversations = conversations.filter((c) => {
    const otherUser = c.buyerId === user.id ? c.seller : c.buyer;
    const q = searchQuery.toLowerCase();
    return (
      otherUser?.fullName?.toLowerCase().includes(q) ||
      otherUser?.university?.toLowerCase().includes(q) ||
      c.product?.title?.toLowerCase().includes(q)
    );
  });

  const currentOtherUser =
    activeConversation?.buyerId === user.id ? activeConversation?.seller : activeConversation?.buyer;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Container Card */}
      <div className="bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-140px)] min-h-[550px]">
        {/* Left Column: Conversations List (4 cols) */}
        <div className={`md:col-span-4 border-r border-neutral-200/80 dark:border-neutral-800/80 flex flex-col h-full min-h-0 overflow-hidden bg-neutral-50/50 dark:bg-neutral-950/20 ${activeConversation ? "hidden md:flex" : "flex"}`}>
          {/* Header */}
          <div className="flex-shrink-0 p-4 border-b border-neutral-200/80 dark:border-neutral-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-black dark:text-white" />
                <h2 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">Direct Messages</h2>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-200/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold">
                {conversations.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-800 dark:text-amber-300">
              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span>Messages automatically kept for <strong>14 days</strong></span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#18181b] border border-neutral-200/80 dark:border-neutral-800/80 rounded-full text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Conversation Items */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-900">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((convo) => {
                const isSelected = activeConversation?.id === convo.id;
                const partner = convo.buyerId === user.id ? convo.seller : convo.buyer;
                const lastMsg = convo.messages?.[0];

                return (
                  <button
                    key={convo.id}
                    onClick={() => setActiveConversation(convo)}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-white dark:bg-neutral-800/70 border-l-2 border-black dark:border-white shadow-2xs"
                        : "hover:bg-neutral-100/60 dark:hover:bg-neutral-900/40"
                    }`}
                  >
                    <ChotuAvatar
                      name={partner?.fullName}
                      avatarUrl={partner?.avatarUrl}
                      color={partner?.avatarColor || "cyan"}
                      size="sm"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 truncate">
                          {partner?.fullName || "Student"}
                        </span>
                        {convo.updatedAt && (
                          <span className="text-[10px] text-neutral-400 flex-shrink-0">
                            {new Date(convo.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                        {lastMsg ? lastMsg.content : "Start conversation..."}
                      </p>

                      {convo.product && (
                        <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800/80 text-[10px] text-neutral-600 dark:text-neutral-300 truncate max-w-full">
                          <Cpu className="w-2.5 h-2.5 flex-shrink-0 text-neutral-400" />
                          <span className="truncate">{convo.product.title}</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-neutral-400 space-y-2">
                <MessageCircle className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mx-auto" />
                <p>No conversations yet.</p>
                <Link href="/marketplace" className="text-black dark:text-white underline font-semibold text-[11px]">
                  Browse Marketplace to chat
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Chat Room (8 cols) */}
        <div className={`md:col-span-8 relative flex flex-col h-full min-h-0 overflow-hidden bg-white dark:bg-[#121215] ${!activeConversation ? "hidden md:flex items-center justify-center" : "flex"}`}>
          {activeConversation && currentOtherUser ? (
            <>
              {/* Header */}
              <div className="flex-shrink-0 p-4 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveConversation(null)}
                    className="md:hidden p-1.5 -ml-1 text-neutral-500 hover:text-black dark:hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <ChotuAvatar
                    name={currentOtherUser.fullName}
                    avatarUrl={currentOtherUser.avatarUrl}
                    color={currentOtherUser.avatarColor || "cyan"}
                    size="md"
                  />

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                        {currentOtherUser.fullName}
                      </h3>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate max-w-xs">
                      {currentOtherUser.university}
                    </p>
                  </div>
                </div>

                {/* Product Preview Banner */}
                {activeConversation.product && (
                  <Link
                    href={`/marketplace/${activeConversation.product.id}`}
                    target="_blank"
                    className="hidden sm:flex items-center gap-2 p-1.5 px-3 rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 text-xs hover:border-black dark:hover:border-white transition-colors"
                  >
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[120px]">
                      {activeConversation.product.title}
                    </span>
                    <span className="text-black dark:text-white font-bold">
                      {formatPKR(activeConversation.product.pricePkr)}
                    </span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </Link>
                )}
              </div>

              {/* 14-Day History Retention Banner */}
              <div className="flex-shrink-0 bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between gap-3 text-[11px] text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <span>
                    <strong>14-Day History Notice:</strong> Direct messages are automatically retained for <strong>14 days</strong> and then permanently deleted for student privacy.
                  </span>
                </div>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 flex-shrink-0">
                  14-Day Auto-Purge
                </span>
              </div>

              {/* Messages Scroll Area */}
              <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4"
              >
                <div className="text-center pb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800/80 text-[10px] text-neutral-500 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-800">
                    <Clock className="w-3 h-3 text-amber-500 flex-shrink-0" />
                    <span>Encrypted web communication · Messages saved for 14 days</span>
                  </span>
                </div>

                  {messages.length > 0 ? (
                    messages.map((msg) => {
                      const isMe = msg.senderId === user.id;

                      return (
                        <div
                          key={msg.id}
                          className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          {!isMe && (
                            <ChotuAvatar
                              name={currentOtherUser.fullName}
                              avatarUrl={currentOtherUser.avatarUrl}
                              color={currentOtherUser.avatarColor || "cyan"}
                              size="xs"
                            />
                          )}

                          <div
                            className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-3 text-xs leading-relaxed ${
                              isMe
                                ? "bg-black text-white dark:bg-white dark:text-black rounded-br-xs"
                                : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 rounded-bl-xs"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                            <span
                              className={`text-[9px] block text-right mt-1 ${
                                isMe ? "text-neutral-400 dark:text-neutral-500" : "text-neutral-400"
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-neutral-400 text-xs space-y-2">
                      <p>No messages in this conversation yet.</p>
                      <p className="text-[11px] text-neutral-500">
                        Say hello to {currentOtherUser.fullName} and arrange campus pickup or negotiate pricing!
                      </p>
                      <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80">
                        (Note: Messages are kept for 14 days)
                      </p>
                    </div>
                  )}
                </div>

              {/* Floating Scroll to Latest Button */}
              {showScrollBottomButton && (
                <div className="absolute bottom-20 right-6 z-20">
                  <button
                    type="button"
                    onClick={() => scrollToBottom("smooth")}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all cursor-pointer text-xs font-semibold"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>{hasNewIncoming ? "New message" : "Latest"}</span>
                    {hasNewIncoming && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                </div>
              )}

              {/* Input Area */}
              <div className="flex-shrink-0 p-3 sm:p-4 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#121215]">
                {sendError && (
                  <p className="mb-2 px-2 text-[11px] text-rose-600 dark:text-rose-400" role="alert">
                    {sendError}
                  </p>
                )}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Message ${currentOtherUser.fullName}...`}
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      if (sendError) setSendError("");
                    }}
                    className="flex-1 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80 rounded-full text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-all"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="p-2.5 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black rounded-full transition-all cursor-pointer disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-neutral-400 dark:text-neutral-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Verified Student Hardware Exchange</span>
                  </span>
                  <span className="flex items-center gap-1 text-amber-600/90 dark:text-amber-400/90 font-medium">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>Messages kept for 14 days</span>
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-8 space-y-2 text-neutral-400 text-xs">
              <MessageCircle className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto" />
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">Select a Conversation</h3>
              <p>Choose an existing thread or click "Chat on Webapp" on any hardware ad.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto p-8 text-xs text-neutral-500">Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
