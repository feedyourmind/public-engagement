"use client";

interface ParamSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  color?: string;
}

export default function ParamSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  color = "#f4a261",
}: ParamSliderProps) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-text-muted font-body">{label}</span>
        <span className="text-xs text-text/70 font-mono">
          {value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
        style={{ accentColor: color }}
      />
    </div>
  );
}
