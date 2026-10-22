export const data_generation = ( filesNumber ) => {
    const data = new Array(filesNumber);
    for(let i = 0; i < filesNumber; i++){
        data.push([`File number ${i} with data: Random thoughts on a thursday morning :)`])
    }

    return data;
}