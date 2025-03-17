// components/HeadComponent.tsx
import Head from 'next/head';
const HeadComponent = ({ title, description }) => {
    return (<Head>
      <title>{title}</title>
      <meta name="description" content={description || "Default description"}/>
    </Head>);
};
export default HeadComponent;
