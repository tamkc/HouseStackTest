export const getNotes = async () => {
  const res = await fetch("/api/notes");
  return res.json();
};

export const addNote = async (note: { title: string }) => {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  return res.json();
};

export const deleteNote = async (id: string) => {
  await fetch(`/api/notes/${id}`, { method: "DELETE" });
};
