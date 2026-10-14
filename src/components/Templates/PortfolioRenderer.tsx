import React from 'react';
import { PortfolioData } from '../../types/portfolio';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { MinimalTemplate } from './MinimalTemplate';

interface Props {
  data: PortfolioData;
  isPublic?: boolean;
}

export const PortfolioRenderer: React.FC<Props> = ({ data, isPublic = false }) => {
  switch (data.template) {
    case 'creative':
      return <CreativeTemplate data={data} isPublic={isPublic} />;
    case 'minimal':
      return <MinimalTemplate data={data} isPublic={isPublic} />;
    case 'professional':
    default:
      return <ProfessionalTemplate data={data} isPublic={isPublic} />;
  }
};
