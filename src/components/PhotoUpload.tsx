import { Camera, X } from "lucide-react";
import { useRef } from "react";

export function PhotoUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-foreground">{label}</div>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
          <img src={value} alt={label} className="h-48 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 text-destructive shadow"
            aria-label="Remover foto"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow"
          >
            Refazer
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface text-muted-foreground transition hover:border-primary hover:bg-accent/30 hover:text-primary active:scale-[0.99]"
        >
          <Camera className="h-9 w-9" />
          <span className="text-sm font-medium">Tocar para abrir câmera</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
