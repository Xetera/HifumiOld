export type CodeBlockLanguage =
    'asciidoc'|'autohotkey'|'bash'|'coffeescript'|
    'cpp'|'cs'|'css'|'diff'|'fix'|'glsl'|'html'|
    'ini'|'json'|'md'|'ml'|'prolog'|'python'|'py'|
    'tex'|'xl'|'xml'

export function codeBlock(message : string, language?:CodeBlockLanguage) : string {
    console.log(typeof message);
    const header : string = language ? `\`\`\`${language}\n` : '\`\`\`\n';
    return header + message.trim() + '\n\`\`\`';
}

export function underline(message : string ) : string {
    return '_' + message + '_';
}

export function bold(message : string ) : string {
    return '**' + message + '**';
}