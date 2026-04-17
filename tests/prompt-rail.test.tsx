import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PromptRail } from "@/components/prompt-rail";
import { bandThemes } from "@/lib/theme-data";

describe("PromptRail", () => {
  it("shows locked share state before the first meaningful moment", () => {
    render(
      <PromptRail
        theme={bandThemes[0]}
        status="pre-show"
        currentDirection=""
        pendingDirection=""
        error={null}
        shareUnlocked={false}
        isSubmitting={false}
        metrics={null}
        onSubmitDirection={vi.fn()}
        onExportRecap={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /locked/i }).hasAttribute("disabled"),
    ).toBe(true);
  });

  it("submits the current direction", () => {
    const onSubmitDirection = vi.fn().mockResolvedValue(undefined);

    render(
      <PromptRail
        theme={bandThemes[0]}
        status="pre-show"
        currentDirection=""
        pendingDirection=""
        error={null}
        shareUnlocked={false}
        isSubmitting={false}
        metrics={null}
        onSubmitDirection={onSubmitDirection}
        onExportRecap={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /send direction/i }));
    expect(onSubmitDirection).toHaveBeenCalled();
  });
});
