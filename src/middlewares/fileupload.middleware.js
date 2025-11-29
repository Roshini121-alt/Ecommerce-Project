import multer from 'multer';

const storageConfig=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads/');
    },
    filename:(req,file,cb)=>{
        //here replace is used because : colon is not supported in windows so replace is used to replace all colons with _
        cb(null,new Date().toISOString().replace(/:/g,'_')+file.originalname);
    }
});

export const upload=multer({storage:storageConfig});
 