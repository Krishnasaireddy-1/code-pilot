"use client";

import dynamic from "next/dynamic";
import Layout from "../components/Layout";

const CodeEditor = dynamic(() => import("../components/CodeEditor"), { ssr: false });

export default function Code() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold">Code Editor</h1>
      <CodeEditor />
    </Layout>
  );
}
