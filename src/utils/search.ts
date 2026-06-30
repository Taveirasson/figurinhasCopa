import { Figurinha } from "../data/album";

const norm = (s: string) => s.toLowerCase().replace(/[-\s]/g, "");

type Indexed = {
  idN: string;
  numero: string;
  nome: string;
  pais: string;
};

const cache = new WeakMap<Figurinha, Indexed>();

const indexOf = (f: Figurinha): Indexed => {
  let i = cache.get(f);
  if (!i) {
    i = {
      idN: norm(f.id),
      numero: f.numero.toString(),
      nome: f.nome ? f.nome.toLowerCase() : "",
      pais: f.pais.toLowerCase(),
    };
    cache.set(f, i);
  }
  return i;
};

export function filterFigurinhas(
  data: Figurinha[],
  query: string,
): Figurinha[] {
  const q = query.toLowerCase().trim();
  if (!q) return data;
  const nq = norm(q);
  const out: Figurinha[] = [];
  for (let k = 0; k < data.length; k++) {
    const f = data[k];
    const ix = indexOf(f);
    if (
      ix.idN.includes(nq) ||
      ix.numero.includes(q) ||
      (ix.nome && ix.nome.includes(q)) ||
      ix.pais.includes(q)
    ) {
      out.push(f);
    }
  }
  return out;
}
