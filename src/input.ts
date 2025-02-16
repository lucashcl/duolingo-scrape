export const input = async (prompt: string) => {
    process.stdout.write(prompt);
    for await (const line of console) {
        return line
    }
    return null
}