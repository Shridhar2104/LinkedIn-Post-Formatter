import { LinkedInFormatter, FormatType } from '../../utils/formatter';

interface FormatSelectorProps {
  selectedFormat: FormatType;
  onSelectFormat: (format: FormatType) => void;
}

export default function FormatSelector({ selectedFormat, onSelectFormat }: FormatSelectorProps) {
  const templates = LinkedInFormatter.getTemplates();

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm">
      <p className="text-xs font-semibold text-gray-600 mb-2">Choose Format</p>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectFormat(template.id)}
            className={`p-2 rounded-lg border-2 transition text-left ${
              selectedFormat === template.id
                ? 'border-linkedin-600 bg-linkedin-50'
                : 'border-gray-200 hover:border-linkedin-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{template.icon}</span>
              <span className="text-xs font-semibold">{template.name}</span>
            </div>
            <p className="text-[10px] text-gray-500">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
