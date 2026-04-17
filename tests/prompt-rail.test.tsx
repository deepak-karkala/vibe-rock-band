import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PromptRail } from "@/components/prompt-rail";
import { bandThemes } from "@/lib/theme-data";

describe("PromptRail", () => {
  it(
    "shows locked share state before the first meaningful moment",
    () => {
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
    },
    10000,
  );

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

  it("uses the pending direction in the stage status copy", () => {
    render(
      <PromptRail
        theme={bandThemes[0]}
        status="pending"
        currentDirection=""
        pendingDirection="slow it down"
        error={null}
        shareUnlocked={false}
        isSubmitting={true}
        metrics={null}
        onSubmitDirection={vi.fn()}
        onExportRecap={vi.fn()}
      />,
    );

    expect(screen.getByText(/reworking toward "slow it down"/i)).toBeTruthy();
  });

  it("resets the cue back to the theme default direction", () => {
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

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Make it brutal." } });
    fireEvent.click(screen.getByRole("button", { name: /reset cue/i }));

    expect((textarea as HTMLTextAreaElement).value).toBe(
      bandThemes[0].defaultDirection,
    );
  });

  it("loads preset and suggested directions into the cue field", () => {
    render(
      <PromptRail
        theme={bandThemes[0]}
        status="pre-show"
        currentDirection=""
        pendingDirection=""
        error={"The set slipped."}
        shareUnlocked={true}
        isSubmitting={false}
        metrics={{ directMs: 1400, generateMs: 4200, totalMs: 5600 }}
        onSubmitDirection={vi.fn()}
        onExportRecap={vi.fn()}
      />,
    );

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    fireEvent.click(screen.getByRole("button", { name: bandThemes[0].presetButtons[0] }));
    expect(textarea.value).toContain(bandThemes[0].presetButtons[0]);

    fireEvent.click(
      screen.getByRole("button", { name: bandThemes[0].suggestedDirections[0] }),
    );
    expect(textarea.value).toBe(bandThemes[0].suggestedDirections[0]);

    expect(screen.getByText(/director: 1400ms/i)).toBeTruthy();
    expect(screen.getByText(/the set slipped\./i)).toBeTruthy();
  });
});
