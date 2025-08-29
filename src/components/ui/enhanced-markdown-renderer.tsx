"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSupersub from "remark-supersub";
import rehypeKatex from "rehype-katex";
import { cn } from "@/lib/utils";
import "katex/dist/katex.min.css";

interface EnhancedMarkdownRendererProps {
  content: string;
  className?: string;
  enableMath?: boolean;
  enableSupersub?: boolean;
}

export function EnhancedMarkdownRenderer({
  content,
  className,
  enableMath = true,
  enableSupersub = true,
}: EnhancedMarkdownRendererProps) {
  // Build remark plugins array based on enabled features
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const remarkPlugins: any[] = [remarkGfm];
  if (enableMath) {
    remarkPlugins.push(remarkMath);
  }
  if (enableSupersub) {
    remarkPlugins.push(remarkSupersub);
  }

  // Build rehype plugins array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rehypePlugins: any[] = [];
  if (enableMath) {
    rehypePlugins.push(rehypeKatex);
  }

  return (
    <div
      className={cn("prose prose-sm dark:prose-invert max-w-none", className)}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          // Headings with better styling
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-200">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-medium mb-2 text-gray-700 dark:text-gray-200">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
              {children}
            </h6>
          ),

          // Enhanced paragraphs
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300 text-justify">
              {children}
            </p>
          ),

          // Enhanced lists
          ul: ({ children }) => (
            <ul className="mb-4 pl-6 space-y-2 list-disc text-gray-700 dark:text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 pl-6 space-y-2 list-decimal text-gray-700 dark:text-gray-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed pl-1">{children}</li>
          ),

          // Enhanced code blocks
          code: ({ children, className, ...props }) => {
            const isInline = !className?.includes("language-");
            const language = className?.replace("language-", "");

            return isInline ? (
              <code
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-sm font-mono border"
                {...props}
              >
                {children}
              </code>
            ) : (
              <div className="relative">
                {language && (
                  <div className="bg-gray-200 dark:bg-gray-700 px-3 py-1 text-xs font-mono text-gray-600 dark:text-gray-400 rounded-t-lg border-x border-t">
                    {language}
                  </div>
                )}
                <code
                  className={cn(
                    "block p-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-mono overflow-x-auto border",
                    language ? "rounded-b-lg rounded-t-none" : "rounded-lg"
                  )}
                  {...props}
                >
                  {children}
                </code>
              </div>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto">{children}</pre>
          ),

          // Enhanced blockquotes
          blockquote: ({ children }) => (
            <blockquote className="mb-4 pl-4 border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg text-gray-700 dark:text-gray-300 italic relative">
              <div className="absolute top-2 left-2 text-blue-400 text-2xl font-serif">
                &quot;
              </div>
              <div className="pl-6">{children}</div>
            </blockquote>
          ),

          // Enhanced tables
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {children}
            </tbody>
          ),
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
              {children}
            </td>
          ),

          // Enhanced links
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),

          // Enhanced emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900 dark:text-gray-100">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-700 dark:text-gray-300">
              {children}
            </em>
          ),

          // Superscript and subscript (enabled by remark-supersub)
          sup: ({ children }) => (
            <sup className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {children}
            </sup>
          ),
          sub: ({ children }) => (
            <sub className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {children}
            </sub>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="my-8 border-gray-300 dark:border-gray-700" />
          ),

          // Math rendering is handled by rehype-katex
          // Inline math: $equation$
          // Block math: $$equation$$

          // Custom image handling
          img: ({ src, alt }) => (
            <div className="mb-4 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              />
              {alt && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                  {alt}
                </p>
              )}
            </div>
          ),

          // Custom handling for specific patterns
          // Detecting chemical formulas, mathematical expressions, etc.
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Utility function to preprocess text for better mathematical rendering
export function preprocessMathContent(content: string): string {
  let processedContent = content;

  // Convert common superscript patterns
  processedContent = processedContent.replace(/\^(\d+)/g, "^$1^");
  processedContent = processedContent.replace(/\^([a-zA-Z]+)/g, "^$1^");

  // Convert common subscript patterns
  processedContent = processedContent.replace(/_(\d+)/g, "_$1_");
  processedContent = processedContent.replace(/_([a-zA-Z]+)/g, "_$1_");

  // Convert simple fractions to LaTeX
  processedContent = processedContent.replace(
    /(\d+)\/(\d+)/g,
    "\\frac{$1}{$2}"
  );

  // Convert degree symbols
  processedContent = processedContent.replace(/°/g, "°");

  // Convert common mathematical symbols
  processedContent = processedContent.replace(/±/g, "\\pm");
  processedContent = processedContent.replace(/∞/g, "\\infty");
  processedContent = processedContent.replace(/≈/g, "\\approx");
  processedContent = processedContent.replace(/≠/g, "\\neq");
  processedContent = processedContent.replace(/≤/g, "\\leq");
  processedContent = processedContent.replace(/≥/g, "\\geq");

  // Convert square root patterns
  processedContent = processedContent.replace(/sqrt\(([^)]+)\)/g, "\\sqrt{$1}");

  return processedContent;
}

// Enhanced content detection for auto-enabling features
export function detectContentFeatures(content: string): {
  hasMath: boolean;
  hasSupersub: boolean;
  hasChemical: boolean;
} {
  const hasMath =
    /\$.*\$|\\\w+|\\frac|\\sqrt|\\sum|\\int|\\pi|\\alpha|\\beta|\\gamma/i.test(
      content
    );
  const hasSupersub =
    /\^[a-zA-Z0-9]+|\_{1,2}[a-zA-Z0-9]+|[0-9]+\^[0-9]+|[a-zA-Z]+_[0-9]+/i.test(
      content
    );
  const hasChemical = /[A-Z][a-z]?[0-9]*|H2O|CO2|NaCl|CH4/i.test(content);

  return { hasMath, hasSupersub, hasChemical };
}
