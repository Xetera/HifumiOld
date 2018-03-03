export function codeBlock(message : string) : string {
    return '\`\`\`\n' + message + '\`\`\`';
}

export function underline(message : string ) : string {
    return '_' + message + '_';
}

export function bold(message : string ) : string {
    return '**' + message + '**';
}