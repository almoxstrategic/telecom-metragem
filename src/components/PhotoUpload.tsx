import { Camera, Upload, X, ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function PhotoUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    onChange(file);
  };

  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-foreground">{label}</div>
      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
          <img src={preview} alt={label} className="h-48 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 text-destructive shadow"
            aria-label="Remover foto"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              className="rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow"
            >
              Trocar
            </button>
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow"
            >
              Refazer
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-border bg-surface p-4">
          <div className="mb-3 flex flex-col items-center justify-center gap-1 py-2 text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs">Nenhuma imagem selecionada</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition active:scale-[0.98]"
            >
              <Camera className="h-5 w-5" />
              Tirar Foto
            </button>
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary hover:text-primary active:scale-[0.98]"
            >
              <Upload className="h-5 w-5" />
              Fazer Upload
            </button>
          </div>
        </div>
      )}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
