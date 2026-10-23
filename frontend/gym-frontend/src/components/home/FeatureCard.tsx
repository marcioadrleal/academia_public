import type { ReactNode } from "react";

import "../../styles/feature-card.css";

interface FeatureCardProps {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({
  number,
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <article className="feature-card">
      <div className="feature-card-top">
        <div className="feature-icon">
          {icon}
        </div>

        <span className="feature-number">
          {number}
        </span>
      </div>

      <h3>{title}</h3>

      <p>{description}</p>
    </article>
  );
}