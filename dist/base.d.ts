export function wrapText(text: string, options?: {
    font?: string,
    fontKerning?: 'auto' | 'normal' | 'none',
    tabSize?: number,
    maxWidth?: number,
    maxLines?: number,
    etc?: string,
    indent?: number,
    lastIndent?: number,
    newlines?: 'collapse' | 'preserve',
    inlineSpaces?: 'collapse' | 'trim' | 'preserve',
}): {
    lines: string[][],
    font: string,
};

export function measureText(text: string, options?: {
    font?: string,
    fontKerning?: 'auto' | 'normal' | 'none',
    tabSize?: number,
}): TextMetrics;
