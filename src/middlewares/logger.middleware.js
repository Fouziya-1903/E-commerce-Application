import fs from 'fs';

const fsPromise = fs.promises;

async function log(data) {
    try{
        const logData = `\n${new Date().toString()} - Log Data: ${JSON.stringify(data)}`;
        await fsPromise.appendFile('log.txt', logData);
    }catch(err){
        console.log(err); 
    }
}

const loggerMiddleware = async (req, res, next)=>{
    const bodyString = JSON.stringify(req.body);
    const infoToLog = `URL: ${req.url} - Log Data: ${bodyString}`;
    
    log(infoToLog);
    next();
};

export default loggerMiddleware;