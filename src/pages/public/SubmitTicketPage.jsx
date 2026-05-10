import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ticketService from '../../services/ticketService';
import { CATEGORIES } from '../../utils/constants';

export default function SubmitTicketPage() {
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState(String(CATEGORIES[0].id));
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        category_id: Number(categoryId),
        subject: subject.trim(),
        description: description.trim(),
        submitter_email: email.trim() || undefined,
      };
      const { data } = await ticketService.submitTicket(payload);
      if (!data.success) {
        throw new Error(data.message || 'Submission failed');
      }
      toast.success(data.message || 'Ticket submitted');
      navigate('/ticket-success', {
        replace: true,
        state: { ticketCode: data.ticket_code },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit a concern</h1>
      <p className="text-sm text-gray-600 mb-8">
        Required fields are marked. You may leave email blank for a fully anonymous
        submission (save your ticket code).
      </p>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            required
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            required
            maxLength={200}
            placeholder="Short summary of the concern"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[120px]"
            required
            placeholder="Describe what happened and what you need"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
            Email (optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="For follow-up only"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-lg text-white text-sm font-medium disabled:opacity-60"
          style={{ backgroundColor: '#095BBC' }}
        >
          {submitting ? 'Submitting…' : 'Submit ticket'}
        </button>
      </form>
    </main>
  );
}
