const readline = require('readline');
const fs = require('fs');
const path = require('path');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let srcFolder;
let resultFolder;
let isSrcDelete;

rl.question('Исходная папка: ', src => {
    srcFolder = path.normalize(src);

    rl.question('Результирующая папка: ', dist => {
        resultFolder = path.normalize(dist);
        
        rl.question('Хотите удалить иходные папки и файлы? (yes/no) ', del => {
            isSrcDelete = del === 'yes' ? true : false;
            
            rl.close();
        
            let pathes = [srcFolder];
            
            let logPathes = (srcFolder) => {
                let items = fs.readdirSync(srcFolder);
            
                items.forEach(item => {
                    let itemPath = path.join(srcFolder, item);
                
                    if (fs.statSync(itemPath).isDirectory()) {
                        pathes.push(itemPath);
                        logPathes(itemPath);
                    } else {
                       pathes.push(itemPath);
                    }
                })
            }

            logPathes(srcFolder);

            pathes
                .sort((a, b) => b.split('\\').length - a.split('\\').length)
                .forEach(element => {
                    if (fs.statSync(element).isFile()) {
                        let newDir = path.join(resultFolder, path.parse(element).base[0].toUpperCase());
                                
                        if (!fs.existsSync(newDir)) {
                            fs.mkdirSync(newDir)
                        }
                            
                        fs.linkSync(element, path.join(newDir, path.parse(element).base))

                        if (isSrcDelete) {
                            fs.unlinkSync(element)  
                        }

                    } else {
                        if (isSrcDelete) {
                            fs.rmdirSync(element)  
                        }
                    }
                })
        })
    }) 
})
