import { beforeEach, describe, expect, it } from "vitest";
import { BaseLLM } from "./index";
import { ChatMessage, CompletionOptions, LLMOptions } from "../index";

/**
 * Mock LLM implementation for testing thinking tag extraction integration.
 * This simulates a provider like vLLM that emits thinking content via custom tags.
 */
class MockThinkingTagLLM extends BaseLLM {
  static providerName = "mock-thinking-tag";

  private mockStreamContent: string[];

  constructor(options: LLMOptions, mockStreamContent: string[] = []) {
    super(options);
    this.mockStreamContent = mockStreamContent;
  }

  setMockContent(content: string[]) {
    this.mockStreamContent = content;
  }

  protected async *_streamChat(
    messages: ChatMessage[],
    signal: AbortSignal,
    options: CompletionOptions,
  ): AsyncGenerator<ChatMessage> {
    // Simulate streaming by yielding chunks from mockStreamContent
    for (const chunk of this.mockStreamContent) {
      if (signal.aborted) break;
      yield { role: "assistant", content: chunk };
    }
  }

  supportsFim(): boolean {
    return false;
  }
}

describe("ThinkingTagExtractor Integration Tests", () => {
  describe("streamChat with thinking tags", () => {
    it("should extract thinking content from streamed chunks with simple tags", async () => {
      const llm = new MockThinkingTagLLM(
        {
          model: "test-model",
          thinkingOpenTag: "<think>",
          thinkingCloseTag: "</think>",
        },
        ["<think>I need to", " analyze this</think>", "The answer is 42."],
      );

      const chunks: ChatMessage[] = [];
      for await (const chunk of llm.streamChat(
        [{ role: "user", content: "What is the answer?" }],
        new AbortController().signal,
      )) {
        chunks.push(chunk);
      }

      // Should yield thinking chunk first, then assistant chunk
      expect(chunks).toHaveLength(2);
      expect(chunks[0]).toEqual({
        role: "thinking",
        content: "I need to analyze this",
      });
      expect(chunks[1]).toEqual({
        role: "assistant",
        content: "The answer is 42.",
      });
    });

    it("should handle thinking tags split across multiple chunks", async () => {
      const llm = new MockThinkingTagLLM(
        {
          model: "test-model",
          thinkingOpenTag: "<think>",
          thinkingCloseTag: "</think>",
        },
        ["Before <thi", "nk>partial thinking", " content</thi", "nk> after"],
      );

      const chunks: ChatMessage[] = [];
      for await (const chunk of llm.streamChat(
        [{ role: "user", content: "Test" }],
        new AbortController().signal,
      )) {
        chunks.push(chunk);
      }

      // Should properly reassemble the thinking content
      expect(chunks.length).toBeGreaterThan(0);

      const thinkingChunks = chunks.filter((c) => c.role === "thinking");
      const assistantChunks = chunks.filter((c) => c.role === "assistant");

      expect(thinkingChunks.length).toBeGreaterThan(0);
      const totalThinking = thinkingChunks.map((c) => c.content).join("");
      expect(totalThinking).toBe("partial thinking content");

      const totalAssistant = assistantChunks.map((c) => c.content).join("");
      expect(totalAssistant).toBe("Before  after");
    });

    it("should handle multiple thinking blocks in a stream", async () => {
      const llm = new MockThinkingTagLLM(
        {
          model: "test-model",
          thinkingOpenTag: "<think>",
          thinkingCloseTag: "</think>",
        },
        [
          "<think>first thought</think>",
          "Some text. ",
          "<think>second thought</think>",
          "More text.",
        ],
      );

      const chunks: ChatMessage[] = [];
      for await (const chunk of llm.streamChat(
        [{ role: "user", content: "Test" }],
        new AbortController().signal,
      )) {
        chunks.push(chunk);
      }

      const thinkingChunks = chunks.filter((c) => c.role === "thinking");
      const assistantChunks = chunks.filter((c) => c.role === "assistant");

      // Should have two thinking chunks
      expect(thinkingChunks.length).toBeGreaterThan(0);
      const totalThinking = thinkingChunks.map((c) => c.content).join("");
      expect(totalThinking).toBe("first thoughtsecond thought");

      // Should have assistant content without thinking tags
      const totalAssistant = assistantChunks.map((c) => c.content).join("");
      expect(totalAssistant).toBe("Some text. More text.");
    });

    it("should flush remaining content at end of stream", async () => {
      const llm = new MockThinkingTagLLM(
        {
          model: "test-model",
          thinkingOpenTag: "<think>",
          thinkingCloseTag: "</think>",
        },
        [
          "<think>incomplete thinking",
          // Stream ends without closing tag
        ],
      );

      const chunks: ChatMessage[] = [];
      for await (const chunk of llm.streamChat(
        [{ role: "user", content: "Test" }],
        new AbortController().signal,
      )) {
        chunks.push(chunk);
      }

      // Should flush incomplete thinking content
      const thinkingChunks = chunks.filter((c) => c.role === "thinking");
      const totalThinking = thinkingChunks.map((c) => c.content).join("");
      expect(totalThinking).toBe("incomplete thinking");
    });

    it("should flush partial tag at end of stream", async () => {
      const llm = new MockThinkingTagLLM(
        {
          model: "test-model",
          thinkingOpenTag: "<think>",
          thinkingCloseTag: "</think>",
        },
        [
          "Some content <th",
          // Stream ends with partial open tag
        ],
      );

      const chunks: ChatMessage[] = [];
      for await (const chunk of llm.streamChat(
        [{ role: "user", content: "Test" }],
        new AbortController().signal,
      )) {
        chunks.push(chunk);
      }

      // Should flush the partial tag as regular content
      const assistantChunks = chunks.filter((c) => c.role === "assistant");
      const totalAssistant = assistantChunks.map((c) => c.content).join("");
      expect(totalAssistant).toBe("Some content <th");
    });

    it("should work with custom tag formats", async () => {
      const llm = new MockThinkingTagLLM(
        {
          model: "test-model",
          thinkingOpenTag: "[REASONING]",
          thinkingCloseTag: "[/REASONING]",
        },
        ["[REASONING]analyzing the problem[/REASONING]", "The solution is X."],
      );

      const chunks: ChatMessage[] = [];
      for await (const chunk of llm.streamChat(
        [{ role: "user", content: "Test" }],
        new AbortController().signal,
      )) {
        chunks.push(chunk);
      }

      const thinkingChunks = chunks.filter((c) => c.role === "thinking");
      const assistantChunks = chunks.filter((c) => c.role === "assistant");

      const totalThinking = thinkingChunks.map((c) => c.content).join("");
      expect(totalThinking).toBe("analyzing the problem");

      const totalAssistant = assistantChunks.map((c) => c.content).join("");
      expect(totalAssistant).toBe("The solution is X.");
    });

    it("should not extract thinking when tags are not configured", async () => {
      const llm = new MockThinkingTagLLM(
        {
          model: "test-model",
          // No thinkingOpenTag or thinkingCloseTag
        },
        ["<think>this should not be extracted</think>", "Regular content."],
      );

      const chunks: ChatMessage[] = [];
      for await (const chunk of llm.streamChat(
        [{ role: "user", content: "Test" }],
        new AbortController().signal,
      )) {
        chunks.push(chunk);
      }

      // Should not have any thinking chunks
      const thinkingChunks = chunks.filter((c) => c.role === "thinking");
      expect(thinkingChunks).toHaveLength(0);

      // All content should be assistant content (including the tags)
      const assistantChunks = chunks.filter((c) => c.role === "assistant");
      const totalAssistant = assistantChunks.map((c) => c.content).join("");
      expect(totalAssistant).toBe(
        "<think>this should not be extracted</think>Regular content.",
      );
    });

    it("should not yield empty chunks", async () => {
      const llm = new MockThinkingTagLLM(
        {
          model: "test-model",
          thinkingOpenTag: "<think>",
          thinkingCloseTag: "</think>",
        },
        [
          "<think>only thinking</think>",
          // No regular content
        ],
      );

      const chunks: ChatMessage[] = [];
      for await (const chunk of llm.streamChat(
        [{ role: "user", content: "Test" }],
        new AbortController().signal,
      )) {
        chunks.push(chunk);
      }

      // Should only have thinking chunk, no empty assistant chunk
      expect(chunks).toHaveLength(1);
      expect(chunks[0].role).toBe("thinking");
      expect(chunks[0].content).toBe("only thinking");
    });

    it("should handle interleaved thinking and regular content", async () => {
      const llm = new MockThinkingTagLLM(
        {
          model: "test-model",
          thinkingOpenTag: "<think>",
          thinkingCloseTag: "</think>",
        },
        [
          "Start ",
          "<think>thinking 1</think>",
          "middle ",
          "<think>thinking 2</think>",
          "end",
        ],
      );

      const chunks: ChatMessage[] = [];
      for await (const chunk of llm.streamChat(
        [{ role: "user", content: "Test" }],
        new AbortController().signal,
      )) {
        chunks.push(chunk);
      }

      // Verify thinking chunks come before their respective assistant chunks
      const thinkingChunks = chunks.filter((c) => c.role === "thinking");
      const assistantChunks = chunks.filter((c) => c.role === "assistant");

      const totalThinking = thinkingChunks.map((c) => c.content).join("");
      expect(totalThinking).toBe("thinking 1thinking 2");

      const totalAssistant = assistantChunks.map((c) => c.content).join("");
      expect(totalAssistant).toBe("Start middle end");
    });

    it("should handle complex vLLM-style response with nested-like content", async () => {
      const llm = new MockThinkingTagLLM(
        {
          model: "test-model",
          thinkingOpenTag: "<reasoning>",
          thinkingCloseTag: "</reasoning>",
        },
        [
          "<reasoning>Let me break this down:\n",
          "1. First, I'll <analyze> the problem\n",
          "2. Then <evaluate> solutions</reasoning>\n",
          "Based on my reasoning, the answer is 42.",
        ],
      );

      const chunks: ChatMessage[] = [];
      for await (const chunk of llm.streamChat(
        [{ role: "user", content: "Test" }],
        new AbortController().signal,
      )) {
        chunks.push(chunk);
      }

      const thinkingChunks = chunks.filter((c) => c.role === "thinking");
      const totalThinking = thinkingChunks.map((c) => c.content).join("");

      // Should include all content between reasoning tags, including angle brackets
      expect(totalThinking).toContain("1. First, I'll <analyze> the problem");
      expect(totalThinking).toContain("2. Then <evaluate> solutions");

      const assistantChunks = chunks.filter((c) => c.role === "assistant");
      const totalAssistant = assistantChunks.map((c) => c.content).join("");
      expect(totalAssistant).toContain(
        "Based on my reasoning, the answer is 42.",
      );
    });
  });

  describe("PromptLog integration", () => {
    it("should include thinking content in prompt log", async () => {
      const llm = new MockThinkingTagLLM(
        {
          model: "test-model",
          thinkingOpenTag: "<think>",
          thinkingCloseTag: "</think>",
        },
        ["<think>my reasoning process</think>", "The final answer."],
      );

      let promptLog;
      const generator = llm.streamChat(
        [{ role: "user", content: "Test" }],
        new AbortController().signal,
      );

      // Consume all chunks
      for await (const chunk of generator) {
        // Just iterate
      }

      // Get the return value (PromptLog)
      promptLog = await generator.next().then((r) => r.value);

      // Verify the prompt log exists and has content
      expect(promptLog).toBeDefined();
      expect(promptLog.completion).toBeDefined();

      // The completion should contain only the regular content, not thinking
      expect(promptLog.completion).toContain("The final answer.");
      // Thinking content should not be in the formatted completion
      expect(promptLog.completion).not.toContain("my reasoning process");
    });
  });

  describe("edge cases and error handling", () => {
    it("should handle abort signal during thinking extraction", async () => {
      const llm = new MockThinkingTagLLM(
        {
          model: "test-model",
          thinkingOpenTag: "<think>",
          thinkingCloseTag: "</think>",
        },
        [
          "<think>starting to think",
          // Will be aborted before completion
        ],
      );

      const abortController = new AbortController();
      const chunks: ChatMessage[] = [];

      // Start streaming
      const generator = llm.streamChat(
        [{ role: "user", content: "Test" }],
        abortController.signal,
      );

      // Get first chunk
      const firstChunk = await generator.next();
      if (!firstChunk.done) {
        chunks.push(firstChunk.value);
      }

      // Abort
      abortController.abort();

      // Try to get more chunks (should stop)
      try {
        for await (const chunk of generator) {
          chunks.push(chunk);
        }
      } catch (e) {
        // Abort may throw, which is fine
      }

      // Should have received at least one thinking chunk
      const thinkingChunks = chunks.filter((c) => c.role === "thinking");
      expect(thinkingChunks.length).toBeGreaterThan(0);
    });

    it("should handle empty stream with tags configured", async () => {
      const llm = new MockThinkingTagLLM(
        {
          model: "test-model",
          thinkingOpenTag: "<think>",
          thinkingCloseTag: "</think>",
        },
        [], // Empty stream
      );

      const chunks: ChatMessage[] = [];
      for await (const chunk of llm.streamChat(
        [{ role: "user", content: "Test" }],
        new AbortController().signal,
      )) {
        chunks.push(chunk);
      }

      // Should handle gracefully with no chunks
      expect(chunks).toHaveLength(0);
    });

    it("should preserve message content types", async () => {
      const llm = new MockThinkingTagLLM(
        {
          model: "test-model",
          thinkingOpenTag: "<think>",
          thinkingCloseTag: "</think>",
        },
        ["<think>reasoning</think>", "text content"],
      );

      const chunks: ChatMessage[] = [];
      for await (const chunk of llm.streamChat(
        [{ role: "user", content: "Test" }],
        new AbortController().signal,
      )) {
        chunks.push(chunk);
      }

      // All chunks should have string content
      for (const chunk of chunks) {
        expect(typeof chunk.content).toBe("string");
      }
    });
  });
});
