const path = require('path');
const { promises } = require('fs');

class RouteRule {
  htmlRule(htmlPath) {
    this.route = htmlPath;
    this.dir = `./dist/html${htmlPath}`;
  }

  htmlRuleWithoutExt(htmlPath) {
    this.route = htmlPath.replace('.html', '');
    this.dir = `./dist/html${htmlPath}`;
  }

  imageRule(imagePath) {
    this.route = `/global-assets/imgs${imagePath}`;
    this.dir = `./src/global-assets/imgs${imagePath}`;
  }


  cssRules(stylePath) {
    this.route = `/global-assets/css${stylePath}`;
    this.dir = `./dist/global-assets/css${stylePath}`;
  }
}

async function getRules() {
    let rules = [];

    // html files
    let htmlRules = [];
    let folders = await promises.readdir(path.join(__dirname, './dist/html'));
    for(const folder of folders) {
        const files = await promises.readdir(path.join(__dirname, `./src/html/${folder}`));
        files.forEach((file) => {
            console.log(file);
            htmlRules.push(`/${folder}/${file}`);
        });
    };
    rules = rules.concat(htmlRules.map((pagePath) => {
        const getRule = new RouteRule();
        getRule.htmlRule(pagePath);
        return getRule;
    }));

    rules = rules.concat(htmlRules.map((pagePath) => {
        const getRule = new RouteRule();
        getRule.htmlRuleWithoutExt(pagePath);
        return getRule;
    }));

    // css files
    let cssRules = [];
    folders = await promises.readdir(path.join(__dirname, './dist/global-assets/css')); 
    for(const folder of folders) {
        if(folder.includes('css')){
            cssRules.push(`/${folder}`);
            continue;
        };
        const files = await promises.readdir(path.join(__dirname, `./dist/global-assets/css/${folder}`));
        files.forEach((file) => {
            console.log(file);
            cssRules.push(`/${folder}/${file}`);
        });
    };

    rules = rules.concat(cssRules.map((stylePath) => {
        const getRule = new RouteRule();
        getRule.cssRules(stylePath);
        return getRule;
    }));

    // images rules
    let imageRules = [];
    const images = await promises.readdir(path.join(__dirname, './src/global-assets/imgs'));
    images.forEach((image) => {
      imageRules.push(`/${image}`);
    });

    rules = rules.concat(imageRules.map((imagePath) => {
        const getRule = new RouteRule();
        getRule.imageRule(imagePath);
        return getRule;
    }));

  return rules;
}

module.exports = {
  getRules,
};
