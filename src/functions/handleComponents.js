const fs = require('node:fs');

module.exports = (client) => {
    const { buttons, selectMenus, modals } = client;
    client.handleComponents = async() => {
        const componentFolders = fs.readdirSync("./src/components");

        for (const folder of componentFolders) {
            const componentFiles = fs.readdirSync(`./src/components/${folder}`).filter(file => file.endsWith(".js"));
            
            for (const file of componentFiles) {
                const component = require(`../components/${folder}/${file}`);

                if (folder == "buttons") {
                    buttons.set(component.data.name, component);
                }
                else if (folder == "modals") {
                    modals.set(component.data.name, component);
                }
                else if (folder == "selectMenus") {
                    selectMenus.set(component.data.name, component);
                }
                else {
                    console.log(`${folder} is not part of the current handled components`);
                }
            }
        }
    }
}