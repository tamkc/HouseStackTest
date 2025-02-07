const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

export const getNotes = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/notes/`);
    if (!res.ok) throw new Error(`Failed to fetch notes: ${res.statusText}`);
    const data = await res.json();
    return data as {
      _id: string;
      title: string;
      content: string;
      createdAt: string;
    }[];
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};

export const addNote = async (title: string, content: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/notes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      throw new Error(`Failed to add note: ${res.statusText}`);
    }

    const data = await res.json();
    return data as {
      _id: string;
      title: string;
      content: string;
      createdAt: string;
    };
  } catch (error) {
    console.error("Error adding note:", error);
    return null;
  }
};

export const updateNote = async (
  id: string,
  note: { title?: string; content?: string }
) => {
  try {
    const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    if (!res.ok) throw new Error("Failed to update note");
    return res.json();
  } catch (error) {
    console.error("Error updating note:", error);
  }
};

export const deleteNote = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete note");
  } catch (error) {
    console.error("Error deleting note:", error);
  }
};
