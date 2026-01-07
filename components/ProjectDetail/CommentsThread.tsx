'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  timestamp: string;
  replies?: Comment[];
  mentions?: string[];
}

interface CommentsThreadProps {
  comments: Comment[];
  onAddComment: (text: string, parentId?: string) => void;
  onReply?: (text: string, parentId: string) => void;
  readonly?: boolean;
}

export function CommentsThread({
  comments,
  onAddComment,
  onReply,
  readonly = false,
}: CommentsThreadProps) {
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [mainCommentText, setMainCommentText] = useState('');
  const [mentions, setMentions] = useState<string[]>([]);

  const toggleReplies = (id: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedReplies(newExpanded);
  };

  const handleAddComment = () => {
    if (mainCommentText.trim()) {
      onAddComment(mainCommentText, undefined);
      setMainCommentText('');
      setMentions([]);
    }
  };

  const handleReply = (parentId: string) => {
    if (replyText.trim()) {
      onReply?.(replyText, parentId);
      setReplyText('');
      setReplyingTo(null);
      setMentions([]);
    }
  };

  const parseMentions = (text: string) => {
    const mentionRegex = /@(\w+)/g;
    const foundMentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      foundMentions.push(match[1]);
    }
    return foundMentions;
  };

  const handleCommentChange = (text: string) => {
    setMainCommentText(text);
    setMentions(parseMentions(text));
  };

  const handleReplyChange = (text: string) => {
    setReplyText(text);
    setMentions(parseMentions(text));
  };

  const renderCommentText = (text: string) => {
    const parts = text.split(/(@\w+)/);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span key={i} className="font-medium text-accent">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isExpanded = expandedReplies.has(comment.id);

    return (
      <div key={comment.id} className={`${isReply ? 'ml-8' : ''}`}>
        <div className="flex gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-600 flex-shrink-0 flex items-center justify-center">
            {comment.avatar ? (
              <img
                src={comment.avatar}
                alt={comment.author}
                className="w-full h-full rounded-full"
              />
            ) : (
              <span className="text-xs font-medium text-neutral-900 dark:text-neutral-50">
                {comment.author.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-neutral-900 dark:text-neutral-50">
                {comment.author}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {comment.timestamp}
              </span>
            </div>

            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              {renderCommentText(comment.text)}
            </p>

            <div className="flex gap-2 mt-2">
              {!readonly && !isReply && (
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="text-xs text-accent hover:text-accent/80 font-medium"
                >
                  Reply
                </button>
              )}
              {hasReplies && (
                <button
                  onClick={() => toggleReplies(comment.id)}
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300"
                >
                  {isExpanded ? `Hide ${comment.replies?.length} replies` : `View ${comment.replies?.length} replies`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reply input */}
        {replyingTo === comment.id && !readonly && (
          <div className="ml-8 flex gap-2 mb-3">
            <div className="flex-1">
              <Input
                placeholder="Write a reply... (use @ to mention)"
                value={replyText}
                onChange={(e) => handleReplyChange(e.target.value)}
                className="text-sm"
              />
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={() => handleReply(comment.id)}
                  disabled={!replyText.trim()}
                >
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Replies */}
        {hasReplies && isExpanded && (
          <div className="space-y-3 mt-3">
            {comment.replies?.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Main comment input */}
      {!readonly && (
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 space-y-3">
          <Input
            placeholder="Add a comment... (use @ to mention people)"
            value={mainCommentText}
            onChange={(e) => handleCommentChange(e.target.value)}
            className="text-sm"
          />

          {mentions.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {mentions.map((mention) => (
                <span
                  key={mention}
                  className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs rounded"
                >
                  @{mention}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              onClick={handleAddComment}
              disabled={!mainCommentText.trim()}
            >
              Comment
            </Button>
          </div>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-3">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            <p className="text-sm">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}
