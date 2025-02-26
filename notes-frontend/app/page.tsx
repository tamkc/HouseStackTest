"use client";

import { DataTable } from '@/components/noteTable/DataTable';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">OpenNotes</h1>
      <DataTable />
      <div className="text-center mt-4">
        <a href="https://github.com/tamkc/HouseStackTest" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          View on GitHub
        </a>
      </div>
    </div>
  );
}