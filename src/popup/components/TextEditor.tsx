interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TextEditor({ value, onChange, placeholder }: TextEditorProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-32 p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-linkedin-500 resize-none"
      />
      <div className="px-3 pb-2 text-xs text-gray-400 text-right">
        {value.length} characters
      </div>
    </div>
  );
}
