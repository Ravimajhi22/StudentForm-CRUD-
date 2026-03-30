import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { API_URL } from '../apiConfig';

interface Comment {
  comment: string;
}

const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/comments`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: newComment }),
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-navy-50 dark:bg-navy-500/10 rounded-xl text-navy-600">
          <MessageSquare size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Neon Feedback</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Public Commentary System</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 relative">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Enter your comment for the database..."
          className="w-full min-h-[120px] p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 transition-all outline-none text-sm resize-none"
        />
        <button
          type="submit"
          disabled={isLoading || !newComment.trim()}
          className="absolute bottom-4 right-4 flex items-center gap-2 px-6 py-2 rounded-lg bg-navy-950 text-white text-[10px] font-black uppercase tracking-widest hover:bg-navy-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          <span>Submit</span>
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4">Latest Insights</h3>
        {isFetching ? (
          <div className="py-8 flex justify-center">
            <Loader2 size={24} className="animate-spin text-navy-500 opacity-50" />
          </div>
        ) : comments.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No entries recorded in Neon</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {comments.map((c, i) => (
              <div 
                key={i} 
                className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:translate-x-1"
              >
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{c.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
