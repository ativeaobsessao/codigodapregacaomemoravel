import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchEsbocos } from "@/features/esbocos/api";

function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function useEsbocosSearch(term: string, pill: string | null) {
  const debounced = useDebounced(term);
  return useQuery({
    queryKey: ["esbocos", "search", debounced, pill],
    queryFn: () => searchEsbocos(debounced, pill),
    placeholderData: keepPreviousData,
  });
}
