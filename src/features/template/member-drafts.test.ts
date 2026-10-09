import { beforeEach, describe, expect, it, vi } from "vitest";
import { STEPS } from "./fields";

const mocks = vi.hoisted(() => ({ getUser: vi.fn(), from: vi.fn(), original: vi.fn() }));
vi.mock("@/lib/supabase", () => ({ db: () => ({ auth: { getUser: mocks.getUser }, from: mocks.from }) }));
vi.mock("@/features/esbocos/api", () => ({ getEsboco: mocks.original }));
import { AUTOSAVE_DELAY, draftProgress, resumeMemberDraft, saveMemberDraft } from "./member-drafts";

function query(result: unknown) {
  const q: Record<string, ReturnType<typeof vi.fn>> = {};
  for (const name of ["select", "eq", "neq", "order", "limit", "insert", "update"]) q[name] = vi.fn(() => q);
  q.maybeSingle = vi.fn().mockResolvedValue(result);
  q.single = vi.fn().mockResolvedValue(result);
  return q;
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.getUser.mockResolvedValue({ data: { user: { id: "owner-1" } }, error: null });
});

describe("Member draft rules", () => {
  it("resumes the latest non-archived draft for the authenticated owner and original", async () => {
    const q = query({ data: { id: "existing" }, error: null });
    mocks.from.mockReturnValue(q);
    expect((await resumeMemberDraft("original-1")).id).toBe("existing");
    expect(q.eq).toHaveBeenCalledWith("user_id", "owner-1");
    expect(q.eq).toHaveBeenCalledWith("esboco_original_id", "original-1");
    expect(q.neq).toHaveBeenCalledWith("status", "arquivado");
    expect(q.order).toHaveBeenCalledWith("updated_at", { ascending: false });
    expect(q.limit).toHaveBeenCalledWith(1);
    expect(q.insert).not.toHaveBeenCalled();
  });

  it("creates only when no active draft exists, using original JSON and verified ownership", async () => {
    const read = query({ data: null, error: null });
    const write = query({ data: { id: "created" }, error: null });
    const original = { id: "original-1", tema: "Original", ponto1_dor: "Conteúdo" };
    mocks.from.mockReturnValueOnce(read).mockReturnValueOnce(write);
    mocks.original.mockResolvedValue(original);
    expect((await resumeMemberDraft("original-1")).id).toBe("created");
    expect(write.insert).toHaveBeenCalledWith({ user_id: "owner-1", esboco_original_id: "original-1", conteudo_json: original });
  });

  it("rejects an invalid session before attempting reads or writes", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: { message: "Invalid token" } });
    await expect(resumeMemberDraft("original-1")).rejects.toThrow();
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("updates content and timestamp only on the authenticated user's non-archived draft", async () => {
    const q = query({ data: { id: "draft-1" }, error: null });
    mocks.from.mockReturnValue(q);
    const before = Date.now();
    await saveMemberDraft("draft-1", { tema: "Minha versão", user_id: "other-owner" });
    const payload = q.update.mock.calls[0]?.[0];
    expect(payload.conteudo_json.tema).toBe("Minha versão");
    expect(payload.user_id).toBeUndefined();
    expect(Date.parse(payload.updated_at)).toBeGreaterThanOrEqual(before);
    expect(q.eq).toHaveBeenCalledWith("user_id", "owner-1");
    expect(q.eq).toHaveBeenCalledWith("id", "draft-1");
    expect(q.neq).toHaveBeenCalledWith("status", "arquivado");
  });

  it("counts only nonblank editor fields, not original metadata", () => {
    expect(draftProgress({ tema: "Pregação", objetivo: "   ", id: "original", status: "publicado" })).toEqual({ filled: 1, total: 18, percent: 6 });
    const full = Object.fromEntries(STEPS.flatMap(s => s.fields.map(f => [f.key, "Texto"])));
    expect(draftProgress(full).percent).toBe(100);
    expect(draftProgress({}).percent).toBe(0);
  });

  it("uses exactly two seconds for autosave debounce", () => {
    expect(AUTOSAVE_DELAY).toBe(2000);
  });
});