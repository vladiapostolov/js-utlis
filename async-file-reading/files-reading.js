import fs from 'node:fs/promises'
import { data_generation } from './data_generation.js';
import { writeFile } from 'node:fs/promises';

const customAsyncFunctionFileGen = async (fileName, dataArray) => {
    await writeFile(fileName, dataArray.pop(), 'utf-8');
}

const handleFile = async(file, pos, combinedData) => {
    const handle = await fs.open(file);
            const {size} = await handle.stat();
            const out = Buffer.alloc(1);

            for(let i = 0; i < size; i++){
                await handle.read(out, 0, 1, pos);
                pos++;
                combinedData.push(out.toString());
            }

            await handle.close();
}

const files = [];
process.stdin.on('readable', data => {
    let chunk;
    while( (chunk = process.stdin.read() ) !== null )
        files.push(`files/${chunk.toString().slice(0, -1)}.txt`);
});

process.stdin.on('end', async () => {
    try{
        const dataArray = data_generation(files.length);

        await Promise.all(files.map(file => {
            return customAsyncFunctionFileGen(file, dataArray);
        }))

        const combinedData = new Array(files.reduce((sum, file) => sum+=file.length , 0))
        let pos = 0;
        await Promise.all(files.map(async (file) => {
            return handleFile(file, pos, combinedData);
        }))

        console.log(combinedData);
    }catch(e){
        console.log(e);
    }
})

