import React, { useState } from 'react';
import { CertificateItem, CertificateCategory, CertificateAttachment } from '../../types/portfolio';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Edit2,
  Award,
  X,
  AlertTriangle,
  ExternalLink,
  FileText,
  File,
  Image,
  Paperclip,
  Eye,
  UploadCloud,
} from 'lucide-react';

interface Props {
  certificates: CertificateItem[];
  onChange: (updated: CertificateItem[]) => void;
}

const DEFAULT_NEW_CERT: Omit<CertificateItem, 'id'> = {
  title: '',
  issuer: '',
  issueDate: '',
  category: 'course',
  description: '',
  verificationUrl: '',
};

export const CertificatesEditor: React.FC<Props> = ({ certificates, onChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CertificateItem | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewAttachmentUrl, setPreviewAttachmentUrl] = useState<string | null>(null);

  const startAdd = () => {
    const newItem: CertificateItem = {
      ...DEFAULT_NEW_CERT,
      id: `cert-${Date.now()}`,
    };
    setFormData(newItem);
    setEditingId(newItem.id);
    setFileError(null);
  };

  const startEdit = (item: CertificateItem) => {
    setFormData({ ...item });
    setEditingId(item.id);
    setFileError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(null);
    setFileError(null);
  };

  const saveForm = () => {
    if (!formData || !formData.title.trim()) return;
    const exists = certificates.some(c => c.id === formData.id);
    if (exists) {
      onChange(certificates.map(c => (c.id === formData.id ? formData : c)));
    } else {
      onChange([...certificates, formData]);
    }
    setEditingId(null);
    setFormData(null);
    setFileError(null);
  };

  const confirmDelete = (id: string) => {
    onChange(certificates.filter(c => c.id !== id));
    setIsDeletingId(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= certificates.length) return;
    const reordered = [...certificates];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    onChange(reordered);
  };

  // Handle file attachment (images, PDF, docs, txt, etc.)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;
    setFileError(null);

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size is larger than 10MB. Please select a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const sizeFormatted =
        file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(1)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      const isImage = file.type.startsWith('image/');

      const attachment: CertificateAttachment = {
        name: file.name,
        size: sizeFormatted,
        type: file.type || 'application/octet-stream',
        dataUrl: result,
        isImage,
      };

      setFormData({
        ...formData,
        attachment,
      });
    };

    reader.onerror = () => {
      setFileError('Failed to read file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      attachment: undefined,
    });
  };

  const getFileIcon = (attachment?: CertificateAttachment) => {
    if (!attachment) return <Paperclip className="w-4 h-4 text-slate-400" />;
    if (attachment.isImage) return <Image className="w-4 h-4 text-blue-400" />;
    if (attachment.type.includes('pdf')) return <FileText className="w-4 h-4 text-rose-400" />;
    return <File className="w-4 h-4 text-cyan-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>My Certificates & Achievements</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 font-mono">
              {certificates.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Course completions, credentials, awards, and proof documents (PDFs, docs, images).
          </p>
        </div>

        {!editingId && (
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Certificate</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {certificates.length === 0 && !editingId && (
        <div className="rounded-2xl border-2 border-dashed border-slate-800/80 p-8 text-center bg-[#090d18]/70 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900/30 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-200">
            No certificates or files added yet
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Attach verified credentials, competition awards, or coursework certificates with direct PDF, image, or doc uploads.
          </p>
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.25)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Certificate or Document</span>
          </button>
        </div>
      )}

      {/* Form */}
      {editingId && formData && (
        <div className="rounded-2xl border border-blue-500/30 bg-[#0a0f1d] p-5 sm:p-6 space-y-4 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              {certificates.some(c => c.id === formData.id) ? 'Edit Certificate' : 'Add Certificate & Document'}
            </span>
            <button
              type="button"
              onClick={cancelEdit}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Certificate or Award Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. AWS Certified Cloud Practitioner or Hackathon 1st Place"
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Issuing Organization
              </label>
              <input
                type="text"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                placeholder="e.g. freeCodeCamp, AWS, Coursera, HackUW"
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as CertificateCategory })}
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="course">Course Completion</option>
                <option value="award">Competition Win / Award</option>
                <option value="participation">Participation / Workshop</option>
                <option value="credential">Official Industry Credential</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Date (or Month & Year)
              </label>
              <input
                type="text"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                placeholder="e.g. Mar 2024"
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Short Description / Key Topics Covered
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Completed comprehensive coursework covering core data structures, cloud infrastructure, and hands-on labs."
              className="w-full rounded-xl border border-slate-800 bg-[#060a14] p-3 text-xs text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Verification URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Verification Link / Badge URL (Optional)
            </label>
            <input
              type="url"
              value={formData.verificationUrl || ''}
              onChange={(e) => setFormData({ ...formData, verificationUrl: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Dedicated File & Image Attachment Section with prominent '+ Add' Icon */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-200">
                  Attach Certificate File or Image
                </label>
                <p className="text-[11px] text-slate-400">
                  Supports all file types: PDF documents, Images (PNG, JPG, WebP), Word docs (.docx, .doc), or Text files.
                </p>
              </div>
            </div>

            {/* If attachment exists, show rich chip with preview & remove */}
            {formData.attachment ? (
              <div className="rounded-xl border border-blue-500/30 bg-[#080d1a] p-3 flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  {formData.attachment.isImage ? (
                    <img
                      src={formData.attachment.dataUrl}
                      alt={formData.attachment.name}
                      className="w-10 h-10 rounded-lg object-cover border border-blue-500/20 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-blue-900/40 border border-blue-500/30 flex items-center justify-center shrink-0">
                      {getFileIcon(formData.attachment)}
                    </div>
                  )}

                  <div className="truncate">
                    <span className="text-xs font-semibold text-slate-100 block truncate">
                      {formData.attachment.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formData.attachment.size} • {formData.attachment.type.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewAttachmentUrl(formData.attachment!.dataUrl)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 px-2 py-1 rounded bg-blue-950/60 border border-blue-500/30"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded"
                    title="Remove attachment"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* '+ Add' upload action box */
              <label className="group flex flex-col sm:flex-row items-center justify-center gap-3 p-4 rounded-xl border border-dashed border-blue-500/40 bg-[#070b16] hover:bg-[#0c1424] hover:border-blue-400 transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-xs font-bold text-blue-400 group-hover:text-blue-300 block">
                    + Add File / Image
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Click to browse PDF, Image, DOC, or certificate scan (up to 10MB)
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*,application/pdf,.doc,.docx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}

            {fileError && (
              <p className="text-xs text-rose-400 font-medium">{fileError}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveForm}
              disabled={!formData.title.trim()}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              Save Certificate
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {!editingId && certificates.length > 0 && (
        <div className="space-y-3">
          {certificates.map((cert, idx) => (
            <div
              key={cert.id}
              className="rounded-xl border border-slate-800 bg-[#090e1a] p-4 shadow-sm hover:border-blue-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-100">{cert.title}</h4>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-950/70 border border-blue-500/20 text-blue-300">
                    {cert.category}
                  </span>
                  {cert.attachment && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                      {getFileIcon(cert.attachment)}
                      <span>{cert.attachment.name}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {cert.issuer} {cert.issueDate ? `• ${cert.issueDate}` : ''}
                </p>
                {cert.description && (
                  <p className="text-xs text-slate-300 line-clamp-1">{cert.description}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                {cert.attachment && (
                  <button
                    type="button"
                    onClick={() => setPreviewAttachmentUrl(cert.attachment!.dataUrl)}
                    className="p-1.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-950/60"
                    title="View Attached File"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 disabled:opacity-20"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'down')}
                  disabled={idx === certificates.length - 1}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 disabled:opacity-20"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(cert)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800"
                  title="Edit Certificate"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeletingId(cert.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                  title="Delete Certificate"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attachment Preview Modal */}
      {previewAttachmentUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b1020] rounded-2xl border border-blue-500/30 max-w-2xl w-full p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200">Attached File Preview</span>
              <button
                type="button"
                onClick={() => setPreviewAttachmentUrl(null)}
                className="p-1 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-[#060a14] rounded-xl p-2">
              {previewAttachmentUrl.startsWith('data:image/') ? (
                <img src={previewAttachmentUrl} alt="Certificate Preview" className="max-h-[65vh] object-contain rounded" />
              ) : (
                <iframe src={previewAttachmentUrl} title="Document Preview" className="w-full h-[60vh] rounded border-0" />
              )}
            </div>
            <div className="flex justify-end pt-2">
              <a
                href={previewAttachmentUrl}
                download="certificate-document"
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Download File
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0b1020] rounded-2xl border border-slate-800 shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Delete Certificate?</h4>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeletingId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDelete(isDeletingId)}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
