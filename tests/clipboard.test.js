import { copyToClipboard, writeText } from "../src/ui/shared/clipboard.js";
import { jest } from "@jest/globals";

describe("clipboard helpers", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("writeText delegates to clipboard API wrapper", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: jest.fn().mockResolvedValue() },
      configurable: true,
    });
    const copySpy = jest.spyOn(navigator.clipboard, "writeText");
    Object.defineProperty(window, "isSecureContext", { value: true, configurable: true });

    const result = await writeText("netops");

    expect(result).toBe(true);
    expect(copySpy).toHaveBeenCalledWith("netops");
  });

  test("copyToClipboard falls back when modern API is unavailable", async () => {
    Object.defineProperty(document, "execCommand", {
      value: jest.fn().mockReturnValue(true),
      configurable: true,
    });
    const execSpy = jest.spyOn(document, "execCommand").mockReturnValue(true);
    Object.defineProperty(window, "isSecureContext", { value: false, configurable: true });

    const result = await copyToClipboard("fallback");

    expect(result).toBe(true);
    expect(execSpy).toHaveBeenCalledWith("copy");
  });
});
