const { promises } = require('fs');
const path = require('path');

class cssFile {
    label;
    containingFolder;
    sourcePath;
    constructor(label, containingFolder, sourcePath){
        this.label = label;
        this.containingFolder = containingFolder;
        this.sourcePath = sourcePath;
    }
}

async function getCssFiles() {
    let cssFiles = [];
    const items = await promises.readdir(path.join(__dirname, '../dist/global-assets/css')); 
    for(const item of items) {
        if(item.includes('css')){
            cssFiles.push(new cssFile(item, 'css', path.join(__dirname, `../dist/global-assets/css/${item}`)));
            continue;
        };
        const files = await promises.readdir(path.join(__dirname, `../dist/global-assets/css/${item}`));
        files.forEach((file) => {
            cssFiles.push(new cssFile(file, item, path.join(__dirname, `../dist/global-assets/css/${item}/${file}`)));
        });
    };
    console.log(cssFiles);
    return cssFiles;
}
getCssFiles();
module.exports = {getCssFiles};