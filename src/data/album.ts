export type Status = "falta" | "tenho" | "repetida";

export interface Figurinha {
  id: string;
  nome?: string;
  pais: string;
  numero: number;
  status: Status;
  quantidade?: number;
}

export interface Time {
  id: string;
  nome: string;
  figurinhas: Figurinha[];
  completo?: boolean;
  totalFigurinha?: number;
}

const TEAMS_LIST: { id: string; nome: string }[] = [
  { id: "MEX", nome: "México" },
  { id: "RSA", nome: "África do Sul" },
  { id: "KOR", nome: "Coreia do Sul" },
  { id: "CZE", nome: "Tchéquia" },
  { id: "CAN", nome: "Canadá" },
  { id: "BIH", nome: "Bósnia e Herzegovina" },
  { id: "QAT", nome: "Catar" },
  { id: "SUI", nome: "Suíça" },
  { id: "BRA", nome: "Brasil" },
  { id: "MAR", nome: "Marrocos" },
  { id: "HAI", nome: "Haiti" },
  { id: "SCO", nome: "Escócia" },
  { id: "USA", nome: "Estados Unidos" },
  { id: "PAR", nome: "Paraguai" },
  { id: "AUS", nome: "Austrália" },
  { id: "TUR", nome: "Turquia" },
  { id: "GER", nome: "Alemanha" },
  { id: "CUW", nome: "Curaçao" },
  { id: "CIV", nome: "Costa do Marfim" },
  { id: "ECU", nome: "Equador" },
  { id: "NED", nome: "Holanda" },
  { id: "JPN", nome: "Japão" },
  { id: "SWE", nome: "Suécia" },
  { id: "TUN", nome: "Tunísia" },
  { id: "BEL", nome: "Bélgica" },
  { id: "EGY", nome: "Egito" },
  { id: "IRN", nome: "Irã" },
  { id: "NZL", nome: "Nova Zelândia" },
  { id: "ESP", nome: "Espanha" },
  { id: "CPV", nome: "Cabo Verde" },
  { id: "KSA", nome: "Arábia Saudita" },
  { id: "URU", nome: "Uruguai" },
  { id: "FRA", nome: "França" },
  { id: "SEN", nome: "Senegal" },
  { id: "IRQ", nome: "Iraque" },
  { id: "NOR", nome: "Noruega" },
  { id: "ARG", nome: "Argentina" },
  { id: "ALG", nome: "Argélia" },
  { id: "AUT", nome: "Áustria" },
  { id: "JOR", nome: "Jordânia" },
  { id: "POR", nome: "Portugal" },
  { id: "COD", nome: "Congo DR" },
  { id: "UZB", nome: "Uzbequistão" },
  { id: "COL", nome: "Colômbia" },
  { id: "ENG", nome: "Inglaterra" },
  { id: "CRO", nome: "Croácia" },
  { id: "GHA", nome: "Gana" },
  { id: "PAN", nome: "Panamá" },
];

const TEAMS_GROUPS = {
  A: [
    { id: "MEX", nome: "México" },
    { id: "RSA", nome: "África do Sul" },
    { id: "KOR", nome: "Coreia do Sul" },
    { id: "CZE", nome: "Tchéquia" },
  ],

  B: [
    { id: "CAN", nome: "Canadá" },
    { id: "BIH", nome: "Bósnia e Herzegovina" },
    { id: "QAT", nome: "Catar" },
    { id: "SUI", nome: "Suíça" },
  ],

  C: [
    { id: "BRA", nome: "Brasil" },
    { id: "MAR", nome: "Marrocos" },
    { id: "HAI", nome: "Haiti" },
    { id: "SCO", nome: "Escócia" },
  ],

  D: [
    { id: "USA", nome: "Estados Unidos" },
    { id: "PAR", nome: "Paraguai" },
    { id: "AUS", nome: "Austrália" },
    { id: "TUR", nome: "Turquia" },
  ],

  E: [
    { id: "GER", nome: "Alemanha" },
    { id: "CUW", nome: "Curaçao" },
    { id: "CIV", nome: "Costa do Marfim" },
    { id: "ECU", nome: "Equador" },
  ],

  F: [
    { id: "NED", nome: "Holanda" },
    { id: "JPN", nome: "Japão" },
    { id: "SWE", nome: "Suécia" },
    { id: "TUN", nome: "Tunísia" },
  ],

  G: [
    { id: "BEL", nome: "Bélgica" },
    { id: "EGY", nome: "Egito" },
    { id: "IRN", nome: "Irã" },
    { id: "NZL", nome: "Nova Zelândia" },
  ],

  H: [
    { id: "ESP", nome: "Espanha" },
    { id: "CPV", nome: "Cabo Verde" },
    { id: "KSA", nome: "Arábia Saudita" },
    { id: "URU", nome: "Uruguai" },
  ],

  I: [
    { id: "FRA", nome: "França" },
    { id: "SEN", nome: "Senegal" },
    { id: "IRQ", nome: "Iraque" },
    { id: "NOR", nome: "Noruega" },
  ],

  J: [
    { id: "ARG", nome: "Argentina" },
    { id: "ALG", nome: "Argélia" },
    { id: "AUT", nome: "Áustria" },
    { id: "JOR", nome: "Jordânia" },
  ],

  K: [
    { id: "POR", nome: "Portugal" },
    { id: "COD", nome: "Congo DR" },
    { id: "UZB", nome: "Uzbequistão" },
    { id: "COL", nome: "Colômbia" },
  ],

  L: [
    { id: "ENG", nome: "Inglaterra" },
    { id: "CRO", nome: "Croácia" },
    { id: "GHA", nome: "Gana" },
    { id: "PAN", nome: "Panamá" },
  ],
};

const others: Time[] = [
  {
    id: "FWC",
    nome: "Panini",
    totalFigurinha: 20,
    completo: false,
    figurinhas: Array.from({ length: 20 }).map((_, i) => ({
      id: `FWC-${i.toString().padStart(2, "0")}`,
      pais: "Panini",
      numero: i,
      status: "falta" as Status,
      quantidade: 0,
    })),
  },
  {
    id: "COCA",
    nome: "Coca-Cola",
    totalFigurinha: 14,
    completo: false,
    figurinhas: Array.from({ length: 14 }).map((_, i) => ({
      id: `COCA-${(i + 1).toString().padStart(2, "0")}`,
      pais: "Coca-Cola",
      numero: i + 1,
      status: "falta" as Status,
      quantidade: 0,
    })),
  },
];

export const TIMES: Time[] = [
  ...others.filter((t) => t.id === "FWC"),
  ...TEAMS_LIST.map((t) => ({
    id: t.id,
    nome: t.nome,
    totalFigurinha: 20,
    completo: false,
    figurinhas: Array.from({ length: 20 }).map((_, i) => ({
      id: `${t.id}-${(i + 1).toString().padStart(2, "0")}`,
      pais: t.nome,
      numero: i + 1,
      status: "falta" as Status,
      quantidade: 0,
    })),
  })),
  ...others.filter((t) => t.id !== "FWC"),
];
