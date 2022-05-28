export function splitArrayToChunks<T>(array: T[], length: number): T[][] {
    const chunks: T[][] = [];
    const count: number = Math.ceil(array.length / length);

    for (let i = 0; i < count; ++i) {
        chunks.push(array.splice(0, length));
    }

    return chunks;
}
