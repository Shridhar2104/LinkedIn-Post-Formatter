import { Eye } from 'lucide-react';

interface PreviewPanelProps {
  content: string;
}

export default function PreviewPanel({ content }: PreviewPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-3">
      <div className="flex items-center gap-2 mb-2">
        <Eye size={14} className="text-linkedin-600" />
        <p className="text-xs font-semibold text-gray-600">Preview</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
        <pre className="text-xs whitespace-pre-wrap font-sans text-gray-700">
          {content}
        </pre>
      </div>
    </div>
  );
}
