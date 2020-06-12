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
    if (!fs.existsSync(src)) {
        console.log('src folder does not exist.');
        process.exit();
    }
    srcFolder = path.normalize(src);

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
        
            let folders = [srcFolder];
            let files = [];

            let logPathes = (srcFolder) => {
                let items = fs.readdirSync(srcFolder);
            
                items.forEach(item => {
                    let itemPath = path.join(srcFolder, item);
                
                    if (fs.statSync(itemPath).isDirectory()) {
                        folders.push(itemPath);
                        logPathes(itemPath);
                    } else {
                       files.push(itemPath);
                    }
                })
            }

            logPathes(srcFolder);

            let foldersSorted = folders.sort((a, b) => b.split('\\').length - a.split('\\').length)
            let filesSorted = files.sort((a, b) => b.split('\\').length - a.split('\\').length)

            filesSorted
                .forEach(element => {
                    let newDir = path.join(resultFolder, path.parse(element).base[0].toUpperCase());
                                
                    if (!fs.existsSync(newDir)) {
                        fs.mkdirSync(newDir)
                    }
                            
                    fs.link(element, path.join(newDir, path.parse(element).base), err => {
                        if (err) {
                            console.log(err)
                        }

                        if (isSrcDelete) {
                            fs.unlink(element, err => {
                                if (err) {
                                    console.log(err)
                                }
    
                                foldersSorted
                                    .forEach(dir => {
                                        if (fs.existsSync(dir) && !fs.readdirSync(dir).length) {
                                            fs.rmdir(dir, err => {
                                                if (err) {
                                                    console.log(err)
                                                }
                                            })
                                        }        
                                    })
                            }) 
                        }
                    })
                })
        })
    }) 
})
