import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { customerApi } from '../services/api';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<any | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const custResponse = await customerApi.getById(id);
          setCustomer(custResponse.data.data);

          const notesResponse = await customerApi.getNotes(id);
          setNotes(notesResponse.data.data || []);
        }
      } catch (err: any) {
        setError('Failed to load customer details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddNote = async () => {
    if (!noteText.trim() || !id) return;
    try {
      await customerApi.addNote(id, noteText);
      setNoteText('');
      const notesResponse = await customerApi.getNotes(id);
      setNotes(notesResponse.data.data || []);
    } catch (err: any) {
      alert('Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!id) return;
    try {
      await customerApi.deleteNote(id, noteId);
      const notesResponse = await customerApi.getNotes(id);
      setNotes(notesResponse.data.data || []);
    } catch (err: any) {
      alert('Failed to delete note');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
        <div className="space-x-2">
          <Link
            to={`/customers/${customer.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </Link>
          <Link to="/customers" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-600">Email</dt>
              <dd className="text-sm text-gray-900">{customer.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Mobile</dt>
              <dd className="text-sm text-gray-900">{customer.mobile}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Business</dt>
              <dd className="text-sm text-gray-900">{customer.businessName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Type</dt>
              <dd className="text-sm text-gray-900">{customer.customerType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Status</dt>
              <dd className="text-sm">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    customer.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : customer.status === 'LEAD'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {customer.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Address</dt>
              <dd className="text-sm text-gray-900">{customer.address}</dd>
            </div>
          </dl>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
          <div className="space-y-3">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button
              onClick={handleAddNote}
              disabled={!noteText.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Add Note
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {notes.length === 0 ? (
              <p className="text-sm text-gray-500">No notes yet</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm text-gray-900">{note.noteText}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(note.createdAt).toLocaleDateString()}</p>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-xs text-red-600 hover:text-red-800 mt-2"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
