import type { ReactNode } from "react";

import "../../../styles/tecnology/technology-feature.css";

interface TechnologyFeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function TechnologyFeature({
  icon,
  title,
  description,
}: TechnologyFeatureProps) {
  return (
    <div className="technology-feature">
      <div className="technology-feature-icon">
        {icon}
      </div>

      <div className="technology-feature-content">
        <strong>{title}</strong>

        <span>{description}</span>
      </div>
    </div>
  );
}