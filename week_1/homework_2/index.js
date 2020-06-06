const fs = require('fs');
const path = require('path');
const util = require('util');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const copyFile = util.promisify(fs.link);
const deleteFile = util.promisify(fs.unlink);
const deleteFolder = util.promisify(fs.rmdir);

let srcFolder;
let resultFolder;
let isSrcDelete;
let folders = [];

let findFolders = (srcFolder) => {
    let items = fs.readdirSync(srcFolder);
    
    items.forEach(item => {
        let itemPath = path.join(srcFolder, item);
        
        if (fs.statSync(itemPath).isDirectory()) {
            folders.push(itemPath);
            findFolders(itemPath);
        }
    })
}

let systemize = async () => {
    rl.question('Исходная папка: ', src => {
        if (!fs.existsSync(src)) {
            console.log('src folder does not exist.');
            process.exit();
        }
        srcFolder = path.normalize(src);
        folders.push(srcFolder)

        if (!fs.readdirSync(srcFolder).length) {
            console.log('src folder is empty');
            process.exit();
        }
    
        rl.question('Результирующая папка: ', dist => {
            resultFolder = path.normalize(dist);
    
            if (!fs.existsSync(resultFolder)) {
                fs.mkdirSync(resultFolder);
            }
    
            rl.question('Хотите удалить иходные папки и файлы? (yes/no) ', del => {
                isSrcDelete = del === 'yes' ? true : false;
                
                rl.close();

                findFolders(srcFolder);

                folders.sort((a, b) => b.split('\\').length - a.split('\\').length);

                folders.forEach(async folder => {
                    let files = fs.readdirSync(folder);

                    files.forEach(async file => {
                        let filePath = path.join(folder, file);

                        if (fs.statSync(filePath).isFile()) {
                            let newDir = path.join(resultFolder, path.parse(file).base[0].toUpperCase());

                            if (!fs.existsSync(newDir)) {
                                fs.mkdirSync(newDir)
                            }

                            try {
                                await copyFile(filePath, path.join(newDir, path.parse(file).base));
                                if (isSrcDelete) {
                                    await deleteFile(filePath);
                                    try {
                                        await deleteFolder(folder);  
                                    } catch (error) {
                                        //
                                    }    
                                }
                            } catch (error) {
                                console.log(error)
                            }
                        }
                    })
                })
            })
        })
    })
}

systemize()