import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ load: vi.fn(), save: vi.fn() }));
vi.mock("./member-drafts", async importOriginal => ({
  ...await importOriginal<typeof import("./member-drafts")>(), loadMemberDraft: mocks.load, saveMemberDraft: mocks.save,
}));
import { useMemberDraft } from "./useMemberDraft";

beforeEach(() => {
  mocks.load.mockResolvedValue({ id: "draft-1", conteudo_json: { tema: "Original" }, updated_at: "2026-10-08T00:00:00Z" });
  mocks.save.mockImplementation(async (_id, content) => ({ id: "draft-1", conteudo_json: content, updated_at: "2026-10-08T01:00:00Z" }));
});
afterEach(() => { vi.useRealTimers(); vi.clearAllMocks(); });

it("saves only after two seconds without edits and resets the timer on another edit", async () => {
  const { result } = renderHook(() => useMemberDraft("draft-1"));
  await waitFor(() => expect(result.current.state).toBe("saved"));
  vi.useFakeTimers();
  act(() => result.current.change({ tema: "Primeira" }));
  await act(async () => { await vi.advanceTimersByTimeAsync(1500); });
  expect(mocks.save).not.toHaveBeenCalled();
  act(() => result.current.change({ tema: "Final" }));
  await act(async () => { await vi.advanceTimersByTimeAsync(1999); });
  expect(mocks.save).not.toHaveBeenCalled();
  await act(async () => { await vi.advanceTimersByTimeAsync(1); });
  expect(mocks.save).toHaveBeenCalledTimes(1);
  expect(mocks.save).toHaveBeenCalledWith("draft-1", { tema: "Final" });
  expect(result.current.state).toBe("saved");
});