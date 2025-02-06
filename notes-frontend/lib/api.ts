const API_BASE_URL = "http://localhost:3001/api";

export const getNotes = async () => {
  const res = await fetch(`${API_BASE_URL}/notes`);
  return res.json();
};

export const addNote = async (note: { title: string }) => {
  const res = await fetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  return res.json();
};

export const deleteNote = async (id: string) => {
  await fetch(`${API_BASE_URL}/notes/${id}`, { method: "DELETE" });
};
