import React, { ReactElement } from 'react';

import { newUrl } from '../utils';
import { LANGUAGE_OPTIONS, Languages } from '../../config';

interface LanguagesProps {
  language: Languages;
}

/** 语言切换组件 */
const LanguageSwtich: React.SFC<LanguagesProps> = ({ language }) => {
  const renderItems: ReactElement[] = [];

  Object.entries(LANGUAGE_OPTIONS).forEach(([key, value], index) => {
    if (key === language) {
      renderItems.push(<span key={key}>{value}</span>);
    } else {
      renderItems.push(<a key={key} className="site-language" href={newUrl({ query: { language: key } })}>
        {value}
      </a>);
    }
    if (index < Object.keys(LANGUAGE_OPTIONS).length - 1) {
      renderItems.push(<span key={`${key}-separator`} className="site-language-separator">
          /
      </span>);
    }
  });

  return <span className="site-languages">{renderItems}</span>;
};

export default LanguageSwtich;
