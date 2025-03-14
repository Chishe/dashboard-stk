// import BoxContainer from "../components/BoxContainer";
// import React, { useState, useEffect } from 'react';
// const DynamicImage = ({ apiUrl }) => {
//   const [imageUrl, setImageUrl] = useState('');

//   useEffect(() => {
//     const fetchImage = () => {
//       fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//           setImageUrl(data.imageUrl);
//         })
//         .catch(error => console.error('Error fetching image:', error));
//     };
//     fetchImage();

//     const intervalId = setInterval(fetchImage, 1000);

//     return () => clearInterval(intervalId);
//   }, [apiUrl]);

//   return (
//     <img 
//       src={imageUrl} 
//       alt="Dynamic BB Image" 
//       className="absolute z-5" 
//       style={{
//         top: '49.8%',
//         left: '81%',
//         transform: 'translate(-50%, -50%)',
//         width: '43rem', 
//         height: '99.6%'
//       }}
//     />
//   );
// };

// export default function DynamicImageComponent() {
//   return (
//       <div className="relative w-full bg-cover bg-center m-4" style={{ background: url('/1.jpg') center no-repeat, backgroundSize: 'cover' }}>
//         <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-10">
//         </div>
//         <DynamicImage apiUrl="http://127.0.0.1:1880/api/get-image" /></div>
//   );
// }