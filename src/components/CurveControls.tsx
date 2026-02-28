"use client";

import { useDistribution } from "@/context/DistributionContext";
import Panel from "./Panel";
import ParamSlider from "./ParamSlider";

export default function CurveControls() {
  const { location, scale, shape, zoom, pan, setLocation, setScale, setShape, setZoom, setPan } =
    useDistribution();

  return (
    <Panel title="Curve Shape" defaultOpen={true}>
      <p className="text-xs text-text-dim mb-3.5 mt-0">
        Adjust the overall distribution shape.
      </p>
      <div className="grid grid-cols-1 gap-3">
        <ParamSlider
          label="Location (peak shift)"
          value={location}
          min={-2}
          max={3}
          step={0.05}
          onChange={setLocation}
        />
        <ParamSlider
          label="Scale (spread)"
          value={scale}
          min={0.2}
          max={2.5}
          step={0.02}
          onChange={setScale}
        />
        <ParamSlider
          label="Shape (skewness)"
          value={shape}
          min={-10}
          max={10}
          step={0.1}
          onChange={setShape}
        />
        <ParamSlider
          label="Horizontal zoom"
          value={zoom}
          min={0.3}
          max={2.0}
          step={0.05}
          onChange={setZoom}
        />
        <ParamSlider
          label="Horizontal pan"
          value={pan}
          min={-3}
          max={3}
          step={0.05}
          onChange={setPan}
        />
      </div>
    </Panel>
  );
}
