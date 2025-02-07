"use client";


import ActionSearchBar from '@/components/action-search-bar';
import { DataTable } from '@/components/noteTable/DataTable';


export default function Home() {

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">OpenNotes</h1>
      {/* <ActionSearchBar /> */}
      <DataTable />
    </div>
  );
}