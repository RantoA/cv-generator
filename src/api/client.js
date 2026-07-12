const BASE_URL = "/api/data";

export async function fetchData() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Échec du chargement des données");
  return res.json();
}

export async function saveData(data) {
  const res = await fetch(BASE_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Échec de l'enregistrement des données");
  return res.json();
}
