'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface ReviewUser {
  name: string | null;
  image: string | null;
}

interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
}

function StarRating({
  rating,
  onRate,
  interactive = false,
}: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={`text-xl ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => onRate?.(star)}
        >
          <span
            style={{
              color:
                (hovered || rating) >= star ? '#f59e0b' : '#d1d5db',
            }}
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

function UserAvatar({ name }: { name: string | null }) {
  const letter = (name || '?')[0].toUpperCase();
  const colors = [
    '#6c5ce7',
    '#00cec9',
    '#e17055',
    '#0984e3',
    '#d63031',
    '#fdcb6e',
    '#00b894',
    '#e84393',
  ];
  const index = (name || '').length % colors.length;

  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
      style={{ backgroundColor: colors[index] }}
    >
      {letter}
    </div>
  );
}

export default function ReviewSection({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      console.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Pre-fill if user already has a review
  const userReview = reviews.find(
    (r) => session?.user?.email && r.userId
  );
  // We need to match by checking if the user already reviewed — since we don't have
  // the userId in session, we detect it when the user's name matches
  const existingReview = session?.user?.name
    ? reviews.find((r) => r.user.name === session.user?.name)
    : null;

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    }
  }, [existingReview?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a comment');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment: comment.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to submit review');
        return;
      }

      await fetchReviews();
    } catch {
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header with average rating */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold" style={{ color: '#1e1e2e' }}>
          Reviews
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(averageRating)} />
            <span className="text-lg font-semibold" style={{ color: '#1e1e2e' }}>
              {averageRating.toFixed(1)}
            </span>
            <span style={{ color: '#636e72' }}>
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        )}
        {reviews.length === 0 && !loading && (
          <span style={{ color: '#636e72' }}>No reviews yet</span>
        )}
      </div>

      {/* Write / Update a Review form */}
      {session?.user && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl p-6 mb-8 border"
          style={{ backgroundColor: '#f5f6fa', borderColor: '#e2e4ea' }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1e1e2e' }}>
            {existingReview ? 'Update your review' : 'Write a Review'}
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{ color: '#636e72' }}>
              Rating
            </label>
            <StarRating rating={rating} onRate={setRating} interactive />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{ color: '#636e72' }}>
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: '#d1d5db',
                color: '#1e1e2e',
              }}
              placeholder="Share your experience with this product..."
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 mb-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 rounded-lg text-white font-medium text-sm transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#6c5ce7' }}
          >
            {submitting
              ? 'Submitting...'
              : existingReview
                ? 'Update Review'
                : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews list */}
      {loading ? (
        <p style={{ color: '#636e72' }}>Loading reviews...</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl p-5 border"
              style={{ backgroundColor: '#ffffff', borderColor: '#e2e4ea' }}
            >
              <div className="flex items-start gap-3">
                <UserAvatar name={review.user.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-semibold text-sm" style={{ color: '#1e1e2e' }}>
                      {review.user.name || 'Anonymous'}
                    </span>
                    <span className="text-xs" style={{ color: '#636e72' }}>
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="mt-1 mb-2">
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#636e72' }}>
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
