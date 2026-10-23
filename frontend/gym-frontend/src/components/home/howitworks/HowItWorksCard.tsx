import type { ReactNode } from "react";

import "../../../styles/howitworks/how-it-works-card.css";

interface HowItWorksCardProps {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
}

export function HowItWorksCard({
  number,
  icon,
  title,
  description,
}: HowItWorksCardProps) {
  return (
    <article className="how-it-works-card">
      <span className="how-it-works-number">
        {number}
      </span>

      <div className="how-it-works-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>
    </article>
  );
}