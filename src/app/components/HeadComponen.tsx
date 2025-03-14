// components/HeadComponent.tsx

import Head from 'next/head';

interface HeadComponentProps {
  title: string;
  description?: string;
}

const HeadComponent: React.FC<HeadComponentProps> = ({ title, description }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description || "Default description"} />
    </Head>
  );
};

export default HeadComponent;
