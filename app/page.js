'use client';

import { useState } from 'react';
import Layout from './components/Layout';
import { Code2, MessageCircle, Users } from 'lucide-react';

export default function Home() {
  const [selectedFeature, setSelectedFeature] = useState('practice');

  const featureList = [
    {
      key: 'practice',
      title: 'Practice Coding',
      description: 'Hone your skills with real-time problems and an intuitive code editor.',
      video: './practice.mp4',
      icon: <Code2 className="w-8 h-8 text-blue-400 mb-2" />,
    },
    {
      key: 'chat',
      title: 'Chat Option',
      description: 'Talk to your teammates instantly without leaving the code.',
      video: '/videos/chat.mp4',
      icon: <MessageCircle className="w-8 h-8 text-blue-400 mb-2" />,
    },
    {
      key: 'collab',
      title: 'Collaborative Coding',
      description: 'Pair program and review code together in real-time.',
      video: '/videos/collab.mp4',
      icon: <Users className="w-8 h-8 text-blue-400 mb-2" />,
    },
  ];

  const selected = featureList.find((f) => f.key === selectedFeature);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
        {/* Hero Section */}
        {/* Hero Section */}
<div className="w-full bg-gray-950 flex justify-center">
  <div className="w-full max-w-7xl items-center px-6 py-12">
    <div>
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
        Build Together, Ship Faster
      </h1>
      <p className="text-lg md:text-xl text-gray-400">
        CodePilot is your real-time collaborative coding workspace.
        Share code, review instantly, and collaborate with your team — all in one place.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg transition">
          Launch App
        </button>
        <button className="px-6 py-3 border border-gray-700 hover:border-gray-600 text-white font-medium rounded-xl shadow transition">
          View Docs
        </button>
      </div>
    </div>
  </div>
</div>


        {/* Feature Video Interaction Section */}
        <div className="max-w-7xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Feature List */}
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-3xl font-bold mb-4">Explore Features</h2>
            {featureList.map((feature) => (
              <div
                key={feature.key}
                className={`cursor-pointer w-70 px-6 py-4 rounded-xl transition border`}
                onClick={() => setSelectedFeature(feature.key)}
              >
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
            ))}
          </div>

          {/* Video Preview */}
          <div className="w-full">
            <video
              key={selected?.video}
              src={selected?.video}
              autoPlay muted loop
              className="rounded-xl w-full h-80 object-cover shadow-xl"
            />
          </div>
        </div>

        {/* Why CodePilot Section */}
        <div className="max-w-7xl mx-auto mt-24 text-center">
          <h2 className="text-4xl font-bold mb-4">Why CodePilot Over Programiz?</h2>
          <p className="text-gray-400 mb-10 max-w-3xl mx-auto">
            While Programiz is great for learning, CodePilot is made for <strong>building</strong>.
            With real-time collaboration, integrated chat, and a live coding environment,
            it's the ideal tool for teams who ship code together.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureList.map((feature) => (
              <div
                key={feature.key}
                className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-xl transition hover:scale-105"
              >
                <div className="flex flex-col items-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
// import Layout from './components/Layout';

// export default function Home() {
//   return (
//     <Layout>
//       <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white font-sans">
//         <h1 className="text-5xl font-bold">Welcome to CodePilot</h1>
//         <p className="text-2xl mt-4 text-gray-300">
//           Collaborate, code, and share in real-time.
//         </p>
//       </div>
//     </Layout>
//   );
// }

