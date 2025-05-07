
// import Layout from './components/Layout';

// export default function Home() {
//   return (
//     <Layout>
//       <div className="h-screen flex flex-col items-center justify-center bg-black text-red-600 font-horror animate-flicker relative">
//         <h1 className="text-5xl font-bold relative glitch">
//           💀 Welcome to CodePilot 💀
//         </h1>
//         <p className="text-2xl mt-4 horror-text">
//           👁 Collaborate, code, and share in real-time... if you dare. 👁
//         </p>
//         {/* Floating Skulls */}
//         <div className="absolute top-10 left-10 animate-float">💀</div>
//         <div className="absolute top-20 right-20 animate-float">☠️</div>
//         <div className="absolute bottom-10 left-20 animate-float">💀</div>
//         <div className="absolute bottom-20 right-10 animate-float">☠️</div>
//       </div>
//     </Layout>
//   );
// }
import Layout from './components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white font-sans">
        <h1 className="text-5xl font-bold">Welcome to CodePilot</h1>
        <p className="text-2xl mt-4 text-gray-300">
          Collaborate, code, and share in real-time.
        </p>
      </div>
    </Layout>
  );
}

