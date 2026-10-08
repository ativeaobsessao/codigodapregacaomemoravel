import { useEffect, useRef, useState } from "react";
import { AUTOSAVE_DELAY, editableDraft, loadMemberDraft, saveMemberDraft, type MemberDraft } from "./member-drafts";
import type { Draft } from "./fields";

export function useMemberDraft(id?: string) {
  const [record, setRecord] = useState<MemberDraft | null>(null);
  const [content, setContent] = useState<Draft>({});
  const [state, setState] = useState<"loading" | "saved" | "pending" | "saving" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const revision = useRef(0);
  const queue = useRef(Promise.resolve());
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
    if (!id) return;
    let alive = true;
    loadMemberDraft(id).then((row) => {
      if (!alive) return;
      setRecord(row); setContent(editableDraft(row.conteudo_json)); setState("saved");
    }).catch((err) => { if (alive) { setError(err.message); setState("error"); } });
    return () => { alive = false; active.current = false; };
  }, [id]);

  const change = (next: Draft) => {
    revision.current += 1;
    setContent(next); setState("pending"); setError(null);
  };

  const save = () => {
    if (!id || !record) return Promise.resolve();
    const version = revision.current;
    const snapshot = { ...record.conteudo_json, ...content };
    setState("saving");
    const job = queue.current.then(async () => {
      const row = await saveMemberDraft(id, snapshot);
      if (!active.current) return;
      setRecord(row);
      if (revision.current === version) { setState("saved"); setError(null); }
    }).catch((err) => {
      if (active.current && revision.current === version) { setState("error"); setError(err.message); }
    });
    queue.current = job;
    return job;
  };

  useEffect(() => {
    if (!id || !record || state !== "pending") return;
    const timer = setTimeout(() => { void save(); }, AUTOSAVE_DELAY);
    return () => clearTimeout(timer);
    // Content changes reset the debounce; save state changes must not restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, content, state]);

  return { record, content, change, save, state, error };
}