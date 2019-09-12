import fs from 'fs';

/**
 * 
 * Asyncronously iterate over an array
 * @example
 * const array: number[] = [1,2,3];
 * console.log(`This is just the beginning!`);
 * await asyncForEach(array, (element: number) => {
 *  console.log(`Iterating ${element}`);
 * });
 * console.log(`Done!`);
 * @param {Array.<any>} input - The input array in which to iterate over.
 * @param {any} next - The callback function to execute on each array element.
 * @returns {Promise<void>} Thenable/Awaitable void return
 */
export const asyncForEach = async (input: any[], next: any): Promise<void> => {
  for (let i = 0;i < input.length;i++) {
    await next(input[i], i, input);
  }
}

export class ElementAtPath {
    public name: string;
    public path: string;

}

/**
 * 
 * @param {string} directory - The path below the calling directory in which to search
 * @returns {Promise<ElementAtPath[]} - Thenable/Awaitable array of names and paths
 */
export const elementsAtPath = async (directory: string): Promise<ElementAtPath[]> => {
    const pathArray: ElementAtPath[] = [];

    fs.readdir(`${directory}`, async (error, items) => {
        if (error) return Promise.reject(error);
        
        await asyncForEach(items, async (item: string) => {
            const elementAtPath: ElementAtPath = {
                name: item.split(/(\.adapter\.ts)/)[0], 
                path: `${directory}/${item}`
            }
            pathArray.push(elementAtPath);
        });
        
    });
    console.log(pathArray);
    return Promise.resolve(pathArray);
}